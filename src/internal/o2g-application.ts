/*
 * Copyright 2025 ALE International
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Subscription } from '../subscription';
import EventEmitter from 'events';
import { Routing } from '../services/o2g-routing';
import { Messaging } from '../services/o2g-messaging';
import { EventSink, IEventSink } from '../events/event-dispatcher';
import { EventSummary } from '../services/o2g-eventSummary';
import { Telephony } from '../services/o2g-telephony';
import { Users } from '../services/o2g-users';
import { Directory } from '../services/o2g-directory';
import { CommunicationLog } from '../services/o2g-comlog';
import { Analytics } from '../services/o2g-analytics';
import { CallCenterAgent } from '../services/o2g-cc-agent';
import { CallCenterPilot } from '../services/o2g-cc-pilot';
import { Maintenance } from '../services/o2g-maint';
import { Rsi } from '../services/o2g-rsi';
import { PbxManagement } from '../services/o2g-pbx-mngt';
import { PhoneSetProgramming } from '../services/o2g-phone-set-prog';
import { UsersManagement } from '../services/o2g-users-mngt';
import { CallCenterManagement } from '../services/o2g-cc-mngt';
import { Logger } from './util/logger';
import { ServerInfo } from './types/common/common-types';
import { OnChannelInformation } from '../types/events/events';
import { CallCenterRealtime } from '../services/o2g-cc-rt';
import { ServiceFactory } from './service-factory';
import { Session } from './session';
import { ServiceEndPoint } from './service-end-point';
import { CallCenterStatistics } from '../services/o2g-cc-stat';
import { ObjectsContainer, TYPES } from './util/injection-container';
import { SupervisedAccount } from '../supervised-account';
import { DefaultSessionMonitoringPolicy, SessionMonitoringPolicy, BehaviorAction } from '../session-monitoring-policy';
import { Host, O2GServers } from '../o2g-servers';

// ── Event name constants ──────────────────────────────────────────────────────

export const O2G_SESSION_LOST    = 'sessionLost';
export const O2G_RECONNECTED     = 'reconnected';

/**
 * Fired when the SDK switches to the secondary O2G server.
 * Only relevant when geographic redundancy is configured via {@link O2GServers}.
 */
export const O2G_SERVER_SWITCHED = 'serverSwitched';

// ── Backoff ───────────────────────────────────────────────────────────────────

// Delays in ms: 2s, 4s, 8s, 16s, capped at 30s
const BACKOFF_DELAYS = [2_000, 4_000, 8_000, 16_000, 30_000];

function getBackoffDelay(attempt: number): number {
    return BACKOFF_DELAYS[Math.min(attempt, BACKOFF_DELAYS.length - 1)];
}

// ── Application ───────────────────────────────────────────────────────────────

/** @internal */
export default class Application extends EventEmitter {
    #applicationName: string;
    #servers: O2GServers;
    #apiVersion: string;
    #serviceFactory!: ServiceFactory;
    #serverInfo!: ServerInfo;
    #session!: Session;
    #monitoringPolicy: SessionMonitoringPolicy = new DefaultSessionMonitoringPolicy();

    // Current host — switches to secondary on failover, stays there permanently
    #currentHost: Host;
    #usingSecondary = false;

    // Stored credentials and subscription for recovery
    #login!: string;
    #password!: string;
    #supervisedAccount: SupervisedAccount | null = null;
    #subscription: Subscription | null = null;

    // Guard against concurrent recovery attempts
    #recovering = false;

    static readonly O2G_ONCHANNEL_INFORMATION = 'OnChannelInformation';
    private static _logger = Logger.create('Application');

    constructor(applicationName: string, servers: O2GServers, apiVersion: string) {
        super();
        this.#applicationName = applicationName;
        this.#servers = servers;
        this.#apiVersion = apiVersion;
        this.#currentHost = servers.primaryHost;
    }

    /**
     * Sets the session monitoring policy. Must be called before login().
     */
    setMonitoringPolicy(policy: SessionMonitoringPolicy): void {
        this.#monitoringPolicy = policy;
    }

    /**
     * Returns the host the SDK is currently connected to.
     */
    get currentHost(): Host {
        return this.#currentHost;
    }

    async connect(): Promise<ServiceEndPoint> {
        this.#serviceFactory = new ServiceFactory(this.#apiVersion);
        this.#serverInfo = await this.#serviceFactory.bootstrap(this.#currentHost);
        return new ServiceEndPoint(this.#serviceFactory, this.#serverInfo);
    }

    async login(
        login: string,
        password: string,
        supervisedAccount: SupervisedAccount | null
    ): Promise<void> {
        this.#login = login;
        this.#password = password;
        this.#supervisedAccount = supervisedAccount;

        let attempt = 0;
        let session: Session | null = null;

        while (!session) {
            try {
                session = await this.#openSession();
            } catch (e) {
                const behavior = this.#monitoringPolicy.onConnectError(
                    e instanceof Error ? e : new Error(String(e))
                );

                if (behavior.action === BehaviorAction.Abort) {
                    Application._logger.error('Initial connection aborted by monitoring policy.');
                    throw e;
                }

                this.#checkFailover();

                const delay = behavior.delayMs > 0 ? behavior.delayMs : 5_000;
                Application._logger.error(
                    `Connection attempt ${attempt + 1} failed. Retrying in ${delay}ms...`
                );
                await sleep(delay);
                attempt++;
            }
        }

        this.#session = session;
        const eventRegistry: IEventSink = ObjectsContainer.get<EventSink>(TYPES.EventSink);
        eventRegistry.register(this, Application.O2G_ONCHANNEL_INFORMATION, OnChannelInformation);
    }

