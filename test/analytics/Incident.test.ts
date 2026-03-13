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

import { Incident } from "../../src/o2g-node-sdk";

describe("Incident", () => {
    let jsonString: string;
    let json: any;
    let incident: Incident;

    beforeEach(() => {
        jsonString = `{
            "value": "123",
            "severity": 2,
            "type": "Network failure",
            "nbOccurs": 5,
            "node": "10",
            "date": "25/02/26",
            "hour": "14:35:00",
            "main": true,
            "rack": "R1",
            "board": "B2",
            "equipment": "EQ1",
            "termination": "T1"
        }`;

        json = JSON.parse(jsonString);
        incident = Incident.fromJson(json);
    });

    test("should create an Incident instance from JSON", () => {
        expect(incident).toBeInstanceOf(Incident);
    });

    test("should correctly parse id, severity, description, nbOccurs, and node", () => {
        expect(incident.id).toBe(123);
        expect(incident.severity).toBe(2);
        expect(incident.description).toBe("Network failure");
        expect(incident.nbOccurs).toBe(5);
        expect(incident.node).toBe(10);
    });

    test("should correctly parse main flag", () => {
        expect(incident.main).toBe(true);
    });

    test("should correctly parse optional fields", () => {
        expect(incident.rack).toBe("R1");
        expect(incident.board).toBe("B2");
        expect(incident.equipment).toBe("EQ1");
        expect(incident.termination).toBe("T1");
    });

    test("should return null for missing optional fields", () => {
        const jsonStringMissing = `{
            "value": "124",
            "severity": 1,
            "type": "Power failure",
            "nbOccurs": 1,
            "node": "11",
            "date": "26/02/26",
            "hour": "08:00:00",
            "main": false
        }`;
        const jsonMissing = JSON.parse(jsonStringMissing);
        const inc = Incident.fromJson(jsonMissing);

        expect(inc.rack).toBeNull();
        expect(inc.board).toBeNull();
        expect(inc.equipment).toBeNull();
        expect(inc.termination).toBeNull();
    });

    test("should correctly parse the date and hour", () => {
        const date = incident.date;
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(2026);
        expect(date.getMonth()).toBe(1); // February is month 1 in JS Date
        expect(date.getDate()).toBe(25);
        expect(date.getHours()).toBe(14);
        expect(date.getMinutes()).toBe(35);
        expect(date.getSeconds()).toBe(0);
    });
});