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

import { LicenseJson } from "../../src/internal/types/maint/maint-types";
import { License } from "../../src/types/maint/license";



// test/users/DndState.test.ts

describe('License', () => {

    describe('fromJson', () => {
        it('creates a License from json', () => {

            const jsonString = `{
                "name": "ROXE_HA",
                "total": 1,
                "currentUsed": 0,
                "expiration": "31-dec-2026",
                "application": true
            }`;

            let json: LicenseJson = JSON.parse(jsonString);
            const license = License.fromJson(json);

            expect(license.name).toBe("ROXE_HA");
            expect(license.total).toBe(1);
            expect(license.currentUsed).toBe(0);
            expect(license.expiration instanceof Date).toBe(true);
            expect(license.expiration!.toISOString()).toBe("2026-12-30T23:00:00.000Z");
        });
    });

});
