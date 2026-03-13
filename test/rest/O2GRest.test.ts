/*
* Copyright 2021 ALE International
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

import O2GRest from "../../src/internal/rest/o2g-rest";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";

describe('O2GRest Full Suite', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: O2GRest;
    const baseUri = 'http://o2g';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        service = new O2GRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // get - success
    // ----------------------------

    it('get should return RoxeRestApiDescriptor when status is success', async () => {

        const jsonString = `
        {
            "serverInfo": {
                "productName": "O2G",
                "productType": "Communication",
                "productVersion": {
                    "major": "1",
                    "minor": "0"
                },
                "haMode": true
            },
            "versions": [
                {
                    "id": "v1",
                    "status": "stable",
                    "publicUrl": "http://public/v1",
                    "internalUrl": "http://internal/v1"
                }
            ]
        }`;

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.get();

        expect(mockHttpClient.get).toHaveBeenCalledWith(baseUri);

        expect(result).toBeDefined();
        expect(result.serverInfo.productName).toBe("O2G");
        expect(result.versions.length).toBe(1);
        expect(result.versions[0].id).toBe("v1");
    });


    // ----------------------------
    // get - failure
    // ----------------------------

    it('get should throw error when status is not success', async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(500, null, '')
        );

        await expect(service.get()).rejects.toThrow(
            "Unable to get O2G service"
        );

        expect(mockHttpClient.get).toHaveBeenCalledWith(baseUri);
    });

});