/**
 * Copyright 2025 ALE International
 *
 * Licensed under the MIT License. You may obtain a copy of the License at:
 * https://opensource.org/licenses/MIT
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

export * from './types/analytics/call-type';
export * from './types/analytics/charging-file';
export * from './types/analytics/charging-result';
export * from './types/analytics/charging';
export * from './types/analytics/incident';
export * from './types/analytics/tel-facility';

export * from './types/cc-agent/agent-groups';
export * from './types/cc-agent/agent-skill-set';
export * from './types/cc-agent/agent-skill';
export * from './types/cc-agent/intrusion-mode';
export * from './types/cc-agent/operator-config';
export * from './types/cc-agent/operator-state';
export * from './types/cc-agent/operator-type';
export * from './types/cc-agent/withdraw-reason';

export * from './types/cc-mngt/calendar/abstract-calendar';
export * from './types/cc-mngt/calendar/calendar';
export * from './types/cc-mngt/calendar/exception-calendar';
export * from './types/cc-mngt/calendar/normal-calendar';
export * from './types/cc-mngt/calendar/pilot-operating-Mode';
export * from './types/cc-mngt/calendar/transition';
export * from './types/cc-mngt/pilot-rule-set';
export * from './types/cc-mngt/pilot-rule';
export * from './types/cc-mngt/pilot';

export * from './types/cc-pilot/call-data-pilot';
export * from './types/cc-pilot/cc-pilot-events';

export * from './types/cc-rt/agent-attributes';
export * from './types/cc-rt/agent-pg-attributes';
export * from './types/cc-rt/agent-pg-type';
export * from './types/cc-rt/agent-phone-state';
export * from './types/cc-rt/agent-service-type';
export * from './types/cc-rt/cc-rt-events';
export * from './types/cc-rt/other-pg-attributes';
export * from './types/cc-rt/other-pg-type';
export * from './types/cc-rt/pilot-attributes';
export * from './types/cc-rt/queue-attributes';
export * from './types/cc-rt/queue-type';
export * from './types/cc-rt/rti-context';
export * from './types/cc-rt/rti-filter';
export * from './types/cc-rt/rti-object-identifier';
export * from './types/cc-rt/rti-objects';

export * from './types/cc-stats/data/ag-by-pil-stats-row';
export * from './types/cc-stats/data/ag-stats-row';
export * from './types/cc-stats/data/data-obs-period';
export * from './types/cc-stats/data/pil-stats-row';
export * from './types/cc-stats/data/selected-period';
export * from './types/cc-stats/data/stat-value';
export * from './types/cc-stats/data/stats-data';
export * from './types/cc-stats/events/progress-callback';
export * from './types/cc-stats/events/progress-step';
export * from './types/cc-stats/scheduled/recurrence';
export * from './types/cc-stats/scheduled/report-obs-period';
export * from './types/cc-stats/scheduled/scheduled-report';
export * from './types/cc-stats/agbypilot-attributes';
export * from './types/cc-stats/agent-attributes';
export * from './types/cc-stats/agent-filter';
export * from './types/cc-stats/language';
export * from './types/cc-stats/pilot-attributes';
export * from './types/cc-stats/pilot-filter';
export * from './types/cc-stats/requester';
export * from './types/cc-stats/stats-context';
export * from './types/cc-stats/stats-filter';
export * from './types/cc-stats/stats-format';
export * from './types/cc-stats/time-interval';

export * from './types/comlog/com-record-participant';
export * from './types/comlog/com-record';
export * from './types/comlog/comlog-events';
export * from './types/comlog/filter-option';
export * from './types/comlog/page';
export * from './types/comlog/query-filter';
export * from './types/comlog/query-result';
export * from './types/comlog/reason';
export * from './types/comlog/role';

export * from './types/common/date-range';
export * from './types/common/day-of-week';
export * from './types/common/device-type';
export * from './types/common/device';
export * from './types/common/identifier';
export * from './types/common/main-type';
export * from './types/common/party-info-type';
export * from './types/common/party-info';
export * from './types/common/service-state';

export * from './types/directory/criteria';
export * from './types/directory/filter-item';
export * from './types/directory/logical-operation';
export * from './types/directory/operation-filter';
export * from './types/directory/result-item';
export * from './types/directory/search-result';

export * from './types/events/events';

export * from './types/eventsummary/event-summary-counter';
export * from './types/eventsummary/event-summary-events';

export * from './types/maint/configuration-type';
export * from './types/maint/cti-link-state';
export * from './types/maint/license-status';
export * from './types/maint/license-type';
export * from './types/maint/license';
export * from './types/maint/maint-events';
export * from './types/maint/pbx-status';
export * from './types/maint/server-address';
export * from './types/maint/service-status';
export * from './types/maint/subscriber-filter';
export * from './types/maint/sys-service-status';
export * from './types/maint/sys-status';

export * from './types/messaging/mailbox-info';
export * from './types/messaging/mailbox';
export * from './types/messaging/voice-message';

export * from './types/pbxmngt/attribute-filter';
export * from './types/pbxmngt/instance-filter';
export * from './types/pbxmngt/model';
export * from './types/pbxmngt/octet-string-length';
export * from './types/pbxmngt/pbx-attr-map';
export * from './types/pbxmngt/pbx-attribute';
export * from './types/pbxmngt/pbx-object';
export * from './types/pbxmngt/pbx';
export * from './types/pbxmngt/pbxmngt-events';

export * from './types/phoneset/device-key';
export * from './types/phoneset/dynamic-state';
export * from './types/phoneset/pin';
export * from './types/phoneset/prog-key';
export * from './types/phoneset/soft-key';

export * from './types/routing/destination';
export * from './types/routing/dnd-state';
export * from './types/routing/forward-condition';
export * from './types/routing/forward';
export * from './types/routing/overflow-condition';
export * from './types/routing/overflow';
export * from './types/routing/routing-capabilities';
export * from './types/routing/routing-events';
export * from './types/routing/routing-state';

export * from './types/rsi/add-digit-coll-criteria';
export * from './types/rsi/collection-cause';
export * from './types/rsi/route-session';
export * from './types/rsi/routing-caller-type';
export * from './types/rsi/routing-reason';
export * from './types/rsi/rsi-events';
export * from './types/rsi/rsi-point';
export * from './types/rsi/tones';

export * from './types/telephony/call/ccd/acd-call-info';
export * from './types/telephony/call/ccd/acd-data';
export * from './types/telephony/call/ccd/call-profile';
export * from './types/telephony/call/ccd/pilot-info';
export * from './types/telephony/call/ccd/pilot-status';
export * from './types/telephony/call/ccd/pilot-transfer-info';
export * from './types/telephony/call/ccd/pilot-transfer-query-param';
export * from './types/telephony/call/ccd/queue-data';
export * from './types/telephony/call/call-cause';
export * from './types/telephony/call/call-data';
export * from './types/telephony/call/correlator-data';
export * from './types/telephony/call/leg';
export * from './types/telephony/call/media-state';
export * from './types/telephony/call/participant';
export * from './types/telephony/call/record-state';
export * from './types/telephony/call/tag';
export * from './types/telephony/device/device-state';
export * from './types/telephony/device/operational-state';
export * from './types/telephony/user/user-state';
export * from './types/telephony/call';
export * from './types/telephony/callback';
export * from './types/telephony/hunting-group-status';
export * from './types/telephony/hunting-groups';
export * from './types/telephony/mini-message';
export * from './types/telephony/RecordingAction';
export * from './types/telephony/telephonic-state';
export * from './types/telephony/telephony-events';
export * from './types/telephony/trunk-indentification';

export * from './types/users/preferences';
export * from './types/users/supported-languages';
export * from './types/users/user';
export * from './types/users/users-events';
export * from './types/users/voicemail';
export * from './types/users/voicemail-type';

export * from './ErrorInfo';
export * from './o2g-servers';
export * from './subscription';
export * from './supervised-account';
export * from './session-monitoring-policy'
export * from './log-level';

import Application, { O2G_RECONNECTED, O2G_SESSION_LOST } from './internal/o2g-application';
import { Routing } from './services/o2g-routing';
import { EventSummary } from './services/o2g-eventSummary';
import { Directory } from './services/o2g-directory';
import { Users } from './services/o2g-users';
import { Telephony } from './services/o2g-telephony';
import { CommunicationLog } from './services/o2g-comlog';
import { Analytics } from './services/o2g-analytics';
import { CallCenterAgent } from './services/o2g-cc-agent';
import { CallCenterPilot } from './services/o2g-cc-pilot';
import { Maintenance } from './services/o2g-maint';
import { PbxManagement } from './services/o2g-pbx-mngt';
import { PhoneSetProgramming } from './services/o2g-phone-set-prog';
import { Messaging } from './services/o2g-messaging';
import { containerInit } from './internal/util/injection-container';
import { Subscription } from './subscription';
import { Logger } from './internal/util/logger';
import { UsersManagement } from './services/o2g-users-mngt';
import { CallCenterManagement } from './services/o2g-cc-mngt';
import { CallCenterRealtime } from './services/o2g-cc-rt';
import { CallCenterStatistics } from './services/o2g-cc-stat';
import { SupervisedAccount } from './supervised-account';
import { Host, O2GServers } from './o2g-servers';
import { DefaultSessionMonitoringPolicy, SessionMonitoringPolicy } from './session-monitoring-policy';
import { LogLevel } from './log-level';

/**
 * Main entry point for the O2G SDK.
 * <p>
 * The `O2G` class is a static facade that manages the application lifecycle and provides
 * access to all O2G services. The typical usage follows three steps:
 * <ol>
 *   <li>Initialize the application with {@link O2G.initialize}</li>
 *   <li>Login with {@link O2G.login}</li>
 *   <li>Optionally subscribe to events with {@link O2G.subscribe}</li>
 * </ol>
 *
 * @example
 * ```typescript
 * // Single server
 * O2G.initialize("MyApp", O2GServers.Builder
 *     .primaryPrivateAddress("192.168.1.1")
 *     .build());
 *
 * // Geographic redundancy
 * O2G.initialize("MyApp", O2GServers.Builder
 *     .primaryPrivateAddress("10.0.0.1")
 *     .secondaryPrivateAddress("10.0.0.2")
 *     .build());
 *
 * const success = await O2G.login("user", "password");
 * if (success) {
 *     await O2G.subscribe(subscription);
 *     const calls = await O2G.telephony.getCalls();
 * }
 * ```
 */
