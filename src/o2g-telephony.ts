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

import EventEmitter from 'events';
import TelephonyRest from './internal/rest/telephony-rest';
import { RecordingAction } from './types/telephony/RecordingAction';
import { EventRegistry } from './internal/events/event-dispatcher';
import { CorrelatorData } from './types/telephony/call/correlator-data';
import {
    OnCallCreated,
    OnCallModified,
    OnCallRemoved,
    OnDeviceStateModified,
    OnDynamicStateChanged,
    OnTelephonyState,
    OnUserStateModified,
} from './types/telephony/telephony-events';
import { Call } from './types/telephony/call';
import { HuntingGroupStatus } from './types/telephony/hunting-group-status';
import { HuntingGroups } from './types/telephony/hunting-groups';
import { MiniMessage } from './types/telephony/mini-message';
import { TelephonicState } from './types/telephony/telephonic-state';
import { Callback } from './types/telephony/callback';
import { PilotInfo } from './types/telephony/call/ccd/pilot-info';
import { Leg } from './types/telephony/call/leg';
import { Participant } from './types/telephony/call/participant';
import { DeviceState } from './types/telephony/device/device-state';
import { PilotTransferQueryParameters } from './types/telephony/call/ccd/pilot-transfer-query-param';
import { CallProfile } from './types/telephony/call/ccd/call-profile';

/**
 * The TelephonyService allows a user to initiate a call and to activate
 * any kind of OmniPCX Enterprise telephony services.
 * <p>
 * Using this service requires having a <b>TELEPHONY_ADVANCED</b> license,
 * except for the 3 basic services
 * {@link basicMakeCall}, {@link basicAnswerCall} and {@link basicDropMe} that are available without any
 * license.
 */
export class Telephony extends EventEmitter {
    #telephonyRest: TelephonyRest;

    /**
     * Occurs in response to a snapshot request.
     * @event
     */
    static readonly ON_TELEPHONY_STATE = 'OnTelephonyState';

    /**
     * Occurs when a new call is created.
     * @event
     */
    static readonly ON_CALL_CREATED = 'OnCallCreated';

    /**
     * Occurs when an existing call is modified.
     * @event
     */
    static readonly ON_CALL_MODIFIED = 'OnCallModified';

    /**
     * Occurs when a call has been removed.
     * @event
     */
    static readonly ON_CALL_REMOVED = 'OnCallRemoved';

    /**
     * Occurs when a user's state has been modified.
     * @event
     */
    static readonly ON_USER_STATE_MODIFIED = 'OnUserStateModified';

    /**
     * Occurs when a device's state has been modified.
     * @event
     */
    static readonly ON_DEVICE_STATE_MODIFIED = 'OnDeviceStateModified';

    /**
     * Occurs when a user's dynamic state has changed.
     * @event
     */
    static readonly ON_DYNAMIC_STATE_CHANGED = 'OnDynamicStateChanged';

    /**
     * @internal
     */
    constructor(telephonyRest: TelephonyRest, eventRegistry: EventRegistry) {
        super();
        this.#telephonyRest = telephonyRest;

        eventRegistry.register(this, Telephony.ON_TELEPHONY_STATE, OnTelephonyState);
        eventRegistry.register(this, Telephony.ON_CALL_CREATED, OnCallCreated);
        eventRegistry.register(this, Telephony.ON_CALL_MODIFIED, OnCallModified);
        eventRegistry.register(this, Telephony.ON_CALL_REMOVED, OnCallRemoved);
        eventRegistry.register(this, Telephony.ON_USER_STATE_MODIFIED, OnUserStateModified);
        eventRegistry.register(this, Telephony.ON_DEVICE_STATE_MODIFIED, OnDeviceStateModified);
        eventRegistry.register(this, Telephony.ON_DYNAMIC_STATE_CHANGED, OnDynamicStateChanged);
    }

