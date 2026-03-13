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

import {
    OnAgentProcessingGroupRtiChangedJson,
    OnAgentRtiChangedJson,
    OnOtherProcessingGroupRtiChangedJson,
    OnPilotRtiChangedJson,
    OnQueueRtiChangedJson,
} from '../../internal/types/cc-rt/cc-rt-types';
import { ServiceState } from '../common/service-state';
import { AgentProcessingGroupType } from './agent-pg-type';
import { AgentPhoneState } from './agent-phone-state';
import { AgentServiceState } from './agent-service-type';
import { AgentType } from './agent-type';
import { OtherProcessingGroupType } from './other-pg-type';
import { QueueType } from './queue-type';

/**
 * Event representing changes in the attributes of a CCD agent.
 *
 * This class is delivered whenever one or more agent attributes change.
 * Only the attributes that have changed since the previous notification are included.
 *
 * Typical usage:
 * ```ts
 * override onAgentRtiChanged(e: OnAgentRtiChanged): void {
 *   const nbServedACDCalls = e.nbOfServedACDCalls;
 *   // ...
 * }
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export class OnAgentRtiChanged {
    #name: string;
    #firstName?: string;
    #number: string;
    #type: AgentType;
    #logonDate?: Date;
    #serviceState?: AgentServiceState;
    #serviceStateDate?: Date;
    #phoneState?: AgentPhoneState;
    #phoneStateDate?: Date;
    #pilotName?: string;
    #queueName?: string;
    #nbOfWithdrawals?: number;
    #withdrawalsTotalDuration?: number;
    #nbOfPrivateCalls?: number;
    #privateCallsTotalDuration?: number;
    #nbOfServedACDCalls?: number;
    #nbOfOutgoingACDCalls?: number;
    #nbOfRefusedACDCalls?: number;
    #nbOfInterceptedACDCalls?: number;
    #nbOfTransferedACDCalls?: number;
    #currentPG?: string;
    #associatedSet?: string;
    #withdrawReason?: number;
    #afeKey?: number;

    /**
     * @internal
     */
    private constructor(json: OnAgentRtiChangedJson) {
        this.#name = json.name;
        this.#firstName = json.firstName;
        this.#number = json.number;
        this.#type = json.type;
        this.#logonDate = json.logonDate ? new Date(json.logonDate) : undefined;
        this.#serviceState = json.serviceState;
        this.#serviceStateDate = json.serviceStateDate ? new Date(json.serviceStateDate) : undefined;
        this.#phoneState = json.phoneState;
        this.#phoneStateDate = json.phoneStateDate ? new Date(json.phoneStateDate) : undefined;
        this.#pilotName = json.pilotName;
        this.#queueName = json.queueName;
        this.#nbOfWithdrawals = json.nbOfWithdrawals;
        this.#withdrawalsTotalDuration = json.withdrawalsTotalDuration;
        this.#nbOfPrivateCalls = json.nbOfPrivateCalls;
        this.#privateCallsTotalDuration = json.privateCallsTotalDuration;
        this.#nbOfServedACDCalls = json.nbOfServedACDCalls;
        this.#nbOfOutgoingACDCalls = json.nbOfOutgoingACDCalls;
        this.#nbOfRefusedACDCalls = json.nbOfRefusedACDCalls;
        this.#nbOfInterceptedACDCalls = json.nbOfInterceptedACDCalls;
        this.#nbOfTransferedACDCalls = json.nbOfTransferedACDCalls;
        this.#currentPG = json.currentPG;
        this.#associatedSet = json.associatedSet;
        this.#withdrawReason = json.withdrawReason;
        this.#afeKey = json.afeKey;
    }

    /**
     * @internal
     */
    static fromJson(json: OnAgentRtiChangedJson): OnAgentRtiChanged {
        return new OnAgentRtiChanged(json);
    }

    // --- Getters with TSDoc ---

    /** Returns the agent's last name. */
    get name(): string {
        return this.#name;
    }

    /** Returns the agent's first name. */
    get firstName(): string | undefined {
        return this.#firstName;
    }

    /** Returns the agent's directory number. */
    get number(): string {
        return this.#number;
    }

    /** Returns the agent type (normal or IVR). */
    get type(): AgentType {
        return this.#type;
    }

    /** Returns the logon date of the agent. */
    get logonDate(): Date | undefined {
        return this.#logonDate;
    }

    /** Returns the current service state of the agent. */
    get serviceState(): AgentServiceState | undefined {
        return this.#serviceState;
    }

    /** Returns the date when the service state was last updated. */
    get serviceStateDate(): Date | undefined {
        return this.#serviceStateDate;
    }

    /** Returns the current phone state of the agent. */
    get phoneState(): AgentPhoneState | undefined {
        return this.#phoneState;
    }

    /** Returns the date when the phone state was last updated. */
    get phoneStateDate(): Date | undefined {
        return this.#phoneStateDate;
    }

    /** Returns the name of the associated pilot, if any. */
    get pilotName(): string | undefined {
        return this.#pilotName;
    }

    /** Returns the name of the associated queue, if any. */
    get queueName(): string | undefined {
        return this.#queueName;
    }

    /** Returns the number of withdrawals performed by the agent. */
    get nbOfWithdrawals(): number | undefined {
        return this.#nbOfWithdrawals;
    }

    /** Returns the total duration of withdrawals in seconds. */
    get withdrawalsTotalDuration(): number | undefined {
        return this.#withdrawalsTotalDuration;
    }

    /** Returns the number of private calls handled by the agent. */
    get nbOfPrivateCalls(): number | undefined {
        return this.#nbOfPrivateCalls;
    }

    /** Returns the total duration of private calls in seconds. */
    get privateCallsTotalDuration(): number | undefined {
        return this.#privateCallsTotalDuration;
    }

    /** Returns the number of ACD calls served by the agent. */
    get nbOfServedACDCalls(): number | undefined {
        return this.#nbOfServedACDCalls;
    }

    /** Returns the number of outgoing ACD calls by the agent. */
    get nbOfOutgoingACDCalls(): number | undefined {
        return this.#nbOfOutgoingACDCalls;
    }

    /** Returns the number of refused ACD calls. */
    get nbOfRefusedACDCalls(): number | undefined {
        return this.#nbOfRefusedACDCalls;
    }

    /** Returns the number of intercepted ACD calls. */
    get nbOfInterceptedACDCalls(): number | undefined {
        return this.#nbOfInterceptedACDCalls;
    }

    /** Returns the number of transferred ACD calls. */
    get nbOfTransferedACDCalls(): number | undefined {
        return this.#nbOfTransferedACDCalls;
    }

    /** Returns the current processing group the agent belongs to. */
    get currentPG(): string | undefined {
        return this.#currentPG;
    }

    /** Returns the associated set of the agent. */
    get associatedSet(): string | undefined {
        return this.#associatedSet;
    }

    /** Returns the reason code for withdrawals, if any. */
    get withdrawReason(): number | undefined {
        return this.#withdrawReason;
    }

    /** Returns the AFE key associated with the agent. */
    get afeKey(): number | undefined {
        return this.#afeKey;
    }
}

