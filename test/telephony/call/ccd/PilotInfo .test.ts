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

import { PilotInfo } from "../../../../src/types/telephony/call/ccd/pilot-info";
import { PilotStatus } from "../../../../src/types/telephony/call/ccd/pilot-status";



describe('PilotInfo', () => {
    it('should create a PilotInfo instance from JSON string with all fields', () => {
        const jsonString = `{
            "number": "12345",
            "waitingTime": 60,
            "saturation": true,
            "supervisedTransfer": true,
            "pilotTransferInfo": {
                "transferPossible": true,
                "pilotStatus": "GENERAL_FORWARDING_ON_RULE"
            }
        }`;

        const pilot = PilotInfo.fromJson(JSON.parse(jsonString));

        expect(pilot).toBeInstanceOf(PilotInfo);
        expect(pilot.number).toBe("12345");
        expect(pilot.waitingTime).toBe(60);
        expect(pilot.saturation).toBe(true);
        expect(pilot.supervisedTransfer).toBe(true);
        expect(pilot.pilotTransferInfo).not.toBeNull();
        expect(pilot.pilotTransferInfo?.transferPossible).toBe(true);
        expect(pilot.pilotTransferInfo?.pilotStatus).toBe(PilotStatus.GENERAL_FORWARDING_ON_RULE);
    });

    it('should handle missing optional fields', () => {
        const jsonString = `{}`;

        const pilot = PilotInfo.fromJson(JSON.parse(jsonString));

        expect(pilot.number).toBeNull();
        expect(pilot.waitingTime).toBeNull();
        expect(pilot.saturation).toBe(false);
        expect(pilot.supervisedTransfer).toBe(false);
        expect(pilot.pilotTransferInfo).toBeNull();
    });

    it('should handle partial fields', () => {
        const jsonString = `{
            "number": "54321",
            "supervisedTransfer": true
        }`;

        const pilot = PilotInfo.fromJson(JSON.parse(jsonString));

        expect(pilot.number).toBe("54321");
        expect(pilot.waitingTime).toBeNull();
        expect(pilot.saturation).toBe(false);
        expect(pilot.supervisedTransfer).toBe(true);
        expect(pilot.pilotTransferInfo).toBeNull();
    });

    it('should handle pilotTransferInfo with false and empty status', () => {
        const jsonString = `{
            "pilotTransferInfo": {
                "transferPossible": false
            }
        }`;

        const pilot = PilotInfo.fromJson(JSON.parse(jsonString));

        expect(pilot.pilotTransferInfo?.transferPossible).toBe(false);
        expect(pilot.pilotTransferInfo?.pilotStatus).toBeNull();
    });
});