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

import { DeviceJson } from "../../src/internal/types/common/common-types";
import { Device } from "../../src/types/common/device";
import { DeviceType } from "../../src/types/common/device-type";


// test/Device.test.ts

describe('Device', () => {
    const sampleJson: DeviceJson = {
        type: DeviceType.DESKPHONE,
        id: 'device-123',
        subType: 'pro'
    };

    const sampleJsonNoSubType: DeviceJson = {
        type: DeviceType.MOBILE,
        id: 'device-456'
    };

    describe('fromJson', () => {
        it('creates a Device with all fields', () => {
            const device = Device.fromJson(sampleJson);
            expect(device.type).toBe(DeviceType.DESKPHONE);
            expect(device.id).toBe('device-123');
            expect(device.subType).toBe('pro');
        });

        it('creates a Device with optional subType undefined', () => {
            const device = Device.fromJson(sampleJsonNoSubType);
            expect(device.type).toBe(DeviceType.MOBILE);
            expect(device.id).toBe('device-456');
            expect(device.subType).toBeNull();
        });
    });

    describe('getters', () => {
        it('returns correct type, id, and subType', () => {
            const device = Device.fromJson(sampleJson);
            expect(device.type).toBe(DeviceType.DESKPHONE);
            expect(device.id).toBe('device-123');
            expect(device.subType).toBe('pro');
        });

        it('handles missing subType correctly', () => {
            const device = Device.fromJson(sampleJsonNoSubType);
            expect(device.subType).toBeNull();
        });
    });
});
