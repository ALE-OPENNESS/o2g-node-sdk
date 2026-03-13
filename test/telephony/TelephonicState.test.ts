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

import { TelephonicState } from "../../src/types/telephony/telephonic-state";
import { UserState } from "../../src/types/telephony/user/user-state";




describe("TelephonicState", () => {
    it("should correctly create TelephonicState from full JSON", () => {
        const jsonString = `{
            "calls": [
                { "callRef": "call123" }
            ],
            "deviceCapabilities": [
                { "deviceId": "device1", "makeCall": true }
            ],
            "userState": "BUSY"
        }`;

        const state = TelephonicState.fromJson(JSON.parse(jsonString));

        expect(state.calls).not.toBeNull();
        expect(state.calls?.length).toBe(1);
        expect(state.calls?.[0].callRef).toBe("call123");

        expect(state.deviceCapabilities).not.toBeNull();
        expect(state.deviceCapabilities?.length).toBe(1);
        expect(state.deviceCapabilities?.[0].deviceId).toBe("device1");
        expect(state.deviceCapabilities?.[0].canMakeCall).toBe(true);

        expect(state.userState).toBe(UserState.BUSY);
    });

    it("should handle missing optional fields", () => {
        const jsonString = `{}`;

        const state = TelephonicState.fromJson(JSON.parse(jsonString));

        expect(state.calls).toBeNull();
        expect(state.deviceCapabilities).toBeNull();
        expect(state.userState).toBeNull();
    });

    it("should handle partially populated JSON", () => {
        const jsonString = `{
            "calls": [
                { "callRef": "call456" }
            ]
        }`;

        const state = TelephonicState.fromJson(JSON.parse(jsonString));

        expect(state.calls).not.toBeNull();
        expect(state.calls?.[0].callRef).toBe("call456");

        expect(state.deviceCapabilities).toBeNull();
        expect(state.userState).toBeNull();
    });
});