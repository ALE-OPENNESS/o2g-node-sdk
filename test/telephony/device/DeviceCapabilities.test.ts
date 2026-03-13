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

import { Device } from "../../../src/types/common/device";



describe('Device.Capabilities', () => {

    it('should create Capabilities from JSON with all fields', () => {
        const jsonString = `{
            "deviceId": "dev123",
            "makeCall": true,
            "makeBusinessCall": true,
            "makePrivateCall": true,
            "unParkCall": true
        }`;

        const capabilities = Device.Capabilities.fromJson(JSON.parse(jsonString));

        expect(capabilities.deviceId).toBe("dev123");
        expect(capabilities.canMakeCall).toBe(true);
        expect(capabilities.canMakeBusinessCall).toBe(true);
        expect(capabilities.canMakePrivateCall).toBe(true);
        expect(capabilities.canUnParkCall).toBe(true);
    });

    it('should handle missing optional fields', () => {
        const jsonString = `{
            "deviceId": "dev456"
        }`;

        const capabilities = Device.Capabilities.fromJson(JSON.parse(jsonString));

        expect(capabilities.deviceId).toBe("dev456");
        expect(capabilities.canMakeCall).toBe(false);
        expect(capabilities.canMakeBusinessCall).toBe(false);
        expect(capabilities.canMakePrivateCall).toBe(false);
        expect(capabilities.canUnParkCall).toBe(false);
    });

    it('should handle partially set capabilities', () => {
        const jsonString = `{
            "deviceId": "dev789",
            "makeCall": true,
            "unParkCall": true
        }`;

        const capabilities = Device.Capabilities.fromJson(JSON.parse(jsonString));

        expect(capabilities.deviceId).toBe("dev789");
        expect(capabilities.canMakeCall).toBe(true);
        expect(capabilities.canMakeBusinessCall).toBe(false);
        expect(capabilities.canMakePrivateCall).toBe(false);
        expect(capabilities.canUnParkCall).toBe(true);
    });
});