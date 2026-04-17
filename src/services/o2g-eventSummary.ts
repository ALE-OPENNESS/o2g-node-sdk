/*
 * Copyright 2021 ALE International
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

import { EventRegistry } from '../events/event-dispatcher';
import EventSumaryRest from '../internal/rest/eventSummary-rest';
import { EventEmitter } from 'events';
import { OnEventSummaryUpdated } from '../types/eventsummary/event-summary-events';
import { EventSummaryCounters } from '../types/eventsummary/event-summary-counter';

/**
 * The EventSummary service allows a user to retrieve new message indicators
 * such as missed calls, voice mails, callback requests, and faxes.
 * <p>
 * Using this service requires a <b>TELEPHONY_ADVANCED</b> license.
 *
 * @example
 * ```typescript
 * // Listen for counter updates and refresh on each change
 * O2G.eventSummary.on(EventSummary.ON_EVENT_SUMMARY_UPDATED, async () => {
 *     const counters = await O2G.eventSummary.get();
 *     if (counters) {
 *         console.log(`Missed calls: ${counters.missedCalls}`);
 *         console.log(`Voice mails: ${counters.voiceMails}`);
 *         console.log(`Callbacks: ${counters.callbacks}`);
 *     }
 * });
 *
 * // Or fetch counters on demand without waiting for an event
 * const counters = await O2G.eventSummary.get();
 * ```
 */
export class EventSummary extends EventEmitter {
    #eventSummaryRest: EventSumaryRest;

    /**
     * Occurs each time the user's event counters have changed.
     * @event
     */
    static readonly ON_EVENT_SUMMARY_UPDATED = 'OnEventSummaryUpdated';

    /**
     *
     * @internal
     */
    constructor(eventSummaryRest: EventSumaryRest, eventRegistry: EventRegistry) {
        super();
        this.#eventSummaryRest = eventSummaryRest;
        eventRegistry.register(this, EventSummary.ON_EVENT_SUMMARY_UPDATED, OnEventSummaryUpdated);
    }

    /**
     * Retrieves the main event counters for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the user login name
     * @returns the {@link EventSummaryCounters} containing the event counters on success; `null` otherwise
     */
    get(loginName: string | null = null): Promise<EventSummaryCounters | null> {
        return this.#eventSummaryRest.get(loginName);
    }
}
