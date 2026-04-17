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
import TelephonyRest from '../internal/rest/telephony-rest';
import { RecordingAction } from '../types/telephony/RecordingAction';
import { EventRegistry } from '../events/event-dispatcher';
import { CorrelatorData } from '../types/telephony/call/correlator-data';
import {
    OnCallCreated,
    OnCallModified,
    OnCallRemoved,
    OnDeviceStateModified,
    OnDynamicStateChanged,
    OnTelephonyState,
    OnUserStateModified,
} from '../types/telephony/telephony-events';
import { Call } from '../types/telephony/call';
import { HuntingGroupStatus } from '../types/telephony/hunting-group-status';
import { HuntingGroups } from '../types/telephony/hunting-groups';
import { MiniMessage } from '../types/telephony/mini-message';
import { TelephonicState } from '../types/telephony/telephonic-state';
import { Callback } from '../types/telephony/callback';
import { PilotInfo } from '../types/telephony/call/ccd/pilot-info';
import { Leg } from '../types/telephony/call/leg';
import { Participant } from '../types/telephony/call/participant';
import { DeviceState } from '../types/telephony/device/device-state';
import { PilotTransferQueryParameters } from '../types/telephony/call/ccd/pilot-transfer-query-param';
import { CallProfile } from '../types/telephony/call/ccd/call-profile';

