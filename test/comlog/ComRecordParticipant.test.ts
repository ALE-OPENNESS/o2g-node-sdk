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

import { ComRecordParticipant } from "../../src/types/comlog/com-record-participant";


describe('ComRecordParticipant', () => {
    const identityJson = `
    {
        "id": { 
            "loginName": "jdoe",
            "phoneNumber": "1001"
        },
        "firstName": "John",
        "lastName": "Doe",
        "type": { 
            "main": "USER",
            "subType": "PRO"
        }
    }`;

    const initialCalledJson = `
    {
        "id": { 
            "loginName": "asmith",
            "phoneNumber": "1002"
        },
        "firstName": "Alice",
        "lastName": "Smith",
        "type": { 
            "main": "USER",
            "subType": "PRO"
        }
    }`;

    it('should deserialize from JSON and populate all fields', () => {
        const participantJson = JSON.parse(`
        {
            "identity": ${identityJson},
            "role": "CALLER",
            "answered": true,
            "anonymous": false,
            "initialCalled": ${initialCalledJson},
            "reason": "TRANSFER",
            "leg": "leg-123"
        }`);

        const participant = ComRecordParticipant.fromJson(participantJson);

        expect(participant.identity.id.loginName).toBe('jdoe');
        expect(participant.identity.id.phoneNumber).toBe('1001');
        expect(participant.role).toBe('CALLER');
        expect(participant.answered).toBe(true);
        expect(participant.anonymous).toBe(false);

        expect(participant.initialCalled?.id.loginName).toBe('asmith');
        expect(participant.initialCalled?.id.phoneNumber).toBe('1002');

        expect(participant.reason).toBe('TRANSFER');
        expect(participant.leg).toBe('leg-123');
    });

    it('should provide default values when optional fields are missing', () => {
        const participantJson = JSON.parse(`
        {
            "identity": ${identityJson},
            "role": "CALLEE"
        }`);

        const participant = ComRecordParticipant.fromJson(participantJson);

        expect(participant.role).toBe('CALLEE');
        expect(participant.answered).toBe(false); // default
        expect(participant.anonymous).toBe(false); // default
        expect(participant.initialCalled).toBeNull();
        expect(participant.reason).toBe('UNKNOWN'); // default
        expect(participant.leg).toBeNull();
    });

    it('should handle null initialCalled gracefully', () => {
        const participantJson = JSON.parse(`
        {
            "identity": ${identityJson},
            "role": "CALLER",
            "initialCalled": null
        }`);

        const participant = ComRecordParticipant.fromJson(participantJson);

        expect(participant.initialCalled).toBeNull();
    });

    it('should handle anonymous participants', () => {
        const participantJson = JSON.parse(`
        {
            "identity": ${identityJson},
            "role": "CALLER",
            "anonymous": true
        }`);

        const participant = ComRecordParticipant.fromJson(participantJson);

        expect(participant.anonymous).toBe(true);
    });
});