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
import { StatisticsData } from "../../src/types/cc-stats/data/stats-data";
import { TimeInterval } from "../../src/types/cc-stats/time-interval";

// Mock JSON input
const statDataJson = {
    supervisor: "John Doe",
    agentsStats: [
        {
            timeSlot: "2026-02-25T00:00",
            selectedPeriod: {
                "periodType": "oneDay",
                "slotType": "aQuarterOfAnHour",
                "beginDate": "2026-02-21T00:00",
                "endDate": "2026-02-21T15:00"
            },
            rows: [
                {
                    date: "2026-02-21", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                    nbRotating: 3,
                    nbPickedUp: 7
                },
                {
                    date: "2026-02-22", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                    nbRotating: 3,
                    nbPickedUp: 7
                }
            ]
        },
        {
            timeSlot: "2026-02-25T15:00",
            selectedPeriod: {
                "periodType": "oneDay",
                "slotType": "aQuarterOfAnHour",
                "beginDate": "2026-02-25T00:00",
                "endDate": "2026-02-25T15:00"
            },
            rows: [
                {
                    date: "2026-02-21", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                    nbRotating: 8,
                    nbPickedUp: 2
                },
                {
                    date: "2026-02-22", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                    nbRotating: 9,
                    nbPickedUp: 3
                }
            ]
        }
    ]

} as any;

describe("StatisticsData", () => {
    let stat: StatisticsData;

    beforeEach(() => {
        stat = StatisticsData.fromJson(statDataJson);
    });

    it("should initialize correctly from JSON", () => {
        expect(stat.requesterId).toBe("John Doe");

        let agentsStats = stat.agentsStats;
        expect(Array.isArray(agentsStats)).toBe(true);
        expect(agentsStats?.length).toBe(2);
        expect(agentsStats![0].timeSlot).toEqual(new Date("2026-02-25T00:00"));
        expect(agentsStats![0].selectedPeriod!.timeInterval).toBe(TimeInterval.QUARTER_HOUR);
        expect(agentsStats![0].selectedPeriod!.observationPeriod).toBe(DataObservationPeriod.ONE_DAY);
        expect(agentsStats![0].selectedPeriod!.beginDate).toEqual(new Date("2026-02-21T00:00"));
    });

});