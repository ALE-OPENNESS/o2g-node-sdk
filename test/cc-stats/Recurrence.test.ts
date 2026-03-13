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

import { PeriodicityJson, ReportFrequencyJson } from "../../src/internal/types/cc-stat/cc-stat-types";
import { DayOfWeekJson } from "../../src/internal/types/common/common-types";
import { Recurrence } from "../../src/types/cc-stats/scheduled/recurrence";
import { DayOfWeek } from "../../src/types/common/day-of-week";


describe("Recurrence", () => {

    test("daily recurrence", () => {
        const daily = Recurrence.daily();
        expect(daily.daily).toBe(true);
        expect(daily.weekly).toBe(false);
        expect(daily.monthly).toBe(false);
        expect(daily.daysInWeek).toBeNull();
        expect(daily.dayInMonth).toBe(-1);

        const json = daily.toJson();
        expect(json).toEqual<ReportFrequencyJson>({ periodicity: PeriodicityJson.daily });
    });

    test("weekly recurrence", () => {
        const weekly = Recurrence.weekly(DayOfWeek.MONDAY, DayOfWeek.FRIDAY);
        expect(weekly.daily).toBe(false);
        expect(weekly.weekly).toBe(true);
        expect(weekly.monthly).toBe(false);
        expect(weekly.dayInMonth).toBe(-1);
        expect(weekly.daysInWeek).toEqual(new Set([DayOfWeek.MONDAY, DayOfWeek.FRIDAY]));

        const json = weekly.toJson();
        expect(json.periodicity).toBe(PeriodicityJson.weekly);
        expect(json.daysInWeek).toContain(DayOfWeekJson.monday);
        expect(json.daysInWeek).toContain(DayOfWeekJson.monday);
        expect(json.dayInMonth).toBeUndefined();
    });

    test("weekly recurrence throws on empty days array", () => {
        expect(() => Recurrence.weekly()).toThrow("Days array cannot be null or empty");
    });

    test("weekly recurrence throws on duplicate days", () => {
        expect(() => Recurrence.weekly(DayOfWeek.MONDAY, DayOfWeek.MONDAY))
            .toThrow("Duplicate DayOfWeek values are not allowed");
    });

    test("monthly recurrence", () => {
        const monthly = Recurrence.monthly(15);
        expect(monthly.daily).toBe(false);
        expect(monthly.weekly).toBe(false);
        expect(monthly.monthly).toBe(true);
        expect(monthly.dayInMonth).toBe(15);
        expect(monthly.daysInWeek).toBeNull();

        const json = monthly.toJson();
        expect(json.periodicity).toBe(PeriodicityJson.montly);
        expect(json.dayInMonth).toBe(15);
        expect(json.daysInWeek).toBeUndefined();
    });

    test("monthly recurrence throws on invalid day", () => {
        expect(() => Recurrence.monthly(0)).toThrow("day must be 1-31");
        expect(() => Recurrence.monthly(32)).toThrow("day must be 1-31");
    });

    test("creates a daily recurrence", () => {
        const jsonString = `{
            "periodicity": "daily"
        }`;

        const json: ReportFrequencyJson = JSON.parse(jsonString);
        const recurrence = Recurrence.fromJson(json);

        expect(recurrence).not.toBeNull();
        expect(recurrence?.daily).toBe(true);
        expect(recurrence?.weekly).toBe(false);
        expect(recurrence?.monthly).toBe(false);
        expect(recurrence?.daysInWeek).toBeNull();
        expect(recurrence?.dayInMonth).toBe(-1);
    });

    test("creates a weekly recurrence with days", () => {
        const jsonString = `{
            "periodicity": "weekly",
            "daysInWeek": ["monday", "friday"]
        }`;

        const json: ReportFrequencyJson = JSON.parse(jsonString);
        const recurrence = Recurrence.fromJson(json);

        expect(recurrence).not.toBeNull();
        expect(recurrence?.weekly).toBe(true);
        expect(recurrence?.daily).toBe(false);
        expect(recurrence?.monthly).toBe(false);

        const days = Array.from(recurrence?.daysInWeek!);
        expect(days).toContain(DayOfWeek.MONDAY);
        expect(days).toContain(DayOfWeek.FRIDAY);
        expect(recurrence?.dayInMonth).toBe(-1);
    });

    test("creates a monthly recurrence with valid day", () => {

        const jsonString = `{
            "periodicity": "monthly",
            "dayInMonth": 15
        }`;

        const json: ReportFrequencyJson = JSON.parse(jsonString);
        const recurrence = Recurrence.fromJson(json);

        expect(recurrence).not.toBeNull();
        expect(recurrence?.monthly).toBe(true);
        expect(recurrence?.daily).toBe(false);
        expect(recurrence?.weekly).toBe(false);
        expect(recurrence?.dayInMonth).toBe(15);
        expect(recurrence?.daysInWeek).toBeNull();
    });

    test("throws error if monthly recurrence has invalid day", () => {

        const jsonString = `{
            "periodicity": "monthly",
            "dayInMonth": 32
        }`;

        const json: ReportFrequencyJson = JSON.parse(jsonString);
        expect(() => Recurrence.fromJson(json)).toThrow(
            "Monthly recurrence requires a valid dayInMonth (1-31)"
        );
    });

    test("creates a null recurrence with once", () => {

        const jsonString = `{
            "periodicity": "once"
        }`;

        const json: ReportFrequencyJson = JSON.parse(jsonString);
        const recurrence = Recurrence.fromJson(json);
        expect(recurrence).toBeNull();
    });
});