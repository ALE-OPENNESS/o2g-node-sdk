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

import { PilotAbandonedCallRowJson } from '../../../internal/types/cc-stats/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsPilotAbandonedCallsAttributes } from '../pilot-abandoned-calls-attributes';

/**
 * Represents a single row of abandoned call statistics for a CCD pilot.
 * <p>
 * Each row corresponds to one abandoned call event and provides the caller's
 * waiting time, the pilot and queue involved, and a set of boolean flags
 * indicating at which point in the call flow the caller hung up.
 * <p>
 * Boolean flag fields follow the O2G convention: `true` when the value is `1`,
 * absent (treated as `false`) when the field is not present in the response.
 * <p>
 * Rows are returned as part of a {@link StatisticsData} object via
 * {@link CallCenterStatistics.getDayData} or {@link CallCenterStatistics.getDaysData}.
 *
 * @see StatsPilotAbandonedCallAttributes
 * @see CallCenterStatistics.getDayData
 * @see CallCenterStatistics.getDaysData
 */
export class PilotAbandonedCallsStatisticsRow {
    [key: string]: any;

    private values: Map<StatsPilotAbandonedCallsAttributes, StatValue> = new Map();
    #date?: string;
    #queueName?: string;
    #pilotName?: string;
    #pilotNumber?: string;
    #waitingTime?: number;

    /**
     * @internal
     */
    constructor(json: PilotAbandonedCallRowJson) {
        this.initializeFromJson(json);
    }

    private initializeFromJson(json: PilotAbandonedCallRowJson) {
        if (json.date !== undefined) this.#date = json.date;
        if (json.queueName !== undefined) this.#queueName = json.queueName;
        if (json.pilotName !== undefined) this.#pilotName = json.pilotName;
        if (json.pilotNumber !== undefined) this.#pilotNumber = json.pilotNumber;
        if (json.waitingTime !== undefined) this.#waitingTime = json.waitingTime;

        for (const key in json) {
            const value = json[key as keyof PilotAbandonedCallRowJson];
            if (value !== undefined && typeof value !== 'string' && typeof value !== 'number' && value !== null)
                continue;

            const attr = Object.values(StatsPilotAbandonedCallsAttributes).find((e) => e === key);
            if (attr && (typeof value === 'string' || typeof value === 'number' || value === null)) {
                this.values.set(attr as StatsPilotAbandonedCallsAttributes, new StatValue(value));
            }
        }
    }

    /**
     * @internal
     */
    static fromJson(json: PilotAbandonedCallRowJson): PilotAbandonedCallsStatisticsRow {
        return new PilotAbandonedCallsStatisticsRow(json);
    }

    /**
     * Returns the value of the specified statistical attribute for this row.
     * <p>
     * Always returns a {@link StatValue} — if the attribute is not present in
     * the data, a `StatValue` wrapping `null` is returned.
     *
     * @param attr the attribute to retrieve
     * @returns the {@link StatValue} for the specified attribute
     */
    get(attr: StatsPilotAbandonedCallsAttributes): StatValue {
        if (attr === StatsPilotAbandonedCallsAttributes.ALL) {
            return new StatValue(null);
        }
        return this.values.get(attr) ?? new StatValue(null);
    }

    /**
     * The date this row was recorded.
     * <p>
     * For a single-day request the format is `yyyy-MM-dd'T'HH:mm`;
     * for a multi-day request the format is `yyyy-MM-dd`.
     *
     * @returns the date as a JavaScript `Date`, or `null` if not set
     */
    get dateValue(): Date | null {
        if (!this.#date) return null;
        const [year, month, day] = this.#date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * The name of the queue associated with this abandoned call.
     *
     * @returns the queue name, or `null` if not set
     */
    get queueNameValue(): string | null {
        return this.#queueName ?? null;
    }

    /**
     * The total time in seconds the caller waited before hanging up.
     *
     * @returns the waiting time in seconds, or `null` if not set
     */
    get waitingTime(): number | null {
        return this.#waitingTime ?? null;
    }

    /**
     * The name of the pilot on which the call was abandoned.
     *
     * @returns the pilot name, or `null` if not set
     */
    get pilotNameValue(): string | null {
        return this.#pilotName ?? null;
    }

    /**
     * The phone number of the pilot on which the call was abandoned.
     *
     * @returns the pilot number, or `null` if not set
     */
    get pilotNumberValue(): string | null {
        return this.#pilotNumber ?? null;
    }

    /**
     * Whether the caller abandoned during the greeting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the greeting voice guide; `false` otherwise
     */
    get abandonedOnGreetingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOnGreetingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 1st waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 1st waiting voice guide; `false` otherwise
     */
    get abandonedOn1stWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn1stWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 2nd waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 2nd waiting voice guide; `false` otherwise
     */
    get abandonedOn2ndWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn2ndWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 3rd waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 3rd waiting voice guide; `false` otherwise
     */
    get abandonedOn3rdWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn3rdWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 4th waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 4th waiting voice guide; `false` otherwise
     */
    get abandonedOn4thWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn4thWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 5th waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 5th waiting voice guide; `false` otherwise
     */
    get abandonedOn5thWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn5thWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the 6th waiting voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the 6th waiting voice guide; `false` otherwise
     */
    get abandonedOn6thWaitingVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOn6thWaitingVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned while ringing an agent.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on ringing; `false` otherwise
     */
    get abandonedOnRinging(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOnRinging).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the general forwarding voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the general forwarding voice guide; `false` otherwise
     */
    get abandonedOnGeneralFwdVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOnGeneralFwdVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned during the blocked voice guide.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on the blocked voice guide; `false` otherwise
     */
    get abandonedOnBlockedVG(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOnBlockedVG).asBoolean() ?? false;
    }

    /**
     * Whether the caller abandoned while waiting on a direct call to a busy agent.
     * <p>
     * `true` when the value is `1`; `false` when absent.
     *
     * @returns `true` if the caller abandoned on direct call waiting; `false` otherwise
     */
    get abandonedOnDirectCallWaiting(): boolean {
        return this.get(StatsPilotAbandonedCallsAttributes.abandonedOnDirectCallWaiting).asBoolean() ?? false;
    }
}