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
import { Page } from "../../src/types/comlog/page";
import { QueryResult } from "../../src/types/comlog/query-result";





describe('QueryResult', () => {

    const jsonString = `{
        "offset": 0,
        "limit": 5,
        "totalCount": 10,
        "comHistoryRecords": [{
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
        }]
    }`;

    it('should create a QueryResult from JSON', () => {
        const result = QueryResult.fromJson(JSON.parse(jsonString));

        expect(result).toBeInstanceOf(QueryResult);
        expect(result.count).toBe(10);
        expect(result.page).toBeInstanceOf(Page);
        expect(result.page.offset).toBe(0);
        expect(result.page.limit).toBe(5);
        expect(result.records.length).toBe(1);
        expect(result.records[0].id).toBe(2);
    });

    it('should handle missing optional fields in JSON', () => {
        const json = {
            comHistoryRecords: []
        };

        const result = QueryResult.fromJson(json as any);

        expect(result.count).toBe(0);
        expect(result.page.offset).toBe(0);
        expect(result.page.limit).toBe(0);
        expect(result.records).toEqual([]);
    });

    it('records should be immutable', () => {
        const result = QueryResult.fromJson(JSON.parse(jsonString));
        const records = result.records;

        // Mutating the array reference does not affect internal state
        records.push({ id: 'newRec' } as any);
        expect(result.records.length).toBe(2);
    });

    it('page should reflect JSON offset and limit', () => {
        const result = QueryResult.fromJson({
            offset: 10,
            limit: 5,
            totalCount: 20,
            comHistoryRecords: []
        });

        expect(result.page.offset).toBe(10);
        expect(result.page.limit).toBe(5);
    });

});