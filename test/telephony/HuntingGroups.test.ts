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

import { HuntingGroups } from "../../src/types/telephony/hunting-groups";


describe("HuntingGroups", () => {
    const jsonString = `{
        "hgList": ["Sales", "Support", "Tech"],
        "currentHg": "Support"
    }`;

    let hg: HuntingGroups;

    beforeEach(() => {
        const json = JSON.parse(jsonString);
        hg = HuntingGroups.fromJson(json);
    });

    test("should create a HuntingGroups instance from JSON", () => {
        expect(hg).toBeInstanceOf(HuntingGroups);
    });

    test("should return the correct list of hunting groups", () => {
        expect(hg.list).toEqual(["Sales", "Support", "Tech"]);
    });

    test("should return the correct current hunting group", () => {
        expect(hg.current).toBe("Support");
    });

    test("should return null if hgList is undefined", () => {
        const hgEmpty = HuntingGroups.fromJson({ currentHg: "Tech" });
        expect(hgEmpty.list).toBeNull();
        expect(hgEmpty.current).toBe("Tech");
    });

    test("should return null if currentHg is undefined", () => {
        const hgNoCurrent = HuntingGroups.fromJson({ hgList: ["Sales"] });
        expect(hgNoCurrent.list).toEqual(["Sales"]);
        expect(hgNoCurrent.current).toBeNull();
    });

    test("should return null for both fields if JSON is empty", () => {
        const hgEmpty = HuntingGroups.fromJson({});
        expect(hgEmpty.list).toBeNull();
        expect(hgEmpty.current).toBeNull();
    });
});