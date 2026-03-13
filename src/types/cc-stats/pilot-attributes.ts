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

/**
 * `PilotAttributes` enumerates the possible attributes for a Call Center CCD pilot.
 *
 * Each attribute corresponds to a statistic that can be reported by `CallCenterStatisticsService`.
 * These attributes allow fine-grained analysis of pilot performance, call handling, waiting times, and service levels.
 *
 * The special attribute `ALL` includes all available attributes and is mainly intended for testing or bulk retrieval purposes.
 *
 * @since 2.7.4
 */
export enum StatsPilotAttributes {
    /**
     * Number of calls received in the open state.
     * An open state call is one that is offered to the pilot without any restrictions or routing blocks.
     */
    nbCallsOpen = 'nbCallsOpen',

    /**
     * Number of calls received in the blocked state.
     * A blocked state call is one that could not be delivered immediately due to pilot availability or system constraints.
     */
    nbCallsBlocked = 'nbCallsBlocked',

    /**
     * Number of calls received in the general forwarding state.
     * This represents calls that were routed to the pilot via general forwarding rules.
     */
    nbCallsForward = 'nbCallsForward',

    /** Number of calls received by transfer. These are calls transferred to this pilot. */
    nbCallsByTransfer = 'nbCallsByTransfer',

    /** Number of calls received via mutual aid. */
    nbCallsByMutualAid = 'nbCallsByMutualAid',

    /**
     * Maximum number of simultaneous calls.
     * Represents the peak number of concurrent calls handled by the pilot at any given moment.
     */
    maxNbSimultCalls = 'maxNbSimultCalls',

    /** Number of overflows while calls were in queue. */
    nbOverflowInQueue = 'nbOverflowInQueue',

    /** Number of overflows while calls were ringing the agent. */
    nbOverflowInRinging = 'nbOverflowInRinging',

    /** Number of calls served without queuing. */
    nbCallsWOQueuing = 'nbCallsWOQueuing',

    /** Number of calls served after queuing. */
    nbCallsAfterQueuing = 'nbCallsAfterQueuing',

    /** Number of calls sent to the mutual aid queue. */
    nbCallsSentInMutualAidQueue = 'nbCallsSentInMutualAidQueue',

    /** Number of calls redirected outside the ACD area. */
    nbCallsRedirectedOutACDArea = 'nbCallsRedirectedOutACDArea',

    /** Number of calls dissuaded before reaching an agent. */
    nbCallsDissuaded = 'nbCallsDissuaded',

    /** Number of calls dissuaded after attempting mutual aid. */
    nbCallsDissuadedAfterTryingMutualAid = 'nbCallsDissuadedAfterTryingMutualAid',

    /** Number of calls processed by VG type PG. */
    nbCallsVGTypePG = 'nbCallsVGTypePG',

    /** Number of calls sent to a remote PG. */
    nbCallsSentToPG = 'nbCallsSentToPG',

    /** Number of calls rejected due to lack of resources. */
    nbCallsRejectedLackOfRes = 'nbCallsRejectedLackOfRes',

    /** Number of calls served by the agent. */
    nbCallsServedByAgent = 'nbCallsServedByAgent',

    /** Number of calls served within the expected time. */
    nbCallsServedInTime = 'nbCallsServedInTime',

    /** Number of calls served too quickly. */
    nbCallsServedTooQuick = 'nbCallsServedTooQuick',

    /** Number of calls without a transaction code. */
    nbCallsWithoutTransCode = 'nbCallsWithoutTransCode',

    /** Number of calls with a transaction code. */
    nbCallsWithTransCode = 'nbCallsWithTransCode',

    /** Number of calls redistributed to other agents or queues. */
    nbCallsRedistrib = 'nbCallsRedistrib',

    /** Number of calls served before threshold 1 (e.g., 5 seconds). */
    nbCallsBeforeTS1 = 'nbCallsBeforeTS1',

    /** Percentage of calls served before threshold 1 (e.g., 5 seconds). */
    percentCallsBeforeTS1 = 'percentCallsBeforeTS1',

    /** Number of calls served before threshold 2 (e.g., 15 seconds). */
    nbCallsBeforeTS2 = 'nbCallsBeforeTS2',

    /** Percentage of calls served before threshold 2 (e.g., 15 seconds). */
    percentCallsBeforeTS2 = 'percentCallsBeforeTS2',

    /** Number of calls served before threshold 3 (e.g., 30 seconds). */
    nbCallsBeforeTS3 = 'nbCallsBeforeTS3',

    /** Percentage of calls served before threshold 3 (e.g., 30 seconds). */
    percentCallsBeforeTS3 = 'percentCallsBeforeTS3',

    /** Number of calls served before threshold 4 (e.g., 60 seconds). */
    nbCallsBeforeTS4 = 'nbCallsBeforeTS4',

    /** Percentage of calls served before threshold 4 (e.g., 60 seconds). */
    percentCallsBeforeTS4 = 'percentCallsBeforeTS4',

    /** Number of calls served after threshold 4 (e.g., 60 seconds). */
    nbCallsAfterTS4 = 'nbCallsAfterTS4',

    /** Percentage of calls served after threshold 4 (e.g., 60 seconds). */
    percentCallsAfterTS4 = 'percentCallsAfterTS4',

    /** Number of abandons during the greeting voice guide. */
    nbAbandonsOnGreetingsVG = 'nbAbandonsOnGreetingsVG',

