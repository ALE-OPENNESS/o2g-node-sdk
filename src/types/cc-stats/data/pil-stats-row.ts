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

import { PilotStatisticsRowJson } from '../../../internal/types/cc-stats/cc-stat-types';
import { StatValue } from './stat-value';
import { StatsPilotAttributes } from '../pilot-attributes';

export class PilotStatisticsRow {
    [key: string]: any; // for dynamic field access

    private values: Map<StatsPilotAttributes, StatValue> = new Map();
    #date?: string;
    #queueName?: string;
    #pilotName?: string;
    #pilotNumber?: string;

    /**
     * @internal
     */
    constructor(json: PilotStatisticsRowJson) {
        this.initializeFromJson(json);
    }

    private initializeFromJson(json: PilotStatisticsRowJson) {
        if (json.date !== undefined) this.#date = json.date;
        if (json.queueName !== undefined) this.#queueName = json.queueName;
        if (json.pilotName !== undefined) this.#pilotName = json.pilotName;
        if (json.pilotNumber !== undefined) this.#pilotNumber = json.pilotNumber;

        // remaining StatsAgentAttributes
        for (const key in json) {
            const value = json[key as keyof PilotStatisticsRowJson];
            if (value !== undefined && typeof value !== 'string' && typeof value !== 'number' && value !== null)
                continue;

            const attr = Object.values(StatsPilotAttributes).find((e) => e === key);
            if (attr && (typeof value === 'string' || typeof value === 'number' || value === null)) {
                this.values.set(attr as StatsPilotAttributes, new StatValue(value));
            }
        }
    }

    /** Static factory method */
    /** @internal */

    static fromJson(json: PilotStatisticsRowJson): PilotStatisticsRow {
        return new PilotStatisticsRow(json);
    }

    /**
     * Access a statistic by enum.
     * Always returns a StatValue, even if original value is null.
     */
    get(attr: StatsPilotAttributes): StatValue {
        const stat = this.values.get(attr);
        if (!stat) {
            return new StatValue(null); // always return StatValue
        }
        if (attr == StatsPilotAttributes.ALL) {
            return new StatValue(null);
        }

        return stat;
    }

