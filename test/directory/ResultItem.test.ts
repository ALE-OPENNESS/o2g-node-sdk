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
import { ResultItem } from "../../src/types/directory/result-item";


describe('ResultItem', () => {

    it('should correctly create a ResultItem from JSON with contacts', () => {
        const jsonString = `{
            "contacts" : [{
                "id": { 
                    "phoneNumber": "1001"
                },
                "firstName": "John",
                "lastName": "Doe",
                "type": { 
                    "main": "USER"
                }
            },{
                "id": { 
                    "phoneNumber": "1002"
                },
                "firstName": "Jane",
                "lastName": "Smith",
                "type": { 
                    "main": "USER"
                }
            }]
        }`;

        const resultItem = ResultItem.fromJson(JSON.parse(jsonString));

        expect(resultItem).toBeInstanceOf(ResultItem);
        expect(resultItem.contacts).toHaveLength(2);
        expect(resultItem.contacts![0]).toBeInstanceOf(PartyInfo);
        expect(resultItem.contacts![0].firstName).toBe('John');
        expect(resultItem.contacts![1].lastName).toBe('Smith');
    });

    it('should create a ResultItem with empty contacts if JSON has no contacts', () => {
        const jsonString = `{}`;
        const resultItem = ResultItem.fromJson(JSON.parse(jsonString));

        expect(resultItem.contacts).toBeNull();
    });

});