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

import { AgentStatisticsRowJson } from '../../../internal/types/cc-stats/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsAgentAttributes } from '../agent-attributes';
import { AgentByPilotStatisticsRow } from './ag-by-pil-stats-row';

export class AgentStatisticsRow {
    [key: string]: any; // for dynamic field access

    private values: Map<StatsAgentAttributes, StatValue> = new Map();

    // Add a proper type for pilotAgentStatsRows
    #pilotAgentStatsRows?: AgentByPilotStatisticsRow[];
    #date?: string;
    #login?: string;
    #operator?: string;
    #firstName?: string;
    #lastName?: string;
    #number?: string;
    #group?: string;

    /**
     * @internal
     */
    constructor(json: AgentStatisticsRowJson) {
        this.initializeFromJson(json);
    }

    private initializeFromJson(json: AgentStatisticsRowJson) {
        if (json.date !== undefined) this.#date = json.date;
        if (json.login !== undefined) this.#login = json.login;
        if (json.operator !== undefined) this.#operator = json.operator;
        if (json.firstName !== undefined) this.#firstName = json.firstName;
        if (json.lastName !== undefined) this.#lastName = json.lastName;
        if (json.number !== undefined) this.#number = json.number;
        if (json.group !== undefined) this.#group = json.group;

        // pilotAgentStatsRows
        if (json.pilotAgentStatsRows && Array.isArray(json.pilotAgentStatsRows)) {
            this.pilotAgentStatsRows = json.pilotAgentStatsRows.map(
                (rowJson) => new AgentByPilotStatisticsRow(rowJson)
            );
        }

        // remaining StatsAgentAttributes
        for (const key in json) {
            const value = json[key as keyof AgentStatisticsRowJson];
            if (value !== undefined && typeof value !== 'string' && typeof value !== 'number' && value !== null)
                continue;

            const attr = Object.values(StatsAgentAttributes).find((e) => e === key);
            if (attr && (typeof value === 'string' || typeof value === 'number' || value === null)) {
                this.values.set(attr as StatsAgentAttributes, new StatValue(value));
            }
        }
    }

    /** Static factory method */
    /** @internal */

