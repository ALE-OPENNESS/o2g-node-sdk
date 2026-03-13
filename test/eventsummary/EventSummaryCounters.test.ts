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



describe('EventSummaryCounters', () => {
    let jsonString: string;

    beforeEach(() => {
        jsonString = `{
            "missedCallsNb": 2,
            "voiceMessagesNb": 5,
            "callBackRequestsNb": 1,
            "faxNb": 0,
            "newTextNb": 7,
            "oldTextNb": 3,
            "eventWaiting": true
        }`;
    });

    it('should create an instance from JSON and populate all counters', () => {
        const json = JSON.parse(jsonString);
        const counters = EventSummaryCounters.fromJson(json);

        expect(counters.missedCallsCount).toBe(2);
        expect(counters.voiceMessagesCount).toBe(5);
        expect(counters.callBackRequestsCount).toBe(1);
        expect(counters.faxCount).toBe(0);
        expect(counters.newTextMessageCount).toBe(7);
        expect(counters.oldTextMessageCount).toBe(3);
        expect(counters.eventWaiting).toBe(true);
    });

    it('should default to 0 for counts if JSON properties are missing', () => {
        const json = {}; // empty JSON
        const counters = EventSummaryCounters.fromJson(json as any);

        expect(counters.missedCallsCount).toBe(0);
        expect(counters.voiceMessagesCount).toBe(0);
        expect(counters.callBackRequestsCount).toBe(0);
        expect(counters.faxCount).toBe(0);
        expect(counters.newTextMessageCount).toBe(0);
        expect(counters.oldTextMessageCount).toBe(0);
        expect(counters.eventWaiting).toBe(false);
    });

    it('should handle partial JSON with some properties missing', () => {
        const partialJsonString = `{
            "missedCallsNb": 4,
            "voiceMessagesNb": 2
        }`;
        const json = JSON.parse(partialJsonString);
        const counters = EventSummaryCounters.fromJson(json);

        expect(counters.missedCallsCount).toBe(4);
        expect(counters.voiceMessagesCount).toBe(2);
        expect(counters.callBackRequestsCount).toBe(0); // default
        expect(counters.faxCount).toBe(0); // default
        expect(counters.newTextMessageCount).toBe(0); // default
        expect(counters.oldTextMessageCount).toBe(0); // default
        expect(counters.eventWaiting).toBe(false); // default
    });
});