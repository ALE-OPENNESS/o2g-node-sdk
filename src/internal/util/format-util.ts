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

// date-util.ts
/** @internal */
export class FormatUtil {
    private static readonly months: Record<string, number> = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
    };

    /**
     * Parses a date string in the format "dd-mmm-yyyy" (e.g., "31-dec-2026")
     * and returns a Date object.
     * Throws an error if the format or month is invalid.
     */
    static parseDDMMYYYYDate(value: string): Date {
        const parts = value.split('-');

        if (parts.length !== 3) {
            throw new Error(`Invalid date format: ${value}`);
        }

        const [dayStr, monStr, yearStr] = parts;
        const day = Number(dayStr);
        const monthIndex = FormatUtil.months[monStr.toLowerCase()];
        const year = Number(yearStr);

        if (monthIndex === undefined) {
            throw new Error(`Invalid month: ${monStr}`);
        }

        const date = new Date(year, monthIndex, day);

        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${value}`);
        }

        return date;
    }

    /**
     * Create a duration in seconds from a string formatted as "hh:mm:ss"
     * @param timeStr the duration string
     * @returns the duration in seconds, or null if input is invalid
     */
    static asDuration(timeStr: string | null): number | null {
        if (!timeStr || !/^\d+:\d{2}:\d{2}$/.test(timeStr)) {
            return null;
        }

        const parts = timeStr.split(':').map(Number);
        const [hours, minutes, seconds] = parts;

        return hours * 3600 + minutes * 60 + seconds;
    }
}
