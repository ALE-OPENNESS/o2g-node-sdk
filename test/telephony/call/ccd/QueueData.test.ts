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

import { QueueData } from "../../../../src/types/telephony/call/ccd/queue-data";



describe('QueueData', () => {
    it('should create an instance from a JSON string', () => {
        const jsonString = `{
            "waitingTime": 30,
            "saturated": true
        }`;

        const queue = QueueData.fromJson(JSON.parse(jsonString));

        expect(queue).toBeInstanceOf(QueueData);
        expect(queue.waitingTime).toBe(30);
        expect(queue.saturated).toBe(true);
    });

    it('should return null and false for missing fields', () => {
        const jsonString = `{}`;

        const queue = QueueData.fromJson(JSON.parse(jsonString));

        expect(queue.waitingTime).toBeNull();
        expect(queue.saturated).toBe(false);
    });

    it('should handle edge values correctly', () => {
        const jsonString = `{
            "waitingTime": 0,
            "saturated": false
        }`;

        const queue = QueueData.fromJson(JSON.parse(jsonString));

        expect(queue.waitingTime).toBe(0);
        expect(queue.saturated).toBe(false);
    });
});