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

import { OnPilotCallQueued } from "../../../src/types/cc-pilot/cc-pilot-events";
import { CallCause } from "../../../src/types/telephony/call/call-cause";

describe('OnPilotCallQueued', () => {

    it('should correctly create an instance from JSON with queue and queuedCallsCount', () => {
        const jsonString = `{
            "pilot": "33000",
            "caller": "01235642",
            "queue": "Q123",
            "callRef": "123456abcdef",
            "cause": "DISTRIBUTED",
            "numberOfQueued": 5
        }`;

        const event = OnPilotCallQueued.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnPilotCallQueued);
        expect(event.pilot).toBe('33000');
        expect(event.caller).toBe('01235642');
        expect(event.queue).toBe('Q123');
        expect(event.callRef).toBe('123456abcdef');
        expect(event.cause).toBe(CallCause.DISTRIBUTED);
        expect(event.queuedCallsCount).toBe(5);
    });

    it('should correctly create an instance from JSON without queue and queuedCallsCount', () => {
        const jsonString = `{
            "pilot": "33000",
            "caller": "01235642",
            "callRef": "123456abcdef",
            "cause": "DISTRIBUTED"
        }`;

        const event = OnPilotCallQueued.fromJson(JSON.parse(jsonString));

        expect(event.pilot).toBe('33000');
        expect(event.caller).toBe('01235642');
        expect(event.queue).toBeNull();
        expect(event.callRef).toBe('123456abcdef');
        expect(event.cause).toBe(CallCause.DISTRIBUTED);
        expect(event.queuedCallsCount).toBe(-1);
    });
});