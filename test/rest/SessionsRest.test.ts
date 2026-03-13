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

import SessionsRest from "../../src/internal/rest/sessions-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";

describe('SessionsRest Full Suite', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: SessionsRest;
    const baseUri = 'http://o2g/sessions';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        service = new SessionsRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // open
    // ----------------------------

    it('open should POST applicationName only when supervisedAccount is null', async () => {

        const jsonString = `
        {
            "admin": true,
            "login": "oxe1001",
            "timeToLive": 3600,
            "publicBaseUrl": "http://public",
            "privateBaseUrl": "http://private",
            "services": [],
            "creationDate": "2023-01-01T00:00:00Z",
            "expirationDate": "2023-01-01T01:00:00Z",
            "otherSessions": []
        }`;

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.open("MyApp", null);

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(baseUri);

        expect(JSON.parse((body as HttpContent).content)).toEqual({
            applicationName: "MyApp"
        });

        expect(result).not.toBeNull();
        expect(result!.login).toBe("oxe1001");
    });


    it('open should POST with supervisedAccount when provided', async () => {

        const supervisedAccountMock = {
            toJson: jest.fn().mockReturnValue({
                accountId: "acc1",
                domain: "test"
            })
        };

        const jsonString = `
        {
            "admin": false,
            "login": "supervisor",
            "timeToLive": 1800,
            "publicBaseUrl": "http://public",
            "privateBaseUrl": "http://private",
            "services": [],
            "creationDate": "2023-01-01T00:00:00Z",
            "expirationDate": "2023-01-01T00:30:00Z",
            "otherSessions": []
        }`;

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, jsonString)
        );

        const result = await service.open("MyApp", supervisedAccountMock as any);

        const [url, body] = mockHttpClient.post.mock.calls[0];

        expect(url).toBe(baseUri);

        expect(JSON.parse((body as HttpContent).content)).toEqual({
            applicationName: "MyApp",
            supervisedAccount: {
                accountId: "acc1",
                domain: "test"
            }
        });

        expect(supervisedAccountMock.toJson).toHaveBeenCalled();
        expect(result).not.toBeNull();
        expect(result!.login).toBe("supervisor");
    });


    it('open should return null if response is not success', async () => {

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(500, null, '')
        );

        const result = await service.open("MyApp", null);

        expect(result).toBeNull();
    });


    // ----------------------------
    // close
    // ----------------------------

    it('close should DELETE base uri', async () => {

        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const result = await service.close();

        expect(mockHttpClient.delete).toHaveBeenCalledWith(baseUri);
        expect(result).toBe(true);
    });

    it('close should return false if status not success', async () => {

        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(400, null, '')
        );

        const result = await service.close();

        expect(result).toBe(false);
    });


    // ----------------------------
    // keepAlive
    // ----------------------------

    it('keepAlive should POST to keepalive endpoint', async () => {

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, '')
        );

        const result = await service.keepAlive();

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/keepalive`
        );

        expect(result).toBe(true);
    });

    it('keepAlive should return false if status not success', async () => {

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(503, null, '')
        );

        const result = await service.keepAlive();

        expect(result).toBe(false);
    });

});
