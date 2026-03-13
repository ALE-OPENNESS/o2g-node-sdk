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

import { StatsAgentByPilotAttributes } from '../../../types/cc-stats/agbypilot-attributes';
import { StatsAgentAttributes } from '../../../types/cc-stats/agent-attributes';
import { DataObservationPeriod } from '../../../types/cc-stats/data/data-obs-period';
import { Language } from '../../../types/cc-stats/language';
import { StatsPilotAttributes } from '../../../types/cc-stats/pilot-attributes';
import { ReportObservationPeriod } from '../../../types/cc-stats/scheduled/report-obs-period';
import { ScheduledReport } from '../../../types/cc-stats/scheduled/scheduled-report';
import { StatsFormat } from '../../../types/cc-stats/stats-format';
import { TimeInterval } from '../../../types/cc-stats/time-interval';
import { DayOfWeekJson } from '../common/common-types';

/** @internal */
export type SupervisedJson = {
    number: string;
};

/** @internal */
export type SupervisorJson = {
    identifier: string;
    language: Language;
    timezone: string;
};

/** @internal */
export type StatsAgentFilterJson = {
    numbers?: string[];
    agentAttributes?: StatsAgentAttributes[];
    pilotAttributes?: StatsAgentByPilotAttributes[];
};

/** @internal */
export type StatsPilotFilterJson = {
    numbers?: string[];
    attributes?: StatsPilotAttributes[];
};

/** @internal */
export type StatsFilterJson = {
    agentFilter?: StatsAgentFilterJson;
    pilotFilter?: StatsPilotFilterJson;
};

/** @internal */
export type StatsContextJson = {
    ctxId: string;
    supervisorId: string;
    label?: string;
    description?: string;
    isScheduled: boolean;
    filter: StatsFilterJson;
};

/** @internal */
export type StatsJson = {
    supervisor: string;
    agentsStats?: AgentStatsJson[];
    pilotsStats?: PilotStatsJson[];
};

/** @internal */
export type AgentStatsJson = {
    timeSlot: string;
    selectedPeriod: SelectedPeriodJson;
    rows?: AgentStatisticsRowJson[];
};

/** @internal */
export type PilotStatsJson = {
    timeSlot: string;
    selectedPeriod: SelectedPeriodJson;
    rows?: PilotStatisticsRowJson[];
};

/** @internal */
export type SelectedPeriodJson = {
    periodType: DataObservationPeriod;
    slotType: TimeInterval;
    beginDate: string;
    endDate: string;
};

