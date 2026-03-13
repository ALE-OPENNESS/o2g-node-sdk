/**
 * Represents an O2G host.
 * <p>
 * An O2G host can be reacheable from the local network, or from a wide area
 * network. In this case, enterprise access can be secured by a reverse proxy
 * border element.
 */
export type ErrorInfo = {
    httpStatus?: string;
    code?: number;
    helpMessage?: string;
    type?: string;
    innerMessage?: string;
    canRetry?: boolean;
    routing?: RoutingErrorInfo;
    telephony?: TelephonyErrorInfo;
    userPreferences?: UserPreferencesErrorInfo;
};
export interface RoutingErrorInfo {
    errorType: RoutingErrorType;
    errorCause: RoutingErrorCause;
    message?: string;
}
export declare enum RoutingErrorType {
    Unknown = "UNKNOWN",
    BadParameterValue = "BAD_PARAMETER_VALUE",
    Unauthorized = "UNAUTHORIZED",
    InvalidOperation = "INVALID_OPERATION",
    IncompletePhoneNumber = "INCOMPLETE_PHONE_NUMBER",
    UnknownPhoneNumber = "UNKNOWN_PHONE_NUMBER"
}
export declare enum RoutingErrorCause {
    Unknown = "UNKNOWN",
    BadPhoneNumberFormat = "BAD_PHONE_NUMBER_FORMAT",
    InvalidCurrentDevice = "INVALID_CURRENT_DEVICE",
    InvalidForwardRoute = "INVALID_FORWARD_ROUTE",
    InvalidOverflowRoute = "INVALID_OVERFLOW_ROUTE",
    NullOrEmptyParameter = "NULL_OR_EMPTY_PARAMETER",
    NullParameter = "NULL_PARAMETER",
    UnauthorizedCancelOverflow = "UNAUTHORIZED_CANCEL_OVERFLOW",
    UnauthorizedNotAUser = "UNAUTHORIZED_NOT_A_USER",
    UnauthorizedOverflow = "UNAUTHORIZED_OVERFLOW",
    UnauthorizedPhoneNumber = "UNAUTHORIZED_PHONE_NUMBER"
}
export interface TelephonyErrorInfo {
    errorType: TelephonyErrorType;
    errorCause: TelephonyErrorCause;
    message?: string;
}
export declare enum TelephonyErrorType {
    Unknown = "UNKNOWN",
    CallReferenceNotFound = "CALL_REFERENCE_NOT_FOUND",
    MegNotFound = "LEG_NOT_FOUND",
    BasParameterValue = "BAD_PARAMETER_VALUE",
    IncompatibleWithState = "INCOMPATIBLE_WITH_STATE",
    ServiceNotProvided = "SERVICE_NOT_PROVIDED",
    ServiceUnavailable = "SERVICE_UNAVAILABLE",
    Initialization = "INITIALIZATION",
    Unauthorized = "UNAUTHORIZED",
    CallserverError = "CALL_SERVER_ERROR",
    RequestTimeout = "REQUEST_TIMEOUT"
}
export declare enum TelephonyErrorCause {
    Unknown = "UNKNOWN",
    InvalidCalling = "INVALID_CALLING",
    InvalidDestination = "INVALID_DESTINATION",
    InvalidCallId = "INVALID_CALL_ID",
    InvalidConnectionState = "INVALID_CONNECTION_STATE",
    DeviceOutOfService = "DEVICE_OUT_OF_SERVICE",
    InvalidDevice = "INVALID_DEVICE",
    InvalidDeviceState = "INVALID_DEVICE_STATE",
    InvalidData = "INVALID_DATA",
    ResourceBusy = "RESOURCE_BUSY"
}
export interface UserPreferencesErrorInfo {
    userPreferencesError: UserPreferencesErrorType;
    userPreferencesParameter: UserPreferenceParameter;
}
export declare enum UserPreferencesErrorType {
    Unknown = "UNKNOWN",
    WrongValue = "WRONG_VALUE",
    WrongNumberFormat = "WRONG_NUMBER_FORMAT"
}
export declare enum UserPreferenceParameter {
    GuiLanguage = "GUI_LANGUAGE",
    Unknown = "UNKNOWN"
}
//# sourceMappingURL=ErrorInfo.d.ts.map
/**
 * Represents an O2G host.
 * <p>
 * An O2G host can be reacheable from the local network, or from a wide area
 * network. In this case, enterprise access can be secured by a reverse proxy
 * border element.
 */
export type Host = {
    /**
     * The private address for this host.
     */
    privateAddress: string;
    /**
     * The public address for this host.
     */
    publicAddress?: string;
};
//# sourceMappingURL=host.d.ts.map
export {};
//# sourceMappingURL=access-mode.d.ts.map
export {};
//# sourceMappingURL=chunk-eventing.d.ts.map
export {};
//# sourceMappingURL=event-dispatcher.d.ts.map
export {};
//# sourceMappingURL=event-packages.d.ts.map
export {};
//# sourceMappingURL=o2g-application.d.ts.map
export {};
//# sourceMappingURL=analytics-rest.d.ts.map
export {};
//# sourceMappingURL=authentication-rest.d.ts.map
export {};
//# sourceMappingURL=ccAgent-rest.d.ts.map
export {};
//# sourceMappingURL=ccMngt-rest.d.ts.map
export {};
//# sourceMappingURL=ccPilot-rest.d.ts.map
export {};
//# sourceMappingURL=ccRealtime-rest.d.ts.map
import { Language } from '../../types/cc-stats/language';
import { Requester } from '../../types/cc-stats/requester';
import { StatsContext } from '../../types/cc-stats/stats-context';
import { StatsFilter } from '../../types/cc-stats/stats-filter';
import { RestService } from './rest-service';
import { IHttpClient } from '../util/IHttpClient';
import { DateRange } from '../../types/common/date-range';
import { StatisticsData } from '../../types/cc-stats/data/stats-data';
import { TimeInterval } from '../../types/cc-stats/time-interval';
import { ProgressCallback } from '../../types/cc-stats/events/progress-callback';
import { StatsFormat } from '../../types/cc-stats/stats-format';
import { EventRegistry } from '../events/event-dispatcher';
import { Recurrence } from '../../types/cc-stats/scheduled/recurrence';
import { ReportObservationPeriod } from '../../types/cc-stats/scheduled/report-obs-period';
import { ScheduledReport } from '../../types/cc-stats/scheduled/scheduled-report';
export default class CallCenterStatisticsRest extends RestService {
    #private;
    constructor(uri: string, httpClient: IHttpClient, eventRegistry: EventRegistry);
    private createAsyncRequest;
    private saveInDirectory;
    private downloadDataFile;
    private handleAcdStatsProgress;
    hasAsyncRequestInProgress(): boolean;
    createRequester(id: string, language: Language, timezone: string, agents: string[]): Promise<Requester | null>;
    deleteRequester(requester: Requester): Promise<boolean>;
    getRequester(id: string): Promise<Requester | null>;
    createContext(requester: Requester, label: string, description: string, filter: StatsFilter): Promise<StatsContext | null>;
    getContexts(requester: Requester): Promise<StatsContext[] | null>;
    deleteContexts(requester: Requester): Promise<boolean>;
    getContext(requester: Requester, contextId: string): Promise<StatsContext | null>;
    deleteContext(context: StatsContext): Promise<boolean>;
    getDaysData(context: StatsContext, range: DateRange): Promise<StatisticsData | null>;
    getDayData(context: StatsContext, date?: Date, timeInterval?: TimeInterval): Promise<StatisticsData | null>;
    getDayFileData(context: StatsContext, date: Date, timeInterval: TimeInterval, statFormat: StatsFormat, directory: string, progressCallback?: ProgressCallback): Promise<string>;
    getDaysFileData(context: StatsContext, range: DateRange, statFormat: StatsFormat, directory: string, progressCallback?: ProgressCallback): Promise<string>;
    cancelRequest(context: StatsContext): Promise<boolean>;
    createRecurrentScheduledReport(context: StatsContext, id: string, description: string, observationPeriod: ReportObservationPeriod, recurrence: Recurrence, format: StatsFormat, recipients: string[]): Promise<ScheduledReport | null>;
    createOneTimeScheduledReport(context: StatsContext, id: string, description: string, observationPeriod: ReportObservationPeriod, format: StatsFormat, recipients: string[]): Promise<ScheduledReport | null>;
    getScheduledReports(context: StatsContext): Promise<ScheduledReport[] | null>;
    deleteScheduledReport(report: ScheduledReport): Promise<boolean>;
    setScheduledReportEnabled(report: ScheduledReport, enabled: boolean): Promise<boolean>;
    getScheduledReport(context: StatsContext, scheduleReportId: string): Promise<ScheduledReport | null>;
    updateScheduledReport(report: ScheduledReport): Promise<boolean>;
}
//# sourceMappingURL=ccStatistics-rest.d.ts.map
export {};
//# sourceMappingURL=comlog-rest.d.ts.map
export {};
//# sourceMappingURL=directory-rest.d.ts.map
export {};
//# sourceMappingURL=eventSummary-rest.d.ts.map
export {};
//# sourceMappingURL=maint-rest.d.ts.map
export {};
//# sourceMappingURL=messaging-rest.d.ts.map
export {};
//# sourceMappingURL=o2g-rest.d.ts.map
export {};
//# sourceMappingURL=pbx-mngt-rest.d.ts.map
export {};
//# sourceMappingURL=phone-set-prog-rest.d.ts.map
export {};
//# sourceMappingURL=rest-service.d.ts.map
export {};
//# sourceMappingURL=routing-rest.d.ts.map
export {};
//# sourceMappingURL=rsi-rest.d.ts.map
export {};
//# sourceMappingURL=sessions-rest.d.ts.map
export {};
//# sourceMappingURL=subscriptions-rest.d.ts.map
export {};
//# sourceMappingURL=telephony-rest.d.ts.map
export {};
//# sourceMappingURL=users-mngt-rest.d.ts.map
export {};
//# sourceMappingURL=users-rest.d.ts.map
export {};
//# sourceMappingURL=service-end-point.d.ts.map
export {};
//# sourceMappingURL=service-factory.d.ts.map
export {};
//# sourceMappingURL=session.d.ts.map
export {};
//# sourceMappingURL=analytics-types.d.ts.map
export {};
//# sourceMappingURL=cc-agent-types.d.ts.map
export {};
//# sourceMappingURL=cc-mntg-types.d.ts.map
export {};
//# sourceMappingURL=cc-pilot-types.d.ts.map
export {};
//# sourceMappingURL=cc-rt-types.d.ts.map
export {};
//# sourceMappingURL=abstract-filter.d.ts.map
export {};
//# sourceMappingURL=ag-filter-impl.d.ts.map
import { ReportObservationPeriod } from '../../../types/cc-stats/scheduled/report-obs-period';
import { ScheduledReport } from '../../../types/cc-stats/scheduled/scheduled-report';
import { StatsFormat } from '../../../types/cc-stats/stats-format';
import { DayOfWeekJson } from '../common/common-types';
export declare enum AcdStatsProgressStep {
    COLLECT = "COLLECT",
    PROCESSED = "PROCESSED",
    FORMATED = "FORMATED",
    ERROR = "ERROR",
    CANCELLED = "CANCELLED"
}
export type OnAcdStatsProgressJson = {
    /** Supervisor name */
    supervisor: string;
    /** Step of the progression */
    step: AcdStatsProgressStep;
    /** Total number of objects (agents or pilots) asked */
    nbTotObjects?: number;
    /** Number of processed objects (agents or pilots) */
    nbProcessedObjects?: number;
    /** File path of the result (partial if res > Max rows) */
    resPath?: string;
    /** File path of the full result (if res > Max rows) */
    fullResPath?: string;
    /** File path of the full result in XLS format */
    xlsfullResPath?: string;
};
export type ScheduledSelPeriodJson = {
    periodType: ReportObservationPeriod.PeriodType;
    lastNb?: number;
    beginDate?: string;
    endDate?: string;
};
export declare enum PeriodicityJson {
    once = "once",
    daily = "daily",
    weekly = "weekly",
    montly = "monthly"
}
export type ReportFrequencyJson = {
    periodicity: PeriodicityJson;
    daysInWeek?: DayOfWeekJson[];
    dayInMonth?: number;
};
export type StatsScheduleJson = {
    name: string;
    description?: string;
    obsPeriod: ScheduledSelPeriodJson;
    frequency: ReportFrequencyJson;
    recipients: string[];
    state: ScheduledReport.State;
    enable: boolean;
    lastExecDate: string;
    fileType: StatsFormat;
};
//# sourceMappingURL=cc-stat-types.d.ts.map
export {};
//# sourceMappingURL=context-impl.d.ts.map
export {};
//# sourceMappingURL=on-stats-progress.d.ts.map
export {};
//# sourceMappingURL=pil-filter-impl.d.ts.map
export {};
//# sourceMappingURL=requester-impl.d.ts.map
export {};
//# sourceMappingURL=scheduled-rep-impl.d.ts.map
export {};
//# sourceMappingURL=comlog-types.d.ts.map
export {};
//# sourceMappingURL=common-types.d.ts.map
export {};
//# sourceMappingURL=directory-types.d.ts.map
/**
 * Notification sent each time the user's counters have changed.
 */
export type OnEventSummaryUpdatedJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;
    /**
     * The new event summary.
     */
    eventSummary: EventSummaryJson;
};
//# sourceMappingURL=eventsummary-types.d.ts.map
export {};
//# sourceMappingURL=maint-types.d.ts.map
export {};
//# sourceMappingURL=messaging-types.d.ts.map
export {};
//# sourceMappingURL=pbxmngt-types.d.ts.map
export {};
//# sourceMappingURL=phoneset-types.d.ts.map
export {};
//# sourceMappingURL=routing-types.d.ts.map
export {};
//# sourceMappingURL=rsi-types.d.ts.map
export {};
//# sourceMappingURL=telephony-types.d.ts.map
export {};
//# sourceMappingURL=users-types.d.ts.map
export {};
//# sourceMappingURL=assert.d.ts.map
export {};
//# sourceMappingURL=file-utils.d.ts.map
export {};
//# sourceMappingURL=format-util.d.ts.map
export {};
//# sourceMappingURL=hexa-string.d.ts.map
export {};
//# sourceMappingURL=http-client.d.ts.map
export {};
//# sourceMappingURL=http-content.d.ts.map
export {};
//# sourceMappingURL=http-response.d.ts.map
export {};
//# sourceMappingURL=IHttpClient.d.ts.map
import 'reflect-metadata';
import { Container } from 'inversify';
declare const ObjectsContainer: Container;
export {};
//# sourceMappingURL=injection-container.d.ts.map
declare const _default: {
    Colors: typeof Color;
    LogLevels: typeof LogLevel;
    setLogLevel: (level: LogLevel) => void;
};
export default _default;
//# sourceMappingURL=logger.d.ts.map
export {};
//# sourceMappingURL=util-uri.d.ts.map
import { Incident } from './types/analytics/incident';
import { ChargingFile } from './types/analytics/charging-file';
import { ChargingResult } from './types/analytics/charging-result';
import { DateRange } from './types/common/date-range';
/**
 * The Analytics service allows to retrieve OmniPCX entreprise charging information and incidents.
 * <p>Using this service requires having a <b>ANALYTICS</b> license. This service requires an administrative login.
 * <p>
 * O2G uses SSH to get the information from an OmniPCX Enterprise node. So
 * <b>SSH must be enabled</b> on the OmniPCX Enterprise node to use this
 * service.
 */
export declare class Analytics {
    #private;
    /**
     * Returns a list of incidents from the specified OmniPCX Enterprise node.
     * @param nodeId the OmniPCX Enterprise node id
     * @param last the number of incidents to retrieve
     */
    getIncidents(nodeId: number, last?: number): Promise<Array<Incident> | null>;
    /**
     * Get the list of charging file from the specified node, using the time range filter.
     * @param nodeId the OmniPCX Enterprise node id
     * @param filter  time range filter
     * @see {@link getChargingsFromFiles}
     */
    getChargingFiles(nodeId: number, filter?: DateRange | null): Promise<Array<ChargingFile> | null>;
    /**
     * Query the charging information for the specified node, using the specified options.
     * <p>
     * If 'all' is set to 'true', all the tickets are returned, including the zero cost ticket, and with the called party; If 'all' is
     * set to 'false', the total of charging info is returned for each user, the call number giving the number of calls with non null charging cost.
     * <p>
     * The request processes charging files on the OmniPCX Enterprise. The processing is limited to a maximum of 100 files for performance reason. If
     * the range filter is too large and the number of file to process is greater than 100, the method fails and returns 'null'. In this case, a smaller
     * range must be specified.
     *
     * @param nodeId     the OmniPCX Enterprise node id
     * @param filter     a time range filter
     * @param topResults allows to return only the 'top N' tickets
     * @param all        'true' to include tickets with a 0 cost
     */
    getChargingsFromFilter(nodeId: number, filter?: DateRange | null, topResults?: number | null, all?: boolean): Promise<ChargingResult | null>;
    /**
     * Query the charging information for the specified node, using the specified charging files. The charging files can be retrieved with {@link getChargingFiles}.
     * <p>
     * If 'all' is set to 'true', all the tickets are returned, including the zero cost ticket, and with the called party; If 'all' is
     * set to 'false', the total of charging info is returned for each user, the call number giving the number of calls with non null charging cost.
     * <p>
     * The request processes charging files on the OmniPCX Enterprise. The processing is limited to a maximum of 100 files for performance reason. If
     * the range filter is too large and the number of file to process is greater than 100, the method fails and returns 'null'. In this case, a smaller
     * range must be specified.
     *
     * @param nodeId     the OmniPCX Enterprise node id
     * @param files     the list of file to process
     * @param topResults allows to return only the 'top N' tickets
     * @param all        'true' to include tickets with a 0 cost
     */
    getChargingsFromFiles(nodeId: number, files: Array<ChargingFile>, topResults?: number | null, all?: boolean): Promise<ChargingResult | null>;
}
//# sourceMappingURL=o2g-analytics.d.ts.map
import { IntrusionMode } from './types/cc-agent/intrusion-mode';
import EventEmitter from 'events';
import { OperatorConfig } from './types/cc-agent/operator-config';
import { OperatorState } from './types/cc-agent/operator-state';
import { WithdrawReason } from './types/cc-agent/withdraw-reason';
/**
 * CallCenterAgent provides services for CCD operators. Using this
 * service requires having a <b>CONTACTCENTER_AGENT</b> license.
 */
export declare class CallCenterAgent extends EventEmitter {
    #private;
    /**
     * Occurs when an agent state has changed.
     * @event
     */
    static readonly ON_AGENT_STATE_CHANGED = "OnAgentStateChanged";
    /**
     * Occurs when CCD agent skills are modified: one or several skills have been activated or deactivated.
     * @event
     */
    static readonly ON_AGENT_SKILL_CHANGED = "OnAgentSkillChanged";
    /**
     * Occurs when an agent requests help from their supervisor.
     * @see requestPermanentListening
     * @see requestSupervisorHelp
     * @event
     */
    static readonly ON_SUPERVISOR_HELP_REQUESTED = "OnSupervisorHelpRequested";
    /**
     * Occurs when an agent has requested the assistance of their supervisor and the request
     * is cancelled by the agent, or rejected by the supervisor.
     * @see cancelSupervisorHelpRequest
     * @see rejectAgentHelpRequest
     * @event
     */
    static readonly ON_SUPERVISOR_HELP_CANCELLED = "OnSupervisorHelpCancelled";
    /**
     * Gets the operator configuration.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the operator login name
     * @returns the {@link OperatorConfig} on success; `null` otherwise.
     */
    getConfiguration(loginName?: string | null): Promise<OperatorConfig | null>;
    /**
     * Gets the specified agent or supervisor state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the operator login name
     * @returns the {@link OperatorState} on success; `null` otherwise.
     */
    getState(loginName?: string | null): Promise<OperatorState | null>;
    /**
     * Logs on an agent or a supervisor.
     * <p>
     * For a supervisor, if `pgNumber` is omitted, the supervisor is logged on out of group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Log on an agent to processing group "pg001" with headset mode
     * await O2G.callCenterAgent.logon("acd001", "pg001", true);
     *
     * // Log on a supervisor out of group (no pgNumber)
     * await O2G.callCenterAgent.logon("acd001");
     *
     * // Administrator logging on an agent on behalf of a user
     * await O2G.callCenterAgent.logon("acd001", "pg001", false, "jdoe");
     * ```
     *
     * @param proAcdNumber the pro-ACD device number
     * @param pgNumber     the agent processing group number
     * @param headset      activate the headset mode
     * @param loginName    the CCD operator login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see logoff
     */
    logon(proAcdNumber: string, pgNumber?: string | null, headset?: boolean, loginName?: string | null): Promise<boolean>;
    /**
     * Logs off an agent or a supervisor.
     * <p>
     * This method does nothing and returns `true` if the agent or supervisor is already logged off.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the CCD operator login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see logon
     */
    logoff(loginName?: string | null): Promise<boolean>;
    /**
     * Enters an agent group. Only for a supervisor.
     * <p>
     * This method is used by a supervisor to enter an agent group when in
     * pre-assigned state (logged on but not in an agent group).
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param pgNumber  the agent processing group number
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see exit
     */
    enter(pgNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Exits from an agent group. Only for a supervisor.
     * <p>
     * This method is used by a supervisor to leave an agent group and go back to
     * pre-assigned state (logged on but not in an agent group).
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see enter
     */
    exit(loginName?: string | null): Promise<boolean>;
    /**
     * Puts the specified agent in wrapup state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setWrapup(loginName?: string | null): Promise<boolean>;
    /**
     * Puts the specified agent in ready state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setReady(loginName?: string | null): Promise<boolean>;
    /**
     * Puts the specified agent in pause state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setPause(loginName?: string | null): Promise<boolean>;
    /**
     * Requests a supervisor to listen to the specified agent.
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_REQUESTED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Start permanent listening on agent "5001"
     * await O2G.callCenterAgent.requestPermanentListening("5001");
     *
     * // Listen to events to know when listening is established
     * O2G.callCenterAgent.on(CallCenterAgent.ON_SUPERVISOR_HELP_REQUESTED, (event) => {
     *     console.log("Listening established");
     * });
     *
     * // Cancel the listening when done
     * await O2G.callCenterAgent.cancelPermanentListening();
     * ```
     *
     * @param agentNumber the extension number of the agent to listen to
     * @param loginName   the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelPermanentListening
     */
    requestPermanentListening(agentNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Cancels a permanent listening by a supervisor.
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestPermanentListening
     */
    cancelPermanentListening(loginName?: string | null): Promise<boolean>;
    /**
     * Requests an intrusion in a CCD call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Intrude on agent "5001" in normal mode
     * await O2G.callCenterAgent.requestIntrusion("5001");
     *
     * // Intrude in coach mode (agent hears supervisor, caller does not)
     * await O2G.callCenterAgent.requestIntrusion("5001", IntrusionMode.COACH);
     *
     * // Switch from coach mode to normal intrusion
     * await O2G.callCenterAgent.changeIntrusionMode(IntrusionMode.NORMAL);
     *
     * // Cancel the intrusion by passing the current mode
     * await O2G.callCenterAgent.changeIntrusionMode(IntrusionMode.NORMAL);
     * ```
     *
     * @param agentNumber   the extension number of the CCD agent answering the call
     * @param intrusionMode the intrusion mode
     * @param loginName     the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see changeIntrusionMode
     */
    requestIntrusion(agentNumber: string, intrusionMode?: IntrusionMode, loginName?: string | null): Promise<boolean>;
    /**
     * Changes the intrusion mode.
     * <p>
     * This method allows changing the intrusion mode or cancelling an intrusion.
     * To cancel an intrusion, pass the current mode in the `newIntrusionMode` parameter.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param newIntrusionMode the new intrusion mode
     * @param loginName        the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestIntrusion
     */
    changeIntrusionMode(newIntrusionMode: IntrusionMode, loginName?: string | null): Promise<boolean>;
    /**
     * Requests help from the supervisor.
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_REQUESTED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelSupervisorHelpRequest
     */
    requestSupervisorHelp(loginName?: string | null): Promise<boolean>;
    /**
     * Rejects a help request from an agent.
     * <p>
     * This method is invoked by a supervisor to reject a help request from an agent.
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param agentNumber the extension number of the agent who requested help
     * @param loginName   the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelSupervisorHelpRequest
     */
    rejectAgentHelpRequest(agentNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Cancels a supervisor help request.
     * <p>
     * This method is invoked by an agent to cancel a help request.
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param supervisorNumber the extension number of the requested supervisor
     * @param loginName        the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestSupervisorHelp
     */
    cancelSupervisorHelpRequest(supervisorNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Asks a snapshot event to receive an {@link ON_AGENT_STATE_CHANGED} event.
     * <p>
     * The {@link ON_AGENT_STATE_CHANGED} event contains the operator {@link OperatorState}.
     * If a second request is asked while the previous one is still in progress, it has no effect.
     * <p>
     * If an administrator invokes this method with `loginName` set to `null`, the snapshot
     * request is done for all agents. The event processing can be long depending on the number
     * of users.
     *
     * @param loginName the agent login name
     * @returns `true` if the request was successfully submitted; `false` otherwise.
     */
    requestSnapshot(loginName?: string | null): Promise<boolean>;
    /**
     * Activates the specified skills.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     * <p>
     * This method does not validate skill numbers. If a skill number is invalid
     * (not assigned to the operator), it is ignored and the method returns `true`.
     *
     * @example
     * ```typescript
     * // Activate skills 1, 2 and 5 for the current user
     * await O2G.callCenterAgent.activateSkills([1, 2, 5]);
     *
     * // Activate skills for a specific agent (administrator session)
     * await O2G.callCenterAgent.activateSkills([1, 2, 5], "jdoe");
     *
     * // Invalid skill numbers are silently ignored â€” this still returns true
     * await O2G.callCenterAgent.activateSkills([1, 99, 100]);
     * ```
     *
     * @param skillNumbers the list of skill numbers to activate
     * @param loginName    the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deactivateSkills
     */
    activateSkills(skillNumbers: number[], loginName?: string | null): Promise<boolean>;
    /**
     * Deactivates the specified skills.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     * <p>
     * This method does not validate skill numbers. If a skill number is invalid
     * (not assigned to the operator), it is ignored and the method returns `true`.
     *
     * @param skillNumbers the list of skill numbers to deactivate
     * @param loginName    the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateSkills
     */
    deactivateSkills(skillNumbers: number[], loginName?: string | null): Promise<boolean>;
    /**
     * Returns the list of withdraw reasons for the specified processing group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param pgNumber  the agent processing group number
     * @param loginName the agent login name
     * @returns the list of {@link WithdrawReason} objects on success; `null` otherwise.
     * @see setWithdraw
     */
    getWithdrawReasons(pgNumber: string, loginName?: string | null): Promise<WithdrawReason[] | null>;
    /**
     * Withdraws an agent with the specified reason.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // First retrieve the available withdraw reasons for the processing group
     * const reasons = await O2G.callCenterAgent.getWithdrawReasons("pg001");
     *
     * // Then withdraw the agent using one of the returned reasons
     * if (reasons && reasons.length > 0) {
     *     await O2G.callCenterAgent.setWithdraw(reasons[0]);
     * }
     * ```
     *
     * @param reason    the withdraw reason
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getWithdrawReasons
     */
    setWithdraw(reason: WithdrawReason, loginName?: string | null): Promise<boolean>;
}
//# sourceMappingURL=o2g-cc-agent.d.ts.map
import { Calendar } from './types/cc-mngt/calendar/calendar';
import { DayOfWeek } from './types/common/day-of-week';
import { ExceptionCalendar } from './types/cc-mngt/calendar/exception-calendar';
import { NormalCalendar } from './types/cc-mngt/calendar/normal-calendar';
import { Transition } from './types/cc-mngt/calendar/transition';
import { Pilot } from './types/cc-mngt/pilot';
import { PilotTransferQueryParameters } from './types/telephony/call/ccd/pilot-transfer-query-param';
/**
 * This service allows an administrator session to manage CCD pilot objects.
 * <p>
 * This service requires having a <b>CONTACTCENTER_SRV</b> license.
 */
export declare class CallCenterManagement {
    #private;
    /**
     * Retrieves the list of CCD pilots configured on the specified OmniPCX Enterprise node.
     *
     * @param nodeId the PCX Enterprise node id
     * @returns the list of {@link Pilot} objects on success; `null` otherwise.
     */
    getPilots(nodeId: number): Promise<Pilot[] | null>;
    /**
     * Get information about a CCD pilot.
     *
     * When called without `pilotTransferQueryParam`, returns the pilot's current
     * configuration and state.
     *
     * When called with `pilotTransferQueryParam`, returns the pilot's routing
     * capabilities evaluated against the specified call profile context (agent,
     * skills, transfer type). This advanced form requires O2G version 2.7.4 or later.
     *
     * @example
     * ```typescript
     * // Simple form â€” get the pilot's current configuration
     * const pilot = await O2G.callCenterManagement.getPilot(1, "60141");
     *
     * // Advanced form â€” evaluate routing for a specific agent and skill set
     * const queryParam = new PilotTransferQueryParameters({
     *     agentNumber: "5001",
     *     skills: { skills: [{ skillNumber: 1, acrStatus: true, expertEvalLevel: 3 }] },
     *     priorityTransfer: true
     * });
     * const pilotAdvanced = await O2G.callCenterManagement.getPilot(1, "60141", queryParam);
     * ```
     *
     * @param nodeId                  the PCX Enterprise node id
     * @param pilotNumber             the pilot number
     * @param pilotTransferQueryParam optional call profile context. When provided,
     *                                the pilot information is evaluated against the
     *                                specified agent number, skills and transfer type.
     *                                Requires O2G >= 2.7.4.
     * @returns the {@link Pilot} information on success; `null` otherwise.
     */
    getPilot(nodeId: number, pilotNumber: string, pilotTransferQueryParam?: PilotTransferQueryParameters | null): Promise<Pilot | null>;
    /**
     * Retrieves the routing calendar of the specified CCD pilot.
     * <p>
     * The calendar defines the normal and exception schedules that govern
     * the pilot's open/closed state over time.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @returns the {@link Calendar} on success; `null` otherwise.
     */
    getCalendar(nodeId: number, pilotNumber: string): Promise<Calendar | null>;
    /**
     * Retrieves the exception calendar of the specified CCD pilot.
     * <p>
     * The exception calendar contains date-specific transitions that override
     * the normal weekly schedule.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @returns the {@link ExceptionCalendar} on success; `null` otherwise.
     */
    getExceptionCalendar(nodeId: number, pilotNumber: string): Promise<ExceptionCalendar | null>;
    /**
     * Adds a transition to the exception calendar of the specified CCD pilot.
     *
     * @example
     * ```typescript
     * // Add a closing transition on December 25th
     * const christmas = new Date(2025, 11, 25);
     * const closingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addExceptionTransition(1, "60141", christmas, closingTransition);
     *
     * // Later, update that transition (index 0 = first transition of the day)
     * const updatedTransition = new Transition({ ... });
     * await O2G.callCenterManagement.setExceptionTransition(1, "60141", christmas, 0, updatedTransition);
     *
     * // Or remove it entirely
     * await O2G.callCenterManagement.deleteExceptionTransition(1, "60141", christmas, 0);
     * ```
     *
     * @param nodeId         the PCX Enterprise node id
     * @param pilotNumber    the pilot number
     * @param dateTransition the date for which the exception transition applies
     * @param transition     the transition to add
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    addExceptionTransition(nodeId: number, pilotNumber: string, dateTransition: Date, transition: Transition): Promise<boolean>;
    /**
     * Deletes a transition from the exception calendar of the specified CCD pilot.
     *
     * @param nodeId         the PCX Enterprise node id
     * @param pilotNumber    the pilot number
     * @param dateTransition the date of the exception transition to delete
     * @param index          the index of the transition to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    deleteExceptionTransition(nodeId: number, pilotNumber: string, dateTransition: Date, index: number): Promise<boolean>;
    /**
     * Updates a transition in the exception calendar of the specified CCD pilot.
     *
     * @param nodeId         the PCX Enterprise node id
     * @param pilotNumber    the pilot number
     * @param dateTransition the date of the exception transition to update
     * @param index          the index of the transition to update
     * @param transition     the new transition value
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setExceptionTransition(nodeId: number, pilotNumber: string, dateTransition: Date, index: number, transition: Transition): Promise<boolean>;
    /**
     * Retrieves the normal (weekly) calendar of the specified CCD pilot.
     * <p>
     * The normal calendar defines the recurring weekly schedule of open/closed
     * transitions for each day of the week.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @returns the {@link NormalCalendar} on success; `null` otherwise.
     */
    getNormalCalendar(nodeId: number, pilotNumber: string): Promise<NormalCalendar | null>;
    /**
     * Adds a transition to the normal calendar of the specified CCD pilot for the given day of the week.
     *
     * @example
     * ```typescript
     * // Add an opening transition on Monday at 08:00
     * const openingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addNormalTransition(1, "60141", DayOfWeek.MONDAY, openingTransition);
     *
     * // Add a closing transition on Monday at 18:00
     * const closingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addNormalTransition(1, "60141", DayOfWeek.MONDAY, closingTransition);
     *
     * // Later, update the closing transition (index 1 = second transition of the day)
     * const updatedTransition = new Transition({ ... });
     * await O2G.callCenterManagement.setNormalTransition(1, "60141", DayOfWeek.MONDAY, 1, updatedTransition);
     *
     * // Or remove it
     * await O2G.callCenterManagement.deleteNormalTransition(1, "60141", DayOfWeek.MONDAY, 1);
     * ```
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @param day         the day of the week to which the transition applies
     * @param transition  the transition to add
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    addNormalTransition(nodeId: number, pilotNumber: string, day: DayOfWeek, transition: Transition): Promise<boolean>;
    /**
     * Deletes a transition from the normal calendar of the specified CCD pilot.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @param day         the day of the week from which the transition is deleted
     * @param index       the index of the transition to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    deleteNormalTransition(nodeId: number, pilotNumber: string, day: DayOfWeek, index: number): Promise<boolean>;
    /**
     * Updates a transition in the normal calendar of the specified CCD pilot.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @param day         the day of the week containing the transition to update
     * @param index       the index of the transition to update
     * @param transition  the new transition value
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setNormalTransition(nodeId: number, pilotNumber: string, day: DayOfWeek, index: number, transition: Transition): Promise<boolean>;
    /**
     * Forces the specified CCD pilot into the open state, regardless of its calendar schedule.
     *
     * @example
     * ```typescript
     * // Force a pilot open outside its normal schedule
     * await O2G.callCenterManagement.openPilot(1, "60141");
     *
     * // Force it closed (e.g. during an incident)
     * await O2G.callCenterManagement.closePilot(1, "60141");
     *
     * // Note: these methods override the calendar schedule.
     * // The pilot will remain in the forced state until the next
     * // scheduled calendar transition occurs.
     * ```
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    openPilot(nodeId: number, pilotNumber: string): Promise<boolean>;
    /**
     * Forces the specified CCD pilot into the closed state, regardless of its calendar schedule.
     *
     * @param nodeId      the PCX Enterprise node id
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    closePilot(nodeId: number, pilotNumber: string): Promise<boolean>;
}
//# sourceMappingURL=o2g-cc-mngt.d.ts.map
import EventEmitter from 'events';
/**
 * CallCenterPilot allows an administrator to monitor the CCD pilots. Using this
 * service requires having a <b>CONTACTCENTER_SRV</b> license.
 * <p>
 * Monitoring a pilot consists of starting the monitoring with {@link monitorStart},
 * then listening to events to track call activity on the pilot. When monitoring
 * is no longer needed, stop it with {@link monitorStop}.
 *
 * @example
 * ```typescript
 * // Register event listeners before starting monitoring
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_CREATED, (event) => {
 *     console.log("New call on pilot:", event.pilotNumber);
 * });
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_QUEUED, (event) => {
 *     console.log("Call queued on pilot:", event.pilotNumber);
 * });
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_REMOVED, (event) => {
 *     console.log("Call removed from pilot:", event.pilotNumber);
 * });
 *
 * // Start monitoring
 * await O2G.callCenterPilot.monitorStart("60141");
 *
 * // Stop monitoring and clean up when done
 * await O2G.callCenterPilot.monitorStop("60141");
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_CREATED);
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_QUEUED);
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_REMOVED);
 * ```
 */
export declare class CallCenterPilot extends EventEmitter {
    #private;
    /**
     * Occurs when a new call arrives on a pilot.
     * @event
     */
    static readonly ON_PILOT_CALL_CREATED = "OnPilotCallCreated";
    /**
     * Occurs when the call has been queued.
     * @event
     */
    static readonly ON_PILOT_CALL_QUEUED = "OnPilotCallQueued";
    /**
     * Occurs when a call has been removed from the pilot: by distribution, cancellation or overflow.
     * @event
     */
    static readonly ON_PILOT_CALL_REMOVED = "OnPilotCallRemoved";
    /**
     * Starts the monitoring of a pilot.
     * <p>
     * If the pilot is already being monitored, no error is returned.
     *
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see monitorStop
     */
    monitorStart(pilotNumber: string): Promise<boolean>;
    /**
     * Stops the monitoring of a pilot.
     * <p>
     * If the pilot is not being monitored, no error is returned.
     *
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see monitorStart
     */
    monitorStop(pilotNumber: string): Promise<boolean>;
}
//# sourceMappingURL=o2g-cc-pilot.d.ts.map
import EventEmitter from 'events';
import { RtiObjects } from './types/cc-rt/rti-objects';
import { RtiObjectIdentifier } from './types/cc-rt/rti-object-identifier';
import { RtiContext } from './types/cc-rt/rti-context';
/**
 * Provides real-time information about CCD objects from an OXE system
 * in the form of events.
 * <p>
 * This service is available only to administrators and delivers the same
 * level of information as the legacy RTI interface available in the CCS.
 * <p>
 * The CCD objects that can be monitored include CCD agents, pilots, waiting
 * queues, processing groups associated with agents, and other processing
 * groups (e.g. forward, guide).
 * <p>
 * The typical usage sequence is:
 * <ol>
 * <li>Build an {@link RtiFilter} specifying which objects and attributes to monitor.</li>
 * <li>Create an {@link RtiContext} with the filter and the desired notification frequency.</li>
 * <li>Set the context with {@link setContext}.</li>
 * <li>Register event listeners for the RTI events of interest.</li>
 * <li>Start monitoring with {@link start}.</li>
 * </ol>
 * <p>
 * After initialization, the application is notified whenever one or more monitored
 * attributes change. Each event contains only the attributes that have changed
 * since the previous notification.
 *
 * @example
 * ```typescript
 * // Build a filter for specific agents and attributes
 * const filter = new RtiFilter();
 * filter.setAgentAttributes(
 *     AgentAttributes.PrivateCallsTotalDuration,
 *     AgentAttributes.AssociatedSet,
 *     AgentAttributes.LogonDate
 * );
 * filter.setAgentNumbers(["60119", "60120"]);
 *
 * // Create a context: notification every 30s, data refresh every 5s
 * const context = new RtiContext(30, 5, filter);
 * await O2G.callCenterRealtime.setContext(context);
 *
 * // Register event listeners
 * O2G.callCenterRealtime.on(CallCenterRealtime.ON_AGENT_RTI_CHANGED, (event) => {
 *     console.log("Agent RTI changed:", event);
 * });
 *
 * // Start monitoring
 * await O2G.callCenterRealtime.start();
 *
 * // Stop monitoring and clean up when done
 * await O2G.callCenterRealtime.deleteContext();
 * O2G.callCenterRealtime.removeAllListeners(CallCenterRealtime.ON_AGENT_RTI_CHANGED);
 * ```
 *
 * @since 2.7.4
 */
export declare class CallCenterRealtime extends EventEmitter {
    #private;
    /**
     * Occurs when the real-time information of a CCD agent has changed.
     * @event
     */
    static readonly ON_AGENT_RTI_CHANGED = "OnAgentRtiChanged";
    /**
     * Occurs when the real-time information of a CCD queue has changed.
     * @event
     */
    static readonly ON_QUEUE_RTI_CHANGED = "OnQueueRtiChanged";
    /**
     * Occurs when the real-time information of a CCD pilot has changed.
     * @event
     */
    static readonly ON_PILOT_RTI_CHANGED = "OnPilotRtiChanged";
    /**
     * Occurs when the real-time information of a CCD agent processing group has changed.
     * @event
     */
    static readonly ON_AGENT_PG_RTI_CHANGED = "OnPGAgentRtiChanged";
    /**
     * Occurs when the real-time information of a CCD other processing group has changed.
     * @event
     */
    static readonly ON_OTHER_PG_RTI_CHANGED = "OnPGOtherRtiChanged";
    /**
     * Retrieves all CCD objects that currently provide real-time information.
     *
     * The returned {@link RtiObjects} includes collections of agents, pilots,
     * queues, and processing groups that can be monitored.
     *
     * Returns `null` if no objects are available or an error occurs.
     */
    getRtiObjects(): Promise<RtiObjects | null>;
    /**
     * Returns all CCD agents that provide real-time information.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agents,
     *          or an empty array if none exist.
     */
    getAgents(): Promise<RtiObjectIdentifier[] | null>;
    /**
     * Returns all CCD pilots that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for pilots,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    getPilots(): Promise<RtiObjectIdentifier[] | null>;
    /**
     * Returns all CCD queues that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for queues,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    getQueues(): Promise<RtiObjectIdentifier[] | null>;
    /**
     * Returns all CCD agent processing groups that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for agent processing groups,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    getAgentProcessingGroups(): Promise<RtiObjectIdentifier[] | null>;
    /**
     * Returns all CCD processing groups (other than agents) that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for other processing groups,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    getOtherProcessingGroups(): Promise<RtiObjectIdentifier[] | null>;
    /**
     * Returns the monitoring Context associated with this administrator (session).
     *
     * @returns The Context associated with this administrator, or `null` if none exists.
     */
    getContext(): Promise<RtiContext | null>;
    /**
     * Deletes the monitoring Context associated with this administrator (session),
     * stopping any RTI event notifications.
     *
     * @returns `true` if the deletion was successful; `false` otherwise.
     */
    deleteContext(): Promise<boolean>;
    /**
     * Associates or updates the monitoring Context for this administrator (session).
     * If no context exists, a new one is created.
     *
     * The context defines which objects and attributes are monitored and the
     * notification frequency for RTI events.
     *
     * @param context The Context to associate with this administrator.
     * @returns `true` if the update was successful; `false` otherwise.
     */
    setContext(context: RtiContext): Promise<boolean>;
    /**
     * Starts the monitoring of CCD objects according to the associated context.
     *
     * After calling this method, RTI events will be sent to any registered listeners.
     *
     * @returns `true` if the monitoring started successfully; `false` otherwise.
     */
    start(): Promise<boolean>;
}
//# sourceMappingURL=o2g-cc-rt.d.ts.map
import { StatisticsData } from './types/cc-stats/data/stats-data';
import { ProgressCallback } from './types/cc-stats/events/progress-callback';
import { Language } from './types/cc-stats/language';
import { Requester } from './types/cc-stats/requester';
import { ScheduledReport } from './types/cc-stats/scheduled/scheduled-report';
import { StatsFormat } from './types/cc-stats/stats-format';
import { StatsContext } from './types/cc-stats/stats-context';
import { StatsFilter } from './types/cc-stats/stats-filter';
import { TimeInterval } from './types/cc-stats/time-interval';
import { DateRange } from './types/common/date-range';
import { Recurrence } from './types/cc-stats/scheduled/recurrence';
import { ReportObservationPeriod } from './types/cc-stats/scheduled/report-obs-period';
/**
 * CallCenterStatistics provides access to historical ACD statistics and reporting.
 * Using this service requires having a <b>CONTACTCENTER_SRV</b> license.
 * <p>
 * Statistics are accessed through a two-level hierarchy:
 * <ul>
 * <li>A {@link Requester} defines the scope of agents whose data can be accessed.</li>
 * <li>A {@link StatsContext} defines the filter criteria (pilots, agents, queues)
 * for which statistics are collected.</li>
 * </ul>
 * <p>
 * The typical usage sequence for retrieving statistics is:
 * <ol>
 * <li>Create a requester with {@link createRequester}, specifying the agents in scope.</li>
 * <li>Create a context with {@link createContext}, specifying the filter criteria.</li>
 * <li>Retrieve data with {@link getDayData} for a single day, or {@link getDaysData}
 * for a date range.</li>
 * <li>Delete the context and requester when done.</li>
 * </ol>
 *
 * @example
 * ```typescript
 * // Create a requester scoped to two agents
 * const requester = await O2G.callCenterStatistics.createRequester(
 *     "myRequester",
 *     Language.ENGLISH,
 *     "Europe/Paris",
 *     "60119", "60120"
 * );
 *
 * // Create a context with a filter on a specific pilot
 * const filter = new StatsFilter();
 * filter.addPilot("60141");
 * const context = await O2G.callCenterStatistics.createContext(
 *     requester,
 *     "myContext",
 *     "Pilot 60141 statistics",
 *     filter
 * );
 *
 * // Retrieve statistics for today in 30-minute intervals
 * const data = await O2G.callCenterStatistics.getDayData(context, new Date(), TimeInterval.THIRTY_MINUTES);
 *
 * // Retrieve statistics for a date range
 * const range = new DateRange(new Date("2025-01-01"), new Date("2025-01-31"));
 * const monthData = await O2G.callCenterStatistics.getDaysData(context, range);
 *
 * // Clean up
 * await O2G.callCenterStatistics.deleteContexts(requester);
 * await O2G.callCenterStatistics.deleteRequester(requester);
 * ```
 */
export declare class CallCenterStatistics {
    #private;
    /**
     * Returns whether there is an asynchronous statistics request currently in progress.
     *
     * This can be useful to check before calling {@link getDayFileData} or {@link getDaysFileData},
     * since both methods enforce that only one request can run at a time.
     *
     * @returns `true` if a statistics request is currently active, `false` otherwise
     */
    hasAsyncRequestInProgress(): boolean;
    /**
     * Creates a new `Requester` with the specified identifier, language, and time zone,
     * and establishes the statistics scope defining which agents' data the requester
     * is authorized to access.
     *
     * This method determines the set of agents whose statistics can be retrieved by
     * the specified requester. Once the scope is created, the requester can query
     * individual or aggregated statistics for those agents through the reporting services.
     *
     * @example
     * ```typescript
     * // Create a requester scoped to specific agents
     * const requester = await O2G.callCenterStatistics.createRequester(
     *     "supervisor01",
     *     Language.ENGLISH,
     *     "Europe/Paris",
     *     "60119", "60120", "60121"
     * );
     *
     * // Create a requester scoped to a single agent
     * const singleAgentRequester = await O2G.callCenterStatistics.createRequester(
     *     "supervisor02",
     *     Language.FRENCH,
     *     "Europe/London",
     *     "60119"
     * );
     * ```
     *
     * @param id       the unique identifier of the requester
     * @param language the requester's preferred {@link Language}
     * @param timezone the requester's time zone (e.g. `"Europe/Paris"`)
     * @param agents   the agent identifiers that define the scope of accessible statistics
     * @returns the newly created {@link Requester} on success; `null` otherwise.
     * @see deleteRequester
     */
    createRequester(id: string, language: Language, timezone: string, ...agents: string[]): Promise<Requester | null>;
    /**
     * Removes the requester and all its associated contexts.
     *
     * After calling this method, the specified requester will no longer have
     * access to any agent statistics defined under their scope.
     *
     * @param requester - The requester to removed.
     * @returns `true` if the requester was successfully removed; otherwise, `false`.
     */
    deleteRequester(requester: Requester): Promise<boolean>;
    /**
     * Retrieves the requester associated with the specified identifier.
     *
     * The returned requester represents the scope of agents for which statistics
     * can be accessed. If no requester exists with the given ID, this method
     * returns `null`.
     *
     * @param id - The unique identifier of the requester.
     * @returns The `Requester` object corresponding to the ID, or `null`
     *          if no matching requester is found.
     */
    getRequester(id: string): Promise<Requester | null>;
    /**
     * Creates a new statistical context with the specified label, description, and filter
     * for the given requester.
     *
     * A context defines a scope for which call center statistics can be collected and analyzed
     * according to the specified filter criteria.
     *
     * @param requester - the requester for whom the context is being created
     * @param label - a short label identifying this context
     * @param description - a detailed description of the context
     * @param filter - the filter defining the selection criteria for the context
     * @returns the created `StatContext` if successful; `null` otherwise
     */
    createContext(requester: Requester, label: string, description: string, filter: StatsFilter): Promise<StatsContext | null>;
    /**
     * Deletes all statistical contexts associated with the specified requester.
     *
     * A context defines a scope for collecting and analyzing call center statistics
     * according to its associated filter criteria.
     *
     * @param requester - The requester whose contexts should be deleted.
     * @returns `true` if all contexts were successfully deleted; `false`
     * if an error occurred or no contexts were deleted.
     *
     * @see createContext
     */
    deleteContexts(requester: Requester): Promise<boolean>;
    /**
     * Retrieves the statistical contexts created for the specified requester.
     *
     * Each context defines a scope for collecting and analyzing call center statistics
     * according to its associated filter criteria.
     *
     * @param requester - The requester whose contexts are being retrieved.
     * @returns An array of `Context` objects if successful; `null`
     *          if there is an error or if no contexts exist for this requester.
     * @see createContext
     */
    getContexts(requester: Requester): Promise<StatsContext[] | null>;
    /**
     * Retrieves a statistical context by its identifier for the specified requester.
     *
     * A context defines a scope for collecting and analyzing call center statistics
     * according to its associated filter criteria.
     *
     * @param requester - The requester who owns the context.
     * @param contextId - The unique identifier of the context.
     * @returns The {@link Context} if found and retrieval is successful; `null`
     * if there is an error or if no context exists with the specified identifier.
     */
    getContext(requester: Requester, contextId: string): Promise<StatsContext | null>;
    /**
     * Deletes the specified statistical context.
     *
     * A context defines a scope for collecting and analyzing call center statistics
     * according to its associated filter criteria.
     *
     * @param context - The context to be deleted.
     * @returns `true` if the context was successfully deleted; `false`
     *          if an error occurred or the context could not be deleted.
     * @see createContext(requester: Requester, name: string, description: string, filter: Filter)
     */
    deleteContext(context: StatsContext): Promise<boolean>;
    /**
     * Retrieves statistical data for the specified context.
     *
     * This method generates a multi-day report corresponding to the time range
     * defined by the provided {@link DateRange}. It allows reporting and analysis
     * of call center metrics across multiple days within the selected period.
     *
     * The returned {@link StatisticsData} object contains the aggregated data,
     * suitable for further processing or integration.
     *
     * @param context - The context defining the scope and filters for the statistics.
     * @param range - The date range over which to collect statistics.
     * @returns A {@link StatisticsData} object containing the data,
     *          or `null` if the data could not be retrieved.
     */
    getDaysData(context: StatsContext, range: DateRange): Promise<StatisticsData | null>;
    /**
     * Retrieves statistical data for the specified context for a single day.
     *
     * The statistics are provided in time slots according to the `timeInterval` parameter.
     *
     * - If `date` is not provided, the current day is used.
     * - If `timeInterval` is not provided or `undefined`, it is ignored and
     *   `TimeInterval.QUARTE_HOUR` is used as the default value.
     *
     * @param context - The context defining the scope and filters for the statistics
     * @param date - (Optional) The specific day for which to collect statistics; defaults to today if not provided
     * @param timeInterval - (Optional) The time slot interval for reporting (e.g., 15 or 30 minutes);
     *                       defaults to `TimeInterval.QUARTE_HOUR` if not provided
     * @returns A `StatisticsData` object containing the data, or `null` if the data could not be retrieved
     */
    getDayData(context: StatsContext, date?: Date, timeInterval?: TimeInterval): Promise<StatisticsData | null>;
    /**
     * Asynchronously retrieves statistical data for the specified context for a single day
     * and stores it as a report file in the given directory.
     * <p>
     * The statistics are reported in time slots defined by the `timeInterval` parameter,
     * spanning from 00:00 until the last completed interval of the specified day.
     * <p>
     * Only one report generation request can be active at a time. Use
     * {@link hasAsyncRequestInProgress} to check before calling this method. Any attempt
     * to start another request while one is already in progress will reject the returned
     * `Promise` with an `Error`.
     *
     * @example
     * ```typescript
     * // Check no request is already running
     * if (!O2G.callCenterStatistics.hasAsyncRequestInProgress()) {
     *     const filePath = await O2G.callCenterStatistics.getDayFileData(
     *         context,
     *         new Date(2025, 9, 5), // October 5, 2025 (months are 0-based)
     *         TimeInterval.HOUR,
     *         StatsFormat.CSV,
     *         "/tmp/stats",
     *         (step) => console.log(`Progress: ${step}`)
     *     );
     *     console.log(`Report saved at: ${filePath}`);
     * }
     *
     * // Cancel if needed
     * await O2G.callCenterStatistics.cancelRequest(context);
     * ```
     *
     * @param context          the context defining the scope and filters for the statistics
     * @param date             the date for which to generate the report
     * @param timeInterval     the length of each reporting interval within the day
     * @param format           the output format for the report file
     * @param directory        the directory in which to save the generated report file
     * @param progressCallback optional callback invoked to report progress of the operation
     * @returns a `Promise` that resolves with the path to the generated report file,
     *          or rejects if an error occurs, the operation is cancelled, or another
     *          request is already in progress
     * @see getDaysFileData
     * @see hasAsyncRequestInProgress
     * @see cancelRequest
     */
    getDayFileData(context: StatsContext, date: Date, timeInterval: TimeInterval, format: StatsFormat, directory: string, progressCallback?: ProgressCallback): Promise<string>;
    /**
     * Asynchronously retrieves statistical data for the specified context over a date range
     * and stores it as a report file in the given directory.
     * <p>
     * Only one report generation request can be active at a time. Use
     * {@link hasAsyncRequestInProgress} to check before calling this method. Any attempt
     * to start another request while one is already in progress will reject the returned
     * `Promise` with an `Error`.
     *
     * @example
     * ```typescript
     * // Check no request is already running
     * if (!O2G.callCenterStatistics.hasAsyncRequestInProgress()) {
     *     const range = new DateRange(
     *         new Date(2025, 8, 1),  // September 1, 2025
     *         new Date(2025, 8, 30)  // September 30, 2025
     *     );
     *     const filePath = await O2G.callCenterStatistics.getDaysFileData(
     *         context,
     *         range,
     *         StatsFormat.CSV,
     *         "/tmp/stats",
     *         (step) => console.log(`Progress: ${step}`)
     *     );
     *     console.log(`Report saved at: ${filePath}`);
     * }
     *
     * // Cancel if needed
     * await O2G.callCenterStatistics.cancelRequest(context);
     * ```
     *
     * @param context          the context defining the scope and filters for the statistics
     * @param range            the date range over which to collect statistics
     * @param format           the output format for the report file
     * @param directory        the directory in which to save the generated report file
     * @param progressCallback optional callback invoked to report progress of the operation
     * @returns a `Promise` that resolves with the path to the generated report file,
     *          or rejects if an error occurs, the operation is cancelled, or another
     *          request is already in progress
     * @see getDayFileData
     * @see hasAsyncRequestInProgress
     * @see cancelRequest
     */
    getDaysFileData(context: StatsContext, range: DateRange, format: StatsFormat, directory: string, progressCallback?: ProgressCallback): Promise<string>;
    /**
     * Attempts to cancel an ongoing statistics report generation for the specified context.
     *
     * If a report generation process for the given `context` is currently running,
     * this method will attempt to stop it. Cancellation may succeed only if the process
     * has not already completed.
     *
     * The method returns immediately and does not block until the process is fully terminated.
     *
     * @param context - The context identifying the report generation process to cancel
     * @returns `true` if a running report generation was found and successfully requested to be cancelled,
     *          `false` if there was no running process for the specified context or if it could not be cancelled
     */
    cancelRequest(context: StatsContext): Promise<boolean>;
    /**
     * Creates a new recurrent scheduled report with the specified configuration.
     * <p>
     * The report will be generated repeatedly according to the given `recurrence`
     * pattern and `observationPeriod`, formatted in the specified output format,
     * and sent to the provided recipients.
     *
     * @example
     * ```typescript
     * // Create a weekly report sent every Monday covering the previous week
     * const report = await O2G.callCenterStatistics.createRecurrentScheduledReport(
     *     context,
     *     "weeklyReport",
     *     "Weekly pilot statistics",
     *     ReportObservationPeriod.PREVIOUS_WEEK,
     *     Recurrence.WEEKLY,
     *     StatsFormat.CSV,
     *     ["supervisor@company.com", "manager@company.com"]
     * );
     *
     * // Disable the report temporarily
     * await O2G.callCenterStatistics.setScheduledReportEnabled(report, false);
     *
     * // Re-enable it later
     * await O2G.callCenterStatistics.setScheduledReportEnabled(report, true);
     * ```
     *
     * @param context           the context defining which data and counters to include
     * @param id                a unique identifier for the scheduled report
     * @param description       a human-readable description of the report
     * @param observationPeriod the period over which statistics are collected
     * @param recurrence        the recurrence pattern for generating the report
     * @param format            the output format of the report
     * @param recipients        the list of email addresses to receive the report
     * @returns the newly created {@link ScheduledReport} on success; `null` otherwise.
     * @see createOneTimeScheduledReport
     * @see deleteScheduledReport
     * @see setScheduledReportEnabled
     */
    createRecurrentScheduledReport(context: StatsContext, id: string, description: string, observationPeriod: ReportObservationPeriod, recurrence: Recurrence, format: StatsFormat, recipients: string[]): Promise<ScheduledReport | null>;
    /**
     * Creates a new one-time scheduled report with the specified configuration.
     * <p>
     * Unlike {@link createRecurrentScheduledReport}, this report is generated only
     * once for the specified `observationPeriod`, then it is no longer active.
     *
     * @example
     * ```typescript
     * // Create a one-time report covering the previous month
     * const report = await O2G.callCenterStatistics.createOneTimeScheduledReport(
     *     context,
     *     "monthlySnapshot",
     *     "End of month statistics snapshot",
     *     ReportObservationPeriod.PREVIOUS_MONTH,
     *     StatsFormat.CSV,
     *     ["supervisor@company.com"]
     * );
     * ```
     *
     * @param context           the context defining which data and counters to include
     * @param id                a unique identifier for the scheduled report
     * @param description       a human-readable description of the report
     * @param observationPeriod the period over which statistics are collected
     * @param format            the output format of the report
     * @param recipients        the list of email addresses to receive the report
     * @returns the newly created {@link ScheduledReport} on success; `null` otherwise.
     * @see createRecurrentScheduledReport
     * @see deleteScheduledReport
     */
    createOneTimeScheduledReport(context: StatsContext, id: string, description: string, observationPeriod: ReportObservationPeriod, format: StatsFormat, recipients: string[]): Promise<ScheduledReport | null>;
    /**
     * Returns all scheduled reports associated with the given context.
     *
     * @param context - The context defining which reports to retrieve
     * @returns An array of {@link ScheduledReport} objects for the specified context;
     *          may be empty if no reports exist
     */
    getScheduledReports(context: StatsContext): Promise<ScheduledReport[] | null>;
    /**
     * Deletes the specified scheduled report.
     *
     * @param report The scheduled report to delete.
     * @returns `true` if the report was successfully deleted, `false` otherwise.
     */
    deleteScheduledReport(report: ScheduledReport): Promise<boolean>;
    /**
     * Enables or disables the specified scheduled report.
     *
     * @param report The scheduled report to update.
     * @param enabled `true` to enable the report, `false` to disable it.
     * @returns `true` if the report state was successfully updated, `false` otherwise.
     */
    setScheduledReportEnabled(report: ScheduledReport, enabled: boolean): Promise<boolean>;
    /**
     * Retrieves a previously created scheduled report by its unique identifier.
     *
     * This method requires a valid `StatsContext` to perform the retrieval operation.
     * The `scheduleReportId` must correspond to an existing scheduled report.
     *
     * @param context The session context used to access the service.
     * @param scheduleReportId The unique identifier of the scheduled report to retrieve.
     * @returns The `ScheduledReport` corresponding to the specified ID,
     *          or `null` if no report exists with that ID.
     */
    getScheduledReport(context: StatsContext, scheduleReportId: string): Promise<ScheduledReport | null>;
    /**
     * Updates the configuration of an existing scheduled report.
     *
     * This method persists any changes made to the provided `ScheduledReport` instance,
     * including its description, observation period, recurrence, format, and recipients.
     * Implementations should ensure that the report exists and that the updates are valid.
     *
     * @param report The `ScheduledReport` instance containing the updated information.
     * @returns `true` if the update was successful; `false` if the report does not exist
     *          or the update could not be applied.
     */
    updateScheduledReport(report: ScheduledReport): Promise<boolean>;
}
//# sourceMappingURL=o2g-cc-stat.d.ts.map
import EventEmitter from 'events';
import { Page } from './types/comlog/page';
import { QueryFilter } from './types/comlog/query-filter';
import { QueryResult } from './types/comlog/query-result';
import { ComRecord } from './types/comlog/com-record';
/**
 * The CommunicationLog service allows a user to retrieve their last communication
 * history records and to manage them. Using this service requires having a
 * <b>TELEPHONY_ADVANCED</b> license.
 *
 * @example
 * ```typescript
 * // Query the last 10 unanswered records
 * const filter = new QueryFilter();
 * filter.setUnacknowledged(true);
 *
 * const page = new Page(0, 10);
 *
 * const result = await O2G.comlog.getComRecords(filter, page, true);
 * if (result) {
 *     console.log(`Total records: ${result.totalCount}`);
 *
 *     // Acknowledge all retrieved records
 *     const ids = result.records.map(r => r.recordId);
 *     await O2G.comlog.acknowledgeComRecords(ids);
 *
 *     // Delete records matching the filter
 *     await O2G.comlog.deleteComRecords(filter);
 * }
 * ```
 */
export declare class CommunicationLog extends EventEmitter {
    #private;
    /**
     * Occurs when a new comlog entry has been created.
     * @event
     */
    static readonly ON_COM_RECORD_CREATED = "OnComRecordCreated";
    /**
     * Occurs when one or more records have been modified.
     * @event
     */
    static readonly ON_COM_RECORD_MODIFIED = "OnComRecordModified";
    /**
     * Occurs when one or more call log records have been deleted.
     * @see deleteComRecords
     * @see deleteComRecord
     * @see deleteComRecordsById
     * @event
     */
    static readonly ON_COM_RECORDS_DELETED = "OnComRecordsDeleted";
    /**
     * Occurs when one or more unanswered comlog records have been acknowledged.
     * @see acknowledgeComRecords
     * @see acknowledgeComRecord
     * @event
     */
    static readonly ON_COM_RECORDS_ACK = "OnComRecordsAck";
    /**
     * Occurs when one or more unanswered comlog records have been unacknowledged.
     * @see unacknowledgeComRecords
     * @see unacknowledgeComRecord
     * @event
     */
    static readonly ON_COM_RECORDS_UNACK = "OnComRecordsUnAck";
    /**
     * Gets the com records corresponding to the specified filter, using the
     * specified page, with a possible optimization.
     * <p>
     * If `optimized` is set to `true`, the query returns the full identity of a
     * participant only the first time it occurs, when the same participant appears
     * in several records. When omitted, records are returned with no optimization.
     * <p>
     * The `page` parameter allows querying the communication log by page. The
     * {@link QueryResult} contains the same parameters and the total number of
     * records retrieved by the query.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Get all records with no filter, no pagination
     * const all = await O2G.comlog.getComRecords();
     *
     * // Get only missed calls, first page of 20, with optimization
     * const filter = new QueryFilter();
     * filter.setCallType(FilterOption.MISSED);
     * const page = new Page(0, 20);
     * const missed = await O2G.comlog.getComRecords(filter, page, true);
     *
     * // Administrator querying records for a specific user
     * const userRecords = await O2G.comlog.getComRecords(null, null, false, "jdoe");
     * ```
     *
     * @param filter    the filter describing the query criteria
     * @param page      the page description
     * @param optimized `true` to activate optimization
     * @param loginName the user login name
     * @returns the {@link QueryResult} on success; `null` otherwise.
     */
    getComRecords(filter?: QueryFilter | null, page?: Page | null, optimized?: boolean, loginName?: string | null): Promise<QueryResult | null>;
    /**
     * Gets the specified com record.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns the {@link ComRecord} on success; `null` otherwise.
     */
    getComRecord(recordId: string, loginName?: string | null): Promise<ComRecord | null>;
    /**
     * Deletes the specified com record.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecordsById
     * @see deleteComRecords
     */
    deleteComRecord(recordId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Deletes the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_DELETED} event is raised containing the list of
     * com records that have been deleted.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to delete
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecord
     * @see deleteComRecords
     */
    deleteComRecordsById(recordIds: string[], loginName?: string | null): Promise<boolean>;
    /**
     * Deletes the com records corresponding to the given filter.
     * <p>
     * The `filter` parameter defines the search criteria for the delete operation.
     * <p>
     * An {@link ON_COM_RECORDS_DELETED} event is raised containing the list of
     * com records that have been deleted.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Delete all acknowledged records
     * const filter = new QueryFilter();
     * filter.setAcknowledged(true);
     * await O2G.comlog.deleteComRecords(filter);
     *
     * // Delete all records (no filter)
     * await O2G.comlog.deleteComRecords();
     *
     * // Note: to delete specific records by id, use deleteComRecordsById instead
     * await O2G.comlog.deleteComRecordsById(["id1", "id2", "id3"]);
     * ```
     *
     * @param filter    the filter describing the query criteria
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecord
     * @see deleteComRecordsById
     */
    deleteComRecords(filter?: QueryFilter | null, loginName?: string | null): Promise<boolean>;
    /**
     * Acknowledges the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_ACK} event is raised containing the list of
     * com records that have been acknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to acknowledge
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see acknowledgeComRecord
     */
    acknowledgeComRecords(recordIds: string[], loginName?: string | null): Promise<boolean>;
    /**
     * Acknowledges the specified com record.
     * <p>
     * An {@link ON_COM_RECORDS_ACK} event is raised containing the list of
     * com records that have been acknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see acknowledgeComRecords
     */
    acknowledgeComRecord(recordId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Unacknowledges the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_UNACK} event is raised containing the list of
     * com records that have been unacknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to unacknowledge
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unacknowledgeComRecord
     */
    unacknowledgeComRecords(recordIds: string[], loginName?: string | null): Promise<boolean>;
    /**
     * Unacknowledges the specified com record.
     * <p>
     * An {@link ON_COM_RECORDS_UNACK} event is raised containing the list of
     * com records that have been unacknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unacknowledgeComRecords
     */
    unacknowledgeComRecord(recordId: string, loginName?: string | null): Promise<boolean>;
}
//# sourceMappingURL=o2g-comlog.d.ts.map
import { Criteria } from './types/directory/criteria';
import { SearchResult } from './types/directory/search-result';
/**
 * The DirectoryService is used to search contacts in the OmniPCX
 * Enterprise phone book. Using this service requires having a
 * <b>TELEPHONY_ADVANCED</b> license.
 * <p>
 * A directory search is a set of 2 or more sequential operations:
 * <ol>
 * <li>The first operation initiates the search with a set of criteria.</li>
 * <li>The second and subsequent operations retrieve results.</li>
 * </ol>
 * <p>
 * Note: For each session (user or administrator), only 5 concurrent searches
 * are authorized. An unused search context is freed after 1 minute.
 *
 * @example
 * ```typescript
 *   await o2g.directory.search(myCriteria);
 *   while (!finished) {
 *      let result = await o2g.directory.getResults();
 *      if (result.getResultCode() == SearchResult.ResultCode.NOK) {
 *         // Wait for results
 *      }
 *      else if ((result.getResultCode() == SearchResult.ResultCode.FINISH) ||
 *               (result.getResultCode() == SearchResult.ResultCode.TIMEOUT)) {
 *          // Exit the loop
 *          finished = true;
 *      }
 *      else {
 *         // Process results
 *      }
 *   }
 * ```
 */
export declare class Directory {
    #private;
    /**
     * Initiates a directory search with the specified filter, limited to the
     * specified number of results.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param filter    the search filter
     * @param limit     maximum number of results, in the range [1..100]
     * @param loginName the user login name
     * @returns `true` if the search was successfully initiated; `false` otherwise.
     * @see getResults
     * @see cancel
     */
    search(filter: Criteria, limit?: number | null, loginName?: string | null): Promise<boolean>;
    /**
     * Cancels the current search query for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see search
     */
    cancel(loginName?: string | null): Promise<boolean>;
    /**
     * Gets the next available results for the current search.
     * <p>
     * `getResults` is generally called in a loop. For each iteration:
     * <ul>
     * <li>if the result code is `NOK`, the search is in progress but no results are
     * available â€” it is recommended to wait before the next iteration (e.g. 500ms)</li>
     * <li>if the result code is `OK`, results are available and can be processed</li>
     * <li>if the result code is `FINISH` or `TIMEOUT`, the search has ended â€” exit the loop</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * await O2G.directory.search(criteria);
     *
     * let finished = false;
     * while (!finished) {
     *     const result = await O2G.directory.getResults();
     *     if (result?.resultCode === SearchResult.ResultCode.NOK) {
     *         // Search still in progress, wait before retrying
     *         await new Promise(resolve => setTimeout(resolve, 500));
     *     }
     *     else if (result?.resultCode === SearchResult.ResultCode.OK) {
     *         // Process available results
     *         result.items.forEach(item => console.log(item.firstName, item.lastName));
     *     }
     *     else {
     *         // FINISH or TIMEOUT â€” search is complete
     *         finished = true;
     *     }
     * }
     * ```
     *
     * @param loginName the user login name
     * @returns the {@link SearchResult} on success; `null` otherwise.
     * @see search
     */
    getResults(loginName?: string | null): Promise<SearchResult | null>;
}
//# sourceMappingURL=o2g-directory.d.ts.map
import { EventEmitter } from 'events';
import { EventSummaryCounters } from './types/eventsummary/event-summary-counter';
/**
 * The Event summary service allows a user to get its new message
 * indicators (missed call, voice mails, callback request, fax).
 * <p>
 * Using this service requires having a <b>TELEPHONY_ADVANCED</b> license.
 *
 * @example
 * ```typescript
 * // Listen for counter updates and refresh on each change
 * O2G.eventSummary.on(EventSummary.ON_EVENT_SUMMARY_UPDATED, async () => {
 *     const counters = await O2G.eventSummary.get();
 *     if (counters) {
 *         console.log(`Missed calls: ${counters.missedCalls}`);
 *         console.log(`Voice mails: ${counters.voiceMails}`);
 *         console.log(`Callbacks: ${counters.callbacks}`);
 *     }
 * });
 *
 * // Or fetch counters on demand without waiting for an event
 * const counters = await O2G.eventSummary.get();
 * ```
 */
export declare class EventSummary extends EventEmitter {
    #private;
    /**
     * Event raised each time the user's counters have changed.
     * @event
     */
    static readonly ON_EVENT_SUMMARY_UPDATED = "OnEventSummaryUpdated";
    /**
     * Retrieves main counters for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link EventSummaryCounters} on success; `null` otherwise.
     */
    get(loginName?: string | null): Promise<EventSummaryCounters | null>;
}
//# sourceMappingURL=o2g-eventSummary.d.ts.map
import EventEmitter from 'events';
import { SystemStatus } from './types/maint/sys-status';
/**
 * The MaintenanceService allows retrieving information about the system state,
 * in particular information on the PBX nodes and their connection state.
 * Information about licenses is also provided per item: total allocated licenses,
 * number currently in use, and expiration date.
 * <p>
 * This service is available to administrator sessions only.
 *
 * @example
 * ```typescript
 * // Monitor system readiness and connection state
 * O2G.maintenance.on(Maintenance.ON_SERVER_STARTED, async () => {
 *     console.log("O2G server is ready");
 *     const status = await O2G.maintenance.getSystemStatus();
 *     if (status) {
 *         console.log(`Connected PBXs: ${status.pbxs.length}`);
 *     }
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_PBX_LINK_DOWN, (event) => {
 *     console.warn(`PBX link down: node ${event.nodeId}`);
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_PBX_LINK_UP, (event) => {
 *     console.log(`PBX link restored: node ${event.nodeId}`);
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_LICENSE_EXPIRATION, (event) => {
 *     console.warn(`License expiring soon: ${event.licenseType}`);
 * });
 * ```
 */
export declare class Maintenance extends EventEmitter {
    #private;
    /**
     * Occurs when a CTI link is down.
     * @event
     */
    static readonly ON_CTI_LINK_DOWN = "OnCtiLinkDown";
    /**
     * Occurs when a CTI link is up.
     * @event
     */
    static readonly ON_CTI_LINK_UP = "OnCtiLinkUp";
    /**
     * Occurs when a PBX link is down.
     * @event
     */
    static readonly ON_PBX_LINK_DOWN = "OnPbxLinkDown";
    /**
     * Occurs when a PBX link is up.
     * @event
     */
    static readonly ON_PBX_LINK_UP = "OnPbxLinkUp";
    /**
     * Occurs when data is fully loaded from an OmniPCX Enterprise node.
     * @event
     */
    static readonly ON_PBX_LOADED = "OnPbxLoaded";
    /**
     * Occurs when the license file will soon expire or has recently expired.
     * @event
     */
    static readonly ON_LICENSE_EXPIRATION = "OnLicenseExpiration";
    /**
     * Occurs when O2G is ready (all OXE nodes are connected and loaded).
     * @event
     */
    static readonly ON_SERVER_STARTED = "OnServerStart";
    /**
     * Retrieves information about the system state and the total number of each
     * license type available for the system.
     * <p>
     * This operation is restricted to an administrator session only.
     *
     * @returns the {@link SystemStatus} on success; `null` otherwise.
     */
    getSystemStatus(): Promise<SystemStatus | null>;
}
//# sourceMappingURL=o2g-maint.d.ts.map
import { MailBox } from './types/messaging/mailbox';
import { MailBoxInfo } from './types/messaging/mailbox-info';
import { VoiceMessage } from './types/messaging/voice-message';
/**
 * Messaging service provides access to the user's voice mail box.
 * It is possible using this service to connect to the voice mail box, retrieve
 * the information and the list of voice mails, and manage the mail box. Using
 * this service requires having a <b>TELEPHONY_ADVANCED</b> license.
 * <p>
 * It is possible to download a voice mail as a wav file and to delete existing messages.
 */
export declare class Messaging {
    #private;
    /**
     * Gets the specified user's mailboxes. This is the logical first step to
     * access further operations on the voice mail feature.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the list of {@link MailBox} objects on success; `null` otherwise.
     */
    getMailboxes(loginName?: string | null): Promise<MailBox[] | null>;
    /**
     * Gets the information on the specified mail box.
     * <p>
     * The `password` is optional. If not set, the user password is used to
     * connect to the voicemail. This is only possible if the OmniPCX Enterprise
     * administrator has configured the same password for the user and their mailbox.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailBoxId the mail box identifier given in a {@link MailBox} object
     * @param password  the mail box password
     * @param loginName the user login name
     * @returns the {@link MailBoxInfo} on success; `null` otherwise.
     */
    getMailboxInfo(mailBoxId: string, password?: string | null, loginName?: string | null): Promise<MailBoxInfo | null>;
    /**
     * Gets the list of voice messages in the specified mail box.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * @example
     * ```typescript
     * // Get all voice messages in the mailbox
     * const messages = await O2G.messaging.getVoiceMessages("mbx001");
     *
     * // Get only unread messages
     * const newMessages = await O2G.messaging.getVoiceMessages("mbx001", true);
     *
     * // Get a page of 10 messages starting from the 20th
     * const page = await O2G.messaging.getVoiceMessages("mbx001", false, 20, 10);
     * ```
     *
     * @param mailboxId the mail box identifier given in a {@link MailBox} object
     * @param newOnly   if `true`, returns only unread voice messages
     * @param offset    the offset from which to start retrieving the voice message list
     * @param limit     the maximum number of items to return
     * @param loginName the user login name
     * @returns the list of {@link VoiceMessage} objects on success; `null` otherwise.
     */
    getVoiceMessages(mailboxId: string, newOnly?: boolean, offset?: number | null, limit?: number | null, loginName?: string | null): Promise<VoiceMessage[] | null>;
    /**
     * Deletes the specified voice message.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param loginName   the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteVoiceMessages
     */
    deleteVoiceMessage(mailboxId: string, voicemailId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Acknowledges the specified voice message.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param loginName   the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    acknowledgeVoiceMessage(mailboxId: string, voicemailId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Deletes the specified list of voice messages.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId the mail box identifier given in a {@link MailBox} object
     * @param msgIds    the list of voice mail identifiers to delete
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteVoiceMessage
     */
    deleteVoiceMessages(mailboxId: string, msgIds: string[], loginName?: string | null): Promise<boolean>;
    /**
     * Downloads a voice mail as a wav file.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Download to a specific path
     * const path = await O2G.messaging.downloadVoiceMessage("mbx001", "msg42", "/tmp/voicemail.wav");
     *
     * // Let the SDK choose the destination path
     * const autoPath = await O2G.messaging.downloadVoiceMessage("mbx001", "msg42", null);
     * if (autoPath) {
     *     console.log(`Downloaded to: ${autoPath}`);
     * }
     * ```
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param wavPath     an optional destination file path for the downloaded wav file
     * @param loginName   the user login name
     * @returns the path to the downloaded wav file on success; `null` otherwise.
     */
    downloadVoiceMessage(mailboxId: string, voicemailId: string, wavPath: string | null, loginName?: string | null): Promise<string | null>;
}
//# sourceMappingURL=o2g-messaging.d.ts.map
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
export * from './host';
export * from './subscription';
export * from './supervised-account';
import { Routing } from './o2g-routing';
import { EventSummary } from './o2g-eventSummary';
import { Directory } from './o2g-directory';
import { Users } from './o2g-users';
import { Telephony } from './o2g-telephony';
import { CommunicationLog } from './o2g-comlog';
import { Analytics } from './o2g-analytics';
import { CallCenterAgent } from './o2g-cc-agent';
import { CallCenterPilot } from './o2g-cc-pilot';
import { Maintenance } from './o2g-maint';
import { PbxManagement } from './o2g-pbx-mngt';
import { PhoneSetProgramming } from './o2g-phone-set-prog';
import { Messaging } from './o2g-messaging';
import { Subscription } from './subscription';
import { UsersManagement } from './o2g-users-mngt';
import { CallCenterManagement } from './o2g-cc-mngt';
import { CallCenterRealtime } from './o2g-cc-rt';
import { CallCenterStatistics } from './o2g-cc-stat';
import { SupervisedAccount } from './supervised-account';
import { Host } from './host';
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
 * O2G.initialize("MyApp", { privateAddress: "192.168.1.1" });
 * const success = await O2G.login("user", "password");
 * if (success) {
 *     await O2G.subscribe(subscription);
 *     const calls = await O2G.telephony.getCalls();
 * }
 * ```
 */
export declare class O2G {
    /**
     * The event name fired when O2G channel information is received.
     * Use with {@link O2G.on} to listen for channel information events.
     */
    static get O2G_ONCHANNEL_INFORMATION(): string;
    private static _application;
    private static _logger;
    private static _routing;
    private static _eventSummary;
    private static _users;
    private static _usersManagement;
    private static _telephony;
    private static _directory;
    private static _comlog;
    private static _analytics;
    private static _callCenterAgent;
    private static _callCenterPilot;
    private static _callCenterRealtime;
    private static _callCenterStatistics;
    private static _callCenterManagement;
    private static _maintenance;
    private static _pbxManagement;
    private static _phoneSetProgramming;
    private static _messaging;
    /**
     * Initializes the O2G application with the given name, host, and optional API version.
     * <p>
     * This method must be called before any other method. It can only be called once;
     * subsequent calls will throw an error.
     *
     * @param appName    the application name, used to identify this client on the O2G server
     * @param host       the O2G server host configuration
     * @param apiVersion the API version to use. Defaults to `"1.0"`
     * @throws {Error} if the application has already been initialized
     */
    static initialize(appName: string, host: Host, apiVersion?: string): void;
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
    static login(loginName: string, password: string, supervisedAccount?: SupervisedAccount | null): Promise<boolean>;
    /**
     * Subscribes to O2G events using the given subscription configuration.
     * <p>
     * Must be called after a successful {@link O2G.login} to start receiving events.
     * Use {@link O2G.on} to register listeners for specific event types.
     *
     * @param subscription the subscription configuration specifying which event packages to receive
     * @throws {Error} if the application has not been initialized
     */
    static subscribe(subscription: Subscription): Promise<void>;
    /**
     * Gracefully shuts down the O2G application, closing the session and releasing all resources.
     * <p>
     * After calling this method, {@link O2G.initialize} must be called again before reuse.
     */ static shutdown(): Promise<void>;
    /**
     * Registers an event listener for the specified O2G event.
     *
     * @param event    the event name to listen for
     * @param listener the callback function invoked when the event is fired
     * @throws {Error} if the application has not been initialized
     */
    static on(event: string, listener: (...args: any[]) => void): void;
    /**
     * Removes a previously registered event listener for the specified O2G event.
     *
     * @param event    the event name
     * @param listener the callback function to remove
     * @throws {Error} if the application has not been initialized
     */
    static off(event: string, listener: (...args: any[]) => void): void;
    /**
     * Returns the {@link Routing} service, which provides call routing and forwarding management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get routing(): Routing;
    /**
     * Returns the {@link EventSummary} service, which provides access to event summary counters.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get eventSummary(): EventSummary;
    /**
     * Returns the {@link Users} service, which provides user profile and preference management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get users(): Users;
    /**
     * Returns the {@link UsersManagement} service, which provides administrator-level user management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get usersManagement(): UsersManagement;
    /**
     * Returns the {@link Telephony} service, which provides call control and telephony operations.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get telephony(): Telephony;
    /**
     * Returns the {@link Directory} service, which provides enterprise directory search.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get directory(): Directory;
    /**
     * Returns the {@link CommunicationLog} service, which provides access to communication history records.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get comlog(): CommunicationLog;
    /**
     * Returns the {@link Analytics} service, which provides access to charging and incident data.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get analytics(): Analytics;
    /**
     * Returns the {@link CallCenterAgent} service, which provides ACD agent state and skill management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get callCenterAgent(): CallCenterAgent;
    /**
     * Returns the {@link CallCenterPilot} service, which provides CCD pilot monitoring.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get callCenterPilot(): CallCenterPilot;
    /**
     * Returns the {@link CallCenterRealtime} service, which provides real-time ACD statistics and RTI data.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get callCenterRealtime(): CallCenterRealtime;
    /**
     * Returns the {@link CallCenterStatistics} service, which provides historical ACD statistics and reporting.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get callCenterStatistics(): CallCenterStatistics;
    /**
     * Returns the {@link CallCenterManagement} service, which provides CCD pilot and calendar management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get callCenterManagement(): CallCenterManagement;
    /**
     * Returns the {@link Maintenance} service, which provides system status and PBX health information.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get maintenance(): Maintenance;
    /**
     * Returns the {@link PbxManagement} service, which provides PBX object model access and configuration.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get pbxManagement(): PbxManagement;
    /**
     * Returns the {@link PhoneSetProgramming} service, which provides phone device key and pin management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get phoneSetProgramming(): PhoneSetProgramming;
    /**
     * Returns the {@link Messaging} service, which provides voicemail and mailbox management.
     * @throws {Error} if the service is not available (login not completed)
     */
    static get messaging(): Messaging;
}
export { Routing } from './o2g-routing';
export { EventSummary } from './o2g-eventSummary';
export { Directory } from './o2g-directory';
export { Users } from './o2g-users';
export { Telephony } from './o2g-telephony';
export { CommunicationLog } from './o2g-comlog';
export { Analytics } from './o2g-analytics';
export { CallCenterAgent } from './o2g-cc-agent';
export { CallCenterPilot } from './o2g-cc-pilot';
export { Maintenance } from './o2g-maint';
export { PbxManagement } from './o2g-pbx-mngt';
export { PhoneSetProgramming } from './o2g-phone-set-prog';
export { Messaging } from './o2g-messaging';
export { UsersManagement } from './o2g-users-mngt';
export { CallCenterManagement } from './o2g-cc-mngt';
export { CallCenterRealtime } from './o2g-cc-rt';
export { CallCenterStatistics } from './o2g-cc-stat';
//# sourceMappingURL=o2g-node-sdk.d.ts.map
import { Model } from './types/pbxmngt/model';
import { PbxAttribute } from './types/pbxmngt/pbx-attribute';
import { PbxObject } from './types/pbxmngt/pbx-object';
import { InstanceFilter } from './types/pbxmngt/instance-filter';
import EventEmitter from 'events';
import { Pbx } from './types/pbxmngt/pbx';
/**
 * PbxManagement service allows an administrator to manage an OmniPCX
 * Enterprise, that is to create, modify or delete any object or sub-object in the
 * OmniPCX Enterprise object model. Using this service requires having a
 * <b>MANAGEMENT</b> license.
 * <p>
 * <b>WARNING:</b> Using this service requires a good knowledge of the
 * OmniPCX Enterprise object model.
 * <p>
 * The service uses two kinds of resource: the object model resource and the
 * object instance resource.
 * <p><b><u>The object model</u></b>: The object model can be retrieved for the whole PBX
 * or for a particular object. It provides the detail of object attributes:
 * whether the attribute is mandatory or optional in the object creation, what
 * range of values is authorized, and what the possible enumeration values are.
 * <p><b><u>The object instance</u></b>: It is used to create, modify, retrieve or remove
 * any instances of any object, given the reference of this object. For the
 * creation or modification of an object, the body must be compliant with
 * the object model.
 * <p>
 * The list of sub-objects returned by a get instance of an object corresponds
 * to the relative path of the first instantiable objects in the hierarchy,
 * in order to be able by recursion to build the path to access any object
 * and sub-object.
 * <p>
 * When accessing an object which is a sub-object, the full path must be given:
 * `{object1Name}/{object1Id}/{object2Name}/{object2Id}/.../{objectxName}/{objectxId}`.
 *
 * @example
 * ```typescript
 * // Inspect the object model for the Subscriber object
 * const model = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
 *
 * // Query all analog subscriber instances on node 1
 * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", "StationType==ANALOG");
 *
 * if (ids && ids.length > 0) {
 *     // Retrieve a specific subscriber with selected attributes
 *     const obj = await O2G.pbxManagement.getObject(
 *         1, "Subscriber", ids[0],
 *         [new PbxAttribute("StationType"), new PbxAttribute("Directory")]
 *     );
 *
 *     // Modify an attribute
 *     await O2G.pbxManagement.setObject(
 *         1, "Subscriber", ids[0],
 *         [new PbxAttribute("Directory", "60200")]
 *     );
 * }
 *
 * // Create a new subscriber
 * await O2G.pbxManagement.createObject(1, "Subscriber", [
 *     new PbxAttribute("StationType", "ANALOG"),
 *     new PbxAttribute("Directory", "60300")
 * ]);
 *
 * // Delete a subscriber, forcing deletion even if they have voice mails
 * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60300", true);
 *
 * // Listen for object change events
 * O2G.pbxManagement.on(PbxManagement.ON_PBX_OBJECT_INSTANCE_MODIFIED, (event) => {
 *     console.log("Object modified:", event.objectName, event.objectId);
 * });
 * ```
 */
export declare class PbxManagement extends EventEmitter {
    #private;
    /**
     * Occurs when a PBX object instance is created.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_CREATED = "OnPbxObjectInstanceCreated";
    /**
     * Occurs when a PBX object instance is deleted.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_DELETED = "OnPbxObjectInstanceDeleted";
    /**
     * Occurs when a PBX object instance is modified.
     * Only Object Subscriber is concerned by this event.
     * @event
     */
    static readonly ON_PBX_OBJECT_INSTANCE_MODIFIED = "OnPbxObjectInstanceModified";
    /**
     * Gets the list of OmniPCX Enterprise nodes connected on this O2G server.
     *
     * @returns the list of node ids on success; `null` otherwise.
     */
    getPbxs(): Promise<number[] | null>;
    /**
     * Gets the OmniPCX Enterprise specified by its node id.
     *
     * @param nodeId the PCX Enterprise node id
     * @returns the {@link Pbx} on success; `null` otherwise.
     */
    getPbx(nodeId: number): Promise<Pbx | null>;
    /**
     * Gets the description of the data model for the specified object on the
     * specified OmniPCX Enterprise node.
     * <p>
     * If `objectName` is `null`, the global object model of the OmniPCX Enterprise
     * node is returned.
     *
     * @example
     * ```typescript
     * // Get the global object model for node 1
     * const globalModel = await O2G.pbxManagement.getObjectModel(1);
     *
     * // Get the model for a specific object
     * const subscriberModel = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
     * ```
     *
     * @param nodeId     the OmniPCX Enterprise node id
     * @param objectName the object name, or `null` to retrieve the global model
     * @returns the {@link Model} on success; `null` otherwise.
     */
    getObjectModel(nodeId: number, objectName?: string | null): Promise<Model | null>;
    /**
     * Gets the node (root) object.
     *
     * @param nodeId the OmniPCX Enterprise node id
     * @returns the root {@link PbxObject} on success; `null` otherwise.
     */
    getNodeObject(nodeId: number): Promise<PbxObject | null>;
    /**
     * Gets the object specified by its instance definition and its instance id.
     *
     * @example
     * ```typescript
     * // Retrieve all attributes of a subscriber
     * const obj = await O2G.pbxManagement.getObject(1, "Subscriber", "60200");
     *
     * // Retrieve only specific attributes using a comma-separated string
     * const partial = await O2G.pbxManagement.getObject(
     *     1, "Subscriber", "60200", "StationType,Directory"
     * );
     *
     * // Retrieve specific attributes using a PbxAttribute array
     * const typed = await O2G.pbxManagement.getObject(
     *     1, "Subscriber", "60200",
     *     [new PbxAttribute("StationType"), new PbxAttribute("Directory")]
     * );
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param attributes               optional attributes to retrieve â€” either a
     *                                 comma-separated attribute name string or an
     *                                 array of {@link PbxAttribute} objects
     * @returns the {@link PbxObject} on success; `null` otherwise.
     */
    getObject(nodeId: number, objectInstanceDefinition: string, objectId: string, attributes?: string | PbxAttribute[] | null): Promise<PbxObject | null>;
    /**
     * Queries the list of object instances that match the specified filter.
     * <p>
     * A filter can be built using the {@link InstanceFilter} class, or provided
     * as a string expression.
     *
     * @example
     * ```typescript
     * // Using an InstanceFilter object
     * const filter = InstanceFilter.create(
     *     "StationType",
     *     AttributeFilter.Equals,
     *     "ANALOG"
     * );
     * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", filter);
     *
     * // Using a string expression
     * const ids2 = await O2G.pbxManagement.getObjectInstances(
     *     1, "Subscriber", "StationType==ANALOG"
     * );
     *
     * // Get all instances with no filter
     * const all = await O2G.pbxManagement.getObjectInstances(1, "Subscriber");
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param filter                   an optional filter â€” either an {@link InstanceFilter}
     *                                 object or a string expression
     * @returns the list of matching object instance ids on success; `null` otherwise.
     */
    getObjectInstances(nodeId: number, objectInstanceDefinition: string, filter?: string | InstanceFilter | null): Promise<string[] | null>;
    /**
     * Changes one or several attribute values of the specified object.
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param attributes               the array of attributes to change
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see createObject
     * @see deleteObject
     */
    setObject(nodeId: number, objectInstanceDefinition: string, objectId: string, attributes: PbxAttribute[]): Promise<boolean>;
    /**
     * Deletes the specified instance of an object.
     * <p>
     * The `forceDelete` option is not available for all objects â€” check its
     * availability in the {@link Model} corresponding to the object. It can be
     * used, for example, to delete a `Subscriber` that has voice mails in their
     * mailbox.
     *
     * @example
     * ```typescript
     * // Standard delete
     * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60200");
     *
     * // Force delete â€” use when standard delete is blocked (e.g. subscriber has voice mails)
     * await O2G.pbxManagement.deleteObject(1, "Subscriber", "60200", true);
     * ```
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param objectId                 the object instance id
     * @param forceDelete              if `true`, uses the FORCED_DELETE action
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see createObject
     * @see setObject
     */
    deleteObject(nodeId: number, objectInstanceDefinition: string, objectId: string, forceDelete?: boolean): Promise<boolean>;
    /**
     * Creates a new object with the specified collection of attributes.
     *
     * @param nodeId                   the OmniPCX Enterprise node id
     * @param objectInstanceDefinition the object instance definition
     * @param attributes               the array of attributes to set at object creation
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setObject
     * @see deleteObject
     */
    createObject(nodeId: number, objectInstanceDefinition: string, attributes: PbxAttribute[]): Promise<boolean>;
}
//# sourceMappingURL=o2g-pbx-mngt.d.ts.map
import { DynamicState } from './types/phoneset/dynamic-state';
import { Pin } from './types/phoneset/pin';
import { ProgrammeableKey } from './types/phoneset/prog-key';
import { SoftKey } from './types/phoneset/soft-key';
import { Device } from './types/common/device';
/**
 * This service allows managing the programmable keys, soft keys, and device settings
 * of the phone sets assigned to a user.
 * <p>
 * Most methods accept a `loginName` parameter. When `loginName` is `null`, the operation
 * applies to the user of the current session. When specified, it allows an administrator
 * to manage another user's devices.
 *
 * @example
 * ```typescript
 * // Current session user â€” pass null for loginName
 * const devices = await O2G.phoneSetProgramming.getDevices(null);
 * if (devices && devices.length > 0) {
 *     const deviceId = devices[0].id;
 *
 *     // Retrieve all programmed keys
 *     const keys = await O2G.phoneSetProgramming.getProgrammedKeys(null, deviceId);
 *
 *     // Assign a new programmable key at position 1
 *     const key = new ProgrammeableKey({ position: 1, type: "SPEED_DIAL", number: "5001" });
 *     await O2G.phoneSetProgramming.setProgrammableKey(null, deviceId, key);
 *
 *     // Lock the device
 *     await O2G.phoneSetProgramming.lockDevice(null, deviceId);
 *
 *     // Unlock when done
 *     await O2G.phoneSetProgramming.unlockDevice(null, deviceId);
 * }
 *
 * // Administrator managing another user's device
 * const adminDevices = await O2G.phoneSetProgramming.getDevices("jdoe");
 * ```
 */
export declare class PhoneSetProgramming {
    #private;
    /**
     * Retrieves the list of devices assigned to the specified user.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @returns the list of {@link Device} objects on success; `null` otherwise.
     */
    getDevices(loginName: string | null): Promise<Device[] | null>;
    /**
     * Retrieves the information of a specific device assigned to the specified user.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link Device} information on success; `null` otherwise.
     */
    getDevice(loginName: string | null, deviceId: string): Promise<Device | null>;
    /**
     * Retrieves all programmable keys of the specified device, including unassigned positions.
     * <p>
     * Use this method when you need to know the full layout of the device, including
     * empty positions. To retrieve only the keys that have been assigned, use
     * {@link getProgrammedKeys} instead.
     *
     * @example
     * ```typescript
     * // Get all positions (including empty ones) to inspect the full key layout
     * const allKeys = await O2G.phoneSetProgramming.getProgrammableKeys(null, "1234");
     *
     * // Get only the assigned keys to display what is currently programmed
     * const assignedKeys = await O2G.phoneSetProgramming.getProgrammedKeys(null, "1234");
     *
     * console.log(`Total positions: ${allKeys?.length}`);
     * console.log(`Assigned keys: ${assignedKeys?.length}`);
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of {@link ProgrammeableKey} objects on success; `null` otherwise.
     * @see getProgrammedKeys
     */
    getProgrammableKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null>;
    /**
     * Retrieves only the programmed (assigned) programmable keys of the specified device.
     * <p>
     * Use this method when you only need the keys that have been assigned. To retrieve
     * the full layout including unassigned positions, use {@link getProgrammableKeys} instead.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of assigned {@link ProgrammeableKey} objects on success; `null` otherwise.
     * @see getProgrammableKeys
     */
    getProgrammedKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null>;
    /**
     * Assigns or updates a programmable key on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param key       the programmable key configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteProgrammableKey
     */
    setProgrammableKey(loginName: string | null, deviceId: string, key: ProgrammeableKey): Promise<boolean>;
    /**
     * Deletes the programmable key at the specified position on the given device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param position  the position of the programmable key to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setProgrammableKey
     */
    deleteProgrammableKey(loginName: string | null, deviceId: string, position: number): Promise<boolean>;
    /**
     * Retrieves the soft keys of the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of {@link SoftKey} objects on success; `null` otherwise.
     */
    getSoftKeys(loginName: string | null, deviceId: string): Promise<SoftKey[] | null>;
    /**
     * Assigns or updates a soft key on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param key       the soft key configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteSoftKey
     */
    setSoftKey(loginName: string | null, deviceId: string, key: SoftKey): Promise<boolean>;
    /**
     * Deletes the soft key at the specified position on the given device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param position  the position of the soft key to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setSoftKey
     */
    deleteSoftKey(loginName: string | null, deviceId: string, position: number): Promise<boolean>;
    /**
     * Locks the specified device, preventing it from being used to place or receive calls.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unlockDevice
     */
    lockDevice(loginName: string | null, deviceId: string): Promise<boolean>;
    /**
     * Unlocks the specified device, restoring normal call capabilities.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see lockDevice
     */
    unlockDevice(loginName: string | null, deviceId: string): Promise<boolean>;
    /**
     * Enables the camp-on feature on the specified device.
     * <p>
     * When camp-on is enabled, the user is automatically connected when a busy
     * destination becomes available.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see disableCampon
     */
    enableCampon(loginName: string | null, deviceId: string): Promise<boolean>;
    /**
     * Disables the camp-on feature on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see enableCampon
     */
    disableCampon(loginName: string | null, deviceId: string): Promise<boolean>;
    /**
     * Retrieves the PIN code configuration of the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link Pin} configuration on success; `null` otherwise.
     * @see setPinCode
     */
    getPinCode(loginName: string | null, deviceId: string): Promise<Pin | null>;
    /**
     * Sets the PIN code on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param code      the PIN configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getPinCode
     */
    setPinCode(loginName: string | null, deviceId: string, code: Pin): Promise<boolean>;
    /**
     * Retrieves the dynamic state of the specified device.
     * <p>
     * The dynamic state reflects runtime settings such as the associated device
     * and remote extension activation status.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link DynamicState} on success; `null` otherwise.
     */
    getDynamicState(loginName: string | null, deviceId: string): Promise<DynamicState | null>;
    /**
     * Associates an additional device with the specified device.
     * <p>
     * The associate feature allows calls to ring simultaneously on both devices,
     * which is useful for example to have a mobile phone ring alongside a desk phone.
     *
     * @example
     * ```typescript
     * // Associate a mobile number with the desk phone so both ring simultaneously
     * await O2G.phoneSetProgramming.setAssociate(null, "1234", "0612345678");
     *
     * // Check the dynamic state to verify the association is active
     * const state = await O2G.phoneSetProgramming.getDynamicState(null, "1234");
     * console.log("Associated device:", state?.associatedNumber);
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param associate the phone number of the device to associate
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    setAssociate(loginName: string | null, deviceId: string, associate: string): Promise<boolean>;
    /**
     * Activates the remote extension on the specified device.
     * <p>
     * When activated, the device operates as a remote extension, allowing the user
     * to use an off-site phone as if it were connected to the PBX.
     *
     * @example
     * ```typescript
     * // Check current remote extension state before activating
     * const state = await O2G.phoneSetProgramming.getDynamicState(null, "1234");
     * console.log("Remote extension active:", state?.remoteExtensionActivated);
     *
     * // Activate the remote extension
     * await O2G.phoneSetProgramming.activateRemoteExtension(null, "1234");
     *
     * // Deactivate when the user returns to the office
     * await O2G.phoneSetProgramming.deactivateRemoteExtension(null, "1234");
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deactivateRemoteExtension
     * @see getDynamicState
     */
    activateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean>;
    /**
     * Deactivates the remote extension on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateRemoteExtension
     * @see getDynamicState
     */
    deactivateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean>;
}
//# sourceMappingURL=o2g-phone-set-prog.d.ts.map
import EventEmitter from 'events';
import { ForwardCondition } from './types/routing/forward-condition';
import { OverflowCondition } from './types/routing/overflow-condition';
import { DndState } from './types/routing/dnd-state';
import { Forward } from './types/routing/forward';
import { Overflow } from './types/routing/overflow';
import { RoutingCapabilities } from './types/routing/routing-capabilities';
import { RoutingState } from './types/routing/routing-state';
/**
 * The Routing service allows a user to manage forward, overflow, DoNotDisturb
 * and activation of their remote extension device (if any). Using this service
 * requires having a <b>TELEPHONY_ADVANCED</b> license.
 * <h2>Forward:</h2>A forward can be activated on the voice mail or on any
 * number as far as this number is authorized by the OmniPCX Enterprise
 * numbering policy. Use one of the methods:
 * {@link forwardOnNumber} or {@link forwardOnVoiceMail} to activate a forward. <br>
 * A {@link ForwardCondition} can be associated to the forward:
 * <table>
 * <caption>Forward conditions</caption>
 * <tr><td>IMMEDIATE</td><td>Incoming calls are immediately forwarded on the target.</td></tr>
 * <tr><td>BUSY</td><td>Incoming calls are forwarded on the target if the user is busy.</td></tr>
 * <tr><td>NO_ANSWER</td><td>Incoming calls are forwarded on the target if the user does not answer the call.</td></tr>
 * <tr><td>BUSY_NO_ANSWER</td><td>One of the two last conditions.</td></tr>
 * </table>
 * <h2>Overflow:</h2>An overflow can be activated on the voice mail (if any).
 * Use method:
 * {@link overflowOnVoiceMail} to activate an overflow. <br>
 * A {@link OverflowCondition} can be associated to the overflow:
 * <table>
 * <caption>Overflow conditions</caption>
 * <tr><td>BUSY</td><td>Incoming calls are redirected on the target if the user is busy.</td></tr>
 * <tr><td>NO_ANSWER</td><td>Incoming calls are redirected on the target if the user does not answer the call.</td></tr>
 * <tr><td>BUSY_NO_ANSWER</td><td>One of the two last conditions.</td></tr>
 * </table>
 * <h2>Do Not Disturb:</h2> When the Do Not Disturb (DND) is activated, the user
 * does not receive any call. The DND is activated using method
 * {@link activateDnd}.
 * <h2>Remote extension activation:</h2> When a remote extension is not
 * activated, it does not ring on incoming call. Use the method
 * {@link activateRemoteExtension} to activate the remote extension.
 * <h2>Eventing:</h2> For each routing modification, a
 * {@link ON_ROUTING_STATE_CHANGED} event is raised.
 *
 * @example
 * ```typescript
 * // Listen for routing state changes
 * O2G.routing.on(Routing.ON_ROUTING_STATE_CHANGED, (event) => {
 *     console.log("Routing state changed:", event);
 * });
 *
 * // Activate Do Not Disturb
 * await O2G.routing.activateDnd();
 *
 * // Forward all calls immediately to another number
 * await O2G.routing.forwardOnNumber("5001", ForwardCondition.IMMEDIATE);
 *
 * // Forward to voice mail when busy or no answer
 * await O2G.routing.forwardOnVoiceMail(ForwardCondition.BUSY_NO_ANSWER);
 *
 * // Overflow to voice mail when busy
 * await O2G.routing.overflowOnVoiceMail(OverflowCondition.BUSY);
 *
 * // Check the current routing state
 * const state = await O2G.routing.getRoutingState();
 *
 * // Cancel all active routing rules
 * await O2G.routing.cancelForward();
 * await O2G.routing.cancelOverflow();
 * await O2G.routing.cancelDnd();
 * ```
 */
export declare class Routing extends EventEmitter {
    #private;
    /**
     * Raised for each routing modification.
     * @event
     */
    static readonly ON_ROUTING_STATE_CHANGED = "OnRoutingStateChanged";
    /**
     * Activates the Do Not Disturb for the specified user.
     * <p>
     * This method does nothing and returns `true` if the Do Not Disturb is
     * already activated.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelDnd
     */
    activateDnd(loginName?: string | null): Promise<boolean>;
    /**
     * Cancels the Do Not Disturb for the specified user.
     * <p>
     * This method does nothing and returns `true` if the Do Not Disturb was
     * not activated.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateDnd
     */
    cancelDnd(loginName?: string | null): Promise<boolean>;
    /**
     * Gets the Do Not Disturb state of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link DndState} on success; `null` otherwise.
     */
    getDndState(loginName?: string | null): Promise<DndState | null>;
    /**
     * Returns the routing capabilities of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link RoutingCapabilities} on success; `null` otherwise.
     */
    getCapabilities(loginName?: string | null): Promise<RoutingCapabilities | null>;
    /**
     * Activates the remote extension device for the specified user.
     * <p>
     * When the remote extension is activated, it rings on incoming calls on the
     * user's company phone.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deactivateRemoteExtension
     */
    activateRemoteExtension(loginName?: string | null): Promise<boolean>;
    /**
     * Deactivates the remote extension device for the specified user.
     * <p>
     * When deactivated, it never rings, but it can still be used to place
     * an outgoing call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateRemoteExtension
     */
    deactivateRemoteExtension(loginName?: string | null): Promise<boolean>;
    /**
     * Gets the forward state of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link Forward} state on success; `null` otherwise.
     */
    getForward(loginName?: string | null): Promise<Forward | null>;
    /**
     * Cancels the forward for the specified user.
     * <p>
     * This method does nothing and returns `true` if there is no forward
     * activated.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    cancelForward(loginName?: string | null): Promise<boolean>;
    /**
     * Sets a forward on voice mail with the specified condition, for the specified user.
     * <p>
     * This method will fail and return `false` if the user does not have a voice mail.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param condition the forward condition
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see forwardOnNumber
     */
    forwardOnVoiceMail(condition: ForwardCondition, loginName?: string | null): Promise<boolean>;
    /**
     * Sets a forward on the specified number, with the specified condition, for the
     * specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Forward all calls immediately to a mobile number
     * await O2G.routing.forwardOnNumber("0612345678", ForwardCondition.IMMEDIATE);
     *
     * // Forward only when busy to an assistant
     * await O2G.routing.forwardOnNumber("5002", ForwardCondition.BUSY);
     *
     * // Forward when no answer or busy to voice mail number
     * await O2G.routing.forwardOnNumber("5003", ForwardCondition.BUSY_NO_ANSWER);
     *
     * // Cancel the forward when done
     * await O2G.routing.cancelForward();
     * ```
     *
     * @param number    the phone number on which the forward is activated
     * @param condition the forward condition
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see forwardOnVoiceMail
     * @see cancelForward
     */
    forwardOnNumber(number: string, condition: ForwardCondition, loginName?: string | null): Promise<boolean>;
    /**
     * Cancels the overflow for the specified user.
     * <p>
     * This method does nothing and returns `true` if there is no overflow activated.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    cancelOverflow(loginName?: string | null): Promise<boolean>;
    /**
     * Gets the overflow state for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link Overflow} state on success; `null` otherwise.
     */
    getOverflow(loginName?: string | null): Promise<Overflow | null>;
    /**
     * Activates an overflow on voice mail with the specified condition, for the
     * specified user.
     * <p>
     * This method will fail and return `false` if the user does not have a voice mail.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param condition the overflow condition
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelOverflow
     */
    overflowOnVoiceMail(condition: OverflowCondition, loginName?: string | null): Promise<boolean>;
    /**
     * Gets the routing state of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the {@link RoutingState} on success; `null` otherwise.
     */
    getRoutingState(loginName?: string | null): Promise<RoutingState | null>;
    /**
     * Asks a snapshot event on the specified user.
     * <p>
     * The {@link ON_ROUTING_STATE_CHANGED} event will contain the
     * {@link RoutingState} (forward/overflow/dnd state). If a second request
     * is asked while the previous one is still in progress, it has no effect.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Register listener before requesting snapshot
     * O2G.routing.on(Routing.ON_ROUTING_STATE_CHANGED, (event) => {
     *     const state = event.routingState;
     *     console.log("DND active:", state.dndState?.activated);
     *     console.log("Forward active:", state.forward?.activated);
     *     console.log("Overflow active:", state.overflow?.activated);
     * });
     *
     * // Request current routing state
     * await O2G.routing.requestSnapshot();
     * ```
     *
     * @param loginName the user login name
     * @returns `true` if the request was successfully submitted; `false` otherwise.
     */
    requestSnapshot(loginName?: string | null): Promise<boolean>;
}
//# sourceMappingURL=o2g-routing.d.ts.map
import EventEmitter from 'events';
import { AdditionalDigitCollectionCriteria } from './types/rsi/add-digit-coll-criteria';
import { Tones } from './types/rsi/tones';
import { RsiPoint } from './types/rsi/rsi-point';
import { RouteSession } from './types/rsi/route-session';
/**
 * RsiService provides access to th RSI (Routing Service Intelligence)
 * points features:
 * <ul>
 * <li>Makes route selection.</li>
 * <li>Makes digits collection.</li>
 * <li>Plays voice guides or tones.</li>
 * <li>Plays announcements (prompts and/or digits).</li>
 * </ul>
 * <p>
 * To be able to receive the RouteRequest from the OmniPCX Enterprise, the first
 * action is subscribe to rsi events and the second action is to enable the RSI
 * point.
 * <p>
 * Using this service requires having a <b>CONTACTCENTER_RSI</b> license.
 */
export declare class Rsi extends EventEmitter {
    #private;
    /**
     * Occurs when a data collection has ended.
     * @event
     */
    static readonly ON_DIGIT_COLLECTED = "OnDigitCollected";
    /**
     * Raised from a RSI point when a tone generation is started.
     * @event
     */
    static readonly ON_TONE_GENERATED_START = "OnToneGeneratedStart";
    /**
     * Raised from a RSI point when a tone generation is stopped.
     * @event
     */
    static readonly ON_TONE_GENERATED_STOP = "OnToneGeneratedStop";
    /**
     * Raised from a Routing point to close a route session (routing crid is no longer valid).
     * @event
     */
    static readonly ON_ROUTE_END = "OnRouteEnd";
    /**
     * Raised from a Routing point to request a route.
     * @event
     */
    static readonly ON_ROUTE_REQUEST = "OnRouteRequest";
    /**
     * Gets the configured Rsi points.
     */
    getRsiPoints(): Promise<RsiPoint[] | null>;
    /**
     * Enables the specified rsi point.
     *
     * @param rsiNumber the rsi point extension number
     */
    enableRsiPoint(rsiNumber: string): Promise<boolean>;
    /**
     * Disables the specified rsi point.
     *
     * @param rsiNumber the rsi point extension number.
     */
    disableRsiPoint(rsiNumber: string): Promise<boolean>;
    /**
     * Starts a digits collection for the specified rsi, on the specified call.
     *
     * @param rsiNumber          the rsi point extension number
     * @param callRef            the call reference
     * @param numChars           the optionnal number of digits to collect. The
     *                           digit collection is stopped when this number is
     *                           reached
     * @param flushChar          the optional character used to stop the digit
     *                           collection when pressed.
     * @param timeout            optional timeout in second. Stop the digit
     *                           collection after this time elapses.
     * @param additionalCriteria extension criteria used to collect digits
     * @see {@link ON_DIGIT_COLLECTED} event
     * @see {@link stopCollectDigits}
     */
    startCollectDigits(rsiNumber: string, callRef: string, numChars: number, flushChar?: string | null, timeout?: number | null, additionalCriteria?: AdditionalDigitCollectionCriteria | null): Promise<boolean | null>;
    /**
     * Stops the specified digits collection.
     *
     * @param rsiNumber the rsi point extension number
     * @param callCrid  the digit collection identifier
     * @see {@link startCollectDigits}.
     */
    stopCollectDigits(rsiNumber: string, collCrid: string): Promise<boolean>;
    /**
     * Plays the specified tone on the specified call.
     *
     * @param rsiNumber the rsi point extension number
     * @param callRef   the call reference
     * @param tone      the tone to play
     * @param duration  the duration the tone is played (in second)
     * @see {@link ON_TONE_GENERATED_START} event.
     * @see {@link cancelTone}.
     */
    playTone(rsiNumber: string, callRef: string, tone: Tones, duration: number): Promise<boolean>;
    /**
     * Cancels playing a tone on the specified call.
     *
     * @param rsiNumber the rsi point extension number
     * @param callRef   the call reference
     * @see {@link ON_TONE_GENERATED_STOP} event.
     * @see {@link playTone}
     */
    cancelTone(rsiNumber: string, callRef: string): Promise<boolean>;
    /**
     * Plays the specified voice guide on the specified call.
     *
     * @param rsiNumber   the rsi point extension number
     * @param callRef     the call reference
     * @param guideNumber the voice guide number as defined in the OmniPcx
     *                    Enterprise
     * @param duration    an optional duration for the voice guide in second.
     * @see {@link ON_TONE_GENERATED_START}
     */
    playVoiceGuide(rsiNumber: string, callRef: string, guideNumber: number, duration?: number | null): Promise<boolean>;
    /**
     * Ends a route session.
     *
     * @param rsiNumber the rsi point extension number
     * @param routeCrid the routing session unique identifier
     * @see {@link ON_ROUTE_REQUEST} event.
     */
    routeEnd(rsiNumber: string, routeCrid: string): Promise<boolean>;
    /**
     * Selects a route for the specified route session.
     * @param rsiNumber        the rsi point extension number
     * @param routeCrid        the routing session unique identifier
     * @param selectedRoute    the selected route number
     * @param callingLine      an optional calling line value that will be presented
     *                         to the selected route
     * @param associatedData   the optional associated data to attach to the call
     * @param routeToVoiceMail 'true' if the selected route is the voice mail; 'false' otherwise
     * @see {@link ON_ROUTE_REQUEST} event.
     */
    routeSelect(rsiNumber: string, routeCrid: string, selectedRoute: string, callingLine?: string | null, associatedData?: string | null, routeToVoiceMail?: boolean | null): Promise<boolean>;
    /**
     * Gets the list of existing route sessions for the specified rsi point.
     *
     * @param rsiNumber the rsi point extension number
     */
    getRouteSessions(rsiNumber: string): Promise<RouteSession[] | null>;
    /**
     * Return the specified route session.
     *
     * @param rsiNumber the rsi point extension number
     * @param routeCrid the routing session unique identifier
     */
    getRouteSession(rsiNumber: string, routeCrid: string): Promise<RouteSession | null>;
}
//# sourceMappingURL=o2g-rsi.d.ts.map
import EventEmitter from 'events';
import { RecordingAction } from './types/telephony/RecordingAction';
import { CorrelatorData } from './types/telephony/call/correlator-data';
import { Call } from './types/telephony/call';
import { HuntingGroupStatus } from './types/telephony/hunting-group-status';
import { HuntingGroups } from './types/telephony/hunting-groups';
import { MiniMessage } from './types/telephony/mini-message';
import { TelephonicState } from './types/telephony/telephonic-state';
import { Callback } from './types/telephony/callback';
import { PilotInfo } from './types/telephony/call/ccd/pilot-info';
import { Leg } from './types/telephony/call/leg';
import { Participant } from './types/telephony/call/participant';
import { DeviceState } from './types/telephony/device/device-state';
import { PilotTransferQueryParameters } from './types/telephony/call/ccd/pilot-transfer-query-param';
import { CallProfile } from './types/telephony/call/ccd/call-profile';
/**
 * The TelephonyService allows a user to initiate a call and to activate
 * any kind of OmniPCX Enterprise telephony services.
 * <p>
 * Using this service requires having a <b>TELEPHONY_ADVANCED</b> license,
 * except for the 3 basic services
 * {@link basicMakeCall}, {@link basicAnswerCall} and {@link basicDropMe} that are available without any
 * license.
 */
export declare class Telephony extends EventEmitter {
    #private;
    /**
     * Occurs in response to a snapshot request.
     * @event
     */
    static readonly ON_TELEPHONY_STATE = "OnTelephonyState";
    /**
     * Occurs when a new call is created.
     * @event
     */
    static readonly ON_CALL_CREATED = "OnCallCreated";
    /**
     * Occurs when an existing call is modified.
     * @event
     */
    static readonly ON_CALL_MODIFIED = "OnCallModified";
    /**
     * Occurs when a call has been removed.
     * @event
     */
    static readonly ON_CALL_REMOVED = "OnCallRemoved";
    /**
     * Occurs when a user's state has been modified.
     * @event
     */
    static readonly ON_USER_STATE_MODIFIED = "OnUserStateModified";
    /**
     * Occurs when a device's state has been modified.
     * @event
     */
    static readonly ON_DEVICE_STATE_MODIFIED = "OnDeviceStateModified";
    /**
     * Occurs when a user's dynamic state has changed.
     * @event
     */
    static readonly ON_DYNAMIC_STATE_CHANGED = "OnDynamicStateChanged";
    /**
     * Initiates a call from the specified device to the specified called number.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     * <p>
     * If `autoAnswer` is set to `false`, the `deviceId` is called before launching
     * the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param autoAnswer automatic answer on make call
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    basicMakeCall(deviceId: string, callee: string, autoAnswer?: boolean): Promise<boolean>;
    /**
     * Answers an incoming ringing call on the specified device.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     *
     * @param deviceId the device phone number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    basicAnswerCall(deviceId: string): Promise<boolean>;
    /**
     * Exits from the call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     *
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    basicDropMe(loginName?: string | null): Promise<boolean>;
    /**
     * Retrieves the calls in progress for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of active {@link Call} objects on success; `null` otherwise.
     */
    getCalls(loginName?: string | null): Promise<Call[] | null>;
    /**
     * Returns the call specified by the call reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the {@link Call} on success; `null` otherwise.
     */
    getCall(callRef: string, loginName?: string | null): Promise<Call | null>;
    /**
     * Initiates a call from the specified device to the specified called number for
     * the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If `autoAnswer` is set to `false`, the `deviceId` is called before launching
     * the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param autoAnswer automatic answer on make call
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makeCall(deviceId: string, callee: string, autoAnswer?: boolean, loginName?: string | null): Promise<boolean>;
    /**
     * Initiates a new call to another user (the callee), using the specified device and options.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     * <p>
     * If `inhibitProgressTone` is `true`, the progress tone is inhibited on the outbound call.
     * <p>
     * The `callingNumber` can be used to present a different calling number on the public
     * network in order to hide the real calling extension number.
     *
     *  * @example
     * ```typescript
     * // Simple call with auto-answer
     * await O2G.telephony.makeCallEx("1234", "5678");
     *
     * // Call with progress tone inhibited and a different calling number
     * await O2G.telephony.makeCallEx("1234", "5678", true, true, null, "9000");
     *
     * // Call with correlator data to carry application context
     * const correlatorData = new CorrelatorData("transactionId=abc123");
     * await O2G.telephony.makeCallEx("1234", "5678", true, false, correlatorData);
     *
     * // Administrator making a call on behalf of a user
     * await O2G.telephony.makeCallEx("1234", "5678", true, false, null, null, "jdoe");
     * ```
     *
     * @param deviceId            the device phone number for which the call is made
     * @param callee              the called number
     * @param autoAnswer          automatic answer on make call
     * @param inhibitProgressTone allows to inhibit the progress tone on the current external call
     * @param correlatorData      correlator data to add to the call
     * @param callingNumber       calling number to present to the public network
     * @param loginName           the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makeCallEx(deviceId: string, callee: string, autoAnswer?: boolean, inhibitProgressTone?: boolean, correlatorData?: CorrelatorData | null, callingNumber?: string | null, loginName?: string | null): Promise<boolean>;
    /**
     * Initiates a new private call to another user (the callee), using a PIN code and an optional secret code.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The private call service allows a user to specify that an external call is personal
     * rather than professional. The charging for this type of call can then be given
     * specific processing.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param pin        the PIN code to identify the caller
     * @param secretCode the optional secret code used to confirm the PIN code
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makePrivateCall(deviceId: string, callee: string, pin: string, secretCode?: string | null, loginName?: string | null): Promise<boolean>;
    /**
     * Initiates a new business call to another user (the callee), using the specified business code.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId     the device phone number for which the call is made
     * @param callee       the called number
     * @param businessCode the cost center on which the call will be charged
     * @param loginName    the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makeBusinessCall(deviceId: string, callee: string, businessCode: string, loginName?: string | null): Promise<boolean>;
    /**
     * Initiates a call from a CCD agent to a supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the agent's `deviceId`. Then when
     * the call is answered the call server calls the supervisor, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param autoAnswer automatic answer on make call
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makeSupervisorCall(deviceId: string, autoAnswer?: boolean, loginName?: string | null): Promise<boolean>;
    /**
     * Initiates an enquiry call from a CCD agent to a pilot or a RSI point.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The CCD pilot or the RSI point performs a call distribution to select an agent
     * that will be alerted by this call. The `callProfile` is mandatory in case of
     * "Advanced Call Routing" call distribution strategy.
     *
     * @param deviceId       the device phone number for which the call is made
     * @param pilot          the called CCD pilot or RSI point number
     * @param correlatorData correlator data to add to the call
     * @param callProfile    the call profile associated to this call
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makePilotOrRSISupervisedTransferCall(deviceId: string, pilot: string, correlatorData?: CorrelatorData | null, callProfile?: CallProfile | null, loginName?: string | null): Promise<boolean | null>;
    /**
     * Initiates a local call to a CCD pilot or a RSI point.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The CCD pilot or the RSI point performs a call distribution to select an agent
     * that will be alerted by this call. The `callProfile` is mandatory in case of
     * "Advanced Call Routing" call distribution strategy.
     *
     * @param deviceId       the device phone number for which the call is made
     * @param pilot          the called CCD pilot or RSI point number
     * @param autoAnswer     automatic answer on make call
     * @param correlatorData correlator data to add to the call
     * @param callProfile    the call profile associated to this call
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    makePilotOrRSICall(deviceId: string, pilot: string, autoAnswer?: boolean, correlatorData?: CorrelatorData | null, callProfile?: CallProfile | null, loginName?: string | null): Promise<boolean | null>;
    /**
     * Hangs up an active call; all parties are released.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference to hang up
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    release(callRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Puts an active call on hold and retrieves a call that has been previously put
     * on hold.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     *
     * @param callRef  the call reference of the call on hold
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    alternate(callRef: string, deviceId: string): Promise<boolean>;
    /**
     * Answers an incoming ringing call specified by its reference.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     * <p>
     * Answering a call will fail if the call state is not correct. The state can be
     * checked by listening to the telephony events, and more specifically by
     * checking the capabilities of the involved leg (answer capability on the leg).
     *
     * @param callRef  the call reference of the ringing call
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    answer(callRef: string, deviceId: string): Promise<boolean>;
    /**
     * Attaches the specified correlator data to the specified call.
     * <p>
     * This is used by the application to provide application-related information
     * (limited to 32 bytes). In general, it is used to give information concerning
     * a previously established call to the party of a second call.
     *
     * @param callRef        the call reference
     * @param deviceId       the device phone number for which the operation is done
     * @param correlatorData the correlator data to attach
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    attachData(callRef: string, deviceId: string, correlatorData: CorrelatorData): Promise<boolean>;
    /**
     * Transfers the active call to another user, without keeping control of the call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the reference of the active call
     * @param transferTo the phone number to which the call is transferred
     * @param anonymous  if `true`, the call will be transferred anonymously
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    blindTransfer(callRef: string, transferTo: string, anonymous?: boolean, loginName?: string | null): Promise<boolean>;
    /**
     * Requests a callback on the call specified by the call reference for the
     * specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    callback(callRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Returns the legs involved in the call specified by the call reference for the
     * specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Leg} objects on success; `null` otherwise.
     */
    getLegs(callRef: string, loginName?: string | null): Promise<Leg[] | null>;
    /**
     * Returns the leg specified by its id, involved in the call specified by the
     * call reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param legId     the leg identifier
     * @param loginName the login name
     * @returns the {@link Leg} on success; `null` otherwise.
     */
    getLeg(callRef: string, legId: string, loginName?: string | null): Promise<Leg | null>;
    /**
     * Exits from the call specified by its reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     *
     * @param callRef   the call reference
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    dropme(callRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Puts on hold the call specified by its reference, on the specified device,
     * for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param deviceId  the device phone number from which the call is put on hold
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    hold(callRef: string, deviceId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Makes a 3-party conference with a specified active call and a specified held
     * call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef     the active call reference
     * @param heldCallRef the held call reference
     * @param loginName   the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    merge(callRef: string, heldCallRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Redirects an outgoing ringing call specified by its reference to the voice
     * mail of the called user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the ringing call reference
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    overflowToVoiceMail(callRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Gets the telephonic state and capabilities for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link TelephonicState} on success; `null` otherwise.
     */
    getState(loginName?: string | null): Promise<TelephonicState | null>;
    /**
     * Parks the specified active call to a target device.
     * <p>
     * If the device is not provided, the call will be parked on the current device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the active call reference
     * @param parkTo    the target device, or `null` to park on the current device
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    park(callRef: string, parkTo?: string | null, loginName?: string | null): Promise<boolean>;
    /**
     * Returns the list of participants in the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Participant} objects on success; `null` otherwise.
     */
    getParticipants(callRef: string, loginName?: string | null): Promise<Participant[] | null>;
    /**
     * Returns the specified participant in the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef       the call reference
     * @param participantId the participant identifier
     * @param loginName     the login name
     * @returns the {@link Participant} on success; `null` otherwise.
     */
    getParticipant(callRef: string, participantId: string, loginName?: string | null): Promise<Participant | null>;
    /**
     * Drops the specified participant from the specified call for the specified user.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the participant.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef       the call reference
     * @param participantId the participant identifier
     * @param loginName     the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    dropParticipant(callRef: string, participantId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Releases the current call (active or ringing) to retrieve a previously put on
     * hold call, cancelling a consultation call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef        the held call reference
     * @param deviceId       the device phone number for which the operation is done
     * @param enquiryCallRef the reference of the enquiry call to cancel
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    reconnect(callRef: string, deviceId: string, enquiryCallRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Starts, stops, pauses or resumes the recording of the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the reference of the call to record
     * @param action    the recording action
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    doRecordAction(callRef: string, action: RecordingAction, loginName?: string | null): Promise<boolean>;
    /**
     * Redirects an incoming ringing call to another user or number, instead of
     * responding to it.
     * <p>
     * If `redirectTo` is equal to `"VOICEMAIL"`, the incoming ringing call is
     * redirected to the user's voice mail.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the incoming ringing call reference
     * @param redirectTo the phone number of the redirection, or `"VOICEMAIL"`
     * @param anonymous  if `true`, the call will be redirected anonymously
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    redirect(callRef: string, redirectTo: string, anonymous?: boolean, loginName?: string | null): Promise<boolean>;
    /**
     * Retrieves a call that has been previously put on hold.
     * <p>
     * This method will return `false` if it is invoked from a session opened
     * by an administrator.
     *
     * @param callRef  the held call reference
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    retrieve(callRef: string, deviceId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Sends DTMF codes on the specified active call.
     *
     * @param callRef  the active call reference
     * @param deviceId the device phone number for which the operation is done
     * @param number   the DTMF codes to send
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    sendDtmf(callRef: string, deviceId: string, number: string): Promise<boolean>;
    /**
     * Sends the account info for the specified call, on the specified device.
     * <p>
     * This operation is used by a CCD agent to send the transaction code at the end
     * of the call. The string value must comply with the transaction code accepted
     * by OXE (numerical values only).
     *
     * @param callRef     the call reference
     * @param deviceId    the device phone number for which the operation is done
     * @param accountInfo the transaction code
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    sendAccountInfo(callRef: string, deviceId: string, accountInfo: string): Promise<boolean>;
    /**
     * Transfers a specified active call to a specified held call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef     the active call reference
     * @param heldCallRef the held call reference
     * @param loginName   the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    transfer(callRef: string, heldCallRef: string, loginName?: string | null): Promise<boolean>;
    /**
     * Logs the specified user on a specified desk sharing set.
     * <p>
     * The user must be configured as a desk sharing user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param dssDeviceNumber the desk sharing set phone number
     * @param loginName       the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deskSharingLogOff
     */
    deskSharingLogOn(dssDeviceNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Logs off the specified user from the desk sharing set.
     * <p>
     * The user must be configured as a desk sharing user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deskSharingLogOn
     */
    deskSharingLogOff(loginName?: string | null): Promise<boolean>;
    /**
     * Gets the states of all devices of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of {@link DeviceState} objects on success; `null` otherwise.
     */
    getDevicesState(loginName?: string | null): Promise<DeviceState[] | null>;
    /**
     * Gets the state of the specified device of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId  the device phone number for which the operation is done
     * @param loginName the login name
     * @returns the {@link DeviceState} on success; `null` otherwise.
     */
    getDeviceState(deviceId: string, loginName?: string | null): Promise<DeviceState | null>;
    /**
     * Picks up the specified incoming call for another user.
     *
     * @param deviceId         the device phone number for which the operation is done
     * @param otherCallRef     the reference of the call to pick up (on the remote user)
     * @param otherPhoneNumber the phone number on which the call is ringing
     * @param autoAnswer       if `true`, automatically answers the call after the pickup
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    pickUp(deviceId: string, otherCallRef: string, otherPhoneNumber: string, autoAnswer?: boolean): Promise<boolean>;
    /**
     * Performs an intrusion in the active call of a called user.
     * <p>
     * No parameter is required to invoke the intrusion: it only depends on the
     * current intrusion capability of the current device. It is based on the fact
     * that the current device must be in releasing state while calling a user which
     * is in a busy call with another user, the current device has the intrusion
     * capability, and the 2 users engaged in the call have the capability to allow
     * intrusion.
     *
     * @param deviceId the device from which the intrusion is requested
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @since O2G 2.4
     */
    intrusion(deviceId: string): Promise<boolean>;
    /**
     * Unparks a call from a target device.
     *
     * @param deviceId    the device from which the unpark request is made
     * @param heldCallRef the reference of the held call to unpark
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    unPark(deviceId: string, heldCallRef: string): Promise<boolean>;
    /**
     * Retrieves the hunting group status of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroupStatus} on success; `null` otherwise.
     */
    getHuntingGroupStatus(loginName?: string | null): Promise<HuntingGroupStatus | null>;
    /**
     * Logs on the specified user in their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see huntingGroupLogOff
     */
    huntingGroupLogOn(loginName?: string | null): Promise<boolean>;
    /**
     * Logs off the specified user from their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see huntingGroupLogOn
     */
    huntingGroupLogOff(loginName?: string | null): Promise<boolean>;
    /**
     * Sets the specified user as a member of a hunting group.
     * <p>
     * The request will fail if the hunting group does not exist. If the user
     * already belongs to the group, nothing is done and `true` is returned.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param hgNumber  the hunting group number
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see removeMeFromHuntingGroup
     */
    addMeToHuntingGroup(hgNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Removes the specified user from a hunting group.
     * <p>
     * The request will fail if the hunting group does not exist. If the user does
     * not belong to the group, nothing is done and `true` is returned.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param hgNumber  the hunting group number
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see addMeToHuntingGroup
     */
    removeMeFromHuntingGroup(hgNumber: string, loginName?: string | null): Promise<boolean>;
    /**
     * Gets the list of hunting groups on the OXE node the specified user belongs to.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroups} on success; `null` otherwise.
     */
    queryHuntingGroups(loginName?: string | null): Promise<HuntingGroups | null>;
    /**
     * Returns the list of callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of {@link Callback} objects on success; `null` otherwise.
     */
    getCallbacks(loginName?: string | null): Promise<Callback[] | null>;
    /**
     * Deletes all callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    deleteCallbacks(loginName?: string | null): Promise<boolean>;
    /**
     * Deletes the specified callback request for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callbackId the callback identifier
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    deleteCallback(callbackId: string, loginName?: string | null): Promise<boolean>;
    /**
     * Returns the current new mini message for the specified user.
     * <p>
     * As soon as a message is read, it is erased from OXE and cannot be read again.
     * Messages are retrieved in Last In First Out order.
     * <p>
     * This method will return `null` if all messages have been retrieved.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link MiniMessage} on success; `null` otherwise.
     */
    getMiniMessage(loginName?: string | null): Promise<MiniMessage | null>;
    /**
     * Sends the specified mini message to the specified recipient.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recipient the phone number of the mini message recipient
     * @param message   the mini message text
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    sendMiniMessage(recipient: string, message: string, loginName?: string | null): Promise<boolean>;
    /**
     * Requests a callback from an idle device of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callee    the phone number of the called party for which a callback is requested
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    requestCallback(callee: string, loginName?: string | null): Promise<boolean>;
    /**
     * Asks a snapshot event on the specified user.
     * <p>
     * The {@link ON_TELEPHONY_STATE} event will contain the {@link TelephonicState}
     * (calls and device capabilities). If a second request is asked while the
     * previous one is still in progress, it has no effect.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the request was successfully submitted; `false` otherwise.
     */
    requestSnapshot(loginName?: string | null): Promise<boolean>;
    /**
     * Toggles the microphone or interphony state on the specified device.
     * <p>
     * This action acts as a flip/flop and has the same effect as pressing the key:
     * <ul>
     * <li>activates or deactivates the microphone if the device has an outgoing or established call</li>
     * <li>activates or deactivates the interphony if the device is idle</li>
     * <li>has no effect if the device is ringing on an incoming call</li>
     * </ul>
     * <p>
     * This operation is done in blind mode: no state event is provided on the push,
     * but when the device returns to idle after a call, the microphone comes back to
     * the active state.
     *
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    toggleInterphony(deviceId: string): Promise<boolean>;
    /**
     * Query the specified CCD pilot information.
     * <p>
     * This method is used to get various information on the CCD pilot routing
     * capabilities.
     * <p>
     * This method will return `null` if it is invoked from a session opened
     * by an administrator.
     *
     * @param nodeId                  the PCX Enterprise node id
     * @param pilotNumber             the pilot number
     * @param pilotTransferQueryParam optional call profile context parameters
     * @param loginName               the login name
     * @returns the {@link PilotInfo} on success; `null` otherwise.
     * @since 2.7
     */
    getPilotInfo(nodeId: number, pilotNumber: string, pilotTransferQueryParam?: PilotTransferQueryParameters | null, loginName?: string | null): Promise<PilotInfo | null>;
}
//# sourceMappingURL=o2g-telephony.d.ts.map
import EventEmitter from 'events';
import { User } from './types/users/user';
import { SupportedLanguages } from './types/users/supported-languages';
import { Preferences } from './types/users/preferences';
/**
 * The User service allows:
 * <ul>
 * <li>an administrator to retrieve the list of O2G users.</li>
 * <li>a user to get information on another user account.</li>
 * <li>a user to change their password or preferences such as supported language.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * // Listen for user lifecycle events
 * O2G.users.on(Users.ON_USER_CREATED, (event) => {
 *     console.log("User created:", event.loginName);
 * });
 * O2G.users.on(Users.ON_USER_DELETED, (event) => {
 *     console.log("User deleted:", event.loginName);
 * });
 * O2G.users.on(Users.ON_USER_INFO_CHANGED, (event) => {
 *     console.log("User info changed:", event.loginName);
 * });
 *
 * // Look up a user by login name
 * const user = await O2G.users.getByLoginName("jdoe");
 * console.log(`${user?.firstName} ${user?.lastName}`);
 *
 * // Look up a user by their extension number
 * const userByPhone = await O2G.users.getByCompanyPhone("60200");
 *
 * // Change the current user's password
 * await O2G.users.changePassword("jdoe", "oldPass", "newPass");
 * ```
 */
export declare class Users extends EventEmitter {
    #private;
    /**
     * Raised on creation of a user.
     * @event
     */
    static readonly ON_USER_CREATED = "OnUserCreated";
    /**
     * Raised when a user is deleted.
     * @event
     */
    static readonly ON_USER_DELETED = "OnUserDeleted";
    /**
     * Raised on any change on the user's data.
     * @event
     */
    static readonly ON_USER_INFO_CHANGED = "OnUserInfoChanged";
    /**
     * Retrieves a list of user login names from the connected OmniPCX Enterprise nodes.
     * <p>
     * If `nodeIds` is `null`, retrieves the login names from all connected nodes.
     * This method is generally used by an administrator. If used by a user, `nodeIds`
     * must be set to `null` and `onlyACD` to `false`, in which case only the current
     * user's login name is retrieved.
     *
     * @example
     * ```typescript
     * // Administrator â€” get all users from all nodes
     * const allLogins = await O2G.users.getLogins();
     *
     * // Administrator â€” get all users from a specific node
     * const nodeLogins = await O2G.users.getLogins([1]);
     *
     * // Administrator â€” get only ACD operators (agents and supervisors)
     * const acdLogins = await O2G.users.getLogins(null, true);
     *
     * // Administrator â€” get only users with an external login
     * const extLogins = await O2G.users.getLogins(null, false, true);
     *
     * // Regular user â€” returns only the current user's login name
     * const myLogin = await O2G.users.getLogins(null, false);
     * ```
     *
     * @param nodeIds          list of OXE node ids to restrict the query to.
     *                         Only valid for an administrator session.
     * @param onlyACD          if `true`, selects only ACD operators (agents or supervisors).
     *                         Only valid for an administrator session.
     * @param onlyWithExtLogin if `true`, selects only users with an external login.
     *                         Only valid for an administrator session.
     * @returns the list of user login names on success; `null` otherwise.
     */
    getLogins(nodeIds?: number[] | null, onlyACD?: boolean, onlyWithExtLogin?: boolean): Promise<string[] | null>;
    /**
     * Retrieves the information of a user identified by their login name.
     *
     * @param loginName the user login name
     * @returns the {@link User} information on success; `null` otherwise.
     */
    getByLoginName(loginName: string): Promise<User | null>;
    /**
     * Retrieves the information of a user identified by their company extension number.
     *
     * @param companyPhone the user extension number
     * @returns the {@link User} information on success; `null` otherwise.
     */
    getByCompanyPhone(companyPhone: string): Promise<User | null>;
    /**
     * Returns the supported languages for the specified user.
     *
     * @param loginName the user login name
     * @returns the {@link SupportedLanguages} on success; `null` otherwise.
     */
    getSupportedLanguages(loginName: string): Promise<SupportedLanguages | null>;
    /**
     * Returns the preferences of the specified user.
     *
     * @param loginName the user login name
     * @returns the {@link Preferences} on success; `null` otherwise.
     */
    getPreferences(loginName: string): Promise<Preferences | null>;
    /**
     * Changes the specified user's password.
     *
     * @param loginName   the user login name
     * @param oldPassword the current password
     * @param newPassword the new password
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    changePassword(loginName: string, oldPassword: string, newPassword: string): Promise<boolean>;
}
//# sourceMappingURL=o2g-users.d.ts.map
import { User } from './types/users/user';
/**
 * The Users Management service allows an administrator to create, delete and retrieve O2G users.
 * <p>
 * This service requires an administrator session.
 *
 * @example
 * ```typescript
 * // List all users across all nodes
 * const logins = await O2G.usersManagement.getLogins();
 *
 * // Find a user by their device number
 * const loginName = await O2G.usersManagement.getByDeviceNumber("60200");
 *
 * // Retrieve full user information
 * const user = await O2G.usersManagement.getByLoginName("jdoe");
 * console.log(`${user?.firstName} ${user?.lastName}`);
 *
 * // Create specific users on node 1 by device number
 * await O2G.usersManagement.createUsers(1, ["60200", "60201", "60202"]);
 *
 * // Create all users on node 1
 * await O2G.usersManagement.createUsers(1, null);
 *
 * // Delete a user
 * await O2G.usersManagement.deleteUser("jdoe");
 * ```
 */
export declare class UsersManagement {
    #private;
    /**
     * Retrieves the login names of users from the connected OmniPCX Enterprise nodes.
     * <p>
     * If `nodeIds` is `null`, retrieves the login names from all connected nodes.
     *
     * @param nodeIds optional list of OXE node ids to restrict the query to.
     *                Only valid for an administrator session.
     * @returns the list of user login names on success; `null` otherwise.
     */
    getLogins(nodeIds?: number[] | null): Promise<string[] | null>;
    /**
     * Retrieves the login name of a user identified by one of their devices.
     *
     * @param deviceNumber the device phone number
     * @returns the user login name on success; `null` otherwise.
     */
    getByDeviceNumber(deviceNumber: string): Promise<string | null>;
    /**
     * Creates O2G users on the specified OmniPCX Enterprise node.
     * <p>
     * If `deviceNumbers` is `null` or empty, all users on the specified node are created.
     *
     * @example
     * ```typescript
     * // Create specific users by device number
     * await O2G.usersManagement.createUsers(1, ["60200", "60201"]);
     *
     * // Create all users on the node
     * await O2G.usersManagement.createUsers(1, null);
     * ```
     *
     * @param nodeId        the OXE node number
     * @param deviceNumbers optional list of device phone numbers identifying the users to create.
     *                      Pass `null` or an empty array to create all users on the node.
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    createUsers(nodeId: number, deviceNumbers: string[] | null): Promise<boolean>;
    /**
     * Retrieves the information of a user identified by their login name.
     *
     * @param loginName the user login name
     * @returns the {@link User} information on success; `null` otherwise.
     */
    getByLoginName(loginName: string): Promise<User | null>;
    /**
     * Deletes the O2G user identified by their login name.
     *
     * @param loginName the login name of the user to delete
     * @returns `true` if the user was successfully deleted; `false` otherwise.
     */
    deleteUser(loginName: string): Promise<boolean>;
}
//# sourceMappingURL=o2g-users-mngt.d.ts.map
import { EventDispatcher } from './internal/events/event-dispatcher';
import { EventPackage } from './internal/events/event-packages';
declare class EventFilter {
    private selectors;
    constructor();
    add(ids: string[], name: string[]): void;
    addPackage(ids: string[], eventPackage: EventPackage): void;
}
/**
 * Interface used when eventing is received via webhook.
 * This object is passed to the O2G SDK; `connectDispatcher` is called by the SDK
 * when the event channel is established.
 */
export interface WebHook {
    /**
     * The URL for the webhook endpoint.
     */
    url: string;
    /**
     * Called by the SDK when the event channel is established, providing the
     * dispatcher to use for forwarding events.
     *
     * @param dispatcher the event dispatcher to connect to
     */
    connectDispatcher: (dispatcher: EventDispatcher) => void;
}
/**
 * A builder for {@link Subscription}.
 * <p>
 * An instance of `Builder` is available via {@link Subscription.Builder}.
 * <p>
 * The builder configures an event subscription for the O2G server. Each method
 * modifies the state of the builder and returns the same instance, enabling
 * method chaining. The {@link build} method returns a new `Subscription` each
 * time it is invoked.
 *
 * @example
 * ```typescript
 * // User session â€” subscribe to routing and telephony events for the current user
 * const subscription = Subscription.Builder
 *     .addRoutingEvents([])
 *     .addTelephonyEvents([])
 *     .addEventSummaryEvents([])
 *     .setTimeout(10)
 *     .build();
 *
 * // Administrator session â€” subscribe to events for specific users
 * const adminSubscription = Subscription.Builder
 *     .addTelephonyEvents(["1000", "1001"])
 *     .addCallCenterAgentEvents(["12000"])
 *     .addMaintenanceEvents()
 *     .build();
 *
 * await O2G.subscribe(subscription);
 * ```
 */
export interface Builder {
    /**
     * Adds routing events to the subscription.
     * <p>
     * The following event associated to the {@link Routing} service is added:
     * <ul>
     * <li>{@link Routing.ON_ROUTING_STATE_CHANGED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to routing events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addRoutingEvents: (ids: string[]) => Builder;
    /**
     * Adds telephony events to the subscription.
     * <p>
     * The following events associated to the {@link Telephony} service are added:
     * <ul>
     * <li>{@link Telephony.ON_TELEPHONY_STATE}</li>
     * <li>{@link Telephony.ON_CALL_CREATED}</li>
     * <li>{@link Telephony.ON_CALL_MODIFIED}</li>
     * <li>{@link Telephony.ON_CALL_REMOVED}</li>
     * <li>{@link Telephony.ON_USER_STATE_MODIFIED}</li>
     * <li>{@link Telephony.ON_DEVICE_STATE_MODIFIED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to telephony events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addTelephonyEvents: (ids: string[]) => Builder;
    /**
     * Adds user management events to the subscription.
     * <p>
     * The following events associated to the {@link Users} service are added:
     * <ul>
     * <li>{@link Users.ON_USER_CREATED}</li>
     * <li>{@link Users.ON_USER_DELETED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to user management events does not require any license.
     *
     * @returns this builder instance
     */
    addUsersManagementEvents: () => Builder;
    /**
     * Adds event summary events to the subscription.
     * <p>
     * The following event associated to the {@link EventSummary} service is added:
     * <ul>
     * <li>{@link EventSummary.ON_EVENT_SUMMARY_UPDATED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to event summary events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addEventSummaryEvents: (ids: string[]) => Builder;
    /**
     * Adds PBX management events to the subscription.
     * <p>
     * The following events associated to the {@link PbxManagement} service are added:
     * <ul>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_CREATED}</li>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_DELETED}</li>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_MODIFIED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to PBX management events requires having a <b>MANAGEMENT</b> license.
     *
     * @returns this builder instance
     */
    addPbxManagementEvents: () => Builder;
    /**
     * Adds communication log events to the subscription.
     * <p>
     * The following events associated to the {@link CommunicationLog} service are added:
     * <ul>
     * <li>{@link CommunicationLog.ON_COM_RECORD_CREATED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORD_MODIFIED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_DELETED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_ACK}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_UNACK}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to communication log events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addCommunicationLogEvents: (ids: string[]) => Builder;
    /**
     * Adds call center agent events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterAgent} service are added:
     * <ul>
     * <li>{@link CallCenterAgent.ON_AGENT_STATE_CHANGED}</li>
     * <li>{@link CallCenterAgent.ON_AGENT_SKILL_CHANGED}</li>
     * <li>{@link CallCenterAgent.ON_SUPERVISOR_HELP_REQUESTED}</li>
     * <li>{@link CallCenterAgent.ON_SUPERVISOR_HELP_CANCELLED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to call center agent events requires having a <b>CONTACTCENTER_AGENT</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addCallCenterAgentEvents: (ids: string[]) => Builder;
    /**
     * Adds call center pilot events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterPilot} service are added:
     * <ul>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_CREATED}</li>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_QUEUED}</li>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_REMOVED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to call center pilot events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @param ids the pilot numbers to filter events on
     * @returns this builder instance
     */
    addCallCenterPilotEvents: (ids: string[]) => Builder;
    /**
     * Adds call center realtime events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterRealtime} service are added:
     * <ul>
     * <li>{@link CallCenterRealtime.ON_AGENT_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_PILOT_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_QUEUE_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_AGENT_PG_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_OTHER_PG_RTI_CHANGED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to call center realtime events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @returns this builder instance
     */
    addCallCenterRealtimeEvents: () => Builder;
    /**
     * Adds call center statistics events to the subscription.
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to call center statistics events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @returns this builder instance
     */
    addCallCenterStatisticsEvents: () => Builder;
    /**
     * Adds maintenance events to the subscription.
     * <p>
     * The following events associated to the {@link Maintenance} service are added:
     * <ul>
     * <li>{@link Maintenance.ON_CTI_LINK_DOWN}</li>
     * <li>{@link Maintenance.ON_CTI_LINK_UP}</li>
     * <li>{@link Maintenance.ON_PBX_LOADED}</li>
     * <li>{@link Maintenance.ON_PBX_LINK_DOWN}</li>
     * <li>{@link Maintenance.ON_PBX_LINK_UP}</li>
     * <li>{@link Maintenance.ON_LICENSE_EXPIRATION}</li>
     * <li>{@link Maintenance.ON_SERVER_STARTED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to maintenance events does not require any license.
     *
     * @returns this builder instance
     */
    addMaintenanceEvents: () => Builder;
    /**
     * Adds user events to the subscription.
     * <p>
     * The following event associated to the {@link Users} service is added:
     * <ul>
     * <li>{@link Users.ON_USER_INFO_CHANGED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to user events does not require any license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addUserEvents: (ids: string[]) => Builder;
    /**
     * Sets the lifetime of the event channel.
     *
     * @param value the lifetime of the event channel in minutes
     * @returns this builder instance
     */
    setTimeout: (value: number) => Builder;
    /**
     * Sets the required event version. Defaults to `"1.0"` if not specified.
     *
     * @param value the event version
     * @returns this builder instance
     */
    setVersion: (value: string) => Builder;
    /**
     * Sets the webhook to use for event notification instead of the default
     * chunked HTTP connection.
     *
     * @param webHook the webhook configuration
     * @returns this builder instance
     */
    setWebHook: (webHook: WebHook) => Builder;
    /**
     * Builds and returns a new {@link Subscription} from the current builder state.
     *
     * @returns a new {@link Subscription} instance
     */
    build: () => Subscription;
}
/**
 * Represents a subscription request used to subscribe to events from the O2G server.
 * <p>
 * By default, the application receives events over a chunked HTTP connection
 * established with the O2G server. Alternatively, a {@link WebHook} can be
 * configured to receive events via HTTP POST callbacks.
 * <p>
 * A subscription is built using the {@link Subscription.Builder} object, which
 * provides a fluent API for selecting which event packages to subscribe to.
 *
 * @example
 * ```typescript
 * // User session â€” subscribe to routing, telephony and event summary
 * const subscription = Subscription.Builder
 *     .addRoutingEvents([])
 *     .addTelephonyEvents([])
 *     .addEventSummaryEvents([])
 *     .setTimeout(10)
 *     .build();
 *
 * await O2G.subscribe(subscription);
 *
 * // Administrator session â€” subscribe to events for specific users
 * const adminSubscription = Subscription.Builder
 *     .addTelephonyEvents(["1000", "1001"])
 *     .addCallCenterAgentEvents(["*"])
 *     .addMaintenanceEvents()
 *     .build();
 *
 * await O2G.subscribe(adminSubscription);
 *
 * // Using a webhook instead of chunked HTTP
 * const webhookSubscription = Subscription.Builder
 *     .addTelephonyEvents([])
 *     .setWebHook({
 *         url: "https://myapp.example.com/o2g/events",
 *         connectDispatcher: (dispatcher) => { myDispatcher = dispatcher; }
 *     })
 *     .build();
 *
 * await O2G.subscribe(webhookSubscription);
 * ```
 */
export declare abstract class Subscription {
    private _timeout;
    private _filter;
    private _version;
    private _webHook;
    get timeout(): number;
    get version(): string;
    get filter(): EventFilter;
    get webHook(): WebHook | null;
    /**
     * The subscription builder used to construct a new {@link Subscription}.
     * <p>
     * Use the fluent API to select which event packages to subscribe to, then
     * call {@link Builder.build} to produce the subscription.
     *
     * @example
     * ```typescript
     * const subscription = Subscription.Builder
     *     .addRoutingEvents([])
     *     .addTelephonyEvents([])
     *     .setTimeout(10)
     *     .build();
     * ```
     */
    static Builder: Builder;
}
export {};
//# sourceMappingURL=subscription.d.ts.map
/**
 * Represents a supervised account when an administrator opens a supervised session.
 *
 * ## Supervised Session
 * A supervised session is opened by a supervisor (administrator) using their credentials
 * and the identification of a target user or another administrator (login name or phone number).
 *
 * If the session is successfully opened, the supervisor's credentials will be used in all subsequent
 * requests to identify the session, the supervised user, or the supervised administrator.
 *
 * After opening, a supervised session can be used like a normal user session or an administrator session.
 * In other words, this allows a supervisor to operate as the supervised user or administrator for services
 * that rely on the session.
 *
 * @see Application.login
 */
export declare class SupervisedAccount {
    #private;
    /**
     * Private constructor. Use static methods to create a SupervisedAccount.
     * @param type the type of supervised account (phone number or login name)
     * @param id the identifier for the supervised account
     */
    private constructor();
    /**
     * Creates a `SupervisedAccount` using the supervised user's phone number.
     *
     * @param phoneNumber - The phone number of the supervised user.
     * @returns A `SupervisedAccount` representing the supervised user.
     */
    static withPhoneNumber(phoneNumber: string): SupervisedAccount;
    /**
     * Creates a `SupervisedAccount` using the supervised user's login name.
     *
     * @param loginName - The login name of the supervised user.
     * @returns A `SupervisedAccount` representing the supervised user.
     */
    static withLoginName(loginName: string): SupervisedAccount;
}
//# sourceMappingURL=supervised-account.d.ts.map
/**
 * CallType represents the possible call types in a charging ticket.
 */
export declare enum CallType {
    PublicNetworkCall = "PublicNetworkCall",
    PublicNetworkCallThroughPrivateNetwork = "PublicNetworkCallThroughPrivateNetwork",
    PrivateNetworkCall = "PrivateNetworkCall",
    LocalNetworkCall = "Local etworkCall",
    PublicNetworkIncomingCall = "PublicNetwork IncomingCall",
    PublicNetworkIncomingCallThroughPrivateNetwork = "PublicNetworkIncomingCallThroughPrivateNetwork",
    Unspecified = "Unspecified",
    PrivateNetworkOutgoingCallToPublicNetwork = "PrivateNetworkOutgoingCallToPublicNetwork",
    PrivateNetworkOutgoingCallToPrivateNetwork = "PrivateNetworkOutgoingCallToPrivateNetwork",
    PublicNetworkIncomingCallToPrivateNetwork = "PublicNetworkIncomingCallToPrivateNetwork",
    PrivateNetworkIncomingCallToPrivateNetwork = "PrivateNetworkIncomingCallToPrivateNetwork",
    PublicOrPrivateNetworkOutgoingCallThroughPrivateNetwork = "PublicOrPrivateNetworkOutgoingCallThroughPrivateNetwork",
    PublicOrPrivateNetworkIncomingCallThroughPrivateNetwork = "PublicOrPrivateNetworkIncomingCallThroughPrivateNetwork",
    PrivateNetworkIncomingCall = "PrivateNetworkIncomingCall",
    LocalNode = "LocalNode",
    LocalTransit = "LocalTransit"
}
export declare namespace CallType {
    function isCallType(value: string): value is CallType;
}
//# sourceMappingURL=call-type.d.ts.map
import { CallType } from './call-type';
import { TelFacility } from './tel-facility';
/**
 * Represents a single charging record from OmniPCX Enterprise.
 *
 * Each record contains details about the call, including caller, called party,
 * duration, cost, facilities, and call type. Certain fields are only populated
 * if the query was executed with the 'all' option.
 *
 */
export declare class Charging {
    #private;
    /**
     * Creates a Charging instance.
     * @param caller - The caller phone number.
     * @param name - The caller name.
     * @param called - The called phone number.
     * @param initialDialedNumber - The initially dialed number (available with 'all' option).
     * @param callNumber - Number of charged calls (available with 'all' option).
     * @param chargingUnits - Number of charged units (available with 'all' option).
     * @param cost - The call cost (available with 'all' option).
     * @param startDate - The call start date (available with 'all' option).
     * @param duration - The call duration in seconds.
     * @param callType - The type of the call (available with 'all' option).
     * @param effectiveCallDuration - The effective call duration in seconds.
     * @param actingExtensionNumberNode - Acting extension node number.
     * @param internalFacilities - Internal facilities used for the call.
     * @param externalFacilities - External facilities used for the call.
     */
    private constructor();
    /** @returns The caller phone number. */
    get caller(): string;
    /** @returns The caller name, or `null` if not set. */
    get name(): string | null;
    /** @returns The called phone number, or `null` if not set. */
    get called(): string | null;
    /**
     * @returns The initially dialed number, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get initialDialedNumber(): string | null;
    /** @returns The number of charged calls (defaults to 0 if not set). */
    get callNumber(): number;
    /** @returns The number of charged units (defaults to 0 if not set). */
    get chargingUnits(): number;
    /** @returns The cost of the call (defaults to 0 if not set). */
    get cost(): number;
    /**
     * @returns The call start date, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get startDate(): Date | null;
    /** @returns The call duration in seconds (defaults to 0 if not set). */
    get duration(): number;
    /**
     * @returns The call type, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get callType(): CallType | null;
    /** @returns The effective call duration in seconds (defaults to 0 if not set). */
    get effectiveCallDuration(): number;
    /** @returns The acting extension node number (defaults to -1 if not set). */
    get actingExtensionNumberNode(): number;
    /** @returns The internal facilities, or `null` if not set. */
    get internalFacilities(): TelFacility[] | null;
    /** @returns The external facilities, or `null` if not set. */
    get externalFacilities(): TelFacility[] | null;
}
//# sourceMappingURL=charging.d.ts.map
/**
 * ChargingFile class represent a charging file on OmniPCX Enterprise.
 * @see {@link Analytics.getChargingFiles}
 */
export declare class ChargingFile {
    #private;
    private constructor();
    /** The name of the charging file */
    get name(): string;
    /** The date of the charging file */
    get date(): Date;
}
//# sourceMappingURL=charging-file.d.ts.map
import { Charging } from './charging';
import { DateRange } from '../common/date-range';
/**
 * Represents the result of a charging query on an OmniPCX Enterprise system.
 *
 * A `ChargingResult` contains a list of individual `Charging` entries, along with
 * optional statistics such as the number of charging files, total ticket count, and
 * number of valuable tickets. Queries can originate from a list of {@link ChargingFile}
 * or by specifying a {@link DateRange} to filter the period of interest.
 *
 * @see {@link Analytics.getChargingsFromFiles} for querying from files
 * @see {@link Analytics.getChargingsFromFilter} for querying from a time filter
 */
export declare class ChargingResult {
    #private;
    /**
     * @param chargings - Array of `Charging` entries returned by the query
     * @param range - The date range covered by the charging result, or `null` if not applicable
     * @param chargingFilesCount - Optional count of charging files used in the query
     * @param totalTicketCount - Optional total number of tickets in this result
     * @param valuableTicketCount - Optional number of valuable tickets in this result
     */
    private constructor();
    /**
     * Returns the list of individual `Charging` entries in this result.
     * @returns Array of `Charging` objects
     */
    get chargings(): Charging[];
    /**
     * Returns the date range over which this charging result applies.
     * @returns The `DateRange` object or `null` if not specified
     */
    get range(): DateRange | null;
    /**
     * Returns the number of charging files used to produce this result.
     * @returns Number of charging files (0 if not set)
     */
    get chargingFilesCount(): number;
    /**
     * Returns the total number of tickets in this charging result.
     * @returns Total ticket count (0 if not set)
     */
    get totalTicketCount(): number;
    /**
     * Returns the number of valuable tickets in this charging result.
     * @returns Count of valuable tickets (0 if not set)
     */
    get valuableTicketCount(): number;
}
//# sourceMappingURL=charging-result.d.ts.map
/**
 * Represents an incident on an OmniPCX Enterprise node.
 *
 * Each incident contains details such as severity, description, node, rack, board,
 * and the date it was raised. Incidents may occur on the main call server or on
 * a specific node, and may reference specific equipment or termination points.
 */
export declare class Incident {
    #private;
    /**
     * @ignore
     */
    private constructor();
    /** @returns The unique identifier of this incident. */
    get id(): number;
    /** @returns The date and time when this incident was raised. */
    get date(): Date;
    /** @returns The severity level of this incident. */
    get severity(): number;
    /** @returns The textual description of the incident. */
    get description(): string;
    /** @returns The number of occurrences of this incident. */
    get nbOccurs(): number;
    /** @returns The OmniPCX Enterprise node on which this incident occurred. */
    get node(): number;
    /** @returns Whether this incident occurred on the main call server. */
    get main(): boolean;
    /** @returns The rack associated with this incident, or `null` if not set. */
    get rack(): string | null;
    /** @returns The board associated with this incident, or `null` if not set. */
    get board(): string | null;
    /** @returns The equipment associated with this incident, or `null` if not set. */
    get equipment(): string | null;
    /** @returns The termination associated with this incident, or `null` if not set. */
    get termination(): string | null;
    /** @ignore Converts a DD/MM/YY string to ISO YYYY-MM-DD format. */
    private static _makeIsoDate;
    /** @ignore Converts date and hour strings from JSON to a Date object. */
    private static _makeDate;
}
//# sourceMappingURL=incident.d.ts.map
/**
 * TelFacility represents the telephonic facilities.
 */
export declare enum TelFacility {
    CallingLineIdentificationPresentation = "CallingLineIdentificationPresentation",
    ConnectedLineIdentificationPresentation = "ConnectedLineIdentificationPresentation",
    CallingLineIdentificationRestriction = "CallingLineIdentificationRestriction",
    ConnectedLineIdentificationRestriction = "ConnectedLineIdentificationRestriction",
    MaliciousCallIdentification = "MaliciousCallIdentification",
    CallForwardingUnconditional = "CallForwardingUnconditional",
    CallForwardingOnBusy = "CallForwardingOnBusy",
    CallForwardingOnNoReply = "CallForwardingOnNoReply",
    Transfer = "Transfer",
    AdviceOfChargeAtSetup = "AdviceOfChargeAtSetup",
    AdviceOfChargeDuringCall = "AdviceOfChargeDuringCall",
    AdviceOfChargeAtEnd = "AdviceOfChargeAtEnd",
    ClosedUserGroup = "ClosedUserGroup",
    CallWaiting = "CallWaiting",
    UserToUserSignalling = "UserToUserSignalling",
    UserToUserFacility = "UserToUserFacility",
    TerminalPortability = "TerminalPortability",
    Interception = "Interception",
    Booking = "Booking",
    CampOn = "CampOn",
    Conference = "Conference",
    MiniMessaging = "MiniMessaging",
    Subaddressing = "Subaddressing",
    BasicCall = "BasicCall",
    OperatorFacility = "OperatorFacility",
    Substitution = "Substitution",
    PriorityIncomingCall = "PriorityIncomingCall",
    Transit = "Transit",
    PrivateOverflowToPublic = "PrivateOverflowToPublic",
    ReroutingPublicToPrivate = "ReroutingPublicToPrivate",
    FaxServer = "FaxServer",
    VoiceMail = "VoiceMail",
    CentralAbbreviatedNumbering = "CentralAbbreviatedNumbering",
    IndividualAbbreviatedNumbering = "IndividualAbbreviatedNumbering",
    IntegratedServiceVirtualPrivateNetwork = "IntegratedServiceVirtualPrivateNetwork",
    OverflowVirtualPrivateNetwork = "OverflowVirtualPrivateNetwork",
    ARSService = "ARSService",
    DISA = "DISA",
    None = "None"
}
//# sourceMappingURL=tel-facility.d.ts.map
/**
 * Represents the groups an agent belongs to.
 */
export declare class AgentGroups {
    #private;
    /** Preferred agent group. */
    get preferred(): string | null;
    /** All agent groups the operator is part of. */
    get groups(): string[] | null;
}
//# sourceMappingURL=agent-groups.d.ts.map
/**
 * Represents a CCD operator skill.
 * Skills are used by the "Advanced Call Routing" strategy.
 */
export declare class AgentSkill {
    #private;
    private constructor();
    /** Getter for the skill number */
    get number(): number;
    /** Getter for the skill level */
    get level(): number;
    /** Getter for whether the skill is active */
    get active(): boolean;
}
//# sourceMappingURL=agent-skill.d.ts.map
import { AgentSkill } from './agent-skill';
/**
 * Represents the set of skills assigned to a CCD agent.
 * <p>
 * An `AgentSkillSet` is a collection of {@link AgentSkill} objects indexed by
 * skill number. It is returned as part of the agent's configuration and state,
 * and can be used to check which skills an agent has and whether specific
 * skills are active.
 *
 * @see CallCenterAgent.getConfiguration
 * @see CallCenterAgent.activateSkills
 * @see CallCenterAgent.deactivateSkills
 */
export declare class AgentSkillSet {
    #private;
    /**
     * Returns the skill with the specified number.
     *
     * @param number the skill number
     * @returns the {@link AgentSkill} with the specified number, or `null` if not found
     */
    get(number: number): AgentSkill | null;
    /**
     * Returns whether the specified skill number exists in this skill set.
     *
     * @param number the skill number to check
     * @returns `true` if the skill is present; `false` otherwise
     */
    contains(number: number): boolean;
    /**
     * Returns the set of skill numbers contained in this skill set.
     *
     * @returns a `Set` of skill numbers
     */
    get skillsNumbers(): Set<number>;
    /**
     * Returns all skills in this skill set.
     *
     * @returns the list of {@link AgentSkill} objects
     */
    get skills(): AgentSkill[];
}
//# sourceMappingURL=agent-skill-set.d.ts.map
import { AgentSkillSet } from './agent-skill-set';
import { OperatorState } from './operator-state';
/**
 * Notification sent when an agent's skills have changed.
 */
export declare class OnAgentSkillChanged {
    #private;
    private constructor();
    /** Login name of the agent (identifier which can be used for filtering). */
    get loginName(): string;
    /** Updated set of skills for the agent. */
    get skills(): AgentSkillSet;
}
/**
 * Notification sent when an agent's state has changed.
 */
export declare class OnAgentStateChanged {
    #private;
    private constructor();
    /** Login name of the agent (identifier which can be used for filtering). */
    get loginName(): string;
    /** Updated state of the agent. */
    get state(): OperatorState;
}
/**
 * Notification sent when a supervisor cancels a help request from an agent.
 */
export declare class OnSupervisorHelpCancelled {
    #private;
    /** Login name of the supervisor or agent requesting help. */
    get loginName(): string;
    /** The agent number for whom the help was cancelled. */
    get agentNumber(): string;
}
/**
 * Notification sent when a supervisor help is requested by an agent.
 */
export declare class OnSupervisorHelpRequested {
    #private;
    /** Login name of the supervisor or agent requesting help. */
    get loginName(): string;
    /** The agent number requesting the supervisor's help. */
    get agentNumber(): string;
}
//# sourceMappingURL=cc-agent-events.d.ts.map
/**
 * IntrusionMode represents the possible intrusion mode.
 * <p>
 * A supervisor can intrude in an established CCD call. The intrusion depends on the IntrusionMode.
 * @see {@link CallCenterAgent.requestIntrusion}
 */
export declare enum IntrusionMode {
    /**
     * The supervisor can talk to both the agent and the remote customer.
     */
    NORMAL = "NORMAL",
    /**
     * The supervisor can only talk to the agent but listen to the remote customer.
     */
    RESTRICTED = "RESTRICTED",
    /**
     * The supervisor only listens to the conversation between agent and customer.
     */
    DISCRETE = "DISCRETE",
    /**
     * The supervisor stops the intrusion
     */
    STOP = "STOP"
}
//# sourceMappingURL=intrusion-mode.d.ts.map
import { AgentGroups } from './agent-groups';
import { AgentSkillSet } from './agent-skill-set';
import { OperatorType } from './operator-type';
/**
 * `OperatorConfig` represents the configuration of a CCD operator.
 *
 * A CCD operator can be an {@link OperatorType.AGENT | agent}
 * or an {@link OperatorType.SUPERVISOR | supervisor}. This class
 * provides access to the operatorâ€™s type, associated pro-ACD station,
 * group memberships, skills, and feature settings
 * (such as headset usage, self-assignment capability, or multiline configuration).
 */
export declare class OperatorConfig {
    #private;
    /**
     * Returns the type of CCD operator (agent or supervisor).
     *
     * @returns The operator type.
     */
    get type(): OperatorType;
    /**
     * Returns the associated pro-ACD station.
     *
     * @returns The pro-ACD station extension number,
     *          or `null` if none is associated.
     */
    get proacd(): string | null;
    /**
     * Returns the agent groups the operator is attached to,
     * including the preferred group if defined.
     *
     * @returns The {@link AgentGroups} instance representing
     *          the operatorâ€™s group memberships,
     *          or `null` if none are configured.
     */
    get processingGroups(): AgentGroups | null;
    /**
     * Returns the operatorâ€™s assigned skills.
     *
     * @returns The {@link AgentSkillSet} instance representing
     *          the operatorâ€™s skills,
     *          or `null` if none are defined.
     */
    get skills(): AgentSkillSet | null;
    /**
     * Indicates whether the operator can choose their own processing group.
     *
     * @returns `true` if the operator can self-assign a group;
     *          `false` otherwise.
     */
    get selfAssign(): boolean;
    /**
     * Indicates whether the operator has the headset feature enabled.
     *
     * The headset feature allows a CCD operator to answer calls using a headset device.
     *
     * @returns `true` if headset functionality is enabled;
     *          `false` otherwise.
     */
    get headset(): boolean;
    /**
     * Indicates whether the operator can request help from a supervisor.
     *
     * @returns `true` if the operator can request help;
     *          `false` otherwise.
     */
    get help(): boolean;
    /**
     * Indicates whether the operator is configured as multiline.
     *
     * @returns `true` if the operator supports multiline handling;
     *          `false` otherwise.
     */
    get multiline(): boolean;
}
//# sourceMappingURL=operator-config.d.ts.map
/**
 * `OperatorState` represents the current state of a CCD operator.
 *
 * This includes both the static login/logoff state (`mainState`) and
 * the dynamic activity state (`subState`). Additional properties track
 * the pro-ACD device, processing group, withdrawal status, and
 * withdrawal reason index.
 */
export declare class OperatorState {
    #private;
    /**
     * Returns the static (main) state of the operator,
     * indicating login, logoff, or error status.
     */
    get mainState(): OperatorState.OperatorMainState;
    /**
     * Returns the dynamic (sub) state of the operator,
     * indicating the operator's current activity or wrap-up phase.
     *
     * Defaults to `OperatorDynamicState.UNKNOWN` if undefined.
     */
    get subState(): OperatorState.OperatorDynamicState;
    /**
     * Returns the pro-ACD device number the operator is logged on.
     *
     * @returns The extension number, or `null` if the operator is not logged on.
     */
    get proAcdDeviceNumber(): string | null;
    /**
     * Returns the processing group the operator is currently logged into.
     *
     * @returns The PG number, or `null` if the operator is not in any group.
     */
    get pgNumber(): string | null;
    /**
     * Returns the withdraw reason index for the operator.
     *
     * @returns The withdraw reason index, or `null` if not in withdraw state.
     */
    get withdrawReason(): number | null;
    /**
     * Indicates whether the operator is currently in withdraw state.
     *
     * @returns `true` if the operator is withdrawn from call distribution, `false` otherwise.
     */
    get withdraw(): boolean;
}
/**
 * Namespace containing enums used by `OperatorState`.
 */
export declare namespace OperatorState {
    /**
     * Represents the static login/logoff state of a CCD operator.
     */
    enum OperatorMainState {
        /** The O2G server is unable to determine the operator's main state. */
        UNKNOWN = "UNKNOWN",
        /** The operator is logged on a pro-ACD device. */
        LOG_ON = "LOG_ON",
        /** The operator is logged off. */
        LOG_OFF = "LOG_OFF",
        /** Error status. */
        ERROR = "ERROR"
    }
    /**
     * Represents the dynamic activity state of a CCD operator.
     *
     * Dynamic states indicate the operator's current activity,
     * wrap-up phase, or pause status.
     */
    enum OperatorDynamicState {
        /** The operator is ready to receive calls. */
        READY = "READY",
        /** The operator is logged on but not entered into any agent group. */
        OUT_OF_PG = "OUT_OF_PG",
        /** The operator is busy handling a call. */
        BUSY = "BUSY",
        /** The operator is entering a transaction code. */
        TRANSACTION_CODE_INPUT = "TRANSACTION_CODE_INPUT",
        /** The operator is in automatic wrap-up phase. */
        WRAPUP = "WRAPUP",
        /** The operator is in a pause state. */
        PAUSE = "PAUSE",
        /** The operator has withdrawn from call distribution. */
        WITHDRAW = "WITHDRAW",
        /** The operator is in wrap-up due to handling an instant message (IM). */
        WRAPUP_IM = "WRAPUP_IM",
        /** The operator is in wrap-up due to handling an email. */
        WRAPUP_EMAIL = "WRAPUP_EMAIL",
        /** The operator is in wrap-up due to handling an email, but can still receive CCD calls. */
        WRAPUP_EMAIL_INTERRUPTIBLE = "WRAPUP_EMAIL_INTERRUPTIBLE",
        /** The operator is in wrap-up after an outbound call. */
        WRAPUP_OUTBOUND = "WRAPUP_OUTBOUND",
        /** The operator is in wrap-up after a web callback call. */
        WRAPUP_CALLBACK = "WRAPUP_CALLBACK",
        /** The O2G server is unable to determine the operator's dynamic state. */
        UNKNOWN = "UNKNOWN"
    }
}
//# sourceMappingURL=operator-state.d.ts.map
/**
 * OperatorType represents the CCD operator, either Agent or Supervisor.
 */
export declare enum OperatorType {
    /**
     * CCD Agent.
     */
    AGENT = "AGENT",
    /**
     * CCD Supervisor.
     */
    SUPERVISOR = "SUPERVISOR"
}
export declare namespace OperatorType {
    function isOperatorType(value: string): value is OperatorType;
}
//# sourceMappingURL=operator-type.d.ts.map
/**
 * {@code WithdrawReason} represents a reason why a CCD agent is in a withdraw state.
 *
 * Withdraw reasons are used by the CCD system for reporting and statistical purposes.
 * They help to understand why an agent is temporarily unavailable for call distribution.
 * Each reason has a unique index within the processing group and a descriptive label.
 */
export declare class WithdrawReason {
    #private;
    /**
     * Returns the index of this withdraw reason within the agent's processing group.
     *
     * @returns The unique numeric index for this withdraw reason.
     */
    get index(): number;
    /**
     * Returns the human-readable label describing this withdraw reason.
     *
     * @returns The descriptive label for the reason, or {@code null} if none is set.
     */
    get label(): string | null;
}
//# sourceMappingURL=withdraw-reason.d.ts.map
import { Transition } from './transition';
export declare abstract class AbstractCalendar<T> {
    protected transitions: Map<T, Transition[]>;
    constructor(transitions: Map<T, Transition[]>);
    protected _getTransitions(element: T): Transition[] | undefined;
    protected _getItemAt(element: T, index: number): Transition | undefined;
}
//# sourceMappingURL=abstract-calendar.d.ts.map
import { ExceptionCalendar } from './exception-calendar';
import { NormalCalendar } from './normal-calendar';
/**
 * Represents a pilot's calendar, combining normal and exceptional days.
 *
 * - The **normal calendar** defines standard behavior for each day of the week.
 * - The **exceptional calendar** defines special days (e.g., holidays) that override the normal calendar.
 */
export declare class Calendar {
    #private;
    /**
     * Returns the normal days calendar.
     * @returns {NormalCalendar | null} The normal calendar, or null if not set
     */
    get normalDays(): NormalCalendar | null;
    /**
     * Returns the exceptional days calendar.
     * @returns {ExceptionCalendar | null} The exceptional calendar, or null if not set
     */
    get exceptionDays(): ExceptionCalendar | null;
}
//# sourceMappingURL=calendar.d.ts.map
import { AbstractCalendar } from './abstract-calendar';
import { Transition } from './transition';
/**
 * Represents the exceptional calendar associated with a CCD pilot.
 *
 * This calendar defines special days, such as holidays or other exceptions,
 * that override the normal calendar behavior. Each exceptional day can
 * have up to 10 transitions (time slots), specifying changes in pilot operating mode.
 */
export declare class ExceptionCalendar extends AbstractCalendar<string> {
    #private;
    /**
     * Returns the set of exceptional dates configured in this calendar.
     * @returns {Set<Date>} Set of Date objects representing exceptional days
     */
    get exceptionDates(): Set<Date>;
    /**
     * Retrieves a specific transition for an exceptional date by index.
     * @param {Date} date - The exceptional date
     * @param {number} index - Index of the transition (0-9)
     * @returns {Transition | undefined} The transition at the given index, or undefined if not found
     */
    getTransitionAt(date: Date, index: number): Transition | null;
    /**
     * Returns all transitions for a given exceptional date.
     * @param {Date} date - The exceptional date
     * @returns {Transition[]} Array of transitions for the date, null if none
     */
    getTransitions(date: Date): Transition[] | null;
}
//# sourceMappingURL=exception-calendar.d.ts.map
import { AbstractCalendar } from './abstract-calendar';
import { DayOfWeek } from '../../common/day-of-week';
import { Transition } from './transition';
/**
 * Represents the normal calendar associated with a CCD pilot.
 *
 * The normal calendar defines the pilot's behavior for each day of the week.
 * Each day can have up to 10 transitions (time slots), for a maximum of 70 per week.
 * Transitions indicate changes in the pilot's operating mode triggered by rules at specific times.
 */
export declare class NormalCalendar extends AbstractCalendar<DayOfWeek> {
    /**
     * Returns the set of days that have transitions configured in this calendar.
     * @returns {Set<DayOfWeek>} Set of days with transitions
     */
    get days(): Set<DayOfWeek>;
    /**
     * Retrieves a specific transition by day and index.
     * @param {DayOfWeek} day - The day of the week
     * @param {number} index - The index of the transition within the day
     * @returns {Transition | undefined} The transition at the given index, or undefined if not found
     */
    getransitionAt(day: DayOfWeek, index: number): Transition | null;
    /**
     * Returns all transitions for a specific day.
     * @param {DayOfWeek} day - The day of the week
     * @returns {Transition[]} Array of transitions for the given day, null if none
     */
    getTransitions(day: DayOfWeek): Transition[] | null;
}
//# sourceMappingURL=normal-calendar.d.ts.map
/**
 * Represents the possible operating modes of a CCD pilot.
 */
export declare enum PilotOperatingMode {
    /**
     * The pilot operates in normal (opened) mode.
     */
    NORMAL = "normal",
    /**
     * The pilot operates in closed mode.
     */
    CLOSED = "closed",
    /**
     * The pilot operates in forward mode.
     */
    FORWARD = "forward"
}
//# sourceMappingURL=pilot-operating-Mode.d.ts.map
import { PilotOperatingMode } from './pilot-operating-Mode';
/**
 * Represents a state transition of a pilot.
 * Each transition indicates a change in the pilot's operating mode,
 * triggered by a specific rule, at a specific time.
 */
export declare class Transition {
    #private;
    /**
     * Creates a new Transition instance.
     * @param {Transition.Time} time - The time of the transition
     * @param {number} ruleNumber - The rule number that triggered this transition
     * @param {PilotOperatingMode} mode - The operating mode of the pilot after the transition
     */
    constructor(time: Transition.Time, ruleNumber: number, mode: PilotOperatingMode);
    /**
     * The time at which the transition occurred.
     * @returns {Transition.Time} Transition time
     */
    get time(): Transition.Time;
    /**
     * The rule number that triggered this transition.
     * @returns {number} Rule number
     */
    get ruleNumber(): number;
    /**
     * The pilot's operating mode after this transition.
     * @returns {PilotOperatingMode} Operating mode
     */
    get mode(): PilotOperatingMode;
}
export declare namespace Transition {
    /**
     * Represents the time of a transition in a pilot calendar.
     * Time is expressed in 24-hour format (HH:mm).
     */
    class Time {
        private _hour;
        private _minute;
        constructor(_hour: number, _minute: number);
        /**
         * The hour of the transition (0-23).
         * @returns {number} Hour component
         */
        get hour(): number;
        /**
         * The minute of the transition (0-59).
         * @returns {number} Minute component
         */
        get minute(): number;
        /**
         * Returns the time formatted as a string in HH:mm format.
         * @returns {string} Time as HH:mm
         */
        toString(): string;
        /**
         * Parses a time string in HH:mm format and returns a Time instance.
         * @param {string} value - Time string to parse
         * @returns {Time} Parsed Time instance
         * @throws {Error} If the time string is invalid or out of range
         */
        static parse(value: string): Time;
    }
}
//# sourceMappingURL=transition.d.ts.map
import { ServiceState } from '../common/service-state';
import { PilotStatus } from '../telephony/call/ccd/pilot-status';
import { PilotRule } from './pilot-rule';
/**
 * Represents an Automatic Call Distributor (ACD) pilot.
 * A pilot is an endpoint (e.g., agent or group) that can receive calls
 * according to routing rules and service states.
 */
export declare class Pilot {
    #private;
    private constructor();
    /**
     * The unique identifier of the pilot (e.g., agent extension or pilot number).
     * @returns {string | null} Pilot number or null if unavailable
     */
    get number(): string | null;
    /**
     * The display name of the pilot (e.g., agent name).
     * @returns {string | null} Pilot name or null if unavailable
     */
    get name(): string | null;
    /**
     * The current high-level service state of the pilot (e.g., available, busy).
     * @returns {ServiceState | null} Pilot state or null if unavailable
     */
    get state(): ServiceState | null;
    /**
     * The detailed service status of the pilot (e.g., in a call, on break).
     * @returns {PilotStatus | null} Detailed pilot state or null if unavailable
     */
    get detailedState(): PilotStatus | null;
    /**
     * Estimated waiting time for the pilot to become available, in seconds.
     * @returns {number} Waiting time in seconds, defaults to 0
     */
    get waitingTime(): number;
    /**
     * Whether the pilot is currently saturated (i.e., unable to receive additional calls).
     * @returns {boolean} True if saturated, false otherwise
     */
    get saturation(): boolean;
    /**
     * Routing rules associated with this pilot.
     * @returns {PilotRule[] | null} Array of routing rules or null if none
     */
    get rules(): PilotRule[] | null;
    /**
     * Indicates if transferring a call to this pilot is possible.
     * @returns {boolean} True if transfer is possible, false otherwise
     */
    get possibleTransfer(): boolean;
    /**
     * Indicates if a call transfer to this pilot can be supervised.
     * @returns {boolean} True if supervised transfer is allowed, false otherwise
     */
    get supervisedTransfer(): boolean;
}
//# sourceMappingURL=pilot.d.ts.map
/**
 * Represents a routing rule associated with a pilot in an ACD system.
 * Each rule defines how calls are distributed to a pilot and whether it is currently active.
 */
export declare class PilotRule {
    #private;
    private constructor();
    /**
     * The unique number identifying this rule.
     * @returns {number} Rule number
     */
    get ruleNumber(): number;
    /**
     * The display name of the rule, if defined.
     * @returns {string | null} Rule name or null if not set
     */
    get name(): string | null;
    /**
     * Indicates whether this routing rule is currently active.
     * @returns {boolean} True if the rule is active, false otherwise
     */
    get active(): boolean;
}
//# sourceMappingURL=pilot-rule.d.ts.map
import { PilotRule } from './pilot-rule';
/**
 * Represents a collection of routing rules associated with a pilot.
 * Provides convenient access to individual rules by number, checks for rule existence,
 * and allows retrieval of all rule numbers or rules.
 */
export declare class PilotRuleSet {
    #private;
    private constructor();
    /**
     * Retrieves the pilot rule with the specified number.
     * @param {number} number - The unique number of the rule to retrieve
     * @returns {PilotRule | undefined} The corresponding PilotRule, or undefined if not found
     */
    get(number: number): PilotRule | undefined;
    /**
     * Determines whether a rule with the specified number exists in this rule set.
     * @param {number} number - The rule number to search for
     * @returns {boolean} True if the rule exists, false otherwise
     */
    contains(number: number): boolean;
    /**
     * Returns the set of rule numbers present in this rule set.
     * @returns {Set<number>} A Set containing all rule numbers
     */
    get rulesNumbers(): Set<number>;
    /**
     * Returns all the rules in this rule set as an array.
     * @returns {PilotRule[]} An array of PilotRule objects
     */
    get rules(): PilotRule[];
}
//# sourceMappingURL=pilot-rule-set.d.ts.map
import { CorrelatorData } from '../telephony/call/correlator-data';
import { TrunkIdentification } from '../telephony/trunk-indentification';
/**
 * Represents the detailed information associated with a pilot call.
 *
 * Provides access to the initial called party, call anonymity status,
 * trunk information for external calls, network rerouting status,
 * and any associated correlator data.
 */
export declare class CallDataPilot {
    #private;
    /**
     * @ignore
     */
    private constructor();
    /**
     * Returns the initial party that was called.
     *
     * @returns the initial called party
     */
    get initialCalled(): string | null;
    /**
     * Indicates whether this call is anonymous.
     *
     * @returns `true` if the call is anonymous; `false` otherwise
     */
    get anonymous(): boolean;
    /**
     * Returns the trunk information in case of an external call.
     *
     * @returns the {@link TrunkIdentification} associated with the call, or `undefined` if not applicable
     */
    get trunkIdentification(): TrunkIdentification | null;
    /**
     * Indicates whether this call has been rerouted over the network.
     *
     * @returns `true` if the call has been rerouted; `false` otherwise
     */
    get networkRerouted(): boolean;
    /**
     * Returns the correlator data associated with this call.
     *
     * The data may come from either a standard string or a hexadecimal binary
     * representation. If no data is attached, this method returns `null`.
     *
     * @returns the {@link CorrelatorData} associated with this call, or `null` if none is available
     */
    get correlatorData(): CorrelatorData | null;
}
//# sourceMappingURL=call-data-pilot.d.ts.map
import { CallCause } from '../telephony/call/call-cause';
import { CallDataPilot } from './call-data-pilot';
/**
 * Event fired when a new call is received by a specific pilot.
 *
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_CREATED, (e: OnPilotCallCreated) => {
 *      console.log(e.pilot, e.caller, e.callRef);
    });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_CREATED
 */
export declare class OnPilotCallCreated {
    #private;
    /**
     * Gets the pilot number receiving the call.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string;
    /**
     * Gets the caller's phone number.
     * @returns The caller's phone number as a string.
     */
    get caller(): string;
    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string;
    /**
     * Gets the cause or reason for the call event.
     * @returns The {@link CallCause} of this call event.
     */
    get cause(): CallCause;
    /**
     * Gets optional additional data associated with the call for this pilot.
     * @returns The {@link CallDataPilot} if available, otherwise `null`.
     */
    get callData(): CallDataPilot | null;
}
/**
 * Event fired when a call is queued for a specific pilot.
 *
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot;
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_QUEUED, (e: OnPilotCallQueued) => {
 *      console.log(e.pilot, e.caller, e.queue, e.callRef, e.queuedCallsCount);
 * });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_QUEUED
 */
export declare class OnPilotCallQueued {
    #private;
    /**
     * Gets the pilot number for which the call is queued.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string;
    /**
     * Gets the caller's phone number.
     * @returns The caller's phone number as a string.
     */
    get caller(): string;
    /**
     * Gets the queue identifier or number.
     * @returns The queue number (if distribution) or identifier (if overflow) as a string.
     */
    get queue(): string | null;
    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string;
    /**
     * Gets the cause or reason for this queued call event.
     * @returns The {@link CallCause} of this event.
     */
    get cause(): CallCause;
    /**
     * Gets the number of calls currently queued in the pilot's queue.
     * Returns -1 if the value is unavailable.
     * @returns Number of queued calls as a number.
     */
    get queuedCallsCount(): number;
}
/**
 * Event fired when a call has been removed from a specific pilot.
 *
 * This can happen due to distribution, cancellation, or overflow.
 *
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot;
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_REMOVED, (e: OnPilotCallRemoved) => {
 *      console.log(e.pilot, e.releasingDevice, e.newDestination, e.callRef, e.cause);
 * });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_REMOVED
 */
export declare class OnPilotCallRemoved {
    #private;
    /**
     * Gets the pilot number from which the call was removed.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string;
    /**
     * Gets the device that released the call.
     * @returns The releasing device's phone number as a string.
     */
    get releasingDevice(): string;
    /**
     * Gets the new destination of the call after it was removed.
     * @returns The new destination's phone number as a string.
     */
    get newDestination(): string;
    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string;
    /**
     * Gets the cause or reason why the call was removed.
     * @returns The {@link CallCause} of this event.
     */
    get cause(): CallCause;
}
//# sourceMappingURL=cc-pilot-events.d.ts.map
/**
 * `AgentAttributes` represents the possible real-time attributes
 * for a CCD agent.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export declare enum RtiAgentAttributes {
    /** The associated pro-acd set of the agent. */
    AssociatedSet = "AssociatedSet",
    /** The current processing group of the agent. */
    CurrentPG = "CurrentPG",
    /** The phone state of the agent (e.g., ringing, talking, idle). */
    PhoneState = "PhoneState",
    /** The UTC logon date of the agent. */
    LogonDate = "LogonDate",
    /** The total duration (in seconds) of all private calls. */
    PrivateCallsTotalDuration = "PrivateCallsTotalDuration",
    /** The UTC date when the agent entered the current communication. */
    ComDate = "ComDate",
    /** The duration (in seconds) of the current communication. */
    ComDuration = "ComDuration",
    /** The number of private calls handled by the agent. */
    NBOfPrivateCalls = "NBOfPrivateCalls",
    /** The number of answered ACD calls. */
    NbOfServedACDCalls = "NbOfServedACDCalls",
    /** The number of non-answered ACD calls. */
    NbOfRefusedACDCalls = "NbOfRefusedACDCalls",
    /** The number of transferred ACD calls. */
    NbOfTransferredACDCalls = "NbOfTransferredACDCalls",
    /** The number of outgoing ACD calls. */
    NbOfOutgoingACDCalls = "NbOfOutgoingACDCalls",
    /** The number of picked-up ACD calls (intercepted calls). */
    NbOfInterceptedACDCalls = "NbOfInterceptedACDCalls",
    /** The service state of the agent (e.g., loggedIn, assigned, available). */
    ServiceState = "ServiceState",
    /** The number of withdrawals taken by the agent. */
    NbOfWithdrawals = "NbOfWithdrawals",
    /** The total duration of withdrawals taken by the agent. */
    WithdrawalsTotalDuration = "WithdrawalsTotalDuration",
    /** The reason for the last withdrawal. */
    WithdrawReason = "WithdrawReason",
    /** The name of the pilot associated with the agent. */
    PilotName = "PilotName",
    /** The name of the queue associated with the agent. */
    QueueName = "QueueName",
    /** Represents all attributes. */
    ALL = "ALL"
}
//# sourceMappingURL=agent-attributes.d.ts.map
/**
 * `AgentProcessingGroupAttributes` represents the possible real-time attributes
 * for a CCD agent processing group.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export declare enum RtiAgentProcessingGroupAttributes {
    /** Service state of the processing group (e.g., Open, Blocked). */
    State = "State",
    /** Number of agents who are withdrawn. */
    NbOfWithdrawnAgents = "NbOfWithdrawnAgents",
    /** Number of agents currently in a private call. */
    NbOfAgentsInPrivateCall = "NbOfAgentsInPrivateCall",
    /** Number of agents currently handling an ACD call. */
    NbOfAgentsInACDCall = "NbOfAgentsInACDCall",
    /** Number of agents in ringing ACD calls. */
    NbOfAgentsInACDRinging = "NbOfAgentsInACDRinging",
    /** Number of agents in established ACD conversations. */
    NbOfAgentsInACDConv = "NbOfAgentsInACDConv",
    /** Number of agents in wrap-up or entering a transaction code. */
    NbOfAgentsInWrapupAndTransaction = "NbOfAgentsInWrapupAndTransaction",
    /** Number of agents currently in pause. */
    NbOfAgentsInPause = "NbOfAgentsInPause",
    /** Number of busy agents (either in ACD or private calls). */
    NbOfBusyAgents = "NbOfBusyAgents",
    /** Number of logged-on agents. */
    NbOfLoggedOnAgents = "NbOfLoggedOnAgents",
    /** Number of free agents, including withdrawn agents. */
    NbOfFreeAgents = "NbOfFreeAgents",
    /** Number of free agents, excluding withdrawn agents. */
    NbOfIdleAgents = "NbOfIdleAgents",
    /** Number of logged-on agents, excluding withdrawn and free agents. */
    NbOfLoggedOnAndNotWithdrawnAgents = "NbOfLoggedOnAndNotWithdrawnAgents",
    /** Current waiting time (in seconds) on the queues potentially served by this group. */
    ConsolidatedQueuesWaitingTime = "ConsolidatedQueuesWaitingTime",
    /** Number of waiting calls on the queues potentially served by this group. */
    ConsolidatedQueuesNbOfWaitingCalls = "ConsolidatedQueuesNbOfWaitingCalls",
    /** Expected waiting time (EWT, in seconds) on the queues potentially served by this group. */
    ConsolidatedQueuesEWT = "ConsolidatedQueuesEWT",
    /** Service level for all pilots potentially serving this group (average/best/worst). */
    ServiceLevel = "ServiceLevel",
    /** Efficiency for all pilots potentially serving this group (average/best/worst). */
    Efficiency = "Efficiency",
    /** Number of incoming calls within the last minute. */
    IncomingTraffic = "IncomingTraffic",
    /** Represents all attributes. */
    ALL = "ALL"
}
//# sourceMappingURL=agent-pg-attributes.d.ts.map
/**
 * Represents the possible types of agent processing groups.
 *
 * @see OnPGAgentRtiChangedEvent
 * @since 2.7.4
 */
export declare enum AgentProcessingGroupType {
    /** Standard agent processing group. */
    AGENT = "Agent",
    /** IVR (Interactive Voice Response) processing group. */
    IVR = "IVR",
    /** IVR-in-Queue processing group. */
    QUEUED_IVR = "QueuedIVR",
    /** Unknown or unspecified processing group type. */
    UNKNOWN = "unknown"
}
//# sourceMappingURL=agent-pg-type.d.ts.map
/**
 * Represents the possible telephonic states of a CCD agent.
 *
 * These states are reported by real-time events such as
 * `OnAcdStatsProgressEvent` and related RTI notifications.
 *
 * @since 2.7.4
 */
export declare enum AgentPhoneState {
    /** Idle (agent is free). */
    IDLE = "Idle",
    /** Only for analog devices: device is off-hook. */
    LINE_LOCKOUT = "LineLockout",
    /** Out of service. */
    OUT_OF_ORDER = "OutOfOrder",
    /** Ringing (incoming ACD call). */
    ACD_RINGING = "AcdRinging",
    /** Call in progress (ACD call). */
    ACD_TALKING = "AcdConversation",
    /** In call or on hold while establishing another connection (double call). */
    ACD_CONSULTATION = "AcdConsultation",
    /** Request for help (supervisor support). */
    HELP = "Help",
    /** In conference call. */
    ACD_CONFERENCE = "AcdConference",
    /** Dialing transaction code. */
    TRANSACTION_ON_DIAL = "TransactionOnDial",
    /** In pause state. */
    PAUSE = "Pause",
    /** In wrap-up state after a call. */
    WRAP_UP = "WrapUp",
    /** Requester-only: discreet listening. */
    SUPERVISOR_DISCRETE_LISTENING = "SupervisorDiscreteListening",
    /** Agent is monitored during discreet listening. */
    AGENT_DISCRETE_LISTENING = "AgentDiscreteListening",
    /** Recording call in progress. */
    RECORDING = "Recording",
    /** Agent has logged off. */
    LOGGED_OUT = "LoggedOut",
    /** Agent or correspondent has placed the call on hold. */
    HELD = "Held",
    /** Dialing a call. */
    DIALING = "Dialing",
    /** Ringing state (local visual/melodic). */
    PRIVATE_RINGING = "PrivateRinging",
    /** Local call in progress. */
    PRIVATE_LOCAL_CONVERSATION = "PrivateLocalConversation",
    /** External call in progress. */
    PRIVATE_EXTERNAL_CONVERSATION = "PrivateExternalConversation",
    /** Call established or on hold, with a second call in establishment or hold. */
    PRIVATE_CONSULTATION = "PrivateConsultation",
    /** In a conference call. */
    PRIVATE_CONFERENCE = "PrivateConference",
    /** Busy tone. */
    BUSY_TONE = "BusyTone",
    /** Reserved by the attendant. */
    RESERVED = "Reserved",
    /** Outgoing ACD call. */
    ACD_OUTGOING_CONVERSATION = "AcdOutgoingConversation",
    /** Supervisor in "listening on agent". */
    CONTINUOUS_SUPERVISION = "ContinuousSupervision",
    /** Fake call that does not block the GT (IVR). */
    UNAVAILABLE = "Unavailable",
    /** Unknown telephonic state. */
    UNKNOWN = "unknown"
}
//# sourceMappingURL=agent-phone-state.d.ts.map
/**
 * Represents the possible states for an agent.
 */
export declare enum AgentServiceState {
    /** The agent is logged out. */
    LOGGED_OUT = "LoggedOut",
    /** The agent is logged in a processing group. */
    LOGGED_IN = "LoggedIn",
    /** The agent is assigned in a processing group. */
    ASSIGNED = "Assigned",
    /** The agent is in withdraw state. */
    WITHDRAWN = "Withdrawn",
    /** Unknown agent state. */
    UNKNOWN = "unknown"
}
//# sourceMappingURL=agent-service-type.d.ts.map
/**
 * Represents the possible types of an agent.
 *
 * An agent can be either a `NORMAL` human agent or an `IVR`
 * (Interactive Voice Responder) agent.
 *
 * @see OnPGAgentRtiChangedEvent
 * @since 2.7.4
 */
export declare enum AgentType {
    /** Normal human agent. */
    NORMAL = "Normal",
    /** IVR (Interactive Voice Responder) agent. */
    IVR = "IVR"
}
//# sourceMappingURL=agent-type.d.ts.map
import { ServiceState } from '../common/service-state';
import { AgentProcessingGroupType } from './agent-pg-type';
import { AgentPhoneState } from './agent-phone-state';
import { AgentServiceState } from './agent-service-type';
import { AgentType } from './agent-type';
import { OtherProcessingGroupType } from './other-pg-type';
import { QueueType } from './queue-type';
/**
 * Event representing changes in the attributes of a CCD agent.
 *
 * This class is delivered whenever one or more agent attributes change.
 * Only the attributes that have changed since the previous notification are included.
 *
 * Typical usage:
 * ```ts
 * override onAgentRtiChanged(e: OnAgentRtiChanged): void {
 *   const nbServedACDCalls = e.nbOfServedACDCalls;
 *   // ...
 * }
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export declare class OnAgentRtiChanged {
    #private;
    /** Returns the agent's last name. */
    get name(): string;
    /** Returns the agent's first name. */
    get firstName(): string | undefined;
    /** Returns the agent's directory number. */
    get number(): string;
    /** Returns the agent type (normal or IVR). */
    get type(): AgentType;
    /** Returns the logon date of the agent. */
    get logonDate(): Date | undefined;
    /** Returns the current service state of the agent. */
    get serviceState(): AgentServiceState | undefined;
    /** Returns the date when the service state was last updated. */
    get serviceStateDate(): Date | undefined;
    /** Returns the current phone state of the agent. */
    get phoneState(): AgentPhoneState | undefined;
    /** Returns the date when the phone state was last updated. */
    get phoneStateDate(): Date | undefined;
    /** Returns the name of the associated pilot, if any. */
    get pilotName(): string | undefined;
    /** Returns the name of the associated queue, if any. */
    get queueName(): string | undefined;
    /** Returns the number of withdrawals performed by the agent. */
    get nbOfWithdrawals(): number | undefined;
    /** Returns the total duration of withdrawals in seconds. */
    get withdrawalsTotalDuration(): number | undefined;
    /** Returns the number of private calls handled by the agent. */
    get nbOfPrivateCalls(): number | undefined;
    /** Returns the total duration of private calls in seconds. */
    get privateCallsTotalDuration(): number | undefined;
    /** Returns the number of ACD calls served by the agent. */
    get nbOfServedACDCalls(): number | undefined;
    /** Returns the number of outgoing ACD calls by the agent. */
    get nbOfOutgoingACDCalls(): number | undefined;
    /** Returns the number of refused ACD calls. */
    get nbOfRefusedACDCalls(): number | undefined;
    /** Returns the number of intercepted ACD calls. */
    get nbOfInterceptedACDCalls(): number | undefined;
    /** Returns the number of transferred ACD calls. */
    get nbOfTransferedACDCalls(): number | undefined;
    /** Returns the current processing group the agent belongs to. */
    get currentPG(): string | undefined;
    /** Returns the associated set of the agent. */
    get associatedSet(): string | undefined;
    /** Returns the reason code for withdrawals, if any. */
    get withdrawReason(): number | undefined;
    /** Returns the AFE key associated with the agent. */
    get afeKey(): number | undefined;
}
/**
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export declare class OnPilotRtiChanged {
    #private;
    /** Returns the name of the pilot. */
    get name(): string;
    /** Returns the directory number of the pilot. */
    get number(): string;
    /** Returns the current service state of the pilot. */
    get state(): ServiceState | undefined;
    /** Returns the number of calls currently in progress for the pilot. */
    get nbOfRunningCalls(): number | undefined;
    /** Returns the service level of the pilot. */
    get serviceLevel(): number | undefined;
    /** Returns the efficiency indicator of the pilot. */
    get efficiency(): number | undefined;
    /** Returns the number of waiting calls for the pilot. */
    get nbOfWaitingCalls(): number | undefined;
    /** Returns the number of ringing ACD calls for the pilot. */
    get nbOfRingingACDCalls(): number | undefined;
    /** Returns the number of calls rerouted for mutual aid. */
    get nbOfMutualAidCalls(): number | undefined;
    /** Returns the number of dissuaded calls for the pilot. */
    get nbOfDissuadedCalls(): number | undefined;
    /** Returns the number of calls currently in conversation. */
    get nbOfCallsInConversation(): number | undefined;
    /** Returns the number of calls in general forwarding. */
    get nbOfCallsInGeneralForwarding(): number | undefined;
    /** Returns the number of calls in a remote processing group. */
    get nbOfCallsInRemotePG(): number | undefined;
    /** Returns the number of incoming calls within the last minute. */
    get incomingTraffic(): number | undefined;
    /** Returns the average waiting time before answering. */
    get averageWaitingTime(): number | undefined;
    /** Returns the worst service level among the pilots in a super pilot group. */
    get worstServiceLevelInList(): number | undefined;
    /** Returns the worst efficiency among the pilots in a super pilot group. */
    get worstEfficiencyInList(): number | undefined;
    /** Returns the best service level among the pilots in a super pilot group. */
    get bestServiceLevelInList(): number | undefined;
    /** Returns the best efficiency among the pilots in a super pilot group. */
    get bestEfficiencyInList(): number | undefined;
    /** Returns the CCD key of this pilot object. */
    get afeKey(): number | undefined;
}
/**
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export declare class OnQueueRtiChanged {
    #private;
    /** Returns the name of the queue. */
    get name(): string;
    /** Returns the directory number of the queue. */
    get number(): string;
    /** Returns the type of the queue. */
    get type(): QueueType;
    /** Returns the current service state of the queue. */
    get state(): ServiceState;
    /** Returns the number of agents in the distribution of the waiting queue. */
    get nbOfAgentsInDistribution(): number | undefined;
    /** Returns the number of incoming calls within the last minute. */
    get incomingTraffic(): number | undefined;
    /** Returns the number of outgoing calls within the last minute. */
    get outgoingTraffic(): number | undefined;
    /** Returns the number of waiting calls in the queue. */
    get nbOfWaitingCalls(): number | undefined;
    /** Returns the current waiting time in the queue (seconds). */
    get currentWaitingTime(): number | undefined;
    /** Returns the filling rate of the queue (percentage). */
    get fillingRate(): number | undefined;
    /** Returns the expected waiting time in the queue (seconds). */
    get expectedWaitingTime(): number | undefined;
    /** Returns the longest waiting time among queues in a super waiting queue (seconds). */
    get longestWaitingTimeInList(): number | undefined;
    /** Returns the CCD key of this queue object. */
    get afeKey(): number | undefined;
}
/**
 * Event delivered by `CallCenterRealtimeEventListener.onPGAgentRtiChanged`
 * whenever the attributes of one or more CCD agent processing groups change.
 *
 * This event contains only the attributes that have changed since the previous notification.
 * It is sent periodically according to the `Context` configuration in
 * `CallCenterRealtimeService`.
 *
 * Typical usage:
 * ```ts
 * override onPGAgentRtiChanged(e: OnAgentProcessingGroupRtiChanged): void {
 *   const nbWithdrawnAgents = e.nbOfWithdrawnAgents;
 *   // ...
 * }
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @see CallCenterRealtimeEventListener.onPGAgentRtiChanged
 * @since 2.7.4
 */
export declare class OnAgentProcessingGroupRtiChanged {
    #private;
    /** Returns the name of the agent processing group. */
    get name(): string;
    /** Returns the number identifying the agent processing group. */
    get number(): string;
    /** Returns the type of the agent processing group. */
    get type(): AgentProcessingGroupType;
    /** Returns the current service state of the agent processing group. */
    get state(): ServiceState;
    /** Returns the number of withdrawn agents. */
    get nbOfWithdrawnAgents(): number | undefined;
    /** Returns the number of agents currently in private call. */
    get nbOfAgentsInPrivateCall(): number | undefined;
    /** Returns the number of agents currently in ACD call. */
    get nbOfAgentsInACDCall(): number | undefined;
    /** Returns the number of agents currently in ACD ringing. */
    get nbOfAgentsInACDRinging(): number | undefined;
    /** Returns the number of agents currently in ACD conversation. */
    get nbOfAgentsInACDConv(): number | undefined;
    /** Returns the number of agents in wrap-up or transaction state. */
    get nbOfAgentsInWrapupAndTransaction(): number | undefined;
    /** Returns the number of agents currently in pause. */
    get nbOfAgentsInPause(): number | undefined;
    /** Returns the number of busy agents (ACD or in private call). */
    get nbOfBusyAgents(): number | undefined;
    /** Returns the number of agents logged on (total). */
    get nbOfLoggedOnAgents(): number | undefined;
    /** Returns the number of free agents (withdrawn or not). */
    get nbOfFreeAgents(): number | undefined;
    /** Returns the number of idle agents, excluding withdrawn agents. */
    get nbOfIdleAgents(): number | undefined;
    /** Returns the number of agents logged on who are not withdrawn or free. */
    get nbOfLoggedOnAndNotWithdrawnAgents(): number | undefined;
    /** Returns the number of incoming calls during the last minute. */
    get incomingTraffic(): number | undefined;
    /** Returns the service level on all pilots possibly serving this processing group. */
    get consolidatedPilotsServiceLevel(): number | undefined;
    /** Returns the efficiency on all pilots possibly serving this processing group. */
    get consolidatedPilotsEfficiency(): number | undefined;
    /** Returns the current waiting time on queues possibly serving this processing group. */
    get consolidatedQueuesWaitingTime(): number | undefined;
    /** Returns the number of waiting calls in queues possibly serving this processing group. */
    get consolidatedQueuesNbOfWaitingCalls(): number | undefined;
    /** Returns the expected waiting time on queues possibly serving this processing group. */
    get consolidatedQueuesEWT(): number | undefined;
    /** Returns the worst service level on all pilots possibly serving this processing group. */
    get pilotsWorstServiceLevel(): number | undefined;
    /** Returns the worst efficiency on all pilots possibly serving this processing group. */
    get pilotsWorstEfficiency(): number | undefined;
    /** Returns the best service level on all pilots possibly serving this processing group. */
    get pilotsBestServiceLevel(): number | undefined;
    /** Returns the best efficiency on all pilots possibly serving this processing group. */
    get pilotsBestEfficiency(): number | undefined;
    /** Returns the longest current waiting time in queues possibly serving this processing group. */
    get queuesLongestWaitingTime(): number | undefined;
    /** Returns the object CCD key. */
    get afeKey(): number | undefined;
}
/**
 * Event delivered whenever the attributes of one or more CCD "other" processing groups change.
 *
 * This event contains only the attributes that have changed since the previous notification.
 * It is sent periodically according to the Context configuration in CallCenterRealtimeService.
 *
 * Typical usage:
 * ```ts
 * const event = OnOtherProcessingGroupRtiChanged.fromJson(json);
 * const nbACDCalls = event.nbOfACDCalls;
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export declare class OnOtherProcessingGroupRtiChanged {
    #private;
    /** Returns the name of the processing group */
    get name(): string;
    /** Returns the directory number of the processing group */
    get number(): string;
    /** Returns the type of the processing group */
    get type(): OtherProcessingGroupType;
    /** Returns the current service state of the processing group */
    get state(): ServiceState;
    /** Returns the number of ACD calls in the processing group */
    get nbOfACDCalls(): number | undefined;
    /** Returns the number of incoming calls during the last minute */
    get incomingTraffic(): number | undefined;
    /** Returns the CCD key of this processing group */
    get afeKey(): number | undefined;
}
//# sourceMappingURL=cc-rt-events.d.ts.map
/**
 * `OtherProcessingGroupAttributes` represents the possible real-time attributes
 * for a CCD processing group other than agent (forward, guide, ...).
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export declare enum RtiOtherProcessingGroupAttributes {
    /** The service state of the processing group (e.g., Open, Blocked). */
    State = "State",
    /** The total number of ACD calls handled by the processing group. */
    NbOfACDCalls = "NbOfACDCalls",
    /** The number of incoming calls received by the processing group during the last minute. */
    IncomingTraffic = "IncomingTraffic",
    /** Represents all attributes. */
    ALL = "ALL"
}
//# sourceMappingURL=other-pg-attributes.d.ts.map
/**
 * {@code OtherProcessingGroupType} represents the different types of processing groups
 * (other than agent groups).
 *
 * These types indicate the role or function of the processing group in the call center system.
 *
 * @see OnOtherProcessingGroupRtiChangedEvent
 * @since 2.7.4
 */
export declare enum OtherProcessingGroupType {
    /** Mutual aid processing group. */
    MUTUAL_AID = "mutualAid",
    /** Forward processing group. */
    FORWARD = "forward",
    /** Guide processing group. */
    GUIDE = "guide",
    /** Remote processing group. */
    REMOTE = "remote",
    /** Unknown or undefined type. */
    UNKNOWN = "unknown"
}
//# sourceMappingURL=other-pg-type.d.ts.map
/**
 * `PilotAttributes` represents the possible real-time attributes
 * for a CCD pilot.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export declare enum RtiPilotAttributes {
    /** The service state of the pilot (e.g., Open, Blocked). */
    State = "State",
    /** The service level of the pilot. */
    ServiceLevel = "ServiceLevel",
    /** The name of the current routing rule applied to the pilot. */
    CurrentRuleName = "CurrentRuleName",
    /** The number of calls currently waiting for the pilot. */
    NbOfWaitingCalls = "NbOfWaitingCalls",
    /** The number of calls rerouted for mutual aid. */
    NbOfMutualAidCalls = "NbOfMutualAidCalls",
    /** The number of calls currently in conversation. */
    NbOfCallsInConversation = "NbOfCallsInConversation",
    /** The number of calls being processed in a remote processing group. */
    NbOfCallsInRemotePG = "NbOfCallsInRemotePG",
    /** The average waiting time (in seconds) before answering calls. */
    AverageWaitingTime = "AverageWaitingTime",
    /** The number of calls currently in progress. */
    NbOfRunningCalls = "NbOfRunningCalls",
    /** The number of ACD calls currently ringing for the pilot. */
    NbOfRingingACDCalls = "NbOfRingingACDCalls",
    /** The number of calls that were dissuaded. */
    NbOfDissuadedCalls = "NbOfDissuadedCalls",
    /** The number of calls in general forwarding for the pilot. */
    NbOfCallsInGeneralForwarding = "NbOfCallsInGeneralForwarding",
    /** The efficiency of the pilot (average, best, worst). */
    Efficiency = "Efficiency",
    /** The number of incoming calls received by the pilot within the last minute. */
    IncomingTraffic = "IncomingTraffic",
    /** Represents all attributes. */
    ALL = "ALL"
}
//# sourceMappingURL=pilot-attributes.d.ts.map
/**
 * `QueueAttributes` represents the possible real-time attributes
 * for a CCD queue.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export declare enum RtiQueueAttributes {
    /** The service state of the queue (e.g., Open, Blocked). */
    State = "State",
    /** The number of agents currently involved in distributing calls in the waiting queue. */
    NbOfAgentsInDistribution = "NbOfAgentsInDistribution",
    /** The number of incoming calls to the queue within the last minute. */
    IncomingTraffic = "IncomingTraffic",
    /** The number of outgoing calls from the queue within the last minute. */
    OutgoingTraffic = "OutgoingTraffic",
    /** The number of calls currently waiting in the queue. */
    NbOfWaitingCalls = "NbOfWaitingCalls",
    /** The current waiting time of calls in the queue (in seconds). */
    CurrentWaitingTime = "CurrentWaitingTime",
    /** The expected waiting time for calls in the queue (in seconds). */
    ExpectedWaitingTime = "ExpectedWaitingTime",
    /** The filling rate of the queue. */
    FillingRate = "FillingRate",
    /** The longest waiting time among all queues in a super waiting queue. */
    LongestWaitingTimeInList = "LongestWaitingTimeInList",
    /** Represents all attributes. */
    ALL = "ALL"
}
//# sourceMappingURL=queue-attributes.d.ts.map
/**
 * Represents the possible types of a CCD queue.
 *
 * @see OnQueueRtiChangedEvent
 * @since 2.7.4
 */
export declare enum QueueType {
    /** Normal queue for standard call distribution. */
    NORMAL = "Normal",
    /** Mutual aid queue. */
    MUTUAL_AID = "MutualAid",
    /** Dissuasion queue, for rerouting or discouraging calls. */
    DISSUASION = "Dissuasion",
    /** Virtual queue, not a physical queue but a logical grouping. */
    VIRTUAL = "Virtual",
    /** Waiting room queue. */
    WAITING_ROOM = "WaitingRoom",
    /** Virtual waiting room queue. */
    VIRTUAL_WAITING_ROOM = "VirtualWaitingRoom",
    /** Unknown type of queue. */
    UNKNOWN = "unknown"
}
//# sourceMappingURL=queue-type.d.ts.map
import { RtiFilter } from './rti-filter';
/**
 * The `RtiContext` class represents a subscription to CCD real-time events
 * provided by the `RtiService`.
 *
 * A context defines the set of CCD objects to monitor, the attributes of
 * interest, the observation period, and the notification frequency for events.
 * It is associated with a {@link RtiFilter} that specifies which agents, pilots,
 * queues, and processing groups are included in the real-time notifications.
 */
export declare class RtiContext {
    #private;
    /**
     * Constructs a new `RtiContext` with the specified observation period,
     * notification frequency, and filter.
     *
     * @param obsPeriod - The observation period in minutes. Must be between 15 and 60 minutes.
     * @param notifFrequency - The frequency of real-time notifications in seconds. Minimum value is 5 seconds.
     * @param filter - The {@link RtiFilter} defining which CCD objects and attributes are included in this context.
     */
    constructor(obsPeriod?: number, notifFrequency?: number, filter?: RtiFilter);
    /**
     * Returns whether this RTI context is currently active.
     *
     * @returns `true` if the context is active; `false` otherwise.
     */
    get active(): boolean;
    /**
     * Returns the observation period for this context.
     *
     * This defines the duration (in minutes) during which the context is active
     * and collects real-time events.
     *
     * @returns The observation period in minutes.
     */
    get observationPeriod(): number;
    /**
     * Returns the notification frequency for this context.
     *
     * This defines how often (in seconds) real-time notifications are sent
     * for changes in the monitored CCD objects.
     *
     * @returns The notification frequency in seconds.
     */
    get notificationFrequency(): number;
    /**
     * Returns the {@link RtiFilter} associated with this context.
     *
     * The filter specifies which CCD objects and their attributes will be included
     * in real-time event notifications.
     *
     * @returns The filter.
     */
    get filter(): RtiFilter | null;
}
//# sourceMappingURL=rti-context.d.ts.map
import { RtiAgentAttributes } from './agent-attributes';
import { RtiAgentProcessingGroupAttributes } from './agent-pg-attributes';
import { RtiOtherProcessingGroupAttributes } from './other-pg-attributes';
import { RtiPilotAttributes } from './pilot-attributes';
import { RtiQueueAttributes } from './queue-attributes';
/**
 * The `Filter` class specifies which CCD objects and their attributes
 * should be included in real-time eventing.
 *
 * For each category of CCD objects (agents, pilots, queues, agent processing groups,
 * other processing groups), this class maintains a filter that defines:
 *
 * - The specific objects to monitor (directory numbers)
 * - The attributes of each object to include in the real-time notifications
 *
 * Typical usage:
 * ```ts
 * const filter = new RtiFilter();
 *
 * // Monitor specific agents with selected attributes
 * filter.setAgentNumbers(["60119", "60120"]);
 * filter.setAgentAttributes(RtiAgentAttributes.PrivateCallsTotalDuration, RtiAgentAttributes.LogonDate);
 *
 * // Monitor queues with selected attributes
 * filter.setQueueNumbers(["1001", "1002"]);
 * filter.setQueueAttributes(RtiQueueAttributes.WaitingCalls, RtiQueueAttributes.AverageWaitTime);
 *
 * // Use the filter to create a real-time context
 * const context = new RtiContext(30, 5, filter);
 * const rtiService = session.getCallCenterRealtimeService();
 * rtiService.setContext(context);
 * rtiService.start();
 * ```
 *
 * @see CallCenterRealtimeService
 * @see RtiObjects
 * @since 2.7.4
 */
export declare class RtiFilter {
    #private;
    /**
     * Sets the attributes of agents to include in real-time eventing.
     * Only the specified attributes of the selected agents will be included
     * in the real-time notifications.
     *
     * @param attributes The agent attributes to monitor
     */
    setAgentAttributes(...attributes: RtiAgentAttributes[]): void;
    /**
     * Sets the directory numbers of agents to include in real-time eventing.
     * Only events related to these agents will be sent.
     *
     * @param numbers The agent directory numbers to monitor
     */
    setAgentNumbers(numbers: string[]): void;
    /**
     * Sets the attributes of pilots to include in real-time eventing.
     * Only the specified attributes of the selected pilots will be included
     * in the real-time notifications.
     *
     * @param attributes The pilot attributes to monitor
     */
    setPilotAttributes(...attributes: RtiPilotAttributes[]): void;
    /**
     * Sets the directory numbers of pilots to include in real-time eventing.
     * Only events related to these pilots will be sent.
     *
     * @param numbers The pilot directory numbers to monitor
     */
    setPilotNumbers(numbers: string[]): void;
    /**
     * Sets the attributes of queues to include in real-time eventing.
     * Only the specified attributes of the selected queues will be included
     * in the real-time notifications.
     *
     * @param attributes The queue attributes to monitor
     */
    setQueueAttributes(...attributes: RtiQueueAttributes[]): void;
    /**
     * Sets the directory numbers of queues to include in real-time eventing.
     * Only events related to these queues will be sent.
     *
     * @param numbers The queue directory numbers to monitor
     */
    setQueueNumbers(numbers: string[]): void;
    /**
     * Sets the attributes of agent processing groups to include in real-time eventing.
     * Only the specified attributes of the selected processing groups will be included
     * in the real-time notifications.
     *
     * @param attributes The agent processing group attributes to monitor
     */
    setAgentProcessingGroupAttributes(...attributes: RtiAgentProcessingGroupAttributes[]): void;
    /**
     * Sets the directory numbers of agent processing groups to include in real-time eventing.
     * Only events related to these processing groups will be sent.
     *
     * @param numbers The agent processing group directory numbers to monitor
     */
    setAgentProcessingGroupNumbers(numbers: string[]): void;
    /**
     * Sets the attributes of other processing groups to include in real-time eventing.
     * Only the specified attributes of the selected processing groups will be included
     * in the real-time notifications.
     *
     * @param attributes The other processing group attributes to monitor
     */
    setOtherProcessingGroupAttributes(...attributes: RtiOtherProcessingGroupAttributes[]): void;
    /**
     * Sets the directory numbers of other processing groups to include in real-time eventing.
     * Only events related to these processing groups will be sent.
     *
     * @param numbers The other processing group directory numbers to monitor
     */
    setOtherProcessingGroupNumbers(numbers: string[]): void;
}
//# sourceMappingURL=rti-filter.d.ts.map
/**
 * Represents a CCD object identifier for which real-time information is available.
 *
 * Instances of this class provide details about a CCD object, such as agents, pilots,
 * or queues, that can be monitored using the {@link RtiService}.
 *
 * Each object includes a directory number, last name, first name, and a unique key.
 * This class is typically used to retrieve and reference objects for real-time events.
 *
 * @see RtiService
 * @since 2.7.4
 */
export declare class RtiObjectIdentifier {
    #private;
    /**
     * Returns the directory number associated with this identifier.
     *
     * @returns The directory number of the object.
     */
    get number(): string;
    /**
     * Returns the last name associated with this identifier.
     *
     * @returns The last name of the object.
     */
    get name(): string;
    /**
     * Returns the first name associated with this identifier.
     *
     * @returns The first name of the object.
     */
    get firstName(): string | null;
}
//# sourceMappingURL=rti-object-identifier.d.ts.map
import { RtiFilter } from './rti-filter';
import { RtiObjectIdentifier } from './rti-object-identifier';
/**
 * Represents a collection of CCD objects for which real-time information is available.
 *
 * This class groups CCD objects by type, including agents, pilots, queues, and processing groups
 * (both agent and other). Each object is represented by an {@link RtiObjectIdentifier}.
 *
 * Instances of this class are typically returned by the {@link RtiService}
 * to provide the list of available CCD objects for which real-time data can be retrieved.
 *
 * A {@link RtiFilter} can be created from an `RtiObjects` instance using
 * {@link #createFilter} to subscribe only to the selected objects in real-time event monitoring.
 *
 * @see RtiObjectIdentifier
 * @see RtiService
 * @see RtiFilter
 * @since 2.7.4
 */
export declare class RtiObjects {
    #private;
    /**
     * Returns the list of CCD agents.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agents.
     */
    get agents(): RtiObjectIdentifier[] | null;
    /**
     * Returns the list of CCD pilots.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing pilots.
     */
    get pilots(): RtiObjectIdentifier[] | null;
    /**
     * Returns the list of CCD queues.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing queues.
     */
    get queues(): RtiObjectIdentifier[] | null;
    /**
     * Returns the list of agent processing groups.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agent processing groups.
     */
    get agentProcessingGroups(): RtiObjectIdentifier[] | null;
    /**
     * Returns the list of other (non-agent) processing groups.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing other processing groups.
     */
    get otherProcessingGroups(): RtiObjectIdentifier[] | null;
    /**
     * Creates a {@link RtiFilter} initialized with all CCD objects in this instance.
     *
     * The resulting filter can be used to create a real-time context for event monitoring
     * with {@link RtiService}. It includes all agents, pilots, queues, and processing groups
     * present in this `RtiObjects` instance.
     *
     * @returns A {@link RtiFilter} containing all objects from this `RtiObjects` instance.
     *
     * @example
     * ```ts
     * const rtiObjects = rtiService.getRtiObjects();
     * const filter = rtiObjects.createFilter();
     * const context = new RtiContext(30, 5, filter);
     * rtiService.setContext(context);
     * rtiService.start();
     * ```
     */
    createFilter(): RtiFilter;
}
//# sourceMappingURL=rti-objects.d.ts.map
/**
 * `AgentByPilotAttributes` defines the set of statistical attributes available
 * for a CCD agent with respect to a specific CCD pilot.
 *
 * These attributes are used in reports generated by `CallCenterStatisticsService`
 * to provide insight into agent performance and activity per pilot.
 *
 * Attributes are grouped into:
 * - **Counts** - number of calls received, served, transferred, etc.
 * - **Durations** - total and average times.
 *
 * **Note:** The `ALL` attribute is intended for testing only and should
 * not be used in production contexts.
 *
 * @since 2.7.4
 */
export declare enum StatsAgentByPilotAttributes {
    /** Number of calls received for this pilot. */
    nbCallsReceived = "nbCallsReceived",
    /** Number of calls received by transfer. */
    nbCallsTransfIn = "nbCallsTransfIn",
    /** Number of calls served. */
    nbCallsServed = "nbCallsServed",
    /** Number of calls served too quickly. */
    nbCallsServedTooQuickly = "nbCallsServedTooQuickly",
    /** Number of calls with enquiry. */
    nbCallsWithEnquiry = "nbCallsWithEnquiry",
    /** Number of calls where help was requested. */
    nbCallsWithHelp = "nbCallsWithHelp",
    /** Number of calls transferred from the agent. */
    nbCallsTransf = "nbCallsTransf",
    /** Number of calls transferred to the agent. */
    nbCallsTransfToAgent = "nbCallsTransfToAgent",
    /** Number of calls in wrap-up. */
    nbCallsInWrapup = "nbCallsInWrapup",
    /** Maximum duration of call processing (hh:mm:ss). */
    maxCallProcDur = "maxCallProcDur",
    /** Maximum duration of conversation (hh:mm:ss). */
    maxConvDur = "maxConvDur",
    /** Maximum duration of wrap-up (hh:mm:ss). */
    maxWrapupDur = "maxWrapupDur",
    /** Total duration of call processing (hh:mm:ss). */
    callProcTDur = "callProcTDur",
    /** Average duration of call processing (hh:mm:ss). */
    callProcADur = "callProcADur",
    /** Total duration of conversation (hh:mm:ss). */
    convTDur = "convTDur",
    /** Average duration of conversation (hh:mm:ss). */
    convADur = "convADur",
    /** Total duration of wrap-up (hh:mm:ss). */
    wrapupTDur = "wrapupTDur",
    /** Average duration of wrap-up (hh:mm:ss). */
    wrapupADur = "wrapupADur",
    /** Total duration of conversation occurring during wrap-up (hh:mm:ss). */
    convInWrapupTDur = "convInWrapupTDur",
    /** Total busy time during wrap-up (hh:mm:ss). */
    busyTimeInWrapupTDur = "busyTimeInWrapupTDur",
    /** Total duration of calls on hold (hh:mm:ss). */
    onHoldTDur = "onHoldTDur",
    /** Average duration of calls on hold (hh:mm:ss). */
    onHoldADur = "onHoldADur",
    /** Total duration of transaction phase (hh:mm:ss). */
    transTDur = "transTDur",
    /** Average duration of transaction phase (hh:mm:ss). */
    transADur = "transADur",
    /** Total duration of pause (hh:mm:ss). */
    pauseTDur = "pauseTDur",
    /** Average duration of pause (hh:mm:ss). */
    pauseADur = "pauseADur",
    /** All attributes (for testing purposes only; not for production use). */
    ALL = "ALL"
}
//# sourceMappingURL=agbypilot-attributes.d.ts.map
/**
 * `AgentAttributes` defines the set of statistical attributes available
 * for a CCD agent.
 *
 * These attributes are used in reports generated by
 * `CallCenterStatisticsService` to provide insight into agent activity,
 * performance, and call handling.
 *
 * Attributes are grouped into:
 * - **Counts** - number of calls, pickups, refusals, etc.
 * - **Durations** - total and average times, expressed in `hh:mm:ss`.
 * - **Percentages** - proportion of time spent in various agent states.
 *
 * **Note:** The `ALL` attribute is intended for testing only and
 * should not be used in production contexts.
 *
 * @since 2.7.4
 */
export declare enum StatsAgentAttributes {
    /** Number of rotating timeouts experienced by the agent. */
    nbRotating = "nbRotating",
    /** Number of calls successfully answered by the agent. */
    nbPickedUp = "nbPickedUp",
    /** Number of call pickup actions initiated by the agent. */
    nbPickup = "nbPickup",
    /** Number of internal outgoing calls not associated with ACD. */
    nbLocalOutNonAcd = "nbLocalOutNonAcd",
    /** Number of external outgoing calls not associated with ACD. */
    nbExtOutNonAcd = "nbExtOutNonacd",
    /** Number of ACD calls that were presented (rang) to the agent. */
    nbRingAcd = "nbRingAcd",
    /** Number of calls during which the agent initiated a help request. */
    nbHelp = "nbHelp",
    /** Number of internal incoming calls not associated with ACD. */
    nbLocInNonAcd = "nbLocInNonacd",
    /** Number of non-ACD external incoming calls received directly. */
    nbExtInNonAcdDirect = "nbExtInNonacdDirect",
    /** Number of non-ACD external incoming calls transferred to the agent. */
    nbExtInNonAcdTransferred = "nbExtInNonacdTransferred",
    /** Number of ACD calls handled (served) without an associated transaction code. */
    nbServedWOCode = "nbServedWOCode",
    /** Number of ACD calls handled (served) with an associated transaction code. */
    nbServedWCode = "nbServedWCode",
    /** Number of ACD calls served too quickly. */
    nbAcdQuickServed = "nbAcdQuickServed",
    /** Number of non-ACD external incoming calls successfully served. */
    nbExtInNonAcdServed = "nbExtinNonacdServed",
    /** Number of non-ACD external incoming calls served too quickly. */
    nbExtInNonAcdQuickServed = "nbExtinNonacdQuickServed",
    /** Number of outgoing ACD calls initiated by the agent. */
    nbOutAcd = "nbOutAcd",
    /** Number of outgoing ACD calls that were answered by the destination party. */
    nbOutAcdAnswered = "nbOutAcdAnswered",
    /** Number of calls currently or cumulatively in the wrap-up state. */
    nbOnWrapup = "nbOnWrapup",
    /** Total ringing duration for ACD calls that were served. */
    ringAcdServedTDur = "ringAcdServedTDur",
    /** Average ringing duration for ACD calls that were served. */
    ringAcdServedADur = "ringAcdServedADur",
    /** Total ringing duration for non-ACD external incoming calls that were served. */
    ringInNonAcdExtServedTDur = "ringInNonAcdExtServedTDur",
    /** Average ringing duration for non-ACD external incoming calls that were served. */
    ringInNonAcdExtServedADur = "ringInNonAcdExtServedADur",
    /** Total ringing duration for ACD calls. */
    ringAcdTDur = "ringAcdTDur",
    /** Average ringing duration for ACD calls. */
    ringAcdADur = "ringAcdADur",
    /** Total ringing duration for non-ACD external incoming calls. */
    ringInNonAcdExtTDur = "ringInNonAcdExtTDur",
    /** Average ringing duration for non-ACD external incoming calls. */
    ringInNonAcdExtADur = "ringInNonAcdExtADur",
    /** Total ringing duration for all calls. */
    ringTDur = "ringTDur",
    /** Average ringing duration for all calls. */
    ringADur = "ringADur",
    /** Total conversation duration for ACD calls. */
    convAcdTDur = "convAcdTDur",
    /** Average conversation duration for ACD calls. */
    convAcdADur = "convAcdADur",
    /** Total wrap-up duration for all calls served. */
    wrapupAcdTDur = "wrapupAcdTDur",
    /** Total conversation duration for internal outgoing non-ACD calls. */
    convLocOutNonAcdTDur = "convLocOutNonacdTDur",
    /** Average conversation duration for internal outgoing non-ACD calls. */
    convLocOutNonAcdADur = "convLocOutNonacdADur",
    /**
     * Total conversation duration for external outgoing calls.
     */
    convExtOutTDur = "convExtOutTDur",
    /**
     * Average conversation duration for external outgoing calls.
     */
    convExtOutADur = "convExtOutADur",
    /**
     * Total conversation duration for non-ACD internal incoming calls.
     */
    convLocInNonAcdTDur = "convLocInNonacdTDur",
    /**
     * Average conversation duration for non-ACD internal incoming calls.
     */
    convLocInNonAcdADur = "convLocInNonacdADur",
    /**
     * Total conversation duration for non-ACD external incoming calls.
     */
    convExtInNonAcdTDur = "convExtInNonacdTDur",
    /**
     * Average conversation duration for non-ACD external incoming calls.
     */
    convExtInNonAcdADur = "convExtInNonacdADur",
    /**
     * Total call processing duration for outgoing ACD calls.
     */
    outAcdCommTDur = "outAcdCommTDur",
    /**
     * Average call processing duration for outgoing ACD calls.
     */
    outAcdCommADur = "outAcdCommADur",
    /**
     * Total conversation duration for outgoing ACD calls.
     */
    outAcdConvTDur = "outAcdConvTDur",
    /**
     * Average conversation duration for outgoing ACD calls.
     */
    outAcdConvADur = "outAcdConvADur",
    /**
     * Total transaction phase duration for outgoing ACD calls.
     */
    outAcdTransactTDur = "outAcdTransactTDur",
    /**
     * Average transaction phase duration for outgoing ACD calls.
     */
    outAcdTransactADur = "outAcdTransactADur",
    /**
     * Total wrap-up duration for outgoing ACD calls.
     */
    outAcdWrapupTDur = "outAcdWrapupTDur",
    /**
     * Average wrap-up duration for outgoing ACD calls.
     */
    outAcdWrapupADur = "outAcdWrapupADur",
    /**
     * Total pause duration for outgoing ACD calls.
     */
    outAcdPauseTDur = "outAcdPauseTDur",
    /**
     * Average pause duration for outgoing ACD calls.
     */
    outAcdPauseADur = "outAcdPauseADur",
    /**
     * Total wrap-up duration while the agent was idle.
     */
    wrapUpIdleTDur = "wrapUpIdleTDur",
    /**
     * Total conversation duration during wrap-up.
     */
    callOnWrapupTDur = "callOnWrapupTDur",
    /**
     * Total busy time during wrap-up.
     */
    busyOnWrapupTDur = "busyOnWrapupTDur",
    /**
     * Total busy time for the agent.
     */
    busyTDur = "busyTDur",
    /**
     * Percentage of total time the agent was logged out.
     */
    loggedOutPerTime = "loggedOutPerTime",
    /**
     * Percentage of time the agent was logged in but not assigned to a call.
     */
    notAssignedPerTime = "notAssignedPerTime",
    /**
     * Percentage of time the agent was logged in and assigned to a call.
     */
    assignedPerTime = "assignedPerTime",
    /**
     * Percentage of time the agent was in withdrawal (unavailable for calls).
     */
    withdrawPerTime = "withdrawPerTime",
    /**
     * Percentage of time the agent was in withdrawal due to cause 1.
     */
    withdrawPerTimeCause1 = "withdrawPerTimeCause1",
    /**
     * Percentage of time the agent was in withdrawal due to cause 2.
     */
    withdrawPerTimeCause2 = "withdrawPerTimeCause2",
    /**
     * Percentage of time the agent was in withdrawal due to cause 3.
     */
    withdrawPerTimeCause3 = "withdrawPerTimeCause3",
    /**
     * Percentage of time the agent was in withdrawal due to cause 4.
     */
    withdrawPerTimeCause4 = "withdrawPerTimeCause4",
    /**
     * Percentage of time the agent was in withdrawal due to cause 5.
     */
    withdrawPerTimeCause5 = "withdrawPerTimeCause5",
    /**
     * Percentage of time the agent was in withdrawal due to cause 6.
     */
    withdrawPerTimeCause6 = "withdrawPerTimeCause6",
    /**
     * Percentage of time the agent was in withdrawal due to cause 7.
     */
    withdrawPerTimeCause7 = "withdrawPerTimeCause7",
    /**
     * Percentage of time the agent was in withdrawal due to cause 8.
     */
    withdrawPerTimeCause8 = "withdrawPerTimeCause8",
    /**
     * Percentage of time the agent was in withdrawal due to cause 9.
     */
    withdrawPerTimeCause9 = "withdrawPerTimeCause9",
    /**
     * Number of pilots the agent served calls for.
     */
    nbPilots = "nbPilots",
    /**
     * Number of ACD calls served by the agent.
     */
    nbAcdServedCalls = "nbAcdServedCalls",
    /**
     * Number of incoming ACD calls served by the agent.
     */
    nbAcdInServedCalls = "nbAcdInServedCalls",
    /**
     * Number of incoming calls received directly by the pilot and served.
     */
    nbInCallsReceivedByPilot = "nbInCallsReceivedByPilot",
    /**
     * Number of outgoing ACD calls served by the agent.
     */
    nbAcdOutServedCalls = "nbAcdOutServedCalls",
    /**
     * Total number of ACD calls not served by the agent.
     */
    nbTotNonServedCalls = "nbTotNonServedCalls",
    /**
     * Number of incoming ACD calls not served by the agent.
     */
    nbInNonServedCalls = "nbInNonServedCalls",
    /**
     * Number of incoming ACD calls picked up but not served.
     */
    nbPickedUpCalls = "nbPickedupCalls",
    /**
     * Number of incoming ACD calls refused by the agent.
     */
    nbRefusedCalls = "nbRefusedCalls",
    /**
     * Number of outgoing ACD calls not served by the agent.
     */
    nbAcdOutNonServedCalls = "nbAcdOutNonServedCalls",
    /**
     * Total number of non-ACD calls received by the agent.
     */
    nbTotNonAcdReceivedCalls = "nbTotNonAcdreceivedCalls",
    /**
     * Number of incoming non-ACD calls received by the agent.
     */
    nbInNonAcdCalls = "nbInNonAcdCalls",
    /**
     * Number of outgoing non-ACD calls initiated by the agent.
     */
    nbOutNonAcdCalls = "nbOutNonAcdCalls",
    /**
     * Duration the agent was assigned to a group but not in withdrawal.
     */
    assignedNotWithdrawDur = "assignedNotWithdrawDur",
    /**
     * Total duration the agent was in withdrawal.
     */
    withdrawDur = "withdrawDur",
    /**
     * Duration the agent spent in manual wrap-up.
     */
    manuWrapupDur = "manuWrapupDur",
    /**
     * Duration the agent was in an unreachable state.
     */
    unreachableDur = "unreachableDur",
    /**
     * Total duration spent in non-ACD work.
     */
    nonAcdWorkTDur = "nonAcdWorkTDur",
    /**
     * Average duration spent in non-ACD work.
     */
    nonAcdWorkADur = "nonAcdWorkADur",
    /**
     * Total duration spent in ACD work.
     */
    acdWorkTDur = "acdWorkTDur",
    /**
     * Average duration spent in ACD work.
     */
    acdWorkADur = "acdWorkADur",
    /**
     * Total duration spent in incoming ACD work.
     */
    acdWorkInTDur = "acdWorkInTDur",
    /**
     * Average duration spent in incoming ACD work.
     */
    acdWorkInADur = "acdWorkInADur",
    /**
     * Total conversation duration in incoming ACD work.
     */
    acdWorkInConvTDur = "acdWorkInConvTDur",
    /**
     * Average conversation duration in incoming ACD work.
     */
    acdWorkInConvADur = "acdWorkInConvADur",
    /**
     * Total ringing duration in incoming ACD work.
     */
    acdWorkInRingTDur = "acdWorkInRingTDur",
    /**
     * Average ringing duration in incoming ACD work.
     */
    acdWorkInRingADur = "acdWorkInRingADur",
    /**
     * Total wrap-up duration in incoming ACD work.
     */
    acdWorkInWrapupTDur = "acdWorkInWrapupTDur",
    /**
     * Average wrap-up duration in incoming ACD work.
     */
    acdWorkInWrapupADur = "acdWorkInWrapupADur",
    /**
     * Total duration spent in outgoing ACD work.
     */
    acdWorkOutTDur = "acdWorkOutTDur",
    /**
     * Average duration spent in outgoing ACD work.
     */
    acdWorkOutADur = "acdWorkOutADur",
    /**
     * Total conversation duration in outgoing ACD work.
     */
    acdWorkOutConvTDur = "acdWorkOutConvTDur",
    /**
     * Average conversation duration in outgoing ACD work.
     */
    acdWorkOutConvADur = "acdWorkOutConvADur",
    /**
     * Total wrap-up duration in outgoing ACD work.
     */
    acdWorkOutWrapupTDur = "acdWorkOutWrapupTDur",
    /**
     * Average wrap-up duration in outgoing ACD work.
     */
    acdWorkOutWrapupADur = "acdWorkOutWrapupADur",
    /**
     * Total conversation duration for incoming ACD calls.
     */
    acdInConvTDur = "acdInConvTDur",
    /**
     * Average conversation duration for incoming ACD calls.
     */
    acdInConvADur = "acdInConvADur",
    /**
     * Total conversation duration for outgoing ACD calls.
     */
    acdOutConvTDur = "acdOutConvTDur",
    /**
     * Average conversation duration for outgoing ACD calls.
     */
    acdOutConvADur = "acdOutConvADur",
    /** All attributes (test purposes only; not for production use). */
    ALL = "ALL"
}
//# sourceMappingURL=agent-attributes.d.ts.map
import { AbstractFilter } from '../../internal/types/cc-stat/abstract-filter';
import { StatsAgentByPilotAttributes } from './agbypilot-attributes';
import { StatsAgentAttributes } from './agent-attributes';
/**
 * Filter for selecting agents in Call Center StatisticsData reports.
 *
 * An `AgentFilter` allows specifying which statistics to collect for
 * agents and, optionally, statistics broken down by pilots.
 *
 * Instances should be obtained via the `Filter.createAgentFilter()` factory method.
 * SDK users do not need to implement this interface directly.
 *
 * @since 2.7.4
 */
export interface AgentFilter extends AbstractFilter {
    /**
     * Returns the set of directory numbers associated with this filter.
     *
     * These numbers identify the agents whose statistics should be collected.
     *
     * @returns a set of agent directory numbers; never null, but may be empty
     */
    get numbers(): string[];
    /**
     * Adds one or more agent directory numbers to this filter.
     *
     * Once added, the corresponding agents will be included in the scope of
     * statistical reports.
     *
     * @param numbers an array of directory numbers to add; must not be null, though it may be empty
     */
    addNumbers(...numbers: string[]): void;
    /**
     * Returns the set of statistics attributes to collect for agents.
     *
     * @returns a set of `AgentAttributes`
     */
    get agentAttributes(): Set<StatsAgentAttributes>;
    /**
     * Returns the set of statistics attributes to collect for agents by pilot.
     *
     * @returns a set of `AgentByPilotAttributes`
     */
    get byPilotAttributes(): Set<StatsAgentByPilotAttributes>;
    /**
     * Sets the statistics attributes for agents in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the agent attributes to include
     */
    setAgentAttributes(...attributes: StatsAgentAttributes[]): void;
    /**
     * Sets the statistics attributes for agents broken down by pilot in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the agent-by-pilot attributes to include
     */
    setAgentByPilotAttributes(...attributes: StatsAgentByPilotAttributes[]): void;
}
//# sourceMappingURL=agent-filter.d.ts.map
import { AgentByPilotStatisticsRowJson } from '../../../internal/types/cc-stat/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsAgentByPilotAttributes } from '../agbypilot-attributes';
export declare class AgentByPilotStatisticsRow {
    #private;
    [key: string]: any;
    private values;
    constructor(json: AgentByPilotStatisticsRowJson);
    private initializeFromJson;
    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsAgentByPilotAttributes): StatValue;
    /**
     * Returns the pilot's unique identifier or number.
     *
     * @return the pilot's number
     */
    get pilotNumber(): string | null;
    /**
     * Returns the pilot's display name.
     *
     * @return the pilot's name
     */
    get pilotName(): string | null;
    /**
     * Returns the total number of calls received by this pilot.
     *
     * @return the number of received calls
     */
    get nbCallsReceived(): number | null;
    /**
     * Returns the number of calls received by transfer.
     *
     * @return the number of transferred-in calls
     */
    get nbCallsTransfIn(): number | null;
    /**
     * Returns the total number of calls served by the pilot.
     *
     * @return the number of served calls
     */
    get nbCallsServed(): number | null;
    /**
     * Returns the number of calls served too quickly.
     *
     * @return the number of calls served too quickly
     */
    get nbCallsServedTooQuickly(): number | null;
    /**
     * Returns the number of calls that included an enquiry.
     *
     * @return the number of calls with enquiry
     */
    get nbCallsWithEnquiry(): number | null;
    /**
     * Returns the number of calls where help was requested.
     *
     * @return the number of calls with help requested
     */
    get nbCallsWithHelp(): number | null;
    /**
     * Returns the number of calls transferred from this pilot to others.
     *
     * @return the number of calls transferred from the agent
     */
    get nbCallsTransf(): number | null;
    /**
     * Returns the number of calls transferred to this pilot.
     *
     * @return the number of calls transferred to the agent
     */
    get nbCallsTransfToAgent(): number | null;
    /**
     * Returns the number of calls currently in wrap-up state.
     *
     * @return the number of calls in wrap-up
     */
    get nbCallsInWrapup(): number | null;
    /**
     * Returns the maximum call processing duration.
     *
     * @return the maximum duration of call processing
     */
    get maxCallProcDur(): string | null;
    /**
     * Returns the maximum conversation duration.
     *
     * @return the maximum duration of conversation
     */
    get maxConvDur(): string | null;
    /**
     * Returns the maximum wrap-up duration.
     *
     * @return the maximum duration of wrap-up
     */
    get maxWrapupDur(): string | null;
    /**
     * Returns the total call processing duration.
     *
     * @return total duration of call processing
     */
    get callProcTDur(): string | null;
    /**
     * Returns the average call processing duration.
     *
     * @return average duration of call processing
     */
    get callProcADur(): string | null;
    /**
     * Returns the total conversation duration.
     *
     * @return total duration of conversation
     */
    get convTDur(): string | null;
    /**
     * Returns the average conversation duration.
     *
     * @return average duration of conversation
     */
    get convADur(): string | null;
    /**
     * Returns the total wrap-up duration.
     *
     * @return total duration of wrap-up
     */
    get wrapupTDur(): string | null;
    /**
     * Returns the average wrap-up duration.
     *
     * @return average duration of wrap-up
     */
    get wrapupADur(): string | null;
    /**
     * Returns the total conversation duration during wrap-up.
     *
     * @return total duration of conversation in wrap-up
     */
    get convInWrapupTDur(): string | null;
    /**
     * Returns the total busy time during wrap-up.
     *
     * @return total busy duration in wrap-up
     */
    get busyTimeInWrapupTDur(): string | null;
    /**
     * Returns the total duration of calls on hold.
     *
     * @return total duration of hold calls
     */
    get onHoldTDur(): string | null;
    /**
     * Returns the average duration of calls on hold.
     *
     * @return average duration of hold calls
     */
    get onHoldADur(): string | null;
    /**
     * Returns the total duration of the transaction phase.
     *
     * @return total duration of transactions
     */
    get transTDur(): string | null;
    /**
     * Returns the average duration of the transaction phase.
     *
     * @return average duration of transactions
     */
    get transADur(): string | null;
    /**
     * Returns the total duration of pause.
     *
     * @return total duration of pause
     */
    get pauseTDur(): string | null;
    /**
     * Returns the average duration of pause.
     *
     * @return average duration of pause
     */
    get pauseADur(): string | null;
}
//# sourceMappingURL=ag-by-pil-stats-row.d.ts.map
import { AgentStatisticsRowJson } from '../../../internal/types/cc-stat/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsAgentAttributes } from '../agent-attributes';
export declare class AgentStatisticsRow {
    #private;
    [key: string]: any;
    private values;
    constructor(json: AgentStatisticsRowJson);
    private initializeFromJson;
    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsAgentAttributes): StatValue;
    /**
     * Returns the timestamp associated with this statistics row.
     *
     * The returned value represents the date and time at which the statistics were
     * collected.
     *
     * @returns the timestamp as a string in hh:mm:ss format
     */
    get date(): Date | null;
    /**
     * Returns the login name of the agent associated with this statistics row.
     *
     * @returns the agent's login name
     */
    get login(): string | null;
    /**
     * Returns the operator of the agent.
     *
     * @returns the operator
     */
    get operator(): string | null;
    /**
     * Returns the first name of the agent.
     *
     * @returns the agent's first name
     */
    get firstName(): string | null;
    /**
     * Returns the last name of the agent.
     *
     * @returns the agent's last name
     */
    get lastName(): string | null;
    /**
     * Returns the directory number associated with the agent.
     *
     * @returns the agent's directory number
     */
    get number(): string | null;
    /**
     * Returns the directory number of the group the agent is logged in.
     *
     * @returns the agent's group directory number
     */
    get group(): string | null;
    /**
     * Returns the number of rotating time-outs that occurred for this agent.
     *
     * A rotating time-out typically indicates that an incoming call was offered to the
     * agent but not answered within the timeout period, and then rotated to another agent.
     *
     * @returns the count of rotating time-outs
     */
    get nbRotating(): number | null;
    /**
     * Returns the number of calls that were picked up by the agent.
     *
     * @returns the number of calls picked up by the agent
     */
    get nbPickedUp(): number | null;
    /**
     * Returns the number of pickup actions performed by the agent.
     *
     * This represents calls the agent retrieved from ringing groups or colleagues
     * using the call pickup feature.
     *
     * @returns the number of pickup actions performed
     */
    get nbPickup(): number | null;
    /**
     * Returns the number of internal outgoing calls
     * that were not handled via the ACD system.
     *
     * @returns the count of internal outgoing non-ACD calls
     */
    get nbLocalOutNonAcd(): number | null;
    /**
     * Returns the number of external outgoing calls
     * that were not handled via the ACD system.
     *
     * @returns the count of external outgoing non-ACD calls
     */
    get nbExtOutNonAcd(): number | null;
    /**
     * Returns the number of ACD calls that rang the agent.
     *
     * This counts all calls offered to the agent via the Automatic Call Distribution system,
     * regardless of whether the agent answered.
     *
     * @returns the number of ACD calls that rang the agent
     */
    get nbRingAcd(): number | null;
    /**
     * Returns the number of help requests made by the agent during calls.
     *
     * @returns the count of help requests
     */
    get nbHelp(): number | null;
    /**
     * Returns the number of internal (within the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of internal non-ACD incoming calls
     */
    get nbLocInNonAcd(): number | null;
    /**
     * Returns the number of direct external (outside the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of direct external non-ACD incoming calls
     */
    get nbExtInNonAcdDirect(): number | null;
    /**
     * Returns the number of transferred external (outside the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of transferred external non-ACD incoming calls
     */
    get nbExtInNonAcdTransferred(): number | null;
    /**
     * Returns the number of ACD calls that were served without a transaction code.
     *
     * @returns the count of ACD calls served without a transaction code
     */
    get nbServedWithoutCode(): number | null;
    /**
     * Returns the number of ACD calls that were served with a transaction code.
     *
     * @returns the count of ACD calls served with a transaction code
     */
    get nbServedWithCode(): number | null;
    /**
     * Returns the number of ACD calls that were served too quickly.
     *
     * A "quickly served" call is one answered or handled below the minimum expected
     * service time threshold.
     *
     * @returns the count of ACD calls served too quickly
     */
    get nbAcdQuickServed(): number | null;
    /**
     * Returns the number of external non-ACD incoming calls
     * that were successfully served by the agent.
     *
     * @returns the count of non-ACD external incoming calls served
     */
    get nbExtInNonAcdServed(): number | null;
    /**
     * Returns the number of external non-ACD incoming calls that were served too quickly.
     *
     * A "quickly served" call is one answered or handled below the expected service time threshold.
     *
     * @returns the count of external non-ACD incoming calls served too quickly
     */
    get nbExtInNonAcdQuickServed(): number | null;
    /**
     * Returns the number of outgoing calls handled via the ACD system.
     *
     * @returns the count of outgoing ACD calls
     */
    get nbOutAcd(): number | null;
    /**
     * Returns the number of outgoing ACD calls that were successfully answered.
     *
     * @returns the count of outgoing ACD calls answered
     */
    get nbOutAcdAnswered(): number | null;
    /**
     * Returns the number of calls currently in wrap-up.
     *
     * Wrap-up refers to the post-call work period after finishing a call, during which
     * the agent completes administrative or reporting tasks related to the call.
     *
     * @returns the count of calls on wrap-up
     */
    get nbOnWrapup(): number | null;
    /**
     * Returns the total duration of ringing for ACD calls that were served.
     *
     * @returns the total ringing duration for served ACD calls
     */
    get ringAcdServedTDur(): string | null;
    /**
     * Returns the average duration of ringing for ACD calls that were served.
     *
     * @returns the average ringing duration for served ACD calls
     */
    get ringAcdServedADur(): string | null;
    /**
     * Returns the total duration of ringing for non-ACD external incoming calls that were served.
     *
     * @returns the total ringing duration for served non-ACD external incoming calls
     */
    get ringInNonAcdExtServedTDur(): string | null;
    /**
     * Returns the average duration of ringing for non-ACD external incoming calls that were served.
     *
     * @returns the average ringing duration for served non-ACD external incoming calls
     */
    get ringInNonAcdExtServedADur(): string | null;
    /**
     * Returns the total duration of ringing for all ACD calls, regardless of whether they were served.
     *
     * @returns the total ringing duration for all ACD calls
     */
    get ringAcdTDur(): string | null;
    /**
     * Returns the average duration of ringing for ACD calls.
     *
     * @returns the average ringing duration for ACD calls
     */
    get ringAcdADur(): string | null;
    /**
     * Returns the total duration of ringing for non-ACD external incoming calls.
     *
     * @returns the total ringing duration for non-ACD external incoming calls
     */
    get ringInNonAcdExtTDur(): string | null;
    /**
     * Returns the average duration of ringing for non-ACD external incoming calls.
     *
     * @returns the average ringing duration for non-ACD external incoming calls
     */
    get ringInNonAcdExtADur(): string | null;
    /**
     * Returns the total duration of ringing for all calls.
     *
     * @returns the total ringing duration for all calls
     */
    get ringTDur(): string | null;
    /**
     * Returns the average duration of ringing for all calls.
     *
     * @returns the average ringing duration for all calls
     */
    get ringADur(): string | null;
    /**
     * Returns the total duration of conversation for ACD calls.
     *
     * @returns the total conversation duration for ACD calls
     */
    get convAcdTDur(): string | null;
    /**
     * Returns the average duration of conversation for ACD calls.
     *
     * @returns the average conversation duration for ACD calls
     */
    get convAcdADur(): string | null;
    /**
     * Returns the total duration of wrap-up for all served calls.
     *
     * @returns the total wrap-up duration for all served calls
     */
    get wrapupAcdTDur(): string | null;
    /**
     * Returns the total duration of conversation for internal outgoing non-ACD calls.
     *
     * @returns the total conversation duration for internal outgoing non-ACD calls
     */
    get convLocOutNonacdTDur(): string | null;
    /**
     * Returns the average duration of conversation for internal outgoing non-ACD calls.
     *
     * @returns the average conversation duration for internal outgoing non-ACD calls
     */
    get convLocOutNonacdADur(): string | null;
    /**
     * Returns the total duration of conversation for external outgoing calls.
     *
     * @returns the total conversation duration for external outgoing calls
     */
    get convExtOutTDur(): string | null;
    /**
     * Returns the average duration of conversation for external outgoing calls.
     *
     * @returns the average conversation duration for external outgoing calls
     */
    get convExtOutADur(): string | null;
    /**
     * Returns the total duration of conversation for internal non-ACD incoming calls.
     *
     * @returns the total conversation duration for internal non-ACD incoming calls
     */
    get convLocInNonacdTDur(): string | null;
    /**
     * Returns the average duration of conversation for internal non-ACD incoming calls.
     *
     * @returns the average conversation duration for internal non-ACD incoming calls
     */
    get convLocInNonacdADur(): string | null;
    /**
     * Returns the total duration of conversation for non-ACD external incoming calls.
     *
     * @returns the total conversation duration for non-ACD external incoming calls
     */
    get convExtInNonacdTDur(): string | null;
    /**
     * Returns the average duration of conversation for non-ACD external incoming calls.
     *
     * @returns the average conversation duration for non-ACD external incoming calls
     */
    get convExtInNonacdADur(): string | null;
    /**
     * Returns the total duration of outgoing ACD call processing.
     *
     * @returns the total duration of outgoing ACD call processing
     */
    get outAcdCommTDur(): string | null;
    /**
     * Returns the average duration of outgoing ACD call processing.
     *
     * @returns the average duration of outgoing ACD call processing
     */
    get outAcdCommADur(): string | null;
    /**
     * Returns the total duration of conversation for outgoing ACD calls.
     *
     * @returns the total conversation duration for outgoing ACD calls
     */
    get outAcdConvTDur(): string | null;
    /**
     * Returns the average duration of conversation for outgoing ACD calls.
     *
     * @returns the average conversation duration for outgoing ACD calls
     */
    get outAcdConvADur(): string | null;
    /**
     * Returns the total duration of transaction phase for outgoing ACD calls.
     *
     * @returns the total transaction duration for outgoing ACD calls
     */
    get outAcdTransactTDur(): string | null;
    /**
     * Returns the average duration of transaction phase for outgoing ACD calls.
     *
     * @returns the average transaction duration for outgoing ACD calls
     */
    get outAcdTransactADur(): string | null;
    /**
     * Returns the total duration of wrap-up for outgoing ACD calls.
     *
     * @returns the total wrap-up duration for outgoing ACD calls
     */
    get outAcdWrapupTDur(): string | null;
    /**
     * Returns the average duration of wrap-up for outgoing ACD calls.
     *
     * @returns the average wrap-up duration for outgoing ACD calls
     */
    get outAcdWrapupADur(): string | null;
    /**
     * Returns the total duration of pause phase during outgoing ACD calls.
     *
     * @returns the total pause duration for outgoing ACD calls
     */
    get outAcdPauseTDur(): string | null;
    /**
     * Returns the average duration of pause phase during outgoing ACD calls.
     *
     * @returns the average pause duration for outgoing ACD calls
     */
    get outAcdPauseADur(): string | null;
    /**
     * Returns the total idle duration during wrap-up time.
     *
     * @returns the total idle duration during wrap-up
     */
    get wrapUpIdleTDur(): string | null;
    /**
     * Returns the total duration of calls currently on wrap-up.
     *
     * @returns the cumulative duration of calls on wrap-up
     */
    get callOnWrapupTDur(): string | null;
    /**
     * Returns the total busy duration during wrap-up.
     *
     * @returns the total busy duration during wrap-up
     */
    get busyOnWrapupTDur(): string | null;
    /**
     * Returns the total busy duration outside wrap-up.
     *
     * @returns the total busy duration outside wrap-up
     */
    get busyTDur(): string | null;
    /**
     * Returns the percentage of time the agent was logged out.
     */
    get loggedOutPerTime(): number | null;
    /**
     * Returns the percentage of time the agent was not assigned.
     */
    get notAssignedPerTime(): number | null;
    /**
     * Returns the percentage of time the agent was assigned.
     */
    get assignedPerTime(): number | null;
    /**
     * Returns the percentage of time the agent was withdrawn.
     */
    get withdrawPerTime(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 1.
     */
    get withdrawPerTimeCause1(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 2.
     */
    get withdrawPerTimeCause2(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 3.
     */
    get withdrawPerTimeCause3(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 4.
     */
    get withdrawPerTimeCause4(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 5.
     */
    get withdrawPerTimeCause5(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 6.
     */
    get withdrawPerTimeCause6(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 7.
     */
    get withdrawPerTimeCause7(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 8.
     */
    get withdrawPerTimeCause8(): number | null;
    /**
     * Returns the percentage of withdrawn time due to cause 9.
     */
    get withdrawPerTimeCause9(): number | null;
    /**
     * Returns the number of pilots assigned to the agent.
     */
    get nbPilots(): number | null;
    /**
     * Returns the total number of ACD calls served by the agent.
     */
    get nbAcdServedCalls(): number | null;
    /**
     * Returns the number of incoming ACD calls served by the agent.
     */
    get nbAcdInServedCalls(): number | null;
    /**
     * Returns the number of incoming calls received by pilots.
     */
    get nbInCallsReceivedByPilot(): number | null;
    /**
     * Returns the number of outgoing ACD calls served by the agent.
     */
    get nbAcdOutServedCalls(): number | null;
    /**
     * Returns the total number of calls that were not served.
     */
    get nbTotNonServedCalls(): number | null;
    /**
     * Returns the number of incoming calls that were not served.
     */
    get nbInNonServedCalls(): number | null;
    /**
     * Returns the number of calls that were picked up by the agent.
     */
    get nbPickedUpCalls(): number | null;
    /**
     * Returns the number of calls that were refused by the agent.
     */
    get nbRefusedCalls(): number | null;
    /**
     * Returns the number of outgoing ACD calls that were not served.
     */
    get nbAcdOutNonServedCalls(): number | null;
    /**
     * Returns the total number of non-ACD calls received by the agent.
     */
    get nbTotNonAcdreceivedCalls(): number | null;
    /**
     * Returns the number of incoming non-ACD calls received by the agent.
     */
    get nbInNonAcdCalls(): number | null;
    /**
     * Returns the number of outgoing non-ACD calls made by the agent.
     */
    get nbOutNonAcdCalls(): number | null;
    /**
     * Returns the total duration during which the agent was assigned but not withdrawn.
     */
    get assignedNotWithdrawDur(): string | null;
    /**
     * Returns the total duration during which the agent was withdrawn.
     */
    get withdrawDur(): string | null;
    /**
     * Returns the total duration of manual wrap-up work performed by the agent.
     */
    get manuWrapupDur(): string | null;
    /**
     * Returns the total duration during which the agent was unreachable.
     */
    get unreachableDur(): string | null;
    /**
     * Returns the total duration of non-ACD work performed by the agent.
     */
    get nonAcdWorkTDur(): string | null;
    /**
     * Returns the average duration of non-ACD work performed by the agent.
     */
    get nonAcdWorkADur(): string | null;
    /**
     * Returns the total duration of ACD work performed by the agent.
     */
    get acdWorkTDur(): string | null;
    /**
     * Returns the average duration of ACD work performed by the agent.
     */
    get acdWorkADur(): string | null;
    /**
     * Returns the total duration of incoming ACD work.
     */
    get acdWorkInTDur(): string | null;
    /**
     * Returns the average duration of incoming ACD work.
     */
    get acdWorkInADur(): string | null;
    /**
     * Returns the total duration of conversations during incoming ACD work.
     */
    get acdWorkInConvTDur(): string | null;
    /**
     * Returns the average duration of conversations during incoming ACD work.
     */
    get acdWorkInConvADur(): string | null;
    /**
     * Returns the total duration of ringing during incoming ACD work.
     */
    get acdWorkInRingTDur(): string | null;
    /**
     * Returns the average duration of ringing during incoming ACD work.
     */
    get acdWorkInRingADur(): string | null;
    /**
     * Returns the total duration of wrap-up during incoming ACD work.
     */
    get acdWorkInWrapupTDur(): string | null;
    /**
     * Returns the average duration of wrap-up during incoming ACD work.
     */
    get acdWorkInWrapupADur(): string | null;
    /**
     * Returns the total duration of outgoing ACD work.
     */
    get acdWorkOutTDur(): string | null;
    /**
     * Returns the average duration of outgoing ACD work.
     */
    get acdWorkOutADur(): string | null;
    /**
     * Returns the total duration of conversations during outgoing ACD work.
     */
    get acdWorkOutConvTDur(): string | null;
    /**
     * Returns the average duration of conversations during outgoing ACD work.
     */
    get acdWorkOutConvADur(): string | null;
    /**
     * Returns the total duration of wrap-up during outgoing ACD work.
     */
    get acdWorkOutWrapupTDur(): string | null;
    /**
     * Returns the average duration of wrap-up during outgoing ACD work.
     */
    get acdWorkOutWrapupADur(): string | null;
    /**
     * Returns the total duration of conversations for incoming ACD calls.
     */
    get acdInConvTDur(): string | null;
    /**
     * Returns the average duration of conversations for incoming ACD calls.
     */
    get acdInConvADur(): string | null;
    /**
     * Returns the total duration of conversations for outgoing ACD calls.
     */
    get acdOutConvTDur(): string | null;
    /**
     * Returns the average duration of conversations for outgoing ACD calls.
     */
    get acdOutConvADur(): string | null;
}
//# sourceMappingURL=ag-stats-row.d.ts.map
/**
 * Defines the observation period over which statistical data is collected.
 *
 * This enumeration is used to indicate whether the statistics cover a single day
 * or extend across multiple consecutive days. It is typically used when requesting
 * reports or querying data from the Call Center Statistics Service.
 *
 * @since 2.7.4
 */
export declare enum DataObservationPeriod {
    /**
     * Indicates that the observations are collected over a single calendar day.
     */
    ONE_DAY = "oneDay",
    /**
     * Indicates that the observations are collected over several consecutive days.
     */
    ON_SEVERAL_DAYS = "onSeveralDays"
}
//# sourceMappingURL=data-obs-period.d.ts.map
import { PilotStatisticsRowJson } from '../../../internal/types/cc-stat/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsPilotAttributes } from '../pilot-attributes';
export declare class PilotStatisticsRow {
    #private;
    [key: string]: any;
    private values;
    constructor(json: PilotStatisticsRowJson);
    private initializeFromJson;
    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsPilotAttributes): StatValue;
    /**
     * Returns the timestamp associated with this statistics row.
     * <p>
     * The returned value represents the date at which the statistics were
     * collected, as a JavaScript Date.
     *
     * @returns the Date representing when this statistics entry was recorded
     */
    get dateValue(): Date | null;
    /**
     * Queue's name.
     *
     * @returns the name of the queue
     */
    get queueNameValue(): string | null;
    /**
     * Pilot's name.
     *
     * @returns the name of the pilot
     */
    get pilotNameValue(): string | null;
    /**
     * Pilot's number.
     *
     * @returns the pilot's phone number
     */
    get pilotNumberValue(): string | null;
    /**
     * Number of calls received in open state (PC001).
     *
     * @return the number of calls received in open state
     */
    get nbCallsOpen(): string | null;
    /**
     * Number of calls received in blocked state (PC002).
     *
     * @return the number of calls received in blocked state
     */
    get nbCallsBlocked(): string | null;
    /**
     * Number of calls received in general forwarding state (PC003).
     *
     * @return the number of calls received in forwarding state
     */
    get nbCallsForward(): string | null;
    /**
     * Number of calls received by transfer (PC004).
     *
     * @return the number of calls received via transfer
     */
    get nbCallsByTransfer(): string | null;
    /**
     * Number of calls received by mutual aid (PC005).
     *
     * @return the number of calls received via mutual aid
     */
    get nbCallsByMutualAid(): string | null;
    /**
     * Maximum number of simultaneous calls (PC006).
     *
     * @return the maximum number of simultaneous calls
     */
    get maxNbSimultCalls(): string | null;
    /**
     * Number of overflows while calls were in queue (PC007).
     *
     * @return the number of timing overflows while calls were waiting in the queue
     */
    get nbOverflowInQueue(): string | null;
    /**
     * Number of overflows while calls were ringing the agent (PC008).
     *
     * @return the number of timing overflows while calls were ringing the agent
     */
    get nbOverflowInRinging(): string | null;
    /**
     * Number of calls served without queuing (PC009).
     *
     * @return the number of calls served immediately without queuing
     */
    get nbCallsWOQueuing(): string | null;
    /**
     * Number of calls served after queuing (PC010).
     *
     * @return the number of calls served after waiting in queue
     */
    get nbCallsAfterQueuing(): string | null;
    /**
     * Number of calls sent in mutual aid queue (PC011).
     *
     * @return the number of calls redirected to the mutual aid queue
     */
    get nbCallsSentInMutualAidQueue(): string | null;
    /**
     * Number of calls redirected outside ACD area (PC012).
     *
     * @return the number of calls redirected outside the ACD area
     */
    get nbCallsRedirectedOutACDArea(): string | null;
    /**
     * Number of calls dissuaded (PC013).
     *
     * @return the number of calls that were dissuaded
     */
    get nbCallsDissuaded(): string | null;
    /**
     * Number of calls dissuaded after trying mutual aid (PC014).
     *
     * @return the number of calls dissuaded after attempting mutual aid
     */
    get nbCallsDissuadedAfterTryingMutualAid(): string | null;
    /**
     * Number of calls processed by VG type PG (PC015).
     *
     * @return the number of calls processed by VG type PG
     */
    get nbCallsVGTypePG(): string | null;
    /**
     * Number of calls sent to remote PG (PC016).
     *
     * @return the number of calls sent to a remote PG
     */
    get nbCallsSentToPG(): string | null;
    /**
     * Number of calls rejected due to lack of resources (PC017).
     *
     * @return the number of calls rejected due to insufficient resources
     */
    get nbCallsRejectedLackOfRes(): string | null;
    /**
     * Number of calls served by agent (PC018).
     *
     * @return the number of calls served by an agent
     */
    get nbCallsServedByAgent(): string | null;
    /**
     * Number of calls served in time (PC019).
     *
     * @return the number of calls served within the expected time
     */
    get nbCallsServedInTime(): string | null;
    /**
     * Number of calls served too quickly (PC020).
     *
     * @return the number of calls served too quickly
     */
    get nbCallsServedTooQuick(): string | null;
    /**
     * Number of calls without transaction code (PC021).
     *
     * @return the number of calls without a transaction code
     */
    get nbCallsWithoutTransCode(): string | null;
    /**
     * Number of calls with transaction code (PC022).
     *
     * @return the number of calls with a transaction code
     */
    get nbCallsWithTransCode(): string | null;
    /**
     * Number of calls redistributed (PC023).
     *
     * @return the number of calls that were redistributed
     */
    get nbCallsRedistrib(): string | null;
    /**
     * Number of calls served before threshold 1 (PC024).
     *
     * @return the number of calls served before the first time threshold
     */
    get nbCallsBeforeTS1(): string | null;
    /**
     * Percentage of calls served before threshold 1 (PC025).
     *
     * @return the percentage of calls served before threshold 1
     */
    get percentCallsBeforeTS1(): number | null;
    /**
     * Number of calls served before threshold 2 (PC026).
     *
     * @return the number of calls served before threshold 2
     */
    get nbCallsBeforeTS2(): string | null;
    /**
     * Percentage of calls served before threshold 2 (PC027).
     *
     * @return the percentage of calls served before threshold 2
     */
    get percentCallsBeforeTS2(): number | null;
    /**
     * Number of calls served before threshold 3 (PC028).
     *
     * @return the number of calls served before threshold 3
     */
    get nbCallsBeforeTS3(): string | null;
    /**
     * Percentage of calls served before threshold 3 (PC029).
     *
     * @return the percentage of calls served before threshold 3
     */
    get percentCallsBeforeTS3(): number | null;
    /**
     * Number of calls served before threshold 4 (PC030).
     *
     * @return the number of calls served before threshold 4
     */
    get nbCallsBeforeTS4(): string | null;
    /**
     * Percentage of calls served before threshold 4 (PC031).
     *
     * @return the percentage of calls served before threshold 4
     */
    get percentCallsBeforeTS4(): number | null;
    /**
     * Number of calls served after threshold 4 (PC032).
     *
     * @return the number of calls served after threshold 4
     */
    get nbCallsAfterTS4(): string | null;
    /**
     * Percentage of calls served after threshold 4 (PC033).
     *
     * @return the percentage of calls served after threshold 4
     */
    get percentCallsAfterTS4(): number | null;
    /**
     * Number of abandons on greeting voice guide (PC034).
     *
     * @return the number of calls abandoned on greeting voice guide
     */
    get nbAbandonsOnGreetingsVG(): string | null;
    /**
     * Number of abandons on first waiting voice guide (PC035).
     *
     * @return the number of calls abandoned on first waiting voice guide
     */
    get nbAbandonsOn1WaitingVG(): string | null;
    /**
     * Number of abandons on second waiting voice guide (PC036).
     *
     * @return the number of calls abandoned on second waiting voice guide
     */
    get nbAbandonsOn2WaitingVG(): string | null;
    /**
     * Number of abandons on third waiting voice guide (PC037).
     *
     * @return the number of calls abandoned on third waiting voice guide
     */
    get nbAbandonsOn3WaitingVG(): string | null;
    /**
     * Number of abandons on fourth waiting voice guide (PC038).
     *
     * @return the number of calls abandoned on fourth waiting voice guide
     */
    get nbAbandonsOn4WaitingVG(): string | null;
    /**
     * Number of abandons on fifth waiting voice guide (PC039).
     *
     * @return the number of calls abandoned on fifth waiting voice guide
     */
    get nbAbandonsOn5WaitingVG(): string | null;
    /**
     * Number of abandons on sixth waiting voice guide (PC040).
     *
     * @return the number of calls abandoned on sixth waiting voice guide
     */
    get nbAbandonsOn6WaitingVG(): string | null;
    /**
     * Number of abandons on ringing (PC041).
     *
     * @return the number of calls abandoned while ringing
     */
    get nbAbandonsOnRinging(): string | null;
    /**
     * Number of abandons on general forwarding voice guide (PC042).
     *
     * @return the number of calls abandoned on general forwarding voice guide
     */
    get nbAbandonsOnGenFwdVG(): string | null;
    /**
     * Number of abandons on blocked voice guide (PC043).
     *
     * @return the number of calls abandoned on blocked voice guide
     */
    get nbAbandonsOnBlockedVG(): string | null;
    /**
     * Number of abandons of direct calls while waiting on agent busy (PC044).
     *
     * @return the number of calls abandoned due to agent being busy
     */
    get nbAbandonsOnAgentBusy(): string | null;
    /**
     * Overall number of abandons (PC045).
     *
     * @return the total number of call abandons
     */
    get nbAbandons(): string | null;
    /**
     * Number of abandons before threshold 1 (PC046).
     *
     * @return the number of call abandons before threshold 1
     */
    get nbAbandonsBeforeTS1(): string | null;
    /**
     * Percentage of abandons before threshold 1 (PC047).
     *
     * @return the percentage of call abandons before threshold 1
     */
    get percentAbandonsBeforeTS1(): number | null;
    /**
     * Number of abandons before threshold 2 (PC048).
     *
     * @return the number of call abandons before threshold 2
     */
    get nbAbandonsBeforeTS2(): string | null;
    /**
     * Percentage of abandons before threshold 2 (PC049).
     *
     * @return the percentage of call abandons before threshold 2
     */
    get percentAbandonsBeforeTS2(): number | null;
    /**
     * Number of abandons before threshold 3 (PC050).
     *
     * @return the number of call abandons before threshold 3
     */
    get nbAbandonsBeforeTS3(): string | null;
    /**
     * Percentage of abandons before threshold 3 (PC051).
     *
     * @return the percentage of call abandons before threshold 3
     */
    get percentAbandonsBeforeTS3(): number | null;
    /**
     * Number of abandons before threshold 4 (PC052).
     *
     * @return the number of call abandons before threshold 4
     */
    get nbAbandonsBeforeTS4(): string | null;
    /**
     * Percentage of abandons before threshold 4 (PC053).
     *
     * @return the percentage of call abandons before threshold 4
     */
    get percentAbandonsBeforeTS4(): number | null;
    /**
     * Number of abandons after threshold 4 (PC054).
     *
     * @return the number of call abandons after threshold 4
     */
    get nbAbandonsAfterTS4(): string | null;
    /**
     * Percentage of abandons after threshold 4 (PC055).
     *
     * @return the percentage of call abandons after threshold 4
     */
    get percentAbandonsAfterTS4(): number | null;
    /**
     * Total duration of call processing (PC056).
     *
     * @return the total duration of call processing
     */
    get callProcTDur(): string | null;
    /**
     * Average duration of call processing (PC057).
     *
     * @return the average duration of call processing
     */
    get callProcADur(): string | null;
    /**
     * Total duration of greeting guide listening (PC058).
     *
     * @return the total duration spent listening to greeting guide
     */
    get greetingListenTDur(): string | null;
    /**
     * Average duration of greeting guide listening (PC059).
     *
     * @return the average duration spent listening to greeting guide
     */
    get greetingListenADur(): string | null;
    /**
     * Total time before queuing (PC060).
     *
     * @return the total duration before calls are queued
     */
    get beforeQueuingTDur(): string | null;
    /**
     * Total waiting duration of served calls (PC061).
     *
     * @return the total waiting duration of served calls
     */
    get waitServedCallsTDur(): string | null;
    /**
     * Average waiting duration of served calls (PC062).
     *
     * @return the average waiting duration of served calls
     */
    get waitServedCallsADur(): string | null;
    /**
     * Total waiting duration of abandoned calls (PC063).
     *
     * @return the total waiting duration of abandoned calls
     */
    get waitAbandonnedCallsTDur(): string | null;
    /**
     * Average waiting duration of abandoned calls (PC064).
     *
     * @return the average waiting duration of abandoned calls
     */
    get waitAbandonnedCallsADur(): string | null;
    /**
     * Total duration of ringing (PC065).
     *
     * @return the total ringing duration
     */
    get ringingTDur(): string | null;
    /**
     * Average duration of ringing (PC066).
     *
     * @return the average ringing duration
     */
    get ringingADur(): string | null;
    /**
     * Total duration of conversation (PC067).
     *
     * @return the total conversation duration
     */
    get convTDur(): string | null;
    /**
     * Average duration of conversation (PC068).
     *
     * @return the average conversation duration
     */
    get convADur(): string | null;
    /**
     * Total duration of hold calls (PC069).
     *
     * @return the total duration of calls on hold
     */
    get holdCallsTDur(): string | null;
    /**
     * Average duration of hold calls (PC070).
     *
     * @return the average duration of calls on hold
     */
    get holdCallsADur(): string | null;
    /**
     * Total duration of wrap-up (PC071).
     *
     * @return the total wrap-up duration
     */
    get wrapupTDur(): string | null;
    /**
     * Average duration of wrap-up (PC072).
     *
     * @return the average wrap-up duration
     */
    get wrapupADur(): string | null;
    /**
     * Longest waiting time (PC073).
     *
     * @return the longest waiting duration for a call
     */
    get longestWaitingDur(): string | null;
    /**
     * Service level (PC077).
     *
     * @return the service level
     */
    get serviceLevel(): number | null;
    /**
     * Efficiency (PC078).
     *
     * @return the efficiency of the queue or pilot
     */
    get efficiency(): number | null;
    /**
     * In-service state (pilot state percent) (PC079).
     *
     * @return the in-service state as a percentage
     */
    get inServiceState(): number | null;
    /**
     * General forwarding state (pilot state percent) (PC080).
     *
     * @return the general forwarding state as a percentage
     */
    get genFwdState(): number | null;
    /**
     * Blocked state (pilot state percent) (PC081).
     *
     * @return the blocked state as a percentage
     */
    get blockedState(): number | null;
    /**
     * Total number of received calls (PC082).
     *
     * @return the total number of received calls
     */
    get dnbTotReceivedCalls(): string | null;
    /**
     * Number of received calls in pilot open (PC083).
     *
     * @return the number of received calls in open state
     */
    get dnbCallsOpen(): string | null;
    /**
     * Number of received calls in pilot blocked (PC084).
     *
     * @return the number of received calls in blocked state
     */
    get dnbCallsBlocked(): string | null;
    /**
     * Number of received calls in pilot general forwarding (PC085).
     *
     * @return the number of received calls in general forwarding state
     */
    get dnbCallsForward(): string | null;
    /**
     * Number of received calls in direct routing (PC086).
     *
     * @return the number of received calls routed directly
     */
    get dnbDirectRoute(): string | null;
    /**
     * Number of received calls in indirect routing (PC087).
     *
     * @return the number of received calls routed indirectly
     */
    get dnbIndirectRoute(): string | null;
    /**
     * Total number of served calls (PC088).
     *
     * @return the total number of served calls
     */
    get dnbTotServedCalls(): string | null;
    /**
     * ACD served calls efficiency (PC089).
     *
     * @return the efficiency of ACD served calls
     */
    get defficiency(): string | null;
    /**
     * Number of ACD served calls without queuing (PC090).
     *
     * @return the number of ACD served calls without queuing
     */
    get dnbCallsWOQueuing(): string | null;
    /**
     * Number of ACD served calls after queuing (PC091).
     *
     * @return the number of ACD served calls after queuing
     */
    get dnbCallsAfterQueuing(): string | null;
    /**
     * Number of ACD served calls before threshold 1 (PC092).
     *
     * @return the number of ACD served calls before threshold 1
     */
    get dnbCallsBeforeTS1(): string | null;
    /**
     * Number of ACD served calls before threshold 2 (PC093).
     *
     * @return the number of ACD served calls before threshold 2
     */
    get dnbCallsBeforeTS2(): string | null;
    /**
     * Number of ACD served calls before threshold 3 (PC094).
     *
     * @return the number of ACD served calls before threshold 3
     */
    get dnbCallsBeforeTS3(): string | null;
    /**
     * Number of ACD served calls before threshold 4 (PC095).
     *
     * @return the number of ACD served calls before threshold 4
     */
    get dnbCallsBeforeTS4(): string | null;
    /**
     * Number of ACD served calls after threshold 4 (PC096).
     *
     * @return the number of ACD served calls after threshold 4
     */
    get dnbCallsAfterTS4(): string | null;
    /**
     * Average waiting time for ACD served calls (PC097).
     *
     * @return the average waiting duration of served calls
     */
    get dwaitServedCallsADur(): string | null;
    /**
     * Total number of abandons (PC098).
     *
     * @return the total number of abandoned calls
     */
    get dnbAbandons(): string | null;
    /**
     * Number of abandons on greetings voice guide (PC099).
     *
     * @return the number of abandons during greeting voice guide
     */
    get dnbAbandonsOnGreetingsVG(): string | null;
    /**
     * Number of abandons on waiting voice guide (PC100).
     *
     * @return the number of abandons during waiting voice guide
     */
    get dnbAbandonsOnWaitingVG(): string | null;
}
//# sourceMappingURL=pil-stats-row.d.ts.map
import { TimeInterval } from '../time-interval';
import { DataObservationPeriod } from './data-obs-period';
/**
 * Defines a time range and granularity for retrieving statistical data.
 *
 * A {@code SelectedPeriod} specifies both the observation duration and the temporal resolution
 * (slot size) used when aggregating statistics. It is used when querying data or generating
 * detailed or multi-day reports.
 *
 * The selected period includes:
 * - The type of observation period (DataObservationPeriod), such as a single day or several consecutive days.
 * - The time slot granularity (TimeInterval) used for grouping data within the period (e.g., 15-minute or hourly intervals).
 * - The start and end boundaries of the observation period.
 *
 * This class is typically used as part of a query or report configuration to define
 * the exact time frame and aggregation level for statistical computations.
 *
 * @since 2.7.4
 */
export declare class SelectedPeriod {
    #private;
    /**
     * Returns the start date of the selected period as a Date object.
     *
     * @returns The beginning date of the observation period
     */
    get beginDate(): Date | null;
    /**
     * Returns the end date of the selected period as a Date object.
     *
     * @returns The ending date of the observation period
     */
    get endDate(): Date | null;
    /**
     * Returns the observation period type, defining whether statistics are
     * collected for a single day or multiple consecutive days.
     *
     * @returns The observation period type
     */
    get observationPeriod(): DataObservationPeriod;
    /**
     * Returns the time slot granularity used for aggregating statistics within
     * the selected period (e.g., 15-minute, 30-minute, or hourly).
     *
     * @returns The time interval (slot size) for data aggregation
     */
    get timeInterval(): TimeInterval | null;
}
//# sourceMappingURL=selected-period.d.ts.map
import { AgentStatisticsRow } from './ag-stats-row';
import { PilotStatisticsRow } from './pil-stats-row';
import { SelectedPeriod } from './selected-period';
/**
 * Represents the statistical results for a specific observation period and time slot.
 * <p>
 * Each `ObjectStatistics<T>` instance groups the data rows collected for a given
 * {@link SelectedPeriod} and an optional time slot (e.g. a 15-minute or hourly interval).
 * <p>
 * The class is generic and can represent either agent-level or pilot-level statistics:
 * <ul>
 * <li>`ObjectStatistics<AgentStatisticsRow>` â€” for agent statistics</li>
 * <li>`ObjectStatistics<PilotStatisticsRow>` â€” for pilot statistics</li>
 * </ul>
 *
 * @template T the type of the statistics row, either `AgentStatisticsRow` or `PilotStatisticsRow`
 * @see StatisticsData
 * @see CallCenterStatistics.getDayData
 * @see CallCenterStatistics.getDaysData
 */
export declare class ObjectStatistics<T> {
    #private;
    /**
     * The start date and time of this time slot.
     * <p>
     * The time slot represents the period during which the statistics were aggregated
     * (e.g. `2025-09-02T10:00` for a 15-minute interval starting at 10:00).
     */
    get timeSlot(): Date | null;
    /**
     * The selected period during which these statistics were collected.
     */
    get selectedPeriod(): SelectedPeriod | null;
    /**
     * The list of statistics rows collected for this time slot and period.
     */
    get rows(): T[] | null;
}
/**
 * Represents the statistical data returned for a requester, including agent-level
 * and pilot-level statistics grouped by time slot and observation period.
 * <p>
 * A `StatisticsData` instance is returned by {@link CallCenterStatistics.getDayData}
 * and {@link CallCenterStatistics.getDaysData}.
 *
 * @see CallCenterStatistics.getDayData
 * @see CallCenterStatistics.getDaysData
 */
export declare class StatisticsData {
    #private;
    /**
     * The identifier of the requester (supervisor) for whom the statistics were retrieved.
     */
    get requesterId(): string;
    /**
     * The agent-level statistics, grouped by time slot and observation period.
     */
    get agentsStats(): ObjectStatistics<AgentStatisticsRow>[] | undefined;
    /**
     * The pilot-level statistics, grouped by time slot and observation period.
     */
    get pilotsStats(): ObjectStatistics<PilotStatisticsRow>[] | undefined;
}
//# sourceMappingURL=stats-data.d.ts.map
/**
 * Represents a statistical value that can be interpreted as different types.
 * <p>
 * A `StatValue` wraps a raw value returned in statistics data and provides
 * typed accessors to read it as an integer, float, string or duration.
 * All accessors return `null` if the underlying value is not set or cannot
 * be converted to the requested type.
 */
export declare class StatValue {
    private value;
    /**
     * Returns the value as an integer.
     *
     * @returns the integer value, or `null` if the value is not set or cannot be parsed
     */
    asInteger(): number | null;
    /**
     * Returns the value as a floating-point number.
     *
     * @returns the float value, or `null` if the value is not set or cannot be parsed
     */
    asFloat(): number | null;
    /**
     * Returns the value as a string.
     *
     * @returns the string representation, or `null` if the value is not set
     */
    asString(): string | null;
    /**
     * Returns the value as a duration string in `hh:mm:ss` format.
     *
     * @returns the duration string, or `null` if the value is not set
     */
    asDuration(): string | null;
}
//# sourceMappingURL=stat-value.d.ts.map
import { ProgressStep } from './progress-step';
/**
 * Function type for receiving progress updates during an asynchronous or long-running operation.
 *
 * @param step - The current logical step or phase of the operation
 * @param progress - Completion percentage (0 to 100)
 */
export type ProgressCallback = (step: ProgressStep, progress: number) => void;
//# sourceMappingURL=progress-callback.d.ts.map
/**
 * Represents the different steps in the processing of CCD statistics.
 * A `ProgressStep` indicates the current state of the data lifecycle,
 * from collection to processing and formatting, including possible error or cancellation states.
 */
export declare enum ProgressStep {
    /**
     * Data is currently being collected by the application front end.
     */
    COLLECTING = "COLLECTING",
    /**
     * Data collection has been successfully completed and the data has been processed.
     */
    PROCESSED = "PROCESSED",
    /**
     * Processed data has been successfully formatted for reporting or export.
     */
    FORMATTED = "FORMATTED"
}
//# sourceMappingURL=progress-step.d.ts.map
/**
 * Enum representing the language of a requester.
 *
 * Each constant corresponds to a supported language in the system.
 * @since 2.7.4
 */
export declare enum Language {
    /** English language. */
    EN = "EN",
    /** French language. */
    FR = "FR",
    /** German language. */
    DE = "DE"
}
//# sourceMappingURL=language.d.ts.map
/**
 * `PilotAttributes` enumerates the possible attributes for a Call Center CCD pilot.
 *
 * Each attribute corresponds to a statistic that can be reported by `CallCenterStatisticsService`.
 * These attributes allow fine-grained analysis of pilot performance, call handling, waiting times, and service levels.
 *
 * The special attribute `ALL` includes all available attributes and is mainly intended for testing or bulk retrieval purposes.
 *
 * @since 2.7.4
 */
export declare enum StatsPilotAttributes {
    /**
     * Number of calls received in the open state.
     * An open state call is one that is offered to the pilot without any restrictions or routing blocks.
     */
    nbCallsOpen = "nbCallsOpen",
    /**
     * Number of calls received in the blocked state.
     * A blocked state call is one that could not be delivered immediately due to pilot availability or system constraints.
     */
    nbCallsBlocked = "nbCallsBlocked",
    /**
     * Number of calls received in the general forwarding state.
     * This represents calls that were routed to the pilot via general forwarding rules.
     */
    nbCallsForward = "nbCallsForward",
    /** Number of calls received by transfer. These are calls transferred to this pilot. */
    nbCallsByTransfer = "nbCallsByTransfer",
    /** Number of calls received via mutual aid. */
    nbCallsByMutualAid = "nbCallsByMutualAid",
    /**
     * Maximum number of simultaneous calls.
     * Represents the peak number of concurrent calls handled by the pilot at any given moment.
     */
    maxNbSimultCalls = "maxNbSimultCalls",
    /** Number of overflows while calls were in queue. */
    nbOverflowInQueue = "nbOverflowInQueue",
    /** Number of overflows while calls were ringing the agent. */
    nbOverflowInRinging = "nbOverflowInRinging",
    /** Number of calls served without queuing. */
    nbCallsWOQueuing = "nbCallsWOQueuing",
    /** Number of calls served after queuing. */
    nbCallsAfterQueuing = "nbCallsAfterQueuing",
    /** Number of calls sent to the mutual aid queue. */
    nbCallsSentInMutualAidQueue = "nbCallsSentInMutualAidQueue",
    /** Number of calls redirected outside the ACD area. */
    nbCallsRedirectedOutACDArea = "nbCallsRedirectedOutACDArea",
    /** Number of calls dissuaded before reaching an agent. */
    nbCallsDissuaded = "nbCallsDissuaded",
    /** Number of calls dissuaded after attempting mutual aid. */
    nbCallsDissuadedAfterTryingMutualAid = "nbCallsDissuadedAfterTryingMutualAid",
    /** Number of calls processed by VG type PG. */
    nbCallsVGTypePG = "nbCallsVGTypePG",
    /** Number of calls sent to a remote PG. */
    nbCallsSentToPG = "nbCallsSentToPG",
    /** Number of calls rejected due to lack of resources. */
    nbCallsRejectedLackOfRes = "nbCallsRejectedLackOfRes",
    /** Number of calls served by the agent. */
    nbCallsServedByAgent = "nbCallsServedByAgent",
    /** Number of calls served within the expected time. */
    nbCallsServedInTime = "nbCallsServedInTime",
    /** Number of calls served too quickly. */
    nbCallsServedTooQuick = "nbCallsServedTooQuick",
    /** Number of calls without a transaction code. */
    nbCallsWithoutTransCode = "nbCallsWithoutTransCode",
    /** Number of calls with a transaction code. */
    nbCallsWithTransCode = "nbCallsWithTransCode",
    /** Number of calls redistributed to other agents or queues. */
    nbCallsRedistrib = "nbCallsRedistrib",
    /** Number of calls served before threshold 1 (e.g., 5 seconds). */
    nbCallsBeforeTS1 = "nbCallsBeforeTS1",
    /** Percentage of calls served before threshold 1 (e.g., 5 seconds). */
    percentCallsBeforeTS1 = "percentCallsBeforeTS1",
    /** Number of calls served before threshold 2 (e.g., 15 seconds). */
    nbCallsBeforeTS2 = "nbCallsBeforeTS2",
    /** Percentage of calls served before threshold 2 (e.g., 15 seconds). */
    percentCallsBeforeTS2 = "percentCallsBeforeTS2",
    /** Number of calls served before threshold 3 (e.g., 30 seconds). */
    nbCallsBeforeTS3 = "nbCallsBeforeTS3",
    /** Percentage of calls served before threshold 3 (e.g., 30 seconds). */
    percentCallsBeforeTS3 = "percentCallsBeforeTS3",
    /** Number of calls served before threshold 4 (e.g., 60 seconds). */
    nbCallsBeforeTS4 = "nbCallsBeforeTS4",
    /** Percentage of calls served before threshold 4 (e.g., 60 seconds). */
    percentCallsBeforeTS4 = "percentCallsBeforeTS4",
    /** Number of calls served after threshold 4 (e.g., 60 seconds). */
    nbCallsAfterTS4 = "nbCallsAfterTS4",
    /** Percentage of calls served after threshold 4 (e.g., 60 seconds). */
    percentCallsAfterTS4 = "percentCallsAfterTS4",
    /** Number of abandons during the greeting voice guide. */
    nbAbandonsOnGreetingsVG = "nbAbandonsOnGreetingsVG",
    /** Number of abandons during the first waiting voice guide. */
    nbAbandonsOn1WaitingVG = "nbAbandonsOn1WaitingVG",
    /** Number of abandons during the second waiting voice guide. */
    nbAbandonsOn2WaitingVG = "nbAbandonsOn2WaitingVG",
    /** Number of abandons during the third waiting voice guide. */
    nbAbandonsOn3WaitingVG = "nbAbandonsOn3WaitingVG",
    /** Number of abandons during the fourth waiting voice guide. */
    nbAbandonsOn4WaitingVG = "nbAbandonsOn4WaitingVG",
    /** Number of abandons during the fifth waiting voice guide. */
    nbAbandonsOn5WaitingVG = "nbAbandonsOn5WaitingVG",
    /** Number of abandons during the sixth waiting voice guide. */
    nbAbandonsOn6WaitingVG = "nbAbandonsOn6WaitingVG",
    /** Number of abandons while the call was ringing. */
    nbAbandonsOnRinging = "nbAbandonsOnRinging",
    /** Number of abandons on general forwarding voice guide. */
    nbAbandonsOnGenFwdVG = "nbAbandonsOnGenFwdVG",
    /** Number of abandons on blocked voice guide. */
    nbAbandonsOnBlockedVG = "nbAbandonsOnBlockedVG",
    /** Number of direct call abandons while the agent was busy. */
    nbAbandonsOnAgentBusy = "nbAbandonsOnAgentBusy",
    /** Total number of abandons. */
    nbAbandons = "nbAbandons",
    /** Number of abandons before threshold 1 (e.g., 5 seconds). */
    nbAbandonsBeforeTS1 = "nbAbandonsBeforeTS1",
    /** Percentage of abandons before threshold 1 (e.g., 5 seconds). */
    percentAbandonsBeforeTS1 = "percentAbandonsBeforeTS1",
    /** Number of abandons before threshold 2 (e.g., 15 seconds). */
    nbAbandonsBeforeTS2 = "nbAbandonsBeforeTS2",
    /** Percentage of abandons before threshold 2 (e.g., 15 seconds). */
    percentAbandonsBeforeTS2 = "percentAbandonsBeforeTS2",
    /** Number of abandons before threshold 3 (e.g., 30 seconds). */
    nbAbandonsBeforeTS3 = "nbAbandonsBeforeTS3",
    /** Percentage of abandons before threshold 3 (e.g., 30 seconds). */
    percentAbandonsBeforeTS3 = "percentAbandonsBeforeTS3",
    /** Number of abandons before threshold 4 (e.g., 60 seconds). */
    nbAbandonsBeforeTS4 = "nbAbandonsBeforeTS4",
    /** Percentage of abandons before threshold 4 (e.g., 60 seconds). */
    percentAbandonsBeforeTS4 = "percentAbandonsBeforeTS4",
    /** Number of abandons after threshold 4 (e.g., 60 seconds). */
    nbAbandonsAfterTS4 = "nbAbandonsAfterTS4",
    /** Percentage of abandons after threshold 4 (e.g., 60 seconds). */
    percentAbandonsAfterTS4 = "percentAbandonsAfterTS4",
    /** Total duration of call processing. */
    callProcTDur = "callProcTDur",
    /** Average duration of call processing. */
    callProcADur = "callProcADur",
    /** Total duration of greeting guide listening. */
    greetingListenTDur = "greetingListenTDur",
    /** Average duration of greeting guide listening. */
    greetingListenADur = "greetingListenADur",
    /** Total time before queuing. */
    beforeQueuingTDur = "beforeQueuingTDur",
    /** Total waiting duration of served calls. */
    waitServedCallsTDur = "waitServedCallsTDur",
    /** Average waiting duration of served calls. */
    waitServedCallsADur = "waitServedCallsADur",
    /** Total waiting duration of abandoned calls. */
    waitAbandonnedCallsTDur = "waitAbandonnedCallsTDur",
    /** Average waiting duration of abandoned calls. */
    waitAbandonnedCallsADur = "waitAbandonnedCallsADur",
    /** Total duration of ringing. */
    ringingTDur = "ringingTDur",
    /** Average duration of ringing. */
    ringingADur = "ringingADur",
    /** Total conversation duration. */
    convTDur = "convTDur",
    /** Average conversation duration. */
    convADur = "convADur",
    /** Total duration of hold calls. */
    holdCallsTDur = "holdCallsTDur",
    /** Average duration of hold calls. */
    holdCallsADur = "holdCallsADur",
    /** Total duration of wrap-up. */
    wrapupTDur = "wrapupTDur",
    /** Average duration of wrap-up. */
    wrapupADur = "wrapupADur",
    /** Longest waiting time observed. */
    longestWaitingDur = "longestWaitingDur",
    /** Service level achieved. */
    serviceLevel = "serviceLevel",
    /** Efficiency metric. */
    efficiency = "efficiency",
    /** Percent time in in-service state. */
    inServiceState = "inServiceState",
    /** Percent time in general forwarding state. */
    genFwdState = "genFwdState",
    /** Percent time in blocked state. */
    blockedState = "blockedState",
    /** Total number of received calls. */
    dnbTotReceivedCalls = "dnbTotReceivedCalls",
    /** All attributes included (for testing purposes). */
    ALL = "ALL"
}
//# sourceMappingURL=pilot-attributes.d.ts.map
import { AbstractFilter } from '../../internal/types/cc-stat/abstract-filter';
import { StatsPilotAttributes } from './pilot-attributes';
/**
 * Filter for selecting pilots in Call Center StatisticsData reports.
 *
 * A `PilotFilter` allows specifying which statistics to collect for pilots.
 *
 * Instances should be obtained via the `Filter.createPilotFilter()` factory method.
 * SDK users do not need to implement this interface directly.
 *
 * @since 2.7.4
 */
export interface PilotFilter extends AbstractFilter {
    /**
     * Returns the set of directory numbers associated with this filter.
     *
     * These numbers identify the pilots whose statistics should be collected.
     *
     * @returns a set of pilot directory numbers; never null, but may be empty
     */
    get numbers(): string[];
    /**
     * Adds one or more pilot directory numbers to this filter.
     *
     * Once added, the corresponding pilots will be included in the scope of
     * statistical reports.
     *
     * @param numbers an array of directory numbers to add; must not be null, though it may be empty
     */
    addNumbers(...numbers: string[]): void;
    /**
     * Returns the set of statistics attributes to collect for pilots.
     *
     * @returns a set of `PilotAttributes`
     */
    get pilotAttributes(): Set<StatsPilotAttributes>;
    /**
     * Sets the statistics attributes for pilots in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the pilot attributes to include
     */
    setPilotAttributes(...attributes: StatsPilotAttributes[]): void;
}
//# sourceMappingURL=pilot-filter.d.ts.map
import { Language } from './language';
/**
 * {@code Requester} represents an entity (typically a supervisor) that requests
 * statistics from the system. It encapsulates the requester's identifier,
 * preferred language, and time zone information.
 *
 * Instances of this interface are immutable once created.
 *
 * @since 2.7.4
 */
export interface Requester {
    /**
     * Returns the unique identifier of this requester.
     *
     * @returns The requester identifier
     */
    get id(): string;
    /**
     * Returns the preferred language of this requester.
     *
     * @returns The requester's language
     */
    get language(): Language;
    /**
     * Returns the time zone of this requester as a string representing
     * the UTC offset (e.g., "+02:00" or "-05:00").
     *
     * @returns The requester's time zone, or `null` if the stored value
     *          cannot be parsed into a valid time zone offset
     */
    get timezone(): string | null;
}
//# sourceMappingURL=requester.d.ts.map
import { DayOfWeek } from '../../common/day-of-week';
/**
 * Represents a recurrence schedule for a scheduled statistic report.
 *
 * This class allows specifying how often a scheduled report should be
 * generated: daily, weekly, or monthly. Instances are created using static
 * factory methods for clarity and safety.
 *
 * <b>Examples:</b>
 *
 * ```ts
 * const daily = Recurrence.daily();
 * const weekly = Recurrence.weekly(DayOfWeek.Monday, DayOfWeek.Friday);
 * const monthly = Recurrence.monthly(15); // on the 15th day of each month
 * ```
 *
 * @since 2.7.4
 */
export declare class Recurrence {
    #private;
    private constructor();
    /**
     * Creates a recurrence that occurs every day.
     */
    static daily(): Recurrence;
    /**
     * Creates a recurrence that occurs weekly on specific days.
     * @param days array of DayOfWeek representing the days of the week
     */
    static weekly(...days: DayOfWeek[]): Recurrence;
    /**
     * Creates a recurrence that occurs monthly on a specific day.
     * @param day the day of the month (1-31)
     */
    static monthly(day: number): Recurrence;
    /**
     * Checks if the recurrence is daily.
     */
    get daily(): boolean;
    /**
     * Checks if the recurrence is weekly.
     */
    get weekly(): boolean;
    /**
     * Checks if the recurrence is monthly.
     */
    get monthly(): boolean;
    /**
     * Returns the set of days in the week for weekly recurrence.
     * Only valid if isWeekly() returns true; otherwise, returns null.
     */
    get daysInWeek(): Set<DayOfWeek> | null;
    /**
     * Returns the day of the month for monthly recurrence.
     * Only valid if isMonthly() returns true; otherwise, returns -1.
     */
    get dayInMonth(): number | null;
}
/**
 * Namespace containing the Type enum for Recurrence.
 */
export declare namespace Recurrence {
    enum Type {
        DAILY = "DAILY",
        WEEKLY = "WEEKLY",
        MONTHLY = "MONTHLY"
    }
}
//# sourceMappingURL=recurrence.d.ts.map
/**
 * Represents an observation period used in a scheduled statistic request.
 *
 * This class allows specifying the time range over which statistics should be
 * collected or analyzed. Observation periods can be standard predefined periods
 * (current day, week, month, last N days/weeks, last month) or a custom date
 * range.
 *
 * Instances are created using static factory methods for clarity and safety.
 *
 * @since 2.7.4
 */
export declare class ReportObservationPeriod {
    #private;
    private constructor();
    /**
     * Creates an observation period for the current day.
     */
    static onCurrentDay(): ReportObservationPeriod;
    /**
     * Creates an observation period for the current week.
     */
    static onCurrentWeek(): ReportObservationPeriod;
    /**
     * Creates an observation period for the current month.
     */
    static onCurrentMonth(): ReportObservationPeriod;
    /**
     * Creates an observation period for the last N days.
     */
    static onLastDays(nbDays: number): ReportObservationPeriod;
    /**
     * Creates an observation period for the last N weeks.
     */
    static onLastWeeks(nbWeeks: number): ReportObservationPeriod;
    /**
     * Creates an observation period for the last month.
     */
    static onLastMonth(): ReportObservationPeriod;
    /**
     * Creates a custom observation period starting from a given date for a number of days.
     */
    static fromDate(from: Date, nbDays: number): ReportObservationPeriod;
    /**
     * Returns the type of the observation period.
     */
    get periodType(): ReportObservationPeriod.PeriodType;
    /**
     * Returns the number of units (days or weeks) for last-period types.
     */
    get lastUnits(): number | null;
    /**
     * Returns the start date of the observation period.
     * Only valid if the period type is FROM_DATE_TO_DATE.
     */
    get beginDate(): Date | null;
    /**
     * Returns the end date of the observation period.
     * Only valid if the period type is FROM_DATE_TO_DATE.
     */
    get endDate(): Date | null;
}
/**
 * Namespace containing the PeriodType enum.
 */
export declare namespace ReportObservationPeriod {
    /**
     * Defines the type of observation period.
     */
    enum PeriodType {
        /** The current day. */
        CURRENT_DAY = "currentDay",
        /** The current week. */
        CURRENT_WEEK = "currentWeek",
        /** The current month. */
        CURRENT_MONTH = "currentMonth",
        /** The last N days. */
        LAST_DAYS = "lastDays",
        /** The last N weeks. */
        LAST_WEEKS = "lastWeeks",
        /** The last month. */
        LAST_MONTHS = "lastMonth",
        /** A custom range defined by a start date and end date. */
        FROM_DATE_TO_DATE = "fromDateToDate"
    }
}
//# sourceMappingURL=report-obs-period.d.ts.map
import { StatsFormat } from '../stats-format';
import { StatsContext } from '../stats-context';
import { Recurrence } from './recurrence';
import { ReportObservationPeriod } from './report-obs-period';
/**
 * Represents a scheduled report in the system.
 * Instances of this interface define a report to be generated periodically or once,
 * along with its format, recipients, observation period, recurrence, and execution state.
 */
export interface ScheduledReport {
    /**
     * Returns the unique identifier of the scheduled report.
     *
     * @return the report ID
     */
    get id(): string;
    /**
     * Returns the description of the scheduled report.
     *
     * @return the report description
     */
    get description(): string;
    /**
     * Sets the description of the scheduled report.
     *
     * @param description the report description to set
     */
    set description(description: string);
    /**
     * Returns the observation period used by this scheduled report.
     *
     * @return the observation period
     */
    get observationPeriod(): ReportObservationPeriod;
    /**
     * Sets the observation period for this scheduled report.
     *
     * @param observationPeriod the observation period to set
     */
    set observationPeriod(observationPeriod: ReportObservationPeriod);
    /**
     * Returns the recurrence pattern for this report.
     *
     * @return the recurrence, or null if the report is executed only once
     */
    get recurrence(): Recurrence | null;
    /**
     * Sets the recurrence pattern for this report.
     *
     * @param recurrence the recurrence to set
     */
    set recurrence(recurrence: Recurrence | null);
    /**
     * Indicates whether this report is executed only once.
     *
     * @return true if the report is a one-time report, false if recurring
     */
    get once(): boolean;
    /**
     * Returns the output format of the report.
     *
     * @return the report format
     */
    get format(): StatsFormat;
    /**
     * Sets the output format of the report.
     *
     * @param format the format to set
     */
    set format(format: StatsFormat);
    /**
     * Returns the collection of recipients who will receive the report.
     * Each recipient is represented as an email address.
     *
     * @return a collection of email addresses of the report recipients
     */
    get recipients(): string[];
    /**
     * Sets the recipients of the scheduled report.
     *
     * @param recipients an array of email addresses
     */
    set recipients(recipients: string[]);
    /**
     * Returns the current state of the scheduled report.
     *
     * @return the report execution state
     */
    get state(): ScheduledReport.State;
    /**
     * Indicates whether the scheduled report is currently enabled.
     *
     * @return true if the report is enabled, false otherwise
     */
    get enabled(): boolean;
    /**
     * Returns the date and time when the report was last executed.
     *
     * @return the last execution date, or null if never executed
     */
    get lastExecutionDate(): Date | null;
    /**
     * Returns the context used to generate this scheduled report.
     *
     * @return the report execution context
     */
    get context(): StatsContext;
}
/**
 * Namespace for related types of ScheduledReport.
 * Contains enums and other nested types.
 */
export declare namespace ScheduledReport {
    /**
     * Enum representing the execution state of a scheduled report.
     */
    enum State {
        /** Report has not yet been executed. */
        NOT_EXECUTED = "Not_executed",
        /** Report has been executed successfully. */
        EXECUTED = "Executed",
        /** Execution failed during data retrieval. */
        FAILED_ON_GET_DATA = "Failed_On_Get_Data",
        /** Execution failed while sending the report via email. */
        FAILED_ON_SEND_MAIL = "Failed_On_Send_Mail",
        /** Report execution is currently in progress. */
        IN_PROGRESS = "In_progress",
        /** Scheduled report has expired and will no longer execute. */
        EXPIRED = "Expired"
    }
}
//# sourceMappingURL=scheduled-report.d.ts.map
import { StatsFilter } from './stats-filter';
/**
 * `StatContext` represents the configuration needed to retrieve a statistics report
 * from the Call Center Statistics Service.
 *
 * A context defines the parameters and metadata for generating a report, including:
 * - The objects to include in the report (e.g., CCD agents, CCD pilots).
 * - The counters or metrics for each category of object.
 * - Metadata such as label, description, requester, and scheduling information.
 *
 * Contexts are used to specify what data should be included in a report, how it should
 * be filtered, and how the report should be generated or scheduled.
 *
 * @since 2.7.4
 */
export interface StatsContext {
    /**
     * Returns the unique identifier of this context.
     * @returns The context identifier.
     */
    get id(): string;
    /**
     * Returns the identifier of the requester who owns this context.
     * @returns The requester identifier.
     */
    get requesterId(): string;
    /**
     * Returns the human-readable label of this context.
     * @returns The context label.
     */
    get label(): string | undefined;
    /**
     * Returns the description of this context.
     * @returns The context description.
     */
    get description(): string | undefined;
    /**
     * Indicates whether this context is associated with a scheduled report.
     * @returns `true` if the context is scheduled; otherwise `false`.
     */
    get scheduled(): boolean;
    /**
     * Returns the filter associated with this context.
     *
     * The filter specifies which objects (agents or pilots) and counters should
     * be included in the report.
     * @returns The associated filter.
     */
    get filter(): StatsFilter | null;
    /**
     * Sets the filter associated with this context.
     * @param filter - The filter to set.
     */
    set filter(filter: StatsFilter);
    /**
     * Sets the description of this context.
     * @param description - The description to set.
     */
    set description(description: string);
    /**
     * Sets the label of this context.
     * @param label - The label to set.
     */
    set label(label: string);
}
//# sourceMappingURL=stats-context.d.ts.map
import { AgentFilter } from './agent-filter';
import { PilotFilter } from './pilot-filter';
/**
 * Base interface for filters used in the Call Center StatisticsData SDK.
 *
 * A filter defines criteria for selecting objects (such as agents or pilots) to
 * include in statistical reports.
 *
 * This interface also serves as a factory for creating concrete filter
 * instances. Users can obtain pre-built filters without directly instantiating
 * the underlying classes:
 *
 * ```ts
 * const agentFilter = StatFilter.createAgentFilter();
 * const pilotFilter = StatFilter.createPilotFilter();
 * ```
 *
 * @since 2.7.4
 */
export declare abstract class StatsFilter {
    /**
     * Creates a new filter for selecting agents.
     *
     * @returns a new `AgentFilter` instance
     */
    static createAgentFilter(): AgentFilter;
    /**
     * Creates a new filter for selecting pilots.
     *
     * @returns a new `PilotFilter` instance
     */
    static createPilotFilter(): PilotFilter;
}
//# sourceMappingURL=stats-filter.d.ts.map
/**
 * Defines the available output formats for generated statistical reports.
 *
 * This enumeration specifies how the report data is represented when exported.
 * Supported formats include:
 * - `CSV` - Comma-separated values format, suitable for text processing and import into spreadsheets
 * - `EXCEL` - Microsoft Excel-compatible format (.xls)
 *
 * @since 2.7.4
 */
export declare enum StatsFormat {
    /** Comma-separated values format (.csv) */
    CSV = "csv",
    /** Microsoft Excel format (.xls) */
    EXCEL = "xls"
}
//# sourceMappingURL=stats-format.d.ts.map
/**
 * Represents fixed intervals of time in minutes.
 *
 * Each constant corresponds to a specific duration:
 * - {@link QUARTER_HOUR} - 15 minutes
 * - {@link HALF_HOUR} - 30 minutes
 * - {@link HOUR} - 60 minutes
 *
 * @since 2.7.4
 */
export declare enum TimeInterval {
    /** 15-minute interval */
    QUARTER_HOUR = "aQuarterOfAnHour",
    /** 30-minute interval */
    HALF_HOUR = "halfAnHour",
    /** 60-minute interval */
    HOUR = "anHour"
}
//# sourceMappingURL=time-interval.d.ts.map
import { ComRecord } from './com-record';
/**
 * Notification sent when a new communication log entry has been created.
 *
 * This event represents a single new record created for the user.
 */
export declare class OnComRecordCreated {
    #private;
    private constructor();
    /**
     * Gets the login name of the user for whom the communication log entry was created.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the created communication record.
     *
     * @returns The created {@link ComRecord}.
     */
    get record(): ComRecord;
}
/**
 * Notification sent when one or more communication log records have been modified.
 *
 * Modification can include changes such as:
 * - State changes (e.g., unanswered â†’ answered)
 * - Media list updates (e.g., IM and call in a conference)
 * - End date updates (e.g., participants dropped from a conference)
 */
export declare class OnComRecordModified {
    #private;
    private constructor();
    /**
     * Gets the login name of the user for whom the communication log entry was modified.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the modified communication record.
     *
     * @returns The modified {@link ComRecord}.
     */
    get record(): ComRecord;
}
/**
 * Notification sent when one or more unanswered communication log records have been acknowledged.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export declare class OnComRecordsAck {
    #private;
    private constructor();
    /**
     * Gets the login name of the user for whom the records were acknowledged.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the identifiers of the acknowledged communication log entries.
     *
     * @returns An array of acknowledged record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null;
}
/**
 * Notification sent when one or more unanswered communication log records have been deleted.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export declare class OnComRecordsDeleted {
    #private;
    private constructor();
    /**
     * Gets the login name of the user for whom the records were deleted.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the identifiers of the deleted communication log entries.
     *
     * @returns An array of deleted record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null;
}
/**
 * Notification sent when one or more previously unanswered communication log records have been unacknowledged.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export declare class OnComRecordsUnAck {
    #private;
    private constructor();
    /**
     * Gets the login name of the user for whom the records were unacknowledged.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the identifiers of the unacknowledged communication log entries.
     *
     * @returns An array of unacknowledged record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null;
}
//# sourceMappingURL=comlog-events.d.ts.map
import { CorrelatorData } from '../telephony/call/correlator-data';
import { ComRecordParticipant } from './com-record-participant';
/**
 * Represents a communication record, which is a call history entry stored
 * for each conversation.
 *
 * Each record contains information about the call, including its unique
 * identifier, reference, participants, timestamps, and acknowledgment status.
 *
 * A record may represent an incoming or outgoing call, and includes details
 * such as the start and end times, as well as the conversation time
 * when the call was answered.
 */
export declare class ComRecord {
    #private;
    /**
     * Protected constructor for internal use and deserialization.
     */
    private constructor();
    /**
     * Returns the unique identifier of this communication record.
     *
     * @returns The record ID.
     */
    get id(): number;
    /**
     * Returns the reference of the call that created this communication record.
     *
     * @returns The call reference.
     */
    get comRef(): string;
    /**
     * Indicates whether this communication record has been acknowledged.
     *
     * Only missed incoming calls can have this flag set to `true`.
     *
     * @returns `true` if the call has been acknowledged; `false` otherwise.
     */
    get acknowledged(): boolean;
    /**
     * Returns the collection of participants in this communication record.
     *
     * @returns An array of `ComRecordParticipant` objects representing all
     *          participants in the call.
     */
    get participants(): ComRecordParticipant[] | null;
    /**
     * Returns the start date and time of this call.
     *
     * @returns The call start date.
     */
    get beginDate(): Date | null;
    /**
     * Returns the end date and time of this call.
     *
     * @returns The call end date.
     */
    get endDate(): Date | null;
    /**
     * Returns the date and time when the call was answered.
     *
     * For missed calls, this value may be `null`.
     *
     * @returns The conversation date.
     * @since 2.6
     */
    get convDate(): Date | null;
    /**
     * Returns the duration this call has been on hold.
     *
     * @returns The hold duration in milliseconds (or seconds depending on your backend).
     * @since 2.7.4
     */
    get holdDuration(): number;
    /**
     * Returns the number of the user who performed the transfer for this call,
     * if the call has been transferred.
     *
     * This value may be `null` if the call has not been transferred.
     *
     * @returns The number of the user who transferred the call, or `null` if
     *          no transfer occurred.
     * @since 2.7.4
     */
    get transferredBy(): string | null;
    /**
     * Returns the correlator data associated with this call, if present.
     *
     * This method may return `null` if no correlator data is associated
     * with the call.
     *
     * @returns The `CorrelatorData` associated with this call, or `null` if none is present.
     * @since 2.7.4
     */
    get correlatorData(): CorrelatorData | null;
}
//# sourceMappingURL=com-record.d.ts.map
import { PartyInfo } from '../common/party-info';
import { Reason } from './reason';
import { Role } from './role';
/**
 * Represents a participant referenced in a communication record (com record).
 *
 * <b>Record Content:</b>
 *
 * <b>Simple call</b> (user A calls user B): the call record on each participant's side
 * will include both participants, though the order is not guaranteed between successive responses.
 *
 * <b>Re-routed call</b> (user A -> B, rerouted to C due to overflow, redirection, or pickup):
 * participant records reflect the rerouting, including the initially called party.
 *
 * <b>Multi-party calls:</b> Participants added during the call will appear in records
 * of already connected users. Their `answered` status indicates whether they accepted or declined the call.
 *
 * <b>Participant Identification:</b>
 * - In comlog notification events, the participant owner is identified by `loginName` only.
 * - Other participants include full identity (`loginName`, `phoneNumber`).
 * - In `QueryResult`:
 *   - If no optimization is requested, all participants use full identity.
 *   - If `optimized=true`, only the first occurrence uses full identity; subsequent ones use only phone numbers.
 */
export declare class ComRecordParticipant {
    #private;
    private constructor();
    /**
     * Returns this participant's role in the communication.
     *
     * @returns The role of the participant.
     */
    get role(): Role | null;
    /**
     * Returns whether this participant answered the call.
     *
     * @returns `true` if answered, `false` if not, or `false` if unknown.
     */
    get answered(): boolean;
    /**
     * Returns the participant's identity.
     *
     * @returns The `PartyInfo` representing this participant.
     */
    get identity(): PartyInfo;
    /**
     * Indicates if the participant is anonymous.
     *
     * @returns `true` if anonymous; `false` otherwise.
     */
    get anonymous(): boolean;
    /**
     * Returns the number that was initially called when this participant joined the call.
     *
     * @returns The initial called `PartyInfo`, or `null` if not applicable.
     */
    get initialCalled(): PartyInfo | null;
    /**
     * Returns the reason for the call being established, rerouted, or terminated.
     *
     * @returns The `Reason` for this participant in the call. Defaults to `Reason.UNKNOWN` if not set.
     */
    get reason(): Reason;
    /**
     * Returns the device leg involved in the call.
     *
     * Typically set when the main device is not a participant in the call.
     * May return `null` if the main device is present or leg is not set.
     *
     * @returns The device leg as a string, or `null` if none is present.
     * @since 2.7.4
     */
    get leg(): string | null;
}
//# sourceMappingURL=com-record-participant.d.ts.map
/**
 * Option enum defines the possible filter option when querying a communication log.
 * It's possible to combine the options:
 * @example
 * ```typescript
 * let options = Option.UNANSWERED | Option.UNACKNOWLEDGED
 * ```
 * @see {@link QueryFilter}
 */
export declare enum FilterOption {
    /**
     * The default value that represents no filtering.
     */
    ONE = 0,
    /**
     * Use this value to filter unanswered calls.
     */
    UNANSWERED = 1,
    /**
     * Use this value to filter unacknowledged calls.
     */
    UNACKNOWLEDGED = 2
}
//# sourceMappingURL=filter-option.d.ts.map
/**
 * The Page class allows to define a paging mechanism to query the
 * communication log.
 * @see {@link CommunicationLog.getComRecords}
 */
export declare class Page {
    private _offset;
    private _limit;
    /**
     * Constructs a new Page starting with the specified offset and with the
     * specified length.
     *
     * @param offset the page offset
     * @param length  the page length
     */
    constructor(offset: number, limit: number);
    /**
     * Moves to the next page.
     */
    next(): void;
    /**
     * Moves to the previous page.
     */
    previous(): void;
    /**
     * Returns the offset of the page that is the offset of the first com record.
     */
    get offset(): number;
    /**
     * Returns the maximum number of record in this page.
     */
    get limit(): number;
}
//# sourceMappingURL=page.d.ts.map
import { FilterOption } from './filter-option';
import { Role } from './role';
/**
 * Represents a filter used to query communication log records.
 * <p>
 * This filter can be applied when retrieving records via
 * {@link CommunicationLog.getComRecords}. All parameters are optional â€”
 * omitted parameters are not applied to the query.
 * <p>
 * The filter allows specifying:
 * <ul>
 *   <li>a date range (`after` / `before`)</li>
 *   <li>a call reference</li>
 *   <li>a remote party identifier</li>
 *   <li>a participant role</li>
 *   <li>additional search options (e.g. unanswered calls)</li>
 * </ul>
 *
 * @example
 * ```typescript
 * // Filter unanswered records in January 2026
 * const filter = new QueryFilter({
 *     after: new Date('2026-01-01'),
 *     before: new Date('2026-01-31'),
 *     options: [FilterOption.UNANSWERED]
 * });
 *
 * const result = await O2G.comlog.getComRecords(filter);
 *
 * // Filter by call reference and role
 * const filter2 = new QueryFilter({
 *     callRef: '12345',
 *     role: Role.CALLER
 * });
 * ```
 *
 * @see CommunicationLog.getComRecords
 */
export declare class QueryFilter {
    #private;
    /**
     * Creates a new `QueryFilter`.
     *
     * @param params optional filter parameters
     */
    constructor(params: {
        after?: Date;
        before?: Date;
        options?: Set<FilterOption> | FilterOption[];
        callRef?: string;
        remotePartyId?: string;
        role?: Role;
    });
    /**
     * The start date of the query filter â€” records created after this date are included.
     */
    get after(): Date | null;
    /**
     * The end date of the query filter â€” records created before this date are included.
     */
    get before(): Date | null;
    /**
     * The set of filter options applied to the query (e.g. unanswered calls only).
     */
    get options(): ReadonlySet<FilterOption>;
    /**
     * The call reference used for filtering.
     */
    get callRef(): string | null;
    /**
     * The remote party identifier used for filtering.
     */
    get remotePartyId(): string | null;
    /**
     * The participant role used for filtering.
     */
    get role(): Role;
}
//# sourceMappingURL=query-filter.d.ts.map
import { ComRecord } from './com-record';
import { Page } from './page';
/**
 * {@code QueryResult} represents the result of a communication log query.
 *
 * Instances of this class contain the records returned by a query, along with
 * paging information and the total count of matching records.
 *
 * The associated {@link Page} object provides details about the current page,
 * including the offset and limit, and can be used to navigate through pages
 * of results.
 *
 * Each {@code QueryResult} contains:
 * - The total number of records matching the query (`count`)
 * - Paging information for the current result set (`page`)
 * - The list of communication records (`records`)
 *
 * <p><b>Usage example:</b></p>
 *
 * ```ts
 * const result: QueryResult = QueryResult.fromJson(rawJson);
 *
 * console.log(result.count);     // total number of matching records
 * console.log(result.page.offset); // current page offset
 * console.log(result.records);   // array of ComRecord objects
 * ```
 *
 * <p>
 * Instances are immutable. The `fromJson` static method should be used
 * to create a `QueryResult` from raw JSON returned by the O2G API.
 * </p>
 *
 * @see CommunicationLogService#getComRecords
 */
export declare class QueryResult {
    #private;
    /**
     * Returns the total number of records in this result.
     *
     * @return the number of records
     */
    get count(): number;
    /**
     * Returns the page information associated with this result.
     * <p>
     * The {@link Page} object provides the offset and limit used to retrieve
     * this set of records and can be used to navigate through the pages.
     *
     * @return the page
     */
    get page(): Page;
    /** Gets the list of communication records returned by the query. */
    get records(): ComRecord[];
}
//# sourceMappingURL=query-result.d.ts.map
/**
 * Reason enum defines the why reason the communication has been released, established or rerouted.
 */
export declare enum Reason {
    /**
     * The call was abandonned because there was no Available trunk.
     */
    ALL_TRUNK_BUSY = "ALL_TRUNK_BUSY",
    /**
     * The call was refused because the dialed number is not valid.
     */
    INVALID_NUMBER = "INVALID_NUMBER",
    /**
     * The call was canceled by the caller.
     */
    ABANDONED = "ABANDONED",
    /**
     * The call failed because the called party is busy.
     */
    BUSY = "BUSY",
    /**
     * The call was set to be a conference.
     */
    CONFERENCED = "CONFERENCED",
    /**
     * he call was picked up.
     */
    PICKUP = "PICKUP",
    /**
     * The call was forwarded to another destination.
     */
    FORWARDED = "FORWARDED",
    /**
     * The call was redirected to another destination.
     */
    REDIRECTED = "REDIRECTED",
    /**
     * The call was released since redirection to another destination fails.
     */
    RELEASED_ON_REDIRECT = "RELEASED_ON_REDIRECT",
    /**
     * The call was transferred.
     */
    TRANSFERRED = "TRANSFERRED",
    /**
     * The call was released since transfer to another destination fails.
     */
    RELEASED_ON_TRANSFER = "RELEASED_ON_TRANSFER",
    /**
     * The call ended on voicemail.
     */
    VOICEMAIL = "VOICEMAIL",
    /**
     * The call normally ended.
     */
    NORMAL = "NORMAL",
    /**
     * The reason is unknown.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=reason.d.ts.map
/**
 * Role defines the roles a participant can have in a com record.
 */
export declare enum Role {
    /**
     * The participant is a caller party.
     */
    CALLER = "CALLER",
    /**
     * The participant is a called party.
     */
    CALLEE = "CALLEE",
    /**
     * The role is unknown.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=role.d.ts.map
/**
 * DateRange represents an interval between two dates.
 */
export declare class DateRange {
    #private;
    /**
     * Constructs a new DateRange, with the specified "from" date and "to" date.
     * @param from the beginning of the range
     * @param to the end of the range
     */
    constructor(from: Date, to: Date);
    /** Returns the "from" date. */
    get from(): Date;
    /** Returns the "to" date. */
    get to(): Date;
}
//# sourceMappingURL=date-range.d.ts.map
import { DayOfWeekJson } from '../../internal/types/common/common-types';
/**
 * Defines the day of a week.
 */
export declare enum DayOfWeek {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare namespace DayOfWeek {
    /**
     * Converts a JSON enum to DayOfWeek enum
     */
    function fromJson(value: DayOfWeekJson): DayOfWeek;
    /**
     * Converts a DayOfWeek enum to JSON enum
     */
    function toJson(value: DayOfWeek): DayOfWeekJson;
}
//# sourceMappingURL=day-of-week.d.ts.map
import { DeviceType } from './device-type';
/**
 * Represents a telephony device for a user.
 */
export declare class Device {
    #private;
    /**
     * Private constructor. Use `Device.fromJson()` to create instances.
     * @param type - The device type
     * @param id - The device identifier
     * @param subType - Optional device sub-type
     */
    private constructor();
    /** Get the device type */
    get type(): DeviceType | null;
    /** Get the device identifier */
    get id(): string | null;
    /** Get the device sub-type, if any */
    get subType(): string | null;
}
/**
 * Namespace for device-related types.
 */
export declare namespace Device {
    /**
     * Represents the capabilities of a device.
     *
     * Each device has a unique `deviceId` and may support various telephony
     * operations, such as making calls, business calls, private calls, or
     * unparking calls. Use `Capabilities.fromJson()` to create instances
     * from JSON data.
     */
    class Capabilities {
        #private;
        /**
         * Private constructor. Use `Capabilities.fromJson()` to create instances.
         *
         * @param deviceId - The unique identifier of the device
         * @param makeCall - Whether the device can make a call
         * @param makeBusinessCall - Whether the device can make a business call
         * @param makePrivateCall - Whether the device can make a private call
         * @param unParkCall - Whether the device can unpark a call
         */
        private constructor();
        /**
         * Returns the unique identifier of the device.
         */
        get deviceId(): string;
        /**
         * Indicates whether the device can make a regular call.
         *
         * @returns `true` if the device can make calls; otherwise `false` (default `false`)
         */
        get canMakeCall(): boolean;
        /**
         * Indicates whether the device can make a business call.
         *
         * @returns `true` if the device can make business calls; otherwise `false` (default `false`)
         */
        get canMakeBusinessCall(): boolean;
        /**
         * Indicates whether the device can make a private call.
         *
         * @returns `true` if the device can make private calls; otherwise `false` (default `false`)
         */
        get canMakePrivateCall(): boolean;
        /**
         * Indicates whether the device can unpark a call.
         *
         * @returns `true` if the device can unpark calls; otherwise `false` (default `false`)
         */
        get canUnParkCall(): boolean;
    }
}
//# sourceMappingURL=device.d.ts.map
/**
 * Define the device type
 */
export declare enum DeviceType {
    /**
     * The device is a DECT device
     */
    DECT = "DECT",
    /**
     * The device is a deskphone
     */
    DESKPHONE = "DESKPHONE",
    /**
     * The device is a mobile device
     */
    MOBILE = "MOBILE",
    /**
     * The device is a softphone
     */
    SOFTPHONE = "SOFTPHONE"
}
//# sourceMappingURL=device-type.d.ts.map
/**
 * Represents the information used to uniquely identify a participant; either the login name or the phone number.
 */
export declare class Identifier {
    #private;
    private constructor();
    /**
     * Returns the login name of the participant.
     *
     * @return the login name, or {@code null} if not available
     */
    get loginName(): string | null;
    /**
     * Returns the phone number of the participant.
     *
     * @return the phone number, or {@code null} if not available
     */
    get phoneNumber(): string | null;
}
//# sourceMappingURL=identifier.d.ts.map
/**
 * MainType represents the main type a participant can be.
 */
export declare enum MainType {
    /**
     * The participant is a user of the system.
     */
    USER = "USER",
    /**
     * The participant is a device of the system.
     */
    DEVICE = "DEVICE",
    /**
     * The participant is a service of the system. For exemple the voice mail.
     */
    SERVICE = "SERVICE",
    /**
     * The participant is not a user of the system.
     */
    EXTERNAL = "EXTERNAL",
    /**
     * The participant type has not been identified.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=main-type.d.ts.map
import { Identifier } from './identifier';
import { PartyInfoType } from './party-info-type';
/**
 * Represents a party involved in a call.
 */
export declare class PartyInfo {
    #private;
    /**
     * Private constructor. Use `PartyInfo.fromJson()` to create instances.
     * @param id - Participant identifier
     * @param firstName - First name
     * @param lastName - Last name
     * @param displayName - Display name
     * @param type - Participant type
     */
    private constructor();
    /** Get the participant identifier */
    get id(): Identifier;
    /** Get the participant's first name */
    get firstName(): string | null;
    /** Get the participant's last name */
    get lastName(): string | null;
    /** Get the participant's display name */
    get displayName(): string | null;
    /** Get the participant's type */
    get type(): PartyInfoType | null;
}
//# sourceMappingURL=party-info.d.ts.map
import { MainType } from './main-type';
/**
 * Represents the type of a party in a call, composed of a main type and an
 * optional sub-type.
 * <p>
 * Available via {@link PartyInfo.type} on call participants and party information.
 *
 * @see PartyInfo
 */
export declare class PartyInfoType {
    #private;
    /**
     * The main type of this party.
     */
    get main(): MainType;
    /**
     * The sub-type of this party, providing additional classification.
     * `null` if no sub-type is defined.
     */
    get subType(): string | null;
}
//# sourceMappingURL=party-info-type.d.ts.map
/**
 * ServiceState represents the possible operational states of a CCD entity,
 * such as a pilot, queue, or processing group.
 *
 * The service state indicates whether the entity is available to handle calls or
 * otherwise engaged.
 *
 * @since 2.7.4
 */
export declare enum ServiceState {
    /** The service is closed and not available for call handling. */
    Closed = "Closed",
    /** The service is opened and available to handle calls. */
    Opened = "Opened",
    /** The service is blocked and temporarily unavailable. */
    Blocked = "Blocked",
    /** The state of the service is unknown. */
    Unknown = "unknown"
}
//# sourceMappingURL=service-state.d.ts.map
import { FilterItem } from './filter-item';
import { OperationFilter } from './operation-filter';
/**
 * Represents a filter criteria to apply on a directory search.
 *
 * A simple criteria is a tuple of the form: `[Attribute, Operation, Value]`.
 * Example: `[LAST_NAME, BEGINS_WITH, "fr"]`.
 *
 * A `Criteria` can also be a logical combination (AND / OR) of multiple other `Criteria` objects.
 *
 * ## Acceptable values for attributes
 * | Value        | Description         |
 * |--------------|---------------------|
 * | LAST_NAME    | The last name       |
 * | FIRST_NAME   | The first name      |
 * | LOGIN_NAME   | The login name      |
 * | PHONE_NUMBER | The phone number    |
 *
 * ## Acceptable values for operations
 * | Value            | Description                                         |
 * |------------------|-----------------------------------------------------|
 * | BEGINS_WITH      | Attribute must begin with the given value           |
 * | ENDS_WITH        | Attribute must end with the given value             |
 * | CONTAINS         | Attribute must contain the given value              |
 * | EQUAL_IGNORE_CASE| Attribute equals the value (case-insensitive)       |
 *
 * ## Examples
 * ```ts
 * // Search users whose last name begins with 'b'
 * const criteria = Criteria.create(
 *     FilterItem.LAST_NAME,
 *     OperationFilter.BEGINS_WITH,
 *     'b'
 * );
 *
 * // Search users whose last name begins with 'b' AND first name contains 'ja'
 * const criteria2 = Criteria.and(
 *     Criteria.create(
 *         FilterItem.LAST_NAME,
 *         OperationFilter.BEGINS_WITH,
 *         'b'
 *     ),
 *     Criteria.create(
 *         FilterItem.FIRST_NAME,
 *         OperationFilter.CONTAINS,
 *         'ja'
 *     )
 * );
 * ```
 */
export declare class Criteria {
    #private;
    /**
     * Creates a new search `Criteria` with the specified attribute, operation, and value.
     *
     * @param field - The attribute to filter
     * @param operation - The operation to apply
     * @param value - The value to match
     * @returns A new `Criteria` instance
     */
    static create(field: FilterItem, operation: OperationFilter, value: string): Criteria;
    /**
     * Creates a `Criteria` that is the logical OR of multiple criteria.
     *
     * @param criterias - One or more `Criteria` objects
     * @returns A new `Criteria` representing the OR combination
     */
    static or(...criterias: Criteria[]): Criteria;
    /**
     * Creates a `Criteria` that is the logical AND of multiple criteria.
     *
     * @param criterias - One or more `Criteria` objects
     * @returns A new `Criteria` representing the AND combination
     */
    static and(...criterias: Criteria[]): Criteria;
    /**
     * Returns the operation of this filter.
     *
     * @returns The operation as a string (or "AND"/"OR" for logical combinations)
     */
    get operation(): string;
    /**
     * Returns the field of this filter.
     *
     * @returns The field as a string, or `null` for logical combinations
     */
    get field(): string | null;
    /**
     * Returns the operand of this `Criteria`.
     *
     * @returns The operand value (`string` for single filters, `Criteria[]` for logical combinations)
     */
    get operand(): string | Criteria[];
}
//# sourceMappingURL=criteria.d.ts.map
/**
 * FilterItem represents the attributes that can be used to filter a directory search.
 */
export declare enum FilterItem {
    /**
     * The last name.
     */
    LAST_NAME = "lastName",
    /**
     * The first name.
     */
    FIRST_NAME = "firstName",
    /**
     * The phone number.
     */
    PHONE_NUMBER = "id.phoneNumber",
    /**
     * The login name.
     */
    LOGIN_NAME = "id.loginName"
}
//# sourceMappingURL=filter-item.d.ts.map
/**
 * LogicalOperation represents a logical operation AND or OR.
 */
export declare enum LogicalOperation {
    /**
     * The OR logica operation
     */
    OR = "OR",
    /**
     * The AND logical operation
     */
    AND = "AND"
}
//# sourceMappingURL=logical-operation.d.ts.map
/**
 * OperationFilter represents the operation that can be used to filter a directory search.
 */
export declare enum OperationFilter {
    /**
     * The attribute and the given value are equals (case insensitive).
     */
    EQUAL_IGNORE_CASE = "EQUAL_IGNORE_CASE",
    /**
     * The attribute begins with the value.
     */
    BEGINS_WITH = "BEGIN_WITH",
    /**
     * The attribute contains the value.
     */
    CONTAINS = "CONTAIN",
    /**
     * The attribute ends with the value.
     */
    ENDS_WITH = "END_WITH"
}
//# sourceMappingURL=operation-filter.d.ts.map
import { PartyInfo } from '../common/party-info';
/**
 * Represents a single batch of contacts returned from a directory search.
 *
 * Each `ResultItem` contains a collection of `PartyInfo` objects representing
 * the contacts found in that batch.
 *
 */
export declare class ResultItem {
    #private;
    private constructor();
    /**
     * Returns the contacts found in this batch.
     *
     * The returned array is read-only. Modifying the array directly will not
     * affect the internal state of the `ResultItem`.
     *
     * @returns A read-only array of `PartyInfo` objects, or `null` if no contacts are available.
     */
    get contacts(): ReadonlyArray<PartyInfo> | null;
}
//# sourceMappingURL=result-item.d.ts.map
import { ResultItem } from './result-item';
/**
 * Represents the outcome of a directory search performed via the `DirectoryService`.
 *
 * A search may return multiple batches of results. Each batch contains a set of
 * contacts along with a status code indicating the current state of the search.
 *
 * ## Example usage
 * ```ts
 * const searchResult = SearchResult.fromJson(jsonData);
 * console.log(searchResult.resultCode);
 * console.log(searchResult.resultElements);
 * ```
 */
export declare class SearchResult {
    #private;
    private constructor();
    /**
     * Returns the status code of this search result.
     *
     * The status code indicates whether more results are available or if the
     * search is complete.
     *
     * @returns The `SearchStatus` of this search result, or `null` if unavailable.
     */
    get status(): SearchResult.Status | null;
    /**
     * Returns the list of result items from the search.
     *
     * Each element in the array corresponds to a `ResultItem`, which contains
     * contact information returned by the search.
     *
     * @returns An array of `ResultItem` objects, or `null` if no results are present.
     */
    get items(): ResultItem[] | null;
}
export declare namespace SearchResult {
    /**
     * Code represents the status of a directory search. Each time a call to
     * {@link Directory.getResults} is done, the returned result code must be
     * tested.
     */
    enum Status {
        /**
         * Responses are provided this time. Continue to invoking
         * {@linkplain Directory.getResults} periodically to get the next results.
         */
        OK = "OK",
        /**
         * No response received. Continue to invoking
         * {@link Directory.getResults} to get more results.
         */
        NOK = "NOK",
        /**
         * Search is finished.
         */
        FINISH = "FINISH",
        /**
         * Search is ended for timeout reason.
         */
        TIMEOUT = "TIMEOUT"
    }
}
//# sourceMappingURL=search-result.d.ts.map
import { OnAcdStatsProgress } from '../../internal/types/cc-stat/on-stats-progress';
import { OnAgentSkillChanged, OnAgentStateChanged, OnSupervisorHelpCancelled, OnSupervisorHelpRequested } from '../cc-agent/cc-agent-events';
import { OnPilotCallCreated, OnPilotCallQueued, OnPilotCallRemoved } from '../cc-pilot/cc-pilot-events';
import { OnAgentProcessingGroupRtiChanged, OnAgentRtiChanged, OnOtherProcessingGroupRtiChanged, OnPilotRtiChanged, OnQueueRtiChanged } from '../cc-rt/cc-rt-events';
import { OnComRecordCreated, OnComRecordModified, OnComRecordsAck, OnComRecordsDeleted, OnComRecordsUnAck } from '../comlog/comlog-events';
import { OnEventSummaryUpdated } from '../eventsummary/event-summary-events';
import { OnCtiLinkUp, OnCtiLinkDown, OnLicenseExpiration, OnPbxLoaded, OnServerStart, OnPbxLinkDown, OnPbxLinkUp } from '../maint/maint-events';
import { OnPbxObjectInstanceCreated, OnPbxObjectInstanceDeleted, OnPbxObjectInstanceModified } from '../pbxmngt/pbxmngt-events';
import { OnRoutingStateChanged } from '../routing/routing-events';
import { OnToneGeneratedStart, OnToneGeneratedStop, OnDigitCollected, OnRouteRequest, OnRouteEnd } from '../rsi/rsi-events';
import { OnCallCreated, OnCallModified, OnCallRemoved, OnDeviceStateModified, OnDynamicStateChanged, OnTelephonyState, OnUserStateModified } from '../telephony/telephony-events';
import { OnUserCreated, OnUserInfoChanged, OnUserDeleted } from '../users/users-events';
/**
 * Event emitted when an event occurs related to the event channel.
 *
 * This event provides textual information about the channel activity,
 * which can be used for logging, monitoring, or triggering business logic.
 */
export declare class OnChannelInformation {
    #private;
    private constructor();
    /**
     * Gets the textual information for this channel event.
     *
     * @returns The channel information as a string.
     */
    get text(): string;
}
export interface EventMap {
    OnChannelInformation: OnChannelInformation;
    OnEventSummaryUpdated: OnEventSummaryUpdated;
    OnUserCreated: OnUserCreated;
    OnUserInfoChanged: OnUserInfoChanged;
    OnUserDeleted: OnUserDeleted;
    OnCallCreated: OnCallCreated;
    OnCallModified: OnCallModified;
    OnCallRemoved: OnCallRemoved;
    OnDeviceStateModified: OnDeviceStateModified;
    OnDynamicStateChanged: OnDynamicStateChanged;
    OnTelephonyState: OnTelephonyState;
    OnUserStateModified: OnUserStateModified;
    OnRoutingStateChanged: OnRoutingStateChanged;
    OnComRecordCreated: OnComRecordCreated;
    OnComRecordModified: OnComRecordModified;
    OnComRecordsDeleted: OnComRecordsDeleted;
    OnComRecordsAck: OnComRecordsAck;
    OnComRecordsUnAck: OnComRecordsUnAck;
    OnPbxLinkUp: OnPbxLinkUp;
    OnPbxLinkDown: OnPbxLinkDown;
    OnCtiLinkUp: OnCtiLinkUp;
    OnCtiLinkDown: OnCtiLinkDown;
    OnLicenseExpiration: OnLicenseExpiration;
    OnPbxLoaded: OnPbxLoaded;
    OnServerStart: OnServerStart;
    OnPbxObjectInstanceCreated: OnPbxObjectInstanceCreated;
    OnPbxObjectInstanceDeleted: OnPbxObjectInstanceDeleted;
    OnPbxObjectInstanceModified: OnPbxObjectInstanceModified;
    OnAgentSkillChanged: OnAgentSkillChanged;
    OnAgentStateChanged: OnAgentStateChanged;
    OnSupervisorHelpCancelled: OnSupervisorHelpCancelled;
    OnSupervisorHelpRequested: OnSupervisorHelpRequested;
    OnPilotCallCreated: OnPilotCallCreated;
    OnPilotCallQueued: OnPilotCallQueued;
    OnPilotCallRemoved: OnPilotCallRemoved;
    OnAgentRtiChanged: OnAgentRtiChanged;
    OnPGAgentRtiChanged: OnAgentProcessingGroupRtiChanged;
    OnPGOtherRtiChanged: OnOtherProcessingGroupRtiChanged;
    OnPilotRtiChanged: OnPilotRtiChanged;
    OnQueueRtiChanged: OnQueueRtiChanged;
    OnAcdStatsProgress: OnAcdStatsProgress;
    OnToneGeneratedStart: OnToneGeneratedStart;
    OnToneGeneratedStop: OnToneGeneratedStop;
    OnDigitCollected: OnDigitCollected;
    OnRouteRequest: OnRouteRequest;
    OnRouteEnd: OnRouteEnd;
}
//# sourceMappingURL=events.d.ts.map
/**
 * EventSummaryCounters represents event counters associated with a user.
 * It provides access to counts of missed calls, voice messages, callback requests,
 * faxes, new and old text messages, and indicates whether an event is waiting.
 */
export declare class EventSummaryCounters {
    #private;
    private constructor();
    /**
     * Get the number of missed calls.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     * <b>Note:</b> This counter reflects unanswered and non-acknowledged incoming calls in the history.
     * Only explicit acknowledgment via the communication log API or a new answered call decreases this counter.
     * Successive attempts from the same caller also increment the counter.
     *
     * @returns {number} Number of missed calls (0 if unspecified)
     */
    get missedCallsCount(): number;
    /**
     * Get the number of new voice messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of new voice messages (0 if unspecified)
     */
    get voiceMessagesCount(): number;
    /**
     * Get the number of new callback requests.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of callback requests (0 if unspecified)
     */
    get callBackRequestsCount(): number;
    /**
     * Get the number of new faxes.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of faxes (0 if unspecified)
     */
    get faxCount(): number;
    /**
     * Get the number of new text messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of new text messages (0 if unspecified)
     */
    get newTextMessageCount(): number;
    /**
     * Get the number of old text messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of old text messages (0 if unspecified)
     */
    get oldTextMessageCount(): number;
    /**
     * Indicates whether an event is waiting.
     *
     * <p>This flag can be used to notify the application that new events are waiting.
     *
     * @returns {boolean} True if an event is waiting, false otherwise
     */
    get eventWaiting(): boolean;
}
//# sourceMappingURL=event-summary-counter.d.ts.map
import { EventSummaryCounters } from './event-summary-counter';
/**
 * Notification sent whenever a user's event counters have changed.
 *
 * This event is typically emitted to reflect updated counters for the user,
 * such as calls, messages, or other activity tracked in the system.
 */
export declare class OnEventSummaryUpdated {
    #private;
    private constructor();
    /**
     * Gets the login name of the user whose counters were updated.
     *
     * This identifier can be used for filtering events for a specific user.
     *
     * @returns The user's login name.
     */
    get loginName(): string;
    /**
     * Gets the updated event summary counters for the user.
     *
     * @returns An {@link EventSummaryCounters} instance representing the new counters.
     */
    get eventSummary(): EventSummaryCounters;
}
//# sourceMappingURL=event-summary-events.d.ts.map
/**
 * ConfigurationType represents the possible O2G server configurations.
 */
export declare enum ConfigurationType {
    /**
     * O2G Server is configured for management. An O2G server configured for
     * management does not monitor devices on the OmniPCX Enterprise.
     */
    PBX_MANAGEMENT = "PBX_MANAGEMENT",
    /**
     * O2G Server is configured with full services.
     */
    FULL_SERVICES = "FULL_SERVICES"
}
//# sourceMappingURL=configuration-type.d.ts.map
/**
 * CTILinkState represents the differents possible states of the CTI
 * link between OmniPCX Enterprise and O2G server.
 */
export declare enum CTILinkState {
    /**
     * CTI Link is established with the main OmniPCX Enterprise call server.
     */
    CONNECTED_MAIN = "CONNECTED_MAIN",
    /**
     * CTI Link is established with the standby OmniPCX Enterprise call server.
     */
    CONNECTED_SECONDARY = "CONNECTED_SECONDARY",
    /**
     * CTI Link is not established.
     */
    DISCONNECTED = "DISCONNECTED"
}
//# sourceMappingURL=cti-link-state.d.ts.map
/**
 * Represents a license in the O2G system.
 *
 * Includes the license name, total available licenses, the number currently used,
 * and the license expiration date.
 */
export declare class License {
    #private;
    /**
     * Creates a License instance.
     * @param name - License name
     * @param total - Total number of licenses
     * @param currentUsed - Number of licenses currently in use
     * @param expiration - Expiration date of the license
     */
    private constructor();
    /**
     * License name
     * @returns {string | null} The license name, or null if not set
     */
    get name(): string | null;
    /**
     * Total number of licenses
     * @returns {number} Total licenses (defaults to 0 if not set)
     */
    get total(): number;
    /**
     * Number of licenses currently used
     * @returns {number} Currently used licenses (defaults to 0 if not set)
     */
    get currentUsed(): number;
    /**
     * License expiration date
     * @returns {Date | null} Expiration date, or null if not set
     */
    get expiration(): Date | null;
}
//# sourceMappingURL=license.d.ts.map
import { License } from './license';
import { LicenseType } from './license-type';
/**
 * Represents the license status of the O2G server.
 *
 * Contains information about the license type, context, the current server,
 * overall status, detailed status message, and the list of individual licenses.
 */
export declare class LicenseStatus {
    #private;
    /**
     * Type of license control (e.g., FLEXLM or LMS).
     * @returns {LicenseType | null} The license type or null if not set
     */
    get type(): LicenseType | null;
    /**
     * Context or scope of the license.
     * @returns {string | null} License context or null if not set
     */
    get context(): string | null;
    /**
     * Name of the current server managing the license.
     * @returns {string | null} Server name or null if not set
     */
    get currentServer(): string | null;
    /**
     * Overall status of the license.
     * @returns {string | null} License status or null if not set
     */
    get status(): string | null;
    /**
     * Additional status message describing the license state.
     * @returns {string | null} Status message or null if not set
     */
    get statusMessage(): string | null;
    /**
     * Array of individual licenses associated with this license status.
     * @returns {License[] | null} List of licenses or null if none
     */
    get licenses(): License[] | null;
}
//# sourceMappingURL=license-status.d.ts.map
/**
 * Defines the license control mode for the O2G system.
 *
 * Determines how licenses are managed and provisioned, either via an external
 * FlexLM server (CAPEX mode) or the internal License Manager Server (OPEX mode).
 */
export declare enum LicenseType {
    /**
     * License controlled via an external **FlexLM server** (CAPEX mode).
     * Typically used for on-premises deployments with traditional license management.
     */
    FLEXLM = "FLEXLM",
    /**
     * License controlled via the **License Manager Server** (OPEX mode, "Purple on Demand").
     * Typically used for subscription-based deployments.
     */
    LMS = "LMS"
}
//# sourceMappingURL=license-type.d.ts.map
/**
 * Notification sent when the CTI link for a node goes down.
 *
 * This event is sent with a delay between 30 and 60 seconds.
 */
export declare class OnCtiLinkDown {
    #private;
    private constructor();
    /**
     * Gets the node identifier for which the CTI link is down.
     *
     * @returns The node ID.
     */
    get nodeId(): number;
}
/**
 * Notification sent when the CTI link for a node comes back up.
 */
export declare class OnCtiLinkUp {
    #private;
    private constructor();
    /**
     * Gets the node identifier for which the CTI link is up.
     *
     * @returns The node ID.
     */
    get nodeId(): number;
}
/**
 * Notification sent when a license is about to expire or has recently expired.
 */
export declare class OnLicenseExpiration {
    #private;
    private constructor();
    /**
     * Gets the alarm message for the license expiration.
     *
     * @returns The license message.
     */
    get message(): string;
    /**
     * Gets the number of days since or until license expiration.
     *
     * - `nbDays > 0`: license will expire in nbDays
     * - `nbDays < 0`: license expired nbDays ago
     *
     * @returns Number of days relative to expiration.
     */
    get nbDays(): number;
}
/**
 * Notification sent when data is fully loaded from an OXE node.
 */
export declare class OnPbxLoaded {
    #private;
    private constructor();
    /**
     * Gets the node identifier for which the PBX is loaded.
     *
     * @returns The node ID.
     */
    get nodeId(): number;
}
/**
 * Notification sent when a PBX link goes down.
 */
export declare class OnPbxLinkDown {
    #private;
    private constructor();
    /**
     * Gets the node identifier for which the PBX link is down.
     *
     * @returns The node ID.
     */
    get nodeId(): number;
}
/**
 * Notification sent when a PBX link comes back up.
 */
export declare class OnPbxLinkUp {
    #private;
    private constructor();
    /**
     * Gets the node identifier for which the PBX link is up.
     *
     * @returns The node ID.
     */
    get nodeId(): number;
}
/**
 * Notification sent when the O2G server is ready (all OXE nodes are connected and loaded).
 *
 * This event requires a webhook URL to be configured.
 */
export declare class OnServerStart {
    #private;
    private constructor();
    /**
     * Gets the server identifier or IP address of the server that started.
     *
     * @returns The server ID.
     */
    get serverId(): string;
}
//# sourceMappingURL=maint-events.d.ts.map
import { CTILinkState } from './cti-link-state';
import { ServerAddress } from './server-address';
/**
 * Represents the status of an OmniPCX Enterprise (PBX) node connected to the O2G server.
 *
 * Includes node identification, addresses, version, connection status, security, monitored users,
 * and the CSTA link state between the O2G server and the PBX node.
 */
export declare class PbxStatus {
    #private;
    /**
     * Creates a PbxStatus instance.
     * @param name - PBX node name
     * @param nodeId - PBX node number
     * @param mainAddress - Main address of the PBX node
     * @param secondaryAddress - Secondary address of the PBX node
     * @param version - Version of the PBX software
     * @param connected - Whether O2G is connected to this PBX node
     * @param loaded - Whether all users on this PBX node are loaded
     * @param ctiLinkState - Current CSTA link state
     * @param secured - Whether the PBX node is secured (SSH)
     * @param monitoredUserNumber - Number of monitored users on this PBX node
     */
    private constructor();
    /**
     * PBX node name
     * @returns {string | null} Name of the PBX node, or null if not available
     */
    get name(): string | null;
    /**
     * PBX node number
     * @returns {number} Node ID (defaults to 0 if not set)
     */
    get nodeId(): number;
    /**
     * Main address of the PBX node
     * @returns {ServerAddress | null} Main server address or null if not available
     */
    get mainAddress(): ServerAddress | null;
    /**
     * Secondary address of the PBX node
     * @returns {ServerAddress | null} Secondary server address or null if not available
     */
    get secondaryAddress(): ServerAddress | null;
    /**
     * PBX software version
     * @returns {string | null} Version string or null if not available
     */
    get version(): string | null;
    /**
     * Connection status between O2G and the PBX node
     * @returns {boolean} True if connected, false otherwise
     */
    get connected(): boolean;
    /**
     * Indicates whether all users on this PBX node have been loaded by O2G
     * @see {@link Maintenance.ON_PBX_LOADED} event
     * @returns {boolean} True if all users are loaded, false otherwise
     */
    get loaded(): boolean;
    /**
     * CSTA link state between the O2G server and this PBX node
     * @returns {CTILinkState | null} Current CSTA link state or null if not available
     */
    get ctiLinkState(): CTILinkState | null;
    /**
     * Whether the PBX node is secured. If true, the connection with O2G uses SSH.
     * @returns {boolean} True if secured, false otherwise
     */
    get secured(): boolean;
    /**
     * Number of monitored users on this PBX node
     * @returns {number} Number of monitored users (defaults to 0 if not set)
     */
    get monitoredUserNumber(): number;
}
//# sourceMappingURL=pbx-status.d.ts.map
/**
 * Represents an OmniPCX Enterprise server address.
 *
 * Includes both the fully qualified domain name (FQDN) and the IPv4 address of the server.
 */
export declare class ServerAddress {
    #private;
    /**
     * Creates a ServerAddress instance.
     * @param fqdn - Fully qualified domain name of the server
     * @param ip - IPv4 address of the server
     */
    private constructor();
    /**
     * Fully qualified domain name of the server
     * @returns {string | null} FQDN or null if not set
     */
    get fqdn(): string | null;
    /**
     * IPv4 address of the server
     * @returns {string | null} IP address or null if not set
     */
    get ip(): string | null;
}
//# sourceMappingURL=server-address.d.ts.map
/**
 * Represents the status of an individual system service on the O2G server.
 *
 * Includes the service name, its current status, and an optional operating mode.
 */
export declare class ServiceStatus {
    #private;
    /**
     * Creates a ServiceStatus instance.
     * @param name - Name of the service
     * @param status - Current status of the service (e.g., running, stopped)
     * @param mode - Optional mode or configuration of the service
     */
    private constructor();
    /**
     * Name of the service
     * @returns {string | null} Service name or null if not available
     */
    get name(): string | null;
    /**
     * Current status of the service
     * @returns {string | null} Service status or null if not available
     */
    get status(): string | null;
    /**
     * Optional mode or configuration of the service
     * @returns {string | null} Service mode or null if not set
     */
    get mode(): string | null;
}
//# sourceMappingURL=service-status.d.ts.map
/**
 * Defines how O2G automatically loads users from OXE subscribers.
 *
 * Controls which OXE subscribers are automatically imported or filtered
 * when provisioning users in the O2G system.
 */
export declare enum SubscriberFilter {
    /**
     * Only OXE subscribers with the **A4980 attribute** are automatically loaded.
     * Useful when selective subscriber provisioning is required.
     */
    A4980 = 0,
    /**
     * All OXE subscribers are automatically loaded.
     * Use this for full subscriber synchronization.
     */
    ALL = 1,
    /**
     * No OXE subscribers are automatically loaded.
     * Users must be created manually or through another provisioning process.
     */
    NONE = 2
}
//# sourceMappingURL=subscriber-filter.d.ts.map
import { ServiceStatus } from './service-status';
/**
 * Represents the status of all system services on an O2G server.
 *
 * Includes individual service statuses, the server's global IP address,
 * and the DRBD status for high availability.
 */
export declare class SystemServiceStatus {
    #private;
    /**
     * Creates a SystemServiceStatus instance.
     * @param services - Array of service statuses
     * @param globalIPAddress - Global IP address of the server
     * @param drbd - DRBD status (for HA configuration)
     */
    private constructor();
    /**
     * Array of individual service statuses
     * @returns {ServiceStatus[] | null} List of services or null if not available
     */
    get services(): ServiceStatus[] | null;
    /**
     * Global IP address of the server
     * @returns {string | null} Global IP address or null if not available
     */
    get globalIPAddress(): string | null;
    /**
     * DRBD status for high availability
     * @returns {string | null} DRBD status or null if not available
     */
    get drbd(): string | null;
}
//# sourceMappingURL=sys-service-status.d.ts.map
import { ConfigurationType } from './configuration-type';
import { LicenseStatus } from './license-status';
import { PbxStatus } from './pbx-status';
import { ServerAddress } from './server-address';
import { ServiceStatus } from './service-status';
import { SubscriberFilter } from './subscriber-filter';
import { SystemServiceStatus } from './sys-service-status';
/**
 * Provides a comprehensive status of the O2G server and its connected components.
 *
 * Includes details such as:
 * - Logical server address
 * - HA deployment mode
 * - Primary and secondary server FQDN, version, and service status
 * - Connected OmniPCX Enterprise (PBX) nodes
 * - License status
 * - Configuration type, application ID, and subscriber filters
 */
export declare class SystemStatus {
    #private;
    private constructor();
    /** Logical address of this O2G server
     * @returns {ServerAddress | null} The server's logical address or null if not available
     */
    get logicalAddress(): ServerAddress | null;
    /** Start date/time of the O2G server
     * @returns {Date | null} Server start date or null if not available
     */
    get startDate(): Date | null;
    /** Indicates whether the server is deployed in High Availability (HA) mode
     * @returns {boolean} True if HA mode, false otherwise
     */
    get haMode(): boolean;
    /** FQDN of the primary O2G server
     * @returns {string | null} Primary server FQDN or null if not available
     */
    get primary(): string | null;
    /** Version of the primary O2G server
     * @returns {string | null} Primary server version or null if not available
     */
    get primaryVersion(): string | null;
    /** Status of services on the primary O2G server
     * @returns {SystemServiceStatus | null} Primary server service status or null if not available
     */
    get primaryServiceStatus(): SystemServiceStatus | null;
    /** FQDN of the secondary O2G server
     * @returns {string | null} Secondary server FQDN or null if not available
     */
    get secondary(): string | null;
    /** Version of the secondary O2G server
     * @returns {string | null} Secondary server version or null if not available
     */
    get secondaryVersion(): string | null;
    /** Status of services on the secondary O2G server
     * @returns {ServiceStatus | null} Secondary server service status or null if not available
     */
    get secondaryServicesStatus(): ServiceStatus | null;
    /** Collection of connected OmniPCX Enterprise (PBX) nodes
     * @returns {PbxStatus[] | null} Array of PBX statuses or null if not available
     */
    get pbxs(): PbxStatus[] | null;
    /** License status of this O2G server
     * @returns {LicenseStatus | null} License status or null if not available
     */
    get license(): LicenseStatus | null;
    /** Configuration type of the O2G server
     * @returns {ConfigurationType | null} Configuration type or null if not available
     */
    get configurationType(): ConfigurationType | null;
    /** Application ID associated with the server
     * @returns {string | null} Application ID or null if not available
     */
    get applicationId(): string | null;
    /** Subscriber filter applied on the server
     * @returns {SubscriberFilter | null} Subscriber filter or null if not available
     */
    get subscriberFilter(): SubscriberFilter | null;
}
//# sourceMappingURL=sys-status.d.ts.map
/**
 * Represents a mailbox in a voice mail system.
 *
 * <p>A mailbox has an identifier, a name, and optional capabilities describing
 * which operations are supported on the mailbox.
 */
export declare class MailBox {
    #private;
    private constructor();
    /**
     * Get the mailbox identifier.
     *
     * @returns {string} The unique ID of this mailbox
     */
    get id(): string | null;
    /**
     * Get the mailbox name.
     *
     * @returns {string} The name of this mailbox
     */
    get name(): string | null;
    /**
     * Get the mailbox capabilities.
     *
     * @returns {MailBox.MailBoxCapabilities} The capabilities of this mailbox
     */
    get capabilities(): MailBox.MailBoxCapabilities | null;
}
export declare namespace MailBox {
    /**
     * Represents the capabilities of a mailbox.
     *
     * <p>Each capability indicates whether a certain action (e.g., playing messages,
     * recording, forwarding) is supported by the mailbox.
     */
    class MailBoxCapabilities {
        #private;
        private constructor();
        /**
         * Indicates whether the voicemail server can list messages.
         *
         * @returns {boolean} True if the voicemail server can return the list of messages, false otherwise
         */
        get canListMessages(): boolean;
        /**
         * Indicates whether voice messages can be downloaded.
         *
         * @returns {boolean} True if voice messages can be downloaded, false otherwise
         */
        get canGetMessages(): boolean;
        /**
         * Indicates whether recorded messages can be downloaded.
         *
         * @returns {boolean} True if recorded messages can be downloaded, false otherwise
         */
        get canGetRecord(): boolean;
        /**
         * Indicates whether the voicemail server is capable of playing voice messages.
         *
         * @returns {boolean} True if playback is supported, false otherwise
         */
        get canPlay(): boolean;
        /**
         * Indicates whether playing a voice message can be paused and resumed from the paused position.
         *
         * @returns {boolean} True if pausing is supported, false otherwise
         */
        get canPause(): boolean;
        /**
         * Indicates whether the media session can be terminated.
         *
         * @returns {boolean} True if hangup is supported, false otherwise
         */
        get canHangup(): boolean;
        /**
         * Indicates whether the voicemail server is capable of recording voice messages.
         *
         * @returns {boolean} True if recording is supported, false otherwise
         */
        get canRecord(): boolean;
        /**
         * Indicates whether voice message recording can be resumed after being stopped.
         *
         * @returns {boolean} True if resuming recording is supported, false otherwise
         */
        get canResume(): boolean;
        /**
         * Indicates whether the current recording can be cancelled.
         *
         * @returns {boolean} True if cancelling is supported, false otherwise
         */
        get canCancel(): boolean;
        /**
         * Indicates whether the voicemail server is capable of forwarding voice messages.
         *
         * @returns {boolean} True if forwarding is supported, false otherwise
         */
        get canForward(): boolean;
        /**
         * Indicates whether the voicemail server can call back the originator of the voice message.
         *
         * @returns {boolean} True if callback is supported, false otherwise
         */
        get canCallback(): boolean;
        /**
         * Indicates whether a voice message or recording can be sent to recipients.
         *
         * @returns {boolean} True if sending is supported, false otherwise
         */
        get canSend(): boolean;
        /**
         * Indicates whether the voicemail server can send events in case of message deposit or removal.
         *
         * @returns {boolean} True if event notifications are supported, false otherwise
         */
        get canSendEvents(): boolean;
    }
}
//# sourceMappingURL=mailbox.d.ts.map
/**
 * MailBoxInfo provides information about the user's mailbox.
 *
 * <p>This class allows access to the total number of voice messages,
 * the number of new (unread) voice messages, and the mailbox storage usage.
 */
export declare class MailBoxInfo {
    #private;
    /**
     * @private
     * @param {number} [totalVoiceMsg] Total number of voice messages in the mailbox
     * @param {number} [newVoiceMsg] Number of new (unread) voice messages
     * @param {number} [storageUsage] Storage usage of the mailbox in bytes
     */
    private constructor();
    /**
     * Get the total number of voice messages in the mailbox.
     *
     * @returns {number} Total voice messages (0 if unspecified)
     */
    get totalVoiceMsg(): number;
    /**
     * Get the number of new (unread) voice messages.
     *
     * @returns {number} New voice messages (0 if unspecified)
     */
    get newVoiceMsg(): number;
    /**
     * Get the mailbox storage usage in bytes.
     *
     * @returns {number} Storage usage in bytes (0 if unspecified)
     */
    get storageUsage(): number;
}
//# sourceMappingURL=mailbox-info.d.ts.map
import { PartyInfo } from '../common/party-info';
/**
 * VoiceMessage represents a single message stored in a user's voice mailbox.
 *
 * <p>This class provides information about the message, including its identifier,
 * the party who left the message, duration, date, unread status, and priority.
 */
export declare class VoiceMessage {
    #private;
    /**
     * @private
     * @param {string} voicemailId Unique identifier of the voicemail
     * @param {PartyInfo | undefined} from Party who left the message (optional)
     * @param {number} duration Duration of the message in seconds
     * @param {Date} date Date when the message was deposited
     * @param {boolean} unread Whether the message is unread
     * @param {boolean} highPriority Whether the message has high priority
     */
    private constructor();
    /**
     * Get the unique identifier of the voicemail.
     *
     * @returns {string} Voicemail ID
     */
    get voicemailId(): string;
    /**
     * Get the party who left the message.
     *
     * @returns {PartyInfo | null} Party information or null if not available
     */
    get from(): PartyInfo | null;
    /**
     * Get the duration of the message in seconds.
     *
     * @returns {number} Duration in seconds
     */
    get duration(): number;
    /**
     * Get the date when the message was deposited.
     *
     * @returns {Date} Date of the message
     */
    get date(): Date;
    /**
     * Check if the message is unread.
     *
     * @returns {boolean} True if the message is unread, false otherwise
     */
    get unread(): boolean;
    /**
     * Check if the message has high priority.
     *
     * @returns {boolean} True if the message is high priority, false otherwise
     */
    get highPriority(): boolean;
}
//# sourceMappingURL=voice-message.d.ts.map
/**
 * AttributeFilter represents the possible operation to apply to an attribute to build a filter.
 * @see {@link PbxManagement.getObjectInstances}
 */
export declare enum AttributeFilter {
    /**
     * The attribute is equal to the value.
     */
    Equals = 0,
    /**
     * The attribute starts with the value.
     */
    StartsWith = 1,
    /**
     * The attributes ends with the value.
     */
    EndsWith = 2,
    /**
     * The attribute is not equals to the value.
     */
    NotEquals = 3,
    /**
     * The attribute is greather than or equals to the value.
     */
    GreatherThanOrEquals = 4,
    /**
     * The attribute is Less than or equals to the value.
     */
    LessThanOrEquals = 5
}
//# sourceMappingURL=attribute-filter.d.ts.map
import { AttributeFilter } from './attribute-filter';
import { PbxAttribute } from './pbx-attribute';
/**
 * Represents a filter used to query OmniPCX Enterprise object instances.
 * <p>
 * Filters can be created for specific attributes using {@link create}, and
 * combined using the logical operators {@link and} and {@link or}.
 *
 * @example
 * ```typescript
 * // Simple filter â€” all analog subscribers
 * const analog = InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG");
 *
 * // Combined filter â€” analog or ALE-300 subscribers whose name starts with "f"
 * const complex = InstanceFilter.and(
 *     InstanceFilter.or(
 *         InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG"),
 *         InstanceFilter.create("StationType", AttributeFilter.Equals, "ALE-300")
 *     ),
 *     InstanceFilter.create("Directory_Name", AttributeFilter.StartsWith, "f")
 * );
 *
 * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", complex);
 * ```
 *
 * @see PbxManagement.getObjectInstances
 */
export declare class InstanceFilter {
    #private;
    /**
     * Returns the internal string representation of this filter.
     *
     * @returns the filter expression as a string
     */
    get value(): string;
    /**
     * Creates a new filter for a specific attribute using the given operation and value.
     *
     * @param attribute the attribute to filter on, either a {@link PbxAttribute} object or a string name
     * @param operation the comparison operation to apply
     * @param value     the value to test against
     * @returns a new {@link InstanceFilter} instance representing the condition
     * @throws Error if an unknown operation is provided
     * @see AttributeFilter
     */
    static create(attribute: string | PbxAttribute, operation: AttributeFilter, value: string): InstanceFilter;
    /**
     * Combines multiple filters with a logical AND operator.
     * <p>
     * All provided filters must be satisfied for the combined filter to match.
     *
     * @param filter1      the first filter
     * @param filter2      the second filter
     * @param otherFilters additional optional filters
     * @returns a new {@link InstanceFilter} representing the combined condition
     * @see or
     */
    static and(filter1: InstanceFilter, filter2: InstanceFilter, ...otherFilters: InstanceFilter[]): InstanceFilter;
    /**
     * Combines multiple filters with a logical OR operator.
     * <p>
     * At least one of the provided filters must be satisfied for the combined filter to match.
     *
     * @param filter1      the first filter
     * @param filter2      the second filter
     * @param otherFilters additional optional filters
     * @returns a new {@link InstanceFilter} representing the combined condition
     * @see and
     */
    static or(filter1: InstanceFilter, filter2: InstanceFilter, ...otherFilters: InstanceFilter[]): InstanceFilter;
}
//# sourceMappingURL=instance-filter.d.ts.map
import { OctetStringLength } from './octet-string-length';
/**
 * Represents the object model of an OmniPCX Enterprise object.
 * <p>
 * A `Model` provides the metadata of an object in the PBX object hierarchy,
 * including:
 * <ul>
 * <li>which operations are permitted (create, delete, set, get)</li>
 * <li>the list of attributes with their types, constraints and allowed values</li>
 * <li>the list of child object models accessible from this object</li>
 * </ul>
 * <p>
 * Use {@link PbxManagement.getObjectModel} to retrieve a model, then inspect
 * its attributes and children before performing create or modify operations.
 *
 * @example
 * ```typescript
 * // Retrieve the model for the Subscriber object
 * const model = await O2G.pbxManagement.getObjectModel(1, "Subscriber");
 *
 * // Check what operations are allowed
 * console.log("Can create:", model?.canCreate);
 * console.log("Can delete:", model?.canDelete);
 *
 * // List all attributes and their types
 * model?.attributes().forEach(attr => {
 *     console.log(`${attr.name} (${attr.type}) mandatory=${attr.mandatory}`);
 *     if (attr.allowedValues) {
 *         console.log("  Allowed values:", attr.allowedValues);
 *     }
 * });
 *
 * // Check if an attribute supports filtering
 * const stationType = model?.attribute("StationType");
 * if (stationType?.filtering) {
 *     const filter = InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG");
 *     const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", filter);
 * }
 * ```
 */
export declare class Model {
    #private;
    /**
     * Returns the name of this object model.
     *
     * @returns the object model name, or `null` if undefined
     */
    get name(): string | null;
    /**
     * Returns the specified attribute model by name.
     *
     * @param attrName the attribute name
     * @returns the {@link Model.Attribute} or `null` if no attribute exists with this name
     */
    attribute(attrName: string): Model.Attribute | null;
    /**
     * Returns all attribute models for this object.
     *
     * @returns the list of {@link Model.Attribute} objects
     */
    attributes(): Model.Attribute[];
    /**
     * Returns all child object models of this model.
     *
     * @returns the list of child {@link Model} objects
     */
    children(): Model[];
    /**
     * Returns the specified child model by name.
     *
     * @param name the child model name
     * @returns the child {@link Model}, or `null` if no child exists with this name
     */
    child(name: string): Model | null;
    /**
     * Returns whether this object is hidden in the model.
     *
     * @returns `true` if the object is hidden; `false` otherwise
     */
    get hidden(): boolean;
    /**
     * Returns whether this object can be created.
     *
     * @returns `true` if the object can be created; `false` otherwise
     */
    get canCreate(): boolean;
    /**
     * Returns whether this object can be deleted.
     *
     * @returns `true` if the object can be deleted; `false` otherwise
     */
    get canDelete(): boolean;
    /**
     * Returns whether this object can be modified.
     *
     * @returns `true` if the object can be set; `false` otherwise
     */
    get canSet(): boolean;
    /**
     * Returns whether this object can be retrieved.
     *
     * @returns `true` if the object can be retrieved; `false` otherwise
     */
    get canGet(): boolean;
    /**
     * Returns the additional actions available on this object beyond the standard
     * create, delete, set and get operations.
     *
     * @returns the list of additional action names, or `null` if none
     */
    get otherActions(): string[] | null;
}
export declare namespace Model {
    /**
     * Represents the possible types of a {@link Model.Attribute}.
     *
     * @see Model.Attribute
     */
    enum AttributeType {
        /**
         * An enumerated type â€” a limited set of string values.
         */
        Enumerated = "Enumerated",
        /**
         * An octet string type.
         */
        OctetString = "OctetString",
        /**
         * A sequence of named sub-attributes.
         */
        Sequence = "Sequence",
        /**
         * An integer type.
         */
        Integer = "Integer",
        /**
         * A boolean type.
         */
        Boolean = "Boolean",
        /**
         * A set of attributes of the same type.
         */
        Set = "Set",
        /**
         * A byte string type.
         */
        ByteString = "ByteString"
    }
    /**
     * Represents the model of a single attribute within a {@link Model} object.
     * <p>
     * Provides metadata about the attribute including its type, whether it is
     * mandatory, its allowed values or length constraints, and whether it can
     * be used in filters.
     */
    class Attribute {
        #private;
        /**
         * Returns the name of this attribute.
         *
         * @returns the attribute name, or `null` if undefined
         */
        get name(): string | null;
        /**
         * Returns whether this attribute is mandatory for object creation.
         *
         * @returns `true` if the attribute is mandatory; `false` otherwise
         */
        get mandatory(): boolean;
        /**
         * Returns the type of this attribute.
         *
         * @returns the {@link AttributeType}, or `null` if undefined
         */
        get type(): AttributeType | null;
        /**
         * Returns whether this attribute can hold multiple values.
         *
         * @returns `true` if the attribute is multi-value; `false` otherwise
         */
        get multiValue(): boolean;
        /**
         * Returns the allowed values for this attribute.
         * <p>
         * Only applies to attributes of type {@link AttributeType.Enumerated}.
         *
         * @returns the list of allowed values, or `null` if unrestricted
         */
        get allowedValues(): string[] | null;
        /**
         * Returns the maximum length constraint for this attribute.
         * <p>
         * Only applies to attributes of type {@link AttributeType.OctetString}
         * or {@link AttributeType.ByteString}.
         *
         * @returns the {@link OctetStringLength}, or `null` if not applicable
         */
        get octetStringLength(): OctetStringLength | null;
        /**
         * Returns the default value of this attribute.
         *
         * @returns the default value, or `null` if none is defined
         */
        get defaultValue(): string | null;
        /**
         * Returns whether this attribute can be used in {@link InstanceFilter} expressions.
         *
         * @returns `true` if filtering is supported; `false` otherwise
         */
        get filtering(): boolean;
        /**
         * Returns the context in which this attribute is used.
         * <p>
         * Some attributes are only relevant in specific creation or modification contexts.
         *
         * @returns the usage context string, or `null` if undefined
         */
        get usedWhen(): string | null;
    }
}
//# sourceMappingURL=model.d.ts.map
export declare class OctetStringLength {
    private readonly _min;
    private readonly _max;
    private constructor();
    get min(): number;
    get max(): number;
    /**
     * @ignore
     */
    static parseLengthValue(value: string | null | undefined): OctetStringLength | null;
}
//# sourceMappingURL=octet-string-length.d.ts.map
/**
 * Represents the basic information of a PBX (OmniPCX Enterprise).
 *
 * <p>
 * In an OmniPCX Enterprise sub-network, each OXE node is identified by a unique node ID.
 * </p>
 */
export declare class Pbx {
    #private;
    /**
     * Returns the OmniPCX Enterprise node ID.
     *
     * @returns The node ID of this PBX, or null if not set
     */
    get nodeId(): number | null;
    /**
     * Returns the fully qualified domain name (FQDN) of this OmniPCX Enterprise node.
     *
     * @returns The FQDN of this PBX, or null if not set
     */
    get fqdn(): string | null;
}
//# sourceMappingURL=pbx.d.ts.map
import { PbxAttributeJson } from '../../internal/types/pbxmngt/pbxmngt-types';
import { PbxAttributeMap } from './pbx-attr-map';
/**
 * Represents an attribute in a {@link PbxObject}.
 *
 * <p>
 * A PbxAttribute can be of the following types:
 * </p>
 *
 * <ul>
 *   <li><b>Integer</b>: Equivalent to a number value.</li>
 *   <li><b>Boolean</b>: Equivalent to a boolean value.</li>
 *   <li><b>Enumerated</b>: Limited set of string values.</li>
 *   <li><b>OctetString / ByteString</b>: Treated as a string value.</li>
 *   <li><b>Sequence</b>: Structured data with named attributes. Example:
 *   <pre>{@code
 *     Skill := Sequence {
 *         Skill_Nb := Integer,
 *         Skill_Level := Integer,
 *         Skill_Activate := Boolean
 *     }
 *   }</pre>
 *   </li>
 *   <li><b>Set</b>: List of attributes of the same type, either simple or sequences. Examples:
 *   <pre>{@code
 *     SimpleSet := Set { Item := OctetString }
 *     SkillSet := Set { Item := Sequence {
 *         Skill_Nb := Integer,
 *         Skill_Level := Integer,
 *         Skill_Activate := Boolean
 *     }}
 *   }</pre>
 *   </li>
 * </ul>
 */
export declare class PbxAttribute {
    #private;
    /**
     * Returns this attribute's name.
     * @returns The attribute name, or null if not set
     */
    get name(): string | null;
    /**
     * Adds a nested sequence attribute.
     * @param pbxAttribute - The parent attribute
     * @param name - Name of the nested attribute
     * @param json - JSON representation of the nested attribute
     * @ignore
     */
    static addSequenceAttribute(pbxAttribute: PbxAttribute, name: string, json: PbxAttributeJson): void;
    /**
     * Creates a new PbxAttribute representing a Set of string values.
     * @param attrName - Attribute name
     * @param values - List of string values
     * @returns A new {@link PbxAttribute} instance
     */
    static createSetOfStrings(attrName: string, values: string[]): PbxAttribute;
    /**
     * Creates a new PbxAttribute of type String.
     * @param attrName - Attribute name
     * @param value - String value
     * @returns A new {@link PbxAttribute} instance
     */
    static createString(attrName: string, value: string): PbxAttribute;
    /**
     * Creates a new PbxAttribute of type Boolean.
     * @param attrName - Attribute name
     * @param value - Boolean value
     * @returns A new {@link PbxAttribute} instance
     */
    static createBoolean(attrName: string, value: boolean): PbxAttribute;
    /**
     * Creates a new PbxAttribute of type Integer.
     * @param attrName - Attribute name
     * @param value - Integer value
     * @returns A new {@link PbxAttribute} instance
     */
    static createInteger(attrName: string, value: number): PbxAttribute;
    /**
     * Creates a new PbxAttribute representing a Sequence.
     * @param attrName - Attribute name
     * @param sequence - {@link PbxAttributeMap} representing the sequence
     * @returns A new {@link PbxAttribute} instance
     */
    static createSequence(attrName: string, sequence: PbxAttributeMap): PbxAttribute;
    /**
     * Creates a new PbxAttribute representing a Set of sequences.
     * @param attrName - Attribute name
     * @param setOfSequences - List of {@link PbxAttributeMap} representing sequences
     * @returns A new {@link PbxAttribute} instance
     */
    static createSequenceSet(attrName: string, setOfSequences: PbxAttributeMap[]): PbxAttribute;
    /**
     * Returns the attribute at the specified index in a Set of sequences.
     * @param index - Index of the set
     * @returns {@link PbxAttributeMap} at the specified index
     * @throws Error if the attribute is not a Set
     */
    getAt(index: number): PbxAttributeMap;
    /**
     * Returns this attribute as a sequence of attributes.
     * @returns {@link PbxAttributeMap} representing the sequence
     * @throws Error if the attribute is not a Sequence
     */
    asAttributeMap(): PbxAttributeMap;
    /**
     * Returns this attribute as a list of {@link PbxAttributeMap}.
     * @returns List of {@link PbxAttributeMap} representing a Set of sequences
     * @throws Error if the attribute is not a sequence set
     */
    asListOfMaps(): PbxAttributeMap[];
    /**
     * Returns this attribute value as a boolean.
     * @returns Boolean value
     * @throws Error if value is not a valid boolean
     */
    asBoolean(): boolean;
    /**
     * Sets this attribute value as a boolean.
     * @param value - Boolean value
     */
    setBoolean(value: boolean): void;
    /**
     * Returns this attribute value as an integer.
     * @returns Integer value
     * @throws Error if value is not a valid integer
     */
    asInteger(): number;
    /**
     * Sets this attribute value as an integer.
     * @param value - Integer value
     */
    setInteger(value: number): void;
    /**
     * Returns this attribute value as a string.
     * @returns String value
     */
    asString(): string;
    /**
     * Sets this attribute value as a string.
     * @param value - String value
     */
    setString(value: string): void;
    /**
     * Returns this attribute value as an enumerated string.
     * @returns String value
     */
    asEnum(): string;
    /**
     * Ensures the attribute has a single value and returns it.
     * @param values - Array of string values
     * @returns The single string value
     * @throws Error if values array does not contain exactly one element
     */
    private _assertUnique;
}
//# sourceMappingURL=pbx-attribute.d.ts.map
import { PbxAttribute } from './pbx-attribute';
/**
 * Represents a collection of named {@link PbxAttribute} objects that together
 * form a structured sequence.
 * <p>
 * A `PbxAttributeMap` is used when building or reading back Sequence or Set
 * attributes. Each attribute in the map must have a unique name.
 * <p>
 * Use {@link PbxAttributeMap.create} or {@link PbxAttributeMap.createWith} to
 * build a map, then pass it to {@link PbxAttribute.createSequence} or
 * {@link PbxAttribute.createSequenceSet}.
 *
 * @example
 * ```typescript
 * // Build a sequence using the fluent API
 * const skillMap = PbxAttributeMap.create()
 *     .add(PbxAttribute.createInteger("Skill_Nb", 1))
 *     .add(PbxAttribute.createInteger("Skill_Level", 3))
 *     .add(PbxAttribute.createBoolean("Skill_Activate", true));
 *
 * // Or build it from an array
 * const skillMap2 = PbxAttributeMap.createWith([
 *     PbxAttribute.createInteger("Skill_Nb", 1),
 *     PbxAttribute.createInteger("Skill_Level", 3),
 *     PbxAttribute.createBoolean("Skill_Activate", true)
 * ]);
 *
 * // Use it to create a Sequence attribute
 * const skill = PbxAttribute.createSequence("Skill", skillMap);
 *
 * // Or a Set of sequences
 * const skillSet = PbxAttribute.createSequenceSet("SkillSet", [skillMap, skillMap2]);
 * ```
 */
export declare class PbxAttributeMap {
    #private;
    /**
     * Returns the names of all attributes in this map.
     *
     * @returns the list of attribute names
     */
    get names(): string[];
    /**
     * Returns the attribute with the specified name.
     *
     * @param name the name of the attribute to retrieve
     * @returns the {@link PbxAttribute} if found; `undefined` otherwise
     */
    getAttribute(name: string): PbxAttribute | undefined;
    /**
     * Adds an attribute to this map.
     * <p>
     * Attributes with undefined names are skipped. Calls can be chained to
     * build a sequence fluently.
     *
     * @param value the attribute to add
     * @returns this {@link PbxAttributeMap} for chaining
     * @see create
     */
    add(value: PbxAttribute): PbxAttributeMap;
    /**
     * Creates a new empty `PbxAttributeMap`.
     * <p>
     * Use the fluent {@link add} method to populate it.
     *
     * @example
     * ```typescript
     * const map = PbxAttributeMap.create()
     *     .add(PbxAttribute.createInteger("Param1", 1))
     *     .add(PbxAttribute.createBoolean("Param2", true));
     * ```
     *
     * @returns a new empty {@link PbxAttributeMap}
     * @see createWith
     */
    static create(): PbxAttributeMap;
    /**
     * Creates a `PbxAttributeMap` pre-populated with the specified attributes.
     * <p>
     * Attributes with undefined names are skipped.
     *
     * @example
     * ```typescript
     * const map = PbxAttributeMap.createWith([
     *     PbxAttribute.createInteger("Param1", 1),
     *     PbxAttribute.createBoolean("Param2", true)
     * ]);
     * ```
     *
     * @param attributes the list of attributes to add
     * @returns a new {@link PbxAttributeMap} containing the specified attributes
     * @see create
     */
    static createWith(attributes: PbxAttribute[]): PbxAttributeMap;
}
//# sourceMappingURL=pbx-attr-map.d.ts.map
/**
 * Represents a PBX object definition.
 *
 * A PBX object is identified by:
 * - a unique object identifier
 * - a logical object name
 */
export declare class PbxObjectDefinition {
    #private;
    /**
     * Gets the logical name of the PBX object.
     *
     * @returns The object name.
     */
    get objectName(): string;
    /**
     * Gets the unique identifier of the PBX object.
     *
     * @returns The object identifier.
     */
    get objectId(): string;
}
/**
 * Base class for PBX object instance lifecycle events.
 *
 * This abstract class represents a generic event emitted when a PBX object
 * instance is created, modified, or deleted.
 */
export declare abstract class OnPbxObjectInstanceEvent {
    #private;
    /**
     * Creates a new PBX object instance event.
     *
     * @param object - The PBX object concerned by the event.
     * @param parent - The parent object (if any).
     * @param nodeId - Identifier of the OmniPCX Enterprise node that emitted the event.
     */
    protected constructor(object: PbxObjectDefinition, parent: PbxObjectDefinition | undefined, nodeId: number);
    /**
     * Gets the PBX object concerned by the event.
     *
     * @returns The object definition.
     */
    get object(): PbxObjectDefinition;
    /**
     * Gets the parent object of the concerned PBX object.
     *
     * @returns The parent object definition, or `null` if none exists.
     */
    get parent(): PbxObjectDefinition | null;
    /**
     * Gets the identifier of the OmniPCX Enterprise node
     * that emitted this event.
     *
     * @returns The node identifier.
     */
    get nodeId(): number;
}
/**
 * Event emitted when a PBX object instance is created.
 */
export declare class OnPbxObjectInstanceCreated extends OnPbxObjectInstanceEvent {
}
/**
 * Event emitted when a PBX object instance is deleted.
 */
export declare class OnPbxObjectInstanceDeleted extends OnPbxObjectInstanceEvent {
}
/**
 * Event emitted when a PBX object instance is modified.
 */
export declare class OnPbxObjectInstanceModified extends OnPbxObjectInstanceEvent {
}
//# sourceMappingURL=pbxmngt-events.d.ts.map
import { PbxAttribute } from './pbx-attribute';
/**
 * Represents an object instance in the OmniPCX Enterprise object model.
 * <p>
 * A `PbxObject` is referenced by its object instance definition â€” a hierarchical
 * path from the root object â€” and a unique instance id. For example:
 * <ul>
 * <li>`"Subscriber"` â€” a subscriber object</li>
 * <li>`"Application_Configuration/1/ACD2/1/ACD2_Operator/1/ACD2_Operator_data"` â€” a CCD operator data object</li>
 * </ul>
 * <p>
 * A `PbxObject` is returned by {@link PbxManagement.getObject} and
 * {@link PbxManagement.getNodeObject}. Its attributes can be accessed by name
 * using {@link getAttribute}, and its sub-object names are available via
 * {@link objectNames}.
 *
 * @example
 * ```typescript
 * // Retrieve a subscriber object
 * const obj = await O2G.pbxManagement.getObject(1, "Subscriber", "60200");
 *
 * // Read simple attributes
 * const stationType = obj?.getAttribute("StationType")?.asString();
 * const maxCalls    = obj?.getAttribute("MaxCalls")?.asInteger();
 * const enabled     = obj?.getAttribute("Enabled")?.asBoolean();
 *
 * // Read a sequence attribute
 * const skill = obj?.getAttribute("Skill")?.asAttributeMap();
 * const level = skill?.getAttribute("Skill_Level")?.asInteger();
 *
 * // Read a set of sequences
 * const skillSet = obj?.getAttribute("SkillSet");
 * const maps = skillSet?.asListOfMaps();
 * maps?.forEach(map => {
 *     console.log("Skill Nb:", map.getAttribute("Skill_Nb")?.asInteger());
 * });
 *
 * // List available sub-objects
 * console.log("Sub-objects:", obj?.objectNames);
 * ```
 */
export declare class PbxObject {
    #private;
    /**
     * Returns the names of sub-objects accessible from this object.
     * <p>
     * These names can be used to recursively navigate the object hierarchy
     * using {@link PbxManagement.getObject}.
     *
     * @returns the list of sub-object names, or `null` if none
     */
    get objectNames(): string[] | null;
    /**
     * Returns this object's name.
     *
     * @returns the object name, or `null` if undefined
     */
    get name(): string | null;
    /**
     * Returns this object's instance id.
     *
     * @returns the instance id, or `null` if undefined
     */
    get id(): string | null;
    /**
     * Returns the attribute with the specified name.
     *
     * @param attrName the name of the attribute to retrieve
     * @returns the {@link PbxAttribute} if found; `undefined` otherwise
     */
    getAttribute(attrName: string): PbxAttribute | undefined;
}
//# sourceMappingURL=pbx-object.d.ts.map
/**
 * Represents a key on an OmniPCX Enterprise device.
 *
 * A DeviceKey can correspond to a programmable key on the device,
 * which may store a phone number and an optional mnemonic for easier identification.
 */
export declare class DeviceKey {
    #private;
    /**
     * Constructs a new DeviceKey.
     *
     * @param position - The physical or logical position of the key on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic to identify the key (e.g., "Reception" or "Sales").
     */
    constructor(position?: number, number?: string, mnemonic?: string);
    /**
     * The position of the key on the device.
     *
     * @returns {number | null} Returns the key position, or null if not set.
     */
    get position(): number | null;
    /**
     * The phone number assigned to this key.
     *
     * @returns {string | null} Returns the associated number, or null if not set.
     */
    get number(): string | null;
    /**
     * The mnemonic label for this key.
     *
     * @returns {string | null} Returns the mnemonic if set; otherwise, null.
     */
    get mnemonic(): string | null;
}
//# sourceMappingURL=device-key.d.ts.map
/**
 * Represents the dynamic state of a device.
 *
 * DynamicState provides information about:
 * - Whether the device is locked
 * - Whether the camp-on feature is activated
 * - The associated phone number
 */
export declare class DynamicState {
    #private;
    /**
     * Indicates whether the device is locked.
     *
     * @returns {boolean} True if the device is locked; otherwise false.
     */
    get lock(): boolean;
    /**
     * Indicates whether the camp-on feature is active.
     *
     * @returns {boolean} True if camp-on is active; otherwise false.
     */
    get campon(): boolean;
    /**
     * Returns the associated phone number.
     *
     * @returns {string | null} The associated number, or null if not set.
     */
    get associate(): string | null;
}
//# sourceMappingURL=dynamic-state.d.ts.map
/**
 * Represents a Personal Identification Number (PIN).
 *
 * Allows a user to declare a call as personal rather than business-related.
 * The PIN is confidential and should only be known by authorized administrators.
 */
export declare class Pin {
    #private;
    /**
     * The PIN number associated with this Pin instance.
     * @returns {string | null} Returns the PIN number, or null if it is not set.
     */
    get number(): string | null;
    /**
     * Indicates whether this PIN requires validation with the user's secret code.
     * @returns {boolean} Returns true if a secret code is required; false otherwise.
     */
    get withSecretCode(): boolean;
    /**
     * The access control associated with this PIN.
     * @returns {Pin.Control | null} Returns the control type if set; null otherwise.
     */
    get control(): Pin.Control | null;
    /**
     * The group number associated with this PIN.
     * @returns {number | null} Returns the group number, or null if it is not set.
     */
    get group(): number | null;
}
export declare namespace Pin {
    /**
     * The type of access of a PIN code.
     */
    enum Control {
        /**
         * PIN code can be used from any set according to categories.
         */
        ByCategory = "PIN_Category",
        /**
         * PIN code is restricted to the users set.
         */
        RestrictedToOwner = "PIN_Restricted_To_Owner_Set",
        /**
         * PIN code can be used on any set in the system.
         */
        UniversalAccess = "PIN_Universal_Access",
        /**
         * PIN code is limited to specific group.
         */
        ByGroup = "PIN_By_Group"
    }
}
//# sourceMappingURL=pin.d.ts.map
import { DeviceKey } from './device-key';
/**
 * Represents a programmable key on an OmniPCX Enterprise device.
 *
 * A ProgrammableKey can store a number, an optional mnemonic, and a locked state.
 * It extends `DeviceKey` and adds the `locked` property to control key usability.
 */
export declare class ProgrammeableKey extends DeviceKey {
    #private;
    /**
     * Constructs a new ProgrammableKey instance.
     *
     * @param position - The key position on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic for the key (e.g., "Reception" or "Sales").
     * @param locked - True if the key is locked; false otherwise.
     */
    constructor(position?: number, number?: string, mnemonic?: string, locked?: boolean);
    /**
     * Indicates whether this key is locked.
     *
     * @returns {boolean} True if locked; false otherwise.
     */
    get locked(): boolean;
}
//# sourceMappingURL=prog-key.d.ts.map
import { DeviceKey } from './device-key';
/**
 * Represents a software key (SoftKey) on an OmniPCX Enterprise device.
 *
 * A SoftKey is a programmable key on the device that may store a number
 * and an optional mnemonic for easier identification. It extends `DeviceKey`.
 */
export declare class SoftKey extends DeviceKey {
    /**
     * Constructs a new SoftKey instance.
     *
     * @param position - The key position on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic for the key (e.g., "Reception" or "Sales").
     */
    constructor(position?: number, number?: string, mnemonic?: string);
}
//# sourceMappingURL=soft-key.d.ts.map
/**
 * Destination represents a forward or an overflow destination.
 */
export declare enum Destination {
    /**
     * The destination is the user voice mail.
     */
    VOICEMAIL = "VOICEMAIL",
    /**
     * The destination is another phone number. This destination can be used only to configure a forward.
     */
    NUMBER = "NUMBER",
    /**
     * None destination.
     */
    NONE = "NONE"
}
//# sourceMappingURL=destination.d.ts.map
export declare class DndState {
    #private;
    private constructor();
    /**
     * Whether Do Not Disturb is activated.
     */
    get activate(): boolean;
}
//# sourceMappingURL=dnd-state.d.ts.map
import { Destination } from './destination';
import { ForwardCondition } from './forward-condition';
/**
 * Represents the forward currently activated for a user.
 * <p>
 * A forward can target a voice mail ({@link onVoiceMail}) or a phone number
 * ({@link onNumber}), and is always associated with a {@link ForwardCondition}
 * that determines when the forward applies.
 * <p>
 * Use {@link Routing.getForward} to retrieve the current forward state, and
 * {@link Routing.forwardOnVoiceMail} or {@link Routing.forwardOnNumber} to
 * activate one.
 *
 * @see Routing.getForward
 * @see Routing.forwardOnVoiceMail
 * @see Routing.forwardOnNumber
 */
export declare class Forward {
    #private;
    /**
     * The destination type of this forward.
     */
    get destination(): Destination;
    /**
     * The phone number target of this forward.
     * <p>
     * Only set when `destination` is {@link Destination.NUMBER};
     * `null` otherwise.
     */
    get number(): string | null;
    /**
     * The condition under which this forward applies.
     */
    get condition(): ForwardCondition | null;
    /**
     * Creates a `Forward` targeting the user's voice mail with the specified condition.
     *
     * @param condition the condition under which the forward applies
     * @returns a new {@link Forward} instance targeting voice mail
     * @see Routing.forwardOnVoiceMail
     */
    static onVoiceMail(condition: ForwardCondition): Forward;
    /**
     * Creates a `Forward` targeting the specified phone number with the specified condition.
     *
     * @param number    the phone number to forward to
     * @param condition the condition under which the forward applies
     * @returns a new {@link Forward} instance targeting a phone number
     * @see Routing.forwardOnNumber
     */
    static onNumber(number: string, condition: ForwardCondition): Forward;
}
//# sourceMappingURL=forward.d.ts.map
/**
 * ForwardCondition represents the possible condition a user can associate to a forward.
 */
export declare enum ForwardCondition {
    /**
     * Incoming calls are immediately forwarded on the target.
     */
    IMMEDIATE = "IMMEDIATE",
    /**
     * Incoming calls are forwarded on the target if the user is busy.
     */
    BUSY = "BUSY",
    /**
     * Incoming calls are forwarded on the target if the user does not answer the call.
     */
    NO_ANSWER = "NO_ANSWER",
    /**
     * Incoming calls are forwarded on the target if the user is busy or if the user does not answer the call.
     */
    BUSY_OR_NO_ANSWER = "BUSY_OR_NO_ANSWER"
}
export declare namespace ForwardCondition {
    function fromForwardType(forwardType?: string): ForwardCondition;
    function toForwardType(condition: ForwardCondition): string | undefined;
}
//# sourceMappingURL=forward-condition.d.ts.map
import { Destination } from './destination';
import { OverflowCondition } from './overflow-condition';
/**
 * Represents the overflow currently activated for a user.
 * <p>
 * An overflow redirects calls to a voice mail ({@link onVoiceMail}) or a phone
 * number ({@link onNumber}) when a specific condition is met, such as when the
 * user is busy or does not answer.
 * <p>
 * Use {@link Routing.getOverflow} to retrieve the current overflow state, and
 * {@link Routing.overflowOnVoiceMail} to activate one.
 *
 * @see Routing.getOverflow
 * @see Routing.overflowOnVoiceMail
 */
export declare class Overflow {
    #private;
    /**
     * The destination type of this overflow.
     */
    get destination(): Destination;
    /**
     * The phone number target of this overflow.
     * <p>
     * Only set when `destination` is {@link Destination.NUMBER};
     * `null` otherwise.
     */
    get number(): string | null;
    /**
     * The condition under which this overflow applies.
     */
    get condition(): OverflowCondition | null;
    /**
     * Creates an `Overflow` targeting the specified phone number with the specified condition.
     *
     * @param number    the phone number to overflow to
     * @param condition the condition under which the overflow applies
     * @returns a new {@link Overflow} instance targeting a phone number
     */
    static onNumber(number: string, condition: OverflowCondition): Overflow;
    /**
     * Creates an `Overflow` targeting the user's voice mail with the specified condition.
     *
     * @param condition the condition under which the overflow applies
     * @returns a new {@link Overflow} instance targeting voice mail
     * @see Routing.overflowOnVoiceMail
     */
    static onVoiceMail(condition: OverflowCondition): Overflow;
}
//# sourceMappingURL=overflow.d.ts.map
/**
 * OverflowCondition represents the possible condition a user can associate to an overflow.
 */
export declare enum OverflowCondition {
    /**
     * Incoming calls are forwarded on the target if the user is busy.
     */
    BUSY = "BUSY",
    /**
     * Incoming calls are forwarded on the target if the user does not answer the call.
     */
    NO_ANSWER = "NO_ANSWER",
    /**
     * Incoming calls are forwarded on the target if the user is busy or if the user does not answer the call.
     */
    BUSY_OR_NO_ANSWER = "BUSY_OR_NO_ANSWER"
}
export declare namespace OverflowCondition {
    function fromOverflowType(overflowType?: string): OverflowCondition | undefined;
    function toOverflowType(condition: OverflowCondition): string | undefined;
}
//# sourceMappingURL=overflow-condition.d.ts.map
/**
 * RoutingCapabilities represents the routing features available for a user.
 */
export declare class RoutingCapabilities {
    #private;
    /** Whether presentation routing is available */
    get presentationRoute(): boolean;
    /** Whether forward routing is available */
    get forwardRoute(): boolean;
    /** Whether overflow routing is available */
    get overflowRoute(): boolean;
    /** Whether Do Not Disturb can be activated */
    get dnd(): boolean;
}
//# sourceMappingURL=routing-capabilities.d.ts.map
import { RoutingState } from './routing-state';
/**
 * Event raised when a user's routing state has changed.
 * <p>
 * Received via the {@link Routing.ON_ROUTING_STATE_CHANGED} event, and also
 * in response to a {@link Routing.requestSnapshot} call.
 *
 * @see Routing.ON_ROUTING_STATE_CHANGED
 * @see Routing.requestSnapshot
 */
export declare class OnRoutingStateChanged {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The current routing state of the user, including forward, overflow and
     * Do Not Disturb settings.
     */
    get routingState(): RoutingState;
}
//# sourceMappingURL=routing-events.d.ts.map
import { DndState } from './dnd-state';
import { Overflow } from './overflow';
import { Forward } from './forward';
/**
 * RoutingState represente a user routing state. A routing state is
 * composed of four elements:
 * <table>
 * <caption>Routing state elements</caption>
 * <tr>
 * <td>Remote extension activation</td>
 * <td>When the user is configured with a remote extension, he has the
 * possibility to activate or deactivate this remote extension. when the remote
 * extension is de-activated, call are not presented on the mobile device.</td>
 * </tr>
 * <tr>
 * <td>Forward</td>
 * <td>The user can configure a forward, on his voice mail if any or on any
 * other number (depending on the cOmniPCX Enterprise configuration).</td>
 * </tr>
 * <tr>
 * <td>Overflow</td>
 * <td>The user can configure an overflow on his voice mail.
 * If a forward is configured, it is considered prior the overflow.</td>
 * </tr>
 * <tr>
 * <td>Do Not Disturb</td>
 * <td>When Do Not Disturb (DND) is activated, call are not presented to the
 * user.</td>
 * </tr>
 *
 * </table>
 */
export declare class RoutingState {
    #private;
    /**
     * Return the do not disturb state.
     */
    get dndState(): DndState;
    /**
     * Returns the forward.
     */
    get forward(): Forward;
    /**
     * Returns the overflow.
     */
    get overflow(): Overflow;
    /**
     * Returns whether the routing on remote extension is activated.
     */
    get remoteExtensionActivated(): boolean;
}
//# sourceMappingURL=routing-state.d.ts.map
/**
 * AdditionalDigitCollectionCriteria is used to define a digit collection strategy.
 */
export declare class AdditionalDigitCollectionCriteria {
    private abortDigits;
    private ignoreDigits;
    private backspaceDigits;
    private termDigits;
    private resetDigits;
    private startTimeout;
    private digitTimeout;
    /**
     * Constructs a new empty AdditionalDigitCollectionCriteria
     */
    constructor();
}
//# sourceMappingURL=add-digit-coll-criteria.d.ts.map
/**
 * CollectionCause represents the reason the digits collection ended.
 */
export declare enum CollectionCause {
    /**
     * A specific tone specified in the retrieval criteria is received.
     */
    FLUSCHAR_RECEIVED = "FLUSCHAR_RECEIVED",
    /**
     * The number of tones specified in the retrieval criteria is received.
     */
    CHAR_COUNT_REACHED = "CHAR_COUNT_REACHED",
    /**
     * The timeout specified in the retrieval criteria has elapsed.
     */
    TIMEOUT = "TIMEOUT",
    /**
     * An error occurs.
     */
    SF_TERMINATED = "SF_TERMINATED"
}
//# sourceMappingURL=collection-cause.d.ts.map
/**
 * RouteSession represents a route request session between a RSI point
 * and an application.
 * A route session is initiated by a RSI point by sending a
 * {@link Rsi.ON_ROUTE_REQUEST}.
 * The application selects a route and answers the request by calling
 * {@link Rsi.routeSelect}.
 */
export declare class RouteSession {
    #private;
    private constructor();
    /** This route session unique identifier */
    get routeCrid(): string;
    /** The call extension number */
    get caller(): string;
    /** The called number */
    get called(): string;
    /** The routed call reference */
    get routedCallRef(): string;
}
//# sourceMappingURL=route-session.d.ts.map
/**
 * RoutingCallerType represents the call origin of a route request.
 */
export declare enum RoutingCallerType {
    /**
     * The caller is internal.
     */
    INTERNAL = "INTERNAL",
    /**
     * The caller is external.
     */
    EXTERNAL = "EXTERNAL",
    /**
     * The caller origin is unknown.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=routing-caller-type.d.ts.map
/**
 * RoutingReason represents the possible reason associated to a route request.
 */
export declare enum RoutingReason {
    /**
     * First route request.
     */
    INITIAL = "INITIAL",
    /**
     * The call is rerouted because of no answer from initial route.
     */
    NOANSWER = "NOANSWER",
    /**
     * The call is rerouted because of busy initial route.
     */
    BUSY = "BUSY",
    /**
     * The call is rerouted because of not obtainable initial route.
     */
    NOT_OBTAINABLE = "NOT_OBTAINABLE",
    /**
     * Unknown reason.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=routing-reason.d.ts.map
import { RoutingReason } from './routing-reason';
import { Tones } from './tones';
export declare class OnToneGeneratedStop {
    #private;
    private constructor();
    /** The RSI point extension number */
    get rsiPoint(): string;
    /** The reference of the call on which the tones are played */
    get callRef(): string;
}
export declare class OnToneGeneratedStart {
    #private;
    private constructor();
    /** The RSI point extension number */
    get rsiPoint(): string;
    /** The reference of the call on which the tones are played */
    get callRef(): string;
    /** The tones types */
    get tonesTypes(): Tones;
}
export declare class OnDigitCollected {
    #private;
    private constructor();
    /** The RSI point extension number */
    get rsiPoint(): string;
    /** The reference of the call on which the tones are played */
    get callRef(): string;
}
export declare class OnRouteRequest {
    #private;
    private constructor();
    /** The RSI point extension number */
    get rsiPoint(): string;
}
export declare class OnRouteEnd {
    #private;
    private constructor();
    /** The RSI point extension number */
    get rsiPoint(): string;
    /** The routing session unique identifier */
    get routeCrid(): string;
    /** The routed call reference */
    get routedCallRef(): string;
    /** The routing reason */
    get reason(): RoutingReason;
}
//# sourceMappingURL=rsi-events.d.ts.map
/**
 * RsiPoint represents a RSI point. When a call is received by a RSI
 * routing point, a {@link Rsi.ON_ROUTE_REQUEST} is sent to the application.
 */
export declare class RsiPoint {
    #private;
    private constructor();
    /** This RSI point extension number */
    get number(): string;
    /** The name of this RSI point */
    get name(): string;
    /** The OmniPCX Enterprise node on which this RSI point is configured */
    get node(): number;
    /** Whether this RSI point is registered */
    get registered(): boolean;
}
//# sourceMappingURL=rsi-point.d.ts.map
/**
 * Tones represents tones that can be generated by a RSI point.
 */
export declare enum Tones {
    /**
     * The busy tone.
     */
    BUSY = "BUSY",
    /**
     * The ring back tone.
     */
    RINGBACK = "RINGBACK",
    /**
     * The silent tone.
     */
    SILENCE = "SILENCE",
    /**
     * The music tone.
     */
    MUSIC = "MUSIC",
    /**
     * The annoucement tone.
     */
    ANNOUNCEMENT = "ANNOUNCEMENT"
}
//# sourceMappingURL=tones.d.ts.map
import { CallData } from './call/call-data';
import { Leg } from './call/leg';
import { Participant } from './call/participant';
/**
 * Represents a call in progress, including its reference, associated data,
 * legs and participants.
 */
export declare class Call {
    #private;
    /**
     * The unique reference identifier of this call, used to identify it across
     * all telephony operations.
     */
    get callRef(): string;
    /**
     * The detailed data associated with this call, including state, ACD data,
     * tags and capabilities.
     */
    get callData(): CallData | null;
    /**
     * The legs associated with this call. Each leg represents a connection
     * endpoint on a device.
     */
    get legs(): Leg[] | null;
    /**
     * The participants involved in this call.
     */
    get participants(): Participant[] | null;
}
export declare namespace Call {
    /**
     * Represents the set of operations that can be performed on a call.
     * <p>
     * Each property indicates whether a specific action is currently available.
     * All capabilities default to `false` if not explicitly set.
     * <p>
     * A `CallCapabilities` instance is available via {@link CallData.capabilities}
     * on the call's associated {@link CallData}.
     */
    class CallCapabilities {
        #private;
        /** Whether a device can be added to this call. */
        get canAddDevice(): boolean;
        /** Whether a participant can be added to this call. */
        get canAddParticipant(): boolean;
        /** Whether this call can be intruded upon. */
        get canIntruded(): boolean;
        /** Whether intrusion is possible on the called party. */
        get canIntrusion(): boolean;
        /** Whether this call can be transferred. */
        get canTransfer(): boolean;
        /** Whether this call can be blind transferred. */
        get canBlindTransfer(): boolean;
        /** Whether this call can be merged with another call. */
        get canMerge(): boolean;
        /** Whether this call can be redirected. */
        get canRedirect(): boolean;
        /** Whether this call can be picked up. */
        get canPickedUp(): boolean;
        /** Whether this call can be redirected to voicemail. */
        get canRedirectToVoiceMail(): boolean;
        /** Whether this call can overflow to voicemail. */
        get canOverflowToVoiceMail(): boolean;
        /** Whether the current user can drop themselves from this call. */
        get canDropMe(): boolean;
        /** Whether this call can be terminated (all parties released). */
        get canTerminate(): boolean;
        /** Whether this call can be rejected. */
        get canReject(): boolean;
        /** Whether a callback can be requested on this call. */
        get canCallBack(): boolean;
        /** Whether this call can be parked. */
        get canPark(): boolean;
        /** Whether recording can be started on this call. */
        get canStartRecord(): boolean;
        /** Whether recording can be stopped on this call. */
        get canStopRecord(): boolean;
        /** Whether recording can be paused on this call. */
        get canPauseRecord(): boolean;
        /** Whether recording can be resumed on this call. */
        get canResumeRecord(): boolean;
        /** Whether a participant can be dropped from this call. */
        get canDropParticipant(): boolean;
        /** Whether a participant can be muted in this call. */
        get canMuteParticipant(): boolean;
        /** Whether a participant can be put on hold in this call. */
        get canHoldParticipant(): boolean;
    }
}
//# sourceMappingURL=call.d.ts.map
/**
 * Lists the different call causes.
 */
export declare enum CallCause {
    /**
     * Caller in a two-party call has disconnected before the call was answered.
     **/
    ABANDONED = "ABANDONED",
    /**
     * The call is receiving the network congestion tone.
     **/
    ALL_TRUNK_BUSY = "ALL_TRUNK_BUSY",
    /**
     * The call is receiving the busy tone.
     **/
    BUSY = "BUSY",
    /**
     * One party in a two-party call has disconnected after the call was answered.
     **/
    CLEARED = "CLEARED",
    /**
     * One party has left the conference call.
     **/
    PARTICIPANT_LEFT = "PARTICIPANT_LEFT",
    /**
     * This is a multi-party call.
     **/
    CONFERENCED = "CONFERENCED",
    /**
     * The call is receiving the invalid number tone.
     **/
    INVALID_NUMBER = "INVALID_NUMBER",
    /**
     * The destination cannot be reached.
     **/
    DESTINATION_NOT_OBTAINABLE = "DESTINATION_NOT_OBTAINABLE",
    /**
     * The device is in DND.
     **/
    DO_NOT_DISTURB = "DO_NOT_DISTURB",
    /**
     * The call has been forwarded.
     **/
    FORWARDED = "FORWARDED",
    /**
     * The call has been hanged up before answer.
     **/
    NOT_ANSWERED = "NOT_ANSWERED",
    /**
     * The call has been picked up.
     **/
    PICKED_UP = "PICKED_UP",
    /**
     * The call has been parked.
     **/
    PARKED = "PARKED",
    /**
     * The call has been redirected.
     **/
    REDIRECTED = "REDIRECTED",
    /**
     * The call goes on overflow destination.
     **/
    OVERFLOWN = "OVERFLOWN",
    /**
     * This is a transferred call.
     **/
    TRANSFERRED = "TRANSFERRED",
    /**
     * The call has been put in wait state.
     * @since 2.7.4
     */
    CAMP_ON = "CAMP_ON",
    /**
     * Unknown cause.
     **/
    UNKNOWN = "UNKNOWN",
    /**
     * Picked up tandem.
     **/
    PICKED_UP_TANDEM = "PICKED_UP_TANDEM",
    /**
     * The call is a call back.
     **/
    CALL_BACK = "CALL_BACK",
    /**
     * The call is recall (e.g. on HELD call indicates that device rings back).
     **/
    RECALL = "RECALL",
    /**
     * CCD context: call distribution
     **/
    DISTRIBUTED = "DISTRIBUTED",
    /**
     * CCD context: call enters in distribution
     **/
    ACD_ENTER_DISTRIBUTION = "ACD_ENTER_DISTRIBUTION",
    /**
     * CCD context: pilot is not open
     **/
    RESOURCES_NOT_AVAILABLE = "RESOURCES_NOT_AVAILABLE",
    /**
     * CCD context: supervisor is listening the agent conversation
     **/
    SUPERVISOR_LISTENING = "SUPERVISOR_LISTENING",
    /**
     * CCD context: supervisor is fully intruded in the agent conversation
     **/
    SUPERVISOR_INTRUSION = "SUPERVISOR_INTRUSION",
    /**
     * CCD context: supervisor can speak to the agent
     **/
    SUPERVISOR_RESTRICT_INTRUSION = "SUPERVISOR_RESTRICT_INTRUSION",
    /**
     * CCD context: No available agent
     **/
    NO_AVAILABLE_AGENT = "NO_AVAILABLE_AGENT",
    /**
     * Physical phone set device is off the hook
     **/
    LOCKOUT = "LOCKOUT"
}
//# sourceMappingURL=call-cause.d.ts.map
import { PartyInfo } from '../../common/party-info';
import { Call } from '../call';
import { MediaState } from './media-state';
import { RecordState } from './record-state';
import { TrunkIdentification } from '../trunk-indentification';
import { AcdData } from './ccd/acd-data';
import { CorrelatorData } from './correlator-data';
import { Tag } from './tag';
/**
 * Represents the data associated with a call.
 * <p>
 * Aggregates all relevant information about a call including the parties involved,
 * call state, recording state, tags, capabilities, ACD data, trunk information,
 * and attached correlator data.
 */
export declare class CallData {
    #private;
    /**
     * The initial party called in this call.
     */
    get initialCalled(): PartyInfo | null;
    /**
     * The last party that redirected this call, if different from the initial called party.
     * `null` if the call was never redirected.
     *
     * @since 2.7.4
     */
    get lastRedirecting(): PartyInfo | null;
    /**
     * Whether the call was initiated from a device.
     */
    get deviceCall(): boolean;
    /**
     * Whether this call is anonymous.
     */
    get anonymous(): boolean;
    /**
     * The unique identifier of this call.
     */
    get callUUID(): string | null;
    /**
     * The current media state of the call.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState;
    /**
     * The recording state of this call.
     * `null` if the call is not being recorded.
     */
    get recordState(): RecordState | null;
    /**
     * The tags associated with this call.
     */
    get tags(): Tag[] | null;
    /**
     * The operations currently available on this call.
     */
    get capabilities(): Call.CallCapabilities | null;
    /**
     * The correlator data attached to this call, if any.
     * <p>
     * May be derived from either string-based associated data or hexadecimal
     * binary data, whichever is present.
     */
    get correlatorData(): CorrelatorData | null;
    /**
     * The account information associated with this call, used for charging purposes.
     */
    get accountInfo(): string | null;
    /**
     * The ACD data for this call.
     * `null` if the call was not handled by an ACD.
     */
    get acdCallData(): AcdData | null;
    /**
     * The trunk identification for external calls.
     * `null` if the call is internal or trunk information is unavailable.
     */
    get trunkIdentification(): TrunkIdentification | null;
}
//# sourceMappingURL=call-data.d.ts.map
/**
 * Represents the information associated to an ACD call.
 */
export declare class AcdCallInfo {
    #private;
    /**
     * Private constructor. Use `Info.fromJson()` to create instances.
     * @param queueWaitingTime - Waiting time in the queue
     * @param globalWaitingTime - Global waiting time in the CCD
     * @param agentGroup - Agent group ID
     * @param local - Whether the call is local
     */
    private constructor();
    /**
     * Returns the waiting time in a queue from which the call has been distributed.
     * @returns The estimated queue waiting time.
     */
    get queueWaitingTime(): number | null;
    /**
     * Returns the global waiting time in the CCD.
     * @returns The estimated global waiting time.
     */
    get globalWaitingTime(): number | null;
    /**
     * Returns the agent group the agent who answered the call is logged in.
     * @returns The agent group.
     */
    get agentGroup(): number | null;
    /**
     * Returns whether it's a local ACD call.
     * @returns `true` if it is a local ACD call; `false` otherwise.
     */
    get local(): boolean;
}
//# sourceMappingURL=acd-call-info.d.ts.map
import { AcdCallInfo } from './acd-call-info';
import { PilotTransferInfo } from './pilot-transfer-info';
import { QueueData } from './queue-data';
/**
 * Represents the ACD extension for an ACD call.
 */
export declare class AcdData {
    #private;
    /**
     * Private constructor. Use `AcdData.fromJson()` to create instances.
     * @param callInfo - The ACD call information
     * @param queueData - The queue data
     * @param pilotNumber - Pilot number
     * @param rsiNumber - RSI number
     * @param supervisedTransfer - Whether transfer was supervised
     * @param pilotTransferInfo - Information about possible transfer
     */
    private constructor();
    /**
     * Returns the information associated with this ACD call.
     * @returns The ACD call information, or `null` if not available.
     */
    get callInfo(): AcdCallInfo | null;
    /**
     * Returns the information about the queue that distributed this call.
     * @returns The queue data, or `null` if not available.
     */
    get queueData(): QueueData | null;
    /**
     * Returns the pilot number that distributed this call.
     * @returns The pilot number, or `null` if not available.
     */
    get pilotNumber(): string | null;
    /**
     * Returns the RSI point that distributed this call.
     * @returns The RSI number, or `null` if not available.
     */
    get rsiNumber(): string | null;
    /**
     * Indicates whether the transfer on the pilot was supervised.
     * @returns `true` if the transfer was supervised; `false` otherwise.
     */
    get isSupervisedTransfer(): boolean;
    /**
     * Returns information about a possible transfer on a pilot.
     * @returns The pilot transfer information, or `null` if not available.
     */
    get pilotTransferInfo(): PilotTransferInfo | null;
}
//# sourceMappingURL=acd-data.d.ts.map
/**
 * Represents an immutable collection of skills required to handle a call in a contact center.
 *
 * This class provides convenient access to individual skills by their identifier,
 * allows checking for existence, and exposes all available skills or their identifiers.
 * Skills are used by the <em>Advanced Call Routing</em> strategy to influence
 * how calls are distributed among agents.
 *
 * <b>Example usage:</b>
 *
 * ```ts
 * // Create a call profile using varargs
 * const profile = new CallProfile(
 *     new CallProfile.Skill(101, 3, true),
 *     new CallProfile.Skill(102, 2, false),
 *     new CallProfile.Skill(103, 1, false)
 * );
 *
 * // Access a skill
 * const s = profile.get(101);
 * console.log(`Skill ${s?.number} mandatory? ${s?.mandatory}`);
 *
 * // Check if a skill exists
 * const hasSkill = profile.contains(102);
 *
 * // Iterate over all skills
 * for (const skill of profile.skills) {
 *     console.log(`${skill.number}: level ${skill.level}`);
 * }
 * ```
 */
export declare class CallProfile {
    #private;
    /**
     * Creates a CallProfile.
     *
     * Can be called in three ways:
     * 1. No arguments â†’ empty profile
     * 2. Varargs of skills â†’ `new CallProfile(skill1, skill2, ...)`
     * 3. Single iterable (array, Set, etc.) of skills â†’ `new CallProfile([skill1, skill2])`
     */
    constructor(...args: (CallProfile.Skill | Iterable<CallProfile.Skill>)[]);
    /**
     * Returns the skill with the specified number.
     *
     * @param number - The skill number (identifier)
     * @returns The {@link CallProfile.Skill} with the given number, or `undefined` if not present
     */
    get(number: number): CallProfile.Skill | undefined;
    /**
     * Determines whether a skill with the specified number exists in this profile.
     *
     * @param number - The skill number to search for
     * @returns `true` if the skill exists; `false` otherwise
     */
    contains(number: number): boolean;
    /**
     * Returns a read-only set of all skill numbers contained in this profile.
     *
     * @returns A `ReadonlySet` of skill identifiers
     */
    get skillNumbers(): ReadonlySet<number>;
    /**
     * Returns a read-only collection of all skills contained in this profile.
     *
     * @returns A `ReadonlyArray` of {@link CallProfile.Skill} instances
     */
    get skills(): ReadonlyArray<CallProfile.Skill>;
}
/**
 * Namespace for {@link CallProfile} related types.
 */
export declare namespace CallProfile {
    /**
     * Represents a skill assigned to a {@link CallProfile}.
     *
     * Each skill has a unique number (identifier), a proficiency level,
     * and a flag indicating whether it is mandatory for advanced call routing.
     */
    class Skill {
        #private;
        /**
         * Constructs a new skill instance.
         *
         * @param number - The unique skill identifier
         * @param level - The skill proficiency level
         * @param mandatory - Whether this skill is mandatory
         */
        constructor(number: number, level: number, mandatory: boolean);
        /**
         * Returns the unique identifier of this skill.
         *
         * @returns The skill number, or `null` if not set
         */
        get number(): number | null;
        /**
         * Returns the proficiency level of this skill.
         *
         * Higher values indicate greater expertise or priority for call routing.
         *
         * @returns The skill level, or `null` if not set
         */
        get level(): number | null;
        /**
         * Indicates whether this skill is mandatory when evaluating a call profile.
         *
         * @returns `true` if the skill is mandatory; `false` otherwise
         */
        get mandatory(): boolean;
    }
}
//# sourceMappingURL=call-profile.d.ts.map
import { PilotTransferInfo } from './pilot-transfer-info';
/**
 * Represents a pilot handling a call, including its queue information,
 * transfer status, and possible pilot transfer details.
 */
export declare class PilotInfo {
    #private;
    /**
     * Private constructor. Use `PilotInfo.fromJson()` to create instances.
     * @param number - The pilot number
     * @param waitingTime - Estimated waiting time in the queue (seconds)
     * @param saturation - Indicates whether the queue is saturated
     * @param supervisedTransfer - Indicates whether the transfer can be supervised
     * @param pilotTransferInfo - Information about possible pilot transfer
     */
    private constructor();
    /**
     * Returns the pilot number.
     * @returns The pilot number, or `null` if not available
     */
    get number(): string | null;
    /**
     * Returns the estimated waiting time in the queue.
     * @returns The waiting time in seconds, or `null` if not available
     */
    get waitingTime(): number | null;
    /**
     * Indicates whether this queue is currently saturated.
     * @returns `true` if the queue is saturated; `false` otherwise
     */
    get saturation(): boolean;
    /**
     * Indicates whether the transfer on this pilot can be supervised.
     * @returns `true` if supervised transfer is possible; `false` otherwise
     */
    get supervisedTransfer(): boolean;
    /**
     * Returns information about a possible transfer on this pilot.
     * @returns The {@link PilotTransferInfo}, or `null` if not available
     */
    get pilotTransferInfo(): PilotTransferInfo | null;
}
//# sourceMappingURL=pilot-info.d.ts.map
/**
 * PilotStatus represents the possible state of a CCD pilot.
 */
export declare enum PilotStatus {
    /**
     * The pilot is opened.
     */
    OPEN = "OPEN",
    /**
     * The pilot is blocked.
     */
    BLOCKED = "BLOCKED",
    /**
     * The pilot is on a blocked on a rule.
     */
    BLOCKED_ON_RULE = "BLOCKED_ON_RULE",
    /**
     * The pilot is blocked on a blocking rule.
     */
    BLOCKED_ON_BLOCKED_RULE = "BLOCKED_ON_BLOCKED_RULE",
    /**
     * The pilot is in general forwarding.
     */
    GENERAL_FORWARDING = "GENERAL_FORWARDING",
    /**
     * The pilot is in general forwarding on a rule.
     */
    GENERAL_FORWARDING_ON_RULE = "GENERAL_FORWARDING_ON_RULE",
    /**
     * The pilot is blocked while in general forwarding on a rule.
     */
    BLOCKED_ON_GENERAL_FORWARDING_RULE = "BLOCKED_ON_GENERAL_FORWARDING_RULE",
    /**
     * Other state
     */
    OTHER = "OTHER"
}
//# sourceMappingURL=pilot-status.d.ts.map
import { PilotStatus } from './pilot-status';
/**
 * Represents the information about a possible transfer on a pilot.
 */
export declare class PilotTransferInfo {
    #private;
    /**
     * Private constructor. Use `PilotTransferInfo.fromJson()` to create instances.
     * @param transferPossible - Indicates whether the transfer is possible
     * @param pilotStatus - The current status of the pilot
     */
    private constructor();
    /**
     * Indicates whether the transfer on the pilot is possible.
     * @returns `true` if transfer is possible; `false` otherwise.
     */
    get transferPossible(): boolean;
    /**
     * Returns the current status of the pilot.
     * @returns The pilot status, or `null` if not available.
     */
    get pilotStatus(): PilotStatus | null;
}
//# sourceMappingURL=pilot-transfer-info.d.ts.map
import { CallProfile } from './call-profile';
/**
 * Represents the set of criteria used to query a CCD pilot for call transfer possibilities.
 *
 * Each criterion is optional. If a field is not set (`undefined`), it will be ignored
 * when building the query.
 *
 * Typical usage:
 *
 * ```ts
 * const params = new PilotTransferQueryParameters()
 *      .setAgentNumber("1234")
 *      .setPriorityTransfer(true)
 *      .setCallProfile(profile);
 * ```
 *
 * @since 2.7.4
 */
export declare class PilotTransferQueryParameters {
    #private;
    /** Constructs an empty `PilotTransferQueryParameters` object. */
    constructor();
    /**
     * Returns the agent number criterion.
     *
     * @returns The agent number, or `null` if not set
     */
    get agentNumber(): string | null;
    /**
     * Sets the agent number criterion.
     *
     * @param agentNumber - The agent number to filter by
     * @returns This instance for fluent chaining
     */
    setAgentNumber(agentNumber: string): this;
    /**
     * Returns the priority transfer criterion.
     *
     * @returns `true` for priority transfers, `false` for non-priority,
     *          or `false` if not set (default)
     */
    get priorityTransfer(): boolean;
    /**
     * Sets the priority transfer criterion.
     *
     * @param priorityTransfer - `true` for priority only, `false` for non-priority,
     *                            or `undefined` to ignore
     * @returns This instance for fluent chaining
     */
    setPriorityTransfer(priorityTransfer: boolean | undefined): this;
    /**
     * Returns the supervised transfer criterion.
     *
     * @returns `true` for supervised transfers, `false` for unsupervised,
     *          or `false` if not set (default)
     */
    get supervisedTransfer(): boolean;
    /**
     * Sets the supervised transfer criterion.
     *
     * @param supervisedTransfer - `true` for supervised only, `false` for unsupervised,
     *                             or `undefined` to ignore
     * @returns This instance for fluent chaining
     */
    setSupervisedTransfer(supervisedTransfer: boolean | undefined): this;
    /**
     * Returns the call profile criterion.
     *
     * @returns The {@link CallProfile} to match, or `null` if not set
     */
    get callProfile(): CallProfile | null;
    /**
     * Sets the call profile criterion.
     *
     * @param callProfile - The {@link CallProfile} to match
     * @returns This instance for fluent chaining
     */
    setCallProfile(callProfile: CallProfile | undefined): this;
    /**
     * Returns `true` if an agent number has been set.
     *
     * @returns `true` if `agentNumber` is defined and non-empty
     */
    get hasAgentNumber(): boolean;
    /**
     * Returns `true` if the priority transfer criterion is used.
     *
     * @returns `true` if `priorityTransfer` is defined
     */
    get hasPriorityTransferCriteria(): boolean;
    /**
     * Returns `true` if the supervised transfer criterion is used.
     *
     * @returns `true` if `supervisedTransfer` is defined
     */
    get hasSupervisedTransferCriteria(): boolean;
    /**
     * Returns `true` if a call profile criterion has been set.
     *
     * @returns `true` if `callProfile` is defined
     */
    get hasCallProfile(): boolean;
}
//# sourceMappingURL=pilot-transfer-query-param.d.ts.map
/**
 * Represents information about the queue that distributed a call.
 */
export declare class QueueData {
    #private;
    /**
     * Private constructor. Use `QueueData.fromJson()` to create instances.
     * @param waitingTime - The estimated waiting time in the queue
     * @param saturated - Indicates whether the queue is saturated
     */
    private constructor();
    /**
     * Returns the estimated waiting time in the queue.
     * @returns The waiting time in seconds, or `null` if not available.
     */
    get waitingTime(): number | null;
    /**
     * Indicates whether the queue is currently saturated.
     * @returns `true` if the queue is saturated; `false` otherwise.
     */
    get saturated(): boolean;
}
//# sourceMappingURL=queue-data.d.ts.map
/**
 * Represents correlator data attached to a call.
 * <p>
 * Correlator data is application-provided information (limited to 32 bytes)
 * that travels with a call. It is typically used to carry application context
 * from one party to another across telephony operations such as transfer.
 * <p>
 * For example, user A receives an external call and attaches correlator data
 * to it. When user A transfers the call to user B, user B receives a
 * {@link Telephony.ON_CALL_CREATED} event whose {@link CallData} contains the
 * same correlator data, allowing user B's application to retrieve the original
 * context.
 *
 * @example
 * ```typescript
 * // Attach correlator data to a call
 * const data = new CorrelatorData("transactionId=abc123");
 * await O2G.telephony.makeCallEx("1234", "5678", true, false, data);
 *
 * // Read correlator data from a received call event
 * O2G.telephony.on(Telephony.ON_CALL_CREATED, (event) => {
 *     const correlator = event.callData?.correlatorData;
 *     if (correlator) {
 *         console.log("Context:", correlator.asString());
 *     }
 * });
 * ```
 */
export declare class CorrelatorData {
    #private;
    /**
     * Creates a new `CorrelatorData` from a string or byte array.
     * <p>
     * Strings are encoded as UTF-8. The byte value `0x00` is not permitted.
     *
     * @param value the correlator data as a string, `Buffer`, or `Uint8Array`
     * @throws TypeError if the value is not a string or byte array
     * @throws Error if the value contains the byte `0x00`
     */
    constructor(value: string | Buffer | Uint8Array);
    /**
     * Returns the correlator data as a byte array.
     *
     * @returns the correlator data as a `Buffer`
     */
    asByteArray(): Buffer;
    /**
     * Returns the correlator data as a UTF-8 string.
     *
     * @returns the correlator data as a string
     */
    asString(): string;
}
//# sourceMappingURL=correlator-data.d.ts.map
import { MediaState } from './media-state';
/**
 * Represents a call leg â€” a connection endpoint on a specific device within a call.
 * <p>
 * Each leg is associated with a device and carries its current media state,
 * remote ringing status, and the set of operations available on that leg.
 */
export declare class Leg {
    #private;
    /**
     * The identifier of the device associated with this leg.
     */
    get deviceId(): string;
    /**
     * The current media state of this leg.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState;
    /**
     * Whether the remote party is currently ringing on this leg.
     */
    get ringingRemote(): boolean;
    /**
     * The set of operations available on this leg.
     */
    get capabilities(): Leg.LegCapabilities | null;
}
export declare namespace Leg {
    /**
     * Represents the set of operations available on a call leg.
     * <p>
     * Each capability is a boolean indicating whether the leg currently supports
     * that operation. All capabilities default to `false` if not set.
     */
    class LegCapabilities {
        #private;
        /** Whether this leg can answer an incoming call. */
        get canAnswer(): boolean;
        /** Whether this leg can be dropped from the call. */
        get canDrop(): boolean;
        /** Whether this leg can be put on hold. */
        get canHold(): boolean;
        /** Whether this leg can be retrieved from hold. */
        get canRetrieve(): boolean;
        /** Whether this leg can be reconnected (cancel a consultation call). */
        get canReconnect(): boolean;
        /** Whether this leg can be muted. */
        get canMute(): boolean;
        /** Whether this leg can be unmuted. */
        get canUnMute(): boolean;
        /** Whether DTMF codes can be sent on this leg. */
        get canSendDtmf(): boolean;
        /** Whether the call can be switched to another device from this leg. */
        get canSwitchDevice(): boolean;
    }
}
//# sourceMappingURL=leg.d.ts.map
/**
 * MediaState represents a media state.
 */
export declare enum MediaState {
    /**
     * Unknown media state. O2G server is unable to provide the information.
     */
    UNKNOWN = "UNKNOWN",
    /**
     * The OFF_HOOK state is used when the device is busy for other reasons than a call; typically during service activation.
     */
    OFF_HOOK = "OFF_HOOK",
    /**
     * Idle state, no activity on the media.
     */
    IDLE = "IDLE",
    /**
     * The call is releasing.
     */
    RELEASING = "RELEASING",
    /**
     * A make call is in progress.
     */
    DIALING = "DIALING",
    /**
     * The call has been placed on hold.
     */
    HELD = "HELD",
    /**
     * An incoming call is ringing.
     */
    RINGING_INCOMING = "RINGING_INCOMING",
    /**
     * An outgoing call is in progress and the other party is ringing.
     */
    RINGING_OUTGOING = "RINGING_OUTGOING",
    /**
     * The call is active.
     */
    ACTIVE = "ACTIVE"
}
//# sourceMappingURL=media-state.d.ts.map
import { PartyInfo } from '../../common/party-info';
import { MediaState } from './media-state';
/**
 * Represents a participant in a call.
 * <p>
 * Participants are identified by a unique `participantId` and may optionally
 * include identity information. Flags indicate whether the participant is
 * anonymous or cannot be dropped, and their current media state is also tracked.
 */
export declare class Participant {
    #private;
    /**
     * The unique identifier of this participant.
     */
    get participantId(): string;
    /**
     * The identity of this participant.
     */
    get identity(): PartyInfo | null;
    /**
     * Whether this participant is anonymous.
     */
    get anonymous(): boolean;
    /**
     * Whether this participant cannot be dropped from the call.
     */
    get undroppable(): boolean;
    /**
     * The current media state of this participant.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState;
}
//# sourceMappingURL=participant.d.ts.map
/**
 * RecordState represent the recording state of a call.
 */
export declare enum RecordState {
    /**
     * The recording is paused.
     */
    PAUSED = "PAUSED",
    /**
     * The recording is in progress.
     */
    RECORDING = "RECORDING"
}
//# sourceMappingURL=record-state.d.ts.map
/**
 * Represents a tag associated with a call.
 *
 * A tag consists of a `name`, an optional `value`, and optional `visibilities`
 * indicating who can see this tag. Use `Tag.fromJson()` to create instances
 * from JSON data.
 */
export declare class Tag {
    #private;
    /**
     * Private constructor. Use `Tag.fromJson()` to create instances.
     *
     * @param name - The tag name
     * @param value - Optional tag value
     * @param visibilities - Optional array of tag visibilities
     */
    private constructor();
    /**
     * Returns the name of the tag.
     *
     * @returns The tag name as a string
     */
    get name(): string;
    /**
     * Returns the value of the tag.
     *
     * @returns The tag value as a string, or `null` if not set
     */
    get value(): string | null;
    /**
     * Returns the visibilities of the tag.
     *
     * @returns An array of strings representing visibilities, or `null` if not set
     */
    get visibilities(): string[] | null;
}
//# sourceMappingURL=tag.d.ts.map
import { PartyInfo } from '../common/party-info';
/**
 * Represents a callback request in the system.
 *
 * A callback corresponds to a request from a party to be called back at a later time.
 * This class contains the unique callback identifier and the information about
 * the party who requested it.
 *
 * Use `Callback.fromJson()` to create instances from JSON data.
 */
export declare class Callback {
    #private;
    /**
     * Private constructor. Use `Callback.fromJson()` to create instances.
     *
     * @param callbackId - The unique identifier of the callback request
     * @param partyInfo - The party who requested the callback
     */
    private constructor();
    /**
     * Returns the unique identifier of the callback request.
     *
     * @returns The callback ID as a string
     */
    get callbackId(): string;
    /**
     * Returns the information about the party who requested the callback.
     *
     * @returns A `PartyInfo` object containing the requestorâ€™s details
     */
    get partyInfo(): PartyInfo;
}
//# sourceMappingURL=callback.d.ts.map
import { OperationalState } from './operational-state';
/**
 * Represents the current operational state of a device.
 *
 * Each device has a unique `deviceId` and an associated `OperationalState`.
 * Use `DeviceState.fromJson()` to create instances from JSON data.
 */
export declare class DeviceState {
    #private;
    /**
     * Private constructor. Use `DeviceState.fromJson()` to create instances.
     *
     * @param deviceId - The unique identifier of the device
     * @param state - The current operational state of the device
     */
    private constructor();
    /**
     * Returns the unique identifier of the device.
     *
     * @returns The device ID as a string
     */
    get deviceId(): string;
    /**
     * Returns the operational state of the device.
     *
     * @returns The `OperationalState` of the device
     */
    get state(): OperationalState;
}
//# sourceMappingURL=device-state.d.ts.map
/**
 * OperationalState represents a device dynamic state.
 */
export declare enum OperationalState {
    /**
     * The device is in service.
     */
    IN_SERVICE = "IN_SERVICE",
    /**
     * The device is out of service.
     */
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
    /**
     * The dynamic state of the device can not be retrieved.
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=operational-state.d.ts.map
/**
 * Represents the hunting groups associated with a user.
 *
 * In this system, a user can be a member of **only one active hunting group**
 * at a time, but may have multiple groups available in their configuration.
 * This class tracks both the complete list of groups and the current group
 * the user is assigned to.
 *
 * Use `HuntingGroups.fromJson()` to create instances from JSON data.
 */
export declare class HuntingGroups {
    #private;
    /**
     * Private constructor. Use `HuntingGroups.fromJson()` to create instances.
     *
     * @param hgList - Optional list of hunting group names available to the user
     * @param currentHg - Optional name of the current hunting group
     */
    private constructor();
    /**
     * Returns the list of hunting groups available to the user.
     *
     * @returns An array of hunting group names, or `null` if no groups are defined
     */
    get list(): string[] | null;
    /**
     * Returns the hunting group the user is currently a member of.
     *
     * @returns The current hunting group name, or `null` if not assigned
     */
    get current(): string | null;
}
//# sourceMappingURL=hunting-groups.d.ts.map
/**
 * Represents the status of a user in a hunting group.
 *
 * A hunting group is a collection of agents or devices that can receive calls
 * distributed by a contact center. This class indicates whether the user
 * is currently logged on to the hunting group.
 *
 * Use `HuntingGroupStatus.fromJson()` to create instances from JSON data.
 */
export declare class HuntingGroupStatus {
    #private;
    /**
     * Private constructor. Use `HuntingGroupStatus.fromJson()` to create instances.
     *
     * @param logon - Whether the user is logged on to the hunting group
     */
    private constructor();
    /**
     * Indicates whether the user is currently logged on to the hunting group.
     *
     * @returns `true` if logged on; `false` otherwise
     */
    get loggedOn(): boolean;
}
//# sourceMappingURL=hunting-group-status.d.ts.map
/**
 * Represents a mini message exchanged between two users.
 *
 * A mini message typically includes the sender, the date and time it was sent,
 * and the message text itself. Instances of this class are **immutable** once created.
 *
 */
export declare class MiniMessage {
    #private;
    /**
     * Private constructor. Use `MiniMessage.fromJson()` to create instances.
     *
     * @param sender - Optional sender of the message
     * @param dateTime - Optional date/time when the message was sent
     * @param message - Optional text of the message
     */
    private constructor();
    /**
     * Returns the sender of this mini message.
     *
     * @returns The sender's name or `null` if not set
     */
    get sender(): string | null;
    /**
     * Returns the date and time when this mini message was sent.
     *
     * @returns A `Date` object, or `null` if not set
     */
    get date(): Date | null;
    /**
     * Returns the text content of this mini message.
     *
     * @returns The message text, or `null` if not set
     */
    get message(): string | null;
}
//# sourceMappingURL=mini-message.d.ts.map
export declare enum RecordingAction {
    START = "Start",
    STOP = "Stop",
    PAUSE = "Pause",
    RESUME = "Resume"
}
//# sourceMappingURL=RecordingAction.d.ts.map
import { Device } from '../common/device';
import { Call } from './call';
import { UserState } from './user/user-state';
/**
 * Represents the telephonic state of a user, including active calls,
 * device capabilities, and the current user state.
 *
 * This class provides read-only access to:
 * - the list of active calls
 * - the capabilities of the user's devices
 * - the current state of the user (e.g., available, busy)
 */
export declare class TelephonicState {
    #private;
    /**
     * Returns the collection of active calls for this user.
     *
     * @returns An array of `Call` objects, or `null` if not set
     */
    get calls(): Call[] | null;
    /**
     * Returns the collection of device capabilities for this user.
     *
     * @returns An array of `Device.Capabilities` objects, or `null` if not set
     */
    get deviceCapabilities(): Device.Capabilities[] | null;
    /**
     * Returns the current user state.
     *
     * @returns The `UserState` of the user, or `null` if not set
     */
    get userState(): UserState | null;
}
//# sourceMappingURL=telephonic-state.d.ts.map
import { CallCause } from './call/call-cause';
import { CallData } from './call/call-data';
import { Leg } from './call/leg';
import { Participant } from './call/participant';
import { DeviceState } from './device/device-state';
import { TelephonicState } from './telephonic-state';
import { UserState } from './user/user-state';
import { Device } from '../common/device';
/**
 * Event raised when a new call has been created.
 * <p>
 * Received via the {@link Telephony.ON_CALL_CREATED} event.
 *
 * @see Telephony.ON_CALL_CREATED
 */
export declare class OnCallCreated {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The call reference.
     */
    get callRef(): string;
    /**
     * The cause of the call creation event.
     */
    get cause(): CallCause | null;
    /**
     * The call data associated with the new call.
     */
    get callData(): CallData | null;
    /**
     * The initiator of the call, if available.
     */
    get initiator(): string | null;
    /**
     * The legs associated with the call.
     */
    get legs(): Leg[] | null;
    /**
     * The participants in the call.
     */
    get participants(): Participant[] | null;
    /**
     * The updated device capabilities following the call creation.
     */
    get deviceCapabilities(): Device.Capabilities[] | null;
}
/**
 * Event raised when an existing call has been modified.
 * <p>
 * This event is raised for any change to a call's state, participants or legs â€”
 * including hold, retrieve, transfer, merge and conference operations.
 * <p>
 * Received via the {@link Telephony.ON_CALL_MODIFIED} event.
 *
 * @see Telephony.ON_CALL_MODIFIED
 */
export declare class OnCallModified {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The call reference of the modified call.
     */
    get callRef(): string;
    /**
     * The cause of the call modification event.
     */
    get cause(): CallCause | null;
    /**
     * The previous call reference, present when this call replaced another call.
     */
    get previousCallRef(): string | null;
    /**
     * The call reference that replaced this call, if applicable.
     */
    get replacedByCallRef(): string | null;
    /**
     * The updated call data.
     */
    get callData(): CallData | null;
    /**
     * The legs that were modified in this event.
     */
    get modifiedLegs(): Leg[] | null;
    /**
     * The legs that were added in this event.
     */
    get addedLegs(): Leg[] | null;
    /**
     * The legs that were removed in this event.
     */
    get removedLeg(): Leg[] | null;
    /**
     * The participants whose state was modified in this event.
     */
    get modifiedParticipants(): Participant[] | null;
    /**
     * The participants that were added in this event.
     */
    get addedParticipants(): Participant[] | null;
    /**
     * The identifiers of the participants that were removed in this event.
     */
    get removedParticipants(): string[] | null;
    /**
     * The updated device capabilities following the call modification.
     */
    get deviceCapabilities(): Device.Capabilities[] | null;
}
/**
 * Event raised when a call has been removed.
 * <p>
 * Received via the {@link Telephony.ON_CALL_REMOVED} event.
 *
 * @see Telephony.ON_CALL_REMOVED
 */
export declare class OnCallRemoved {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The reference of the call that was removed.
     */
    get callRef(): string;
    /**
     * The cause of the call removal.
     */
    get cause(): CallCause | null;
    /**
     * The new destination if the call was forwarded or redirected before removal.
     */
    get newDestination(): string | null;
    /**
     * The updated device capabilities following the call removal.
     */
    get deviceCapabilities(): Device.Capabilities[] | null;
}
/**
 * Event raised when the state of one or more devices has been modified.
 * <p>
 * Received via the {@link Telephony.ON_DEVICE_STATE_MODIFIED} event.
 *
 * @see Telephony.ON_DEVICE_STATE_MODIFIED
 */
export declare class OnDeviceStateModified {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The updated states of the modified devices.
     */
    get deviceStates(): DeviceState[] | null;
}
/**
 * Event raised when the dynamic state of a user has changed.
 * <p>
 * Currently carries the user's hunting group logged-on state.
 * <p>
 * Received via the {@link Telephony.ON_DYNAMIC_STATE_CHANGED} event.
 *
 * @see Telephony.ON_DYNAMIC_STATE_CHANGED
 */
export declare class OnDynamicStateChanged {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * Whether the user is currently logged on to their hunting group.
     */
    get logged(): boolean;
}
/**
 * Event raised in response to a snapshot request, containing the full telephonic
 * state of the user.
 * <p>
 * Received via the {@link Telephony.ON_TELEPHONY_STATE} event, triggered by
 * {@link Telephony.requestSnapshot}.
 *
 * @see Telephony.ON_TELEPHONY_STATE
 * @see Telephony.requestSnapshot
 */
export declare class OnTelephonyState {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The full telephonic state of the user, including active calls and device capabilities.
     */
    get state(): TelephonicState | null;
}
/**
 * Event raised when a user's state has been modified.
 * <p>
 * Received via the {@link Telephony.ON_USER_STATE_MODIFIED} event.
 *
 * @see Telephony.ON_USER_STATE_MODIFIED
 */
export declare class OnUserStateModified {
    #private;
    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string;
    /**
     * The updated user state.
     */
    get state(): UserState;
}
//# sourceMappingURL=telephony-events.d.ts.map
/**
 * Represents the trunk identification of an external call.
 * <p>
 * Provides the network timeslot and trunk NEQTs (Network Equipment Queuing
 * Terminations) associated with the trunk used for the call.
 * Available via {@link CallData.trunkIdentification} on external calls.
 */
export declare class TrunkIdentification {
    #private;
    /**
     * The network timeslot used by this trunk.
     */
    get networkTimeslot(): number;
    /**
     * The list of trunk NEQTs (Network Equipment Queuing Terminations).
     */
    get trunkNeqt(): number[];
}
//# sourceMappingURL=trunk-indentification.d.ts.map
/**
 * Represent the possible user states.
 */
export declare enum UserState {
    /**
     * The user is free, there is no call in progress
     */
    FREE = "FREE",
    /**
     * The user is busy
     */
    BUSY = "BUSY",
    /**
     * The user state is unknown
     */
    UNKNOWN = "UNKNOWN"
}
//# sourceMappingURL=user-state.d.ts.map
/**
 * Represents the preferred settings of a user.
 *
 * This class provides read-only access to language preferences for both the GUI
 * and the OXE system.
 */
export declare class Preferences {
    #private;
    /**
     * Private constructor. Use `Preferences.fromJson()` to create instances.
     *
     * @param guiLanguage - Optional preferred GUI language code
     * @param oxeLanguage - Optional preferred OXE language code
     */
    private constructor();
    /**
     * Returns the preferred GUI language.
     *
     * @returns The GUI language code, or `null` if not set
     */
    get guiLanguage(): string | null;
    /**
     * Returns the preferred OXE language.
     *
     * @returns The OXE language code, or `null` if not set
     */
    get oxeLanguage(): string | null;
}
//# sourceMappingURL=preferences.d.ts.map
/**
 * Represents the languages supported by a user.
 *
 * This class provides read-only access to both the general supported languages
 * and the GUI-specific supported languages.
 */
export declare class SupportedLanguages {
    #private;
    /**
     * Private constructor. Use `SupportedLanguages.fromJson()` to create instances.
     *
     * @param supportedLanguages - Array of supported language codes
     * @param supportedGuiLanguages - Optional array of supported GUI language codes
     */
    private constructor();
    /**
     * Returns the list of supported languages.
     *
     * @returns An array of language codes
     */
    get supportedLanguages(): string[];
    /**
     * Returns the list of GUI-supported languages, if any.
     *
     * @returns An array of GUI language codes, or `null` if not set
     */
    get supportedGuiLanguages(): string[] | null;
}
//# sourceMappingURL=supported-languages.d.ts.map
import { Device } from '../common/device';
import { Voicemail } from './voicemail';
/**
 * Represents a subscriber in the OmniPCX Enterprise system.
 *
 * A user can have one or multiple devices and optionally a voicemail mailbox.
 * This class provides access to the user's personal and account information,
 * devices, and system configuration.
 */
export declare class User {
    #private;
    /**
     * Constructs a new User instance.
     * @param companyPhone - The user's company phone number (main device for multi-device users)
     * @param firstName - The user's first name
     * @param lastName - The user's last name
     * @param loginName - The user's login name
     * @param voicemail - The user's voicemail information, or null if none
     * @param devices - The user's devices, or undefined if none
     * @param nodeId - The OmniPCX Enterprise node ID
     * @param externalLogin - The user's external login, or undefined if none
     * @private
     */
    private constructor();
    /**
     * Returns the user's company phone number.
     * For multi-device users, this is the phone number of the main device.
     * @returns The company phone number, or null if not set
     */
    get companyPhone(): string | null;
    /**
     * Returns the user's first name.
     * @returns The first name, or null if not set
     */
    get firstName(): string | null;
    /**
     * Returns the user's last name.
     * @returns The last name, or null if not set
     */
    get lastName(): string | null;
    /**
     * Returns the user's login name.
     * @returns The login name, or null if not set
     */
    get loginName(): string | null;
    /**
     * Returns the user's voicemail information.
     * @returns A {@link Voicemail} object, or null if none
     */
    get voicemail(): Voicemail | null;
    /**
     * Returns the collection of devices assigned to the user.
     * @returns An array of {@link Device} objects, or null if none
     */
    get devices(): Device[] | null;
    /**
     * Returns the OmniPCX Enterprise node ID for this user.
     * @returns The node ID, or null if not set
     */
    get nodeId(): number | null;
    /**
     * Returns the user's external login.
     * @returns The external login, or null if none
     */
    get externalLogin(): string | null;
}
//# sourceMappingURL=user.d.ts.map
import { User } from './user';
/**
 * Event that is emitted when a new user has been created in the system.
 *
 * <p>
 * This event provides access to the newly created {@link User} object.
 * </p>
 */
export declare class OnUserCreated {
    #private;
    /**
     * Creates a new {@link OnUserCreated} event instance.
     *
     * @param user - The newly created {@link User} instance
     * @private
     */
    private constructor();
    /**
     * The user that was created.
     *
     * @returns The {@link User} object representing the new user
     */
    get user(): User;
}
/**
 * Event that is emitted when a user has been deleted from the system.
 *
 * <p>
 * This event provides the login name of the user that was removed.
 * </p>
 */
export declare class OnUserDeleted {
    #private;
    /**
     * Creates a new {@link OnUserDeleted} event instance.
     *
     * @param loginName - The login name of the deleted user
     * @private
     */
    private constructor();
    /**
     * Returns the login name of the deleted user.
     *
     * @returns The login name as a string
     */
    get loginName(): string;
}
/**
 * Event that is emitted when a user's information has been modified in the system.
 *
 * <p>
 * This event provides both the login name of the modified user and the updated {@link User} object.
 * </p>
 */
export declare class OnUserInfoChanged {
    #private;
    /**
     * Creates a new {@link OnUserInfoChanged} event instance.
     *
     * @param loginName - The login name of the modified user
     * @param user - The updated {@link User} object
     * @private
     */
    private constructor();
    /**
     * Returns the login name of the modified user.
     *
     * @returns The login name as a string
     */
    get loginName(): string | null;
    /**
     * Returns the updated user object.
     *
     * @returns The {@link User} object representing the modified user
     */
    get user(): User;
}
//# sourceMappingURL=users-events.d.ts.map
import { VoicemailType } from './voicemail-type';
/**
 * Represents a voicemail associated with a user.
 * <p>
 * Provides the voicemail number and its type. Available via the
 * {@link User} object returned by {@link Users.getByLoginName} or
 * {@link Users.getByCompanyPhone}.
 */
export declare class Voicemail {
    #private;
    /**
     * The voicemail number.
     */
    get number(): string;
    /**
     * The voicemail type.
     */
    get type(): VoicemailType;
}
//# sourceMappingURL=voicemail.d.ts.map
/**
 * The type of voice mail a user can have
 */
export declare enum VoicemailType {
    /**
     * Internal 4635 voice mail.
     */
    VM_4635 = "VM_4635",
    /**
     * Internal 4645 voice mail.
     */
    VM_4645 = "VM_4645",
    /**
     * External voice mail.
     */
    EXTERNAL = "EXTERNAL"
}
//# sourceMappingURL=voicemail-type.d.ts.map
