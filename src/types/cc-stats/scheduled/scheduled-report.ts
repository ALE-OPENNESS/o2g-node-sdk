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
     * Indicates whether the data are returned with short header (compact number of header attributes).
     * @returns `true` if the short header is considered; otherwise `false`.
     */
    get shortHeader(): boolean;

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
export namespace ScheduledReport {
    /**
     * Enum representing the execution state of a scheduled report.
     */
    export enum State {
        /** Report has not yet been executed. */
        NOT_EXECUTED = 'Not_executed',

        /** Report has been executed successfully. */
        EXECUTED = 'Executed',

        /** Execution failed during data retrieval. */
        FAILED_ON_GET_DATA = 'Failed_On_Get_Data',

        /** Execution failed while sending the report via email. */
        FAILED_ON_SEND_MAIL = 'Failed_On_Send_Mail',

        /** Report execution is currently in progress. */
        IN_PROGRESS = 'In_progress',

        /** Scheduled report has expired and will no longer execute. */
        EXPIRED = 'Expired',
    }
}
