/*
 * Copyright 2025 ALE International
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
    OnCallCreatedJson,
    OnCallModifiedJson,
    OnCallRemovedJson,
    OnDeviceStateModifiedJson,
    OnDynamicStateChangedJson,
    OnTelephonyStateJson,
    OnUserStateModifiedJson,
} from '../../internal/types/telephony/telephony-types';
import { CallCause } from './call/call-cause';
import { CallData } from './call/call-data';
import { Leg } from './call/leg';
import { Participant } from './call/participant';
import { DeviceState } from './device/device-state';
import { HuntingGroupStatus } from './hunting-group-status';
import { TelephonicState } from './telephonic-state';
import { UserState } from './user/user-state';
import { Device } from '../common/device';

/**
 * Event raised when a new call has been created.
 * <p>
 * Received via the {@link Telephony.ON_CALL_CREATED} event.
 *
 * @see Telephony.ON_CALL_CREATED
 */
export class OnCallCreated {
    #loginName: string;
    #callRef: string;
    #cause?: CallCause;
    #callData?: CallData;
    #initiator?: string;
    #legs?: Leg[];
    #participants?: Participant[];
    #deviceCapabilities?: Device.Capabilities[];

    /**
     * @internal
     */
    private constructor(
        loginName: string,
        callRef: string,
        cause?: CallCause,
        callData?: CallData,
        initiator?: string,
        legs?: Leg[],
        participants?: Participant[],
        deviceCapabilities?: Device.Capabilities[]
    ) {
        this.#loginName = loginName;
        this.#callRef = callRef;
        this.#cause = cause;
        this.#callData = callData;
        this.#initiator = initiator;
        this.#legs = legs;
        this.#participants = participants;
        this.#deviceCapabilities = deviceCapabilities;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The call reference.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * The cause of the call creation event.
     */
    get cause(): CallCause | null {
        return this.#cause ?? null;
    }

    /**
     * The call data associated with the new call.
     */
    get callData(): CallData | null {
        return this.#callData ?? null;
    }

    /**
     * The initiator of the call, if available.
     */
    get initiator(): string | null {
        return this.#initiator ?? null;
    }

    /**
     * The legs associated with the call.
     */
    get legs(): Leg[] | null {
        return this.#legs ?? null;
    }

    /**
     * The participants in the call.
     */
    get participants(): Participant[] | null {
        return this.#participants ?? null;
    }

    /**
     * The updated device capabilities following the call creation.
     */
    get deviceCapabilities(): Device.Capabilities[] | null {
        return this.#deviceCapabilities ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnCallCreatedJson): OnCallCreated {
        return new OnCallCreated(
            json.loginName,
            json.callRef,
            json.cause,
            json.callData ? CallData.fromJson(json.callData) : undefined,
            json.initiator,
            json.legs?.map(Leg.fromJson) ?? undefined,
            json.participants?.map(Participant.fromJson) ?? undefined,
            json.deviceCapabilities?.map(Device.Capabilities.fromJson) ?? undefined
        );
    }
}

/**
 * Event raised when an existing call has been modified.
 * <p>
 * This event is raised for any change to a call's state, participants or legs —
 * including hold, retrieve, transfer, merge and conference operations.
 * <p>
 * Received via the {@link Telephony.ON_CALL_MODIFIED} event.
 *
 * @see Telephony.ON_CALL_MODIFIED
 */
export class OnCallModified {
    #loginName: string;
    #callRef: string;
    #cause?: CallCause;
    #previousCallRef?: string;
    #replacedByCallRef?: string;
    #callData?: CallData;
    #modifiedLegs?: Leg[];
    #addedLegs?: Leg[];
    #removedLeg?: Leg[];
    #modifiedParticipants?: Participant[];
    #addedParticipants?: Participant[];
    #removedParticipants?: string[];
    #deviceCapabilities?: Device.Capabilities[];

