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

import { DayOfWeek } from "../../../src/o2g-node-sdk";
import { NormalCalendar } from "../../../src/types/cc-mngt/calendar/normal-calendar";
import { PilotOperatingMode } from "../../../src/types/cc-mngt/calendar/pilot-operating-Mode";



describe("NormalCalendar", () => {
    let calendar: NormalCalendar;

    beforeEach(() => {
        const jsonString = `{
            "calendar": [
                {
                    "day": "monday",
                    "list": [
                        { 
                            "number": 1, 
                            "transition" : { "time": "08:00", "ruleNumber": 1, "mode": "normal" }
                        },
                        { 
                            "number": 2, 
                            "transition" : { "time": "12:00", "ruleNumber": 2, "mode": "closed" }
                        }
                    ]
                },
                {
                    "day": "tuesday",
                    "list": [
                        { 
                            "number": 1, 
                            "transition" : { "time": "09:30", "ruleNumber": 3, "mode": "forward" }
                        }
                    ]
                }
            ]
        }`;
        calendar = NormalCalendar.fromJson(JSON.parse(jsonString));
    });

    test("should parse days correctly", () => {
        const days = Array.from(calendar.days);
        expect(days).toContain(DayOfWeek.MONDAY);
        expect(days).toContain(DayOfWeek.TUESDAY);
        expect(days.length).toBe(2);
    });

    test("should get all transitions for a day", () => {
        const mondayTransitions = calendar.getTransitions(DayOfWeek.MONDAY);
        expect(mondayTransitions!.length).toBe(2);

        expect(mondayTransitions![0].time.toString()).toBe("08:00");
        expect(mondayTransitions![0].mode).toBe(PilotOperatingMode.NORMAL)
        expect(mondayTransitions![1].time.toString()).toBe("12:00");
        expect(mondayTransitions![1].mode).toBe(PilotOperatingMode.CLOSED)


        const tuesdayTransitions = calendar.getTransitions(DayOfWeek.TUESDAY);
        expect(tuesdayTransitions!.length).toBe(1);

        expect(tuesdayTransitions![0].time.toString()).toBe("09:30");
        expect(tuesdayTransitions![0].mode).toBe(PilotOperatingMode.FORWARD)
    });

    test("should get transition at specific index", () => {
        const transition = calendar.getransitionAt(DayOfWeek.MONDAY, 1);
        expect(transition?.ruleNumber).toBe(2);

        const undefinedTransition = calendar.getransitionAt(DayOfWeek.MONDAY, 5);
        expect(undefinedTransition).toBeUndefined();
    });

    test("should return empty array for day with no transitions", () => {
        const wednesdayTransitions = calendar.getTransitions(DayOfWeek.WEDNESDAY);
        expect(wednesdayTransitions).toBeNull();
    });
});