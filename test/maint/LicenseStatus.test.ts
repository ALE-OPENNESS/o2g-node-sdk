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

import { LicenseStatusJson } from "../../src/internal/types/maint/maint-types";
import { LicenseStatus } from "../../src/types/maint/license-status";
import { LicenseType } from "../../src/types/maint/license-type";



// test/users/DndState.test.ts

describe('LicenseStatus', () => {

    describe('fromJson', () => {
        it('creates a License Status from json', () => {

            const jsonString = `{
                "type": "FLEXLM",
                "context": "A context",
                "currentServer": "localhost",
                "status": "NORMAL",
                "statusMessage": "Message status abcd",
                "lics": [
                {
                    "name": "ROXE_HA",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_TOKEN_MODE",
                    "total": 1,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                },
                {
                    "name": "ROXE_API_TEL_BASIC",
                    "total": 200000,
                    "currentUsed": 0,
                    "expiration": "31-dec-2026",
                    "application": true
                }
                ]
            }`;

            let json: LicenseStatusJson = JSON.parse(jsonString);
            const licenseStatus = LicenseStatus.fromJson(json);

            expect(licenseStatus.context).toBe("A context");
            expect(licenseStatus.currentServer).toBe("localhost");
            expect(licenseStatus.licenses instanceof Array).toBe(true);
            expect(licenseStatus.licenses!.length).toBe(3);
            expect(licenseStatus.status).toBe("NORMAL");
            expect(licenseStatus.statusMessage).toBe("Message status abcd");
            expect(licenseStatus.type).toBe(LicenseType.FLEXLM);
        });
    });

});