    /**
     * Returns the timestamp associated with this statistics row.
     * <p>
     * The returned value represents the date at which the statistics were
     * collected, as a JavaScript Date.
     *
     * @returns the Date representing when this statistics entry was recorded
     */
    get dateValue(): Date | null {
        if (!this.#date) return null;
        const [year, month, day] = this.#date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    /**
     * Queue's name.
     *
     * @returns the name of the queue
     */
    get queueNameValue(): string | null {
        return this.#queueName ?? null;
    }

    /**
     * Pilot's name.
     *
     * @returns the name of the pilot
     */
    get pilotNameValue(): string | null {
        return this.#pilotName ?? null;
    }

    /**
     * Pilot's number.
     *
     * @returns the pilot's phone number
     */
    get pilotNumberValue(): string | null {
        return this.#pilotNumber ?? null;
    }

    /**
     * Number of calls received in open state (PC001).
     *
     * @return the number of calls received in open state
     */
    get nbCallsOpen(): string | null {
        return this.get(StatsPilotAttributes.nbCallsOpen).asString();
    }

    /**
     * Number of calls received in blocked state (PC002).
     *
     * @return the number of calls received in blocked state
     */
    get nbCallsBlocked(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBlocked).asString();
    }

    /**
     * Number of calls received in general forwarding state (PC003).
     *
     * @return the number of calls received in forwarding state
     */
    get nbCallsForward(): string | null {
        return this.get(StatsPilotAttributes.nbCallsForward).asString();
    }

    /**
     * Number of calls received by transfer (PC004).
     *
     * @return the number of calls received via transfer
     */
    get nbCallsByTransfer(): string | null {
        return this.get(StatsPilotAttributes.nbCallsByTransfer).asString();
    }

    /**
     * Number of calls received by mutual aid (PC005).
     *
     * @return the number of calls received via mutual aid
     */
    get nbCallsByMutualAid(): string | null {
        return this.get(StatsPilotAttributes.nbCallsByMutualAid).asString();
    }

    /**
     * Maximum number of simultaneous calls (PC006).
     *
     * @return the maximum number of simultaneous calls
     */
    get maxNbSimultCalls(): string | null {
        return this.get(StatsPilotAttributes.maxNbSimultCalls).asString();
    }

    /**
     * Number of overflows while calls were in queue (PC007).
     *
     * @return the number of timing overflows while calls were waiting in the queue
     */
    get nbOverflowInQueue(): string | null {
        return this.get(StatsPilotAttributes.nbOverflowInQueue).asString();
    }

    /**
     * Number of overflows while calls were ringing the agent (PC008).
     *
     * @return the number of timing overflows while calls were ringing the agent
     */
    get nbOverflowInRinging(): string | null {
        return this.get(StatsPilotAttributes.nbOverflowInRinging).asString();
    }

    /**
     * Number of calls served without queuing (PC009).
     *
     * @return the number of calls served immediately without queuing
     */
    get nbCallsWOQueuing(): string | null {
        return this.get(StatsPilotAttributes.nbCallsWOQueuing).asString();
    }

    /**
     * Number of calls served after queuing (PC010).
     *
     * @return the number of calls served after waiting in queue
     */
    get nbCallsAfterQueuing(): string | null {
        return this.get(StatsPilotAttributes.nbCallsAfterQueuing).asString();
    }

    /**
     * Number of calls sent in mutual aid queue (PC011).
     *
     * @return the number of calls redirected to the mutual aid queue
     */
    get nbCallsSentInMutualAidQueue(): string | null {
        return this.get(StatsPilotAttributes.nbCallsSentInMutualAidQueue).asString();
    }

    /**
     * Number of calls redirected outside ACD area (PC012).
     *
     * @return the number of calls redirected outside the ACD area
     */
    get nbCallsRedirectedOutACDArea(): string | null {
        return this.get(StatsPilotAttributes.nbCallsRedirectedOutACDArea).asString();
    }

    /**
     * Number of calls dissuaded (PC013).
     *
     * @return the number of calls that were dissuaded
     */
    get nbCallsDissuaded(): string | null {
        return this.get(StatsPilotAttributes.nbCallsDissuaded).asString();
    }

    /**
     * Number of calls dissuaded after trying mutual aid (PC014).
     *
     * @return the number of calls dissuaded after attempting mutual aid
     */
    get nbCallsDissuadedAfterTryingMutualAid(): string | null {
        return this.get(StatsPilotAttributes.nbCallsDissuadedAfterTryingMutualAid).asString();
    }

    /**
     * Number of calls processed by VG type PG (PC015).
     *
     * @return the number of calls processed by VG type PG
     */
    get nbCallsVGTypePG(): string | null {
        return this.get(StatsPilotAttributes.nbCallsVGTypePG).asString();
    }

    /**
     * Number of calls sent to remote PG (PC016).
     *
     * @return the number of calls sent to a remote PG
     */
    get nbCallsSentToPG(): string | null {
        return this.get(StatsPilotAttributes.nbCallsSentToPG).asString();
    }

    /**
     * Number of calls rejected due to lack of resources (PC017).
     *
     * @return the number of calls rejected due to insufficient resources
     */
    get nbCallsRejectedLackOfRes(): string | null {
        return this.get(StatsPilotAttributes.nbCallsRejectedLackOfRes).asString();
    }

    /**
     * Number of calls served by agent (PC018).
     *
     * @return the number of calls served by an agent
     */
    get nbCallsServedByAgent(): string | null {
        return this.get(StatsPilotAttributes.nbCallsServedByAgent).asString();
    }

    /**
     * Number of calls served in time (PC019).
     *
     * @return the number of calls served within the expected time
     */
    get nbCallsServedInTime(): string | null {
        return this.get(StatsPilotAttributes.nbCallsServedInTime).asString();
    }

    /**
     * Number of calls served too quickly (PC020).
     *
     * @return the number of calls served too quickly
     */
    get nbCallsServedTooQuick(): string | null {
        return this.get(StatsPilotAttributes.nbCallsServedTooQuick).asString();
    }

    /**
     * Number of calls without transaction code (PC021).
     *
     * @return the number of calls without a transaction code
     */
    get nbCallsWithoutTransCode(): string | null {
        return this.get(StatsPilotAttributes.nbCallsWithoutTransCode).asString();
    }

    /**
     * Number of calls with transaction code (PC022).
     *
     * @return the number of calls with a transaction code
     */
    get nbCallsWithTransCode(): string | null {
        return this.get(StatsPilotAttributes.nbCallsWithTransCode).asString();
    }

    /**
     * Number of calls redistributed (PC023).
     *
     * @return the number of calls that were redistributed
     */
    get nbCallsRedistrib(): string | null {
        return this.get(StatsPilotAttributes.nbCallsRedistrib).asString();
    }

    /**
     * Number of calls served before threshold 1 (PC024).
     *
     * @return the number of calls served before the first time threshold
     */
    get nbCallsBeforeTS1(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS1).asString();
    }

