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

import TelephonyRest from "../../src/internal/rest/telephony-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { Call } from "../../src/types/telephony/call";
import { CallProfile } from "../../src/types/telephony/call/ccd/call-profile";
import { PilotInfo } from "../../src/types/telephony/call/ccd/pilot-info";
import { PilotStatus } from "../../src/types/telephony/call/ccd/pilot-status";
import { PilotTransferQueryParameters } from "../../src/types/telephony/call/ccd/pilot-transfer-query-param";
import { CorrelatorData } from "../../src/types/telephony/call/correlator-data";
import { Leg } from "../../src/types/telephony/call/leg";
import { MediaState } from "../../src/types/telephony/call/media-state";
import { Participant } from "../../src/types/telephony/call/participant";
import { Callback } from "../../src/types/telephony/callback";
import { DeviceState } from "../../src/types/telephony/device/device-state";
import { OperationalState } from "../../src/types/telephony/device/operational-state";
import { HuntingGroupStatus } from "../../src/types/telephony/hunting-group-status";
import { HuntingGroups } from "../../src/types/telephony/hunting-groups";
import { MiniMessage } from "../../src/types/telephony/mini-message";
import { RecordingAction } from "../../src/types/telephony/RecordingAction";
import { TelephonicState } from "../../src/types/telephony/telephonic-state";
import { UserState } from "../../src/types/telephony/user/user-state";