/**
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export class OnPilotRtiChanged {
    #name: string;
    #number: string;
    #state?: ServiceState;
    #nbOfRunningCalls?: number;
    #serviceLevel?: number;
    #efficiency?: number;
    #nbOfWaitingCalls?: number;
    #nbOfRingingACDCalls?: number;
    #nbOfMutualAidCalls?: number;
    #nbOfDissuadedCalls?: number;
    #nbOfCallsInConversation?: number;
    #nbOfCallsInGeneralForwarding?: number;
    #nbOfCallsInRemotePG?: number;
    #incomingTraffic?: number;
    #averageWaitingTime?: number;
    #worstServiceLevelInList?: number;
    #worstEfficiencyInList?: number;
    #bestServiceLevelInList?: number;
    #bestEfficiencyInList?: number;
    #afeKey?: number;

    /**
     * @internal
     */
    private constructor(json: OnPilotRtiChangedJson) {
        this.#name = json.name;
        this.#number = json.number;
        this.#state = json.state;
        this.#nbOfRunningCalls = json.nbOfRunningCalls;
        this.#serviceLevel = json.serviceLevel;
        this.#efficiency = json.efficiency;
        this.#nbOfWaitingCalls = json.nbOfWaitingCalls;
        this.#nbOfRingingACDCalls = json.nbOfRingingACDCalls;
        this.#nbOfMutualAidCalls = json.nbOfMutualAidCalls;
        this.#nbOfDissuadedCalls = json.nbOfDissuadedCalls;
        this.#nbOfCallsInConversation = json.nbOfCallsInConversation;
        this.#nbOfCallsInGeneralForwarding = json.nbOfCallsInGeneralForwarding;
        this.#nbOfCallsInRemotePG = json.nbOfCallsInRemotePG;
        this.#incomingTraffic = json.incomingTraffic;
        this.#averageWaitingTime = json.averageWaitingTime;
        this.#worstServiceLevelInList = json.worstServiceLevelInList;
        this.#worstEfficiencyInList = json.worstEfficiencyInList;
        this.#bestServiceLevelInList = json.bestServiceLevelInList;
        this.#bestEfficiencyInList = json.bestEfficiencyInList;
        this.#afeKey = json.afeKey;
    }

    /**
     * @internal
     */
    static fromJson(json: OnPilotRtiChangedJson): OnPilotRtiChanged {
        return new OnPilotRtiChanged(json);
    }

    // --- Getters with JSDoc ---

    /** Returns the name of the pilot. */
    get name(): string {
        return this.#name;
    }

    /** Returns the directory number of the pilot. */
    get number(): string {
        return this.#number;
    }

    /** Returns the current service state of the pilot. */
    get state(): ServiceState | undefined {
        return this.#state;
    }

    /** Returns the number of calls currently in progress for the pilot. */
    get nbOfRunningCalls(): number | undefined {
        return this.#nbOfRunningCalls;
    }

    /** Returns the service level of the pilot. */
    get serviceLevel(): number | undefined {
        return this.#serviceLevel;
    }

    /** Returns the efficiency indicator of the pilot. */
    get efficiency(): number | undefined {
        return this.#efficiency;
    }

    /** Returns the number of waiting calls for the pilot. */
    get nbOfWaitingCalls(): number | undefined {
        return this.#nbOfWaitingCalls;
    }

    /** Returns the number of ringing ACD calls for the pilot. */
    get nbOfRingingACDCalls(): number | undefined {
        return this.#nbOfRingingACDCalls;
    }

    /** Returns the number of calls rerouted for mutual aid. */
    get nbOfMutualAidCalls(): number | undefined {
        return this.#nbOfMutualAidCalls;
    }

    /** Returns the number of dissuaded calls for the pilot. */
    get nbOfDissuadedCalls(): number | undefined {
        return this.#nbOfDissuadedCalls;
    }

    /** Returns the number of calls currently in conversation. */
    get nbOfCallsInConversation(): number | undefined {
        return this.#nbOfCallsInConversation;
    }

    /** Returns the number of calls in general forwarding. */
    get nbOfCallsInGeneralForwarding(): number | undefined {
        return this.#nbOfCallsInGeneralForwarding;
    }

    /** Returns the number of calls in a remote processing group. */
    get nbOfCallsInRemotePG(): number | undefined {
        return this.#nbOfCallsInRemotePG;
    }

    /** Returns the number of incoming calls within the last minute. */
    get incomingTraffic(): number | undefined {
        return this.#incomingTraffic;
    }

    /** Returns the average waiting time before answering. */
    get averageWaitingTime(): number | undefined {
        return this.#averageWaitingTime;
    }

    /** Returns the worst service level among the pilots in a super pilot group. */
    get worstServiceLevelInList(): number | undefined {
        return this.#worstServiceLevelInList;
    }

    /** Returns the worst efficiency among the pilots in a super pilot group. */
    get worstEfficiencyInList(): number | undefined {
        return this.#worstEfficiencyInList;
    }

    /** Returns the best service level among the pilots in a super pilot group. */
    get bestServiceLevelInList(): number | undefined {
        return this.#bestServiceLevelInList;
    }

    /** Returns the best efficiency among the pilots in a super pilot group. */
    get bestEfficiencyInList(): number | undefined {
        return this.#bestEfficiencyInList;
    }

    /** Returns the CCD key of this pilot object. */
    get afeKey(): number | undefined {
        return this.#afeKey;
    }
}

