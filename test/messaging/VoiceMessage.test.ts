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

import { VoiceMessage } from "../../src/types/messaging/voice-message";


describe('VoiceMessage', () => {
    let jsonString: string;

    beforeEach(() => {
        jsonString = `{
            "voicemailId": "vm12345",
            "from": {
                "id": { 
                    "phoneNumber": "32134"
                },
                "firstName": "John",
                "lastName": "Doe",
                "type": { 
                    "main": "USER",
                    "subType": "PRO" 
                }
            },
            "duration": 120,
            "date": "2026-02-23T10:30:00Z",
            "unread": true,
            "highPriority": false
        }`;
    });

    it('should create an instance from JSON and populate all fields', () => {
        const json = JSON.parse(jsonString);
        const message = VoiceMessage.fromJson(json);

        expect(message.voicemailId).toBe('vm12345');
        expect(message.from).not.toBeNull();
        expect(message.from?.firstName).toBe('John');
        expect(message.from?.lastName).toBe('Doe');
        expect(message.from?.id.phoneNumber).toBe('32134');
        expect(message.duration).toBe(120);
        expect(message.date.toISOString()).toBe('2026-02-23T10:30:00.000Z');
        expect(message.unread).toBe(true);
        expect(message.highPriority).toBe(false);
    });

    it('should handle missing "from" field by returning null', () => {
        const json = JSON.parse(`{
            "voicemailId": "vm67890",
            "duration": 90,
            "date": "2026-02-23T12:00:00Z",
            "unread": false,
            "highPriority": true
        }`);

        const message = VoiceMessage.fromJson(json);

        expect(message.voicemailId).toBe('vm67890');
        expect(message.from).toBeNull();
        expect(message.duration).toBe(90);
        expect(message.date.toISOString()).toBe('2026-02-23T12:00:00.000Z');
        expect(message.unread).toBe(false);
        expect(message.highPriority).toBe(true);
    });

    it('should correctly parse the date field into a Date object', () => {
        const json = JSON.parse(jsonString);
        const message = VoiceMessage.fromJson(json);

        expect(message.date).toBeInstanceOf(Date);
        expect(message.date.getUTCFullYear()).toBe(2026);
        expect(message.date.getUTCMonth()).toBe(1); // February is month 1 (0-based)
        expect(message.date.getUTCDate()).toBe(23);
    });
});