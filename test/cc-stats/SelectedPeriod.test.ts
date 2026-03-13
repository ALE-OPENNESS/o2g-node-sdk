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

import { DataObservationPeriod } from "../../src/types/cc-stats/data/data-obs-period";
import { SelectedPeriod } from "../../src/types/cc-stats/data/selected-period";
import { TimeInterval } from "../../src/types/cc-stats/time-interval";

describe("SelectedPeriod", () => {

    const beginDateStr = "2026-02-21T08:00";
    const endDateStr = "2026-02-21T17:00";

    const beginDate = new Date(beginDateStr);
    const endDate = new Date(endDateStr);

    const jsonString = `{
        "periodType": "oneDay",
        "slotType": "aQuarterOfAnHour",
        "beginDate": "2026-02-21T08:00",
        "endDate": "2026-02-21T17:00"
    }`;    
    const sampleJson = JSON.parse(jsonString);

    describe("constructor", () => {
        it("should initialize all fields correctly", () => {
            const period = new SelectedPeriod(
                DataObservationPeriod.ONE_DAY,
                TimeInterval.QUARTER_HOUR,
                beginDateStr,
                endDateStr
            );

            expect(period.observationPeriod).toBe(DataObservationPeriod.ONE_DAY);
            expect(period.timeInterval).toBe(TimeInterval.QUARTER_HOUR);
            expect(period.beginDate).toEqual(beginDate);
            expect(period.endDate).toEqual(endDate);
        });
    });

    describe("fromJson", () => {
        it("should create an instance from JSON", () => {
            const period = SelectedPeriod.fromJson(sampleJson);

            expect(period).toBeInstanceOf(SelectedPeriod);
            expect(period.observationPeriod).toBe(DataObservationPeriod.ONE_DAY);
            expect(period.timeInterval).toBe(TimeInterval.QUARTER_HOUR);
            expect(period.beginDate).toEqual(beginDate);
            expect(period.endDate).toEqual(endDate);
        });
    });

    describe("getters", () => {
        const period = SelectedPeriod.fromJson(sampleJson);

        it("returns the correct observationPeriod", () => {
            expect(period.observationPeriod).toBe(DataObservationPeriod.ONE_DAY);
        });

        it("returns the correct timeInterval", () => {
            expect(period.timeInterval).toBe(TimeInterval.QUARTER_HOUR);
        });

        it("returns beginDate as Date", () => {
            const begin = period.beginDate;
            expect(begin).toBeInstanceOf(Date);
            expect(begin).toEqual(beginDate);
        });

        it("returns endDate as Date", () => {
            const end = period.endDate;
            expect(end).toBeInstanceOf(Date);
            expect(end).toEqual(endDate);
        });
    });
});