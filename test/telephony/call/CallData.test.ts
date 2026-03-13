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

import { PartyInfo } from "../../../src/types/common/party-info";
import { Call } from "../../../src/types/telephony/call";
import { CallData } from "../../../src/types/telephony/call/call-data";
import { AcdData } from "../../../src/types/telephony/call/ccd/acd-data";
import { CorrelatorData } from "../../../src/types/telephony/call/correlator-data";
import { MediaState } from "../../../src/types/telephony/call/media-state";
import { RecordState } from "../../../src/types/telephony/call/record-state";
import { Tag } from "../../../src/types/telephony/call/tag";
import { TrunkIdentification } from "../../../src/types/telephony/trunk-indentification";


describe("CallData", () => {

    it("should create a CallData from full JSON string", () => {
        const jsonString = `{
            "initialCalled": {
                "id": { 
                    "loginName": "jdoe",
                    "phoneNumber": "1001"
                },
                "firstName": "John",
                "lastName": "Doe",
                "type": { 
                    "main": "USER",
                    "subType": "PRO" 
                }
            },
            "lastRedirecting": {
                "id": { 
                    "loginName": "asmith",
                    "phoneNumber": "2001"
                },
                "firstName": "Alice",
                "lastName": "Smith",
                "type": { 
                    "main": "USER",
                    "subType": "PRO" 
                }
            },
            "deviceCall": true,
            "anonymous": true,
            "callUUID": "UUID123",
            "state": "RINGING_INCOMING",
            "recordState": "RECORDING",
            "tags": [{ "name": "urgent", "value": "true" }],
            "capabilities": { "transfer": true },
            "hexaBinaryAssociatedData": "414243",
            "accountInfo": "ACC001",
            "acdCallData": {
                "callInfo": {
                    "queueWaitingTime": 10,
                    "globalWaitingTime": 50,
                    "agentGroup": "SupportTeam",
                    "local": true
                },
                "queueData": {
                    "waitingTime": 30,
                    "saturated": true
                },
                "pilotNumber": "32000",
                "supervisedTransfer": false,
                "pilotTransferInfo": {
                    "transferPossible": true,
                    "pilotStatus": "BLOCKED"
                }
            },
            "trunkIdentification": { 
                "networkTimeslot": 10,
                 "trunkNeqt": 121
            }
        }`;

        const callData = CallData.fromJson(JSON.parse(jsonString));

        // Parties
        expect(callData.initialCalled).toBeInstanceOf(PartyInfo);
        expect(callData.lastRedirecting).toBeInstanceOf(PartyInfo);

        // Booleans
        expect(callData.deviceCall).toBe(true);
        expect(callData.anonymous).toBe(true);

        // UUID
        expect(callData.callUUID).toBe("UUID123");

        // Media & Record state
        expect(callData.state).toBe(MediaState.RINGING_INCOMING);
        expect(callData.recordState).toBe(RecordState.RECORDING);

        // Tags
        expect(callData.tags).toHaveLength(1);
        expect(callData.tags![0]).toBeInstanceOf(Tag);

        // Capabilities
        expect(callData.capabilities).toBeInstanceOf(Call.CallCapabilities);

        // CorrelatorData
        expect(callData.correlatorData).toBeInstanceOf(CorrelatorData);

        // Account / ACD / Trunk
        expect(callData.accountInfo).toBe("ACC001");
        expect(callData.acdCallData).toBeInstanceOf(AcdData);
        expect(callData.trunkIdentification).toBeInstanceOf(TrunkIdentification);
    });

    it("should handle missing optional fields in JSON string", () => {
        const jsonString = `{}`;
        const callData = CallData.fromJson(JSON.parse(jsonString));

        expect(callData.initialCalled).toBeNull();
        expect(callData.lastRedirecting).toBeNull();
        expect(callData.deviceCall).toBe(false);
        expect(callData.anonymous).toBe(false);
        expect(callData.callUUID).toBeNull();
        expect(callData.state).toBe(MediaState.UNKNOWN);
        expect(callData.recordState).toBeNull();
        expect(callData.tags).toBeNull();
        expect(callData.capabilities).toBeNull();
        expect(callData.correlatorData).toBeNull();
        expect(callData.accountInfo).toBeNull();
        expect(callData.acdCallData).toBeNull();
        expect(callData.trunkIdentification).toBeNull();
    });

    it("should handle correlatorData from hexaBinaryAssociatedData", () => {
        const jsonString = `{
            "hexaBinaryAssociatedData": "414243"
        }`;
        const callData = CallData.fromJson(JSON.parse(jsonString));
        expect(callData.correlatorData).toBeInstanceOf(CorrelatorData);
    });
});