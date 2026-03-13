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

import { AcdCallInfo } from "../../../../src/types/telephony/call/ccd/acd-call-info";


describe('AcdCallInfo', () => {
    it('should create an instance from a JSON string', () => {
        const jsonString = `{
            "queueWaitingTime": 10,
            "globalWaitingTime": 50,
            "agentGroup": "SupportTeam",
            "local": true
        }`;

        const info = AcdCallInfo.fromJson(JSON.parse(jsonString));

        expect(info).toBeInstanceOf(AcdCallInfo);
        expect(info.queueWaitingTime).toBe(10);
        expect(info.globalWaitingTime).toBe(50);
        expect(info.agentGroup).toBe('SupportTeam');
        expect(info.local).toBe(true);
    });

    it('should return null or false for missing fields from a JSON string', () => {
        const jsonString = `{ }`;

        const info = AcdCallInfo.fromJson(JSON.parse(jsonString));

        expect(info.queueWaitingTime).toBeNull();
        expect(info.globalWaitingTime).toBeNull();
        expect(info.agentGroup).toBeNull();
        expect(info.local).toBe(false);
    });

    it('should handle edge values from a JSON string', () => {
        const jsonString = `{
            "queueWaitingTime": 0,
            "globalWaitingTime": 0,
            "agentGroup": "",
            "local": false
        }`;

        const info = AcdCallInfo.fromJson(JSON.parse(jsonString));

        expect(info.queueWaitingTime).toBe(0);
        expect(info.globalWaitingTime).toBe(0);
        expect(info.agentGroup).toBe('');
        expect(info.local).toBe(false);
    });
});