export class O2G {

    /**
     * The event name fired when the session is lost due to a server crash
     * or network failure. The SDK will automatically attempt to recover.
     * Use with {@link O2G.on} to show a "reconnecting" indicator in your UI.
     *
     * @example
     * ```ts
     * O2G.on(O2G.O2G_SESSION_LOST, ({ reason }) => {
     *     console.warn('Session lost:', reason);
     * });
     * ```
     */
    static get O2G_SESSION_LOST(): string {
        return O2G_SESSION_LOST;
    }

    /**
     * The event name fired when the session has been successfully recovered
     * after a loss. All services are available again.
     * Use with {@link O2G.on} to resume application activity or re-sync state.
     *
     * @example
     * ```ts
     * O2G.on(O2G.O2G_RECONNECTED, () => {
     *     console.info('Session recovered — re-syncing state...');
     *     const calls = await O2G.telephony.getCalls();
     * });
     * ```
     */
    static get O2G_RECONNECTED(): string {
        return O2G_RECONNECTED;
    }
    /**
     * The event name fired when O2G channel information is received.
     * Use with {@link O2G.on} to listen for channel information events.
     */
    static get O2G_ONCHANNEL_INFORMATION(): string {
        return Application.O2G_ONCHANNEL_INFORMATION;
    }