    /** Number of abandons during the first waiting voice guide. */
    nbAbandonsOn1WaitingVG = 'nbAbandonsOn1WaitingVG',

    /** Number of abandons during the second waiting voice guide. */
    nbAbandonsOn2WaitingVG = 'nbAbandonsOn2WaitingVG',

    /** Number of abandons during the third waiting voice guide. */
    nbAbandonsOn3WaitingVG = 'nbAbandonsOn3WaitingVG',

    /** Number of abandons during the fourth waiting voice guide. */
    nbAbandonsOn4WaitingVG = 'nbAbandonsOn4WaitingVG',

    /** Number of abandons during the fifth waiting voice guide. */
    nbAbandonsOn5WaitingVG = 'nbAbandonsOn5WaitingVG',

    /** Number of abandons during the sixth waiting voice guide. */
    nbAbandonsOn6WaitingVG = 'nbAbandonsOn6WaitingVG',

    /** Number of abandons while the call was ringing. */
    nbAbandonsOnRinging = 'nbAbandonsOnRinging',

    /** Number of abandons on general forwarding voice guide. */
    nbAbandonsOnGenFwdVG = 'nbAbandonsOnGenFwdVG',

    /** Number of abandons on blocked voice guide. */
    nbAbandonsOnBlockedVG = 'nbAbandonsOnBlockedVG',

    /** Number of direct call abandons while the agent was busy. */
    nbAbandonsOnAgentBusy = 'nbAbandonsOnAgentBusy',

    /** Total number of abandons. */
    nbAbandons = 'nbAbandons',

    /** Number of abandons before threshold 1 (e.g., 5 seconds). */
    nbAbandonsBeforeTS1 = 'nbAbandonsBeforeTS1',

    /** Percentage of abandons before threshold 1 (e.g., 5 seconds). */
    percentAbandonsBeforeTS1 = 'percentAbandonsBeforeTS1',

    /** Number of abandons before threshold 2 (e.g., 15 seconds). */
    nbAbandonsBeforeTS2 = 'nbAbandonsBeforeTS2',

    /** Percentage of abandons before threshold 2 (e.g., 15 seconds). */
    percentAbandonsBeforeTS2 = 'percentAbandonsBeforeTS2',

    /** Number of abandons before threshold 3 (e.g., 30 seconds). */
    nbAbandonsBeforeTS3 = 'nbAbandonsBeforeTS3',

    /** Percentage of abandons before threshold 3 (e.g., 30 seconds). */
    percentAbandonsBeforeTS3 = 'percentAbandonsBeforeTS3',

    /** Number of abandons before threshold 4 (e.g., 60 seconds). */
    nbAbandonsBeforeTS4 = 'nbAbandonsBeforeTS4',

    /** Percentage of abandons before threshold 4 (e.g., 60 seconds). */
    percentAbandonsBeforeTS4 = 'percentAbandonsBeforeTS4',

    /** Number of abandons after threshold 4 (e.g., 60 seconds). */
    nbAbandonsAfterTS4 = 'nbAbandonsAfterTS4',

    /** Percentage of abandons after threshold 4 (e.g., 60 seconds). */
    percentAbandonsAfterTS4 = 'percentAbandonsAfterTS4',

    /** Total duration of call processing. */
    callProcTDur = 'callProcTDur',

    /** Average duration of call processing. */
    callProcADur = 'callProcADur',

    /** Total duration of greeting guide listening. */
    greetingListenTDur = 'greetingListenTDur',

    /** Average duration of greeting guide listening. */
    greetingListenADur = 'greetingListenADur',

    /** Total time before queuing. */
    beforeQueuingTDur = 'beforeQueuingTDur',

    /** Total waiting duration of served calls. */
    waitServedCallsTDur = 'waitServedCallsTDur',

    /** Average waiting duration of served calls. */
    waitServedCallsADur = 'waitServedCallsADur',

    /** Total waiting duration of abandoned calls. */
    waitAbandonnedCallsTDur = 'waitAbandonnedCallsTDur',

    /** Average waiting duration of abandoned calls. */
    waitAbandonnedCallsADur = 'waitAbandonnedCallsADur',

    /** Total duration of ringing. */
    ringingTDur = 'ringingTDur',

    /** Average duration of ringing. */
    ringingADur = 'ringingADur',

    /** Total conversation duration. */
    convTDur = 'convTDur',

    /** Average conversation duration. */
    convADur = 'convADur',

    /** Total duration of hold calls. */
    holdCallsTDur = 'holdCallsTDur',

    /** Average duration of hold calls. */
    holdCallsADur = 'holdCallsADur',

    /** Total duration of wrap-up. */
    wrapupTDur = 'wrapupTDur',

    /** Average duration of wrap-up. */
    wrapupADur = 'wrapupADur',

    /** Longest waiting time observed. */
    longestWaitingDur = 'longestWaitingDur',

    /** Service level achieved. */
    serviceLevel = 'serviceLevel',

    /** Efficiency metric. */
    efficiency = 'efficiency',

    /** Percent time in in-service state. */
    inServiceState = 'inServiceState',

    /** Percent time in general forwarding state. */
    genFwdState = 'genFwdState',

    /** Percent time in blocked state. */
    blockedState = 'blockedState',

    /** Total number of received calls. */
    dnbTotReceivedCalls = 'dnbTotReceivedCalls',

    /** All attributes included (for testing purposes). */
    ALL = 'ALL',
}
