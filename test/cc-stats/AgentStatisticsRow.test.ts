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
import { StatsAgentAttributes } from "../../src/types/cc-stats/agent-attributes";
import { AgentByPilotStatisticsRow } from "../../src/types/cc-stats/data/ag-by-pil-stats-row";
import { AgentStatisticsRow } from "../../src/types/cc-stats/data/ag-stats-row";

// Mock JSON input
const mockJson = {
    date: "2026-02-21",
    login: "agent123",
    operator: "Op1",
    firstName: "John",
    lastName: "Doe",
    number: "1001",
    group: "Support",
    pilotAgentStatsRows: [
        {
            pilotName: "Pilot1",
            nbCalls: 5
        }
    ],
    nbRotating: 3,
    nbPickedUp: 7
} as any;

describe("AgentStatisticsRow", () => {
    let row: AgentStatisticsRow;

    beforeEach(() => {
        row = new AgentStatisticsRow(mockJson);
    });

    it("should initialize correctly from JSON", () => {
        expect(row.login).toBe("agent123");
        expect(row.operator).toBe("Op1");
        expect(row.firstName).toBe("John");
        expect(row.lastName).toBe("Doe");
        expect(row.number).toBe("1001");
        expect(row.group).toBe("Support");
        expect(row.date).toBeInstanceOf(Date);
    });

    it("should map pilotAgentStatsRows correctly", () => {
        expect(row.pilotAgentStatsRows).toHaveLength(1);
        expect(row.pilotAgentStatsRows?.[0]).toBeInstanceOf(AgentByPilotStatisticsRow);
        expect(row.pilotAgentStatsRows?.[0].pilotName).toBe("Pilot1");
    });

    it("should return StatValue for numeric attributes", () => {
        const nbRotating = row.get(StatsAgentAttributes.nbRotating);
        expect(nbRotating).toBeInstanceOf(StatValue);
        expect(nbRotating.asInteger()).toBe(3);

        const nbPickedUp = row.get(StatsAgentAttributes.nbPickedUp);
        expect(nbPickedUp.asInteger()).toBe(7);
    });

    it("should return null StatValue for unknown attribute", () => {
        const unknown = row.get("unknownAttr" as StatsAgentAttributes);
        expect(unknown).toBeInstanceOf(StatValue);
        expect(unknown.asInteger()).toBeNull();
    });

    it("should handle undefined optional fields gracefully", () => {
        const emptyRow = new AgentStatisticsRow({});
        expect(emptyRow.login).toBeNull();
        expect(emptyRow.date).toBeNull();
        expect(emptyRow.get(StatsAgentAttributes.nbRotating).asInteger()).toBeNull();
    });
});