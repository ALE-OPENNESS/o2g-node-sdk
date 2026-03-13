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

import { StatValue } from "../../src/types/cc-stats/data/stat-value";
import { StatsAgentByPilotAttributes } from "../../src/types/cc-stats/agbypilot-attributes";
import { AgentByPilotStatisticsRow } from "../../src/types/cc-stats/data/ag-by-pil-stats-row";


describe("AgentByPilotStatisticsRow", () => {
    const sampleJson = {
        pilotNumber: "12345",
        pilotName: "John Doe",
        nbCallsReceived: 10,
        nbCallsServed: 8,
        nbCallsWithHelp: 2,
        maxCallProcDur: "00:15:30", // durations as string
    };

    const sampleJsonPartial = {
        pilotNumber: "67890",
        pilotName: "Jane Smith",
    };

    describe("constructor and fromJson", () => {
        it("initializes all fields from JSON", () => {
            const row = new AgentByPilotStatisticsRow(sampleJson);
            expect(row.pilotNumber).toBe("12345");
            expect(row.pilotName).toBe("John Doe");
            expect(row.nbCallsReceived).toBe(10);
            expect(row.nbCallsServed).toBe(8);
            expect(row.nbCallsWithHelp).toBe(2);
            expect(row.maxCallProcDur).toBe("00:15:30");
        });

        it("fromJson creates a valid instance", () => {
            const row = AgentByPilotStatisticsRow.fromJson(sampleJson);
            expect(row).toBeInstanceOf(AgentByPilotStatisticsRow);
            expect(row.pilotName).toBe("John Doe");
        });

        it("handles missing optional attributes", () => {
            const row = new AgentByPilotStatisticsRow(sampleJsonPartial);
            expect(row.pilotNumber).toBe("67890");
            expect(row.pilotName).toBe("Jane Smith");
            expect(row.nbCallsReceived).toBeNull();
            expect(row.nbCallsServed).toBeNull();
            expect(row.maxCallProcDur).toBeNull();
        });
    });

    describe("get method for StatsAgentByPilotAttributes", () => {
        it("returns StatValue for known attribute", () => {
            const row = new AgentByPilotStatisticsRow(sampleJson);
            const val = row.get(StatsAgentByPilotAttributes.nbCallsReceived);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asInteger()).toBe(10);
        });

        it("returns StatValue(null) for unknown attribute", () => {
            const row = new AgentByPilotStatisticsRow(sampleJson);
            // Assuming 'ALL' is part of StatsAgentByPilotAttributes enum
            const val = row.get(StatsAgentByPilotAttributes.ALL);
            expect(val).toBeInstanceOf(StatValue);
            expect(val.asInteger()).toBeNull();
        });
    });

    describe("getters", () => {
        it("returns numeric and duration values correctly", () => {
            const row = new AgentByPilotStatisticsRow(sampleJson);
            expect(row.nbCallsReceived).toBe(10);
            expect(row.nbCallsServed).toBe(8);
            expect(row.nbCallsWithHelp).toBe(2);
            expect(row.maxCallProcDur).toBe("00:15:30");
        });

        it("returns null for missing numeric/duration values", () => {
            const row = new AgentByPilotStatisticsRow(sampleJsonPartial);
            expect(row.nbCallsReceived).toBeNull();
            expect(row.nbCallsServed).toBeNull();
            expect(row.maxCallProcDur).toBeNull();
        });
    });
});