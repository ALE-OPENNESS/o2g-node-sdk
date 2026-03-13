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

import { User } from "../../../src/types/users/user";
import { OnUserCreated, OnUserDeleted, OnUserInfoChanged } from "../../../src/types/users/users-events";

/**
 * Jest unit tests for user event classes using JSON strings
 */



describe('User Event Classes (from JSON strings)', () => {

    it('OnUserCreated should create an event from JSON string', () => {
        const jsonString = `{
            "user": {
                "companyPhone": "1234",
                "firstName": "John",
                "lastName": "Doe",
                "loginName": "jdoe",
                "voicemail": null,
                "devices": [],
                "nodeId": 1,
                "externalLogin": null
            }
        }`;

        const event = OnUserCreated.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnUserCreated);
        expect(event.user).toBeInstanceOf(User);
        expect(event.user.loginName).toBe('jdoe');
    });

    it('OnUserDeleted should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "jdoe"
        }`;

        const event = OnUserDeleted.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnUserDeleted);
        expect(event.loginName).toBe('jdoe');
    });

    it('OnUserInfoChanged should create an event from JSON string', () => {
        const jsonString = `{
            "loginName": "jdoe",
            "user": {
                "companyPhone": "1234",
                "firstName": "John",
                "lastName": "Doe",
                "loginName": "jdoe",
                "voicemail": null,
                "devices": [],
                "nodeId": 1,
                "externalLogin": null
            }
        }`;

        const event = OnUserInfoChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnUserInfoChanged);
        expect(event.loginName).toBe('jdoe');
        expect(event.user).toBeInstanceOf(User);
        expect(event.user.firstName).toBe('John');
    });

});