    /**
     * Initiates a call from the specified device to the specified called number.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     * <p>
     * If `autoAnswer` is set to `false`, the `deviceId` is called before launching
     * the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param autoAnswer automatic answer on make call
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicMakeCall(deviceId: string, callee: string, autoAnswer = true): Promise<boolean> {
        return await this.#telephonyRest.basicMakeCall(deviceId, callee, autoAnswer);
    }

    /**
     * Answers an incoming ringing call on the specified device.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     *
     * @param deviceId the device phone number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicAnswerCall(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.basicAnswerCall(deviceId);
    }

    /**
     * Exits from the call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     *
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicDropMe(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.basicDropMe(loginName);
    }

    /**
     * Retrieves the calls in progress for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of active {@link Call} objects on success; `null` otherwise.
     */
    async getCalls(loginName: string | null = null): Promise<Call[] | null> {
        return await this.#telephonyRest.getCalls(loginName);
    }

    /**
     * Returns the call specified by the call reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the {@link Call} on success; `null` otherwise.
     */
    async getCall(callRef: string, loginName: string | null = null): Promise<Call | null> {
        return await this.#telephonyRest.getCall(callRef, loginName);
    }

    /**
     * Initiates a call from the specified device to the specified called number for
     * the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If `autoAnswer` is set to `false`, the `deviceId` is called before launching
     * the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param autoAnswer automatic answer on make call
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makeCall(
        deviceId: string,
        callee: string,
        autoAnswer: boolean = true,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.makeCall(deviceId, callee, autoAnswer, loginName);
    }

    /**
     * Initiates a new call to another user (the callee), using the specified device and options.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     * <p>
     * If `inhibitProgressTone` is `true`, the progress tone is inhibited on the outbound call.
     * <p>
     * The `callingNumber` can be used to present a different calling number on the public
     * network in order to hide the real calling extension number.
     *
     *  * @example
     * ```typescript
     * // Simple call with auto-answer
     * await O2G.telephony.makeCallEx("1234", "5678");
     *
     * // Call with progress tone inhibited and a different calling number
     * await O2G.telephony.makeCallEx("1234", "5678", true, true, null, "9000");
     *
     * // Call with correlator data to carry application context
     * const correlatorData = new CorrelatorData("transactionId=abc123");
     * await O2G.telephony.makeCallEx("1234", "5678", true, false, correlatorData);
     *
     * // Administrator making a call on behalf of a user
     * await O2G.telephony.makeCallEx("1234", "5678", true, false, null, null, "jdoe");
     * ```
     *
     * @param deviceId            the device phone number for which the call is made
     * @param callee              the called number
     * @param autoAnswer          automatic answer on make call
     * @param inhibitProgressTone allows to inhibit the progress tone on the current external call
     * @param correlatorData      correlator data to add to the call
     * @param callingNumber       calling number to present to the public network
     * @param loginName           the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makeCallEx(
        deviceId: string,
        callee: string,
        autoAnswer: boolean = true,
        inhibitProgressTone = false,
        correlatorData: CorrelatorData | null = null,
        callingNumber: string | null = null,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.makeCallEx(
            deviceId,
            callee,
            autoAnswer,
            inhibitProgressTone,
            correlatorData,
            callingNumber,
            loginName
        );
    }

    /**
     * Initiates a new private call to another user (the callee), using a PIN code and an optional secret code.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The private call service allows a user to specify that an external call is personal
     * rather than professional. The charging for this type of call can then be given
     * specific processing.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param callee     the called number
     * @param pin        the PIN code to identify the caller
     * @param secretCode the optional secret code used to confirm the PIN code
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makePrivateCall(
        deviceId: string,
        callee: string,
        pin: string,
        secretCode: string | null = null,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.makePrivateCall(deviceId, callee, pin, secretCode, loginName);
    }

    /**
     * Initiates a new business call to another user (the callee), using the specified business code.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the user's `deviceId`. Then when the
     * call is answered the call server starts the call to the `callee`, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId     the device phone number for which the call is made
     * @param callee       the called number
     * @param businessCode the cost center on which the call will be charged
     * @param loginName    the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makeBusinessCall(
        deviceId: string,
        callee: string,
        businessCode: string,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.makeBusinessCall(deviceId, callee, businessCode, loginName);
    }

    /**
     * Initiates a call from a CCD agent to a supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * First, the call server initiates a call on the agent's `deviceId`. Then when
     * the call is answered the call server calls the supervisor, and an
     * {@link ON_CALL_CREATED} event is raised.
     *
     * @param deviceId   the device phone number for which the call is made
     * @param autoAnswer automatic answer on make call
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makeSupervisorCall(
        deviceId: string,
        autoAnswer: boolean = true,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.makeSupervisorCall(deviceId, autoAnswer, loginName);
    }

    /**
     * Initiates an enquiry call from a CCD agent to a pilot or a RSI point.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The CCD pilot or the RSI point performs a call distribution to select an agent
     * that will be alerted by this call. The `callProfile` is mandatory in case of
     * "Advanced Call Routing" call distribution strategy.
     *
     * @param deviceId       the device phone number for which the call is made
     * @param pilot          the called CCD pilot or RSI point number
     * @param correlatorData correlator data to add to the call
     * @param callProfile    the call profile associated to this call
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makePilotOrRSISupervisedTransferCall(
        deviceId: string,
        pilot: string,
        correlatorData: CorrelatorData | null = null,
        callProfile: CallProfile | null = null,
        loginName: string | null = null
    ): Promise<boolean | null> {
        return await this.#telephonyRest.makePilotOrRSISupervisedTransferCall(
            deviceId,
            pilot,
            correlatorData,
            callProfile,
            loginName
        );
    }

    /**
     * Initiates a local call to a CCD pilot or a RSI point.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * The CCD pilot or the RSI point performs a call distribution to select an agent
     * that will be alerted by this call. The `callProfile` is mandatory in case of
     * "Advanced Call Routing" call distribution strategy.
     *
     * @param deviceId       the device phone number for which the call is made
     * @param pilot          the called CCD pilot or RSI point number
     * @param autoAnswer     automatic answer on make call
     * @param correlatorData correlator data to add to the call
     * @param callProfile    the call profile associated to this call
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async makePilotOrRSICall(
        deviceId: string,
        pilot: string,
        autoAnswer: boolean = true,
        correlatorData: CorrelatorData | null = null,
        callProfile: CallProfile | null = null,
        loginName: string | null = null
    ): Promise<boolean | null> {
        return null;
    }

    /**
     * Hangs up an active call; all parties are released.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference to hang up
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async release(callRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.release(callRef, loginName);
    }

    /**
     * Puts an active call on hold and retrieves a call that has been previously put
     * on hold.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     *
     * @param callRef  the call reference of the call on hold
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async alternate(callRef: string, deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.alternate(callRef, deviceId);
    }

    /**
     * Answers an incoming ringing call specified by its reference.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     * <p>
     * Answering a call will fail if the call state is not correct. The state can be
     * checked by listening to the telephony events, and more specifically by
     * checking the capabilities of the involved leg (answer capability on the leg).
     *
     * @param callRef  the call reference of the ringing call
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async answer(callRef: string, deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.answer(callRef, deviceId);
    }

    /**
     * Attaches the specified correlator data to the specified call.
     * <p>
     * This is used by the application to provide application-related information
     * (limited to 32 bytes). In general, it is used to give information concerning
     * a previously established call to the party of a second call.
     *
     * @param callRef        the call reference
     * @param deviceId       the device phone number for which the operation is done
     * @param correlatorData the correlator data to attach
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async attachData(callRef: string, deviceId: string, correlatorData: CorrelatorData): Promise<boolean> {
        return await this.#telephonyRest.attachData(callRef, deviceId, correlatorData);
    }

    /**
     * Transfers the active call to another user, without keeping control of the call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the reference of the active call
     * @param transferTo the phone number to which the call is transferred
     * @param anonymous  if `true`, the call will be transferred anonymously
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async blindTransfer(
        callRef: string,
        transferTo: string,
        anonymous: boolean = false,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.blindTransfer(callRef, transferTo, anonymous, loginName);
    }

    /**
     * Requests a callback on the call specified by the call reference for the
     * specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async callback(callRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.callback(callRef, loginName);
    }

    /**
     * Returns the legs involved in the call specified by the call reference for the
     * specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Leg} objects on success; `null` otherwise.
     */
    async getLegs(callRef: string, loginName: string | null = null): Promise<Leg[] | null> {
        return await this.#telephonyRest.getLegs(callRef, loginName);
    }