/**
 * The TelephonyService allows a user to initiate calls and activate
 * any kind of OmniPCX Enterprise telephony services.
 * <p>
 * Using this service requires a <b>TELEPHONY_ADVANCED</b> license, except for
 * the three basic services {@link basicMakeCall}, {@link basicAnswerCall} and
 * {@link basicDropMe}, which are available without any license.
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
     * Initiates a basic call from the specified device to the specified called number.
     * <p>
     * This method does not require a license.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     * <p>
     * If `autoAnswer` is set to `false`, the user's device is called first before
     * placing the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number used to place the call
     * @param callee     the called phone number
     * @param autoAnswer if `true`, the callee is called immediately; if `false`,
     *                   the user's device is called first before placing the call to the callee
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicMakeCall(deviceId: string, callee: string, autoAnswer = true): Promise<boolean> {
        return await this.#telephonyRest.basicMakeCall(deviceId, callee, autoAnswer);
    }

    /**
     * Answers an incoming ringing call on the specified device.
     * <p>
     * This method does not require a license.
     * <p>
     * If the session is opened by a user, the device phone number must be one of
     * the user's devices.
     *
     * @param deviceId the device phone number on which to answer
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicAnswerCall(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.basicAnswerCall(deviceId);
    }

    /**
     * Exits from the current call for the specified user.
     * <p>
     * This method does not require a license.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async basicDropMe(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.basicDropMe(loginName);
    }

    /**
     * Retrieves the calls currently in progress for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of active {@link Call} objects on success; `null` otherwise.
     * @see getCall
     */
    async getCalls(loginName: string | null = null): Promise<Call[] | null> {
        return await this.#telephonyRest.getCalls(loginName);
    }

    /**
     * Returns the call identified by the specified reference for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the unique call reference
     * @param loginName the login name
     * @returns the {@link Call} on success; `null` if not found.
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
     * If `autoAnswer` is set to `false`, the user's device is called first before
     * placing the call to the callee; otherwise the callee is called immediately.
     *
     * @param deviceId   the device phone number from which the call is placed; if the
     *                   session is opened by a user, this must be one of the user's devices
     * @param callee     the called phone number
     * @param autoAnswer if `true`, the callee is called immediately; if `false`,
     *                   the user's device is called first before placing the call to the callee
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
     * Initiates a call from the specified device to the specified called number,
     * with extended options.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * If `autoAnswer` is set to `false`, the user's device is called first before
     * placing the call to the callee; otherwise the callee is called immediately.
     * <p>
     * The `callingNumber` can be used to present a different calling number on the
     * public network in order to mask the real calling extension number.
     *
     * @param deviceId            the device phone number from which the call is placed; if the
     *                            session is opened by a user, this must be one of the user's devices
     * @param callee              the called phone number
     * @param autoAnswer          if `true`, the callee is called immediately; if `false`,
     *                            the user's device is called first before placing the call to the callee
     * @param inhibitProgressTone `true` to inhibit the progress tone on the outbound call
     * @param correlatorData      correlator data to attach to the call
     * @param callingNumber       optional calling number to present to the public network, used to mask
     *                            the real calling extension number
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
     * Initiates a private call to the specified callee, identified by a PIN code.
     * <p>
     * A private call allows the user to flag a call as personal rather than
     * professional, enabling specific charging processing.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId   the device phone number from which the call is placed; if the
     *                   session is opened by a user, this must be one of the user's devices
     * @param callee     the called phone number
     * @param pin        the PIN code identifying the caller
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
     * Initiates a business call to the specified callee, charged to the specified
     * cost center.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId     the device phone number from which the call is placed; if the
     *                     session is opened by a user, this must be one of the user's devices
     * @param callee       the called phone number
     * @param businessCode the cost center code to charge the call to
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
     * Initiates a call from a CCD agent to their supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId   the device phone number from which the call is placed; if the
     *                   session is opened by a user, this must be one of the user's devices
     * @param autoAnswer if `true`, the supervisor is called immediately; if `false`,
     *                   the agent's device is called first
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
     * Initiates a supervised transfer enquiry call from a CCD agent to a pilot or
     * a RSI point.
     * <p>
     * The CCD pilot or the RSI point performs call distribution to select an agent
     * that will be alerted. The `callProfile` is mandatory when the
     * <em>Advanced Call Routing</em> distribution strategy is configured.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId       the device phone number from which the call is placed; if the
     *                       session is opened by a user, this must be one of the user's devices
     * @param pilot          the CCD pilot or RSI point number to call
     * @param correlatorData optional correlator data to attach to the call
     * @param callProfile    the call profile associated to this call; mandatory when the
     *                       <em>Advanced Call Routing</em> distribution strategy is in use
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
     * The CCD pilot or the RSI point performs call distribution to select an agent
     * that will be alerted. The `callProfile` is mandatory when the
     * <em>Advanced Call Routing</em> distribution strategy is configured.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId       the device phone number from which the call is placed; if the
     *                       session is opened by a user, this must be one of the user's devices
     * @param pilot          the CCD pilot or RSI point number to call
     * @param autoAnswer     if `true`, the pilot is called immediately; if `false`,
     *                       the user's device is called first
     * @param correlatorData optional correlator data to attach to the call
     * @param callProfile    the call profile associated to this call; mandatory when the
     *                       <em>Advanced Call Routing</em> distribution strategy is in use
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
     * Releases the specified call; all parties are disconnected.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see dropme
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
     * @param callRef  the call reference of the active call
     * @param deviceId the device phone number for which the operation is performed
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
     * @param deviceId the device phone number for which the operation is performed
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async answer(callRef: string, deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.answer(callRef, deviceId);
    }

    /**
     * Attaches the specified correlator data to the specified call.
     * <p>
     * This is used by the application to provide application-related information
     * (limited to 32 bytes). In general, it is used to convey context from a
     * previously established call to the party of a second call.
     *
     * @param callRef        the call reference
     * @param deviceId       the device phone number for which the operation is performed;
     *                       if the session is opened by a user, this must be one of the user's devices
     * @param correlatorData the correlator data to attach
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async attachData(callRef: string, deviceId: string, correlatorData: CorrelatorData): Promise<boolean> {
        return await this.#telephonyRest.attachData(callRef, deviceId, correlatorData);
    }

    /**
     * Transfers the active call to another party without keeping control of the call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the reference of the active call
     * @param transferTo the phone number to transfer the call to
     * @param anonymous  if `true`, the call is transferred anonymously
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
     * Requests a callback on the specified call.
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
     * Returns the legs associated to the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Leg} objects on success; `null` otherwise.
     * @see getLeg
     */
    async getLegs(callRef: string, loginName: string | null = null): Promise<Leg[] | null> {
        return await this.#telephonyRest.getLegs(callRef, loginName);
    }

    /**
     * Returns the specified leg of the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param legId     the leg identifier
     * @param loginName the login name
     * @returns the {@link Leg} with the given identifier on success; `null` if not found.
     * @see getLegs
     */
    async getLeg(callRef: string, legId: string, loginName: string | null = null): Promise<Leg | null> {
        return await this.#telephonyRest.getLeg(callRef, legId, loginName);
    }

    /**
     * Exits from the specified call for the specified user.
     * <p>
     * If the call is a single call, it is released; if it is a conference, the call
     * carries on without the user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name for whom the drop is done
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async dropme(callRef: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.dropme(callRef, loginName);
    }

    /**
     * Puts the specified call on hold on the specified device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param deviceId  the device phone number from which the hold is requested; if the
     *                  session is opened by a user, this must be one of the user's devices
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see retrieve
     */
    async hold(callRef: string, deviceId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.hold(callRef, deviceId, loginName);
    }

    /**
     * Creates a 3-party conference from the specified active call and a held call.
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
     * Redirects an outgoing ringing call to the voice mail of the called user.
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
     * Returns a snapshot of the current telephonic state for the specified user.
     * <p>
     * This method performs a synchronous REST query. For an event-driven approach,
     * use {@link requestSnapshot} instead, which raises an {@link ON_TELEPHONY_STATE}
     * event asynchronously.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link TelephonicState} on success; `null` otherwise.
     * @see requestSnapshot
     */
    async getState(loginName: string | null = null): Promise<TelephonicState | null> {
        return await this.#telephonyRest.getState(loginName);
    }

    /**
     * Parks the specified active call on a target device.
     * <p>
     * If `parkTo` is not provided, the call is parked on the current device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the active call reference
     * @param parkTo    the target device extension number, or `null` to park on the
     *                  current device
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unPark
     */
    async park(callRef: string, parkTo: string | null = null, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.park(callRef, parkTo, loginName);
    }

    /**
     * Returns the participants of the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the call reference
     * @param loginName the login name
     * @returns the list of {@link Participant} objects on success; `null` otherwise.
     * @see getParticipant
     */
    async getParticipants(callRef: string, loginName: string | null = null): Promise<Participant[] | null> {
        return await this.#telephonyRest.getParticipants(callRef, loginName);
    }

    /**
     * Returns the specified participant of the specified call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef       the call reference
     * @param participantId the participant identifier
     * @param loginName     the login name
     * @returns the {@link Participant} with the given identifier on success; `null` if not found.
     * @see getParticipants
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
     * Releases the current call to retrieve a previously held call (cancels a consultation call).
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef        the held call reference
     * @param deviceId       the device phone number for which the operation is performed; if the
     *                       session is opened by a user, this must be one of the user's devices
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
     * Starts, stops, pauses, or resumes the recording of the specified call.
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
     * Redirects an incoming ringing call to another number or to voice mail.
     * <p>
     * If `redirectTo` is equal to `"VOICEMAIL"`, the incoming ringing call is
     * redirected to the user's voice mail.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef    the incoming ringing call reference
     * @param redirectTo the phone number of the redirection, or `"VOICEMAIL"` to redirect
     *                   to the user's voice mail
     * @param anonymous  if `true`, the redirect is anonymous and the caller identity is hidden
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
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callRef   the held call reference
     * @param deviceId  the device phone number for which the operation is performed; if the
     *                  session is opened by a user, this must be one of the user's devices
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see hold
     */
    async retrieve(callRef: string, deviceId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.retrieve(callRef, deviceId, loginName);
    }

    /**
     * Sends DTMF codes on the specified active call.
     *
     * @param callRef  the active call reference
     * @param deviceId the device phone number for which the operation is performed; if the
     *                 session is opened by a user, this must be one of the user's devices
     * @param number   the DTMF codes to send
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async sendDtmf(callRef: string, deviceId: string, number: string): Promise<boolean> {
        return await this.#telephonyRest.sendDtmf(callRef, deviceId, number);
    }

    /**
     * Sends the transaction code for the specified call on the specified device.
     * <p>
     * Used by a CCD agent to send the transaction code at the end of a call.
     * The value must comply with the OmniPCX Enterprise transaction code format
     * (numeric values only).
     *
     * @param callRef     the call reference
     * @param deviceId    the device phone number for which the operation is done
     * @param accountInfo the transaction code (numeric values only)
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async sendAccountInfo(callRef: string, deviceId: string, accountInfo: string): Promise<boolean> {
        return await this.#telephonyRest.sendAccountInfo(callRef, deviceId, accountInfo);
    }

    /**
     * Transfers the specified active call to the specified held call.
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
     * Logs the specified user onto a desk sharing set.
     * <p>
     * The user must be configured as a desk sharing user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param dssDeviceNumber the desk sharing set phone number to log on to
     * @param loginName       the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deskSharingLogOff
     */
    async deskSharingLogOn(dssDeviceNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deskSharingLogOn(dssDeviceNumber, loginName);
    }

    /**
     * Logs the specified user off from their desk sharing set.
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
     * Returns the operational state of all devices belonging to the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of {@link DeviceState} objects on success; `null` otherwise.
     * @see getDeviceState
     */
    async getDevicesState(loginName: string | null = null): Promise<DeviceState[] | null> {
        return await this.#telephonyRest.getDevicesState(loginName);
    }

    /**
     * Returns the operational state of the specified device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param deviceId  the device phone number
     * @param loginName the login name
     * @returns the {@link DeviceState} for the requested device on success; `null` on error
     *          or if the device does not belong to the user.
     * @see getDevicesState
     */
    async getDeviceState(deviceId: string, loginName: string | null = null): Promise<DeviceState | null> {
        return await this.#telephonyRest.getDeviceState(deviceId, loginName);
    }

    /**
     * Picks up an incoming call ringing on another user's device.
     *
     * @param deviceId         the device phone number from which the pickup is performed;
     *                         if the session is opened by a user, this must be one of the user's devices
     * @param otherCallRef     the reference of the call to pick up on the remote user
     * @param otherPhoneNumber the phone number on which the call is ringing
     * @param autoAnswer       if `true`, the call is automatically answered after pickup
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
     * Intrudes into the active call of a busy user.
     * <p>
     * Intrusion requires that the current device is in releasing state while calling
     * a user who is engaged in a call, and that both the current device and the
     * engaged users have the intrusion capability configured.
     * <p>
     * Available from O2G 2.4.
     *
     * @param deviceId the device phone number from which the intrusion is initiated
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @since O2G 2.4
     */
    async intrusion(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.intrusion(deviceId);
    }

    /**
     * Unparks a previously parked call onto the specified device.
     *
     * @param deviceId    the device from which the unpark is requested
     * @param heldCallRef the reference of the parked call
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see park
     */
    async unPark(deviceId: string, heldCallRef: string): Promise<boolean> {
        return await this.#telephonyRest.unPark(deviceId, heldCallRef);
    }

    /**
     * Returns the hunting group login status of the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroupStatus} indicating whether the user is logged into
     *          their hunting group on success; `null` otherwise.
     * @see huntingGroupLogOn
     * @see huntingGroupLogOff
     */
    async getHuntingGroupStatus(loginName: string | null = null): Promise<HuntingGroupStatus | null> {
        return await this.#telephonyRest.getHuntingGroupStatus(loginName);
    }

    /**
     * Logs the specified user into their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * Has no effect and returns `true` if the user is already logged in.
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
     * Logs the specified user off from their current hunting group.
     * <p>
     * The user must be configured as a member of a hunting group.
     * Has no effect and returns `true` if the user is already logged off.
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
     * Adds the specified user as a member of an existing hunting group.
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
     * Removes the specified user from an existing hunting group.
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
     * Returns the hunting groups available on the OmniPCX Enterprise node the
     * specified user belongs to.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link HuntingGroups} listing available hunting groups and the user's
     *          current membership on success; `null` otherwise.
     * @see getHuntingGroupStatus
     * @see addMeToHuntingGroup
     * @see removeMeFromHuntingGroup
     */
    async queryHuntingGroups(loginName: string | null = null): Promise<HuntingGroups | null> {
        return await this.#telephonyRest.queryHuntingGroups(loginName);
    }

    /**
     * Returns the pending callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the list of pending {@link Callback} objects on success; `null` otherwise.
     * @see deleteCallbacks
     * @see deleteCallback
     */
    async getCallbacks(loginName: string | null = null): Promise<Callback[] | null> {
        return await this.#telephonyRest.getCallbacks(loginName);
    }

    /**
     * Deletes all pending callback requests for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getCallbacks
     */
    async deleteCallbacks(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deleteCallbacks(loginName);
    }

    /**
     * Deletes the specified callback request.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callbackId the callback identifier as returned by {@link getCallbacks}
     * @param loginName  the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getCallbacks
     * @see deleteCallbacks
     */
    async deleteCallback(callbackId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.deleteCallback(callbackId, loginName);
    }

    /**
     * Returns the next unread mini message for the specified user.
     * <p>
     * Messages are consumed on read — once retrieved, a message is deleted from the
     * OXE and cannot be read again. Messages are returned in Last In First Out order.
     * Returns `null` when there are no more unread messages.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns the {@link MiniMessage} on success; `null` if there are no unread
     *          messages or on error.
     */
    async getMiniMessage(loginName: string | null = null): Promise<MiniMessage | null> {
        return await this.#telephonyRest.getMiniMessage(loginName);
    }

    /**
     * Sends a mini message to the specified recipient.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recipient the phone number of the message recipient
     * @param message   the message text
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getMiniMessage
     */
    async sendMiniMessage(recipient: string, message: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.sendMiniMessage(recipient, message, loginName);
    }

    /**
     * Requests a callback from an idle device.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param callee    the phone number of the party to request a callback from
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getCallbacks
     * @see deleteCallbacks
     */
    async requestCallback(callee: string, loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.requestCallback(callee, loginName);
    }

    /**
     * Requests a snapshot event to receive the current telephonic state via an
     * {@link ON_TELEPHONY_STATE} event.
     * <p>
     * The resulting event will contain the full {@link TelephonicState} including
     * active calls and device capabilities. If a second request is issued while the
     * first is still in progress, it has no effect.
     * <p>
     * If an administrator calls this with a `null` `loginName`, the snapshot is
     * requested for all users, which may take time depending on the number of users.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getState
     */
    async requestSnapshot(loginName: string | null = null): Promise<boolean> {
        return await this.#telephonyRest.requestSnapshot(loginName);
    }

    /**
     * Toggles interphony or hands-free mode on the specified device.
     * <ul>
     * <li>activates or deactivates the microphone if the device has an active call</li>
     * <li>activates or deactivates the interphony if the device is idle</li>
     * <li>has no effect if the device is ringing on an incoming call</li>
     * </ul>
     * <p>
     * This operation is done in blind mode: no state event is raised on the push,
     * but when the device returns to idle after a call, the microphone comes back
     * to the active state.
     *
     * @param deviceId the device phone number for which the operation is performed
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async toggleInterphony(deviceId: string): Promise<boolean> {
        return await this.#telephonyRest.toggleInterphony(deviceId);
    }

    /**
     * Returns transfer possibilities for the specified CCD pilot.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param nodeId                  the OmniPCX Enterprise node ID
     * @param pilotNumber             the CCD pilot directory number
     * @param pilotTransferQueryParam optional query criteria to filter results by agent number,
     *                                priority transfer, supervised transfer, or call profile
     * @param loginName               the login name
     * @returns the {@link PilotInfo} describing the pilot's queue state and transfer possibilities
     *          on success; `null` otherwise.
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
