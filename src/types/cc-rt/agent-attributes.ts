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
 * `AgentAttributes` represents the possible real-time attributes
 * for a CCD agent.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export enum RtiAgentAttributes {
    /** The associated pro-acd set of the agent. */
    AssociatedSet = 'AssociatedSet',

    /** The current processing group of the agent. */
    CurrentPG = 'CurrentPG',

    /** The phone state of the agent (e.g., ringing, talking, idle). */
    PhoneState = 'PhoneState',

    /** The UTC logon date of the agent. */
    LogonDate = 'LogonDate',

    /** The total duration (in seconds) of all private calls. */
    PrivateCallsTotalDuration = 'PrivateCallsTotalDuration',

    /** The UTC date when the agent entered the current communication. */
    ComDate = 'ComDate',

    /** The duration (in seconds) of the current communication. */
    ComDuration = 'ComDuration',

    /** The number of private calls handled by the agent. */
    NBOfPrivateCalls = 'NBOfPrivateCalls',

    /** The number of answered ACD calls. */
    NbOfServedACDCalls = 'NbOfServedACDCalls',

    /** The number of non-answered ACD calls. */
    NbOfRefusedACDCalls = 'NbOfRefusedACDCalls',

    /** The number of transferred ACD calls. */
    NbOfTransferredACDCalls = 'NbOfTransferredACDCalls',

    /** The number of outgoing ACD calls. */
    NbOfOutgoingACDCalls = 'NbOfOutgoingACDCalls',

    /** The number of picked-up ACD calls (intercepted calls). */
    NbOfInterceptedACDCalls = 'NbOfInterceptedACDCalls',

    /** The service state of the agent (e.g., loggedIn, assigned, available). */
    ServiceState = 'ServiceState',

    /** The number of withdrawals taken by the agent. */
    NbOfWithdrawals = 'NbOfWithdrawals',

    /** The total duration of withdrawals taken by the agent. */
    WithdrawalsTotalDuration = 'WithdrawalsTotalDuration',

    /** The reason for the last withdrawal. */
    WithdrawReason = 'WithdrawReason',

    /** The name of the pilot associated with the agent. */
    PilotName = 'PilotName',

    /** The name of the queue associated with the agent. */
    QueueName = 'QueueName',

    /** Represents all attributes. */
    ALL = 'ALL',
}
