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
import { UserJson } from "../../src/internal/types/users/users-types";
import { DeviceType } from "../../src/types/common/device-type";
import { User } from "../../src/types/users/user";
import { VoicemailType } from "../../src/types/users/voicemail-type";

// test/users/User.test.ts

describe('User', () => {
    const sampleDeviceJson: DeviceJson = {
        type: DeviceType.DESKPHONE,
        id: 'device-123',
        subType: 'pro'
    };

    const sampleVoicemailJson = {
        number: '1234',
        type: "VM_4645"
    };

    const sampleUserJson: UserJson = {
        companyPhone: '1001',
        firstName: 'John',
        lastName: 'Doe',
        loginName: 'jdoe',
        voicemail: sampleVoicemailJson,
        devices: [sampleDeviceJson],
        nodeId: '42',
        externalLogin: 'external-jdoe'
    };

    const sampleUserJsonNoVoicemail: UserJson = {
        companyPhone: '1002',
        firstName: 'Jane',
        lastName: 'Smith',
        loginName: 'jsmith',
        devices: [sampleDeviceJson],
        nodeId: '99',
        externalLogin: 'external-jsmith'
    };

    describe('fromJson', () => {
        it('creates a User with all fields including voicemail', () => {
            const user = User.fromJson(sampleUserJson);

            expect(user.companyPhone).toBe('1001');
            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.loginName).toBe('jdoe');

            const vm = user.voicemail;
            expect(vm).not.toBeNull();
            expect(vm?.number).toBe('1234');
            expect(vm?.type).toBe(VoicemailType.VM_4645);

            const devices = user.devices;
            expect(devices).toHaveLength(1);
            expect(devices![0].id).toBe('device-123');

            expect(user.nodeId).toBe(42);
            expect(user.externalLogin).toBe('external-jdoe');
        });

        it('creates a User with null voicemail if missing', () => {
            const user = User.fromJson(sampleUserJsonNoVoicemail);

            expect(user.voicemail).toBeNull();
            expect(user.companyPhone).toBe('1002');
            expect(user.nodeId).toBe(99);
        });
    });

    describe('getters', () => {
        it('returns correct values for all fields', () => {
            const user = User.fromJson(sampleUserJson);
            expect(user.companyPhone).toBe('1001');
            expect(user.firstName).toBe('John');
            expect(user.lastName).toBe('Doe');
            expect(user.loginName).toBe('jdoe');
            expect(user.externalLogin).toBe('external-jdoe');
            expect(user.nodeId).toBe(42);

            const devices = user.devices;
            expect(devices).toHaveLength(1);
            expect(devices![0].type).toBe(DeviceType.DESKPHONE);

            const vm = user.voicemail;
            expect(vm).not.toBeNull();
            expect(vm?.number).toBe('1234');
        });
    });

    describe('edge cases', () => {
        it('handles empty devices array', () => {
            const json: UserJson = {
                devices: []
            };

            const user = User.fromJson(json);
            expect(user.devices).toHaveLength(0);
            expect(user.companyPhone).toBeNull();
            expect(user.voicemail).toBeNull();
            expect(user.nodeId).toBeNaN();
            expect(user.externalLogin).toBeNull();
        });
    });
});
