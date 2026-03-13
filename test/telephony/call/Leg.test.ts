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

import { Leg } from "../../../src/types/telephony/call/leg";
import { MediaState } from "../../../src/types/telephony/call/media-state";


describe('Leg', () => {

    it('should create a Leg instance from JSON with all fields', () => {
        const jsonString = `{
            "deviceId": "dev123",
            "state": "connected",
            "ringingRemote": true,
            "capabilities": {
                "answer": true,
                "drop": true,
                "hold": false,
                "retrieve": true,
                "reconnect": false,
                "mute": true,
                "unMute": false,
                "sendDtmf": true,
                "switchDevice": true
            }
        }`;

        const leg = Leg.fromJson(JSON.parse(jsonString));

        expect(leg).toBeInstanceOf(Leg);
        expect(leg.deviceId).toBe("dev123");
        expect(leg.state).toBe("connected");
        expect(leg.ringingRemote).toBe(true);

        const caps = leg.capabilities!;
        expect(caps.canAnswer).toBe(true);
        expect(caps.canDrop).toBe(true);
        expect(caps.canHold).toBe(false);
        expect(caps.canRetrieve).toBe(true);
        expect(caps.canReconnect).toBe(false);
        expect(caps.canMute).toBe(true);
        expect(caps.canUnMute).toBe(false);
        expect(caps.canSendDtmf).toBe(true);
        expect(caps.canSwitchDevice).toBe(true);
    });

    it('should handle missing optional fields', () => {
        const jsonString = `{
            "deviceId": "dev456"
        }`;

        const leg = Leg.fromJson(JSON.parse(jsonString));

        expect(leg.deviceId).toBe("dev456");
        expect(leg.state).toBe(MediaState.UNKNOWN);
        expect(leg.ringingRemote).toBe(false);
        expect(leg.capabilities).toBeNull();
    });

    it('should handle partial capabilities', () => {
        const jsonString = `{
            "deviceId": "dev789",
            "capabilities": {
                "answer": true,
                "hold": true
            }
        }`;

        const leg = Leg.fromJson(JSON.parse(jsonString));
        const caps = leg.capabilities!;

        expect(caps.canAnswer).toBe(true);
        expect(caps.canHold).toBe(true);
        // All other capabilities should default to false
        expect(caps.canDrop).toBe(false);
        expect(caps.canRetrieve).toBe(false);
        expect(caps.canReconnect).toBe(false);
        expect(caps.canMute).toBe(false);
        expect(caps.canUnMute).toBe(false);
        expect(caps.canSendDtmf).toBe(false);
        expect(caps.canSwitchDevice).toBe(false);
    });

    it('should handle ringingRemote false', () => {
        const jsonString = `{
            "deviceId": "dev000",
            "ringingRemote": false
        }`;

        const leg = Leg.fromJson(JSON.parse(jsonString));

        expect(leg.ringingRemote).toBe(false);
    });
});

describe('Leg.LegCapabilities', () => {
    it('should create LegCapabilities from JSON', () => {
        const jsonString = `{
            "answer": true,
            "drop": false,
            "hold": true,
            "retrieve": false,
            "reconnect": true,
            "mute": false,
            "unMute": true,
            "sendDtmf": false,
            "switchDevice": true
        }`;

        const caps = Leg.LegCapabilities.fromJson(JSON.parse(jsonString));

        expect(caps.canAnswer).toBe(true);
        expect(caps.canDrop).toBe(false);
        expect(caps.canHold).toBe(true);
        expect(caps.canRetrieve).toBe(false);
        expect(caps.canReconnect).toBe(true);
        expect(caps.canMute).toBe(false);
        expect(caps.canUnMute).toBe(true);
        expect(caps.canSendDtmf).toBe(false);
        expect(caps.canSwitchDevice).toBe(true);
    });

    it('should default undefined capabilities to false', () => {
        const jsonString = `{}`;

        const caps = Leg.LegCapabilities.fromJson(JSON.parse(jsonString));

        expect(caps.canAnswer).toBe(false);
        expect(caps.canDrop).toBe(false);
        expect(caps.canHold).toBe(false);
        expect(caps.canRetrieve).toBe(false);
        expect(caps.canReconnect).toBe(false);
        expect(caps.canMute).toBe(false);
        expect(caps.canUnMute).toBe(false);
        expect(caps.canSendDtmf).toBe(false);
        expect(caps.canSwitchDevice).toBe(false);
    });
});