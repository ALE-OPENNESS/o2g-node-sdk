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

import { Identifier } from "../../src/types/common/identifier";
import { MainType } from "../../src/types/common/main-type";
import { PartyInfo } from "../../src/types/common/party-info";
import { PartyInfoType } from "../../src/types/common/party-info-type";

// test/users/PartyInfo.test.ts

describe('PartyInfo', () => {

    describe('fromJson', () => {
        it('creates a PartyInfo instance from JSON', () => {
            const party = PartyInfo.fromJson(JSON.parse(
                `{
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
                }`)
            );

            // Check Identifier
            const id = party.id;
            expect(id).toBeInstanceOf(Identifier);
            expect(id.loginName).toBe('jdoe');
            expect(id.phoneNumber).toBe('1001');

            // Check names and display
            expect(party.firstName).toBe('John');
            expect(party.lastName).toBe('Doe');
            expect(party.displayName).toBeNull();

            // Check PartyInfoType
            const type = party.type;
            expect(type).toBeInstanceOf(PartyInfoType);
            expect(type!.main).toBe(MainType.USER);
            expect(type!.subType).toBe('PRO');
        });

        it('creates another PartyInfo instance with different type', () => {
            const party = PartyInfo.fromJson(JSON.parse(
                `{
                    "id": {
                        "loginName": "alice",
                        "phoneNumber": "1001"
                    },
                    "firstName": "Alice",
                    "lastName": "Smith",
                    "type": { 
                        "main": "DEVICE"
                    }
                }`)
            );

            const type = party.type;
            expect(type!.main).toBe(MainType.DEVICE);
            expect(type!.subType).toBeNull();
            expect(party.firstName).toBe('Alice');
            expect(party.lastName).toBe('Smith');
            expect(party.displayName).toBeNull()
        });
    });

    describe('getters', () => {
        it('returns correct values from all getters', () => {
            const party = PartyInfo.fromJson(JSON.parse(
                `{
                    "id": {
                        "loginName": "jdoe",
                        "phoneNumber": "1001"
                    },
                    "firstName": "John",
                    "lastName": "Doe",
                    "displayName": "John Doe",
                    "type": { 
                        "main": "DEVICE"
                    }
                }`)
            );

            expect(party.id).toBeInstanceOf(Identifier);
            expect(party.firstName).toBe("John");
            expect(party.lastName).toBe("Doe");
            expect(party.displayName).toBe("John Doe");
            expect(party.type).toBeInstanceOf(PartyInfoType);
        });
    });

});
