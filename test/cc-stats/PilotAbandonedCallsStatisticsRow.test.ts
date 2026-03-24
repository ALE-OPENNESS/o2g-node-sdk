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

import { PilotAbandonedCallsStatisticsRow } from "../../src/types/cc-stats/data/pil-aband-call-stat-row";
import { PilotStatisticsRow } from "../../src/types/cc-stats/data/pil-stats-row";
import { StatValue } from "../../src/types/cc-stats/data/stat-value";
import { StatsPilotAbandonedCallsAttributes } from "../../src/types/cc-stats/pilot-abandoned-calls-attributes";
import { StatsPilotAttributes } from "../../src/types/cc-stats/pilot-attributes";


describe("PilotAbandonedCallsStatisticsRow", () => {
    const sampleJson = {
        date: "2026-02-21",
        queueName: "SupportQueue",
        pilotName: "Alice Johnson",
        pilotNumber: "555-1234",
        waitingTime: 45,
        abandonedOnGreetingVG: 1,
        abandonedOn1stWaitingVG: 1,
        abandonedOn2ndWaitingVG: 0,
        abandonedOn3rdWaitingVG: 0,
        abandonedOn4thWaitingVG: 0,
        abandonedOn5thWaitingVG: 0,
        abandonedOn6thWaitingVG: 0,
        abandonedOnRinging: 0,
        abandonedOnGeneralFwdVG: 0,
        abandonedOnBlockedVG: 0,
        abandonedOnDirectCallWaiting: 1,
    };

    const sampleJsonPartial = {
        pilotName: "Bob Smith",
        pilotNumber: "555-5678",
    };

    describe("constructor and fromJson", () => {
        it("initializes all fields from JSON", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            expect(row.pilotNameValue).toBe("Alice Johnson");
            expect(row.pilotNumberValue).toBe("555-1234");
            expect(row.queueNameValue).toBe("SupportQueue");
            expect(row.dateValue).toEqual(new Date(2026, 1, 21)); // month is zero-based
            expect(row.waitingTime).toBe(45);
            expect(row.abandonedOnGreetingVG).toBe(true);
            expect(row.abandonedOn1stWaitingVG).toBe(true);
            expect(row.abandonedOn2ndWaitingVG).toBe(false);
            expect(row.abandonedOnDirectCallWaiting).toBe(true);
        });

        it("fromJson creates a valid instance", () => {
            const row = PilotAbandonedCallsStatisticsRow.fromJson(sampleJson);
            expect(row).toBeInstanceOf(PilotAbandonedCallsStatisticsRow);
            expect(row.pilotNameValue).toBe("Alice Johnson");
        });

        it("handles missing optional attributes", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJsonPartial);
            expect(row.pilotNameValue).toBe("Bob Smith");
            expect(row.pilotNumberValue).toBe("555-5678");
            expect(row.queueNameValue).toBeNull();
            expect(row.dateValue).toBeNull();
            expect(row.waitingTime).toBeNull();
            expect(row.abandonedOnGreetingVG).toBe(false);
            expect(row.abandonedOnRinging).toBe(false);
            expect(row.abandonedOnDirectCallWaiting).toBe(false);
        });
    });

    describe("get method for StatsPilotAbandonedCallsAttributes", () => {
        it("returns StatValue for known attribute", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            const val = row.get(StatsPilotAbandonedCallsAttributes.abandonedOnGreetingVG);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asBoolean()).toBe(true);
        });

        it("returns StatValue(null) for ALL attribute", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            const val = row.get(StatsPilotAbandonedCallsAttributes.ALL);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asString()).toBeNull();
        });

        it("returns StatValue(null) for missing attribute", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJsonPartial);
            const val = row.get(StatsPilotAbandonedCallsAttributes.abandonedOnGreetingVG);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asBoolean()).toBe(false);
        });
    });

    describe("dateValue getter", () => {
        it("parses date string correctly", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            const date = row.dateValue;
            expect(date).toBeInstanceOf(Date);
            expect(date?.getFullYear()).toBe(2026);
            expect(date?.getMonth()).toBe(1); // February (0-based)
            expect(date?.getDate()).toBe(21);
        });

        it("returns null for missing date", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJsonPartial);
            expect(row.dateValue).toBeNull();
        });
    });

    describe("waitingTime getter", () => {
        it("returns waiting time in seconds", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            expect(row.waitingTime).toBe(45);
        });

        it("returns null for missing waiting time", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJsonPartial);
            expect(row.waitingTime).toBeNull();
        });
    });

    describe("boolean flag getters", () => {
        it("returns true for flags set to 1", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            expect(row.abandonedOnGreetingVG).toBe(true);
            expect(row.abandonedOn1stWaitingVG).toBe(true);
            expect(row.abandonedOnDirectCallWaiting).toBe(true);
        });

        it("returns false for flags set to 0", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJson);
            expect(row.abandonedOn2ndWaitingVG).toBe(false);
            expect(row.abandonedOn3rdWaitingVG).toBe(false);
            expect(row.abandonedOn4thWaitingVG).toBe(false);
            expect(row.abandonedOn5thWaitingVG).toBe(false);
            expect(row.abandonedOn6thWaitingVG).toBe(false);
            expect(row.abandonedOnRinging).toBe(false);
            expect(row.abandonedOnGeneralFwdVG).toBe(false);
            expect(row.abandonedOnBlockedVG).toBe(false);
        });

        it("returns false for absent flags", () => {
            const row = new PilotAbandonedCallsStatisticsRow(sampleJsonPartial);
            expect(row.abandonedOnGreetingVG).toBe(false);
            expect(row.abandonedOn1stWaitingVG).toBe(false);
            expect(row.abandonedOn2ndWaitingVG).toBe(false);
            expect(row.abandonedOn3rdWaitingVG).toBe(false);
            expect(row.abandonedOn4thWaitingVG).toBe(false);
            expect(row.abandonedOn5thWaitingVG).toBe(false);
            expect(row.abandonedOn6thWaitingVG).toBe(false);
            expect(row.abandonedOnRinging).toBe(false);
            expect(row.abandonedOnGeneralFwdVG).toBe(false);
            expect(row.abandonedOnBlockedVG).toBe(false);
            expect(row.abandonedOnDirectCallWaiting).toBe(false);
        });

        it("each flag can be independently set", () => {
            const json = { ...sampleJsonPartial, abandonedOnRinging: 1, abandonedOnBlockedVG: 1 };
            const row = new PilotAbandonedCallsStatisticsRow(json);
            expect(row.abandonedOnRinging).toBe(true);
            expect(row.abandonedOnBlockedVG).toBe(true);
            expect(row.abandonedOnGreetingVG).toBe(false);
            expect(row.abandonedOnDirectCallWaiting).toBe(false);
        });
    });
});