    private static _application: Application | null = null;
    private static _logger = Logger.create('O2G');

    private static _routing: Routing | null = null;
    private static _eventSummary: EventSummary | null = null;
    private static _users: Users | null = null;
    private static _usersManagement: UsersManagement | null = null;
    private static _telephony: Telephony | null = null;
    private static _directory: Directory | null = null;
    private static _comlog: CommunicationLog | null = null;
    private static _analytics: Analytics | null = null;
    private static _callCenterAgent: CallCenterAgent | null = null;
    private static _callCenterPilot: CallCenterPilot | null = null;
    private static _callCenterRealtime: CallCenterRealtime | null = null;
    private static _callCenterStatistics: CallCenterStatistics | null = null;
    private static _callCenterManagement: CallCenterManagement | null = null;
    private static _maintenance: Maintenance | null = null;
    private static _pbxManagement: PbxManagement | null = null;
    private static _phoneSetProgramming: PhoneSetProgramming | null = null;
    private static _messaging: Messaging | null = null;


    /**
     * Initializes the O2G application with the given name, server configuration,
     * and optional API version.
     * <p>
     * This method must be called before any other method. It can only be called once;
     * subsequent calls will throw an error.
     *
     * @param appName    the application name, used to identify this client on the O2G server
     * @param servers    the O2G server configuration, built with {@link O2GServers.Builder}
     * @param apiVersion the API version to use. Defaults to `"1.0"`
     * @throws {Error} if the application has already been initialized
     */
    static initialize(appName: string, servers: O2GServers, apiVersion: string = '1.0'): void {
        containerInit();
        if (this._application) {
            throw new Error('O2G has already been initialized.');
        }
        this._application = new Application(appName, servers, apiVersion);
    }

