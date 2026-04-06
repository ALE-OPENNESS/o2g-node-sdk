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

import O2GRest from './rest/o2g-rest';
import AuthenticationRest from './rest/authentication-rest';
import SessionsRest from './rest/sessions-rest';
import RoutingRest from './rest/routing-rest';
import EventSummaryRest from './rest/eventSummary-rest';
import CallCenterAgentRest from './rest/ccAgent-rest';
import CallCenterPilotRest from './rest/ccPilot-rest';
import UsersRest from './rest/users-rest';
import TelephonyRest from './rest/telephony-rest';
import DirectoryRest from './rest/directory-rest';
import SubscriptionsRest from './rest/subscriptions-rest';
import CommunicationLogRest from './rest/comlog-rest';
import AnalyticsRest from './rest/analytics-rest';
import MaintenanceRest from './rest/maint-rest';
import RsiRest from './rest/rsi-rest';
import PbxManagementRest from './rest/pbx-mngt-rest';
import UtilUri from './util/util-uri';
import { AccessMode } from './access-mode';
import PhoneSetProgrammingRest from './rest/phone-set-prog-rest';
import MessagingRest from './rest/messaging-rest';
import { RestService } from './rest/rest-service';
import UsersManagementRest from './rest/users-mngt-rest';
import CallCenterManagementRest from './rest/ccMngt-rest';
import { Logger } from './util/logger';
import { RoxeRestApiDescriptor, ServerInfo, SessionInfo, Version } from './types/common/common-types';
import CallCenterRealtimeRest from './rest/ccRealtime-rest';
import CallCenterStatisticsRest from './rest/ccStatistics-rest';
import HttpClient from './util/http-client';
import { ObjectsContainer, TYPES } from './util/injection-container';
import { IEventSink } from '../events/event-dispatcher';
import { Host } from '../o2g-servers';

/** @internal */
class O2GService {
    #value: string;

    static #map: Map<string, O2GService> = new Map<string, O2GService>();

    static registerService(service: O2GService): O2GService {
        this.#map.set(service.#value, service);
        return service;
    }

    constructor(name: string) {
        this.#value = name;
    }

    static get(name: string): O2GService {
        var lower = name.toLowerCase();

        if (this.#map.has(lower)) {
            return this.#map.get(lower)!;
        } else {
            return new O2GService(lower);
        }
    }

    static O2G = O2GService.registerService(new O2GService('O2G'));
    static Authentication = O2GService.registerService(new O2GService('authenticate'));
    static Sessions = O2GService.registerService(new O2GService('sessions'));
    static Subscriptions = O2GService.registerService(new O2GService('subscriptions'));
    static EventSummary = O2GService.registerService(new O2GService('eventsummary'));
    static Telephony = O2GService.registerService(new O2GService('telephony'));
    static Users = O2GService.registerService(new O2GService('users'));
    static UsersManagement = O2GService.registerService(new O2GService('usermanagement'));
    static Routing = O2GService.registerService(new O2GService('routing'));
    static Messaging = O2GService.registerService(new O2GService('voicemail'));
    static Maintenance = O2GService.registerService(new O2GService('maintenance'));
    static Directory = O2GService.registerService(new O2GService('directory'));
    static PbxManagement = O2GService.registerService(new O2GService('pbxmanagement'));
    static CommunicationLog = O2GService.registerService(new O2GService('comlog'));
    static PhoneSetProgramming = O2GService.registerService(new O2GService('phonesetprogramming'));
    static CallCenterPilot = O2GService.registerService(new O2GService('acdpilotmonitoring'));
    static CallCenterAgent = O2GService.registerService(new O2GService('acdagent'));
    static CallCenterRsi = O2GService.registerService(new O2GService('acdrsi'));
    static CallCenterManagement = O2GService.registerService(new O2GService('acdmanagement'));
    static CallCenterRealtime = O2GService.registerService(new O2GService('acdrealtime'));
    static CallCenterStatistics = O2GService.registerService(new O2GService('acd statistics'));
    static Analytics = O2GService.registerService(new O2GService('analytics'));
}

/** @internal */
export class ServiceFactory {
    #apiVersion: string;

    #_httpClient = new HttpClient();