    async subscribe(subscription: Subscription): Promise<void> {
        this.#subscription = subscription;
        await this.#listenEvents(this.#session, subscription);
    }

    async close(): Promise<void> {
        if (this.#session) {
            await this.#session.close();
        }
    }

    // ── Failover ──────────────────────────────────────────────────────────

    /**
     * Switches to the secondary server if the primary has failed and geographic
     * HA is configured. Once switched to secondary, stays there permanently.
     */
    #checkFailover(): void {
        if (!this.#servers.hasSecondary) return;
        if (this.#usingSecondary) return;  // already on secondary — stay there permanently

        Application._logger.warn(
            'Primary server unreachable. Switching to secondary permanently.'
        );
        this.emit(O2G_SERVER_SWITCHED, {
            from: this.#servers.primaryHost,
            to: this.#servers.secondaryHost,
        });
        this.#currentHost = this.#servers.secondaryHost!;
        this.#usingSecondary = true;
    }

    // ── Recovery ──────────────────────────────────────────────────────────

    async #onSessionLost(reason: string): Promise<void> {
        if (this.#recovering) {
            Application._logger.debug(
                `Session lost signal ignored (recovery already in progress): ${reason}`
            );
            return;
        }

        this.#recovering = true;
        Application._logger.error(`Session lost: ${reason}. Starting recovery.`);
        this.emit(O2G_SESSION_LOST, { reason });

        let attempt = 0;
        let recovered = false;

        while (!recovered) {
            this.#checkFailover();

            const delay = getBackoffDelay(attempt);
            Application._logger.debug(`Recovery attempt ${attempt + 1} in ${delay}ms...`);
            await sleep(delay);

            try {
                const session = await this.#openSession();
                if (session) {
                    this.#session = session;

                    if (this.#subscription) {
                        try {
                            await this.#listenEvents(this.#session, this.#subscription);
                        } catch (e) {
                            Application._logger.error('Recovery: re-subscription failed:', e);
                            // Session is valid even if re-subscription fails
                        }
                    }

                    recovered = true;
                    this.#recovering = false;
                    Application._logger.info('Recovery successful.');
                    this.emit(O2G_RECONNECTED);
                }
            } catch (e) {
                Application._logger.error(`Recovery attempt ${attempt + 1} failed:`, e);
                attempt++;
            }
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    /**
     * Starts eventing on the given session for the given subscription.
     * - Webhook mode: delegates directly, no channel confirmation needed.
     * - Chunk mode: waits for OnChannelInformation before returning, mirroring
     *   the Java EventSubscriptionManager semaphore pattern so that no events
     *   are missed between subscription creation and chunk establishment.
     */
    async #listenEvents(session: Session, subscription: Subscription): Promise<void> {
        if (subscription.webHook) {
            // Webhook mode — no chunk channel, no OnChannelInformation to wait for
            await session.listenEvents(subscription);
        } else {
            // Chunk mode — wait for OnChannelInformation before returning
            await new Promise<void>((resolve) => {
                this.once(Application.O2G_ONCHANNEL_INFORMATION, () => resolve());
                session.listenEvents(subscription);
            });
        }
    }

    async #openSession(): Promise<Session> {
        const serviceEndPoint: ServiceEndPoint = await this.connect();
        const session = await serviceEndPoint.openSession(
            this.#login,
            this.#password,
            this.#applicationName,
            this.#supervisedAccount,
            this.#monitoringPolicy
        );

        session.setOnSessionLost((reason) => {
            this.#onSessionLost(reason);
        });

        return session;
    }

    // ── Service getters ───────────────────────────────────────────────────

    getRoutingService(): Routing { return this.#session.getRoutingService(); }
    getEventSummaryService(): EventSummary { return this.#session.getEventSummaryService(); }
    getTelephonyService(): Telephony { return this.#session.getTelephonyService(); }
    getUsersService(): Users { return this.#session.getUsersService(); }
    getUserManagementService(): UsersManagement { return this.#session.getUsersManagementService(); }
    getDirectoryService(): Directory { return this.#session.getDirectoryService(); }
    getCommunicationLogService(): CommunicationLog { return this.#session.getCommunicationLogService(); }
    getAnalyticsService(): Analytics { return this.#session.getAnalyticsService(); }
    getCallCenterAgentService(): CallCenterAgent { return this.#session.getCallCenterAgentService(); }
    getCallCenterPilotService(): CallCenterPilot { return this.#session.getCallCenterPilotService(); }
    getCallCenterRealtimeService(): CallCenterRealtime { return this.#session.getCallCenterRealtimeService(); }
    getCallCenterStatisticsService(): CallCenterStatistics { return this.#session.getCallCenterStatisticsService(); }
    getCallCenterManagementService(): CallCenterManagement { return this.#session.getCallCenterManagementService(); }
    getMaintenanceService(): Maintenance { return this.#session.getMaintenanceService(); }
    getRsiService(): Rsi { return this.#session.getRsiService(); }
    getPbxManagementService(): PbxManagement { return this.#session.getPbxManagementService(); }
    getPhoneSetProgrammingService(): PhoneSetProgramming { return this.#session.getPhoneSetProgrammingService(); }
    getMessagingService(): Messaging { return this.#session.getMessagingService(); }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}