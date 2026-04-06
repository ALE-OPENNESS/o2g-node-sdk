/*
 * Copyright 2021 ALE International
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
import { Routing } from '../services/o2g-routing';
import { EventSummary } from '../services/o2g-eventSummary';
import { Directory } from '../services/o2g-directory';
import { Users } from '../services/o2g-users';
import { Telephony } from '../services/o2g-telephony';
import { Analytics } from '../services/o2g-analytics';
import { Maintenance } from '../services/o2g-maint';
import { AccessMode } from './access-mode';
import ChunkEventing from '../events/chunk-eventing';
import { CommunicationLog } from '../services/o2g-comlog';
import { CallCenterAgent } from '../services/o2g-cc-agent';
import { CallCenterPilot } from '../services/o2g-cc-pilot';
import { Rsi } from '../services/o2g-rsi';
import { PbxManagement } from '../services/o2g-pbx-mngt';
import { PhoneSetProgramming } from '../services/o2g-phone-set-prog';
import { Messaging } from '../services/o2g-messaging';
import { Subscription, WebHook } from '../subscription';
import { IEventSink } from '../events/event-dispatcher';
import { UsersManagement } from '../services/o2g-users-mngt';
import { Logger } from './util/logger';
import { AssertUtil } from './util/assert';
import { CallCenterManagement } from '../services/o2g-cc-mngt';
import { SessionInfo, SubscriptionResult } from './types/common/common-types';
import { CallCenterRealtime } from '../services/o2g-cc-rt';
import { ServiceFactory } from './service-factory';
import { CallCenterStatistics } from '../services/o2g-cc-stat';
import { ObjectsContainer, TYPES } from './util/injection-container';
import { EventDispatcher } from '../types/events/events';
import { BehaviorAction, SessionMonitoringPolicy } from '../session-monitoring-policy';


/** @internal */
export class Session {
    #serviceFactory: ServiceFactory;
    #sessionInfo: SessionInfo;
    #loginName!: string;
    #keepAliveID: ReturnType<typeof setTimeout> | undefined;
    #subscriptionId!: string;
    #chunkEventing!: ChunkEventing;
    #monitoringPolicy: SessionMonitoringPolicy;
    #onSessionLostCallback: ((reason: string) => void) | undefined;

    #logger = Logger.create('Session');

    constructor(
        serviceFactory: ServiceFactory,
        sessionInfo: SessionInfo,
        login: string,
        monitoringPolicy: SessionMonitoringPolicy
    ) {
        this.#serviceFactory = serviceFactory;
        this.#sessionInfo = sessionInfo;
        this.#loginName = login;
        this.#monitoringPolicy = monitoringPolicy;

        this.startKeepAlive();
    }

    /**
     * Registers the callback invoked when the session is lost.
     * Called by Application after creating the Session so that
     * recovery can be coordinated at the Application level.
     */
    setOnSessionLost(callback: (reason: string) => void): void {
        this.#onSessionLostCallback = callback;
    }

    // ── Service getters ───────────────────────────────────────────────────

