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

import { ChargingFileJson } from "../../src/internal/types/analytics/analytics-types";
import { ChargingFile } from "../../src/types/analytics/charging-file";



describe("ChargingFile", () => {
    let jsonString: string;
    let json: ChargingFileJson;
    let file: ChargingFile;

    beforeEach(() => {
        // JSON string representing a charging file
        jsonString = `{
            "name": "CF_230226_1200",
            "date": "26/02/26",
            "time": "12:00:00"
        }`;

        // Parse JSON string into object
        json = JSON.parse(jsonString);

        // Create ChargingFile instance from JSON
        file = ChargingFile.fromJson(json);
    });

    test("should create a ChargingFile instance from JSON", () => {
        expect(file).toBeInstanceOf(ChargingFile);
    });

    test("should have correct name", () => {
        expect(file.name).toBe("CF_230226_1200");
    });

    test("should have correct date", () => {
        const expectedDate = new Date("2026-02-26T12:00:00");
        expect(file.date.getTime()).toBe(expectedDate.getTime());
    });

});