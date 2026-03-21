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

import { Recurrence } from '../../../types/cc-stats/scheduled/recurrence';
import { ReportObservationPeriod } from '../../../types/cc-stats/scheduled/report-obs-period';
import { ScheduledReport } from '../../../types/cc-stats/scheduled/scheduled-report';
import { StatsContext } from '../../../types/cc-stats/stats-context';
import { StatsFormat } from '../../../types/cc-stats/stats-format';
import { StatsScheduleJson } from './cc-stat-types';

/**
 * Concrete implementation of ScheduledReport.
 */
/** @internal */
export class ScheduledReportImpl implements ScheduledReport {
    #name: string;
    #description: string;
    #obsPeriod: ReportObservationPeriod;
    #recurrence: Recurrence | null;
    #recipients: string[];
    #fileType: StatsFormat;
    #state: ScheduledReport.State;
    #lastExecDate: Date | null;
    #enable: boolean;
    #context: StatsContext | null;
    #shortHeader: boolean;

    constructor(
        context: StatsContext,
        name: string,
        description: string,
        obsPeriod: ReportObservationPeriod,
        recurrence: Recurrence | null,
        format: StatsFormat,
        recipients: string[]
    ) {
        this.#context = context;
        this.#name = name;
        this.#description = description;
        this.#obsPeriod = obsPeriod;
        this.#recurrence = recurrence;
        this.#fileType = format;
        this.#recipients = recipients.slice();
        this.#state = ScheduledReport.State.NOT_EXECUTED;
        this.#enable = false;
        this.#shortHeader = false;
        this.#lastExecDate = null;
    }

    /** Sets the context */
    set context(context: StatsContext) {
        this.#context = context;
    }

    /** Gets the context */
    get context(): StatsContext {
        if (!this.#context) throw new Error('Context not set');
        return this.#context;
    }

    get id(): string {
        return this.#name;
    }

    get description(): string {
        return this.#description;
    }

    set description(description: string) {
        this.#description = description;
    }

    get observationPeriod(): ReportObservationPeriod {
        return this.#obsPeriod;
    }

    set observationPeriod(observationPeriod: ReportObservationPeriod) {
        this.#obsPeriod = observationPeriod;
    }

    get recurrence(): Recurrence | null {
        return this.#recurrence;
    }

    set recurrence(recurrence: Recurrence | null) {
        this.#recurrence = recurrence;
    }

    get once(): boolean {
        return !this.#recurrence;
    }

    get recipients(): string[] {
        return this.#recipients;
    }

    set recipients(recipients: string[]) {
        this.#recipients = recipients.slice();
    }

    get format(): StatsFormat {
        return this.#fileType;
    }

    set format(format: StatsFormat) {
        this.#fileType = format;
    }

    get state(): ScheduledReport.State {
        return this.#state;
    }

    get enabled(): boolean {
        return this.#enable;
    }

    get shortHeader(): boolean {
        return this.#shortHeader;
    }


    get lastExecutionDate(): Date | null {
        return this.#lastExecDate;
    }

    /**
     * Creates a ScheduledReportImpl instance from a JSON object.
     */
    /** @internal */

    static fromJson(json: StatsScheduleJson): ScheduledReportImpl {
        if (!json) throw new Error('JSON object must not be null');

        // Create the ScheduledReportImpl instance
        const report = new ScheduledReportImpl(
            {} as StatsContext,
            json.name,
            json.description ?? '',
            ReportObservationPeriod.fromJson(json.obsPeriod),
            Recurrence.fromJson(json.frequency),
            json.fileType,
            json.recipients
        );

        // Set additional fields that are not in constructor
        report.#state = json.state;
        report.#enable = json.enable;
        report.#shortHeader = json.shortHeader;
        report.#lastExecDate = json.lastExecDate ? new Date(json.lastExecDate) : null;

        return report;
    }
}
