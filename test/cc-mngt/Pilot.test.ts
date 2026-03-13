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

import { Pilot } from "../../src/types/cc-mngt/pilot";
import { ServiceState } from "../../src/types/common/service-state";
import { PilotStatus } from "../../src/types/telephony/call/ccd/pilot-status";


describe("Pilot", () => {

    const pilotJsonString = `{
            "number": "10000",
            "name": "Pilot 1",
            "state": "Opened",
            "detailedState": "GENERAL_FORWARDING",
            "waitingTime": 5,
            "saturation": true,
            "rules": [
                { "ruleNumber": 1, "name": "RuleA", "active": true },
                { "ruleNumber": 2, "name": "RuleB", "active": false }
            ],
            "possibleTransfer": true,
            "supervisedTransfer": false
        }`;

    it("should create a Pilot from JSON", () => {
        const pilot = Pilot.fromJson(JSON.parse(pilotJsonString));

        expect(pilot.number).toBe("10000");
        expect(pilot.name).toBe("Pilot 1");
        expect(pilot.state).toBe(ServiceState.Opened);
        expect(pilot.detailedState).toBe(PilotStatus.GENERAL_FORWARDING);
        expect(pilot.waitingTime).toBe(5);
        expect(pilot.saturation).toBe(true);
        expect(pilot.possibleTransfer).toBe(true);
        expect(pilot.supervisedTransfer).toBe(false);

        // Test rules
        expect(pilot.rules!.length).toBe(2);
        const rule1 = pilot.rules![0];
        expect(rule1.ruleNumber).toBe(1);
        expect(rule1.name).toBe("RuleA");
        expect(rule1.active).toBe(true);

        const rule2 = pilot.rules![1];
        expect(rule2.ruleNumber).toBe(2);
        expect(rule2.name).toBe("RuleB");
        expect(rule2.active).toBe(false);
    });
});