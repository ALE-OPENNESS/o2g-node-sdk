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

import { CallCause } from '../../../types/telephony/call/call-cause';
import { MediaState } from '../../../types/telephony/call/media-state';
import { OperationalState } from '../../../types/telephony/device/operational-state';
import { PilotStatus } from '../../../types/telephony/call/ccd/pilot-status';
import { RecordState } from '../../../types/telephony/call/record-state';
import { UserState } from '../../../types/telephony/user/user-state';
import { PartyInfoJson } from '../common/common-types';

/**
 * The information about the possible transfer on a pilot.
 */
/** @internal */
export type PilotTransferInfoJson = {
    /**
     * Whether the transfer on this CCD pilot is possible.
     */
    transferPossible?: boolean;

    /**
     * The pilot state.
     */
    pilotStatus?: PilotStatus;
};

/**
 * The information associated to this acd call.
 */
/** @internal */
export type InfoJson = {
    /**
     * The waiting time in a queue from which the call has been distributed.
     */
    queueWaitingTime: number;

    /**
     * The global waiting time in the CCD.
     */
    globalWaitingTime: number;

    /**
     * The agent group the agent who answer the call is logged in.
     */
    agentGroup: number;

    /**
     * Whether it's a local acd call
     */
    local: boolean;
};

/**
 * The information about the queue that has distributed this call.
 */
/** @internal */
export type QueueDataJson = {
    /**
     * The estimated waiting time in the queue.
     */
    waitingTime?: number;

    /**
     * Whether this queue is saturated.
     */
    saturated?: boolean;
};

/**
 * AcdData represents the acd extension for an acd call.
 */
/** @internal */
export type AcdDataJson = {
    /**
     * The information associated to this acd call.
     */
    callInfo?: InfoJson;

    /**
     * The information about the queue that has distributed this call.
     */
    queueData?: QueueDataJson;

    /**
     * The pilot who has distributed this call.
     */
    pilotNumber?: string;

    /**
     * The RSI point that has distribuet this call.
     */
    rsiNumber?: string;

    /**
     * Whether the transfer on the pilot was supervised.
     */
    supervisedTransfer?: boolean;

    /**
     * The information about the possible transfer on a pilot.
     */
    pilotTransferInfo?: PilotTransferInfoJson;
};

/**
 * TrunkIdentification provide provide information on network timeslot and trunk eqt number for external calls.
 */
/** @internal */
export type TrunkIdentificationJson = {
    networkTimeslot: number;
    trunkNeqt: number[];
};

/**
 * Tag represents a tag (a define name and value), associated to a call.
 */
/** @internal */
export type TagJson = {
    /**
     * The tag name.
     */
    name: string;

    /**
     * The tag value.
     */
    value?: string;

    /**
     * The tag visibilities.
     */
    visibilities?: string[];
};

/**
 * `Capabilities` represents the call capabilities.
 */
/** @internal */
export type CallCapabilitiesJson = {
    /**
     * Whether a device can be added to this call.
     */
    addDevice: boolean;

    /**
     * Whether a participant can be added to this call.
     */
    addParticipant: boolean;

    /**
     * Whether this call can be intruted.
     */
    intruded: boolean;

    /**
     * Whether it is possible to make intrusion on the user called through this call.
     */
    intrusion: boolean;

    /**
     * Whether this call can be transferred.
     */
    transfer: boolean;

    /**
     * Whether this call can be blind transferred.
     */
    blindTransfer: boolean;

    /**
     * Whether this call can be merged.
     */
    merge: boolean;

    /**
     * Whether this call can be redirected.
     */
    redirect: boolean;

    /**
     * Whether this call can be picked up.
     */
    pickedUp: boolean;

    /**
     * Whether this call can be redirected on voice mail.
     */
    redirectToVoiceMail: boolean;

    /**
     * Whether this call can overflow on voice mail.
     */
    overflowToVoiceMail: boolean;

    /**
     * Whether this call can be dropped.
     */
    dropMe: boolean;

    /**
     * Whether this call can be terminated.
     */
    terminate: boolean;

    /**
     * Whether this call can be rejected.
     */
    reject: boolean;

    /**
     * Whether this call can be called back.
     */
    callBack: boolean;

    /**
     * Whether this call can be parked.
     */
    park: boolean;

    /**
     * Whether this call can be recorded.
     */
    startRecord: boolean;

    /**
     * Whether this call can stop recording.
     */
    stopRecord: boolean;

    /**
     * Whether this call can pause recording.
     */
    pauseRecord: boolean;

    /**
     * Whether this call can resume recording.
     */
    resumeRecord: boolean;

    /**
     * Whether drop participant can be invoked.
     */
    dropParticipant: boolean;

    /**
     * Whether mute participant can be invoked.
     */
    muteParticipant: boolean;

    /**
     * Whether hold participant can be invoked.
     */
    holdParticipant: boolean;
};

