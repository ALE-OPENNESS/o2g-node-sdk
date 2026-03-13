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

import AnalyticsRest from "../../src/internal/rest/analytics-rest";
import { IHttpClient } from "../../src/internal/util/IHttpClient";


import { HttpResponse } from "../../src/internal/util/http-response";
import { Incident } from "../../src/types/analytics/incident";
import { ChargingFile } from "../../src/types/analytics/charging-file";
import { ChargingResult } from "../../src/types/analytics/charging-result";
import { DateRange } from "../../src/types/common/date-range";


describe("EventSumaryRest", () => {

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: AnalyticsRest;

    beforeEach(() => {
        // Create a fresh mock for each test
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };

        service = new AnalyticsRest("/events/analytics", mockHttpClient);
    });

    it("getIncidents: should call httpClient.get and map incidents correctly", async () => {
        const mockJson = {
            incidents: [
                { 
                    date: "26/02/2026",
                    hour: "18:00:02",
                    severity: 0,
                    value: "value",
                    type: "Reset Coupler 3",
                    nbOccurs: 1,
                    node: "2",
                    main: true
                },
                { 
                    date: "26/02/2026",
                    hour: "06:23:12",
                    severity: 0,
                    value: "value2",
                    type: "type2",
                    nbOccurs: 1,
                    node: "2",
                    main: true
                }
            ]
        };

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );
        const result = await service.getIncidents(42, 10);

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
        expect(result?.[0]).toBeInstanceOf(Incident);
        expect(result?.[0].description).toBe("Reset Coupler 3");
    });

    it("getIncidents: should return null if incidents array is missing", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {})
        );

        const result = await service.getIncidents(42, 0);
        expect(result).toBeNull();
    });

    it("getChargingFiles: should call httpClient.get and map ChargingFiles correctly", async () => {
        const mockJson = {
            files: [
                { name: "file1", date: "01/01/26", time: "09:05:00" },
                { name: "file2", date: "02/01/26", time: "10:00:00" }
            ]
        };

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );

        const result = await service.getChargingFiles(42, null);

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(result).toHaveLength(2);
        expect(result?.[0]).toBeInstanceOf(ChargingFile);
        expect(result?.[0].name).toBe("file1");
    });

    it("getChargingFiles: should return null if files array is missing", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {})
        );
        const result = await service.getChargingFiles(42, null);
        expect(result).toBeNull();
    });

    it("getChargingsFromFilter: should call httpClient.get and map ChargingResult correctly", async () => {
        const mockJson = { total: 10, rows: [] };
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );

        const fromDate = new Date(2026, 0, 1);
        const toDate = new Date(2026, 0, 2);

        const result = await service.getChargingsFromFilter(42, new DateRange(fromDate, toDate ), 5, true);

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(ChargingResult);
    });

    it("getChargingsFromFilter: should return null if response body is null", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, null)
        );
        const result = await service.getChargingsFromFilter(42, null, null, false);
        expect(result).toBeNull();
    });

    it("getChargingsFromFiles: should call httpClient.get with file names and return ChargingResult", async () => {
        const mockJson = { total: 5, rows: [] };
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockJson)
        );

        const files = [
            ChargingFile.fromJson({ name: "fileA", date: "01/01/26", time: "09:00:00" }),
            ChargingFile.fromJson({ name: "fileB", date: "02/01/26", time: "10:00:00" })
        ];

        const result = await service.getChargingsFromFiles(42, files, 10, true);

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(result).toBeInstanceOf(ChargingResult);
    });

    it("getChargingsFromFiles: should throw error if files array is null", async () => {
        // @ts-expect-error testing null
        await expect(service.getChargingsFromFiles(42, null, null, false)).rejects.toThrow();
    });
});