    static fromJson(json: AgentStatisticsRowJson): AgentStatisticsRow {
        return new AgentStatisticsRow(json);
    }

    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsAgentAttributes): StatValue {
        const stat = this.values.get(attr);
        if (!stat) {
            return new StatValue(null); // always return StatValue
        }
        if (attr == StatsAgentAttributes.ALL) {
            return new StatValue(null);
        }

        return stat;
    }

    /**
     * Returns the timestamp associated with this statistics row.
     *
     * The returned value represents the date and time at which the statistics were
     * collected.
     *
     * @returns the timestamp as a string in hh:mm:ss format
     */
    get date(): Date | null {
        if (!this.#date) return null;
        const [year, month, day] = this.#date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * Returns the login name of the agent associated with this statistics row.
     *
     * @returns the agent's login name
     */
    get login(): string | null {
        return this.#login ?? null;
    }

    /**
     * Returns the operator of the agent.
     *
     * @returns the operator
     */
    get operator(): string | null {
        return this.#operator ?? null;
    }

    /**
     * Returns the first name of the agent.
     *
     * @returns the agent's first name
     */
    get firstName(): string | null {
        return this.#firstName ?? null;
    }

    /**
     * Returns the last name of the agent.
     *
     * @returns the agent's last name
     */
    get lastName(): string | null {
        return this.#lastName ?? null;
    }

    /**
     * Returns the directory number associated with the agent.
     *
     * @returns the agent's directory number
     */
    get number(): string | null {
        return this.#number ?? null;
    }

    /**
     * Returns the directory number of the group the agent is logged in.
     *
     * @returns the agent's group directory number
     */
    get group(): string | null {
        return this.#group ?? null;
    }

    /**
     * Returns the number of rotating time-outs that occurred for this agent.
     *
     * A rotating time-out typically indicates that an incoming call was offered to the
     * agent but not answered within the timeout period, and then rotated to another agent.
     *
     * @returns the count of rotating time-outs
     */
    get nbRotating(): number | null {
        return this.get(StatsAgentAttributes.nbRotating).asInteger();
    }

    /**
     * Returns the number of calls that were picked up by the agent.
     *
     * @returns the number of calls picked up by the agent
     */
    get nbPickedUp(): number | null {
        return this.get(StatsAgentAttributes.nbPickedUp).asInteger();
    }

    /**
     * Returns the number of pickup actions performed by the agent.
     *
     * This represents calls the agent retrieved from ringing groups or colleagues
     * using the call pickup feature.
     *
     * @returns the number of pickup actions performed
     */
    get nbPickup(): number | null {
        return this.get(StatsAgentAttributes.nbPickup).asInteger();
    }

    /**
     * Returns the number of internal outgoing calls
     * that were not handled via the ACD system.
     *
     * @returns the count of internal outgoing non-ACD calls
     */
    get nbLocalOutNonAcd(): number | null {
        return this.get(StatsAgentAttributes.nbLocalOutNonAcd).asInteger();
    }

    /**
     * Returns the number of external outgoing calls
     * that were not handled via the ACD system.
     *
     * @returns the count of external outgoing non-ACD calls
     */
    get nbExtOutNonAcd(): number | null {
        return this.get(StatsAgentAttributes.nbExtOutNonAcd).asInteger();
    }

    /**
     * Returns the number of ACD calls that rang the agent.
     *
     * This counts all calls offered to the agent via the Automatic Call Distribution system,
     * regardless of whether the agent answered.
     *
     * @returns the number of ACD calls that rang the agent
     */
    get nbRingAcd(): number | null {
        return this.get(StatsAgentAttributes.nbRingAcd).asInteger();
    }

    /**
     * Returns the number of help requests made by the agent during calls.
     *
     * @returns the count of help requests
     */
    get nbHelp(): number | null {
        return this.get(StatsAgentAttributes.nbHelp).asInteger();
    }

    /**
     * Returns the number of internal (within the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of internal non-ACD incoming calls
     */
    get nbLocInNonAcd(): number | null {
        return this.get(StatsAgentAttributes.nbLocInNonAcd).asInteger();
    }

    /**
     * Returns the number of direct external (outside the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of direct external non-ACD incoming calls
     */
    get nbExtInNonAcdDirect(): number | null {
        return this.get(StatsAgentAttributes.nbExtInNonAcdDirect).asInteger();
    }

    /**
     * Returns the number of transferred external (outside the organization) incoming calls
     * that were not handled via the ACD system.
     *
     * @returns the count of transferred external non-ACD incoming calls
     */
    get nbExtInNonAcdTransferred(): number | null {
        return this.get(StatsAgentAttributes.nbExtInNonAcdTransferred).asInteger();
    }

    /**
     * Returns the number of ACD calls that were served without a transaction code.
     *
     * @returns the count of ACD calls served without a transaction code
     */
    get nbServedWithoutCode(): number | null {
        return this.get(StatsAgentAttributes.nbServedWOCode).asInteger();
    }

    /**
     * Returns the number of ACD calls that were served with a transaction code.
     *
     * @returns the count of ACD calls served with a transaction code
     */
    get nbServedWithCode(): number | null {
        return this.get(StatsAgentAttributes.nbServedWCode).asInteger();
    }

    /**
     * Returns the number of ACD calls that were served too quickly.
     *
     * A "quickly served" call is one answered or handled below the minimum expected
     * service time threshold.
     *
     * @returns the count of ACD calls served too quickly
     */
    get nbAcdQuickServed(): number | null {
        return this.get(StatsAgentAttributes.nbAcdQuickServed).asInteger();
    }

    /**
     * Returns the number of external non-ACD incoming calls
     * that were successfully served by the agent.
     *
     * @returns the count of non-ACD external incoming calls served
     */
    get nbExtInNonAcdServed(): number | null {
        return this.get(StatsAgentAttributes.nbExtInNonAcdServed).asInteger();
    }

    /**
     * Returns the number of external non-ACD incoming calls that were served too quickly.
     *
     * A "quickly served" call is one answered or handled below the expected service time threshold.
     *
     * @returns the count of external non-ACD incoming calls served too quickly
     */
    get nbExtInNonAcdQuickServed(): number | null {
        return this.get(StatsAgentAttributes.nbExtInNonAcdQuickServed).asInteger();
    }

    /**
     * Returns the number of outgoing calls handled via the ACD system.
     *
     * @returns the count of outgoing ACD calls
     */
    get nbOutAcd(): number | null {
        return this.get(StatsAgentAttributes.nbOutAcd).asInteger();
    }

    /**
     * Returns the number of outgoing ACD calls that were successfully answered.
     *
     * @returns the count of outgoing ACD calls answered
     */
    get nbOutAcdAnswered(): number | null {
        return this.get(StatsAgentAttributes.nbOutAcdAnswered).asInteger();
    }

    /**
     * Returns the number of calls currently in wrap-up.
     *
     * Wrap-up refers to the post-call work period after finishing a call, during which
     * the agent completes administrative or reporting tasks related to the call.
     *
     * @returns the count of calls on wrap-up
     */
    get nbOnWrapup(): number | null {
        return this.get(StatsAgentAttributes.nbOnWrapup).asInteger();
    }

    /**
     * Returns the total duration of ringing for ACD calls that were served.
     *
     * @returns the total ringing duration for served ACD calls
     */
    get ringAcdServedTDur(): string | null {
        return this.get(StatsAgentAttributes.ringAcdServedTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing for ACD calls that were served.
     *
     * @returns the average ringing duration for served ACD calls
     */
    get ringAcdServedADur(): string | null {
        return this.get(StatsAgentAttributes.ringAcdServedADur).asDuration();
    }

    /**
     * Returns the total duration of ringing for non-ACD external incoming calls that were served.
     *
     * @returns the total ringing duration for served non-ACD external incoming calls
     */
    get ringInNonAcdExtServedTDur(): string | null {
        return this.get(StatsAgentAttributes.ringInNonAcdExtServedTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing for non-ACD external incoming calls that were served.
     *
     * @returns the average ringing duration for served non-ACD external incoming calls
     */
    get ringInNonAcdExtServedADur(): string | null {
        return this.get(StatsAgentAttributes.ringInNonAcdExtServedADur).asDuration();
    }

    /**
     * Returns the total duration of ringing for all ACD calls, regardless of whether they were served.
     *
     * @returns the total ringing duration for all ACD calls
     */
    get ringAcdTDur(): string | null {
        return this.get(StatsAgentAttributes.ringAcdTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing for ACD calls.
     *
     * @returns the average ringing duration for ACD calls
     */
    get ringAcdADur(): string | null {
        return this.get(StatsAgentAttributes.ringAcdADur).asDuration();
    }

    /**
     * Returns the total duration of ringing for non-ACD external incoming calls.
     *
     * @returns the total ringing duration for non-ACD external incoming calls
     */
    get ringInNonAcdExtTDur(): string | null {
        return this.get(StatsAgentAttributes.ringInNonAcdExtTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing for non-ACD external incoming calls.
     *
     * @returns the average ringing duration for non-ACD external incoming calls
     */
    get ringInNonAcdExtADur(): string | null {
        return this.get(StatsAgentAttributes.ringInNonAcdExtADur).asDuration();
    }

    /**
     * Returns the total duration of ringing for all calls.
     *
     * @returns the total ringing duration for all calls
     */
    get ringTDur(): string | null {
        return this.get(StatsAgentAttributes.ringTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing for all calls.
     *
     * @returns the average ringing duration for all calls
     */
    get ringADur(): string | null {
        return this.get(StatsAgentAttributes.ringADur).asDuration();
    }

    /**
     * Returns the total duration of conversation for ACD calls.
     *
     * @returns the total conversation duration for ACD calls
     */
    get convAcdTDur(): string | null {
        return this.get(StatsAgentAttributes.convAcdTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for ACD calls.
     *
     * @returns the average conversation duration for ACD calls
     */
    get convAcdADur(): string | null {
        return this.get(StatsAgentAttributes.convAcdADur).asDuration();
    }

    /**
     * Returns the total duration of wrap-up for all served calls.
     *
     * @returns the total wrap-up duration for all served calls
     */
    get wrapupAcdTDur(): string | null {
        return this.get(StatsAgentAttributes.wrapupAcdTDur).asDuration();
    }

    /**
     * Returns the total duration of conversation for internal outgoing non-ACD calls.
     *
     * @returns the total conversation duration for internal outgoing non-ACD calls
     */
    get convLocOutNonacdTDur(): string | null {
        return this.get(StatsAgentAttributes.convLocOutNonAcdTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for internal outgoing non-ACD calls.
     *
     * @returns the average conversation duration for internal outgoing non-ACD calls
     */
    get convLocOutNonacdADur(): string | null {
        return this.get(StatsAgentAttributes.convLocOutNonAcdADur).asDuration();
    }

    /**
     * Returns the total duration of conversation for external outgoing calls.
     *
     * @returns the total conversation duration for external outgoing calls
     */
    get convExtOutTDur(): string | null {
        return this.get(StatsAgentAttributes.convExtOutTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for external outgoing calls.
     *
     * @returns the average conversation duration for external outgoing calls
     */
    get convExtOutADur(): string | null {
        return this.get(StatsAgentAttributes.convExtOutADur).asDuration();
    }

    /**
     * Returns the total duration of conversation for internal non-ACD incoming calls.
     *
     * @returns the total conversation duration for internal non-ACD incoming calls
     */
    get convLocInNonacdTDur(): string | null {
        return this.get(StatsAgentAttributes.convLocInNonAcdTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for internal non-ACD incoming calls.
     *
     * @returns the average conversation duration for internal non-ACD incoming calls
     */
    get convLocInNonacdADur(): string | null {
        return this.get(StatsAgentAttributes.convLocInNonAcdADur).asDuration();
    }

    /**
     * Returns the total duration of conversation for non-ACD external incoming calls.
     *
     * @returns the total conversation duration for non-ACD external incoming calls
     */
    get convExtInNonacdTDur(): string | null {
        return this.get(StatsAgentAttributes.convExtInNonAcdTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for non-ACD external incoming calls.
     *
     * @returns the average conversation duration for non-ACD external incoming calls
     */
    get convExtInNonacdADur(): string | null {
        return this.get(StatsAgentAttributes.convExtInNonAcdADur).asDuration();
    }

    /**
     * Returns the total duration of outgoing ACD call processing.
     *
     * @returns the total duration of outgoing ACD call processing
     */
    get outAcdCommTDur(): string | null {
        return this.get(StatsAgentAttributes.outAcdCommTDur).asDuration();
    }

    /**
     * Returns the average duration of outgoing ACD call processing.
     *
     * @returns the average duration of outgoing ACD call processing
     */
    get outAcdCommADur(): string | null {
        return this.get(StatsAgentAttributes.outAcdCommADur).asDuration();
    }

    /**
     * Returns the total duration of conversation for outgoing ACD calls.
     *
     * @returns the total conversation duration for outgoing ACD calls
     */
    get outAcdConvTDur(): string | null {
        return this.get(StatsAgentAttributes.outAcdConvTDur).asDuration();
    }

    /**
     * Returns the average duration of conversation for outgoing ACD calls.
     *
     * @returns the average conversation duration for outgoing ACD calls
     */
    get outAcdConvADur(): string | null {
        return this.get(StatsAgentAttributes.outAcdConvADur).asDuration();
    }

    /**
     * Returns the total duration of transaction phase for outgoing ACD calls.
     *
     * @returns the total transaction duration for outgoing ACD calls
     */
    get outAcdTransactTDur(): string | null {
        return this.get(StatsAgentAttributes.outAcdTransactTDur).asDuration();
    }

    /**
     * Returns the average duration of transaction phase for outgoing ACD calls.
     *
     * @returns the average transaction duration for outgoing ACD calls
     */
    get outAcdTransactADur(): string | null {
        return this.get(StatsAgentAttributes.outAcdTransactADur).asDuration();
    }

    /**
     * Returns the total duration of wrap-up for outgoing ACD calls.
     *
     * @returns the total wrap-up duration for outgoing ACD calls
     */
    get outAcdWrapupTDur(): string | null {
        return this.get(StatsAgentAttributes.outAcdWrapupTDur).asDuration();
    }

    /**
     * Returns the average duration of wrap-up for outgoing ACD calls.
     *
     * @returns the average wrap-up duration for outgoing ACD calls
     */
    get outAcdWrapupADur(): string | null {
        return this.get(StatsAgentAttributes.outAcdWrapupADur).asDuration();
    }

    /**
     * Returns the total duration of pause phase during outgoing ACD calls.
     *
     * @returns the total pause duration for outgoing ACD calls
     */
    get outAcdPauseTDur(): string | null {
        return this.get(StatsAgentAttributes.outAcdPauseTDur).asDuration();
    }

    /**
     * Returns the average duration of pause phase during outgoing ACD calls.
     *
     * @returns the average pause duration for outgoing ACD calls
     */
    get outAcdPauseADur(): string | null {
        return this.get(StatsAgentAttributes.outAcdPauseADur).asDuration();
    }

    /**
     * Returns the total idle duration during wrap-up time.
     *
     * @returns the total idle duration during wrap-up
     */
    get wrapUpIdleTDur(): string | null {
        return this.get(StatsAgentAttributes.wrapUpIdleTDur).asDuration();
    }

    /**
     * Returns the total duration of calls currently on wrap-up.
     *
     * @returns the cumulative duration of calls on wrap-up
     */
    get callOnWrapupTDur(): string | null {
        return this.get(StatsAgentAttributes.callOnWrapupTDur).asDuration();
    }

    /**
     * Returns the total busy duration during wrap-up.
     *
     * @returns the total busy duration during wrap-up
     */
    get busyOnWrapupTDur(): string | null {
        return this.get(StatsAgentAttributes.busyOnWrapupTDur).asDuration();
    }

    /**
     * Returns the total busy duration outside wrap-up.
     *
     * @returns the total busy duration outside wrap-up
     */
    get busyTDur(): string | null {
        return this.get(StatsAgentAttributes.busyTDur).asDuration();
    }

    /**
     * Returns the percentage of time the agent was logged out.
     */
    get loggedOutPerTime(): number | null {
        return this.get(StatsAgentAttributes.loggedOutPerTime).asFloat();
    }

    /**
     * Returns the percentage of time the agent was not assigned.
     */
    get notAssignedPerTime(): number | null {
        return this.get(StatsAgentAttributes.notAssignedPerTime).asFloat();
    }

    /**
     * Returns the percentage of time the agent was assigned.
     */
    get assignedPerTime(): number | null {
        return this.get(StatsAgentAttributes.assignedPerTime).asFloat();
    }

    /**
     * Returns the percentage of time the agent was withdrawn.
     */
    get withdrawPerTime(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTime).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 1.
     */
    get withdrawPerTimeCause1(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause1).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 2.
     */
    get withdrawPerTimeCause2(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause2).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 3.
     */
    get withdrawPerTimeCause3(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause3).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 4.
     */
    get withdrawPerTimeCause4(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause4).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 5.
     */
    get withdrawPerTimeCause5(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause5).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 6.
     */
    get withdrawPerTimeCause6(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause6).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 7.
     */
    get withdrawPerTimeCause7(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause7).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 8.
     */
    get withdrawPerTimeCause8(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause8).asFloat();
    }

    /**
     * Returns the percentage of withdrawn time due to cause 9.
     */
    get withdrawPerTimeCause9(): number | null {
        return this.get(StatsAgentAttributes.withdrawPerTimeCause9).asFloat();
    }

    /**
     * Returns the number of pilots assigned to the agent.
     */
    get nbPilots(): number | null {
        return this.get(StatsAgentAttributes.nbPilots).asInteger();
    }

    /**
     * Returns the total number of ACD calls served by the agent.
     */
    get nbAcdServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbAcdServedCalls).asInteger();
    }

    /**
     * Returns the number of incoming ACD calls served by the agent.
     */
    get nbAcdInServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbAcdInServedCalls).asInteger();
    }

    /**
     * Returns the number of incoming calls received by pilots.
     */
    get nbInCallsReceivedByPilot(): number | null {
        return this.get(StatsAgentAttributes.nbInCallsReceivedByPilot).asInteger();
    }

    /**
     * Returns the number of outgoing ACD calls served by the agent.
     */
    get nbAcdOutServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbAcdOutServedCalls).asInteger();
    }

    /**
     * Returns the total number of calls that were not served.
     */
    get nbTotNonServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbTotNonServedCalls).asInteger();
    }

    /**
     * Returns the number of incoming calls that were not served.
     */
    get nbInNonServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbInNonServedCalls).asInteger();
    }

    /**
     * Returns the number of calls that were picked up by the agent.
     */
    get nbPickedUpCalls(): number | null {
        return this.get(StatsAgentAttributes.nbPickedUpCalls).asInteger();
    }

    /**
     * Returns the number of calls that were refused by the agent.
     */
    get nbRefusedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbRefusedCalls).asInteger();
    }

    /**
     * Returns the number of outgoing ACD calls that were not served.
     */
    get nbAcdOutNonServedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbAcdOutNonServedCalls).asInteger();
    }

    /**
     * Returns the total number of non-ACD calls received by the agent.
     */
    get nbTotNonAcdreceivedCalls(): number | null {
        return this.get(StatsAgentAttributes.nbTotNonAcdReceivedCalls).asInteger();
    }

    /**
     * Returns the number of incoming non-ACD calls received by the agent.
     */
    get nbInNonAcdCalls(): number | null {
        return this.get(StatsAgentAttributes.nbInNonAcdCalls).asInteger();
    }

    /**
     * Returns the number of outgoing non-ACD calls made by the agent.
     */
    get nbOutNonAcdCalls(): number | null {
        return this.get(StatsAgentAttributes.nbOutNonAcdCalls).asInteger();
    }

    /**
     * Returns the total duration during which the agent was assigned but not withdrawn.
     */
    get assignedNotWithdrawDur(): string | null {
        return this.get(StatsAgentAttributes.assignedNotWithdrawDur).asDuration();
    }

    /**
     * Returns the total duration during which the agent was withdrawn.
     */
    get withdrawDur(): string | null {
        return this.get(StatsAgentAttributes.withdrawDur).asDuration();
    }

    /**
     * Returns the total duration of manual wrap-up work performed by the agent.
     */
    get manuWrapupDur(): string | null {
        return this.get(StatsAgentAttributes.manuWrapupDur).asDuration();
    }

    /**
     * Returns the total duration during which the agent was unreachable.
     */
    get unreachableDur(): string | null {
        return this.get(StatsAgentAttributes.unreachableDur).asDuration();
    }

    /**
     * Returns the total duration of non-ACD work performed by the agent.
     */
    get nonAcdWorkTDur(): string | null {
        return this.get(StatsAgentAttributes.nonAcdWorkTDur).asDuration();
    }

    /**
     * Returns the average duration of non-ACD work performed by the agent.
     */
    get nonAcdWorkADur(): string | null {
        return this.get(StatsAgentAttributes.nonAcdWorkADur).asDuration();
    }

    /**
     * Returns the total duration of ACD work performed by the agent.
     */
    get acdWorkTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkTDur).asDuration();
    }

    /**
     * Returns the average duration of ACD work performed by the agent.
     */
    get acdWorkADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkADur).asDuration();
    }

    /**
     * Returns the total duration of incoming ACD work.
     */
    get acdWorkInTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInTDur).asDuration();
    }

    /**
     * Returns the average duration of incoming ACD work.
     */
    get acdWorkInADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInADur).asDuration();
    }

    /**
     * Returns the total duration of conversations during incoming ACD work.
     */
    get acdWorkInConvTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInConvTDur).asDuration();
    }

    /**
     * Returns the average duration of conversations during incoming ACD work.
     */
    get acdWorkInConvADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInConvADur).asDuration();
    }

    /**
     * Returns the total duration of ringing during incoming ACD work.
     */
    get acdWorkInRingTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInRingTDur).asDuration();
    }

    /**
     * Returns the average duration of ringing during incoming ACD work.
     */
    get acdWorkInRingADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInRingADur).asDuration();
    }

    /**
     * Returns the total duration of wrap-up during incoming ACD work.
     */
    get acdWorkInWrapupTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInWrapupTDur).asDuration();
    }

    /**
     * Returns the average duration of wrap-up during incoming ACD work.
     */
    get acdWorkInWrapupADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkInWrapupADur).asDuration();
    }

    /**
     * Returns the total duration of outgoing ACD work.
     */
    get acdWorkOutTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutTDur).asDuration();
    }

    /**
     * Returns the average duration of outgoing ACD work.
     */
    get acdWorkOutADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutADur).asDuration();
    }

    /**
     * Returns the total duration of conversations during outgoing ACD work.
     */
    get acdWorkOutConvTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutConvTDur).asDuration();
    }

    /**
     * Returns the average duration of conversations during outgoing ACD work.
     */
    get acdWorkOutConvADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutConvADur).asDuration();
    }

    /**
     * Returns the total duration of wrap-up during outgoing ACD work.
     */
    get acdWorkOutWrapupTDur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutWrapupTDur).asDuration();
    }

    /**
     * Returns the average duration of wrap-up during outgoing ACD work.
     */
    get acdWorkOutWrapupADur(): string | null {
        return this.get(StatsAgentAttributes.acdWorkOutWrapupADur).asDuration();
    }

    /**
     * Returns the total duration of conversations for incoming ACD calls.
     */
    get acdInConvTDur(): string | null {
        return this.get(StatsAgentAttributes.acdInConvTDur).asDuration();
    }

    /**
     * Returns the average duration of conversations for incoming ACD calls.
     */
    get acdInConvADur(): string | null {
        return this.get(StatsAgentAttributes.acdInConvADur).asDuration();
    }

    /**
     * Returns the total duration of conversations for outgoing ACD calls.
     */
    get acdOutConvTDur(): string | null {
        return this.get(StatsAgentAttributes.acdOutConvTDur).asDuration();
    }

    /**
     * Returns the average duration of conversations for outgoing ACD calls.
     */
    get acdOutConvADur(): string | null {
        return this.get(StatsAgentAttributes.acdOutConvADur).asDuration();
    }
}
