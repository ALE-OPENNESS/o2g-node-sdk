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

import { ComRecord, ComRecordParticipant } from "../../../src/o2g-node-sdk";
import { OnComRecordCreated, OnComRecordModified, OnComRecordsAck, OnComRecordsDeleted, OnComRecordsUnAck } from "../../../src/types/comlog/comlog-events";
import { Role } from "../../../src/types/comlog/role";
import { Participant } from "../../../src/types/telephony/call/participant";


describe('Communication Log Event Classes', () => {

    const jsonRecordEventString = `{
        "loginName": "oxe1000",
        "record": {
            "recordId": 1,
            "comRef": "1111abcdef",
            "acknowledged": false,
            "beginDate": "2026-02-28T10:00:00Z",
            "endDate": "2026-02-28T10:05:00Z",
            "participants": [
                {
                    "identity": {
                        "id": { "phoneNumber": "12000" },
                        "displayName": "Alice"
                    },
                    "role": "CALLER",
                    "answered": true
                },
                {
                    "identity": {
                        "id": { "phoneNumber": "12001" },
                        "displayName": "Bob"
                    },
                    "role": "CALLEE",
                    "answered": true
                }
            ]
        }
    }`;

    it('OnComRecordCreated should parse JSON correctly', () => {

        const event = OnComRecordCreated.fromJson(JSON.parse(jsonRecordEventString));

        expect(event).toBeInstanceOf(OnComRecordCreated);
        expect(event.loginName).toBe("oxe1000");
        expect(event.record).toBeInstanceOf(ComRecord);
        expect(event.record.id).toBe(1);
        expect(event.record.comRef).toBe("1111abcdef");
        expect(event.record.participants?.[0].identity.displayName).toBe("Alice");
        expect(event.record.participants?.[0].identity.id.phoneNumber).toBe("12000");
        expect(event.record.participants?.[0].role).toBe(Role.CALLER);
        expect(event.record.participants?.[1].identity.displayName).toBe("Bob");
        expect(event.record.participants?.[1].role).toBe(Role.CALLEE);
        expect(event.record.participants?.[1].identity.id.phoneNumber).toBe("12001");
    });

    it('OnComRecordModified should parse JSON correctly', () => {
        const event = OnComRecordModified.fromJson(JSON.parse(jsonRecordEventString));

        expect(event).toBeInstanceOf(OnComRecordModified);
        expect(event.loginName).toBe("oxe1000");
        expect(event.record).toBeInstanceOf(ComRecord);
        expect(event.record.id).toBe(1);
        expect(event.record.comRef).toBe("1111abcdef");
        expect(event.record.participants?.[0].identity.displayName).toBe("Alice");
        expect(event.record.participants?.[0].identity.id.phoneNumber).toBe("12000");
        expect(event.record.participants?.[0].role).toBe(Role.CALLER);
        expect(event.record.participants?.[1].identity.displayName).toBe("Bob");
        expect(event.record.participants?.[1].role).toBe(Role.CALLEE);
        expect(event.record.participants?.[1].identity.id.phoneNumber).toBe("12001");
    });

    it('OnComRecordsAck should parse JSON correctly with IDs', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "recordIds": [1, 3, 5]
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsAck.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsAck);
        expect(event.loginName).toBe("oxe1000");
        expect(event.recordIds).toEqual([1, 3, 5]);
    });

    it('OnComRecordsAck should parse JSON correctly without IDs (all records)', () => {
        const jsonString = `{
          "loginName": "oxe1001"
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsAck.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsAck);
        expect(event.loginName).toBe("oxe1001");
        expect(event.recordIds).toBeNull(); // all records are concerned
    });

    it('OnComRecordsDeleted should parse JSON correctly', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "recordIds": [2, 4]
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsDeleted.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsDeleted);
        expect(event.loginName).toBe("oxe1000");
        expect(event.recordIds).toEqual([2, 4]);
    });

    it('OnComRecordsDeleted should parse JSON correctly without IDs (all records)', () => {
        const jsonString = `{
            "loginName": "oxe1000"
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsDeleted.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsDeleted);
        expect(event.loginName).toBe("oxe1000");
        expect(event.recordIds).toBeNull(); // all records are concerned
    });

    it('OnComRecordsUnAck should parse JSON correctly', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "recordIds": [7, 8]
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsUnAck.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsUnAck);
        expect(event.loginName).toBe("oxe1000");
        expect(event.recordIds).toEqual([7, 8]);
    });

    it('OnComRecordsUnAck should parse JSON correctly without IDs (all records)', () => {
        const jsonString = `{
            "loginName": "oxe1000"
        }`;

        const json = JSON.parse(jsonString);
        const event = OnComRecordsUnAck.fromJson(json);

        expect(event).toBeInstanceOf(OnComRecordsUnAck);
        expect(event.loginName).toBe("oxe1000");
        expect(event.recordIds).toBeNull(); // all records are concerned
    });

});