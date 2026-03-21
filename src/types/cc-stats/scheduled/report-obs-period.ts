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

import { ScheduledSelPeriodJson } from '../../../internal/types/cc-stats/cc-stat-types';

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
export class ReportObservationPeriod {
    /**
     * The type of the observation period.
     */
    #periodType: ReportObservationPeriod.PeriodType;
    #lastNb?: number;
    #beginDate?: string | null;
    #endDate?: string | null;

    // Private constructor
    private constructor(periodType: ReportObservationPeriod.PeriodType, lastNb = -1, from?: Date, to?: Date) {
        this.#periodType = periodType;
        this.#lastNb = lastNb;
        this.#beginDate = from ? from.toISOString() : null;
        this.#endDate = to ? to.toISOString() : null;
    }

    /**
     * Creates an observation period for the current day.
     */
    static onCurrentDay(): ReportObservationPeriod {
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.CURRENT_DAY);
    }

    /**
     * Creates an observation period for the current week.
     */
    static onCurrentWeek(): ReportObservationPeriod {
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.CURRENT_WEEK);
    }

    /**
     * Creates an observation period for the current month.
     */
    static onCurrentMonth(): ReportObservationPeriod {
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.CURRENT_MONTH);
    }

    /**
     * Creates an observation period for the last N days.
     */
    static onLastDays(nbDays: number): ReportObservationPeriod {
        if (nbDays < 1 || nbDays > 31) throw new RangeError('nbDays must be 1-31');
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.LAST_DAYS, nbDays);
    }

    /**
     * Creates an observation period for the last N weeks.
     */
    static onLastWeeks(nbWeeks: number): ReportObservationPeriod {
        if (nbWeeks < 1 || nbWeeks > 4) throw new RangeError('nbWeeks must be 1-4');
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.LAST_WEEKS, nbWeeks);
    }

    /**
     * Creates an observation period for the last month.
     */
    static onLastMonth(): ReportObservationPeriod {
        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.LAST_MONTHS, 1);
    }

    /**
     * Creates a custom observation period starting from a given date for a number of days.
     */
    static fromDate(from: Date, nbDays: number): ReportObservationPeriod {
        if (!from) throw new Error("'from' must not be null");
        if (from.getTime() > Date.now()) throw new Error("'from' must be in the past");
        if (nbDays < 1 || nbDays > 31) throw new RangeError('nbDays must be 1-31');

        const to = new Date(from);
        to.setDate(from.getDate() + nbDays);

        return new ReportObservationPeriod(ReportObservationPeriod.PeriodType.FROM_DATE_TO_DATE, -1, from, to);
    }

    /**
     * Returns the type of the observation period.
     */
    get periodType(): ReportObservationPeriod.PeriodType {
        return this.#periodType;
    }

    /**
     * Returns the number of units (days or weeks) for last-period types.
     */
    get lastUnits(): number | null {
        return this.#lastNb ?? null;
    }

    /**
     * Returns the start date of the observation period.
     * Only valid if the period type is FROM_DATE_TO_DATE.
     */
    get beginDate(): Date | null {
        return this.#beginDate ? new Date(this.#beginDate) : null;
    }

    /**
     * Returns the end date of the observation period.
     * Only valid if the period type is FROM_DATE_TO_DATE.
     */
    get endDate(): Date | null {
        return this.#endDate ? new Date(this.#endDate) : null;
    }

    /**
     * Converts this ReportObservationPeriod to a plain object representation (ScheduledSelPeriod)
     */
    /** @internal */

    toJson(): ScheduledSelPeriodJson {
        const result: ScheduledSelPeriodJson = {
            periodType: this.#periodType,
        };
        if (this.#lastNb && this.#lastNb > 0) {
            result.lastNb = this.#lastNb;
        }
        if (this.#beginDate) {
            result.beginDate = this.#beginDate;
        }
        if (this.#endDate) {
            result.endDate = this.#endDate;
        }
        return result;
    }

    /** @internal */

    static fromJson(json: ScheduledSelPeriodJson): ReportObservationPeriod {
        if (!json || !json.periodType) {
            throw new Error('Invalid JSON: periodType is required');
        }

        const { periodType, lastNb = -1, beginDate, endDate } = json;

        const from = beginDate ? new Date(beginDate) : undefined;
        const to = endDate ? new Date(endDate) : undefined;

        return new ReportObservationPeriod(periodType, lastNb, from, to);
    }
}

/**
 * Namespace containing the PeriodType enum.
 */
export namespace ReportObservationPeriod {
    /**
     * Defines the type of observation period.
     */
    export enum PeriodType {
        /** The current day. */
        CURRENT_DAY = 'currentDay',
        /** The current week. */
        CURRENT_WEEK = 'currentWeek',
        /** The current month. */
        CURRENT_MONTH = 'currentMonth',
        /** The last N days. */
        LAST_DAYS = 'lastDays',
        /** The last N weeks. */
        LAST_WEEKS = 'lastWeeks',
        /** The last month. */
        LAST_MONTHS = 'lastMonth',
        /** A custom range defined by a start date and end date. */
        FROM_DATE_TO_DATE = 'fromDateToDate',
    }
}
