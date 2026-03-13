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

import { PilotStatus } from "../../../../src/types/telephony/call/ccd/pilot-status";
import { PilotTransferInfo } from "../../../../src/types/telephony/call/ccd/pilot-transfer-info";


describe('PilotTransferInfo', () => {
    it('should create an instance from a JSON string', () => {
        const jsonString = `{
            "transferPossible": true,
            "pilotStatus": "BLOCKED"
        }`;

        const info = PilotTransferInfo.fromJson(JSON.parse(jsonString));

        expect(info).toBeInstanceOf(PilotTransferInfo);
        expect(info.transferPossible).toBe(true);
        expect(info.pilotStatus).toBe(PilotStatus.BLOCKED);
    });

    it('should return default false and null for missing fields', () => {
        const jsonString = `{}`;

        const info = PilotTransferInfo.fromJson(JSON.parse(jsonString));

        expect(info.transferPossible).toBe(false);
        expect(info.pilotStatus).toBeNull();
    });

    it('should handle false and edge values correctly', () => {
        const jsonString = `{
            "transferPossible": false,
            "pilotStatus": ""
        }`;

        const info = PilotTransferInfo.fromJson(JSON.parse(jsonString));

        expect(info.transferPossible).toBe(false);
        expect(info.pilotStatus).toBe('');
    });
});