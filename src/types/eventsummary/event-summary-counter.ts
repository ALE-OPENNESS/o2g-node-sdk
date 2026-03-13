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

import { EventSummaryJson } from '../../internal/types/eventsummary/eventsummary-types';

/**
 * EventSummaryCounters represents event counters associated with a user.
 * It provides access to counts of missed calls, voice messages, callback requests,
 * faxes, new and old text messages, and indicates whether an event is waiting.
 */
export class EventSummaryCounters {
    #missedCallsCount?: number;
    #voiceMessagesCount?: number;
    #callBackRequestsCount?: number;
    #faxCount?: number;
    #newTextCount?: number;
    #oldTextCount?: number;
    #eventWaiting?: boolean;

    private constructor(
        missedCallsCount?: number,
        voiceMessagesCount?: number,
        callBackRequestsCount?: number,
        faxCount?: number,
        newTextCount?: number,
        oldTextCount?: number,
        eventWaiting?: boolean
    ) {
        this.#missedCallsCount = missedCallsCount;
        this.#voiceMessagesCount = voiceMessagesCount;
        this.#callBackRequestsCount = callBackRequestsCount;
        this.#faxCount = faxCount;
        this.#newTextCount = newTextCount;
        this.#oldTextCount = oldTextCount;
        this.#eventWaiting = eventWaiting;
    }

    /**
     * Get the number of missed calls.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     * <b>Note:</b> This counter reflects unanswered and non-acknowledged incoming calls in the history.
     * Only explicit acknowledgment via the communication log API or a new answered call decreases this counter.
     * Successive attempts from the same caller also increment the counter.
     *
     * @returns {number} Number of missed calls (0 if unspecified)
     */
    get missedCallsCount(): number {
        return this.#missedCallsCount ?? 0;
    }

    /**
     * Get the number of new voice messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of new voice messages (0 if unspecified)
     */
    get voiceMessagesCount(): number {
        return this.#voiceMessagesCount ?? 0;
    }

    /**
     * Get the number of new callback requests.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of callback requests (0 if unspecified)
     */
    get callBackRequestsCount(): number {
        return this.#callBackRequestsCount ?? 0;
    }

    /**
     * Get the number of new faxes.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of faxes (0 if unspecified)
     */
    get faxCount(): number {
        return this.#faxCount ?? 0;
    }

    /**
     * Get the number of new text messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of new text messages (0 if unspecified)
     */
    get newTextMessageCount(): number {
        return this.#newTextCount ?? 0;
    }

    /**
     * Get the number of old text messages.
     *
     * <p>If this attribute is not specified, the server is unable to provide that information.
     *
     * @returns {number} Number of old text messages (0 if unspecified)
     */
    get oldTextMessageCount(): number {
        return this.#oldTextCount ?? 0;
    }

    /**
     * Indicates whether an event is waiting.
     *
     * <p>This flag can be used to notify the application that new events are waiting.
     *
     * @returns {boolean} True if an event is waiting, false otherwise
     */
    get eventWaiting(): boolean {
        return this.#eventWaiting ?? false;
    }

    /**
     * Create an EventSummaryCounters instance from a JSON object.
     *
     * @param {EventSummaryJson} json JSON object containing event counters
     * @returns {EventSummaryCounters} The corresponding EventSummaryCounters instance
     */
    /** @internal */

    static fromJson(json: EventSummaryJson): EventSummaryCounters {
        return new EventSummaryCounters(
            json.missedCallsNb,
            json.voiceMessagesNb,
            json.callBackRequestsNb,
            json.faxNb,
            json.newTextNb,
            json.oldTextNb,
            json.eventWaiting
        );
    }
}
