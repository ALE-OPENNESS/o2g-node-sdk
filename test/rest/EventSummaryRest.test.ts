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

import EventSumaryRest from "../../src/internal/rest/eventSummary-rest";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { EventSummaryCounters } from "../../src/types/eventsummary/event-summary-counter";


describe("EventSumaryRest", () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: EventSumaryRest;

    beforeEach(() => {
        // Create a fresh mock for each test
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };

        service = new EventSumaryRest("/events/summary", mockHttpClient);
    });

    it("should call httpClient.get with the base URI when loginName is null", async () => {
        // Arrange: mock the HTTP response
        const mockJson = { 
            missedCallsNb: 5, 
            callBackRequestsNb: 2,
            eventWaiting: true
        };

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );

        // Act
        const result = await service.get(null);

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/events/summary");

        expect(result).toBeInstanceOf(EventSummaryCounters);
        expect(result?.missedCallsCount).toBe(5);
        expect(result?.callBackRequestsCount).toBe(2);
        expect(result?.eventWaiting).toBeTruthy();
    });

    it("should append loginName as query parameter when provided", async () => {
        const mockJson = { 
            missedCallsNb: 5, 
            voiceMessagesNb: 2 
        };

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );

        const loginName = "john.doe";

        const result = await service.get(loginName);

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/events/summary?loginName=john.doe");
        expect(result).toBeInstanceOf(EventSummaryCounters);
        expect(result?.missedCallsCount).toBe(5);
        expect(result?.voiceMessagesCount).toBe(2);
    });
});
