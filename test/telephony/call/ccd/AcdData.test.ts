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

import { AcdData } from "../../../../src/types/telephony/call/ccd/acd-data";
import { PilotStatus } from "../../../../src/types/telephony/call/ccd/pilot-status";


describe('AcdData', () => {
    it('should create an instance from a JSON string', () => {
        const jsonString = `{
            "callInfo": {
                "queueWaitingTime": 10,
                "globalWaitingTime": 50,
                "agentGroup": "SupportTeam",
                "local": true
            },
            "queueData": {
                "waitingTime": 60,
                "saturated": false
            },
            "pilotNumber": "12345",
            "rsiNumber": "RSI-01",
            "supervisedTransfer": true,
            "pilotTransferInfo": {
                "transferPossible": true,
                "pilotStatus": "GENERAL_FORWARDING"
            }
        }`;

        const data = AcdData.fromJson(JSON.parse(jsonString));

        expect(data).toBeInstanceOf(AcdData);

        // Check callInfo
        expect(data.callInfo).not.toBeNull();
        expect(data.callInfo?.queueWaitingTime).toBe(10);
        expect(data.callInfo?.globalWaitingTime).toBe(50);
        expect(data.callInfo?.agentGroup).toBe('SupportTeam');
        expect(data.callInfo?.local).toBe(true);

        // Check queueData
        expect(data.queueData).not.toBeNull();
        expect(data.queueData?.saturated).toBe(false);
        expect(data.queueData?.waitingTime).toBe(60);

        // Check pilot and RSI numbers
        expect(data.pilotNumber).toBe('12345');
        expect(data.rsiNumber).toBe('RSI-01');

        // Check supervised transfer
        expect(data.isSupervisedTransfer).toBe(true);

        // Check pilot transfer info
        expect(data.pilotTransferInfo).not.toBeNull();
        expect(data.pilotTransferInfo?.transferPossible).toBe(true);
        expect(data.pilotTransferInfo?.pilotStatus).toBe(PilotStatus.GENERAL_FORWARDING);
    });

    it('should return null or false for missing fields from a JSON string', () => {
        const jsonString = `{}`;

        const data = AcdData.fromJson(JSON.parse(jsonString));

        expect(data.callInfo).toBeNull();
        expect(data.queueData).toBeNull();
        expect(data.pilotNumber).toBeNull();
        expect(data.rsiNumber).toBeNull();
        expect(data.isSupervisedTransfer).toBe(false);
        expect(data.pilotTransferInfo).toBeNull();
    });

    it('should handle empty/edge values from a JSON string', () => {
        const jsonString = `{
            "callInfo": {
                "queueWaitingTime": 0,
                "globalWaitingTime": 0,
                "agentGroup": "",
                "local": false
            },
            "queueData": {
                "waitingTime": 60
            },
            "pilotNumber": "",
            "rsiNumber": "",
            "supervisedTransfer": false,
            "pilotTransferInfo": {
            }
        }`;

        const data = AcdData.fromJson(JSON.parse(jsonString));

        expect(data.callInfo?.queueWaitingTime).toBe(0);
        expect(data.callInfo?.globalWaitingTime).toBe(0);
        expect(data.callInfo?.agentGroup).toBe('');
        expect(data.callInfo?.local).toBe(false);

        expect(data.queueData?.saturated).toBe(false);
        expect(data.queueData?.waitingTime).toBe(60);

        expect(data.pilotNumber).toBe('');
        expect(data.rsiNumber).toBe('');
        expect(data.isSupervisedTransfer).toBe(false);

        expect(data.pilotTransferInfo?.transferPossible).toBe(false);
        expect(data.pilotTransferInfo?.pilotStatus).toBeNull();
    });
});