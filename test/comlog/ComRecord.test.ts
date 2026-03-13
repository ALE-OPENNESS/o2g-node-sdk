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

import { ComRecord } from "../../src/types/comlog/com-record";



describe('ComHistoryRecord', () => {

    const jsonString = `{
        "recordId" : 2,
        "comRef": "abcdefg0123",
        "acknowledged": false,
        "participants": [
            {
                "role": "CALLER",
                "answered": true,
                "identity": {
                    "id": { "phoneNumber": "2000"},
                    "firstName": "bob",
                    "lastName": "famousBob",
                    "type": { "main": "DEVICE" }
                },
                "initialCalled": {
                    "id": { "phoneNumber": "3000"},
                    "firstName": "alice",
                    "lastName": "famousAlice",
                    "type": { "main": "DEVICE" }
                },
                "reason": "NORMAL",
                "leg": "2001"
            },
            {
                "role": "CALLEE",
                "answered": true,
                "identity": {
                    "id": { "phoneNumber": "3000"},
                    "firstName": "alice",
                    "lastName": "famousAlice",
                    "type": { "main": "DEVICE" }
                },
                "reason": "NORMAL"
            }
        ],
        "beginDate": "2026-02-16T18:30:00.000Z",
        "endDate": "2026-02-16T18:35:00.000Z",
        "convDate": "2026-02-16T18:30:20.000Z"
    }`;

    it('should deserialize from JSON and populate all fields', () => {
        const record = ComRecord.fromJson(JSON.parse(jsonString));

        expect(record.id).toBe(2);
        expect(record.comRef).toBe("abcdefg0123");
        expect(record.acknowledged).toBe(false);
        expect(record.participants).toHaveLength(2);
        expect(record.participants![0].identity.id.phoneNumber).toBe("2000");
        expect(record.participants![0].identity.firstName).toBe("bob");
        expect(record.beginDate!.toISOString()).toBe("2026-02-16T18:30:00.000Z");
        expect(record.endDate!.toISOString()).toBe("2026-02-16T18:35:00.000Z");
        expect(record.convDate!.toISOString()).toBe("2026-02-16T18:30:20.000Z");
    });

});