/**
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export class OnQueueRtiChanged {
    #name: string;
    #number: string;
    #type: QueueType;
    #state: ServiceState;
    #nbOfAgentsInDistribution?: number;
    #incomingTraffic?: number;
    #outgoingTraffic?: number;
    #nbOfWaitingCalls?: number;
    #currentWaitingTime?: number;
    #fillingRate?: number;
    #expectedWaitingTime?: number;
    #longestWaitingTimeInList?: number;
    #afeKey?: number;

    /**
     * @internal
     */
    private constructor(json: OnQueueRtiChangedJson) {
        this.#name = json.name;
        this.#number = json.number;
        this.#type = json.type;
        this.#state = json.state;
        this.#nbOfAgentsInDistribution = json.nbOfAgentsInDistribution;
        this.#incomingTraffic = json.incomingTraffic;
        this.#outgoingTraffic = json.outgoingTraffic;
        this.#nbOfWaitingCalls = json.nbOfWaitingCalls;
        this.#currentWaitingTime = json.currentWaitingTime;
        this.#fillingRate = json.fillingRate;
        this.#expectedWaitingTime = json.expectedWaitingTime;
        this.#longestWaitingTimeInList = json.longestWaitingTimeInList;
        this.#afeKey = json.afeKey;
    }

    /**
     * @internal
     */
    static fromJson(json: OnQueueRtiChangedJson): OnQueueRtiChanged {
        return new OnQueueRtiChanged(json);
    }

    // --- Getters with JSDoc ---

    /** Returns the name of the queue. */
    get name(): string {
        return this.#name;
    }

    /** Returns the directory number of the queue. */
    get number(): string {
        return this.#number;
    }

    /** Returns the type of the queue. */
    get type(): QueueType {
        return this.#type;
    }

    /** Returns the current service state of the queue. */
    get state(): ServiceState {
        return this.#state;
    }

    /** Returns the number of agents in the distribution of the waiting queue. */
    get nbOfAgentsInDistribution(): number | undefined {
        return this.#nbOfAgentsInDistribution;
    }

    /** Returns the number of incoming calls within the last minute. */
    get incomingTraffic(): number | undefined {
        return this.#incomingTraffic;
    }

    /** Returns the number of outgoing calls within the last minute. */
    get outgoingTraffic(): number | undefined {
        return this.#outgoingTraffic;
    }

    /** Returns the number of waiting calls in the queue. */
    get nbOfWaitingCalls(): number | undefined {
        return this.#nbOfWaitingCalls;
    }

    /** Returns the current waiting time in the queue (seconds). */
    get currentWaitingTime(): number | undefined {
        return this.#currentWaitingTime;
    }

    /** Returns the filling rate of the queue (percentage). */
    get fillingRate(): number | undefined {
        return this.#fillingRate;
    }

    /** Returns the expected waiting time in the queue (seconds). */
    get expectedWaitingTime(): number | undefined {
        return this.#expectedWaitingTime;
    }

    /** Returns the longest waiting time among queues in a super waiting queue (seconds). */
    get longestWaitingTimeInList(): number | undefined {
        return this.#longestWaitingTimeInList;
    }

    /** Returns the CCD key of this queue object. */
    get afeKey(): number | undefined {
        return this.#afeKey;
    }
}

