/*
 * Copyright 2025 ALE International
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

import { DayOfWeekJson } from '../../internal/types/common/common-types';

/**
 * Defines the day of a week.
 */
export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',
}

// Namespace to handle JSON conversion
export namespace DayOfWeek {
    // Mapping from JSON enum to DayOfWeek enum
    const jsonToDayOfWeek: Record<DayOfWeekJson, DayOfWeek> = {
        [DayOfWeekJson.monday]: DayOfWeek.MONDAY,
        [DayOfWeekJson.tuesday]: DayOfWeek.TUESDAY,
        [DayOfWeekJson.wednesday]: DayOfWeek.WEDNESDAY,
        [DayOfWeekJson.thursday]: DayOfWeek.THURSDAY,
        [DayOfWeekJson.friday]: DayOfWeek.FRIDAY,
        [DayOfWeekJson.saturday]: DayOfWeek.SATURDAY,
        [DayOfWeekJson.sunday]: DayOfWeek.SUNDAY,
    };

    // Mapping from DayOfWeek enum to JSON enum
    const dayOfWeekToJson: Record<DayOfWeek, DayOfWeekJson> = {
        [DayOfWeek.MONDAY]: DayOfWeekJson.monday,
        [DayOfWeek.TUESDAY]: DayOfWeekJson.tuesday,
        [DayOfWeek.WEDNESDAY]: DayOfWeekJson.wednesday,
        [DayOfWeek.THURSDAY]: DayOfWeekJson.thursday,
        [DayOfWeek.FRIDAY]: DayOfWeekJson.friday,
        [DayOfWeek.SATURDAY]: DayOfWeekJson.saturday,
        [DayOfWeek.SUNDAY]: DayOfWeekJson.sunday,
    };

    /**
     * @internal
     */
    export function fromJson(value: DayOfWeekJson): DayOfWeek {
        return jsonToDayOfWeek[value];
    }

    /**
     * @internal
     */
    export function toJson(value: DayOfWeek): DayOfWeekJson {
        return dayOfWeekToJson[value];
    }
}