    /**
     * Percentage of calls served before threshold 1 (PC025).
     *
     * @return the percentage of calls served before threshold 1
     */
    get percentCallsBeforeTS1(): number | null {
        return this.get(StatsPilotAttributes.percentCallsBeforeTS1).asFloat();
    }

    /**
     * Number of calls served before threshold 2 (PC026).
     *
     * @return the number of calls served before threshold 2
     */
    get nbCallsBeforeTS2(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS2).asString();
    }

    /**
     * Percentage of calls served before threshold 2 (PC027).
     *
     * @return the percentage of calls served before threshold 2
     */
    get percentCallsBeforeTS2(): number | null {
        return this.get(StatsPilotAttributes.percentCallsBeforeTS2).asFloat();
    }

    /**
     * Number of calls served before threshold 3 (PC028).
     *
     * @return the number of calls served before threshold 3
     */
    get nbCallsBeforeTS3(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS3).asString();
    }

    /**
     * Percentage of calls served before threshold 3 (PC029).
     *
     * @return the percentage of calls served before threshold 3
     */
    get percentCallsBeforeTS3(): number | null {
        return this.get(StatsPilotAttributes.percentCallsBeforeTS3).asFloat();
    }

    /**
     * Number of calls served before threshold 4 (PC030).
     *
     * @return the number of calls served before threshold 4
     */
    get nbCallsBeforeTS4(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS4).asString();
    }

    /**
     * Percentage of calls served before threshold 4 (PC031).
     *
     * @return the percentage of calls served before threshold 4
     */
    get percentCallsBeforeTS4(): number | null {
        return this.get(StatsPilotAttributes.percentCallsBeforeTS4).asFloat();
    }

    /**
     * Number of calls served after threshold 4 (PC032).
     *
     * @return the number of calls served after threshold 4
     */
    get nbCallsAfterTS4(): string | null {
        return this.get(StatsPilotAttributes.nbCallsAfterTS4).asString();
    }

    /**
     * Percentage of calls served after threshold 4 (PC033).
     *
     * @return the percentage of calls served after threshold 4
     */
    get percentCallsAfterTS4(): number | null {
        return this.get(StatsPilotAttributes.percentCallsAfterTS4).asFloat();
    }

    /**
     * Number of abandons on greeting voice guide (PC034).
     *
     * @return the number of calls abandoned on greeting voice guide
     */
    get nbAbandonsOnGreetingsVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnGreetingsVG).asString();
    }

    /**
     * Number of abandons on first waiting voice guide (PC035).
     *
     * @return the number of calls abandoned on first waiting voice guide
     */
    get nbAbandonsOn1WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn1WaitingVG).asString();
    }

    /**
     * Number of abandons on second waiting voice guide (PC036).
     *
     * @return the number of calls abandoned on second waiting voice guide
     */
    get nbAbandonsOn2WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn2WaitingVG).asString();
    }

    /**
     * Number of abandons on third waiting voice guide (PC037).
     *
     * @return the number of calls abandoned on third waiting voice guide
     */
    get nbAbandonsOn3WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn3WaitingVG).asString();
    }

    /**
     * Number of abandons on fourth waiting voice guide (PC038).
     *
     * @return the number of calls abandoned on fourth waiting voice guide
     */
    get nbAbandonsOn4WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn4WaitingVG).asString();
    }

    /**
     * Number of abandons on fifth waiting voice guide (PC039).
     *
     * @return the number of calls abandoned on fifth waiting voice guide
     */
    get nbAbandonsOn5WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn5WaitingVG).asString();
    }

    /**
     * Number of abandons on sixth waiting voice guide (PC040).
     *
     * @return the number of calls abandoned on sixth waiting voice guide
     */
    get nbAbandonsOn6WaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn6WaitingVG).asString();
    }

    /**
     * Number of abandons on ringing (PC041).
     *
     * @return the number of calls abandoned while ringing
     */
    get nbAbandonsOnRinging(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnRinging).asString();
    }

    /**
     * Number of abandons on general forwarding voice guide (PC042).
     *
     * @return the number of calls abandoned on general forwarding voice guide
     */
    get nbAbandonsOnGenFwdVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnGenFwdVG).asString();
    }

    /**
     * Number of abandons on blocked voice guide (PC043).
     *
     * @return the number of calls abandoned on blocked voice guide
     */
    get nbAbandonsOnBlockedVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnBlockedVG).asString();
    }

    /**
     * Number of abandons of direct calls while waiting on agent busy (PC044).
     *
     * @return the number of calls abandoned due to agent being busy
     */
    get nbAbandonsOnAgentBusy(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnAgentBusy).asString();
    }

    /**
     * Overall number of abandons (PC045).
     *
     * @return the total number of call abandons
     */
    get nbAbandons(): string | null {
        return this.get(StatsPilotAttributes.nbAbandons).asString();
    }

    /**
     * Number of abandons before threshold 1 (PC046).
     *
     * @return the number of call abandons before threshold 1
     */
    get nbAbandonsBeforeTS1(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsBeforeTS1).asString();
    }

    /**
     * Percentage of abandons before threshold 1 (PC047).
     *
     * @return the percentage of call abandons before threshold 1
     */
    get percentAbandonsBeforeTS1(): number | null {
        return this.get(StatsPilotAttributes.percentAbandonsBeforeTS1).asFloat();
    }

    /**
     * Number of abandons before threshold 2 (PC048).
     *
     * @return the number of call abandons before threshold 2
     */
    get nbAbandonsBeforeTS2(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsBeforeTS2).asString();
    }

    /**
     * Percentage of abandons before threshold 2 (PC049).
     *
     * @return the percentage of call abandons before threshold 2
     */
    get percentAbandonsBeforeTS2(): number | null {
        return this.get(StatsPilotAttributes.percentAbandonsBeforeTS2).asFloat();
    }

    /**
     * Number of abandons before threshold 3 (PC050).
     *
     * @return the number of call abandons before threshold 3
     */
    get nbAbandonsBeforeTS3(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsBeforeTS3).asString();
    }

    /**
     * Percentage of abandons before threshold 3 (PC051).
     *
     * @return the percentage of call abandons before threshold 3
     */
    get percentAbandonsBeforeTS3(): number | null {
        return this.get(StatsPilotAttributes.percentAbandonsBeforeTS3).asFloat();
    }

    /**
     * Number of abandons before threshold 4 (PC052).
     *
     * @return the number of call abandons before threshold 4
     */
    get nbAbandonsBeforeTS4(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsBeforeTS4).asString();
    }

    /**
     * Percentage of abandons before threshold 4 (PC053).
     *
     * @return the percentage of call abandons before threshold 4
     */
    get percentAbandonsBeforeTS4(): number | null {
        return this.get(StatsPilotAttributes.percentAbandonsBeforeTS4).asFloat();
    }

    /**
     * Number of abandons after threshold 4 (PC054).
     *
     * @return the number of call abandons after threshold 4
     */
    get nbAbandonsAfterTS4(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsAfterTS4).asString();
    }

    /**
     * Percentage of abandons after threshold 4 (PC055).
     *
     * @return the percentage of call abandons after threshold 4
     */
    get percentAbandonsAfterTS4(): number | null {
        return this.get(StatsPilotAttributes.percentAbandonsAfterTS4).asFloat();
    }

    /**
     * Total duration of call processing (PC056).
     *
     * @return the total duration of call processing
     */
    get callProcTDur(): string | null {
        return this.get(StatsPilotAttributes.callProcTDur).asDuration();
    }

    /**
     * Average duration of call processing (PC057).
     *
     * @return the average duration of call processing
     */
    get callProcADur(): string | null {
        return this.get(StatsPilotAttributes.callProcADur).asDuration();
    }

    /**
     * Total duration of greeting guide listening (PC058).
     *
     * @return the total duration spent listening to greeting guide
     */
    get greetingListenTDur(): string | null {
        return this.get(StatsPilotAttributes.greetingListenTDur).asDuration();
    }

    /**
     * Average duration of greeting guide listening (PC059).
     *
     * @return the average duration spent listening to greeting guide
     */
    get greetingListenADur(): string | null {
        return this.get(StatsPilotAttributes.greetingListenADur).asDuration();
    }

    /**
     * Total time before queuing (PC060).
     *
     * @return the total duration before calls are queued
     */
    get beforeQueuingTDur(): string | null {
        return this.get(StatsPilotAttributes.beforeQueuingTDur).asDuration();
    }

    /**
     * Total waiting duration of served calls (PC061).
     *
     * @return the total waiting duration of served calls
     */
    get waitServedCallsTDur(): string | null {
        return this.get(StatsPilotAttributes.waitServedCallsTDur).asDuration();
    }

    /**
     * Average waiting duration of served calls (PC062).
     *
     * @return the average waiting duration of served calls
     */
    get waitServedCallsADur(): string | null {
        return this.get(StatsPilotAttributes.waitServedCallsADur).asDuration();
    }

    /**
     * Total waiting duration of abandoned calls (PC063).
     *
     * @return the total waiting duration of abandoned calls
     */
    get waitAbandonnedCallsTDur(): string | null {
        return this.get(StatsPilotAttributes.waitAbandonnedCallsTDur).asDuration();
    }

    /**
     * Average waiting duration of abandoned calls (PC064).
     *
     * @return the average waiting duration of abandoned calls
     */
    get waitAbandonnedCallsADur(): string | null {
        return this.get(StatsPilotAttributes.waitAbandonnedCallsADur).asDuration();
    }

    /**
     * Total duration of ringing (PC065).
     *
     * @return the total ringing duration
     */
    get ringingTDur(): string | null {
        return this.get(StatsPilotAttributes.ringingTDur).asDuration();
    }

    /**
     * Average duration of ringing (PC066).
     *
     * @return the average ringing duration
     */
    get ringingADur(): string | null {
        return this.get(StatsPilotAttributes.ringingADur).asDuration();
    }

    /**
     * Total duration of conversation (PC067).
     *
     * @return the total conversation duration
     */
    get convTDur(): string | null {
        return this.get(StatsPilotAttributes.convTDur).asDuration();
    }

    /**
     * Average duration of conversation (PC068).
     *
     * @return the average conversation duration
     */
    get convADur(): string | null {
        return this.get(StatsPilotAttributes.convADur).asDuration();
    }

    /**
     * Total duration of hold calls (PC069).
     *
     * @return the total duration of calls on hold
     */
    get holdCallsTDur(): string | null {
        return this.get(StatsPilotAttributes.holdCallsTDur).asDuration();
    }

    /**
     * Average duration of hold calls (PC070).
     *
     * @return the average duration of calls on hold
     */
    get holdCallsADur(): string | null {
        return this.get(StatsPilotAttributes.holdCallsADur).asDuration();
    }

    /**
     * Total duration of wrap-up (PC071).
     *
     * @return the total wrap-up duration
     */
    get wrapupTDur(): string | null {
        return this.get(StatsPilotAttributes.wrapupTDur).asDuration();
    }

    /**
     * Average duration of wrap-up (PC072).
     *
     * @return the average wrap-up duration
     */
    get wrapupADur(): string | null {
        return this.get(StatsPilotAttributes.wrapupADur).asDuration();
    }

    /**
     * Longest waiting time (PC073).
     *
     * @return the longest waiting duration for a call
     */
    get longestWaitingDur(): string | null {
        return this.get(StatsPilotAttributes.longestWaitingDur).asDuration();
    }

    /**
     * Service level (PC077).
     *
     * @return the service level
     */
    get serviceLevel(): number | null {
        return this.get(StatsPilotAttributes.serviceLevel).asFloat();
    }

    /**
     * Efficiency (PC078).
     *
     * @return the efficiency of the queue or pilot
     */
    get efficiency(): number | null {
        return this.get(StatsPilotAttributes.efficiency).asFloat();
    }

    /**
     * In-service state (pilot state percent) (PC079).
     *
     * @return the in-service state as a percentage
     */
    get inServiceState(): number | null {
        return this.get(StatsPilotAttributes.inServiceState).asFloat();
    }

    /**
     * General forwarding state (pilot state percent) (PC080).
     *
     * @return the general forwarding state as a percentage
     */
    get genFwdState(): number | null {
        return this.get(StatsPilotAttributes.genFwdState).asFloat();
    }

    /**
     * Blocked state (pilot state percent) (PC081).
     *
     * @return the blocked state as a percentage
     */
    get blockedState(): number | null {
        return this.get(StatsPilotAttributes.blockedState).asFloat();
    }

    /**
     * Total number of received calls (PC082).
     *
     * @return the total number of received calls
     */
    get dnbTotReceivedCalls(): string | null {
        return this.get(StatsPilotAttributes.dnbTotReceivedCalls).asString();
    }

    /**
     * Number of received calls in pilot open (PC083).
     *
     * @return the number of received calls in open state
     */
    get dnbCallsOpen(): string | null {
        return this.get(StatsPilotAttributes.nbCallsOpen).asString();
    }

    /**
     * Number of received calls in pilot blocked (PC084).
     *
     * @return the number of received calls in blocked state
     */
    get dnbCallsBlocked(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBlocked).asString();
    }

    /**
     * Number of received calls in pilot general forwarding (PC085).
     *
     * @return the number of received calls in general forwarding state
     */
    get dnbCallsForward(): string | null {
        return this.get(StatsPilotAttributes.nbCallsForward).asString();
    }

    /**
     * Number of received calls in direct routing (PC086).
     *
     * @return the number of received calls routed directly
     */
    get dnbDirectRoute(): string | null {
        return this.get(StatsPilotAttributes.dnbTotReceivedCalls).asString();
    }

    /**
     * Number of received calls in indirect routing (PC087).
     *
     * @return the number of received calls routed indirectly
     */
    get dnbIndirectRoute(): string | null {
        return this.get(StatsPilotAttributes.dnbTotReceivedCalls).asString();
    }

    /**
     * Total number of served calls (PC088).
     *
     * @return the total number of served calls
     */
    get dnbTotServedCalls(): string | null {
        return this.get(StatsPilotAttributes.nbCallsServedByAgent).asString();
    }

    /**
     * ACD served calls efficiency (PC089).
     *
     * @return the efficiency of ACD served calls
     */
    get defficiency(): string | null {
        return this.get(StatsPilotAttributes.efficiency).asString();
    }

    /**
     * Number of ACD served calls without queuing (PC090).
     *
     * @return the number of ACD served calls without queuing
     */
    get dnbCallsWOQueuing(): string | null {
        return this.get(StatsPilotAttributes.nbCallsWOQueuing).asString();
    }

    /**
     * Number of ACD served calls after queuing (PC091).
     *
     * @return the number of ACD served calls after queuing
     */
    get dnbCallsAfterQueuing(): string | null {
        return this.get(StatsPilotAttributes.nbCallsAfterQueuing).asString();
    }

    /**
     * Number of ACD served calls before threshold 1 (PC092).
     *
     * @return the number of ACD served calls before threshold 1
     */
    get dnbCallsBeforeTS1(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS1).asString();
    }

    /**
     * Number of ACD served calls before threshold 2 (PC093).
     *
     * @return the number of ACD served calls before threshold 2
     */
    get dnbCallsBeforeTS2(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS2).asString();
    }

    /**
     * Number of ACD served calls before threshold 3 (PC094).
     *
     * @return the number of ACD served calls before threshold 3
     */
    get dnbCallsBeforeTS3(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS3).asString();
    }

    /**
     * Number of ACD served calls before threshold 4 (PC095).
     *
     * @return the number of ACD served calls before threshold 4
     */
    get dnbCallsBeforeTS4(): string | null {
        return this.get(StatsPilotAttributes.nbCallsBeforeTS4).asString();
    }

    /**
     * Number of ACD served calls after threshold 4 (PC096).
     *
     * @return the number of ACD served calls after threshold 4
     */
    get dnbCallsAfterTS4(): string | null {
        return this.get(StatsPilotAttributes.nbCallsAfterTS4).asString();
    }

    /**
     * Average waiting time for ACD served calls (PC097).
     *
     * @return the average waiting duration of served calls
     */
    get dwaitServedCallsADur(): string | null {
        return this.get(StatsPilotAttributes.waitServedCallsADur).asDuration();
    }

    /**
     * Total number of abandons (PC098).
     *
     * @return the total number of abandoned calls
     */
    get dnbAbandons(): string | null {
        return this.get(StatsPilotAttributes.nbAbandons).asString();
    }

    /**
     * Number of abandons on greetings voice guide (PC099).
     *
     * @return the number of abandons during greeting voice guide
     */
    get dnbAbandonsOnGreetingsVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOnGreetingsVG).asString();
    }

    /**
     * Number of abandons on waiting voice guide (PC100).
     *
     * @return the number of abandons during waiting voice guide
     */
    get dnbAbandonsOnWaitingVG(): string | null {
        return this.get(StatsPilotAttributes.nbAbandonsOn1WaitingVG).asString();
    }
}