/** @internal */
export type PilotStatisticsRowJson = {
    date?: string;
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minute?: string;
    queueName?: string;
    pilotName?: string;
    pilotNumber?: string;

    nbCallsOpen?: number;
    nbCallsBlocked?: number;
    nbCallsForward?: number;
    nbCallsByTransfer?: number;
    nbCallsByMutualAid?: number;
    maxNbSimultCalls?: number;
    nbOverflowInQueue?: number;
    NbOverflowInRinging?: number;
    nbCallsWOQueuing?: number;
    nbCallsAfterQueuing?: number;
    nbCallsSentInMutualAidQueue?: number;
    nbCallsRedirectedOutACDArea?: number;
    nbCallsDissuaded?: number;
    nbCallsDissuadedAfterTryingMutualAid?: number;
    nbCallsVGTypePG?: number;
    nbCallsSentToPG?: number;
    nbCallsRejectedLackOfRes?: number;
    nbCallsServedByAgent?: number;
    nbCallsServedInTime?: number;
    nbCallsServedTooQuick?: number;
    nbCallsWithoutTransCode?: number;
    nbCallsWithTransCode?: number;
    nbCallsRedistrib?: number;
    nbCallsBeforeTS1?: number;
    percentCallsBeforeTS1?: string;
    nbCallsBeforeTS2?: number;
    percentCallsBeforeTS2?: string;
    nbCallsBeforeTS3?: number;
    percentCallsBeforeTS3?: string;
    nbCallsBeforeTS4?: number;
    percentCallsBeforeTS4?: string;
    nbCallsAfterTS4?: number;
    percentCallsAfterTS4?: string;

    nbAbandonsOnGreetingsVG?: number;
    nbAbandonsOn1WaitingVG?: number;
    nbAbandonsOn2WaitingVG?: number;
    nbAbandonsOn3WaitingVG?: number;
    nbAbandonsOn4WaitingVG?: number;
    nbAbandonsOn5WaitingVG?: number;
    nbAbandonsOn6WaitingVG?: number;
    nbAbandonsOnRinging?: number;
    nbAbandonsOnGenFwdVG?: number;
    nbAbandonsOnBlockedVG?: number;
    nbAbandonsOnAgentBusy?: number;
    nbAbandons?: number;
    nbAbandonsBeforeTS1?: number;
    percentAbandonsBeforeTS1?: string;
    nbAbandonsBeforeTS2?: number;
    percentAbandonsBeforeTS2?: string;
    nbAbandonsBeforeTS3?: number;
    percentAbandonsBeforeTS3?: string;
    nbAbandonsBeforeTS4?: number;
    percentAbandonsBeforeTS4?: string;
    nbAbandonsAfterTS4?: number;
    percentAbandonsAfterTS4?: string;

    callProcTDur?: string;
    callProcADur?: string;
    greetingListenTDur?: string;
    greetingListenADur?: string;
    beforeQueuingTDur?: string;
    waitServedCallsTDur?: string;
    waitServedCallsADur?: string;
    waitAbandonnedCallsTDur?: string;
    waitAbandonnedCallsADur?: string;
    ringingTDur?: string;
    ringingADur?: string;
    convTDur?: string;
    convADur?: string;
    holdCallsTDur?: string;
    holdCallsADur?: string;
    wrapupTDur?: string;
    wrapupADur?: string;
    longestWaitingDur?: string;
    serviceLevel?: string;
    efficiency?: string;
    inServiceState?: string;
    genFwdState?: string;
    blockedState?: string;

    dnbTotReceivedCalls?: number;
    dnbCallsOpen?: number;
    dnbCallsBlocked?: number;
    dnbCallsForward?: number;
    dnbDirectRoute?: number;
    dnbIndirectRoute?: number;
    dnbTotServedCalls?: number;
    defficiency?: string;
    dnbCallsWOQueuing?: number;
    dnbCallsAfterQueuing?: number;
    dnbCallsBeforeTS1?: number;
    dnbCallsBeforeTS2?: number;
    dnbCallsBeforeTS3?: number;
    dnbCallsBeforeTS4?: number;
    dnbCallsAfterTS4?: number;
    dwaitServedCallsADur?: string;
    dnbAbandons?: number;
    dnbAbandonsOnGreetingsVG?: number;
    dnbAbandonsOnWaitingVG?: number;
    dnbAbandonsBeforeTS1?: number;
    dnbAbandonsBeforeTS2?: number;
    dnbAbandonsBeforeTS3?: number;
    dnbAbandonsBeforeTS4?: number;
    dnbAbandonsAfterTS4?: number;
    dnbCallsRejectedLackOfRes?: number;
    dnbCallsDissuaded?: number;
    dnbTotCallsRedirected?: number;
    dnbCallsRedirectedOutACDArea?: number;
    dnbCallsSentInMutualAidQueue?: number;
    dnbCallsSentToPG?: number;
    dserviceLevel?: string;
    defficiency2?: string;
    dcallProcADur?: string;
    dconvADur?: string;
    dwrapupADur?: string;
    dholdCallsADur?: string;
    dringingADur?: string;
    dwaitingADur?: string;
    dlongestWaitingDur?: string;
};

