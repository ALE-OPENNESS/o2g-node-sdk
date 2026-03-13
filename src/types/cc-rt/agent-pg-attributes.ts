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
 * `AgentProcessingGroupAttributes` represents the possible real-time attributes
 * for a CCD agent processing group.
 *
 * The `CallCenterRealtimeService` can report real-time events
 * for each of these attributes.
 */
export enum RtiAgentProcessingGroupAttributes {
    /** Service state of the processing group (e.g., Open, Blocked). */
    State = 'State',

    /** Number of agents who are withdrawn. */
    NbOfWithdrawnAgents = 'NbOfWithdrawnAgents',

    /** Number of agents currently in a private call. */
    NbOfAgentsInPrivateCall = 'NbOfAgentsInPrivateCall',

    /** Number of agents currently handling an ACD call. */
    NbOfAgentsInACDCall = 'NbOfAgentsInACDCall',

    /** Number of agents in ringing ACD calls. */
    NbOfAgentsInACDRinging = 'NbOfAgentsInACDRinging',

    /** Number of agents in established ACD conversations. */
    NbOfAgentsInACDConv = 'NbOfAgentsInACDConv',

    /** Number of agents in wrap-up or entering a transaction code. */
    NbOfAgentsInWrapupAndTransaction = 'NbOfAgentsInWrapupAndTransaction',

    /** Number of agents currently in pause. */
    NbOfAgentsInPause = 'NbOfAgentsInPause',

    /** Number of busy agents (either in ACD or private calls). */
    NbOfBusyAgents = 'NbOfBusyAgents',

    /** Number of logged-on agents. */
    NbOfLoggedOnAgents = 'NbOfLoggedOnAgents',

    /** Number of free agents, including withdrawn agents. */
    NbOfFreeAgents = 'NbOfFreeAgents',

    /** Number of free agents, excluding withdrawn agents. */
    NbOfIdleAgents = 'NbOfIdleAgents',

    /** Number of logged-on agents, excluding withdrawn and free agents. */
    NbOfLoggedOnAndNotWithdrawnAgents = 'NbOfLoggedOnAndNotWithdrawnAgents',

    /** Current waiting time (in seconds) on the queues potentially served by this group. */
    ConsolidatedQueuesWaitingTime = 'ConsolidatedQueuesWaitingTime',

    /** Number of waiting calls on the queues potentially served by this group. */
    ConsolidatedQueuesNbOfWaitingCalls = 'ConsolidatedQueuesNbOfWaitingCalls',

    /** Expected waiting time (EWT, in seconds) on the queues potentially served by this group. */
    ConsolidatedQueuesEWT = 'ConsolidatedQueuesEWT',

    /** Service level for all pilots potentially serving this group (average/best/worst). */
    ServiceLevel = 'ServiceLevel',

    /** Efficiency for all pilots potentially serving this group (average/best/worst). */
    Efficiency = 'Efficiency',

    /** Number of incoming calls within the last minute. */
    IncomingTraffic = 'IncomingTraffic',

    /** Represents all attributes. */
    ALL = 'ALL',
}
