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

import { PeriodicityJson, ReportFrequencyJson } from '../../../internal/types/cc-stats/cc-stat-types';
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
export class Recurrence {
    #type: Recurrence.Type;
    #daysInWeek?: Set<DayOfWeek> | null; // Using number for DayOfWeek (0=Sunday..6=Saturday)
    #dayInMonth?: number;

    // Private constructor
    private constructor(type: Recurrence.Type, daysInWeek: DayOfWeek[] | null, dayInMonth: number) {
        this.#type = type;

        if (type === Recurrence.Type.WEEKLY) {
            if (!daysInWeek || daysInWeek.length === 0) {
                throw new Error('Days array cannot be null or empty');
            }
            const daySet = new Set(daysInWeek);
            if (daySet.size !== daysInWeek.length) {
                throw new Error('Duplicate DayOfWeek values are not allowed');
            }
            this.#daysInWeek = daySet;
        } else {
            this.#daysInWeek = null;
        }

        this.#dayInMonth = dayInMonth;
    }

    /**
     * Creates a recurrence that occurs every day.
     */
    static daily(): Recurrence {
        return new Recurrence(Recurrence.Type.DAILY, null, -1);
    }

    /**
     * Creates a recurrence that occurs weekly on specific days.
     * @param days array of DayOfWeek representing the days of the week
     */
    static weekly(...days: DayOfWeek[]): Recurrence {
        return new Recurrence(Recurrence.Type.WEEKLY, days, -1);
    }

    /**
     * Creates a recurrence that occurs monthly on a specific day.
     * @param day the day of the month (1-31)
     */
    static monthly(day: number): Recurrence {
        if (day < 1 || day > 31) throw new RangeError('day must be 1-31');
        return new Recurrence(Recurrence.Type.MONTHLY, null, day);
    }

    /**
     * Checks if the recurrence is daily.
     */
    get daily(): boolean {
        return this.#type === Recurrence.Type.DAILY;
    }

    /**
     * Checks if the recurrence is weekly.
     */
    get weekly(): boolean {
        return this.#type === Recurrence.Type.WEEKLY;
    }

    /**
     * Checks if the recurrence is monthly.
     */
    get monthly(): boolean {
        return this.#type === Recurrence.Type.MONTHLY;
    }

    /**
     * Returns the set of days in the week for weekly recurrence.
     * Only valid if isWeekly() returns true; otherwise, returns null.
     */
    get daysInWeek(): Set<DayOfWeek> | null {
        return this.#daysInWeek ?? null;
    }

    /**
     * Returns the day of the month for monthly recurrence.
     * Only valid if isMonthly() returns true; otherwise, returns -1.
     */
    get dayInMonth(): number | null {
        return this.#dayInMonth ?? null;
    }

    /**
     * Converts this Recurrence into a ReportFrequencyJson object
     */
    /** @internal */

    toJson(): ReportFrequencyJson {
        let periodicity: PeriodicityJson;
        switch (this.#type) {
            case Recurrence.Type.DAILY:
                periodicity = PeriodicityJson.daily;
                break;
            case Recurrence.Type.WEEKLY:
                periodicity = PeriodicityJson.weekly;
                break;
            case Recurrence.Type.MONTHLY:
                periodicity = PeriodicityJson.montly;
                break;
            default:
                periodicity = PeriodicityJson.once;
        }

        const result: ReportFrequencyJson = { periodicity };

        if (this.#type === Recurrence.Type.WEEKLY && this.#daysInWeek) {
            // Convert each DayOfWeek enum to DayOfWeekJson using the toJson helper
            result.daysInWeek = Array.from(this.#daysInWeek).map(DayOfWeek.toJson);
        }

        if (this.#type === Recurrence.Type.MONTHLY && this.#dayInMonth && this.#dayInMonth > 0) {
            result.dayInMonth = this.#dayInMonth;
        }

        return result;
    }

    /**
     * Creates a Recurrence instance from a ReportFrequencyJson object
     * @param json the JSON representation of the recurrence
     * @returns a Recurrence instance
     */
    /** @internal */

    static fromJson(json: ReportFrequencyJson): Recurrence | null {
        if (!json || !json.periodicity) {
            throw new Error('Invalid JSON: periodicity is required');
        }

        switch (json.periodicity) {
            case PeriodicityJson.once:
                return null;

            case PeriodicityJson.daily:
                return Recurrence.daily();

            case PeriodicityJson.weekly:
                if (!json.daysInWeek || json.daysInWeek.length === 0) {
                    throw new Error('Weekly recurrence must have at least one dayInWeek');
                }
                const days = json.daysInWeek.map(DayOfWeek.fromJson);
                return Recurrence.weekly(...days);

            case PeriodicityJson.montly:
                if (!json.dayInMonth || json.dayInMonth < 1 || json.dayInMonth > 31) {
                    throw new RangeError('Monthly recurrence requires a valid dayInMonth (1-31)');
                }
                return Recurrence.monthly(json.dayInMonth);

            default:
                throw new Error(`Unknown periodicity: ${json.periodicity}`);
        }
    }
}

/**
 * Namespace containing the Type enum for Recurrence.
 */
export namespace Recurrence {
    export enum Type {
        DAILY = 'DAILY',
        WEEKLY = 'WEEKLY',
        MONTHLY = 'MONTHLY',
    }
}
