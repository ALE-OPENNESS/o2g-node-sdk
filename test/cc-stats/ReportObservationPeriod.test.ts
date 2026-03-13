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

import { ScheduledSelPeriodJson } from "../../src/internal/types/cc-stat/cc-stat-types";
import { ReportObservationPeriod } from "../../src/types/cc-stats/scheduled/report-obs-period";


describe("ReportObservationPeriod", () => {

    test("onCurrentDay creates correct period", () => {
        const period = ReportObservationPeriod.onCurrentDay();
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_DAY);
        expect(period.lastUnits).toBe(-1);
        expect(period.beginDate).toBeNull();
        expect(period.endDate).toBeNull();

        const json: ScheduledSelPeriodJson = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.CURRENT_DAY });
    });

    test("onCurrentWeek creates correct period", () => {
        const period = ReportObservationPeriod.onCurrentWeek();
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_WEEK);
        expect(period.lastUnits).toBe(-1);

        const json = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.CURRENT_WEEK });
    });

    test("onCurrentMonth creates correct period", () => {
        const period = ReportObservationPeriod.onCurrentMonth();
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_MONTH);

        const json = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.CURRENT_MONTH });
    });

    test("onLastDays creates correct period and validates range", () => {
        const period = ReportObservationPeriod.onLastDays(7);
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_DAYS);
        expect(period.lastUnits).toBe(7);

        expect(() => ReportObservationPeriod.onLastDays(0)).toThrow(RangeError);
        expect(() => ReportObservationPeriod.onLastDays(32)).toThrow(RangeError);

        const json = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.LAST_DAYS, lastNb: 7 });
    });

    test("onLastWeeks creates correct period and validates range", () => {
        const period = ReportObservationPeriod.onLastWeeks(3);
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_WEEKS);
        expect(period.lastUnits).toBe(3);

        expect(() => ReportObservationPeriod.onLastWeeks(0)).toThrow(RangeError);
        expect(() => ReportObservationPeriod.onLastWeeks(5)).toThrow(RangeError);

        const json = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.LAST_WEEKS, lastNb: 3 });
    });

    test("onLastMonth creates correct period", () => {
        const period = ReportObservationPeriod.onLastMonth();
        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_MONTHS);
        expect(period.lastUnits).toBe(1);

        const json = period.toJson();
        expect(json).toEqual({ periodType: ReportObservationPeriod.PeriodType.LAST_MONTHS, lastNb: 1 });
    });

    test("fromDate creates correct period and validates input", () => {
        const from = new Date("2026-01-01T00:00:00Z");
        const nbDays = 5;
        const period = ReportObservationPeriod.fromDate(from, nbDays);

        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.FROM_DATE_TO_DATE);
        expect(period.lastUnits).toBe(-1);
        expect(period.beginDate?.toISOString()).toBe(from.toISOString());
        expect(period.endDate?.toISOString()).toBe(new Date(from.getTime() + nbDays * 24 * 60 * 60 * 1000).toISOString());

        // from must not be null
        expect(() => ReportObservationPeriod.fromDate(null as unknown as Date, 5)).toThrow();
        // from must be in the past
        expect(() => ReportObservationPeriod.fromDate(new Date(Date.now() + 1000), 5)).toThrow();
        // nbDays range
        expect(() => ReportObservationPeriod.fromDate(from, 0)).toThrow(RangeError);
        expect(() => ReportObservationPeriod.fromDate(from, 32)).toThrow(RangeError);

        const json = period.toJson();
        expect(json.periodType).toBe(ReportObservationPeriod.PeriodType.FROM_DATE_TO_DATE);
        expect(json.beginDate).toBe(from.toISOString());
        expect(json.endDate).toBe(new Date(from.getTime() + nbDays * 24 * 60 * 60 * 1000).toISOString());
    });


    test("creates a current day period", () => {

        const jsonString = `{
            "periodType": "currentDay"
        }`;

        const json: ScheduledSelPeriodJson = JSON.parse(jsonString);
        const period = ReportObservationPeriod.fromJson(json);

        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_DAY);
        expect(period.lastUnits).toBe(-1);
        expect(period.beginDate).toBeNull();
        expect(period.endDate).toBeNull();
    });

    test("creates a last N days period", () => {
        const jsonString = `{
            "periodType": "lastDays",
            "lastNb": 7
        }`;

        const json: ScheduledSelPeriodJson = JSON.parse(jsonString);
        const period = ReportObservationPeriod.fromJson(json);

        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_DAYS);
        expect(period.lastUnits).toBe(7);
        expect(period.beginDate).toBeNull();
        expect(period.endDate).toBeNull();
    });

    test("creates a last N weeks period", () => {
        const jsonString = `{
            "periodType": "lastWeeks",
            "lastNb": 2
        }`;

        const json: ScheduledSelPeriodJson = JSON.parse(jsonString);
        const period = ReportObservationPeriod.fromJson(json);

        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_WEEKS);
        expect(period.lastUnits).toBe(2);
        expect(period.beginDate).toBeNull();
        expect(period.endDate).toBeNull();
    });

    test("creates a fromDateToDate period", () => {
        const jsonString = `{
            "periodType": "fromDateToDate",
            "beginDate": "2026-02-10T01:00",
            "endDate": "2026-02-20T01:00"
        }`;

        const json: ScheduledSelPeriodJson = JSON.parse(jsonString);
        const period = ReportObservationPeriod.fromJson(json);

        expect(period.periodType).toBe(ReportObservationPeriod.PeriodType.FROM_DATE_TO_DATE);
        expect(period.beginDate!.toISOString()).toBe(new Date("2026-02-10T01:00").toISOString());
        expect(period.endDate!.toISOString()).toBe(new Date("2026-02-20T01:00").toISOString());
        expect(period.lastUnits).toBe(-1);
    });
});