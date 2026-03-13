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

import { EventSummaryCounters } from "../../src/types/eventsummary/event-summary-counter";
import { OnEventSummaryUpdated } from "../../src/types/eventsummary/event-summary-events";


describe('OnEventSummaryUpdated', () => {

    it('should create an instance from JSON', () => {
        // Example JSON string
        const jsonString = `{
            "loginName": "oxe1000",
            "eventSummary": {
                "missedCallsNb": 5,
                "voiceMessagesNb": 2,
                "callBackRequestsNb": 3,
                "newTextNb": 2,
                "eventWaiting": true
            }
        }`;

        // Parse JSON string as object
        const json = JSON.parse(jsonString);

        // Create event from JSON
        const event = OnEventSummaryUpdated.fromJson(json);

        // Assertions
        expect(event).toBeInstanceOf(OnEventSummaryUpdated);
        expect(event.loginName).toBe("oxe1000");

        const counters = event.eventSummary;
        expect(counters).toBeInstanceOf(EventSummaryCounters);
        expect(counters.missedCallsCount).toBe(5);
        expect(counters.voiceMessagesCount).toBe(2);
        expect(counters.callBackRequestsCount).toBe(3);
        expect(counters.newTextMessageCount).toBe(2);
        expect(counters.eventWaiting).toBe(true);
    });

});