/** @internal */
export type AgentStatisticsRowJson = {
    date?: string;
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minute?: string;
    login?: string;
    operator?: string;
    firstName?: string;
    lastName?: string;
    number?: string;
    group?: string;

    nbRotating?: number;
    nbPickedUp?: number;
    nbPickup?: number;
    nbLocalOutNonAcd?: number;
    nbExtOutNonAcd?: number;
    nbRingAcd?: number;
    nbHelp?: number;
    nbLocInNonAcd?: number;
    nbExtInNonAcdDirect?: number;
    nbExtInNonAcdTransferred?: number;
    nbServedWOCode?: number;
    nbServedWCode?: number;
    nbAcdQuickServed?: number;
    nbExtInNonAcdServed?: number;
    nbExtInNonAcdQuickServed?: number;
    nbOutAcd?: number;
    nbOutAcdAnswered?: number;
    nbOnWrapup?: number;

    ringAcdServedTDur?: string;
    ringAcdServedADur?: string;
    ringInNonAcdExtServedTDur?: string;
    ringInNonAcdExtServedADur?: string;
    ringAcdTDur?: string;
    ringAcdADur?: string;
    ringInNonAcdExtTDur?: string;
    ringInNonAcdExtADur?: string;
    ringTDur?: string;
    ringADur?: string;
    convAcdTDur?: string;
    convAcdADur?: string;
    wrapupAcdTDur?: string;
    convLocOutNonAcdTDur?: string;
    convLocOutNonAcdADur?: string;
    convExtOutTDur?: string;
    convExtOutADur?: string;
    convLocInNonAcdTDur?: string;
    convLocInNonAcdADur?: string;
    convExtInNonAcdTDur?: string;
    convExtInNonAcdADur?: string;
    outAcdCommTDur?: string;
    outAcdCommADur?: string;
    outAcdConvTDur?: string;
    outAcdConvADur?: string;
    outAcdTransactTDur?: string;
    outAcdTransactADur?: string;
    outAcdWrapupTDur?: string;
    outAcdWrapupADur?: string;
    outAcdPauseTDur?: string;
    outAcdPauseADur?: string;
    wrapUpIdleTDur?: string;
    callOnWrapupTDur?: string;
    busyOnWrapupTDur?: string;
    busyTDur?: string;
    loggedOutPerTime?: string;
    notAssignedPerTime?: string;
    assignedPerTime?: string;
    withdrawPerTime?: string;
    withdrawPerTimeCause1?: string;
    withdrawPerTimeCause2?: string;
    withdrawPerTimeCause3?: string;
    withdrawPerTimeCause4?: string;
    withdrawPerTimeCause5?: string;
    withdrawPerTimeCause6?: string;
    withdrawPerTimeCause7?: string;
    withdrawPerTimeCause8?: string;
    withdrawPerTimeCause9?: string;

    nbPilots?: number;
    nbAcdServedCalls?: number;
    nbAcdInServedCalls?: number;
    nbInCallsReceivedByPilot?: number;
    nbAcdOutServedCalls?: number;
    nbTotNonServedCalls?: number;
    nbInNonServedCalls?: number;
    nbPickedupCalls?: number;
    nbRefusedCalls?: number;
    nbAcdOutNonServedCalls?: number;
    nbTotNonAcdReceivedCalls?: number;
    nbInNonAcdCalls?: number;
    nbOutNonAcdCalls?: number;

    assignedNotWithdrawDur?: string;
    withdrawDur?: string;
    manuWrapupDur?: string;
    unreachableDur?: string;
    nonAcdWorkTDur?: string;
    nonAcdWorkADur?: string;
    acdWorkTDur?: string;
    acdWorkADur?: string;
    acdWorkInTDur?: string;
    acdWorkInADur?: string;
    acdWorkInConvTDur?: string;
    acdWorkInConvADur?: string;
    acdWorkInRingTDur?: string;
    acdWorkInRingADur?: string;
    acdWorkInWrapupTDur?: string;
    acdWorkInWrapupADur?: string;
    acdWorkOutTDur?: string;
    acdWorkOutADur?: string;
    acdWorkOutConvTDur?: string;
    acdWorkOutConvADur?: string;
    acdWorkOutWrapupTDur?: string;
    acdWorkOutWrapupADur?: string;
    acdInConvTDur?: string;
    acdInConvADur?: string;
    acdOutConvTDur?: string;
    acdOutConvADur?: string;

    pilotAgentStatsRows?: AgentByPilotStatisticsRowJson[];
};

/** @internal */
export type AgentByPilotStatisticsRowJson = {
    pilotNumber?: string;
    pilotName?: string;
    nbCallsReceived?: number;
    nbCallsTransfIn?: number;
    nbCallsServed?: number;
    nbCallsServedTooQuickly?: number;
    nbCallsWithEnquiry?: number;
    nbCallsWithHelp?: number;
    nbCallsTransf?: number;
    nbCallsTransfToAgent?: number;
    nbCallsInWrapup?: number;
    maxCallProcDur?: string;
    maxConvDur?: string;
    maxWrapupDur?: string;
    callProcTDur?: string;
    callProcADur?: string;
    convTDur?: string;
    convADur?: string;
    wrapupTDur?: string;
    wrapupADur?: string;
    convInWrapupTDur?: string;
    busyTimeInWrapupTDur?: string;
    onHoldTDur?: string;
    onHoldADur?: string;
    transTDur?: string;
    transADur?: string;
    pauseTDur?: string;
    pauseADur?: string;
};

export enum AcdStatsProgressStep {
    COLLECT = 'COLLECT',
    PROCESSED = 'PROCESSED',
    FORMATED = 'FORMATED',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED',
}

export type OnAcdStatsProgressJson = {
    /** Supervisor name */
    supervisor: string;

    /** Step of the progression */
    step: AcdStatsProgressStep;

    /** Total number of objects (agents or pilots) asked */
    nbTotObjects?: number;

    /** Number of processed objects (agents or pilots) */
    nbProcessedObjects?: number;

    /** File path of the result (partial if res > Max rows) */
    resPath?: string;

    /** File path of the full result (if res > Max rows) */
    fullResPath?: string;

    /** File path of the full result in XLS format */
    xlsfullResPath?: string;
};

export type ScheduledSelPeriodJson = {
    periodType: ReportObservationPeriod.PeriodType;
    lastNb?: number;
    beginDate?: string;
    endDate?: string;
};

export enum PeriodicityJson {
    once = 'once',
    daily = 'daily',
    weekly = 'weekly',
    montly = 'monthly',
}

export type ReportFrequencyJson = {
    periodicity: PeriodicityJson;
    daysInWeek?: DayOfWeekJson[];
    dayInMonth?: number;
};

export type StatsScheduleJson = {
    name: string;
    description?: string;
    obsPeriod: ScheduledSelPeriodJson;
    frequency: ReportFrequencyJson;
    recipients: string[];
    state: ScheduledReport.State;
    enable: boolean;
    lastExecDate: string;
    fileType: StatsFormat;
};
