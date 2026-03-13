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

import { MailBoxInfo } from "../../src/types/messaging/mailbox-info";


describe('MailBoxInfo', () => {
    let jsonString: string;

    beforeEach(() => {
        jsonString = `{
            "totalVoiceMsg": 10,
            "newVoiceMsg": 3,
            "storageUsage": 2048
        }`;
    });

    it('should create an instance from JSON and populate all fields', () => {
        const json = JSON.parse(jsonString);
        const mailbox = MailBoxInfo.fromJson(json);

        expect(mailbox.totalVoiceMsg).toBe(10);
        expect(mailbox.newVoiceMsg).toBe(3);
        expect(mailbox.storageUsage).toBe(2048);
    });

    it('should default to 0 for missing properties', () => {
        const json = {}; // empty JSON
        const mailbox = MailBoxInfo.fromJson(json as any);

        expect(mailbox.totalVoiceMsg).toBe(0);
        expect(mailbox.newVoiceMsg).toBe(0);
        expect(mailbox.storageUsage).toBe(0);
    });

    it('should handle partial JSON correctly', () => {
        const partialJsonString = `{
            "totalVoiceMsg": 5
        }`;
        const json = JSON.parse(partialJsonString);
        const mailbox = MailBoxInfo.fromJson(json);

        expect(mailbox.totalVoiceMsg).toBe(5);
        expect(mailbox.newVoiceMsg).toBe(0); // default
        expect(mailbox.storageUsage).toBe(0); // default
    });

    it('should convert to JSON correctly', () => {
        const json = JSON.parse(jsonString);
        const mailbox = MailBoxInfo.fromJson(json);

        const resultJson = mailbox.toJson();

        expect(resultJson.totalVoiceMsg).toBe(10);
        expect(resultJson.newVoiceMsg).toBe(3);
        expect(resultJson.storageUsage).toBe(2048);
    });
});