/**
 * Event delivered by `CallCenterRealtimeEventListener.onPGAgentRtiChanged`
 * whenever the attributes of one or more CCD agent processing groups change.
 *
 * This event contains only the attributes that have changed since the previous notification.
 * It is sent periodically according to the `Context` configuration in
 * `CallCenterRealtimeService`.
 *
 * Typical usage:
 * ```ts
 * override onPGAgentRtiChanged(e: OnAgentProcessingGroupRtiChanged): void {
 *   const nbWithdrawnAgents = e.nbOfWithdrawnAgents;
 *   // ...
 * }
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @see CallCenterRealtimeEventListener.onPGAgentRtiChanged
 * @since 2.7.4
 */
export class OnAgentProcessingGroupRtiChanged {
    #name: string;
    #number: string;
    #type: AgentProcessingGroupType;
    #state: ServiceState;
    #nbOfWithdrawnAgents?: number;
    #nbOfAgentsInPrivateCall?: number;
    #nbOfAgentsInACDCall?: number;
    #nbOfAgentsInACDRinging?: number;
    #nbOfAgentsInACDConv?: number;
    #nbOfAgentsInWrapupAndTransaction?: number;
    #nbOfAgentsInPause?: number;
    #nbOfBusyAgents?: number;
    #nbOfLoggedOnAgents?: number;
    #nbOfFreeAgents?: number;
    #nbOfIdleAgents?: number;
    #nbOfLoggedOnAndNotWithdrawnAgents?: number;
    #incomingTraffic?: number;
    #consolidatedPilotsServiceLevel?: number;
    #consolidatedPilotsEfficiency?: number;
    #consolidatedQueuesWaitingTime?: number;
    #consolidatedQueuesNbOfWaitingCalls?: number;
    #consolidatedQueuesEWT?: number;
    #pilotsWorstServiceLevel?: number;
    #pilotsWorstEfficiency?: number;
    #pilotsBestServiceLevel?: number;
    #pilotsBestEfficiency?: number;
    #queuesLongestWaitingTime?: number;
    #afeKey?: number;

