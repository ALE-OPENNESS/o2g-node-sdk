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

import { AgentByPilotStatisticsRowJson } from '../../../internal/types/cc-stats/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsAgentByPilotAttributes } from '../agbypilot-attributes';

export class AgentByPilotStatisticsRow {
    [key: string]: any; // for dynamic field access

    private values: Map<StatsAgentByPilotAttributes, StatValue> = new Map();

    #pilotNumber?: string;
    #pilotName?: string;

    constructor(json: AgentByPilotStatisticsRowJson) {
        this.initializeFromJson(json);
    }

    private initializeFromJson(json: AgentByPilotStatisticsRowJson) {
        if (json.pilotNumber !== undefined) this.#pilotNumber = json.pilotNumber;
        if (json.pilotName !== undefined) this.#pilotName = json.pilotName;

        // remaining StatsAgentAttributes
        for (const key in json) {
            const value = json[key as keyof AgentByPilotStatisticsRowJson];
            if (value !== undefined && typeof value !== 'string' && typeof value !== 'number' && value !== null)
                continue;

            const attr = Object.values(StatsAgentByPilotAttributes).find((e) => e === key);
            if (attr && (typeof value === 'string' || typeof value === 'number' || value === null)) {
                this.values.set(attr as StatsAgentByPilotAttributes, new StatValue(value));
            }
        }
    }

    /** Static factory method */
    /** @internal */

    static fromJson(json: AgentByPilotStatisticsRowJson): AgentByPilotStatisticsRow {
        return new AgentByPilotStatisticsRow(json);
    }

    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsAgentByPilotAttributes): StatValue {
        const stat = this.values.get(attr);
        if (!stat) {
            return new StatValue(null); // always return StatValue
        }
        if (attr == StatsAgentByPilotAttributes.ALL) {
            return new StatValue(null);
        }

        return stat;
    }

    /**
     * Returns the pilot's unique identifier or number.
     *
     * @return the pilot's number
     */
    get pilotNumber(): string | null {
        return this.#pilotNumber ?? null;
    }

    /**
     * Returns the pilot's display name.
     *
     * @return the pilot's name
     */
    get pilotName(): string | null {
        return this.#pilotName ?? null;
    }

    /**
     * Returns the total number of calls received by this pilot.
     *
     * @return the number of received calls
     */
    get nbCallsReceived(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsReceived)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls received by transfer.
     *
     * @return the number of transferred-in calls
     */
    get nbCallsTransfIn(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsTransfIn)?.asInteger() ?? null;
    }

    /**
     * Returns the total number of calls served by the pilot.
     *
     * @return the number of served calls
     */
    get nbCallsServed(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsServed)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls served too quickly.
     *
     * @return the number of calls served too quickly
     */
    get nbCallsServedTooQuickly(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsServedTooQuickly)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls that included an enquiry.
     *
     * @return the number of calls with enquiry
     */
    get nbCallsWithEnquiry(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsWithEnquiry)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls where help was requested.
     *
     * @return the number of calls with help requested
     */
    get nbCallsWithHelp(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsWithHelp)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls transferred from this pilot to others.
     *
     * @return the number of calls transferred from the agent
     */
    get nbCallsTransf(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsTransf)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls transferred to this pilot.
     *
     * @return the number of calls transferred to the agent
     */
    get nbCallsTransfToAgent(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsTransfToAgent)?.asInteger() ?? null;
    }

    /**
     * Returns the number of calls currently in wrap-up state.
     *
     * @return the number of calls in wrap-up
     */
    get nbCallsInWrapup(): number | null {
        return this.get(StatsAgentByPilotAttributes.nbCallsInWrapup)?.asInteger() ?? null;
    }

    /**
     * Returns the maximum call processing duration.
     *
     * @return the maximum duration of call processing
     */
    get maxCallProcDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.maxCallProcDur)?.asDuration() ?? null;
    }

    /**
     * Returns the maximum conversation duration.
     *
     * @return the maximum duration of conversation
     */
    get maxConvDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.maxConvDur)?.asDuration() ?? null;
    }

    /**
     * Returns the maximum wrap-up duration.
     *
     * @return the maximum duration of wrap-up
     */
    get maxWrapupDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.maxWrapupDur)?.asDuration() ?? null;
    }

    /**
     * Returns the total call processing duration.
     *
     * @return total duration of call processing
     */
    get callProcTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.callProcTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average call processing duration.
     *
     * @return average duration of call processing
     */
    get callProcADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.callProcADur)?.asDuration() ?? null;
    }

    /**
     * Returns the total conversation duration.
     *
     * @return total duration of conversation
     */
    get convTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.convTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average conversation duration.
     *
     * @return average duration of conversation
     */
    get convADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.convADur)?.asDuration() ?? null;
    }

    /**
     * Returns the total wrap-up duration.
     *
     * @return total duration of wrap-up
     */
    get wrapupTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.wrapupTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average wrap-up duration.
     *
     * @return average duration of wrap-up
     */
    get wrapupADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.wrapupADur)?.asDuration() ?? null;
    }

    /**
     * Returns the total conversation duration during wrap-up.
     *
     * @return total duration of conversation in wrap-up
     */
    get convInWrapupTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.convInWrapupTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the total busy time during wrap-up.
     *
     * @return total busy duration in wrap-up
     */
    get busyTimeInWrapupTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.busyTimeInWrapupTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the total duration of calls on hold.
     *
     * @return total duration of hold calls
     */
    get onHoldTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.onHoldTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average duration of calls on hold.
     *
     * @return average duration of hold calls
     */
    get onHoldADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.onHoldADur)?.asDuration() ?? null;
    }

    /**
     * Returns the total duration of the transaction phase.
     *
     * @return total duration of transactions
     */
    get transTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.transTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average duration of the transaction phase.
     *
     * @return average duration of transactions
     */
    get transADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.transADur)?.asDuration() ?? null;
    }

    /**
     * Returns the total duration of pause.
     *
     * @return total duration of pause
     */
    get pauseTDur(): string | null {
        return this.get(StatsAgentByPilotAttributes.pauseTDur)?.asDuration() ?? null;
    }

    /**
     * Returns the average duration of pause.
     *
     * @return average duration of pause
     */
    get pauseADur(): string | null {
        return this.get(StatsAgentByPilotAttributes.pauseADur)?.asDuration() ?? null;
    }
}
