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

import { ExceptionCalendarJson, ExceptionTransitionsJson } from '../../../internal/types/cc-mngt/cc-mntg-types';
import { AbstractCalendar } from './abstract-calendar';
import { Transition } from './transition';

function parseCalendarDate(date: string): Date {
    if (!/^\d{8}$/.test(date)) {
        throw new Error('Invalid date format in calendar. Expected yyyymmdd.');
    }

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10) - 1; // Month is 0-based
    const day = parseInt(date.substring(6, 8), 10);

    const parsedDate = new Date(year, month, day);

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date components in calendar.');
    }

    return parsedDate;
}

function toDateTransitions(json: ExceptionTransitionsJson): Transition[] {
    const transitions: Transition[] = [];

    if (json.list) {
        json.list.forEach((t) => {
            transitions[t.number - 1] = Transition.fromJson(t.transition);
        });
    }

    return transitions;
}

/**
 * Represents the exceptional calendar associated with a CCD pilot.
 *
 * This calendar defines special days, such as holidays or other exceptions,
 * that override the normal calendar behavior. Each exceptional day can
 * have up to 10 transitions (time slots), specifying changes in pilot operating mode.
 */
export class ExceptionCalendar extends AbstractCalendar<string> {
    #mapIsoToDate: Map<string, Date>;

    /**
     * @internal
     */
    constructor(transitions: Map<string, Transition[]>, dayToDate: Map<string, Date>) {
        super(transitions);
        this.#mapIsoToDate = dayToDate;
    }

    /**
     * Returns the set of exceptional dates configured in this calendar.
     * @returns {Set<Date>} Set of Date objects representing exceptional days
     */
    get exceptionDates(): Set<Date> {
        return new Set(this.#mapIsoToDate.values());
    }

    /**
     * Retrieves a specific transition for an exceptional date by index.
     * @param {Date} date - The exceptional date
     * @param {number} index - Index of the transition (0-9)
     * @returns {Transition | undefined} The transition at the given index, or undefined if not found
     */
    getTransitionAt(date: Date, index: number): Transition | null {
        const dayTransitions = this.transitions.get(date.toISOString().slice(0, 10));
        return dayTransitions ? dayTransitions?.[index] : null;
    }

    /**
     * Returns all transitions for a given exceptional date.
     * @param {Date} date - The exceptional date
     * @returns {Transition[]} Array of transitions for the date, null if none
     */
    getTransitions(date: Date): Transition[] | null {
        return this.transitions.get(date.toISOString().slice(0, 10)) || null;
    }

    /**
     * Constructs an ExceptionCalendar from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {ExceptionCalendarJson} json - JSON representation of the exceptional calendar
     * @returns {ExceptionCalendar} A new ExceptionCalendar instance
     * @internal
     */
    /** @internal */

    static fromJson(json: ExceptionCalendarJson): ExceptionCalendar {
        const dayTransitions = new Map<string, Transition[]>();
        const dayToDate = new Map<string, Date>();

        if (json.calendar) {
            json.calendar.forEach((t) => {
                const date: Date = parseCalendarDate(t.date);
                const transitions = toDateTransitions(t);

                const dateKey = date.toISOString().slice(0, 10);

                dayTransitions.set(dateKey, transitions);
                dayToDate.set(dateKey, date);
            });
        }

        return new ExceptionCalendar(dayTransitions, dayToDate);
    }
}
