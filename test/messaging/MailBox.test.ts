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

import { MailBox } from "../../src/types/messaging/mailbox";

describe('MailBox', () => {
    let mailboxJsonString: string;

    beforeEach(() => {
        mailboxJsonString = `{
            "id": "mb123",
            "name": "Main Mailbox",
            "capabilities": {
                "listMessages": true,
                "getMessages": true,
                "getRecord": false,
                "play": true,
                "pause": true,
                "hangup": false,
                "record": true,
                "resume": false,
                "cancel": true,
                "forward": false,
                "callback": true,
                "send": true,
                "events": false
            }
        }`;
    });

    it('should create MailBox instance from JSON string', () => {
        const mailboxJson = JSON.parse(mailboxJsonString);
        const mailbox = MailBox.fromJson(mailboxJson);

        expect(mailbox.id).toBe('mb123');
        expect(mailbox.name).toBe('Main Mailbox');
        expect(mailbox.capabilities).not.toBeNull();
        expect(mailbox.capabilities?.canListMessages).toBe(true);
        expect(mailbox.capabilities?.canGetRecord).toBe(false);
        expect(mailbox.capabilities?.canPause).toBe(true);
    });

    it('should return null for undefined fields', () => {
        const mailbox = MailBox.fromJson({} as any);

        expect(mailbox.id).toBeNull();
        expect(mailbox.name).toBeNull();
        expect(mailbox.capabilities).toBeNull();
    });

    describe('MailBoxCapabilities', () => {
        it('should create capabilities from JSON string', () => {
            const mailboxJson = JSON.parse(mailboxJsonString);
            const capabilities = MailBox.MailBoxCapabilities.fromJson(mailboxJson.capabilities);

            expect(capabilities.canListMessages).toBe(true);
            expect(capabilities.canGetMessages).toBe(true);
            expect(capabilities.canGetRecord).toBe(false);
            expect(capabilities.canPlay).toBe(true);
            expect(capabilities.canPause).toBe(true);
            expect(capabilities.canHangup).toBe(false);
            expect(capabilities.canRecord).toBe(true);
            expect(capabilities.canResume).toBe(false);
            expect(capabilities.canCancel).toBe(true);
            expect(capabilities.canForward).toBe(false);
            expect(capabilities.canCallback).toBe(true);
            expect(capabilities.canSend).toBe(true);
            expect(capabilities.canSendEvents).toBe(false);
        });

        it('should return false for undefined fields', () => {
            const emptyCapabilities = MailBox.MailBoxCapabilities.fromJson({} as any);

            expect(emptyCapabilities.canListMessages).toBe(false);
            expect(emptyCapabilities.canGetMessages).toBe(false);
            expect(emptyCapabilities.canGetRecord).toBe(false);
            expect(emptyCapabilities.canPlay).toBe(false);
            expect(emptyCapabilities.canPause).toBe(false);
            expect(emptyCapabilities.canHangup).toBe(false);
            expect(emptyCapabilities.canRecord).toBe(false);
            expect(emptyCapabilities.canResume).toBe(false);
            expect(emptyCapabilities.canCancel).toBe(false);
            expect(emptyCapabilities.canForward).toBe(false);
            expect(emptyCapabilities.canCallback).toBe(false);
            expect(emptyCapabilities.canSend).toBe(false);
            expect(emptyCapabilities.canSendEvents).toBe(false);
        });

        it('should convert to JSON correctly', () => {
            const mailboxJson = JSON.parse(mailboxJsonString);
            const capabilities = MailBox.MailBoxCapabilities.fromJson(mailboxJson.capabilities);
            const jsonResult = capabilities.toJson();

            expect(jsonResult).toEqual(mailboxJson.capabilities);
        });
    });
});