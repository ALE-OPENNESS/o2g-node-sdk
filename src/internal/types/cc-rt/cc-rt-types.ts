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

import { RtiAgentAttributes } from '../../../types/cc-rt/agent-attributes';
import { RtiAgentProcessingGroupAttributes } from '../../../types/cc-rt/agent-pg-attributes';
import { AgentProcessingGroupType } from '../../../types/cc-rt/agent-pg-type';
import { AgentPhoneState } from '../../../types/cc-rt/agent-phone-state';
import { AgentServiceState } from '../../../types/cc-rt/agent-service-type';
import { AgentType } from '../../../types/cc-rt/agent-type';
import { RtiOtherProcessingGroupAttributes } from '../../../types/cc-rt/other-pg-attributes';
import { OtherProcessingGroupType } from '../../../types/cc-rt/other-pg-type';
import { RtiPilotAttributes } from '../../../types/cc-rt/pilot-attributes';
import { RtiQueueAttributes } from '../../../types/cc-rt/queue-attributes';
import { QueueType } from '../../../types/cc-rt/queue-type';
import { ServiceState } from '../../../types/common/service-state';

/** @internal */
export type RtiObjectIdentifierJson = {
    number: string;
    name: string;
    firstName?: string;
};

/** @internal */
export type RtiObjectsJson = {
    agents?: RtiObjectIdentifierJson[];
    pilots?: RtiObjectIdentifierJson[];
    queues?: RtiObjectIdentifierJson[];
    pgAgents?: RtiObjectIdentifierJson[];
    pgOthers?: RtiObjectIdentifierJson[];
};

/** @internal */
export type RtiAgentFilterJson = {
    numbers?: string[];
    attributes?: RtiAgentAttributes[];
};

/** @internal */
export type RtiPilotFilterJson = {
    numbers?: string[];
    attributes?: RtiPilotAttributes[];
};

/** @internal */
export type RtiQueueFilterJson = {
    numbers?: string[];
    attributes?: RtiQueueAttributes[];
};

/** @internal */
export type RtiAgentProcessingGroupFilterJson = {
    numbers?: string[];
    attributes?: RtiAgentProcessingGroupAttributes[];
};

/** @internal */
export type RtiOtherProcessingGroupFilterJson = {
    numbers?: string[];
    attributes?: RtiOtherProcessingGroupAttributes[];
};

/** @internal */
export type RtiFilterJson = {
    agentFilter?: RtiAgentFilterJson;
    pilotFilter?: RtiPilotFilterJson;
    queueFilter?: RtiQueueFilterJson;
    pgAgentFilter?: RtiAgentProcessingGroupFilterJson;
    pgOtherFilter?: RtiOtherProcessingGroupFilterJson;
};

/** @internal */
export type RtiContextJson = {
    active?: boolean;
    obsPeriod?: number;
    notifFrequency?: number;
    filter?: RtiFilterJson;
};

/** @internal */
export type OnAgentRtiChangedJson = {
    name: string;
    firstName?: string;
    number: string;
    type: AgentType;
    logonDate?: string;
    serviceState?: AgentServiceState;
    serviceStateDate?: string;
    phoneState?: AgentPhoneState;
    phoneStateDate?: string;
    pilotName?: string;
    queueName?: string;
    nbOfWithdrawals?: number;
    withdrawalsTotalDuration?: number;
    nbOfPrivateCalls?: number;
    privateCallsTotalDuration?: number;
    nbOfServedACDCalls?: number;
    nbOfOutgoingACDCalls?: number;
    nbOfRefusedACDCalls?: number;
    nbOfInterceptedACDCalls?: number;
    nbOfTransferedACDCalls?: number;
    currentPG?: string;
    associatedSet?: string;
    withdrawReason?: number;
    afeKey?: number;
};

/** @internal */
export type OnPilotRtiChangedJson = {
    name: string;
    number: string;
    state?: ServiceState;
    nbOfRunningCalls?: number;
    serviceLevel?: number;
    efficiency?: number;
    nbOfWaitingCalls?: number;
    nbOfRingingACDCalls?: number;
    nbOfMutualAidCalls?: number;
    nbOfDissuadedCalls?: number;
    nbOfCallsInConversation?: number;
    nbOfCallsInGeneralForwarding?: number;
    nbOfCallsInRemotePG?: number;
    incomingTraffic?: number;
    averageWaitingTime?: number;
    worstServiceLevelInList?: number;
    worstEfficiencyInList?: number;
    bestServiceLevelInList?: number;
    bestEfficiencyInList?: number;
    afeKey?: number;
};

/** @internal */
export type OnQueueRtiChangedJson = {
    name: string;
    number: string;
    type: QueueType;
    state: ServiceState;
    nbOfAgentsInDistribution?: number;
    incomingTraffic?: number;
    outgoingTraffic?: number;
    nbOfWaitingCalls?: number;
    currentWaitingTime?: number;
    fillingRate?: number;
    expectedWaitingTime?: number;
    longestWaitingTimeInList?: number;
    afeKey?: number;
};

/** @internal */
export type OnAgentProcessingGroupRtiChangedJson = {
    name: string;
    number: string;
    type: AgentProcessingGroupType;
    state: ServiceState;
    nbOfWithdrawnAgents?: number;
    nbOfAgentsInPrivateCall?: number;
    nbOfAgentsInACDCall?: number;
    nbOfAgentsInACDRinging?: number;
    nbOfAgentsInACDConv?: number;
    nbOfAgentsInWrapupAndTransaction?: number;
    nbOfAgentsInPause?: number;
    nbOfBusyAgents?: number;
    nbOfLoggedOnAgents?: number;
    nbOfFreeAgents?: number;
    nbOfIdleAgents?: number;
    nbOfLoggedOnAndNotWithdrawnAgents?: number;
    incomingTraffic?: number;
    consolidatedPilotsServiceLevel?: number;
    consolidatedPilotsEfficiency?: number;
    consolidatedQueuesWaitingTime?: number;
    consolidatedQueuesNbOfWaitingCalls?: number;
    consolidatedQueuesEWT?: number;
    pilotsWorstServiceLevel?: number;
    pilotsWorstEfficiency?: number;
    pilotsBestServiceLevel?: number;
    pilotsBestEfficiency?: number;
    queuesLongestWaitingTime?: number;
    afeKey?: number;
};

/** @internal */
export type OnOtherProcessingGroupRtiChangedJson = {
    /** Name of the other processing group */
    name: string;

    /** Number identifying the other processing group */
    number: string;

    /** Type of the other processing group */
    type: OtherProcessingGroupType;

    /** Current service state of the other processing group */
    state: ServiceState;

    /** Number of ACD calls currently handled by the group */
    nbOfACDCalls?: number;

    /** Number of incoming calls during the last minute */
    incomingTraffic?: number;

    /** CCD key of the object */
    afeKey?: number;
};
