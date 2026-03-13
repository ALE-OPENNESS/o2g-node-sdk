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

import { NormalCalendarJson, NormalTransitionsJson } from '../../../internal/types/cc-mngt/cc-mntg-types';
import { AbstractCalendar } from './abstract-calendar';
import { DayOfWeek } from '../../common/day-of-week';
import { Transition } from './transition';

function toDayTransitions(json: NormalTransitionsJson): Transition[] {
    const transitions: Transition[] = [];

    if (json.list) {
        json.list.forEach((t) => {
            transitions[t.number - 1] = Transition.fromJson(t.transition);
        });
    }

    return transitions;
}

/**
 * Represents the normal calendar associated with a CCD pilot.
 *
 * The normal calendar defines the pilot's behavior for each day of the week.
 * Each day can have up to 10 transitions (time slots), for a maximum of 70 per week.
 * Transitions indicate changes in the pilot's operating mode triggered by rules at specific times.
 */
export class NormalCalendar extends AbstractCalendar<DayOfWeek> {
    /**
     * @internal
     */
    constructor(transitions: Map<DayOfWeek, Transition[]>) {
        super(transitions);
    }

    /**
     * Returns the set of days that have transitions configured in this calendar.
     * @returns {Set<DayOfWeek>} Set of days with transitions
     */
    get days(): Set<DayOfWeek> {
        return new Set(this.transitions.keys());
    }

    /**
     * Retrieves a specific transition by day and index.
     * @param {DayOfWeek} day - The day of the week
     * @param {number} index - The index of the transition within the day
     * @returns {Transition | undefined} The transition at the given index, or undefined if not found
     */
    getransitionAt(day: DayOfWeek, index: number): Transition | null {
        const dayTransitions = this.transitions.get(day);
        return dayTransitions ? dayTransitions?.[index] : null;
    }

    /**
     * Returns all transitions for a specific day.
     * @param {DayOfWeek} day - The day of the week
     * @returns {Transition[]} Array of transitions for the given day, null if none
     */
    getTransitions(day: DayOfWeek): Transition[] | null {
        return this.transitions.get(day) || null;
    }

    /**
     * Constructs a NormalCalendar from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {NormalCalendarJson} json - JSON representation of the calendar
     * @returns {NormalCalendar} A new NormalCalendar instance
     * @internal
     */
    /** @internal */

    static fromJson(json: NormalCalendarJson): NormalCalendar {
        const dayTransitions = new Map<DayOfWeek, Transition[]>();

        if (json.calendar) {
            json.calendar.forEach((t) => {
                const dayOfWeek = DayOfWeek.fromJson(t.day);
                const transitions = toDayTransitions(t);
                dayTransitions.set(dayOfWeek, transitions);
            });
        }

        return new NormalCalendar(dayTransitions);
    }
}
