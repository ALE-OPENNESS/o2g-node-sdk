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

import DirectoryRest from "../../src/internal/rest/directory-rest";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { Criteria, FilterItem, OperationFilter } from "../../src/o2g-node-sdk";
import { SearchResult } from "../../src/types/directory/search-result";


describe("DirectoryRest", () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: DirectoryRest;

    beforeEach(() => {
        // Create a fresh mock for each test
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };

        service = new DirectoryRest("/o2g/directory", mockHttpClient);
    });

    it("search should call put with the search criteria", async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(201, null, "CREATE")
        );

        // Act
        const filter = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, "fr");
        const result = await service.search(filter);

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalled();

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/o2g/directory/search");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            filter: {
                field: "lastName",
                operation: "BEGIN_WITH",
                operand: "fr"
            }
        });

        expect(result).toBe(true);
    });

    it("search should call put with the search criteria with a limit", async () => {
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(201, null, "CREATE")
        );

        // Act
        const filter = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, "fr");
        const result = await service.search(filter, 10, "oxe1000");

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalled();

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/o2g/directory/search?loginName=oxe1000");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            filter: {
                field: "lastName",
                operation: "BEGIN_WITH",
                operand: "fr"
            },
            limit: 10
        });

        expect(result).toBe(true);
    });

    it("Cancel a request should call delete", async () => {
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const result = await service.cancel();

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalled();
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/o2g/directory/search");

        expect(result).toBe(true);
    });


    it("getResult a request should call get", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
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
            }`)
        );

        // Act
        const result = await service.getResults();

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalled();
        expect(mockHttpClient.get).toHaveBeenCalledWith("/o2g/directory/search");

        expect(result).toBeInstanceOf(SearchResult);
        expect(result?.status).toBe(SearchResult.Status.OK)
        expect(result?.items?.length).toBe(2);
    });

});