    /**
     * @internal
     */
    private constructor(
        loginName: string,
        callRef: string,
        cause?: CallCause,
        previousCallRef?: string,
        replacedByCallRef?: string,
        callData?: CallData,
        modifiedLegs?: Leg[],
        addedLegs?: Leg[],
        removedLeg?: Leg[],
        modifiedParticipants?: Participant[],
        addedParticipants?: Participant[],
        removedParticipants?: string[],
        deviceCapabilities?: Device.Capabilities[]
    ) {
        this.#loginName = loginName;
        this.#callRef = callRef;
        this.#cause = cause;
        this.#previousCallRef = previousCallRef;
        this.#replacedByCallRef = replacedByCallRef;
        this.#callData = callData;
        this.#modifiedLegs = modifiedLegs;
        this.#addedLegs = addedLegs;
        this.#removedLeg = removedLeg;
        this.#modifiedParticipants = modifiedParticipants;
        this.#addedParticipants = addedParticipants;
        this.#removedParticipants = removedParticipants;
        this.#deviceCapabilities = deviceCapabilities;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The call reference of the modified call.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * The cause of the call modification event.
     */
    get cause(): CallCause | null {
        return this.#cause ?? null;
    }

    /**
     * The previous call reference, present when this call replaced another call.
     */
    get previousCallRef(): string | null {
        return this.#previousCallRef ?? null;
    }

    /**
     * The call reference that replaced this call, if applicable.
     */
    get replacedByCallRef(): string | null {
        return this.#replacedByCallRef ?? null;
    }

    /**
     * The updated call data.
     */
    get callData(): CallData | null {
        return this.#callData ?? null;
    }

    /**
     * The legs that were modified in this event.
     */
    get modifiedLegs(): Leg[] | null {
        return this.#modifiedLegs ?? null;
    }

    /**
     * The legs that were added in this event.
     */
    get addedLegs(): Leg[] | null {
        return this.#addedLegs ?? null;
    }

    /**
     * The legs that were removed in this event.
     */
    get removedLeg(): Leg[] | null {
        return this.#removedLeg ?? null;
    }

    /**
     * The participants whose state was modified in this event.
     */
    get modifiedParticipants(): Participant[] | null {
        return this.#modifiedParticipants ?? null;
    }

    /**
     * The participants that were added in this event.
     */
    get addedParticipants(): Participant[] | null {
        return this.#addedParticipants ?? null;
    }

    /**
     * The identifiers of the participants that were removed in this event.
     */
    get removedParticipants(): string[] | null {
        return this.#removedParticipants ?? null;
    }

    /**
     * The updated device capabilities following the call modification.
     */
    get deviceCapabilities(): Device.Capabilities[] | null {
        return this.#deviceCapabilities ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnCallModifiedJson): OnCallModified {
        return new OnCallModified(
            json.loginName,
            json.callRef,
            json.cause,
            json.previousCallRef,
            json.replacedByCallRef,
            json.callData ? CallData.fromJson(json.callData) : undefined,
            json.modifiedLegs?.map(Leg.fromJson) ?? undefined,
            json.addedLegs?.map(Leg.fromJson) ?? undefined,
            json.removedLeg?.map(Leg.fromJson) ?? undefined,
            json.modifiedParticipants?.map(Participant.fromJson) ?? undefined,
            json.addedParticipants?.map(Participant.fromJson) ?? undefined,
            json.removedParticipants ?? undefined,
            json.deviceCapabilities?.map(Device.Capabilities.fromJson) ?? undefined
        );
    }
}

/**
 * Event raised when a call has been removed.
 * <p>
 * Received via the {@link Telephony.ON_CALL_REMOVED} event.
 *
 * @see Telephony.ON_CALL_REMOVED
 */
export class OnCallRemoved {
    #loginName: string;
    #callRef: string;
    #cause?: CallCause;
    #newDestination?: string;
    #deviceCapabilities?: Device.Capabilities[];

