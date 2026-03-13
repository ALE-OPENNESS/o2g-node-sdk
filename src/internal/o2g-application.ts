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

import { Subscription } from '../subscription';
import EventEmitter from 'events';
import { Routing } from '../o2g-routing';
import { Messaging } from '../o2g-messaging';
import { EventSink, IEventSink } from './events/event-dispatcher';
import { EventSummary } from '../o2g-eventSummary';
import { Telephony } from '../o2g-telephony';
import { Users } from '../o2g-users';
import { Directory } from '../o2g-directory';
import { CommunicationLog } from '../o2g-comlog';
import { Analytics } from '../o2g-analytics';
import { CallCenterAgent } from '../o2g-cc-agent';
import { CallCenterPilot } from '../o2g-cc-pilot';
import { Maintenance } from '../o2g-maint';
import { Rsi } from '../o2g-rsi';
import { PbxManagement } from '../o2g-pbx-mngt';
import { PhoneSetProgramming } from '../o2g-phone-set-prog';
import { UsersManagement } from '../o2g-users-mngt';
import { CallCenterManagement } from '../o2g-cc-mngt';
import { Logger } from './util/logger';
import { ServerInfo } from './types/common/common-types';
import { OnChannelInformation } from '../types/events/events';
import { CallCenterRealtime } from '../o2g-cc-rt';
import { ServiceFactory } from './service-factory';
import { Session } from './session';
import { ServiceEndPoint } from './service-end-point';
import { CallCenterStatistics } from '../o2g-cc-stat';
import { ObjectsContainer, TYPES } from './util/injection-container';
import { SupervisedAccount } from '../supervised-account';
import { Host } from '../host';

/**
 * Class Application represents an O2G application.
 */
/** @internal */
export default class Application extends EventEmitter {
    #applicationName: string;
    #host: Host;
    #apiVersion: string;
    #serviceFactory!: ServiceFactory;
    #serverInfo!: ServerInfo;
    #session!: Session;

    static readonly O2G_ONCHANNEL_INFORMATION = 'OnChannelInformation';

    private static _logger = Logger.create('Application');

    constructor(applicationName: string, host: Host, apiVersion: string) {
        super();
        this.#applicationName = applicationName;
        this.#host = host;
        this.#apiVersion = apiVersion;
    }

    async connect(): Promise<ServiceEndPoint> {
        const { privateAddress, publicAddress } = this.#host;

        if (!privateAddress && !publicAddress) {
            throw new Error('Either privateAddress or publicAddress must be provided.');
        }

        this.#serviceFactory = new ServiceFactory(this.#apiVersion);
        this.#serverInfo = await this.#serviceFactory.bootstrap(this.#host);

        return new ServiceEndPoint(this.#serviceFactory, this.#serverInfo);
    }

    getRoutingService(): Routing {
        return this.#session.getRoutingService();
    }

    getEventSummaryService(): EventSummary {
        return this.#session.getEventSummaryService();
    }

    getTelephonyService(): Telephony {
        return this.#session.getTelephonyService();
    }

    getUsersService(): Users {
        return this.#session.getUsersService();
    }

    getUserManagementService(): UsersManagement {
        return this.#session.getUsersManagementService();
    }

    getDirectoryService(): Directory {
        return this.#session.getDirectoryService();
    }

    getCommunicationLogService(): CommunicationLog {
        return this.#session.getCommunicationLogService();
    }

    getAnalyticsService(): Analytics {
        return this.#session.getAnalyticsService();
    }

    getCallCenterAgentService(): CallCenterAgent {
        return this.#session.getCallCenterAgentService();
    }

    getCallCenterPilotService(): CallCenterPilot {
        return this.#session.getCallCenterPilotService();
    }

    getCallCenterRealtimeService(): CallCenterRealtime {
        return this.#session.getCallCenterRealtimeService();
    }

    getCallCenterStatisticsService(): CallCenterStatistics {
        return this.#session.getCallCenterStatisticsService();
    }

    getCallCenterManagementService(): CallCenterManagement {
        return this.#session.getCallCenterManagementService();
    }

    getMaintenanceService(): Maintenance {
        return this.#session.getMaintenanceService();
    }

    getRsiService(): Rsi {
        return this.#session.getRsiService();
    }

    getPbxManagementService(): PbxManagement {
        return this.#session.getPbxManagementService();
    }

    getPhoneSetProgrammingService(): PhoneSetProgramming {
        return this.#session.getPhoneSetProgrammingService();
    }

    getMessagingService(): Messaging {
        return this.#session.getMessagingService();
    }

    async login(login: string, password: string, supervisedAccount: SupervisedAccount | null): Promise<void> {
        const serviceEndPoint: ServiceEndPoint = await this.connect();

        const session = await serviceEndPoint.openSession(login, password, this.#applicationName, supervisedAccount);
        if (session) {
            this.#session = session;

            // register for event
            const eventRegistry: IEventSink = ObjectsContainer.get<EventSink>(TYPES.EventSink);
            eventRegistry.register(this, Application.O2G_ONCHANNEL_INFORMATION, OnChannelInformation);
        } else {
            throw new Error('Login failed: session could not be opened.');
        }
    }

    async subscribe(subscription: Subscription): Promise<void> {
        await this.#session.listenEvents(subscription);
    }

    async close(): Promise<void> {
        if (this.#session) {
            await this.#session.close();
        }
    }
}