    /**
     * Returns the leg specified by its id, involved in the call specified by the
     * call reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param legId     the leg identifier
     * @param loginName the login name
     * @returns the {@link Leg} on success; `null` otherwise.
     */
    async getLeg(callRef: string, legId: string, loginName: string | null = null): Promise<Leg | null> {
        return await this.#telephonyRest.getLeg(callRef, legId, loginName);
    }

    /**
     * Exits from the call specified by its reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     *
     * @param callRef   the call reference
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async dropme(callRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.dropme(callRef, loginName);
    }

    /**
     * Puts on hold the call specified by its reference, on the specified device,
     * for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param deviceId  the device phone number from which the call is put on hold
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async hold(callRef: string, deviceId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.hold(callRef, deviceId, loginName);
    }

    /**
     * Makes a 3-party conference with a specified active call and a specified held
     * call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef     the active call reference
     * @param heldCallRef the held call reference
     * @param loginName   the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async merge(callRef: string, heldCallRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.merge(callRef, heldCallRef, loginName);
    }

    /**
     * Redirects an outgoing ringing call specified by its reference to the voice
     * mail of the called user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the ringing call reference
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async overflowToVoiceMail(callRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.overflowToVoiceMail(callRef, loginName);
    }

    /**
     * Gets the telephonic state and capabilities for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link TelephonicState} on success; `null` otherwise.
     */
    async getState(loginName: string | null = null): Promise<TelephonicState | null> {
        return await this.#telephonyRest.getState(loginName);
    }