    /**
     * @internal
     */
    private constructor(
        loginName: string,
        callRef: string,
        cause?: CallCause,
        newDestination?: string,
        deviceCapabilities?: Device.Capabilities[]
    ) {
        this.#loginName = loginName;
        this.#callRef = callRef;
        this.#cause = cause;
        this.#newDestination = newDestination;
        this.#deviceCapabilities = deviceCapabilities;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The reference of the call that was removed.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * The cause of the call removal.
     */
    get cause(): CallCause | null {
        return this.#cause ?? null;
    }

    /**
     * The new destination if the call was forwarded or redirected before removal.
     */
    get newDestination(): string | null {
        return this.#newDestination ?? null;
    }

    /**
     * The updated device capabilities following the call removal.
     */
    get deviceCapabilities(): Device.Capabilities[] | null {
        return this.#deviceCapabilities ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnCallRemovedJson): OnCallRemoved {
        return new OnCallRemoved(
            json.loginName,
            json.callRef,
            json.cause,
            json.newDestination,
            json.deviceCapabilities?.map(Device.Capabilities.fromJson) ?? undefined
        );
    }
}

/**
 * Event raised when the state of one or more devices has been modified.
 * <p>
 * Received via the {@link Telephony.ON_DEVICE_STATE_MODIFIED} event.
 *
 * @see Telephony.ON_DEVICE_STATE_MODIFIED
 */
export class OnDeviceStateModified {
    #loginName: string;
    #deviceStates?: DeviceState[];

    /**
     * @internal
     */
    private constructor(loginName: string, deviceStates?: DeviceState[]) {
        this.#loginName = loginName;
        this.#deviceStates = deviceStates;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The updated states of the modified devices.
     */
    get deviceStates(): DeviceState[] | null {
        return this.#deviceStates ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnDeviceStateModifiedJson): OnDeviceStateModified {
        return new OnDeviceStateModified(json.loginName, json.deviceStates?.map(DeviceState.fromJson) ?? undefined);
    }
}

/**
 * Event raised when the dynamic state of a user has changed.
 * <p>
 * Currently carries the user's hunting group logged-on state.
 * <p>
 * Received via the {@link Telephony.ON_DYNAMIC_STATE_CHANGED} event.
 *
 * @see Telephony.ON_DYNAMIC_STATE_CHANGED
 */
export class OnDynamicStateChanged {
    #loginName: string;
    #huntingGroupState?: HuntingGroupStatus;

    /**
     * @internal
     */
    private constructor(loginName: string, huntingGroupState?: HuntingGroupStatus) {
        this.#loginName = loginName;
        this.#huntingGroupState = huntingGroupState;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Whether the user is currently logged on to their hunting group.
     */
    get logged(): boolean {
        return this.#huntingGroupState?.loggedOn ?? false;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnDynamicStateChangedJson): OnDynamicStateChanged {
        return new OnDynamicStateChanged(
            json.loginName,
            json.huntingGroupState ? HuntingGroupStatus.fromJson(json.huntingGroupState) : undefined
        );
    }
}

/**
 * Event raised in response to a snapshot request, containing the full telephonic
 * state of the user.
 * <p>
 * Received via the {@link Telephony.ON_TELEPHONY_STATE} event, triggered by
 * {@link Telephony.requestSnapshot}.
 *
 * @see Telephony.ON_TELEPHONY_STATE
 * @see Telephony.requestSnapshot
 */
export class OnTelephonyState {
    #loginName: string;
    #state?: TelephonicState;

    /**
     * @internal
     */
    private constructor(loginName: string, state?: TelephonicState) {
        this.#loginName = loginName;
        this.#state = state;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The full telephonic state of the user, including active calls and device capabilities.
     */
    get state(): TelephonicState | null {
        return this.#state ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnTelephonyStateJson): OnTelephonyState {
        return new OnTelephonyState(json.loginName, json.state ? TelephonicState.fromJson(json.state) : undefined);
    }
}

/**
 * Event raised when a user's state has been modified.
 * <p>
 * Received via the {@link Telephony.ON_USER_STATE_MODIFIED} event.
 *
 * @see Telephony.ON_USER_STATE_MODIFIED
 */
export class OnUserStateModified {
    #loginName: string;
    #state: UserState;

    /**
     * @internal
     */
    private constructor(loginName: string, state: UserState) {
        this.#loginName = loginName;
        this.#state = state;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The updated user state.
     */
    get state(): UserState {
        return this.#state;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: OnUserStateModifiedJson): OnUserStateModified {
        return new OnUserStateModified(json.loginName, json.state);
    }
}
