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

import CallCenterPilotRest from "../../src/internal/rest/ccPilot-rest";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";


describe("CallCenterPilotRest", () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let rest: CallCenterPilotRest;
    const baseUri = "https://api.example.com/callcenter/pilots";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
            put: jest.fn(),
        } as unknown as jest.Mocked<IHttpClient>;

        rest = new CallCenterPilotRest(baseUri, mockHttpClient);
    });

    it("should start monitoring a pilot", async () => {
        const pilotNumber = "1001";
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, null));

        const result = await rest.monitorStart(pilotNumber);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${baseUri}/${pilotNumber}`
        );

        expect(result).toBe(true);
    });

    it("should stop monitoring a pilot", async () => {
        const pilotNumber = "1001";
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, null));

        const result = await rest.monitorStop(pilotNumber);

        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            `${baseUri}/${pilotNumber}`
        );

        expect(result).toBe(true);
    });

    it("should fail to start monitoring if HTTP status is not successful", async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(400, null, null));

        const result = await rest.monitorStart("1200");

        expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
        expect(result).toBe(false);
    });
});