describe('TelephonyRest Full Suite', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: TelephonyRest;
    const baseUri = 'http://o2g/callcontrol';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        }
        service = new TelephonyRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // basicMakeCall
    // ----------------------------
    it('basicMakeCall should POST correct payload', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.basicMakeCall("3001", "3005", true);

        expect(mockHttpClient.post).toHaveBeenCalled();
        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(`${baseUri}/basicCall`);
        expect(JSON.parse((body as HttpContent).content)).toEqual({
            deviceId: "3001",
            callee: "3005",
            autoAnswer: true
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // basicDropMe
    // ----------------------------
    it('basicDropMe should POST without body if loginName null', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.basicAnswerCall("23000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/basicCall/answer`,
            new HttpContent(JSON.stringify({ deviceId: "23000" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // basicDropMe
    // ----------------------------
    it('basicDropMe should POST without body if loginName null', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.basicDropMe(null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/basicCall/dropme`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // getState
    // ----------------------------
    it('getState should GET and return TelephonicState', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                deviceCapabilities: [
                    {
                        deviceId: "3002",
                        makeCall: true
                    }
                ],
                userState: "FREE"
            })
        );

        const state = await service.getState(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/state`);

        expect(state).toBeInstanceOf(TelephonicState);
        expect(state?.calls).toBeNull();
        expect(state?.userState).toBe(UserState.FREE);

    });

    // ----------------------------
    // getCalls
    // ----------------------------
    it('getCalls should map JSON array to Call instances', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                calls: [{
                    callRef: "11111aaaaa"
                }, {
                    callRef: "11111bbbb"
                }]
            })
        );

        const calls = await service.getCalls(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls`);

        expect(calls?.length).toBe(2);
        expect(calls![0].callRef).toBe("11111aaaaa");
    });

    // ----------------------------
    // getCall
    // ----------------------------
    it('getCall should map JSON  to a Call instances', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                callRef: "0ba25a675f050700"
            })
        );

        const acall = await service.getCall("0ba25a675f050700", "oxe12345");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/0ba25a675f050700?loginName=oxe12345`);
        expect(acall).toBeInstanceOf(Call);

        expect(acall?.callRef).toBe("0ba25a675f050700");
    });

    it('getCall should return null if not found', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(404, null)
        );

        const acall = await service.getCall("0ba25a675f050700", "oxe12345");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/0ba25a675f050700?loginName=oxe12345`);
        expect(acall).toBeNull();
    });


    // ----------------------------
    // makeCall
    // ----------------------------
    it('makeCall should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.makeCall("3001", "3005", true, null);

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            callee: "3005",
            autoAnswer: true
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // makeCallEx
    // ----------------------------
    it('makeCallEx should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");
        const result = await service.makeCallEx(
            "3001", "3005", true, true, correlatorData, "012345678", 'john'
        );

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            callee: "3005",
            autoAnswer: true,
            inhibitProgressTone: true,
            hexaBinaryAssociatedData: '4d61726b6574696e67',
            callingNumber: '012345678'
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // makePrivateCall
    // ----------------------------
    it('makePrivateCall should POST with pin and optional secretCode', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.makePrivateCall("13000", "13002", '1234', "2345", 'john');

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);
        expect(JSON.parse((body as HttpContent).content)).toEqual({
            deviceId: "13000",
            callee: "13002",
            pin: '1234',
            secretCode: "2345"
        });
        expect(result).toBe(true);
    });

    // ----------------------------
    // makeBusinessCall
    // ----------------------------
    it('makeBusinessCall should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.makeBusinessCall("3001", "3005", "CodeAAA", 'john');

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            callee: "3005",
            businessCode: "CodeAAA"
        });

        expect(result).toBe(true);
    });


    // ----------------------------
    // makeSupervisorCall
    // ----------------------------
    it('makeSupervisorCall should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");

        const result = await service.makeSupervisorCall("3001", true, 'john');

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            autoAnswer: true,
            acdCall: {
                callToSupervisor: true
            }
        });

        expect(result).toBe(true);
    });


    // ----------------------------
    // makePilotOrRSISupervisedTransferCall
    // ----------------------------
    it('makePilotOrRSISupervisedTransferCall should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");
        const callProfile = new CallProfile(new CallProfile.Skill(1, 2, true), new CallProfile.Skill(2, 3, true))

        const result = await service.makePilotOrRSISupervisedTransferCall(
            "3001", "21000", correlatorData, callProfile, 'john'
        );

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            callee: "21000",
            hexaBinaryAssociatedData: '4d61726b6574696e67',
            acdCall: {
                supervisedTransfer: true,
                skills: {
                    skills: [
                        {
                            skillNumber: 1,
                            acrStatus: true,
                            expertEvalLevel: 2
                        },
                        {
                            skillNumber: 2,
                            acrStatus: true,
                            expertEvalLevel: 3
                        }
                    ]
                }
            }
        });

        expect(result).toBe(true);
    });


    // ----------------------------
    // makePilotOrRSICall
    // ----------------------------
    it('makePilotOrRSICall should include optional fields', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");
        const callProfile = new CallProfile(new CallProfile.Skill(1, 2, true), new CallProfile.Skill(2, 3, true))

        const result = await service.makePilotOrRSICall("3001", "21000", true, correlatorData, callProfile, 'john');

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls?loginName=john`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "3001",
            callee: "21000",
            autoAnswer: true,
            hexaBinaryAssociatedData: '4d61726b6574696e67',
            acdCall: {
                skills: {
                    skills: [
                        {
                            skillNumber: 1,
                            acrStatus: true,
                            expertEvalLevel: 2
                        },
                        {
                            skillNumber: 2,
                            acrStatus: true,
                            expertEvalLevel: 3
                        }
                    ]
                }
            }
        });

        expect(result).toBe(true);
    });


    // ----------------------------
    // release
    // ----------------------------
    it('release should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.release('11111aaaaa', 'john');

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/calls/11111aaaaa?loginName=john`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // alternate
    // ----------------------------
    it('alternate should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.alternate('11111aaaaa', '32000');

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/alternate`,
            new HttpContent(JSON.stringify({ deviceId: "32000" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // answer
    // ----------------------------
    it('answer should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.answer('11111aaaaa', '32000');

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/answer`,
            new HttpContent(JSON.stringify({ deviceId: "32000" }))
        );

        expect(result).toBe(true);
    });


    // ----------------------------
    // attachData
    // ----------------------------
    it('attachData should POST correct URL', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");
        const result = await service.attachData("11111aaaaa", '32000', correlatorData);

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls/11111aaaaa/attachdata`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "32000",
            hexaBinaryAssociatedData: '4d61726b6574696e67'
        });

        expect(result).toBe(true);
    });


    // ----------------------------
    // blindTransfer
    // ----------------------------
    it('blindTransfer should POST correct URL', async () => {

        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const correlatorData = new CorrelatorData("Marketing");
        const result = await service.blindTransfer("11111aaaaa", '32000', false, "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls/11111aaaaa/blindtransfer?loginName=oxe1000`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            transferTo: "32000",
            anonymous: false
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // callback
    // ----------------------------
    it('callback should POST without body', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.callback('23000', null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/calls/23000/callback`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // getLegs
    // ----------------------------
    it('getLegs should return mapped Leg array', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                legs: [{
                    deviceId: "32000",
                    state: "DIALING"
                }, {
                    deviceId: "32001",
                    state: "RELEASING"
                }]
            })
        );

        const legs = await service.getLegs('123456abcdef', null);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/deviceLegs`);

        expect(legs).toBeInstanceOf(Array);
        expect(legs![0]).toBeInstanceOf(Leg);

        expect(legs![0].deviceId).toBe("32000");
        expect(legs![1].state).toBe(MediaState.RELEASING);
        expect(legs![1].ringingRemote).toBe(false);
    });

    // ----------------------------
    // getLeg
    // ----------------------------
    it('getLeg should return a Leg ', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                deviceId: "32000",
                state: "DIALING"
            })
        );

        const leg = await service.getLeg('123456abcdef', "2300", null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/deviceLegs/2300`);

        expect(leg).toBeInstanceOf(Leg);

        expect(leg!.deviceId).toBe("32000");
        expect(leg!.state).toBe(MediaState.DIALING);
        expect(leg!.ringingRemote).toBe(false);
    });


    // ----------------------------
    // dropme
    // ----------------------------
    it('dropme should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.dropme('11111aaaaa', 'oxe2000');

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/dropme?loginName=oxe2000`
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // hold
    // ----------------------------
    it('hold should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.hold('11111aaaaa', '23000', null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/hold`,
            new HttpContent(JSON.stringify({ deviceId: "23000" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // merge
    // ----------------------------
    it('merge should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.merge('11111aaaaa', '2222bbbbb', null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/merge`,
            new HttpContent(JSON.stringify({ heldCallRef: "2222bbbbb" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // overflowToVoiceMail
    // ----------------------------
    it('overflowToVoiceMail should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.overflowToVoiceMail('11111aaaaa', null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/calls/11111aaaaa/overflowToVoiceMail`);

        expect(result).toBe(true);
    });

    // ----------------------------
    // park
    // ----------------------------
    it('park should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.park('11111aaaaa', "23000", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/11111aaaaa/park?loginName=oxe1000`,
            new HttpContent(JSON.stringify({ parkTo: "23000" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // unPark
    // ----------------------------
    it('unPark should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.unPark("23000", '11111aaaaa');

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/devices/23000/unpark`,
            new HttpContent(JSON.stringify({ heldCallRef: "11111aaaaa" }))
        );

        expect(result).toBe(true);
    });



    // ----------------------------
    // getParticipants
    // ----------------------------
    it('getParticipants should return mapped Participant array', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                participants: [{
                    participantId: "part001",
                    anonymous: true
                }, {
                    participantId: "part002"
                }]
            })
        );

        const participants = await service.getParticipants('123456abcdef', null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/participants`);

        expect(participants).toBeInstanceOf(Array);
        expect(participants![0]).toBeInstanceOf(Participant);

        expect(participants![0].anonymous).toBe(true);
    });

    // ----------------------------
    // getParticipant
    // ----------------------------
    it('getParticipant should return a Participant', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                participantId: "part001",
                anonymous: true
            })
        );

        const participant = await service.getParticipant('123456abcdef', "PartId", null);

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/participants/PartId`);
        expect(participant).toBeInstanceOf(Participant);
    });

    // ----------------------------
    // dropParticipant
    // ----------------------------
    it('dropParticipant should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.dropParticipant('123456abcdef', "PartId", null);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/participants/PartId`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // reconnect
    // ----------------------------
    it('reconnect should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.reconnect('123456abcdef', "23000", "11111aaaaa", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls/123456abcdef/reconnect?loginName=oxe1000`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            deviceId: "23000",
            enquiryCallRef: "11111aaaaa"
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // doRecordAction
    // ----------------------------
    it('doRecordAction should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.doRecordAction('123456abcdef', RecordingAction.START, null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/calls/123456abcdef/recording?action=Start`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // redirect
    // ----------------------------
    it('redirect should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.redirect('123456abcdef', "23000", true, "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/calls/123456abcdef/redirect?loginName=oxe1000`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            redirectTo: "23000",
            anonymous: true
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // retrieve
    // ----------------------------
    it('retrieve should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.retrieve('123456abcdef', "23000", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/123456abcdef/retrieve?loginName=oxe1000`,
            new HttpContent(JSON.stringify({ deviceId: "23000" }))
        );

        expect(result).toBe(true);
    });


    // ----------------------------
    // sendDtmf
    // ----------------------------
    it('sendDtmf should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.sendDtmf('123456abcdef', "23000", "1234");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/123456abcdef/sendDtmf`,
            new HttpContent(JSON.stringify({ deviceId: "23000", number: "1234" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // sendAccountInfo
    // ----------------------------
    it('sendAccountInfo should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.sendAccountInfo('123456abcdef', "23000", "infoAccount");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/123456abcdef/sendaccountinfo`,
            new HttpContent(JSON.stringify({ deviceId: "23000", accountInfo: "infoAccount" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // transfer
    // ----------------------------
    it('transfer should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.transfer('123456abcdef', "11111aaaaa", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/calls/123456abcdef/transfer?loginName=oxe1000`,
            new HttpContent(JSON.stringify({ heldCallRef: "11111aaaaa" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // deskSharingLogOn
    // ----------------------------
    it('deskSharingLogOn should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.deskSharingLogOn('12000', "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/deskSharing?loginName=oxe1000`,
            new HttpContent(JSON.stringify({ dssDeviceNumber: "12000" }))
        );

        expect(result).toBe(true);
    });

    // ----------------------------
    // deskSharingLogOff
    // ----------------------------
    it('deskSharingLogOff should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.deskSharingLogOff("oxe1000");

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/deskSharing?loginName=oxe1000`);

        expect(result).toBe(true);
    });

    // ----------------------------
    // getDevicesState
    // ----------------------------
    it('getDevicesState should return an array of DeviceState', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                deviceStates: [
                    {
                        deviceId: "2000",
                        state: "IN_SERVICE"
                    },
                    {
                        deviceId: "2001",
                        state: "OUT_OF_SERVICE",
                        cause: "CLEARED"
                    }
                ]
            })
        );

        const deviceStates = await service.getDevicesState("oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/devices?loginName=oxe1000`);
        expect(deviceStates).toBeInstanceOf(Array);

        expect(deviceStates![0]).toBeInstanceOf(DeviceState);
        expect(deviceStates![0].deviceId).toBe("2000");
        expect(deviceStates![0].state).toBe(OperationalState.IN_SERVICE);
        expect(deviceStates![1].deviceId).toBe("2001");
        expect(deviceStates![1].state).toBe(OperationalState.OUT_OF_SERVICE);
    });

    // ----------------------------
    // getDeviceState
    // ----------------------------
    it('getDeviceState should return a DeviceState', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                deviceId: "2000",
                state: "IN_SERVICE"
            })
        );

        const deviceStates = await service.getDeviceState("13000", "oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/devices/13000?loginName=oxe1000`);
        expect(deviceStates).toBeInstanceOf(DeviceState);
        expect(deviceStates!.deviceId).toBe("2000");
        expect(deviceStates!.state).toBe(OperationalState.IN_SERVICE);

    });

    // ----------------------------
    // pickUp
    // ----------------------------
    it('pickUp should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.pickUp('12000', "11111aaaaa", "23000", true);

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/devices/12000/pickup`);

        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            otherCallRef: "11111aaaaa",
            otherPhoneNumber: "23000",
            autoAnswer: true
        });

        expect(result).toBe(true);
    });

    // ----------------------------
    // intrusion
    // ----------------------------
    it('intrusion should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.intrusion('12000');

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/devices/12000/intrusion`);
        expect(result).toBe(true);
    });


    // ----------------------------
    // toggleInterphony
    // ----------------------------
    it('toggleInterphony should PUT correct URL', async () => {
        mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.toggleInterphony("31000");

        expect(mockHttpClient.put).toHaveBeenCalledWith(`${baseUri}/devices/31000/ithmicro`);
        expect(result).toBe(true);
    });


    // ----------------------------
    // getHuntingGroupStatus
    // ----------------------------
    it('getHuntingGroupStatus should return a DeviceState', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                logon: true,
            })
        );

        const hgStatus = await service.getHuntingGroupStatus("oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/huntingGroupLogOn?loginName=oxe1000`);

        expect(hgStatus).toBeInstanceOf(HuntingGroupStatus);
        expect(hgStatus?.loggedOn).toBe(true);
    });

    // ----------------------------
    // huntingGroupLogOn
    // ----------------------------
    it('huntingGroupLogOn should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.huntingGroupLogOn("oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/huntingGroupLogOn?loginName=oxe1000`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // huntingGroupLogOff
    // ----------------------------
    it('huntingGroupLogOff should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.huntingGroupLogOff("oxe1000");

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/huntingGroupLogOn?loginName=oxe1000`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // addMeToHuntingGroup
    // ----------------------------
    it('addMeToHuntingGroup should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.addMeToHuntingGroup("35000", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/huntingGroupMember/35000?loginName=oxe1000`);
        expect(result).toBe(true);
    });


    // ----------------------------
    // removeMeFromHuntingGroup
    // ----------------------------
    it('removeMeFromHuntingGroup should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.removeMeFromHuntingGroup('35000', 'oxe1000');

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/huntingGroupMember/35000?loginName=oxe1000`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // queryHuntingGroups
    // ----------------------------
    it('queryHuntingGroups should return a DeviceState', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                hgList: ["32000", "32001", "32002"],
                currentHg: "32000"
            })
        );

        const hgGroups = await service.queryHuntingGroups("oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/huntingGroups?loginName=oxe1000`);

        expect(hgGroups).toBeInstanceOf(HuntingGroups);
        expect(hgGroups?.list).toEqual(["32000", "32001", "32002"]);
        expect(hgGroups?.current).toBe("32000");
    });


    // ----------------------------
    // getCallbacks
    // ----------------------------
    it('getCallbacks should return an array of Callback', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                callbacks: [
                    {
                        callbackId: "1234abcd",
                        partyInfo: {
                            id: {
                                phoneNumber: "23000"
                            }
                        }
                    },
                    {
                        callbackId: "5678xyz",
                        partyInfo: {
                            id: {
                                phoneNumber: "23001"
                            }
                        }
                    }
                ]
            })
        );

        const callbacks = await service.getCallbacks("oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/incomingCallbacks?loginName=oxe1000`);
        expect(callbacks).toBeInstanceOf(Array);

        expect(callbacks![0]).toBeInstanceOf(Callback);
        expect(callbacks![0].callbackId).toBe("1234abcd");
        expect(callbacks![0].partyInfo.id.phoneNumber).toBe("23000");
        expect(callbacks![1].callbackId).toBe("5678xyz");
        expect(callbacks![1].partyInfo.id.phoneNumber).toBe("23001");
    });

    // ----------------------------
    // deleteCallbacks
    // ----------------------------
    it('deleteCallbacks should should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ""));

        const result = await service.deleteCallbacks("oxe1000");

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/incomingCallbacks?loginName=oxe1000`);
        expect(result).toBe(true);
    });

    // ----------------------------
    // deleteCallback
    // ----------------------------
    it('deleteCallback should should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ""));

        const result = await service.deleteCallback("abcd1234", null);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/incomingCallbacks/abcd1234`);
        expect(result).toBe(true);
    });


    // ----------------------------
    // getMiniMessage
    // ----------------------------
    it('getMiniMessage should return MiniMessage', async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                sender: "12000",
                dateTime: "2026-02-25T00:00",
                message: "the message"
            })
        );

        const message = await service.getMiniMessage("oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/miniMessages?loginName=oxe1000`);

        expect(message).toBeInstanceOf(MiniMessage);
        expect(message?.sender).toBe("12000");
        expect(message?.date).toEqual(new Date("2026-02-25T00:00"));
        expect(message?.message).toBe("the message");
    });

    // ----------------------------
    // sendMiniMessage
    // ----------------------------
    it('sendMiniMessage should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.sendMiniMessage("23000", "the message", "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/miniMessages?loginName=oxe1000`,
            new HttpContent(JSON.stringify({ 
                recipient: "23000",
                message: "the message"
            })
        ));

        expect(result).toBe(true);
    });

    // ----------------------------
    // requestCallback
    // ----------------------------
    it('requestCallback should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.requestCallback("23000", null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/outgoingCallbacks`,
            new HttpContent(JSON.stringify({ callee: "23000" })
        ));

        expect(result).toBe(true);
    });

    // ----------------------------
    // requestSnapshot
    // ----------------------------
    it('requestSnapshot should POST correct URL', async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.requestSnapshot(null);

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/state/snapshot`);
        expect(result).toBe(true);
    });


    // ----------------------------
    // getPilotInfo
    // ----------------------------
    it('getPilotInfo should return PilotInfo', async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, {
                number: "30000",
                waitingTime: 65,
                pilotTransferInfo: {
                    transferPossible: true,
                    pilotStatus: "BLOCKED_ON_RULE"
                }
            })
        );

        const ptqp = new PilotTransferQueryParameters();
        ptqp.setAgentNumber("312345");
        ptqp.setSupervisedTransfer(true);
        ptqp.setCallProfile(new CallProfile(new CallProfile.Skill(2, 3, true)));

        const pilotInfo = await service.getPilotInfo(3, "30000", ptqp, "oxe1000");

        expect(mockHttpClient.post).toHaveBeenCalled();

        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe(`${baseUri}/pilots/3/30000/transferInfo?loginName=oxe1000`);

        const payload = JSON.parse((body as HttpContent).content);
        expect(payload).toEqual({
            agentNumber: "312345",
            supervisedTransfer: true,
            skills: {
                skills: [{
                    skillNumber: 2,
                    expertEvalLevel: 3,
                    acrStatus: true
                }]
            }
        });

        expect(pilotInfo).toBeInstanceOf(PilotInfo);
        expect(pilotInfo?.number).toBe("30000");
        expect(pilotInfo?.saturation).toBe(false);
        expect(pilotInfo?.waitingTime).toBe(65);
        expect(pilotInfo?.pilotTransferInfo?.pilotStatus).toBe(PilotStatus.BLOCKED_ON_RULE);
    });
});