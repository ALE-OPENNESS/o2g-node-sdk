/*
 * Copyright 2026 ALE International
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

import CallCenterStatisticsRest from '../internal/rest/ccStatistics-rest';
import { StatisticsData } from '../types/cc-stats/data/stats-data';
import { ProgressCallback } from '../types/cc-stats/events/progress-callback';
import { Language } from '../types/cc-stats/language';
import { Requester } from '../types/cc-stats/requester';
import { ScheduledReport } from '../types/cc-stats/scheduled/scheduled-report';
import { StatsFormat } from '../types/cc-stats/stats-format';
import { StatsContext } from '../types/cc-stats/stats-context';
import { StatsFilter } from '../types/cc-stats/stats-filter';
import { TimeInterval } from '../types/cc-stats/time-interval';
import { DateRange } from '../types/common/date-range';
import { Recurrence } from '../types/cc-stats/scheduled/recurrence';
import { ReportObservationPeriod } from '../types/cc-stats/scheduled/report-obs-period';

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
export class CallCenterStatistics {
    #ccStatisticsRest: CallCenterStatisticsRest;

    /**
     *
     * @internal
     */
    constructor(ccStatisticsRest: CallCenterStatisticsRest) {
        this.#ccStatisticsRest = ccStatisticsRest;
    }

    /**
     * Returns whether there is an asynchronous statistics request currently in progress.
     *
     * This can be useful to check before calling {@link getDayFileData} or {@link getDaysFileData},
     * since both methods enforce that only one request can run at a time.
     *
     * @returns `true` if a statistics request is currently active, `false` otherwise
     */
    hasAsyncRequestInProgress(): boolean {
        return this.#ccStatisticsRest.hasAsyncRequestInProgress();
    }

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
    async createRequester(
        id: string,
        language: Language,
        timezone: string,
        ...agents: string[]
    ): Promise<Requester | null> {
        return this.#ccStatisticsRest.createRequester(id, language, timezone, agents);
    }

    /**
     * Removes the requester and all its associated contexts.
     *
     * After calling this method, the specified requester will no longer have
     * access to any agent statistics defined under their scope.
     *
     * @param requester - The requester to removed.
     * @returns `true` if the requester was successfully removed; otherwise, `false`.
     */
    async deleteRequester(requester: Requester): Promise<boolean> {
        return this.#ccStatisticsRest.deleteRequester(requester);
    }

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
    async getRequester(id: string): Promise<Requester | null> {
        return this.#ccStatisticsRest.getRequester(id);
    }

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
    async createContext(
        requester: Requester,
        label: string,
        description: string,
        filter: StatsFilter
    ): Promise<StatsContext | null> {
        return this.#ccStatisticsRest.createContext(requester, label, description, filter);
    }

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
    async deleteContexts(requester: Requester): Promise<boolean> {
        return this.#ccStatisticsRest.deleteContexts(requester);
    }

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
    async getContexts(requester: Requester): Promise<StatsContext[] | null> {
        return this.#ccStatisticsRest.getContexts(requester);
    }

    /**
     * Retrieves a statistical context by its identifier for the specified requester.
     *
     * A context defines a scope for collecting and analyzing call center statistics
     * according to its associated filter criteria.
     *
     * @param requester - The requester who owns the context.
     * @param contextId - The unique identifier of the context.
     * @returns The {@link StatsContext} if found and retrieval is successful; `null`
     * if there is an error or if no context exists with the specified identifier.
     */
    async getContext(requester: Requester, contextId: string): Promise<StatsContext | null> {
        return this.#ccStatisticsRest.getContext(requester, contextId);
    }

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
    async deleteContext(context: StatsContext): Promise<boolean> {
        return this.#ccStatisticsRest.deleteContext(context);
    }

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
     * @param shortHeader - True to return only limited number of headers in response
     * @returns A {@link StatisticsData} object containing the data,
     *          or `null` if the data could not be retrieved.
     */
    async getDaysData(context: StatsContext, range: DateRange, shortHeader: boolean = false): Promise<StatisticsData | null> {
        return this.#ccStatisticsRest.getDaysData(context, shortHeader, range);
    }

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
     * @param shortHeader - True to return only limited number of headers in response
     * @returns A `StatisticsData` object containing the data, or `null` if the data could not be retrieved
     */
    async getDayData(context: StatsContext, date?: Date, timeInterval?: TimeInterval, shortHeader: boolean = false): Promise<StatisticsData | null> {
        return this.#ccStatisticsRest.getDayData(context, shortHeader, date, timeInterval);
    }

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
     * @param shortHeader      true to return only limited number of headers in response
     * @param directory        the directory in which to save the generated report file
     * @param progressCallback optional callback invoked to report progress of the operation
     * @returns a `Promise` that resolves with the path to the generated report file,
     *          or rejects if an error occurs, the operation is cancelled, or another
     *          request is already in progress
     * @see getDaysFileData
     * @see hasAsyncRequestInProgress
     * @see cancelRequest
     */
    async getDayFileData(
        context: StatsContext,
        date: Date,
        timeInterval: TimeInterval,
        format: StatsFormat,
        shortHeader: boolean = false,
        directory: string,
        progressCallback?: ProgressCallback
    ): Promise<string> {
        return this.#ccStatisticsRest.getDayFileData(context, shortHeader, date, timeInterval, format, directory, progressCallback);
    }

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
     * @param shortHeader      true to return only limited number of headers in response
     * @param directory        the directory in which to save the generated report file
     * @param progressCallback optional callback invoked to report progress of the operation
     * @returns a `Promise` that resolves with the path to the generated report file,
     *          or rejects if an error occurs, the operation is cancelled, or another
     *          request is already in progress
     * @see getDayFileData
     * @see hasAsyncRequestInProgress
     * @see cancelRequest
     */
    async getDaysFileData(
        context: StatsContext,
        range: DateRange,
        format: StatsFormat,
        shortHeader: boolean = false,
        directory: string,
        progressCallback?: ProgressCallback
    ): Promise<string> {
        return this.#ccStatisticsRest.getDaysFileData(context, shortHeader, range, format, directory, progressCallback);
    }

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
    async cancelRequest(context: StatsContext): Promise<boolean> {
        return this.#ccStatisticsRest.cancelRequest(context);
    }

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
    async createRecurrentScheduledReport(
        context: StatsContext,
        id: string,
        description: string,
        observationPeriod: ReportObservationPeriod,
        recurrence: Recurrence,
        format: StatsFormat,
        recipients: string[]
    ): Promise<ScheduledReport | null> {
        return this.#ccStatisticsRest.createRecurrentScheduledReport(
            context,
            id,
            description,
            observationPeriod,
            recurrence,
            format,
            recipients
        );
    }

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
    async createOneTimeScheduledReport(
        context: StatsContext,
        id: string,
        description: string,
        observationPeriod: ReportObservationPeriod,
        format: StatsFormat,
        recipients: string[]
    ): Promise<ScheduledReport | null> {
        return this.#ccStatisticsRest.createOneTimeScheduledReport(
            context,
            id,
            description,
            observationPeriod,
            format,
            recipients
        );
    }

    /**
     * Returns all scheduled reports associated with the given context.
     *
     * @param context - The context defining which reports to retrieve
     * @returns An array of {@link ScheduledReport} objects for the specified context;
     *          may be empty if no reports exist
     */
    async getScheduledReports(context: StatsContext): Promise<ScheduledReport[] | null> {
        return this.#ccStatisticsRest.getScheduledReports(context);
    }

    /**
     * Deletes the specified scheduled report.
     *
     * @param report The scheduled report to delete.
     * @returns `true` if the report was successfully deleted, `false` otherwise.
     */
    async deleteScheduledReport(report: ScheduledReport): Promise<boolean> {
        return this.#ccStatisticsRest.deleteScheduledReport(report);
    }

    /**
     * Enables or disables the specified scheduled report.
     *
     * @param report The scheduled report to update.
     * @param enabled `true` to enable the report, `false` to disable it.
     * @returns `true` if the report state was successfully updated, `false` otherwise.
     */
    async setScheduledReportEnabled(report: ScheduledReport, enabled: boolean): Promise<boolean> {
        return this.#ccStatisticsRest.setScheduledReportEnabled(report, enabled);
    }

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
    async getScheduledReport(context: StatsContext, scheduleReportId: string): Promise<ScheduledReport | null> {
        return this.#ccStatisticsRest.getScheduledReport(context, scheduleReportId);
    }

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
    async updateScheduledReport(report: ScheduledReport): Promise<boolean> {
        return this.#ccStatisticsRest.updateScheduledReport(report);
    }
}
