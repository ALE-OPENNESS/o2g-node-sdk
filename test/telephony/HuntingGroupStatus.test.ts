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

import { HuntingGroupStatus } from "../../src/types/telephony/hunting-group-status";


describe("HuntingGroupStatus", () => {
    const jsonString = `{
        "logon": true
    }`;

    let status: HuntingGroupStatus;

    beforeEach(() => {
        const json = JSON.parse(jsonString);
        status = HuntingGroupStatus.fromJson(json);
    });

    test("should create a HuntingGroupStatus instance from JSON", () => {
        expect(status).toBeInstanceOf(HuntingGroupStatus);
    });

    test("should return the correct loggedOn status", () => {
        expect(status.loggedOn).toBe(true);
    });

    test("should return false when logon is false", () => {
        const jsonFalse = JSON.parse(`{"logon": false}`);
        const statusFalse = HuntingGroupStatus.fromJson(jsonFalse);
        expect(statusFalse.loggedOn).toBe(false);
    });
});