    /**
     * @internal
     */
    private constructor(json: OnAgentProcessingGroupRtiChangedJson) {
        this.#name = json.name;
        this.#number = json.number;
        this.#type = json.type;
        this.#state = json.state;
        this.#nbOfWithdrawnAgents = json.nbOfWithdrawnAgents;
        this.#nbOfAgentsInPrivateCall = json.nbOfAgentsInPrivateCall;
        this.#nbOfAgentsInACDCall = json.nbOfAgentsInACDCall;
        this.#nbOfAgentsInACDRinging = json.nbOfAgentsInACDRinging;
        this.#nbOfAgentsInACDConv = json.nbOfAgentsInACDConv;
        this.#nbOfAgentsInWrapupAndTransaction = json.nbOfAgentsInWrapupAndTransaction;
        this.#nbOfAgentsInPause = json.nbOfAgentsInPause;
        this.#nbOfBusyAgents = json.nbOfBusyAgents;
        this.#nbOfLoggedOnAgents = json.nbOfLoggedOnAgents;
        this.#nbOfFreeAgents = json.nbOfFreeAgents;
        this.#nbOfIdleAgents = json.nbOfIdleAgents;
        this.#nbOfLoggedOnAndNotWithdrawnAgents = json.nbOfLoggedOnAndNotWithdrawnAgents;
        this.#incomingTraffic = json.incomingTraffic;
        this.#consolidatedPilotsServiceLevel = json.consolidatedPilotsServiceLevel;
        this.#consolidatedPilotsEfficiency = json.consolidatedPilotsEfficiency;
        this.#consolidatedQueuesWaitingTime = json.consolidatedQueuesWaitingTime;
        this.#consolidatedQueuesNbOfWaitingCalls = json.consolidatedQueuesNbOfWaitingCalls;
        this.#consolidatedQueuesEWT = json.consolidatedQueuesEWT;
        this.#pilotsWorstServiceLevel = json.pilotsWorstServiceLevel;
        this.#pilotsWorstEfficiency = json.pilotsWorstEfficiency;
        this.#pilotsBestServiceLevel = json.pilotsBestServiceLevel;
        this.#pilotsBestEfficiency = json.pilotsBestEfficiency;
        this.#queuesLongestWaitingTime = json.queuesLongestWaitingTime;
        this.#afeKey = json.afeKey;
    }