    getRoutingService(): Routing {
        return new Routing(
            this.#serviceFactory.getRoutingService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getEventSummaryService(): EventSummary {
        return new EventSummary(
            this.#serviceFactory.getEventSummaryService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getUsersService(): Users {
        return new Users(
            this.#serviceFactory.getUsersService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getUsersManagementService(): UsersManagement {
        return new UsersManagement(this.#serviceFactory.getUsersManagementService());
    }

    getTelephonyService(): Telephony {
        return new Telephony(
            this.#serviceFactory.getTelephonyService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getDirectoryService(): Directory {
        return new Directory(this.#serviceFactory.getDirectoryService());
    }

    getCommunicationLogService(): CommunicationLog {
        return new CommunicationLog(
            this.#serviceFactory.getCommunicationLogService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getAnalyticsService(): Analytics {
        return new Analytics(this.#serviceFactory.getAnalyticsService());
    }

    getCallCenterAgentService(): CallCenterAgent {
        return new CallCenterAgent(
            this.#serviceFactory.getCallCenterAgentService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getCallCenterPilotService(): CallCenterPilot {
        return new CallCenterPilot(
            this.#serviceFactory.getCallCenterPilotService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getCallCenterRealtimeService(): CallCenterRealtime {
        return new CallCenterRealtime(
            this.#serviceFactory.getCallCenterRealtimeService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getCallCenterStatisticsService(): CallCenterStatistics {
        return new CallCenterStatistics(this.#serviceFactory.getCallCenterStatisticsService());
    }

    getCallCenterManagementService(): CallCenterManagement {
        return new CallCenterManagement(this.#serviceFactory.getCallCenterManagementService());
    }

    getMaintenanceService(): Maintenance {
        return new Maintenance(
            this.#serviceFactory.getMaintenanceService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getRsiService(): Rsi {
        return new Rsi(
            this.#serviceFactory.getRsiService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getPbxManagementService(): PbxManagement {
        return new PbxManagement(
            this.#serviceFactory.getPbxManagementService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getPhoneSetProgrammingService(): PhoneSetProgramming {
        return new PhoneSetProgramming(this.#serviceFactory.getPhoneSetProgrammingService());
    }

    getMessagingService(): Messaging {
        return new Messaging(this.#serviceFactory.getMessagingService());
    }

    // ── Keep-alive ────────────────────────────────────────────────────────

    private startKeepAlive(): void {
        const keepAlive_ms = this.#sessionInfo.timeToLive * 900;
        this.#logger.debug(`Keep-alive period: ${keepAlive_ms}ms`);
        this.#scheduleKeepAlive(keepAlive_ms);
    }

    #scheduleKeepAlive(delayMs: number): void {
        this.#keepAliveID = setTimeout(() => {
            this.#sendKeepAlive();
        }, delayMs);
    }

    async #sendKeepAlive(): Promise<void> {
        this.#logger.debug('Send keep-alive');

        try {
            const sessionService = this.#serviceFactory.getSessionsService();
            const ok = await sessionService.keepAlive();

            if (ok) {
                this.#logger.debug('Keep-alive acknowledged.');
                this.#monitoringPolicy.onKeepAliveDone();
                this.#scheduleKeepAlive(this.#sessionInfo.timeToLive * 900);
            } else {
                // Server returned HTTP error — session is definitively gone
                this.#logger.error('Keep-alive rejected by server — session is gone.');
                this.#monitoringPolicy.onKeepAliveFatalError();
                this.#onSessionLost('keepalive-rejected');
            }
        } catch (e) {
            // Network-level failure — consult policy
            this.#logger.error('Keep-alive network error:', e);
            const behavior = this.#monitoringPolicy.onKeepAliveError(e as Error);

            if (behavior.action === BehaviorAction.Abort) {
                this.#logger.debug('Keep-alive aborted by policy.');
                this.#onSessionLost('keepalive-error');
            } else {
                const retryDelay = behavior.delayMs > 0
                    ? behavior.delayMs
                    : this.#sessionInfo.timeToLive * 900;
                this.#logger.debug(`Keep-alive retry in ${retryDelay}ms`);
                this.#scheduleKeepAlive(retryDelay);
            }
        }
    }

    // ── Session lost ──────────────────────────────────────────────────────

    #onSessionLost(reason: string): void {
        this.#logger.error(`Session lost: ${reason}`);

        // Stop keep-alive to prevent further attempts
        if (this.#keepAliveID) {
            clearTimeout(this.#keepAliveID);
            this.#keepAliveID = undefined;
        }

        // Stop chunk eventing to prevent reconnect loops on a dead session
        if (this.#chunkEventing) {
            this.#chunkEventing.stop();
        }

        // Notify Application so it can drive recovery
        this.#onSessionLostCallback?.(reason);
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────

    async close(): Promise<void> {
        if (this.#keepAliveID) {
            clearTimeout(this.#keepAliveID);
            this.#keepAliveID = undefined;
        }

        if (this.#chunkEventing) {
            this.#chunkEventing.stop();
        }

        const sessionService = this.#serviceFactory.getSessionsService();
        await sessionService.close();

        this.#logger.info('Session is closed.');
    }

    async listenEvents(subscription: Subscription): Promise<void> {
        await this.#startEventing(AssertUtil.notNull(subscription, 'subscription'));
    }

    // ── Eventing ──────────────────────────────────────────────────────────

    async #startEventing(subscription: Subscription): Promise<void> {
        const subscriptionsService = this.#serviceFactory.getSubscriptionService();
        const subscriptionResult: SubscriptionResult =
            await subscriptionsService.create(subscription);

        if (!subscriptionResult || subscriptionResult.status !== 'ACCEPTED') {
            const reason = subscriptionResult ? subscriptionResult.status : 'Unknown';
            this.#logger.error('Subscription has been refused. Fix the subscription request.');
            throw new Error(`Subscription has been refused: ${reason}`);
        }

        this.#subscriptionId = subscriptionResult.subscriptionId;
        this.#logger.debug('Subscription has been accepted.');

        const webHook: WebHook | null = subscription.webHook;
        if (webHook) {
            this.#logger.info(`Start eventing on webhook mode on: ${webHook.url}`);
            const eventDispatcher: EventDispatcher =
                ObjectsContainer.get<IEventSink>(TYPES.EventSink);
            webHook.connectDispatcher(eventDispatcher);
        } else {
            this.#logger.info('Start eventing on chunk mode.');

            const pollingUrl =
                this.#serviceFactory.accessMode === AccessMode.Private
                    ? subscriptionResult.privatePollingUrl
                    : subscriptionResult.publicPollingUrl;

            const eventSink = ObjectsContainer.get<IEventSink>(TYPES.EventSink);

            // Pass policy and #onSessionLost so ChunkEventing can signal
            // session loss and respect retry behavior
            this.#chunkEventing = new ChunkEventing(
                pollingUrl,
                eventSink,
                this.#monitoringPolicy,
                (reason) => this.#onSessionLost(reason)
            );
            this.#chunkEventing.start();

            this.#logger.info('Eventing is started.');
        }
    }
}