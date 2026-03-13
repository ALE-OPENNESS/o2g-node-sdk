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

import { AgentGroupsJson } from "../../src/internal/types/cc-agent/cc-agent-types";
import { AgentGroups } from "../../src/types/cc-agent/agent-groups";


describe("AgentGroups", () => {

    it("should create an instance from JSON with groups", () => {
        const json: AgentGroupsJson = {
            preferred: "groupA",
            groups: ["groupA", "groupB", "groupC"],
        };

        const agentGroups = AgentGroups.fromJson(json);

        expect(agentGroups).toBeInstanceOf(AgentGroups);
        expect(agentGroups.preferred).toBe("groupA");
        expect(agentGroups.groups).toEqual(["groupA", "groupB", "groupC"]);
    });

    it("should handle JSON without groups (default to empty array)", () => {
        const json: AgentGroupsJson = {
            preferred: "groupA"
        };

        const agentGroups = AgentGroups.fromJson(json);

        expect(agentGroups).toBeInstanceOf(AgentGroups);
        expect(agentGroups.preferred).toBe("groupA");
        expect(agentGroups.groups).toEqual([]);
    });

    it("should preserve empty groups array if provided", () => {
        const json: AgentGroupsJson = {
            preferred: "groupA",
            groups: [],
        };

        const agentGroups = AgentGroups.fromJson(json);

        expect(agentGroups.groups).toEqual([]);
    });
});