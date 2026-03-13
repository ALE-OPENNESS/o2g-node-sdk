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

import { PilotStatisticsRow } from "../../src/types/cc-stats/data/pil-stats-row";
import { StatValue } from "../../src/types/cc-stats/data/stat-value";
import { StatsPilotAttributes } from "../../src/types/cc-stats/pilot-attributes";



describe("PilotStatisticsRow", () => {
    const sampleJson = {
        date: "2026-02-21",
        queueName: "SupportQueue",
        pilotName: "Alice Johnson",
        pilotNumber: "555-1234",
        nbCallsOpen: 5,
        nbCallsBlocked: 2,
        nbCallsWOQueuing: 1,
        callProcTDur: "00:12:30",
        percentCallsBeforeTS1: "75.5"
    };

    const sampleJsonPartial = {
        pilotName: "Bob Smith",
        pilotNumber: "555-5678",
    };

    describe("constructor and fromJson", () => {
        it("initializes all fields from JSON", () => {
            const row = new PilotStatisticsRow(sampleJson);
            expect(row.pilotNameValue).toBe("Alice Johnson");
            expect(row.pilotNumberValue).toBe("555-1234");
            expect(row.queueNameValue).toBe("SupportQueue");
            expect(row.dateValue).toEqual(new Date(2026, 1, 21)); // month is zero-based
            expect(row.nbCallsOpen).toBe("5");
            expect(row.nbCallsBlocked).toBe("2");
            expect(row.nbCallsWOQueuing).toBe("1");
            expect(row.callProcTDur).toBe("00:12:30");
            expect(row.percentCallsBeforeTS1).toBe(75.5);
        });

        it("fromJson creates a valid instance", () => {
            const row = PilotStatisticsRow.fromJson(sampleJson);
            expect(row).toBeInstanceOf(PilotStatisticsRow);
            expect(row.pilotNameValue).toBe("Alice Johnson");
        });

        it("handles missing optional attributes", () => {
            const row = new PilotStatisticsRow(sampleJsonPartial);
            expect(row.pilotNameValue).toBe("Bob Smith");
            expect(row.pilotNumberValue).toBe("555-5678");
            expect(row.queueNameValue).toBeNull();
            expect(row.dateValue).toBeNull();
            expect(row.nbCallsOpen).toBeNull();
            expect(row.callProcTDur).toBeNull();
        });
    });

    describe("get method for StatsPilotAttributes", () => {
        it("returns StatValue for known attribute", () => {
            const row = new PilotStatisticsRow(sampleJson);
            const val = row.get(StatsPilotAttributes.nbCallsOpen);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asString()).toBe("5");
        });

        it("returns StatValue(null) for unknown attribute", () => {
            const row = new PilotStatisticsRow(sampleJson);
            const val = row.get(StatsPilotAttributes.ALL);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asString()).toBeNull();
        });
    });

    describe("dateValue getter", () => {
        it("parses date string correctly", () => {
            const row = new PilotStatisticsRow(sampleJson);
            const date = row.dateValue;
            expect(date).toBeInstanceOf(Date);
            expect(date?.getFullYear()).toBe(2026);
            expect(date?.getMonth()).toBe(1); // February (0-based)
            expect(date?.getDate()).toBe(21);
        });

        it("returns undefined for missing date", () => {
            const row = new PilotStatisticsRow(sampleJsonPartial);
            expect(row.dateValue).toBeNull();
        });
    });

    describe("duration and numeric getters", () => {
        it("returns durations correctly", () => {
            const row = new PilotStatisticsRow(sampleJson);
            expect(row.callProcTDur).toBe("00:12:30");
        });

        it("returns numbers correctly", () => {
            const row = new PilotStatisticsRow(sampleJson);
            expect(row.percentCallsBeforeTS1).toBe(75.5);
        });

        it("returns null for missing durations or numbers", () => {
            const row = new PilotStatisticsRow(sampleJsonPartial);
            expect(row.callProcTDur).toBeNull();
            expect(row.percentCallsBeforeTS1).toBeNull();
        });
    });
});