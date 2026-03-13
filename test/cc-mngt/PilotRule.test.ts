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
import { PilotRule } from "../../src/o2g-node-sdk";



describe("PilotRule", () => {
    let ruleJsonString: string;

    beforeEach(() => {
        ruleJsonString = `[
            { "ruleNumber": 1, "name": "RuleA", "active": true },
            { "ruleNumber": 2, "name": "RuleB", "active": false }
        ]`;
    });

    it("should create a PilotRule from JSON", () => {
        const rulesJson = JSON.parse(ruleJsonString) as PilotRuleJson[];
        
        const rule1 = PilotRule.fromJson(rulesJson[0]);
        expect(rule1.ruleNumber).toBe(1);
        expect(rule1.name).toBe("RuleA");
        expect(rule1.active).toBe(true);

        const rule2 = PilotRule.fromJson(rulesJson[1]);
        expect(rule2.ruleNumber).toBe(2);
        expect(rule2.name).toBe("RuleB");
        expect(rule2.active).toBe(false);
    });

    it("should correctly expose all getters", () => {
        const rule = PilotRule.fromJson({ ruleNumber: 10, name: "TestRule", active: true });

        expect(rule.ruleNumber).toBe(10);
        expect(rule.name).toBe("TestRule");
        expect(rule.active).toBe(true);
    });
});