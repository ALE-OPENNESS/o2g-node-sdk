/*
 * Copyright 2021 ALE International
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

import { RestService } from './rest-service';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { RecordingAction } from '../../types/telephony/RecordingAction';
import { CorrelatorData } from '../../types/telephony/call/correlator-data';
import { HexaString } from '../util/hexa-string';
import {
    CallbackJson,
    CallJson,
    DeviceStateJson,
    HuntingGroupsJson,
    HuntingGroupStatusJson,
    LegJson,
    MiniMessageJson,
    ParticipantJson,
    PilotInfoJson,
    TelephonicStateJson,
} from '../types/telephony/telephony-types';
import { TelephonicState } from '../../types/telephony/telephonic-state';
import { Call } from '../../types/telephony/call';
import { HuntingGroupStatus } from '../../types/telephony/hunting-group-status';
import { HuntingGroups } from '../../types/telephony/hunting-groups';
import { Callback } from '../../types/telephony/callback';
import { MiniMessage } from '../../types/telephony/mini-message';
import { PilotInfo } from '../../types/telephony/call/ccd/pilot-info';
import { Leg } from '../../types/telephony/call/leg';
import { Participant } from '../../types/telephony/call/participant';
import { DeviceState } from '../../types/telephony/device/device-state';
import { IHttpClient } from '../util/IHttpClient';
import { HttpContent } from '../util/http-content';
import { PilotTransferQueryParameters } from '../../types/telephony/call/ccd/pilot-transfer-query-param';
import { CallProfile } from '../../types/telephony/call/ccd/call-profile';
import { Logger } from '../util/logger';

/** @internal */
type CallListJson = {
    calls: CallJson[];
};

/** @internal */
type LegListJson = {
    legs: LegJson[];
};

/** @internal */
type ParticipantListJson = {
    participants: ParticipantJson[];
};

/** @internal */
type DeviceStateListJson = {
    deviceStates: DeviceStateJson[];
};

/** @internal */
type CallbackListJson = {
    callbacks: CallbackJson[];
};

/** @internal */
export default class TelephonyRest extends RestService {
    #logger = Logger.create('TelephonyRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async basicMakeCall(deviceId: string, callee: string, autoAnswer: boolean): Promise<boolean> {
        this.#logger.info(`basicMakeCall deviceId={}, callee={}, autoAnswer={}`, deviceId, callee, autoAnswer);

