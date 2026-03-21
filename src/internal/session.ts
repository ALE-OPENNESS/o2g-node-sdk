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
import { Routing } from '../o2g-routing';
import { EventSummary } from '../o2g-eventSummary';
import { Directory } from '../o2g-directory';
import { Users } from '../o2g-users';
import { Telephony } from '../o2g-telephony';
import { Analytics } from '../o2g-analytics';
import { Maintenance } from '../o2g-maint';
import { AccessMode } from './access-mode';
import ChunkEventing from './events/chunk-eventing';
import { CommunicationLog } from '../o2g-comlog';
import { CallCenterAgent } from '../o2g-cc-agent';
import { CallCenterPilot } from '../o2g-cc-pilot';
import { Rsi } from '../o2g-rsi';
import { PbxManagement } from '../o2g-pbx-mngt';
import { PhoneSetProgramming } from '../o2g-phone-set-prog';
import { Messaging } from '../o2g-messaging';
import { Subscription, WebHook } from '../subscription';
import { EventDispatcher, IEventSink } from './events/event-dispatcher';
import { UsersManagement } from '../o2g-users-mngt';
import { Logger } from './util/logger';
import { AssertUtil } from './util/assert';
import { CallCenterManagement } from '../o2g-cc-mngt';
import { SessionInfo, SubscriptionResult } from './types/common/common-types';
import { CallCenterRealtime } from '../o2g-cc-rt';
import { ServiceFactory } from './service-factory';
import { CallCenterStatistics } from '../o2g-cc-stat';
import { ObjectsContainer, TYPES } from './util/injection-container';

/** @internal */
export class Session {
    #serviceFactory: ServiceFactory;
    #sessionInfo: SessionInfo;
    #loginName!: string;
    #keepAliveID!: ReturnType<typeof setTimeout>;
    #subscriptionId!: string;
    #chunkEventing!: ChunkEventing;

    #logger = Logger.create('Session');

    constructor(serviceFactory: ServiceFactory, sessionInfo: SessionInfo, login: string) {
        this.#serviceFactory = serviceFactory;
        this.#sessionInfo = sessionInfo;
        this.#loginName = login;

        this.startKeepAlive();
    }

    getRoutingService(): Routing {
        return new Routing(this.#serviceFactory.getRoutingService(), ObjectsContainer.get<IEventSink>(TYPES.EventSink));
    }

    getEventSummaryService(): EventSummary {
        return new EventSummary(
            this.#serviceFactory.getEventSummaryService(),
            ObjectsContainer.get<IEventSink>(TYPES.EventSink)
        );
    }

    getUsersService(): Users {
        return new Users(this.#serviceFactory.getUsersService(), ObjectsContainer.get<IEventSink>(TYPES.EventSink));
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
        return new Rsi(this.#serviceFactory.getRsiService(), ObjectsContainer.get<IEventSink>(TYPES.EventSink));
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

    private startKeepAlive() {
        const keepAlive_ms = this.#sessionInfo.timeToLive * 900;
        this.#logger.debug(`Keep Alive: ${keepAlive_ms}`);

        this.#keepAliveID = setInterval(() => {
            this.#logger.debug('Send Keep Alive');
            var sessionService = this.#serviceFactory.getSessionsService();
            sessionService.keepAlive();
        }, keepAlive_ms);
    }

    async close() {
        if (this.#keepAliveID) {
            clearTimeout(this.#keepAliveID);
        }

        let sessionService = this.#serviceFactory.getSessionsService();
        await sessionService.close();

        this.#logger.info('Session is closed.');
    }

    async listenEvents(subscription: Subscription) {
        await this._startEventing(AssertUtil.notNull(subscription, 'subscription'));
    }

    private async _startEventing(subscription: Subscription): Promise<void> {
        const subscriptionsService = this.#serviceFactory.getSubscriptionService();
        const subscriptionResult: SubscriptionResult = await subscriptionsService.create(subscription);

        const eventSink = ObjectsContainer.get<IEventSink>(TYPES.EventSink);

        if (!subscriptionResult || subscriptionResult.status != 'ACCEPTED') {
            const reason = subscriptionResult ? subscriptionResult.status : 'Unknown';
            this.#logger.error('Subscription has been refused. Fix the subscription request.');
            throw new Error(`Subscription has been refused: ${reason}`);
        }

        this.#subscriptionId = subscriptionResult.subscriptionId;
        this.#logger.debug('Subscription has been accepted.');

        // check the eventing:
        const webHook: WebHook | null = subscription.webHook;
        if (webHook) {
            this.#logger.info(`Start eventing on webhook mode on : ${webHook.url}`);

            const eventDispatcher: EventDispatcher = ObjectsContainer.get<IEventSink>(TYPES.EventSink);
            webHook.connectDispatcher(eventDispatcher);
        } 
        else {
            this.#logger.info('Start eventing on chunk mode.');

            const pollingUrl =
                this.#serviceFactory.accessMode === AccessMode.Private
                    ? subscriptionResult.privatePollingUrl
                    : subscriptionResult.publicPollingUrl;

            this.#chunkEventing = new ChunkEventing(pollingUrl, eventSink);
            this.#chunkEventing.start();

            this.#logger.info('Eventing is started.');
        }
    }
}
