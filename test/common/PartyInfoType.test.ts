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

import { MainType } from "../../src/types/common/main-type";
import { PartyInfoType } from "../../src/types/common/party-info-type";

// test/users/PartyInfoType.test.ts

describe('PartyInfoType', () => {

    describe('fromJson', () => {
        it('creates a PartyInfoType instance from JSON', () => {
            const party = PartyInfoType.fromJson(JSON.parse(
                `{
                    "main": "USER",
                    "subType": "PRO" 
                }`)
            );
            expect(party.main).toBe(MainType.USER);
            expect(party.subType).toBe("PRO");
        });

        it('creates another PartyInfoType instance from different JSON', () => {
            const party = PartyInfoType.fromJson(JSON.parse(
                `{
                    "main": "DEVICE"
                }`)
            );

            expect(party.main).toBe(MainType.DEVICE);
            expect(party.subType).toBeNull();
        });
    });
});