/**
 * CallData represents the data associated to a call.
 */
/** @internal */
export type CallDataJson = {
    /**
     * The initial party called.
     */
    initialCalled?: PartyInfoJson;

    /**
     * the last device which redirects the call.
     */
    lastRedirecting?: PartyInfoJson;

    /**
     * Whether it is a device call.
     */
    deviceCall?: boolean;

    /**
     * Whether this call is anonymous
     */
    anonymous?: boolean;

    /**
     * tThis call UUID.
     */
    callUUID?: string;

    /**
     * The state of this call.
     */
    state?: MediaState;

    /**
     * The record state of this call.
     */
    recordState?: RecordState;

    /**
     * This call tags.
     */
    tags?: TagJson[];

    /**
     * The call capabilities.
     */
    capabilities?: CallCapabilitiesJson;

    /**
     * The call associated data.
     */
    associatedData?: string;

    hexaBinaryAssociatedData?: string;

    /**
     * This call account info.
     */
    accountInfo?: string;

    /**
     * This call associated acd data.
     */
    acdCallData?: AcdDataJson;

    /**
     * TrunkIdentification if external call
     */
    trunkIdentification?: TrunkIdentificationJson;
};

/**
 * LegCapabilities represents the capability of a leg. The action that can
 * be carried out on the leg according to its state.
 */
/** @internal */
export type LegCapabilitiesJson = {
    /**
     * Whether the leg can answer.
     */
    answer?: boolean;

    /**
     * Whether the leg can be dropped.
     */
    drop?: boolean;

    /**
     * Whether the leg can be put on hold.
     */
    hold?: boolean;

    /**
     * Whether can be retrieved.
     */
    retrieve?: boolean;

    /**
     * Whether the leg can be reconnected.
     */
    reconnect?: boolean;

    /**
     * Whether the leg can be muted.
     */
    mute?: boolean;

    /**
     * Whether the leg can be unmuted.
     */
    unMute?: boolean;

    /**
     * Whether the leg can send dtmf.
     */
    sendDtmf?: boolean;

    /**
     * Whether the leg can switch device.
     */
    switchDevice?: boolean;
};

/**
 * Describes a leg. A leg represents the user's device involved in a call for a
 * dedicated media.
 */
/** @internal */
export type LegJson = {
    /**
     * The phone number of the device associated to this leg.
     */
    deviceId: string;

    /**
     * The media state.
     */
    state: MediaState;

    /**
     * Whether the remote party is ringing.
     */
    ringingRemote: boolean;

    /**
     * The leg capabilities.
     */
    capabilities: LegCapabilitiesJson;
};

/**
 * Represent a participant to a call. A call can have several participants (case of a conference for exemple).
 * A participant is identified by its 'participantId', a unique 'string generated by the O2G server
 */