    /**
     * Sets a custom {@link SessionMonitoringPolicy} to control how the SDK
     * reacts to session failures.
     * Must be called after {@link O2G.initialize} and before {@link O2G.login}.
     * If not called, the {@link DefaultSessionMonitoringPolicy} is used.
     *
     * @param policy - the monitoring policy to apply
     */
    static setMonitoringPolicy(policy: SessionMonitoringPolicy): void {
        if (!this._application) throw new Error('Application not initialized.');
        this._application.setMonitoringPolicy(policy);
    }

    /**
     * Authenticates the user against the O2G server and initializes all services.
     * <p>
     * Must be called after {@link O2G.initialize}. On success, all service getters
     * become available. On failure, returns `false` and logs the error.
     *
     * @param loginName        the user's login name
     * @param password         the user's password
     * @param supervisedAccount optional supervised account to open the session on behalf of another user
     * @returns `true` if login succeeded; `false` otherwise
     * @throws {Error} if the application has not been initialized
     */
    static async login(
        loginName: string,
        password: string,
        supervisedAccount: SupervisedAccount | null = null
    ): Promise<boolean> {
        if (!this._application) throw new Error('Application not initialized.');

        try {
            await this._application.login(loginName, password, supervisedAccount);
            return true;
        } catch (e) {
            this._logger.error('Unable to login', e);
            return false;
        }
    }

    /**
     * Subscribes to O2G events using the given subscription configuration.
     * <p>
     * Must be called after a successful {@link O2G.login} to start receiving events.
     * Use {@link O2G.on} to register listeners for specific event types.
     *
     * @param subscription the subscription configuration specifying which event packages to receive
     * @throws {Error} if the application has not been initialized
     */
    static async subscribe(subscription: Subscription): Promise<void> {
        if (!this._application) throw new Error('Application not initialized.');
        await this._application.subscribe(subscription);
    }

    /**
     * Gracefully shuts down the O2G application, closing the session and releasing all resources.
     * <p>
     * After calling this method, {@link O2G.initialize} must be called again before reuse.
     */ static async shutdown(): Promise<void> {
        if (this._application) {
            await this._application.close();
            this._application = null;
        }
    }

    /**
     * Returns the host the SDK is currently connected to.
     */
    static get currentHost(): Host {
        if (!this._application) throw new Error('Application not initialized.');
        return this._application.currentHost;
    }

    /**
     * Sets the global log level for all SDK internal loggers.
     *
     * @param level - the minimum log level to output
     * @example
     * ```ts
     * O2G.setLogLevel(LogLevel.DEBUG);
     * ```
     */
    static setLogLevel(level: LogLevel): void {
        Logger.setGlobalLevel(level);
    }

    /**
     * Registers an event listener for the specified O2G event.
     *
     * @param event    the event name to listen for
     * @param listener the callback function invoked when the event is fired
     * @throws {Error} if the application has not been initialized
     */
    static on(event: string, listener: (...args: any[]) => void) {
        if (!this._application) throw new Error('Application not initialized.');
        this._application.on(event, listener);
    }

    /**
     * Removes a previously registered event listener for the specified O2G event.
     *
     * @param event    the event name
     * @param listener the callback function to remove
     * @throws {Error} if the application has not been initialized
     */
    static off(event: string, listener: (...args: any[]) => void) {
        if (!this._application) throw new Error('Application not initialized.');
        this._application.off(event, listener);
    }

    /**
         * Returns the {@link Routing} service, which provides call routing and forwarding management.
         * @throws {Error} if the application has not been initialized or login has not completed
         */
    static get routing(): Routing {
        if (!this._application) throw new Error('Routing service not available.');
        return this._application.getRoutingService();
    }

