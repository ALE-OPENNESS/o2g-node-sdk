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

import { OnPilotCallRemoved } from "../../../src/types/cc-pilot/cc-pilot-events";
import { CallCause } from "../../../src/types/telephony/call/call-cause";

describe('OnPilotCallRemoved', () => {

    it('should correctly create an instance from JSON', () => {
        const jsonString = `{
            "pilot": "33000",
            "releasingDevice": "01234567",
            "newDestination": "09876543",
            "callRef": "123456abcdef",
            "cause": "DISTRIBUTED"
        }`;

        const event = OnPilotCallRemoved.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnPilotCallRemoved);
        expect(event.pilot).toBe('33000');
        expect(event.releasingDevice).toBe('01234567');
        expect(event.newDestination).toBe('09876543');
        expect(event.callRef).toBe('123456abcdef');
        expect(event.cause).toBe(CallCause.DISTRIBUTED);
    });

    it('should handle other causes correctly', () => {
        const jsonString = `{
            "pilot": "33001",
            "releasingDevice": "01239876",
            "newDestination": "09871234",
            "callRef": "abcdef123456",
            "cause": "CLEARED"
        }`;

        const event = OnPilotCallRemoved.fromJson(JSON.parse(jsonString));

        expect(event.pilot).toBe('33001');
        expect(event.releasingDevice).toBe('01239876');
        expect(event.newDestination).toBe('09871234');
        expect(event.callRef).toBe('abcdef123456');
        expect(event.cause).toBe(CallCause.CLEARED);
    });
});