/** @internal */
export type ParticipantJson = {
    /**
     * This participant identifier.
     */
    participantId: string;

    /**
     * This participant identity.
     */
    identity?: PartyInfoJson;

    /**
     * Whether this paticipant is anonymous.
     */
    anonymous?: boolean;

    /**
     * Whether this participant can be dropped.
     */
    undroppable?: boolean;

    /**
     * The participant media state.
     */
    state?: MediaState;
};

/**
 * This class describe a call.
 * <p>
 * An outgoing call is created by invoking one of the 'makeCall' methods
 * of {@link Telephony}.
 */
/** @internal */
export type CallJson = {
    /**
     * The reference of this call.
     */
    callRef: string;

    /**
     * The data associated to this call.
     */
    callData?: CallDataJson;

    /**
     * The legs associated to this call.
     */
    legs?: LegJson[];

    /**
     * The participants associated to this call.
     */
    participants?: ParticipantJson[];
};

/**
 * DeviceCapabilities represents the capability of a device.
 */
/** @internal */
export type DeviceCapabilitiesJson = {
    /**
     * The device identifier.
     */
    deviceId: string;

    /**
     * Wheather this device can make a call.
     */
    makeCall?: boolean;

    /**
     * Wheather his device can make a business call.
     */
    makeBusinessCall?: boolean;

    /**
     * Wheather this device can make a private call.
     */
    makePrivateCall?: boolean;

    /**
     * Wheather this device can unpark a call.
     */
    unParkCall?: boolean;
};


export type DeviceStatesJson = {
    deviceStates: DeviceStateJson[];
}

/**
 * Represent the telephonic state of a user.
 */
/** @internal */
export type TelephonicStateJson = {
    /**
     * The collection of active calls.
     */
    calls?: CallJson[];

    /**
     * The collection of device capabilities.
     */
    deviceCapabilities?: DeviceCapabilitiesJson[];

    /**
     * The user state.
     */
    userState?: UserState;

    deviceStates?: DeviceStatesJson;
};

/**
 * DeviceState represents the state of a device.
 */
/** @internal */
export type DeviceStateJson = {
    /**
     * The device identifier.
     */
    deviceId: string;

    /**
     * The device state.
     */
    state: OperationalState;
};

/**
 * Describes the status of a user regarding hunting groups
 */
/** @internal */
export type HuntingGroupStatusJson = {
    /**
     * Whether a user is logged in a hunting group.
     */
    logon: boolean;
};

/**
 * HuntingGroups gives the hunting group information for a user. A user
 * can be member of only one hunting group.
 */
/** @internal */
export type HuntingGroupsJson = {
    /**
     * The list of existing hunting groups.
     */
    hgList?: string[];

    /**
     * The hunting group which the user is a member.
     */
    currentHg?: string;
};

/**
 * Callback represenst a callback request. A callback request is
 * invoked by a caller to ask the user to call him back as sson as possible.
 */
/** @internal */
export type CallbackJson = {
    /**
     * This callback request id.
     */
    callbackId: string;

    /**
     * The party who has requested the callback.
     */
    partyInfo: PartyInfoJson;
};

/**
 * MiniMessage class represents a mini message exchanged between two users.
 */
/** @internal */
export type MiniMessageJson = {
    /**
     * The sender of this message.
     */
    sender?: string;

    /**
     * The date the mini message has been sent.
     */
    dateTime?: string;

    /**
     * The text message.
     */
    message?: string;
};

/**
 * `PilotInfo` represents the the pilot information.
 * @since 2.7
 */
/** @internal */
export type PilotInfoJson = {
    /**
     * The pilot number
     */
    number?: string;

    /**
     * The estimated waiting time in the queue.
     */
    waitingTime?: number;

    /**
     * Indicates whether this queue is saturated.
     */
    saturation?: boolean;

    /**
     * Indicates whether the transfer on the pilot can be supervised.
     */
    supervisedTransfer?: boolean;

    /**
     * The information about the possible transfer on a pilot.
     */
    pilotTransferInfo?: PilotTransferInfoJson;
};

