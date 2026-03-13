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

import { ResultItem } from "../../src/types/directory/result-item";
import { SearchResult } from "../../src/types/directory/search-result";


describe('SearchResult', () => {

    it('should correctly create a SearchResult from JSON with result elements', () => {
        const jsonString = `{
            "resultCode": "OK",
            "resultElements": [
                {   
                    "contacts" : [{
                        "id": { 
                            "phoneNumber": "1001"
                        },
                        "firstName": "John",
                        "lastName": "Doe",
                        "type": { 
                            "main": "USER"
                        }
                    }]
                },   
                {   
                    "contacts" : [{
                        "id": { 
                            "phoneNumber": "1002"
                        },
                        "firstName": "Jane",
                        "lastName": "Smith",
                        "type": { 
                            "main": "USER"
                        }
                    }]
                }   
            ]
        }`;

        const searchResult = SearchResult.fromJson(JSON.parse(jsonString));

        expect(searchResult).toBeInstanceOf(SearchResult);
        expect(searchResult.status).toBe(SearchResult.Status.OK);
        expect(searchResult.items).toHaveLength(2);
        expect(searchResult.items![0]).toBeInstanceOf(ResultItem);
        expect(searchResult.items![1]).toBeInstanceOf(ResultItem);
        expect(searchResult.items![0].contacts![0].firstName).toBe('John');
        expect(searchResult.items![1].contacts![0].firstName).toBe('Jane');
    });

    it('should correctly create a SearchResult from JSON with empty results', () => {
        const jsonString = `{
            "resultCode": "TIMEOUT",
            "resultElements": []
        }`;

        const searchResult = SearchResult.fromJson(JSON.parse(jsonString));

        expect(searchResult.status).toBe(SearchResult.Status.TIMEOUT);
        expect(searchResult.items).toHaveLength(0);
    });

    it('should return null for resultCode or resultElements if they are undefined', () => {
        const searchResult = SearchResult.fromJson(JSON.parse("{}"));

        expect(searchResult.status).toBeNull();
        expect(searchResult.items).toBeNull();
    });
});