    /**
     * @internal
     */
    static fromJson(json: OnAgentProcessingGroupRtiChangedJson): OnAgentProcessingGroupRtiChanged {
        return new OnAgentProcessingGroupRtiChanged(json);
    }

    // --- Getters with JSDoc ---

    /** Returns the name of the agent processing group. */
    get name(): string {
        return this.#name;
    }

    /** Returns the number identifying the agent processing group. */
    get number(): string {
        return this.#number;
    }

    /** Returns the type of the agent processing group. */
    get type(): AgentProcessingGroupType {
        return this.#type;
    }

    /** Returns the current service state of the agent processing group. */
    get state(): ServiceState {
        return this.#state;
    }

    /** Returns the number of withdrawn agents. */
    get nbOfWithdrawnAgents(): number | undefined {
        return this.#nbOfWithdrawnAgents;
    }

    /** Returns the number of agents currently in private call. */
    get nbOfAgentsInPrivateCall(): number | undefined {
        return this.#nbOfAgentsInPrivateCall;
    }

    /** Returns the number of agents currently in ACD call. */
    get nbOfAgentsInACDCall(): number | undefined {
        return this.#nbOfAgentsInACDCall;
    }

    /** Returns the number of agents currently in ACD ringing. */
    get nbOfAgentsInACDRinging(): number | undefined {
        return this.#nbOfAgentsInACDRinging;
    }

    /** Returns the number of agents currently in ACD conversation. */
    get nbOfAgentsInACDConv(): number | undefined {
        return this.#nbOfAgentsInACDConv;
    }

    /** Returns the number of agents in wrap-up or transaction state. */
    get nbOfAgentsInWrapupAndTransaction(): number | undefined {
        return this.#nbOfAgentsInWrapupAndTransaction;
    }

    /** Returns the number of agents currently in pause. */
    get nbOfAgentsInPause(): number | undefined {
        return this.#nbOfAgentsInPause;
    }

    /** Returns the number of busy agents (ACD or in private call). */
    get nbOfBusyAgents(): number | undefined {
        return this.#nbOfBusyAgents;
    }

    /** Returns the number of agents logged on (total). */
    get nbOfLoggedOnAgents(): number | undefined {
        return this.#nbOfLoggedOnAgents;
    }

    /** Returns the number of free agents (withdrawn or not). */
    get nbOfFreeAgents(): number | undefined {
        return this.#nbOfFreeAgents;
    }

    /** Returns the number of idle agents, excluding withdrawn agents. */
    get nbOfIdleAgents(): number | undefined {
        return this.#nbOfIdleAgents;
    }

    /** Returns the number of agents logged on who are not withdrawn or free. */
    get nbOfLoggedOnAndNotWithdrawnAgents(): number | undefined {
        return this.#nbOfLoggedOnAndNotWithdrawnAgents;
    }

    /** Returns the number of incoming calls during the last minute. */
    get incomingTraffic(): number | undefined {
        return this.#incomingTraffic;
    }

    /** Returns the service level on all pilots possibly serving this processing group. */
    get consolidatedPilotsServiceLevel(): number | undefined {
        return this.#consolidatedPilotsServiceLevel;
    }

    /** Returns the efficiency on all pilots possibly serving this processing group. */
    get consolidatedPilotsEfficiency(): number | undefined {
        return this.#consolidatedPilotsEfficiency;
    }