/** @internal */
export type ACRSkillJson = {
    skillNumber?: number;
    acrStatus?: boolean;
    expertEvalLevel?: number;
};

/** @internal */
export type PilotQueryParamJson = {
    agentNumber?: string;
    skills?: {
        skills: ACRSkillJson[];
    };
    priorityTransfer?: boolean;
    supervisedTransfer?: boolean;
};

/**
 * This notification indicates that a new call has been created.
 */
/** @internal */
export type OnCallCreatedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause?: CallCause;

    /**
     * Call data.
     */
    callData?: CallDataJson;

    /**
     * Initiator of the call : correspond to one participant of the call, the matching can be done with the participantId value of the participants.
     */
    initiator?: string;

    /**
     * Legs associated to this call.
     */
    legs?: LegJson[];

    /**
     * Participants associated to this call.
     */
    participants?: ParticipantJson[];

    /**
     * Devices capabilities (if not specified, it means there is no modification).
     */
    deviceCapabilities?: DeviceCapabilitiesJson[];
};

/**
 * This notification indicates that an existing call has been modified.
 */
/** @internal */
export type OnCallModifiedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause?: CallCause;

    /**
     * If specified, this call reference indicates that the "callRef" replace "previousCallRef".
     * This also indicates that "previousCallRef" has been removed (call removed event is not generated)
     */
    previousCallRef?: string;

    /**
     * This call reference appears when a call is released, the replacedByCallRef if present indicates that the "callRef" is replaced by this one.
     */
    replacedByCallRef?: string;

    /**
     * Call data.
     */
    callData?: CallDataJson;

    /**
     * Legs modified (if not specified, it means there is no modification).
     */
    modifiedLegs?: LegJson[];

    /**
     * Legs added (if not specified, it means there is no added leg).
     */
    addedLegs?: LegJson[];

    /**
     * Legs removed (if not specified, it means there is no removed leg).
     */
    removedLeg?: LegJson[];

    /**
     * Participants modified (if not specified, it means there is no modification).
     */
    modifiedParticipants?: ParticipantJson[];

    /**
     * Participants added (if not specified, it means there is no added participant).
     */
    addedParticipants?: ParticipantJson[];

    /**
     * Participants removed (if not specified, it means there is no removed participant).
     */
    removedParticipants?: string[];

    /**
     * Devices capabilities (if not specified, it means there is no modification).
     */
    deviceCapabilities?: DeviceCapabilitiesJson[];
};

/**
 * This notification indicates that a call has been removed (hang up, transfer...).
 */
/** @internal */
export type OnCallRemovedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause?: CallCause;

    /**
     * If the call is forwarded or redirected, this field indicate the new destination number.
     * This number is a user phone number if the destination is a device associated to an user, else the number is the number provided by the system.
     */
    newDestination?: string;

    /**
     * Devices capabilities (if not specified, it means there is no modification).
     */
    deviceCapabilities?: DeviceCapabilitiesJson[];
};

/**
 * This notification indicates that device's state has been modified.
 */
/** @internal */
export type OnDeviceStateModifiedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * Device state modified.
     */
    deviceStates?: DeviceStateJson[];
};

/**
 * This notification indicates the user's dynamic state change. (hunting group logon state)
 */
/** @internal */
export type OnDynamicStateChangedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * User hg state.
     */
    huntingGroupState?: HuntingGroupStatusJson;
};

/**
 * This notification indicates the telephonic state (calls[] and deviceCapabilities[]) of a user.
 */
/** @internal */
export type OnTelephonyStateJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * Telephonic state of the user.
     */
    state?: TelephonicStateJson;
};

/**
 * This notification indicates that user's state has been modified (FREE, BUSY ...).
 */
/** @internal */
export type OnUserStateModifiedJson = {
    /**
     * Login name of the user receiving the event.
     */
    loginName: string;

    /**
     * User state.
     */
    state: UserState;
};
