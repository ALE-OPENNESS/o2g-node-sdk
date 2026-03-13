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

import CommunicationLogRest from "../../src/internal/rest/comlog-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { FilterOption, Page, QueryFilter } from "../../src/o2g-node-sdk";
import { Role } from "../../src/types/comlog/role";

describe('CommunicationLogRest Full Suite (strict URL & body with ComRecord)', () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: CommunicationLogRest;
    const baseUri = 'http://o2g/comlog';

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        } as any;

        service = new CommunicationLogRest(baseUri, mockHttpClient);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    // ----------------------------
    // getComRecords
    // ----------------------------
    it('getComRecords should GET full URL with filter, page, optimized', async () => {

        const jsonString = `
        {
            "offset": 5,
            "limit": 10,
            "totalCount": 2,
            "comHistoryRecords": [
                { "recordId": 1, "comRef": "ref1" },
                { "recordId": 2, "comRef": "ref2" }
            ]
        }`;
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, jsonString));

        const filter = new QueryFilter({
            after: new Date("2023-01-01"),
            before: new Date("2023-01-31"),
            options: [FilterOption.UNACKNOWLEDGED],
            role: Role.CALLEE,
            callRef: "ref1",
            remotePartyId: "party1"
        });

        const page = new Page(5, 10);

        const result = await service.getComRecords(filter, page, true, "oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);

        const [calledUrl] = mockHttpClient.get.mock.calls[0];
        expect(calledUrl).toBe(
            baseUri +
            '?loginName=oxe1000&' +
            'afterDate=2023-01-01T00%3A00%3A00.000Z&' +
            'beforeDate=2023-01-31T00%3A00%3A00.000Z&' +
            'unacknowledged=true&' +
            'role=CALLEE&' +
            'comRef=ref1&' +
            'remotePartyId=party1&' +
            'offset=5&limit=10&' +
            'optimized=true'
        );

        expect(result).not.toBeNull();
        expect(result!.records.length).toBe(2);
        expect(result!.records[0].id).toBe(1);
        expect(result!.records[0].comRef).toBe("ref1");
    });

    // ----------------------------
    // getComRecord
    // ----------------------------
    it('getComRecord should GET correct URL for single record', async () => {
        const jsonString = `{ "recordId": 99, "comRef": "ref99" }`;
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, jsonString));

        const result = await service.getComRecord("99", "oxe1000");

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);

        const [calledUrl] = mockHttpClient.get.mock.calls[0];
        expect(calledUrl).toBe(`${baseUri}/99?loginName=oxe1000`);

        expect(result).not.toBeNull();
        expect(result!.id).toBe(99);
        expect(result!.comRef).toBe("ref99");
    });

    // ----------------------------
    // deleteComRecord
    // ----------------------------
    it('deleteComRecord should DELETE correct URL', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.deleteComRecord("50", "oxe1000");

        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);

        const [calledUrl] = mockHttpClient.delete.mock.calls[0];
        expect(calledUrl).toBe(`${baseUri}/50?loginName=oxe1000`);

        expect(result).toBe(true);
    });

    // ----------------------------
    // deleteComRecordsById
    // ----------------------------
    it('deleteComRecordsById should DELETE multiple records', async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.deleteComRecordsById(["101", "102"], "oxe1000");

        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);

        const [calledUrl] = mockHttpClient.delete.mock.calls[0];
        expect(calledUrl).toBe(`${baseUri}?recordIdList=101%2C102&loginName=oxe1000`);

        expect(result).toBe(true);
    });

    // ----------------------------
    // acknowledgeComRecords (PUT)
    // ----------------------------
    it('acknowledgeComRecords should PUT correct URL and body', async () => {
        mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.acknowledgeComRecords(["201", "202"], "oxe1000");

        expect(mockHttpClient.put).toHaveBeenCalledTimes(1);

        const [calledUrl, body] = mockHttpClient.put.mock.calls[0];
        expect(calledUrl).toBe(`${baseUri}?acknowledge=true&loginName=oxe1000`);
        expect(JSON.parse((body as HttpContent).content)).toEqual({ recordIds: ["201", "202"] });

        expect(result).toBe(true);
    });

    it('unacknowledgeComRecord should PUT ack=false for single record', async () => {
        mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await service.unacknowledgeComRecord("303", "oxe1000");

        expect(mockHttpClient.put).toHaveBeenCalledTimes(1);

        const [calledUrl, body] = mockHttpClient.put.mock.calls[0];
        expect(calledUrl).toBe(`${baseUri}?acknowledge=false&loginName=oxe1000`);
        expect(JSON.parse((body as HttpContent).content)).toEqual({ recordIds: ["303"] });

        expect(result).toBe(true);
    });

});