    /** Returns the current waiting time on queues possibly serving this processing group. */
    get consolidatedQueuesWaitingTime(): number | undefined {
        return this.#consolidatedQueuesWaitingTime;
    }

    /** Returns the number of waiting calls in queues possibly serving this processing group. */
    get consolidatedQueuesNbOfWaitingCalls(): number | undefined {
        return this.#consolidatedQueuesNbOfWaitingCalls;
    }

    /** Returns the expected waiting time on queues possibly serving this processing group. */
    get consolidatedQueuesEWT(): number | undefined {
        return this.#consolidatedQueuesEWT;
    }

    /** Returns the worst service level on all pilots possibly serving this processing group. */
    get pilotsWorstServiceLevel(): number | undefined {
        return this.#pilotsWorstServiceLevel;
    }

    /** Returns the worst efficiency on all pilots possibly serving this processing group. */
    get pilotsWorstEfficiency(): number | undefined {
        return this.#pilotsWorstEfficiency;
    }

    /** Returns the best service level on all pilots possibly serving this processing group. */
    get pilotsBestServiceLevel(): number | undefined {
        return this.#pilotsBestServiceLevel;
    }

    /** Returns the best efficiency on all pilots possibly serving this processing group. */
    get pilotsBestEfficiency(): number | undefined {
        return this.#pilotsBestEfficiency;
    }

    /** Returns the longest current waiting time in queues possibly serving this processing group. */
    get queuesLongestWaitingTime(): number | undefined {
        return this.#queuesLongestWaitingTime;
    }

    /** Returns the object CCD key. */
    get afeKey(): number | undefined {
        return this.#afeKey;
    }
}

/**
 * Event delivered whenever the attributes of one or more CCD "other" processing groups change.
 *
 * This event contains only the attributes that have changed since the previous notification.
 * It is sent periodically according to the Context configuration in CallCenterRealtimeService.
 *
 * Typical usage:
 * ```ts
 * const event = OnOtherProcessingGroupRtiChanged.fromJson(json);
 * const nbACDCalls = event.nbOfACDCalls;
 * ```
 *
 * @see CallCenterRealtimeService
 * @see Context
 * @since 2.7.4
 */
export class OnOtherProcessingGroupRtiChanged {
    #name: string;
    #number: string;
    #type: OtherProcessingGroupType;
    #state: ServiceState;
    #nbOfACDCalls?: number;
    #incomingTraffic?: number;
    #afeKey?: number;

    /**
     * @internal
     */
    private constructor(json: OnOtherProcessingGroupRtiChangedJson) {
        this.#name = json.name;
        this.#number = json.number;
        this.#type = json.type;
        this.#state = json.state;
        this.#nbOfACDCalls = json.nbOfACDCalls;
        this.#incomingTraffic = json.incomingTraffic;
        this.#afeKey = json.afeKey;
    }

    /** Returns the name of the processing group */
    get name(): string {
        return this.#name;
    }

    /** Returns the directory number of the processing group */
    get number(): string {
        return this.#number;
    }

    /** Returns the type of the processing group */
    get type(): OtherProcessingGroupType {
        return this.#type;
    }

    /** Returns the current service state of the processing group */
    get state(): ServiceState {
        return this.#state;
    }

    /** Returns the number of ACD calls in the processing group */
    get nbOfACDCalls(): number | undefined {
        return this.#nbOfACDCalls;
    }

    /** Returns the number of incoming calls during the last minute */
    get incomingTraffic(): number | undefined {
        return this.#incomingTraffic;
    }

    /** Returns the CCD key of this processing group */
    get afeKey(): number | undefined {
        return this.#afeKey;
    }

    /**
     * @internal
     */
    static fromJson(json: OnOtherProcessingGroupRtiChangedJson): OnOtherProcessingGroupRtiChanged {
        return new OnOtherProcessingGroupRtiChanged(json);
    }
}
