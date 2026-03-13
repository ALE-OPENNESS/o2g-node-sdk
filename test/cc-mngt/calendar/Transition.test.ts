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

import { PilotTransitionJson } from "../../../src/internal/types/cc-mngt/cc-mntg-types";
import { Transition } from "../../../src/o2g-node-sdk";
import { PilotOperatingMode } from "../../../src/types/cc-mngt/calendar/pilot-operating-Mode";


describe("Transition", () => {
    let json: PilotTransitionJson;
    let transition: Transition;

    beforeEach(() => {
        const jsonString = `{
            "time": "14:30",
            "ruleNumber": 5,
            "mode": "normal"
        }`;
        json = JSON.parse(jsonString);
        transition = Transition.fromJson(json);
    });

    test("should parse from JSON correctly", () => {
        expect(transition.ruleNumber).toBe(5);
        expect(transition.mode).toBe(PilotOperatingMode.NORMAL);

        const time = transition.time;
        expect(time.hour).toBe(14);
        expect(time.minute).toBe(30);
    });

    test("should serialize to JSON correctly", () => {
        const serialized = transition.toJson();

        expect(serialized.time).toBe("14:30");
        expect(serialized.ruleNumber).toBe(5);
        expect(serialized.mode).toBe("normal");
    });

    test("Transition.Time should parse valid time strings", () => {
        const time = Transition.Time.parse("09:05");
        expect(time.hour).toBe(9);
        expect(time.minute).toBe(5);
        expect(time.toString()).toBe("09:05");
    });

    test("Transition.Time should throw on invalid strings", () => {
        expect(() => Transition.Time.parse("")).toThrow();
        expect(() => Transition.Time.parse("24:00")).toThrow();
        expect(() => Transition.Time.parse("12:60")).toThrow();
        expect(() => Transition.Time.parse("abc")).toThrow();
    });

    test("Transition.Time.toString pads single digits", () => {
        const time = new Transition.Time(3, 7);
        expect(time.toString()).toBe("03:07");
    });
});
