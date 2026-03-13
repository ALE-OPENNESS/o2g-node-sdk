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

import { PilotRuleJson } from "../../src/internal/types/cc-mngt/cc-mntg-types";
import { PilotRuleSet } from "../../src/types/cc-mngt/pilot-rule-set";




describe("PilotRuleSet", () => {
    let ruleSetJsonString: string;

    beforeEach(() => {
        ruleSetJsonString = `[
            { "ruleNumber": 1, "name": "RuleA", "active": true },
            { "ruleNumber": 2, "name": "RuleB", "active": false },
            { "ruleNumber": 3, "name": "RuleC", "active": true }
        ]`;
    });

    it("should create a PilotRuleSet from JSON", () => {
        const rulesJson = JSON.parse(ruleSetJsonString) as PilotRuleJson[];
        const ruleSet = PilotRuleSet.fromJson(rulesJson);

        expect(ruleSet.rules.length).toBe(3);

        // Test that each rule exists and has correct properties
        const rule1 = ruleSet.get(1);
        expect(rule1).toBeDefined();
        expect(rule1!.name).toBe("RuleA");
        expect(rule1!.active).toBe(true);

        const rule2 = ruleSet.get(2);
        expect(rule2).toBeDefined();
        expect(rule2!.name).toBe("RuleB");
        expect(rule2!.active).toBe(false);

        const rule3 = ruleSet.get(3);
        expect(rule3).toBeDefined();
        expect(rule3!.name).toBe("RuleC");
        expect(rule3!.active).toBe(true);
    });

    it("should correctly report if rules exist", () => {
        const rulesJson = JSON.parse(ruleSetJsonString) as PilotRuleJson[];
        const ruleSet = PilotRuleSet.fromJson(rulesJson);

        expect(ruleSet.contains(1)).toBe(true);
        expect(ruleSet.contains(2)).toBe(true);
        expect(ruleSet.contains(3)).toBe(true);
        expect(ruleSet.contains(99)).toBe(false);
    });

    it("should return correct rule numbers", () => {
        const rulesJson = JSON.parse(ruleSetJsonString) as PilotRuleJson[];
        const ruleSet = PilotRuleSet.fromJson(rulesJson);

        const numbers = ruleSet.rulesNumbers;
        expect(numbers.has(1)).toBe(true);
        expect(numbers.has(2)).toBe(true);
        expect(numbers.has(3)).toBe(true);
        expect(numbers.has(99)).toBe(false);
    });

    it("should return all rules as an array", () => {
        const rulesJson = JSON.parse(ruleSetJsonString) as PilotRuleJson[];
        const ruleSet = PilotRuleSet.fromJson(rulesJson);

        const rulesArray = ruleSet.rules;
        expect(rulesArray.length).toBe(3);
        expect(rulesArray.map(r => r.ruleNumber).sort()).toEqual([1, 2, 3]);
    });
});