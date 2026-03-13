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

import { PartyInfo } from "../../../src/types/common/party-info";
import { MediaState } from "../../../src/types/telephony/call/media-state";
import { Participant } from "../../../src/types/telephony/call/participant";


describe('Participant', () => {

    it('should create a Participant from JSON with all fields', () => {
        const jsonString = `{
            "participantId": "p123",
            "identity": { 
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
            },
            "anonymous": true,
            "undroppable": true,
            "state": "connected"
        }`;

        const participant = Participant.fromJson(JSON.parse(jsonString));

        expect(participant.participantId).toBe("p123");

        const identity = participant.identity!;
        expect(identity).toBeInstanceOf(PartyInfo);
        expect(identity.id.phoneNumber).toBe("1001");
        expect(identity.firstName).toBe("John");

        expect(participant.anonymous).toBe(true);
        expect(participant.undroppable).toBe(true);
        expect(participant.state).toBe("connected");
    });

    it('should handle missing optional fields', () => {
        const jsonString = `{
            "participantId": "p456"
        }`;

        const participant = Participant.fromJson(JSON.parse(jsonString));

        expect(participant.participantId).toBe("p456");
        expect(participant.identity).toBeNull();
        expect(participant.anonymous).toBe(false);
        expect(participant.undroppable).toBe(false);
        expect(participant.state).toBe(MediaState.UNKNOWN); // default MediaState
    });

    it('should handle partial optional fields', () => {
        const jsonString = `{
            "participantId": "p789",
            "anonymous": true
        }`;

        const participant = Participant.fromJson(JSON.parse(jsonString));

        expect(participant.participantId).toBe("p789");
        expect(participant.identity).toBeNull();
        expect(participant.anonymous).toBe(true);
        expect(participant.undroppable).toBe(false);
        expect(participant.state).toBe(MediaState.UNKNOWN);
    });

    it('should default state to UNKNOWN if not provided', () => {
        const jsonString = `{
            "participantId": "p000"
        }`;

        const participant = Participant.fromJson(JSON.parse(jsonString));

        expect(participant.state).toBe("UNKNOWN");
    });
});