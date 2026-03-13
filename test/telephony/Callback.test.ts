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

import { PartyInfo } from "../../src/types/common/party-info";
import { Callback } from "../../src/types/telephony/callback";


describe("Callback", () => {
    const jsonString = `{
        "callbackId": "cb123",
        "partyInfo": {
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
        }
    }`;

    let callback: Callback;

    beforeEach(() => {
        const json = JSON.parse(jsonString);
        callback = Callback.fromJson(json);
    });

    test("should create a Callback instance from JSON", () => {
        expect(callback).toBeInstanceOf(Callback);
    });

    test("should return the correct callbackId", () => {
        expect(callback.callbackId).toBe("cb123");
    });

    test("should return a PartyInfo instance", () => {
        expect(callback.partyInfo).toBeInstanceOf(PartyInfo);
        expect(callback.partyInfo.firstName).toBe("John");
        expect(callback.partyInfo.lastName).toBe("Doe");
        expect(callback.partyInfo.id.phoneNumber).toBe("1001");
    });
});