    /**
     * Parks the specified active call to a target device.
     * <p>
     * If the device is not provided, the call will be parked on the current device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the active call reference
     * @param parkTo    the target device, or `null` to park on the current device
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async park(callRef: string, parkTo: string | null = null, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.park(callRef, parkTo, loginName);
    }

    /**
     * Returns the list of participants in the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Participant} objects on success; `null` otherwise.
     */
    async getParticipants(callRef: string, loginName: string | null = null): Promise<Participant[] | null> {
        return await this.#telephonyRest.getParticipants(callRef, loginName);
    }

    /**
     * Returns the specified participant in the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef       the call reference
     * @param participantId the participant identifier
     * @param loginName     the login name
     * @returns the {@link Participant} on success; `null` otherwise.
     */
    async getParticipant(
        callRef: string,
        participantId: string,
        loginName: string | null = null
    ): Promise<Participant | null> {
        return await this.#telephonyRest.getParticipant(callRef, participantId, loginName);
    }

    /**
     * Drops the specified participant from the specified call for the specified user.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the participant.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef       the call reference
     * @param participantId the participant identifier
     * @param loginName     the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async dropParticipant(callRef: string, participantId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.dropParticipant(callRef, participantId, loginName);
    }

    /**
     * Releases the current call (active or ringing) to retrieve a previously put on
     * hold call, cancelling a consultation call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef        the held call reference
     * @param deviceId       the device phone number for which the operation is done
     * @param enquiryCallRef the reference of the enquiry call to cancel
     * @param loginName      the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async reconnect(
        callRef: string,
        deviceId: string,
        enquiryCallRef: string,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.reconnect(callRef, deviceId, enquiryCallRef, loginName);
    }

    /**
     * Starts, stops, pauses or resumes the recording of the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the reference of the call to record
     * @param action    the recording action
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async doRecordAction(callRef: string, action: RecordingAction, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.doRecordAction(callRef, action, loginName);
    }

    /**
     * Redirects an incoming ringing call to another user or number, instead of
     * responding to it.
     * <p>
     * If `redirectTo` is equal to `"VOICEMAIL"`, the incoming ringing call is
     * redirected to the user's voice mail.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the incoming ringing call reference
     * @param redirectTo the phone number of the redirection, or `"VOICEMAIL"`
     * @param anonymous  if `true`, the call will be redirected anonymously
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async redirect(
        callRef: string,
        redirectTo: string,
        anonymous: boolean = false,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#telephonyRest.redirect(callRef, redirectTo, anonymous, loginName);
    }

    /**
     * Retrieves a call that has been previously put on hold.
     * <p>
     * This method will return `false` if it is invoked from a session opened
     * by an administrator.
     *
     * @param callRef  the held call reference
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async retrieve(callRef: string, deviceId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.retrieve(callRef, deviceId, loginName);
    }

    /**
     * Sends DTMF codes on the specified active call.
     *
     * @param callRef  the active call reference
     * @param deviceId the device phone number for which the operation is done
     * @param number   the DTMF codes to send
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async sendDtmf(callRef: string, deviceId: string, number: string): Promise<boolean> {
        return await this.#telephonyRest.sendDtmf(callRef, deviceId, number);
    }

    /**
     * Sends the account info for the specified call, on the specified device.
     * <p>
     * This operation is used by a CCD agent to send the transaction code at the end
     * of the call. The string value must comply with the transaction code accepted
     * by OXE (numerical values only).
     *
     * @param callRef     the call reference
     * @param deviceId    the device phone number for which the operation is done
     * @param accountInfo the transaction code
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async sendAccountInfo(callRef: string, deviceId: string, accountInfo: string): Promise<boolean> {
        return await this.#telephonyRest.sendAccountInfo(callRef, deviceId, accountInfo);
    }

    /**
     * Transfers a specified active call to a specified held call for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef     the active call reference
     * @param heldCallRef the held call reference
     * @param loginName   the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async transfer(callRef: string, heldCallRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.transfer(callRef, heldCallRef, loginName);
    }

    /**
     * Logs the specified user on a specified desk sharing set.
     * <p>
     * The user must be configured as a desk sharing user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param dssDeviceNumber the desk sharing set phone number
     * @param loginName       the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deskSharingLogOff
     */
    async deskSharingLogOn(dssDeviceNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deskSharingLogOn(dssDeviceNumber, loginName);
    }