    /**
     * Returns the {@link EventSummary} service, which provides access to event summary counters.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get eventSummary(): EventSummary {
        if (!this._application) throw new Error('EventSummary service not available.');
        return this._application.getEventSummaryService();
    }

    /**
     * Returns the {@link Users} service, which provides user profile and preference management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get users(): Users {
        if (!this._application) throw new Error('Users service not available.');
        return this._application.getUsersService();
    }

    /**
     * Returns the {@link UsersManagement} service, which provides administrator-level user management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get usersManagement(): UsersManagement {
        if (!this._application) throw new Error('UsersManagement service not available.');
        return this._application.getUserManagementService();
    }

    /**
     * Returns the {@link Telephony} service, which provides call control and telephony operations.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get telephony(): Telephony {
        if (!this._application) throw new Error('Telephony service not available.');
        return this._application.getTelephonyService();
    }

    /**
     * Returns the {@link Directory} service, which provides enterprise directory search.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get directory(): Directory {
        if (!this._application) throw new Error('Directory service not available.');
        return this._application.getDirectoryService();
    }

    /**
     * Returns the {@link CommunicationLog} service, which provides access to communication history records.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get comlog(): CommunicationLog {
        if (!this._application) throw new Error('CommunicationLog service not available.');
        return this._application.getCommunicationLogService();
    }

    /**
     * Returns the {@link Analytics} service, which provides access to charging and incident data.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get analytics(): Analytics {
        if (!this._application) throw new Error('Analytics service not available.');
        return this._application.getAnalyticsService();
    }

    /**
     * Returns the {@link CallCenterAgent} service, which provides ACD agent state and skill management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get callCenterAgent(): CallCenterAgent {
        if (!this._application) throw new Error('CallCenterAgent service not available.');
        return this._application.getCallCenterAgentService();
    }

    /**
     * Returns the {@link CallCenterPilot} service, which provides CCD pilot monitoring.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get callCenterPilot(): CallCenterPilot {
        if (!this._application) throw new Error('CallCenterPilot service not available.');
        return this._application.getCallCenterPilotService();
    }

    /**
     * Returns the {@link CallCenterRealtime} service, which provides real-time ACD statistics and RTI data.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get callCenterRealtime(): CallCenterRealtime {
        if (!this._application) throw new Error('CallCenterRealtime service not available.');
        return this._application.getCallCenterRealtimeService();
    }

    /**
     * Returns the {@link CallCenterStatistics} service, which provides historical ACD statistics and reporting.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get callCenterStatistics(): CallCenterStatistics {
        if (!this._application) throw new Error('CallCenterStatistics service not available.');
        return this._application.getCallCenterStatisticsService();
    }

    /**
     * Returns the {@link CallCenterManagement} service, which provides CCD pilot and calendar management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get callCenterManagement(): CallCenterManagement {
        if (!this._application) throw new Error('CallCenterManagement service not available.');
        return this._application.getCallCenterManagementService();
    }

    /**
     * Returns the {@link Maintenance} service, which provides system status and PBX health information.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get maintenance(): Maintenance {
        if (!this._application) throw new Error('Maintenance service not available.');
        return this._application.getMaintenanceService();
    }

    /**
     * Returns the {@link PbxManagement} service, which provides PBX object model access and configuration.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get pbxManagement(): PbxManagement {
        if (!this._application) throw new Error('PbxManagement service not available.');
        return this._application.getPbxManagementService();
    }

    /**
     * Returns the {@link PhoneSetProgramming} service, which provides phone device key and pin management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get phoneSetProgramming(): PhoneSetProgramming {
        if (!this._application) throw new Error('PhoneSetProgramming service not available.');
        return this._application.getPhoneSetProgrammingService();
    }

    /**
     * Returns the {@link Messaging} service, which provides voicemail and mailbox management.
     * @throws {Error} if the application has not been initialized or login has not completed
     */
    static get messaging(): Messaging {
        if (!this._application) throw new Error('Messaging service not available.');
        return this._application.getMessagingService();
    }
}

export { Routing } from './services/o2g-routing';
export { EventSummary } from './services/o2g-eventSummary';
export { Directory } from './services/o2g-directory';
export { Users } from './services/o2g-users';
export { Telephony } from './services/o2g-telephony';
export { CommunicationLog } from './services/o2g-comlog';
export { Analytics } from './services/o2g-analytics';
export { CallCenterAgent } from './services/o2g-cc-agent';
export { CallCenterPilot } from './services/o2g-cc-pilot';
export { Maintenance } from './services/o2g-maint';
export { PbxManagement } from './services/o2g-pbx-mngt';
export { PhoneSetProgramming } from './services/o2g-phone-set-prog';
export { Messaging } from './services/o2g-messaging';
export { UsersManagement } from './services/o2g-users-mngt';
export { CallCenterManagement } from './services/o2g-cc-mngt';
export { CallCenterRealtime } from './services/o2g-cc-rt';
export { CallCenterStatistics } from './services/o2g-cc-stat';
export { SessionMonitoringPolicy, DefaultSessionMonitoringPolicy, Behavior, BehaviorAction } from './session-monitoring-policy';
export { O2GServers } from './o2g-servers';