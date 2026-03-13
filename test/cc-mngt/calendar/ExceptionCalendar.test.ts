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

import { ExceptionCalendar } from "../../../src/types/cc-mngt/calendar/exception-calendar";


describe("ExceptionCalendar", () => {
    let calendar: ExceptionCalendar;

    beforeEach(() => {
        const jsonString = `{
            "calendar": [
                {
                    "date": "20260714",
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
                    "date": "20261225",
                    "list": [
                        { 
                            "number": 1, 
                            "transition" : { "time": "09:30", "ruleNumber": 3, "mode": "forward" }
                        }
                    ]
                }
            ]
        }`;

        calendar = ExceptionCalendar.fromJson(JSON.parse(jsonString));
    });

    test("should parse exceptional dates correctly", () => {

        const dates = calendar.exceptionDates;
        expect(dates.size).toBe(2);

        expect(dates).toContainEqual(new Date(2026, 6, 14));
        expect(dates).toContainEqual(new Date(2026, 11, 25));
    });

    test("should get all transitions for a specific date", () => {
        const feb14 = new Date(2026, 6, 14);
        const transitions = calendar.getTransitions(feb14);
        expect(transitions!.length).toBe(2);
        expect(transitions![0].time.toString()).toBe("08:00");
        expect(transitions![1].time.toString()).toBe("12:00");

        const dec25 = new Date(2026, 11, 25);
        const decTransitions = calendar.getTransitions(dec25);
        expect(decTransitions!.length).toBe(1);
        expect(decTransitions![0].time.toString()).toBe("09:30");
    });

    test("should get transition at specific index", () => {
        const feb14 = new Date(2026, 6, 14);
        const transition = calendar.getTransitionAt(feb14, 1);
        expect(transition?.ruleNumber).toBe(2);

        const undefinedTransition = calendar.getTransitionAt(feb14, 5);
        expect(undefinedTransition).toBeUndefined();
    });

    test("should return empty array for date with no transitions", () => {
        const emptyDate = new Date("2026-01-01");
        expect(calendar.getTransitions(emptyDate)).toBeNull();
    });
});