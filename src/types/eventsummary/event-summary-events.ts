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

import { OnEventSummaryUpdatedJson } from '../../internal/types/eventsummary/eventsummary-types';
import { EventSummaryCounters } from './event-summary-counter';

/**
 * Notification sent whenever a user's event counters have changed.
 *
 * This event is typically emitted to reflect updated counters for the user,
 * such as calls, messages, or other activity tracked in the system.
 */
export class OnEventSummaryUpdated {
    #loginName: string;
    #eventSummary: EventSummaryCounters;

    private constructor(loginName: string, eventSummary: EventSummaryCounters) {
        this.#loginName = loginName;
        this.#eventSummary = eventSummary;
    }

    /**
     * Gets the login name of the user whose counters were updated.
     *
     * This identifier can be used for filtering events for a specific user.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the updated event summary counters for the user.
     *
     * @returns An {@link EventSummaryCounters} instance representing the new counters.
     */
    get eventSummary(): EventSummaryCounters {
        return this.#eventSummary;
    }

    /**
     * Creates an {@link OnEventSummaryUpdated} instance from a JSON payload.
     *
     * @param json - JSON object representing the updated event summary.
     * @returns A new {@link OnEventSummaryUpdated} instance.
     */
    /** @internal */

    static fromJson(json: OnEventSummaryUpdatedJson): OnEventSummaryUpdated {
        return new OnEventSummaryUpdated(json.loginName, EventSummaryCounters.fromJson(json.eventSummary));
    }
}