    /**
     * Logs off the specified user from the desk sharing set.
     * <p>
     * The user must be configured as a desk sharing user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deskSharingLogOn
     */
    async deskSharingLogOff(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deskSharingLogOff(loginName);
    }

    /**
     * Gets the states of all devices of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of {@link DeviceState} objects on success; `null` otherwise.
     */
    async getDevicesState(loginName: string | null = null): Promise<DeviceState[] | null> {
        return await this.#telephonyRest.getDevicesState(loginName);
    }

    /**
     * Gets the state of the specified device of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId  the device phone number for which the operation is done
     * @param loginName the login name
     * @returns the {@link DeviceState} on success; `null` otherwise.
     */
    async getDeviceState(deviceId: string, loginName: string | null = null): Promise<DeviceState | null> {
        return await this.#telephonyRest.getDeviceState(deviceId, loginName);
    }

    /**
     * Picks up the specified incoming call for another user.
     *
     * @param deviceId         the device phone number for which the operation is done
     * @param otherCallRef     the reference of the call to pick up (on the remote user)
     * @param otherPhoneNumber the phone number on which the call is ringing
     * @param autoAnswer       if `true`, automatically answers the call after the pickup
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async pickUp(
        deviceId: string,
        otherCallRef: string,
        otherPhoneNumber: string,
        autoAnswer: boolean = false
    ): Promise<boolean> {
        return await this.#telephonyRest.pickUp(deviceId, otherCallRef, otherPhoneNumber, autoAnswer);
    }

    /**
     * Performs an intrusion in the active call of a called user.
     * <p>
     * No parameter is required to invoke the intrusion: it only depends on the
     * current intrusion capability of the current device. It is based on the fact
     * that the current device must be in releasing state while calling a user which
     * is in a busy call with another user, the current device has the intrusion
     * capability, and the 2 users engaged in the call have the capability to allow
     * intrusion.
     *
     * @param deviceId the device from which the intrusion is requested
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @since O2G 2.4
     */
    async intrusion(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.intrusion(deviceId);
    }

    /**
     * Unparks a call from a target device.
     *
     * @param deviceId    the device from which the unpark request is made
     * @param heldCallRef the reference of the held call to unpark
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async unPark(deviceId: string, heldCallRef: string): Promise<boolean> {
        return await this.#telephonyRest.unPark(deviceId, heldCallRef);
    }

    /**
     * Retrieves the hunting group status of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroupStatus} on success; `null` otherwise.
     */
    async getHuntingGroupStatus(loginName: string | null = null): Promise<HuntingGroupStatus | null> {
        return await this.#telephonyRest.getHuntingGroupStatus(loginName);
    }

    /**
     * Logs on the specified user in their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see huntingGroupLogOff
     */
    async huntingGroupLogOn(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.huntingGroupLogOn(loginName);
    }

    /**
     * Logs off the specified user from their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see huntingGroupLogOn
     */
    async huntingGroupLogOff(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.huntingGroupLogOff(loginName);
    }

