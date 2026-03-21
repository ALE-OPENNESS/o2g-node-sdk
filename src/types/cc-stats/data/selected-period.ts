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

import { SelectedPeriodJson } from '../../../internal/types/cc-stats/cc-stat-types';
import { TimeInterval } from '../time-interval';
import { DataObservationPeriod } from './data-obs-period';

/**
 * Defines a time range and granularity for retrieving statistical data.
 *
 * A `SelectedPeriod` specifies both the observation duration and the temporal resolution
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
export class SelectedPeriod {
    /** @private */
    #periodType: DataObservationPeriod;

    /** @private */
    #slotType?: TimeInterval;

    /** @private */
    #beginDate?: string;

    /** @private */
    #endDate?: string;

    /**
     * @internal
     */
    constructor(periodType: DataObservationPeriod, slotType: TimeInterval, beginDate: string, endDate: string) {
        this.#periodType = periodType;
        this.#slotType = slotType;
        this.#beginDate = beginDate;
        this.#endDate = endDate;
    }

    /**
     * Creates a SelectedPeriod instance from a JSON object.
     *
     * @param json The JSON object with periodType, slotType, beginDate, and endDate
     * @returns A new SelectedPeriod instance
     */
    /** @internal */

    static fromJson(json: SelectedPeriodJson): SelectedPeriod {
        return new SelectedPeriod(json.periodType, json.slotType, json.beginDate, json.endDate);
    }

    /**
     * Returns the start date of the selected period as a Date object.
     *
     * @returns The beginning date of the observation period
     */
    get beginDate(): Date | null {
        if (!this.#beginDate) return null;
        return new Date(this.#beginDate);
    }

    /**
     * Returns the end date of the selected period as a Date object.
     *
     * @returns The ending date of the observation period
     */
    get endDate(): Date | null {
        if (!this.#endDate) return null;
        return new Date(this.#endDate);
    }

    /**
     * Returns the observation period type, defining whether statistics are
     * collected for a single day or multiple consecutive days.
     *
     * @returns The observation period type
     */
    get observationPeriod(): DataObservationPeriod {
        return this.#periodType;
    }

    /**
     * Returns the time slot granularity used for aggregating statistics within
     * the selected period (e.g., 15-minute, 30-minute, or hourly).
     *
     * @returns The time interval (slot size) for data aggregation
     */
    get timeInterval(): TimeInterval | null {
        return this.#slotType ?? null;
    }
}
