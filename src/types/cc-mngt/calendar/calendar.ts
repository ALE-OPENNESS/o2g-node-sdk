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

import { ExceptionCalendar } from './exception-calendar';
import { NormalCalendar } from './normal-calendar';

import { CalendarJson } from '../../../internal/types/cc-mngt/cc-mntg-types';

/**
 * Represents a pilot's calendar, combining normal and exceptional days.
 *
 * - The **normal calendar** defines standard behavior for each day of the week.
 * - The **exceptional calendar** defines special days (e.g., holidays) that override the normal calendar.
 */
export class Calendar {
    #normalDays?: NormalCalendar;
    #exceptionDays?: ExceptionCalendar;

    /**
     * @internal
     */
    constructor(normalDays?: NormalCalendar, exceptionDays?: ExceptionCalendar) {
        this.#normalDays = normalDays;
        this.#exceptionDays = exceptionDays;
    }

    /**
     * Returns the normal days calendar.
     * @returns {NormalCalendar | null} The normal calendar, or null if not set
     */
    get normalDays(): NormalCalendar | null {
        return this.#normalDays ?? null;
    }

    /**
     * Returns the exceptional days calendar.
     * @returns {ExceptionCalendar | null} The exceptional calendar, or null if not set
     */
    get exceptionDays(): ExceptionCalendar | null {
        return this.#exceptionDays ?? null;
    }

    /**
     * Constructs a Calendar instance from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {CalendarJson} json - JSON representation of the calendar
     * @returns {Calendar} A new Calendar instance
     * @internal
     */
    /** @internal */

    static fromJson(json: CalendarJson): Calendar {
        const normal = json.normalDays ? NormalCalendar.fromJson(json.normalDays) : undefined;
        const exception = json.exceptionDays ? ExceptionCalendar.fromJson(json.exceptionDays) : undefined;
        return new Calendar(normal, exception);
    }
}