    /**
     * Sets the specified user as a member of a hunting group.
     * <p>
     * The request will fail if the hunting group does not exist. If the user
     * already belongs to the group, nothing is done and `true` is returned.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param hgNumber  the hunting group number
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see removeMeFromHuntingGroup
     */
    async addMeToHuntingGroup(hgNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.addMeToHuntingGroup(hgNumber, loginName);
    }

    /**
     * Removes the specified user from a hunting group.
     * <p>
     * The request will fail if the hunting group does not exist. If the user does
     * not belong to the group, nothing is done and `true` is returned.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param hgNumber  the hunting group number
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see addMeToHuntingGroup
     */
    async removeMeFromHuntingGroup(hgNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.removeMeFromHuntingGroup(hgNumber, loginName);
    }

    /**
     * Gets the list of hunting groups on the OXE node the specified user belongs to.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroups} on success; `null` otherwise.
     */
    async queryHuntingGroups(loginName: string | null = null): Promise<HuntingGroups | null> {
        return await this.#telephonyRest.queryHuntingGroups(loginName);
    }

    /**
     * Returns the list of callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of {@link Callback} objects on success; `null` otherwise.
     */
    async getCallbacks(loginName: string | null = null): Promise<Callback[] | null> {
        return await this.#telephonyRest.getCallbacks(loginName);
    }

    /**
     * Deletes all callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async deleteCallbacks(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deleteCallbacks(loginName);
    }

    /**
     * Deletes the specified callback request for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callbackId the callback identifier
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async deleteCallback(callbackId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deleteCallback(callbackId, loginName);
    }

    /**
     * Returns the current new mini message for the specified user.
     * <p>
     * As soon as a message is read, it is erased from OXE and cannot be read again.
     * Messages are retrieved in Last In First Out order.
     * <p>
     * This method will return `null` if all messages have been retrieved.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link MiniMessage} on success; `null` otherwise.
     */
    async getMiniMessage(loginName: string | null = null): Promise<MiniMessage | null> {
        return await this.#telephonyRest.getMiniMessage(loginName);
    }

    /**
     * Sends the specified mini message to the specified recipient.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recipient the phone number of the mini message recipient
     * @param message   the mini message text
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async sendMiniMessage(recipient: string, message: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.sendMiniMessage(recipient, message, loginName);
    }

    /**
     * Requests a callback from an idle device of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callee    the phone number of the called party for which a callback is requested
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async requestCallback(callee: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.requestCallback(callee, loginName);
    }

    /**
     * Asks a snapshot event on the specified user.
     * <p>
     * The {@link ON_TELEPHONY_STATE} event will contain the {@link TelephonicState}
     * (calls and device capabilities). If a second request is asked while the
     * previous one is still in progress, it has no effect.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the request was successfully submitted; `false` otherwise.
     */
    async requestSnapshot(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.requestSnapshot(loginName);
    }

    /**
     * Toggles the microphone or interphony state on the specified device.
     * <p>
     * This action acts as a flip/flop and has the same effect as pressing the key:
     * <ul>
     * <li>activates or deactivates the microphone if the device has an outgoing or established call</li>
     * <li>activates or deactivates the interphony if the device is idle</li>
     * <li>has no effect if the device is ringing on an incoming call</li>
     * </ul>
     * <p>
     * This operation is done in blind mode: no state event is provided on the push,
     * but when the device returns to idle after a call, the microphone comes back to
     * the active state.
     *
     * @param deviceId the device phone number for which the operation is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async toggleInterphony(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.toggleInterphony(deviceId);
    }

    /**
     * Query the specified CCD pilot information.
     * <p>
     * This method is used to get various information on the CCD pilot routing
     * capabilities.
     * <p>
     * This method will return `null` if it is invoked from a session opened
     * by an administrator.
     *
     * @param nodeId                  the PCX Enterprise node id
     * @param pilotNumber             the pilot number
     * @param pilotTransferQueryParam optional call profile context parameters
     * @param loginName               the login name
     * @returns the {@link PilotInfo} on success; `null` otherwise.
     * @since 2.7
     */
    async getPilotInfo(
        nodeId: number,
        pilotNumber: string,
        pilotTransferQueryParam: PilotTransferQueryParameters | null = null,
        loginName: string | null = null
    ): Promise<PilotInfo | null> {
        return await this.#telephonyRest.getPilotInfo(nodeId, pilotNumber, pilotTransferQueryParam, loginName);
    }
}
