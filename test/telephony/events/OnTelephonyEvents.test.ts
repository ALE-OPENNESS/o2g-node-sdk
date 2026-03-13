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

import { CallData } from "../../../src/types/telephony/call/call-data";
import { MediaState } from "../../../src/types/telephony/call/media-state";
import { DeviceState } from "../../../src/types/telephony/device/device-state";
import { HuntingGroupStatus } from "../../../src/types/telephony/hunting-group-status";
import { TelephonicState } from "../../../src/types/telephony/telephonic-state";
import { OnCallCreated, OnCallModified, OnCallRemoved, OnDeviceStateModified, OnDynamicStateChanged, OnTelephonyState, OnUserStateModified } from "../../../src/types/telephony/telephony-events";
import { UserState } from "../../../src/types/telephony/user/user-state";

describe('Telephony Event Classes (from JSON strings)', () => {

    it('OnCallCreated should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "callRef": "call-1",
            "callData": {
                "state": "RINGING_INCOMING",
                "initialCalled": {
                    "displayName": "alice",
                    "id" : {
                        "phoneNumber": "9000"
                    }
                }
            },
            "initiator": "jdoe",
            "legs": [
                {
                    "deviceId": "12300",
                    "state": "RINGING_INCOMING",
                    "capabilities": {
                        "answer": true
                    }
                }
            ],
            "participants": [
                {
                    "participantId": "part001abcd",
                    "identity": {
                        "id" : {
                            "phoneNumber": "12300"
                        }
                    }
                }
            ],
            "deviceCapabilities": [
                {
                    "deviceId": "12300",
                    "makeCall": true
                }
            ]
        }`;

        const event = OnCallCreated.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnCallCreated);
        expect(event.loginName).toBe('oxe1000');
        expect(event.callRef).toBe('call-1');
        expect(event.callData).toBeInstanceOf(CallData);
        expect(event.callData?.state).toBe(MediaState.RINGING_INCOMING);
        expect(event.callData?.initialCalled?.displayName).toBe("alice");
        expect(event.legs!.length).toBe(1);
        expect(event.legs![0].deviceId).toBe("12300");
        expect(event.legs![0].state).toBe(MediaState.RINGING_INCOMING);
        expect(event.participants!.length).toBe(1)
        expect(event.participants![0].participantId).toBe("part001abcd");
        expect(event.participants![0].identity?.id.phoneNumber).toBe("12300");
        expect(event.deviceCapabilities!.length).toBe(1)
        expect(event.deviceCapabilities![0].deviceId).toBe("12300");
        expect(event.deviceCapabilities![0].canMakeCall).toBe(true);
    });

    it('OnCallModified should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "callRef": "call-1",
            "previousCallRef": "call-0",
            "replacedByCallRef": "call-2",
            "callData": {
                "state": "RINGING_INCOMING",
                "initialCalled": {
                    "displayName": "alice",
                    "id" : {
                        "phoneNumber": "9000"
                    }
                }
            },
            "addedLegs": [
                {
                    "deviceId": "15300",
                    "state": "RELEASING"
                }
            ],
            "addedParticipants": [
                {
                    "participantId": "part002abcd",
                    "identity": {
                        "id" : {
                            "phoneNumber": "23300"
                        }
                    }
                }
            ],
            "deviceCapabilities": [
                {
                    "deviceId": "12300",
                    "makeBusinessCall": true
                }
            ]
        }`;

        const event = OnCallModified.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnCallModified);
        expect(event.loginName).toBe('oxe1000');
        expect(event.previousCallRef).toBe('call-0');
        expect(event.replacedByCallRef).toBe('call-2');
        expect(event.callData).toBeInstanceOf(CallData);
        expect(event.callData?.state).toBe(MediaState.RINGING_INCOMING);
        expect(event.callData?.initialCalled?.displayName).toBe("alice");
        expect(event.addedParticipants![0].identity?.id.phoneNumber).toBe("23300");
        expect(event.modifiedParticipants).toBeNull();
        expect(event.removedParticipants).toBeNull();
        expect(event.addedLegs![0].deviceId).toBe("15300");
        expect(event.addedLegs![0].state).toBe(MediaState.RELEASING);
        expect(event.modifiedLegs).toBeNull();
        expect(event.removedLeg).toBeNull();
    });

    it('OnCallRemoved should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "callRef": "call-1",
            "cause": "CLEARED",
            "deviceCapabilities": [
                {
                    "deviceId": "12000",
                    "makeCall": true
                }
            ]
        }`;

        const event = OnCallRemoved.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnCallRemoved);
        expect(event.loginName).toBe('oxe1000');
        expect(event.newDestination).toBeNull();
        expect(event.deviceCapabilities![0].deviceId).toBe("12000");
        expect(event.deviceCapabilities![0].canMakeCall).toBe(true);
        expect(event.deviceCapabilities![0].canUnParkCall).toBe(false);
    });

    it('OnDeviceStateModified should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "deviceStates": [
                {
                    "deviceId": "1200",
                    "state": "IN_SERVICE"
                }
            ]
        }`;

        const event = OnDeviceStateModified.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnDeviceStateModified);
        expect(event.loginName).toBe('oxe1000');
        expect(event.deviceStates?.length).toBe(1);
        expect(event.deviceStates![0].deviceId).toBe("1200");
    });

    it('OnDynamicStateChanged should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "huntingGroupState": {
                "logon": true
            }
        }`;

        const event = OnDynamicStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnDynamicStateChanged);
        expect(event.loginName).toBe('oxe1000');
        expect(event.logged).toBe(true);

    });

    it('OnDynamicStateChanged should manage optional parameters', () => {
        const jsonString = `{
            "loginName": "oxe1000"
        }`;

        const event = OnDynamicStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnDynamicStateChanged);
        expect(event.loginName).toBe('oxe1000');
        expect(event.logged).toBe(false);

    });

    it('OnTelephonyState should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "state": {
                "calls": [
                    {
                        "callRef": "11111abcdf",
                        "callData": {
                            "state": "RINGING_INCOMING",
                            "initialCalled": {
                                "displayName": "alice",
                                "id" : {
                                    "phoneNumber": "9000"
                                }
                            }
                        }
                    }
                ],
                "userState": "BUSY",
                "deviceCapabilities": [
                    {
                        "deviceId": "12000",
                        "makeCall": true
                    }
                ]
            }
        }`;

        const event = OnTelephonyState.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnTelephonyState);
        expect(event.loginName).toBe('oxe1000');
        expect(event.state).toBeInstanceOf(TelephonicState);
        expect(event.state?.calls![0].callRef).toBe("11111abcdf");
        expect(event.state?.calls![0].callData?.initialCalled?.displayName).toBe("alice");
        expect(event.state?.calls![0].legs).toBeNull();
        expect(event.state?.userState).toBe(UserState.BUSY);
    });

    it('OnUserStateModified should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "state": "BUSY"
        }`;

        const event = OnUserStateModified.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnUserStateModified);
        expect(event.loginName).toBe('oxe1000');
        expect(event.state).toBe(UserState.BUSY);
    });

});