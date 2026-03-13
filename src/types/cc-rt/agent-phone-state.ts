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
 * Represents the possible telephonic states of a CCD agent.
 *
 * These states are reported by real-time events such as
 * `OnAcdStatsProgressEvent` and related RTI notifications.
 *
 * @since 2.7.4
 */
export enum AgentPhoneState {
    /** Idle (agent is free). */
    IDLE = 'Idle',

    /** Only for analog devices: device is off-hook. */
    LINE_LOCKOUT = 'LineLockout',

    /** Out of service. */
    OUT_OF_ORDER = 'OutOfOrder',

    /** Ringing (incoming ACD call). */
    ACD_RINGING = 'AcdRinging',

    /** Call in progress (ACD call). */
    ACD_TALKING = 'AcdConversation',

    /** In call or on hold while establishing another connection (double call). */
    ACD_CONSULTATION = 'AcdConsultation',

    /** Request for help (supervisor support). */
    HELP = 'Help',

    /** In conference call. */
    ACD_CONFERENCE = 'AcdConference',

    /** Dialing transaction code. */
    TRANSACTION_ON_DIAL = 'TransactionOnDial',

    /** In pause state. */
    PAUSE = 'Pause',

    /** In wrap-up state after a call. */
    WRAP_UP = 'WrapUp',

    /** Requester-only: discreet listening. */
    SUPERVISOR_DISCRETE_LISTENING = 'SupervisorDiscreteListening',

    /** Agent is monitored during discreet listening. */
    AGENT_DISCRETE_LISTENING = 'AgentDiscreteListening',

    /** Recording call in progress. */
    RECORDING = 'Recording',

    /** Agent has logged off. */
    LOGGED_OUT = 'LoggedOut',

    /** Agent or correspondent has placed the call on hold. */
    HELD = 'Held',

    /** Dialing a call. */
    DIALING = 'Dialing',

    /** Ringing state (local visual/melodic). */
    PRIVATE_RINGING = 'PrivateRinging',

    /** Local call in progress. */
    PRIVATE_LOCAL_CONVERSATION = 'PrivateLocalConversation',

    /** External call in progress. */
    PRIVATE_EXTERNAL_CONVERSATION = 'PrivateExternalConversation',

    /** Call established or on hold, with a second call in establishment or hold. */
    PRIVATE_CONSULTATION = 'PrivateConsultation',

    /** In a conference call. */
    PRIVATE_CONFERENCE = 'PrivateConference',

    /** Busy tone. */
    BUSY_TONE = 'BusyTone',

    /** Reserved by the attendant. */
    RESERVED = 'Reserved',

    /** Outgoing ACD call. */
    ACD_OUTGOING_CONVERSATION = 'AcdOutgoingConversation',

    /** Supervisor in "listening on agent". */
    CONTINUOUS_SUPERVISION = 'ContinuousSupervision',

    /** Fake call that does not block the GT (IVR). */
    UNAVAILABLE = 'Unavailable',

    /** Unknown telephonic state. */
    UNKNOWN = 'unknown',
}