    #logger = Logger.create('ServiceFactory');
    #services: Map<O2GService, any> = new Map<O2GService, any>();
    #servicesUri: Map<O2GService, string> = new Map<O2GService, string>();

    #accessMode: AccessMode = AccessMode.Private;
    ApiVersion: string | null = null;

    constructor(version: string) {
        this.#apiVersion = version;
    }

    get accessMode(): AccessMode {
        return this.#accessMode;
    }

    private throwUnableToConnect(host: { privateAddress?: string; publicAddress?: string }): never | void {
        if (host.privateAddress && host.publicAddress) {
            throw new Error(`[${host.privateAddress}, ${host.publicAddress}]`);
        } else if (host.privateAddress) {
            throw new Error(`[${host.privateAddress}]`);
        } else {
            throw new Error(`[${host.publicAddress}]`);
        }
    }

    setO2GServiceUri(address: string): void {
        if (this.#servicesUri.has(O2GService.O2G)) {
            this.#servicesUri.delete(O2GService.O2G);
            this.#services.delete(O2GService.O2G);
        }
        this.#servicesUri.set(O2GService.O2G, 'https://' + address + '/api/rest');
    }

    getOrCreate(serviceName: O2GService, restService: typeof RestService) {
        if (!this.#servicesUri.has(serviceName)) {
            return undefined;
        }

        let service = this.#services.get(serviceName);
        if (!service) {
            service = new restService(this.#servicesUri.get(serviceName)!, this.#_httpClient);
            this.#services.set(serviceName, service);
        }

        return service;
    }

    getSubscriptionService() {
        return this.getOrCreate(O2GService.Subscriptions, SubscriptionsRest);
    }

    getO2GService() {
        return this.getOrCreate(O2GService.O2G, O2GRest);
    }

    getAuthenticationService() {
        return this.getOrCreate(O2GService.Authentication, AuthenticationRest);
    }

    getSessionsService() {
        return this.getOrCreate(O2GService.Sessions, SessionsRest);
    }

    getEventSummaryService() {
        return this.getOrCreate(O2GService.EventSummary, EventSummaryRest);
    }

    getRoutingService() {
        return this.getOrCreate(O2GService.Routing, RoutingRest);
    }

    getUsersService() {
        return this.getOrCreate(O2GService.Users, UsersRest);
    }

    getUsersManagementService() {
        return this.getOrCreate(O2GService.UsersManagement, UsersManagementRest);
    }

    getTelephonyService() {
        return this.getOrCreate(O2GService.Telephony, TelephonyRest);
    }

    getDirectoryService() {
        return this.getOrCreate(O2GService.Directory, DirectoryRest);
    }

    getCommunicationLogService() {
        return this.getOrCreate(O2GService.CommunicationLog, CommunicationLogRest);
    }

    getAnalyticsService() {
        return this.getOrCreate(O2GService.Analytics, AnalyticsRest);
    }

    getCallCenterAgentService() {
        return this.getOrCreate(O2GService.CallCenterAgent, CallCenterAgentRest);
    }

    getCallCenterPilotService() {
        return this.getOrCreate(O2GService.CallCenterPilot, CallCenterPilotRest);
    }

    getCallCenterManagementService() {
        return this.getOrCreate(O2GService.CallCenterManagement, CallCenterManagementRest);
    }

    getCallCenterRealtimeService() {
        return this.getOrCreate(O2GService.CallCenterRealtime, CallCenterRealtimeRest);
    }

    // Specific implementation to pass the eventRegistry
    getCallCenterStatisticsService() {
        if (!this.#servicesUri.has(O2GService.CallCenterStatistics)) {
            return undefined;
        }

        let service = this.#services.get(O2GService.CallCenterStatistics);
        if (!service) {
            service = new CallCenterStatisticsRest(
                this.#servicesUri.get(O2GService.CallCenterStatistics)!,
                this.#_httpClient,
                ObjectsContainer.get<IEventSink>(TYPES.EventSink)
            );
            this.#services.set(O2GService.CallCenterStatistics, service);
        }

        return service;
    }

    getMaintenanceService() {
        return this.getOrCreate(O2GService.Maintenance, MaintenanceRest);
    }

    getRsiService() {
        return this.getOrCreate(O2GService.CallCenterRsi, RsiRest);
    }

    getPbxManagementService() {
        return this.getOrCreate(O2GService.PbxManagement, PbxManagementRest);
    }

    getPhoneSetProgrammingService() {
        return this.getOrCreate(O2GService.PhoneSetProgramming, PhoneSetProgrammingRest);
    }

    getMessagingService() {
        return this.getOrCreate(O2GService.Messaging, MessagingRest);
    }

    // Bootstrap on the specified address
    // Try to get the O2G info
    bootstrapAddress(address: string) {
        // Init the O2G service address
        this.setO2GServiceUri(address);

        // Try to get the information
        return new Promise((resolve, reject) => {
            this.getO2GService()
                .get()
                .then((apiDescriptor: O2GService) => resolve(apiDescriptor))
                .catch(() => {
                    this.#logger.error('Unable to bootstrap on {addr}', address);
                    reject();
                });
        });
    }

    getVersion(descriptor: RoxeRestApiDescriptor): Version {
        if (this.#apiVersion) {
            let version = descriptor.versions.find((version) => version.id === this.#apiVersion);
            if (version) {
                return version;
            }

            throw new Error(`API version [${this.#apiVersion}] is not supported.`);
        } else {
            const version = descriptor.versions.find((version) => version.status == 'CURRENT');
            if (version) {
                this.#apiVersion = version.id;
                return version;
            } else {
                throw new Error('Unable to retrieve current API version.');
            }
        }
    }

    async bootstrap(host: Host): Promise<ServerInfo> {
        let apiDescriptor: RoxeRestApiDescriptor | null = null;

        if (host.privateAddress) {
            try {
                this.setO2GServiceUri(host.privateAddress);

                apiDescriptor = await this.getO2GService().get();
                this.#accessMode = AccessMode.Private;
            } catch (e) {
                this.#logger.debug('Unable to bootstrap on {0}', host.privateAddress);

                if (!host.publicAddress) {
                    this.throwUnableToConnect(host);
                }
            }
        }

        if (apiDescriptor == null) {
            try {
                this.setO2GServiceUri(host.publicAddress!);

                apiDescriptor = await this.getO2GService().get();
                this.#accessMode = AccessMode.Public;
            } catch (e) {
                this.#logger.debug('Unable to bootstrap on {0}', host.publicAddress);
                this.throwUnableToConnect(host);
            }
        }

        const version: Version | null = this.getVersion(apiDescriptor!);

        if (this.#accessMode == AccessMode.Private) {
            this.#servicesUri.set(O2GService.Authentication, UtilUri.ensureHttps(version!.internalUrl));
        } else {
            this.#servicesUri.set(O2GService.Authentication, UtilUri.ensureHttps(version!.publicUrl));
        }

        return apiDescriptor!.serverInfo;
    }

    setSessionUris(privateUri: string, publicUri: string) {
        if (this.#accessMode === AccessMode.Private) {
            this.#servicesUri.set(O2GService.Sessions, UtilUri.ensureHttps(privateUri));
        } else {
            this.#servicesUri.set(O2GService.Sessions, UtilUri.ensureHttps(publicUri));
        }
    }

    setServices(sessionInfo: SessionInfo) {
        let baseUrl: string;

        // get the right URL
        if (this.#accessMode == AccessMode.Private) {
            baseUrl = sessionInfo.privateBaseUrl;
        } else {
            baseUrl = sessionInfo.publicBaseUrl;
        }

        sessionInfo.services.forEach((service) => {
            var serviceName = O2GService.get(service.serviceName);
            if (service.relativeUrl.startsWith('/telephony')) {
                // Only one telephony service
                serviceName = O2GService.Telephony;
            }

            if (!this.#servicesUri.has(serviceName)) {
                if (service.relativeUrl.startsWith('/telephony')) {
                    this.#logger.debug('Register service: Telephony');

                    this.#servicesUri.set(serviceName, baseUrl + '/telephony');
                } else {
                    this.#logger.debug(`Register service: {}`, service.serviceName);
                    this.#servicesUri.set(serviceName, baseUrl + service.relativeUrl);
                }
            }
        });
    }
}
