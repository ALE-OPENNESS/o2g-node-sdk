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

import { Call } from "../../src/types/telephony/call";



describe('Call', () => {

    it('should create a Call with callRef only', () => {
        const jsonString = `{
            "callRef": "call123"
        }`;

        const call = Call.fromJson(JSON.parse(jsonString));

        expect(call.callRef).toBe("call123");
        expect(call.callData).toBeNull();
        expect(call.legs).toBeNull();
        expect(call.participants).toBeNull();
    });

    it('should create a Call with legs and participants', () => {
        const jsonString = `{
            "callRef": "call456",
            "legs": [],
            "participants": []
        }`;

        const call = Call.fromJson(JSON.parse(jsonString));

        expect(call.callRef).toBe("call456");
        expect(call.legs).toEqual([]);
        expect(call.participants).toEqual([]);
    });

    it('should create CallCapabilities from JSON', () => {
        const jsonString = `{
            "addDevice": true,
            "transfer": true,
            "merge": false
        }`;

        const capabilities = Call.CallCapabilities.fromJson(JSON.parse(jsonString));

        expect(capabilities.canAddDevice).toBe(true);
        expect(capabilities.canTransfer).toBe(true);
        expect(capabilities.canMerge).toBe(false);
        expect(capabilities.canAddParticipant).toBe(false); // default
    });
});