        const json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            callee: AssertUtil.notNullOrEmpty(callee, 'callee'),
            autoAnswer: autoAnswer,
        });

        const httpResponse = await this._httpClient.post(
            UtilUri.appendPath(this._uri, 'basicCall'),
            new HttpContent(json)
        );
        return httpResponse.isSuccessStatusCode();
    }

    async basicAnswerCall(deviceId: string): Promise<boolean> {
        this.#logger.info(`basicAnswerCall deviceId={}`, deviceId);

        const json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
        });

        let httpResponse = await this._httpClient.post(
            UtilUri.appendPath(this._uri, 'basicCall/answer'),
            new HttpContent(json)
        );
        return httpResponse.isSuccessStatusCode();
    }

    async basicDropMe(loginName: string | null): Promise<boolean> {
        this.#logger.info(`basicDropMe loginName={}`, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'basicCall/dropme');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async getState(loginName: string | null): Promise<TelephonicState | null> {
        this.#logger.info(`getState loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'state');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<TelephonicStateJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getState result={}`, _json);

        if (!_json) return null;
        return TelephonicState.fromJson(_json);
    }

    async getCalls(loginName: string | null): Promise<Call[] | null> {
        this.#logger.info(`getCalls loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<CallListJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getCalls result={}`, _json);

        if (_json && Array.isArray(_json.calls)) {
            return _json.calls.map(Call.fromJson);
        } 
        else {
            return null;
        }
    }

    async getCall(callRef: string, loginName: string | null): Promise<Call | null> {
        this.#logger.info(`getCall callRef={}, loginName={}`, callRef, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'));
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<CallJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getCall result={}`, _json);

        return _json ? Call.fromJson(_json) : null;
    }

    async makeCall(deviceId: string, callee: string, autoAnswer: boolean, loginName: string | null): Promise<boolean> {
        this.#logger.info(`makeCall deviceId={}, callee={}, autoAnswer={}, loginName={}`, deviceId, callee, autoAnswer, loginName);

        return this.makeCallEx(deviceId, callee, autoAnswer, false, null, null, loginName);
    }

    async makeCallEx(
        deviceId: string,
        callee: string,
        autoAnswer: boolean = true,
        inhibitProgressTone: boolean = false,
        correlatorData: CorrelatorData | null = null,
        callingNumber: string | null = null,
        loginName: string | null = null
    ): Promise<boolean> {
        this.#logger.info(`makeCallEx deviceId={}, callee={}, autoAnswer={}, inhibitProgressTone={}, loginName={}`, deviceId, callee, autoAnswer, inhibitProgressTone, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.deviceId = AssertUtil.notNullOrEmpty(deviceId, 'deviceId');
        req.callee = AssertUtil.notNullOrEmpty(callee, 'callee');
        req.autoAnswer = autoAnswer;
        if (inhibitProgressTone) {
            req.inhibitProgressTone = inhibitProgressTone;
        }

        if (correlatorData) {
            req.hexaBinaryAssociatedData = HexaString.toHexaString(correlatorData.asByteArray());
        }

        if (callingNumber) {
            req.callingNumber = callingNumber;
        }
        let _json = JSON.stringify(req);
        this.#logger.debug(`makeCallEx request={}`, _json);

        let httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async makePrivateCall(
        deviceId: string,
        callee: string,
        pin: string,
        secretCode: string | null,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`makePrivateCall deviceId={}, callee={}, loginName={}`, deviceId, callee, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.deviceId = AssertUtil.notNullOrEmpty(deviceId, 'deviceId');
        req.callee = AssertUtil.notNullOrEmpty(callee, 'callee');
        req.pin = AssertUtil.notNullOrEmpty(pin, 'pin');
        if (secretCode) {
            req.secretCode = secretCode;
        }
        const _json = JSON.stringify(req);
        this.#logger.debug(`makePrivateCall request={}`, _json);

        let httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async makeBusinessCall(
        deviceId: string,
        callee: string,
        businessCode: string,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`makeBusinessCall deviceId={}, callee={}, businessCode={}, loginName={}`, deviceId, callee, businessCode, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            callee: AssertUtil.notNullOrEmpty(callee, 'callee'),
            businessCode: AssertUtil.notNullOrEmpty(businessCode, 'businessCode'),
        });
        this.#logger.debug(`makeBusinessCall request={}`, _json);

        let httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async makeSupervisorCall(deviceId: string, autoAnswer: boolean, loginName: string | null): Promise<boolean> {
        this.#logger.info(`makeSupervisorCall deviceId={}, autoAnswer={}, loginName={}`, deviceId, autoAnswer, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            autoAnswer: autoAnswer,
            acdCall: {
                callToSupervisor: true,
            },
        });
        this.#logger.debug(`makeSupervisorCall request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async makePilotOrRSISupervisedTransferCall(
        deviceId: string,
        pilot: string,
        correlatorData: CorrelatorData | null,
        callProfile: CallProfile | null,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`makePilotOrRSISupervisedTransferCall deviceId={}, pilot={}, loginName={}`, deviceId, pilot, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.deviceId = AssertUtil.notNullOrEmpty(deviceId, 'deviceId');
        req.callee = AssertUtil.notNullOrEmpty(pilot, 'pilot');
        if (correlatorData) {
            req.hexaBinaryAssociatedData = HexaString.toHexaString(correlatorData.asByteArray());
        }

        req.acdCall = new Object();
        req.acdCall.supervisedTransfer = true;

        if (callProfile) {
            req.acdCall.skills = callProfile.toJson();
        }

        const _json = JSON.stringify(req);
        this.#logger.debug(`makePilotOrRSISupervisedTransferCall request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async makePilotOrRSICall(
        deviceId: string,
        pilot: string,
        autoAnswer: boolean,
        correlatorData: CorrelatorData,
        callProfile: CallProfile,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`makePilotOrRSICall deviceId={}, pilot={}, autoAnswer={}, loginName={}`, deviceId, pilot, autoAnswer, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.deviceId = AssertUtil.notNullOrEmpty(deviceId, 'deviceId');
        req.callee = AssertUtil.notNullOrEmpty(pilot, 'pilot');
        req.autoAnswer = autoAnswer;
        if (correlatorData) {
            req.hexaBinaryAssociatedData = HexaString.toHexaString(correlatorData.asByteArray());
        }

        if (callProfile) {
            req.acdCall = new Object();
            req.acdCall.skills = callProfile.toJson();
        }

        const _json = JSON.stringify(req);
        this.#logger.debug(`makePilotOrRSICall request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async release(callRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`release callRef={}, loginName={}`, callRef, loginName);

        let uriDelete = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'));
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async alternate(callRef: string, deviceId: string): Promise<boolean> {
        this.#logger.info(`alternate callRef={}, deviceId={}`, callRef, deviceId);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'alternate'
        );

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
        });
        this.#logger.debug(`alternate request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async answer(callRef: string, deviceId: string): Promise<boolean> {
        this.#logger.info(`answer callRef={}, deviceId={}`, callRef, deviceId);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'answer');

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
        });
        this.#logger.debug(`answer request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async attachData(callRef: string, deviceId: string, correlatorData: CorrelatorData): Promise<boolean> {
        this.#logger.info(`attachData callRef={}, deviceId={}`, callRef, deviceId);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'attachdata'
        );

        const byteValue: Uint8Array = AssertUtil.notNull(correlatorData, 'correlatorData').asByteArray();

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            hexaBinaryAssociatedData: HexaString.toHexaString(byteValue),
        });
        this.#logger.debug(`attachData request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async blindTransfer(
        callRef: string,
        transferTo: string,
        anonymous: boolean,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`blindTransfer callRef={}, transferTo={}, anonymous={}, loginName={}`, callRef, transferTo, anonymous, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'blindtransfer'
        );
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            transferTo: AssertUtil.notNullOrEmpty(transferTo, 'transferTo'),
            anonymous: anonymous,
        });
        this.#logger.debug(`blindTransfer request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async callback(callRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`callback callRef={}, loginName={}`, callRef, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'callback');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async getLegs(callRef: string, loginName: string | null): Promise<Leg[] | null> {
        this.#logger.info(`getLegs callRef={}, loginName={}`, callRef, loginName);

        let uriGet = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'deviceLegs'
        );
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<LegListJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getLegs result={}`, _json);

        if (_json && Array.isArray(_json.legs)) {
            return _json.legs.map(Leg.fromJson);
        } 
        else {
            return null;
        }
    }

    async getLeg(callRef: string, legId: string, loginName: string | null): Promise<Leg | null> {
        this.#logger.info(`getLeg callRef={}, legId={}, loginName={}`, callRef, legId, loginName);

        let uriGet = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'deviceLegs',
            AssertUtil.notNullOrEmpty(legId, 'legId')
        );

        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<LegJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getLeg result={}`, _json);

        return _json ? Leg.fromJson(_json) : null;
    }

    async dropme(callRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`dropme callRef={}, loginName={}`, callRef, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'dropme');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async hold(callRef: string, deviceId: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`hold callRef={}, deviceId={}, loginName={}`, callRef, deviceId, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'hold');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
        });
        this.#logger.debug(`hold request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async merge(callRef: string, heldCallRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`merge callRef={}, heldCallRef={}, loginName={}`, callRef, heldCallRef, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'merge');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            heldCallRef: AssertUtil.notNullOrEmpty(heldCallRef, 'heldCallRef'),
        });
        this.#logger.debug(`merge request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async overflowToVoiceMail(callRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`overflowToVoiceMail callRef={}, loginName={}`, callRef, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'overflowToVoiceMail'
        );
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async park(callRef: string, parkTo: string | null, loginName: string | null): Promise<boolean> {
        this.#logger.info(`park callRef={}, parkTo={}, loginName={}`, callRef, parkTo, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'park');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            parkTo: AssertUtil.notNullOrEmpty(parkTo, 'parkTo'),
        });
        this.#logger.debug(`park request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async getParticipants(callRef: string, loginName: string | null): Promise<Participant[] | null> {
        this.#logger.info(`getParticipants callRef={}, loginName={}`, callRef, loginName);

        let uriGet = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'participants'
        );
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<ParticipantListJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getParticipants result={}`, _json);

        if (_json && Array.isArray(_json.participants)) {
            return _json.participants.map(Participant.fromJson);
        } 
        else {
            return null;
        }
    }

    async getParticipant(
        callRef: string,
        participantId: string,
        loginName: string | null
    ): Promise<Participant | null> {
        this.#logger.info(`getParticipant callRef={}, participantId={}, loginName={}`, callRef, participantId, loginName);

        let uriGet = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'participants',
            AssertUtil.notNullOrEmpty(participantId, 'participantId')
        );

        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<ParticipantJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getParticipant result={}`, _json);

        return _json ? Participant.fromJson(_json) : null;
    }

    async dropParticipant(callRef: string, participantId: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`dropParticipant callRef={}, participantId={}, loginName={}`, callRef, participantId, loginName);

        let uriDelete = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'participants',
            AssertUtil.notNullOrEmpty(participantId, 'participantId')
        );

        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async reconnect(
        callRef: string,
        deviceId: string,
        enquiryCallRef: string,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`reconnect callRef={}, deviceId={}, enquiryCallRef={}, loginName={}`, callRef, deviceId, enquiryCallRef, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'reconnect'
        );
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            enquiryCallRef: AssertUtil.notNullOrEmpty(enquiryCallRef, 'enquiryCallRef'),
        });
        this.#logger.debug(`reconnect request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async doRecordAction(callRef: string, action: RecordingAction, loginName: string | null): Promise<boolean> {
        this.#logger.info(`doRecordAction callRef={}, action={}, loginName={}`, callRef, action, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'recording'
        );
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        uriPost = UtilUri.appendQuery(uriPost, 'action', action);

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async redirect(
        callRef: string,
        redirectTo: string,
        anonymous: boolean,
        loginName: string | null
    ): Promise<boolean> {
        this.#logger.info(`redirect callRef={}, redirectTo={}, anonymous={}, loginName={}`, callRef, redirectTo, anonymous, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'redirect');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            redirectTo: AssertUtil.notNullOrEmpty(redirectTo, 'redirectTo'),
            anonymous: anonymous,
        });
        this.#logger.debug(`redirect request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async retrieve(callRef: string, deviceId: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`retrieve callRef={}, deviceId={}, loginName={}`, callRef, deviceId, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'retrieve');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
        });
        this.#logger.debug(`retrieve request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async sendDtmf(callRef: string, deviceId: string, number: string): Promise<boolean> {
        this.#logger.info(`sendDtmf callRef={}, deviceId={}, number={}`, callRef, deviceId, number);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'sendDtmf');

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            number: AssertUtil.notNullOrEmpty(number, 'number'),
        });
       this.#logger.debug(`sendDtmf request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async sendAccountInfo(callRef: string, deviceId: string, accountInfo: string): Promise<boolean> {
        this.#logger.info(`sendAccountInfo callRef={}, deviceId={}, accountInfo={}`, callRef, deviceId, accountInfo);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'calls',
            AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            'sendaccountinfo'
        );

        const _json = JSON.stringify({
            deviceId: AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            accountInfo: AssertUtil.notNullOrEmpty(accountInfo, 'accountInfo'),
        });
       this.#logger.debug(`sendAccountInfo request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async transfer(callRef: string, heldCallRef: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`transfer callRef={}, heldCallRef={}, loginName={}`, callRef, heldCallRef, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'calls', AssertUtil.notNullOrEmpty(callRef, 'callRef'), 'transfer');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            heldCallRef: AssertUtil.notNullOrEmpty(heldCallRef, 'heldCallRef'),
        });
       this.#logger.debug(`transfer request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async deskSharingLogOn(dssDeviceNumber: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`deskSharingLogOn dssDeviceNumber={}, loginName={}`, dssDeviceNumber, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'deskSharing');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            dssDeviceNumber: AssertUtil.notNullOrEmpty(dssDeviceNumber, 'dssDeviceNumber'),
        });
       this.#logger.debug(`deskSharingLogOn request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async deskSharingLogOff(loginName: string | null): Promise<boolean> {
        this.#logger.info(`deskSharingLogOff loginName={}`, loginName);

        var uriDelete = UtilUri.appendPath(this._uri, 'deskSharing');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getDevicesState(loginName: string | null): Promise<DeviceState[] | null> {
        this.#logger.info(`getDevicesState loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'devices');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<DeviceStateListJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getDevicesState result={}`, _json);
        
        if (_json && Array.isArray(_json.deviceStates)) {
            return _json.deviceStates.map(DeviceState.fromJson);
        } 
        else {
            return null;
        }
    }

    async getDeviceState(deviceId: string, loginName: string | null): Promise<DeviceState | null> {
        this.#logger.info(`getDeviceState deviceId={}, loginName={}`, deviceId, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'devices', AssertUtil.notNullOrEmpty(deviceId, 'deviceId'));
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<DeviceStateJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getDeviceState result={}`, _json);

        return _json ? DeviceState.fromJson(_json) : null;
    }

    async pickUp(
        deviceId: string,
        otherCallRef: string,
        otherPhoneNumber: string,
        autoAnswer: boolean
    ): Promise<boolean> {
        this.#logger.info(`pickUp deviceId={}, otherCallRef={}, otherPhoneNumber={}, autoAnswer={}`, deviceId, otherCallRef, otherPhoneNumber, autoAnswer);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'pickup'
        );

        const _json = JSON.stringify({
            otherCallRef: AssertUtil.notNullOrEmpty(otherCallRef, 'otherCallRef'),
            otherPhoneNumber: AssertUtil.notNullOrEmpty(otherPhoneNumber, 'otherPhoneNumber'),
            autoAnswer: autoAnswer,
        });
        this.#logger.debug(`pickUp request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async intrusion(deviceId: string): Promise<boolean> {
        this.#logger.info(`intrusion deviceId={}`, deviceId);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'intrusion'
        );

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async toggleInterphony(deviceId: string): Promise<boolean> {
        this.#logger.info(`toggleInterphony deviceId={}`, deviceId);

        let uriPut = UtilUri.appendPath(
            this._uri,
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'ithmicro'
        );

        const httpResponse = await this._httpClient.put(uriPut);
        return httpResponse.isSuccessStatusCode();
    }

    async unPark(deviceId: string, heldCallRef: string): Promise<boolean> {
        this.#logger.info(`unPark deviceId={}, heldCallRef={}`, deviceId, heldCallRef);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'devices',
            AssertUtil.notNullOrEmpty(deviceId, 'deviceId'),
            'unpark'
        );

        const _json = JSON.stringify({
            heldCallRef: AssertUtil.notNullOrEmpty(heldCallRef, 'heldCallRef'),
        });
        this.#logger.debug(`unPark request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async getHuntingGroupStatus(loginName: string | null): Promise<HuntingGroupStatus | null> {
        this.#logger.info(`getHuntingGroupStatus loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'huntingGroupLogOn');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<HuntingGroupStatusJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getHuntingGroupStatus result={}`, _json);

        return _json ? HuntingGroupStatus.fromJson(_json) : null;
    }

    async huntingGroupLogOn(loginName: string | null): Promise<boolean> {
        this.#logger.info(`huntingGroupLogOn loginName={}`, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'huntingGroupLogOn');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async huntingGroupLogOff(loginName: string | null): Promise<boolean> {
        this.#logger.info(`huntingGroupLogOff loginName={}`, loginName);

        let uriDelete = UtilUri.appendPath(this._uri, 'huntingGroupLogOn');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async addMeToHuntingGroup(hgNumber: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`addMeToHuntingGroup hgNumber={}, loginName={}`, hgNumber, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'huntingGroupMember',
            AssertUtil.notNullOrEmpty(hgNumber, 'hgNumber')
        );
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async removeMeFromHuntingGroup(hgNumber: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`removeMeFromHuntingGroup hgNumber={}, loginName={}`, hgNumber, loginName);

        var uriDelete = UtilUri.appendPath(
            this._uri,
            'huntingGroupMember',
            AssertUtil.notNullOrEmpty(hgNumber, 'hgNumber')
        );
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async queryHuntingGroups(loginName: string | null): Promise<HuntingGroups | null> {
        this.#logger.info(`queryHuntingGroups loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'huntingGroups');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<HuntingGroupsJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`queryHuntingGroups result={}`, _json);

        if (!_json) return null;
        return HuntingGroups.fromJson(_json);
    }

    async getCallbacks(loginName: string | null): Promise<Callback[] | null> {
        this.#logger.info(`getCallbacks loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'incomingCallbacks');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<CallbackListJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getCallbacks result={}`, _json);

        if (_json && Array.isArray(_json.callbacks)) {
            return _json.callbacks.map(Callback.fromJson);
        } 
        else {
            return null;
        }
    }

    async deleteCallbacks(loginName: string | null): Promise<boolean> {
        this.#logger.info(`deleteCallbacks loginName={}`, loginName);

        let uriDelete = UtilUri.appendPath(this._uri, 'incomingCallbacks');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async deleteCallback(callbackId: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`deleteCallback callbackId={}, loginName={}`, callbackId, loginName);

        let uriDelete = UtilUri.appendPath(
            this._uri,
            'incomingCallbacks',
            AssertUtil.notNullOrEmpty(callbackId, 'callbackId')
        );
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getMiniMessage(loginName: string | null): Promise<MiniMessage | null> {
        this.#logger.info(`getMiniMessage loginName={}`, loginName);

        let uriGet = UtilUri.appendPath(this._uri, 'miniMessages');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<MiniMessageJson>(await this._httpClient.get(uriGet));
        this.#logger.debug(`getMiniMessage result={}`, _json);

        return _json ? MiniMessage.fromJson(_json) : null;
    }

    async sendMiniMessage(recipient: string, message: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`sendMiniMessage recipient={}, loginName={}`, recipient, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'miniMessages');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            recipient: AssertUtil.notNullOrEmpty(recipient, 'recipient'),
            message: AssertUtil.notNullOrEmpty(message, 'message'),
        });
        this.#logger.debug(`sendMiniMessage request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async requestCallback(callee: string, loginName: string | null): Promise<boolean> {
        this.#logger.info(`requestCallback callee={}, loginName={}`, callee, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'outgoingCallbacks');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _json = JSON.stringify({
            callee: AssertUtil.notNullOrEmpty(callee, 'callee'),
        });
        this.#logger.debug(`requestCallback request={}`, _json);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(_json));
        return httpResponse.isSuccessStatusCode();
    }

    async requestSnapshot(loginName: string | null): Promise<boolean> {
        this.#logger.info(`requestSnapshot loginName={}`, loginName);

        let uriPost = UtilUri.appendPath(this._uri, 'state/snapshot');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async getPilotInfo(
        nodeId: number,
        pilotNumber: string,
        pilotTransferQueryParam: PilotTransferQueryParameters | null = null,
        loginName: string | null = null
    ): Promise<PilotInfo | null> {
        this.#logger.info(`getPilotInfo nodeId={}, pilotNumber={}, loginName={}`, nodeId, pilotNumber, loginName);

        let uriPost = UtilUri.appendPath(
            this._uri,
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'transferInfo'
        );

        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let _json;
        if (pilotTransferQueryParam != null) {
            const req = JSON.stringify(pilotTransferQueryParam.toJson());
            _json = this.getResult<PilotInfoJson>(await this._httpClient.post(uriPost, new HttpContent(req)));
        } 
        else {
            _json = this.getResult<PilotInfoJson>(await this._httpClient.post(uriPost));
        }
        this.#logger.debug(`getPilotInfo request={}`, _json);

        return _json ? PilotInfo.fromJson(_json) : null;
    }
}