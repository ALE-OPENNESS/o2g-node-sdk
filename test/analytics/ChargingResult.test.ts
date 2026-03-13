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

import { ChargingResultJson } from "../../src/internal/types/analytics/analytics-types";
import { ChargingResult } from "../../src/types/analytics/charging-result";
import { DateRange } from "../../src/types/common/date-range";


describe("ChargingResult", () => {
    let jsonString: string;
    let json: ChargingResultJson;
    let result: ChargingResult;
    let dateRange: DateRange;

    beforeEach(() => {
        // Example date range for the charging result
        
        dateRange = new DateRange(new Date("2026-02-01T00:00:00"), new Date("2026-02-01T23:59:59"));

        // JSON string representing a ChargingResult
        jsonString = `{
            "chargings": [
                { "caller": "1000", "called": "1001", "duration": 70, "callType": "PublicNetworkCall", "initialDialledNumber": "3000" },
                { "caller": "1003", "called": "1004", "duration": 7, "callType": "LocalNode" }
            ],
            "nbChargingFiles": 3,
            "totalTicketNb": 10,
            "valuableTicketNb": 5
        }`;

        json = JSON.parse(jsonString);
        result = ChargingResult.fromJson(json, dateRange);
    });

    test("should create ChargingResult from JSON", () => {
        expect(result).toBeInstanceOf(ChargingResult);
    });

    test("should have correct chargings", () => {
        expect(result.chargings.length).toBe(2);
        expect(result.chargings[0].caller).toBe("1000");
        expect(result.chargings[0].called).toBe("1001");
        expect(result.chargings[0].duration).toBe(70);
    });

    test("should have correct range", () => {
        expect(result.range).toBe(dateRange);
        expect(result.range?.from).toEqual(dateRange.from);
        expect(result.range?.to).toEqual(dateRange.to);
    });

    test("should have correct statistics", () => {
        expect(result.chargingFilesCount).toBe(3);
        expect(result.totalTicketCount).toBe(10);
        expect(result.valuableTicketCount).toBe(5);
    });

    test("should default optional statistics to 0", () => {
        const emptyResult = ChargingResult.fromJson({ chargings: [] }, null);
        expect(emptyResult.chargingFilesCount).toBe(0);
        expect(emptyResult.totalTicketCount).toBe(0);
        expect(emptyResult.valuableTicketCount).toBe(0);
    });
});