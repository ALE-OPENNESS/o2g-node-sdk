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

import { CallType } from "../../src/types/analytics/call-type";
import { Charging } from "../../src/types/analytics/charging";
import { TelFacility } from "../../src/types/analytics/tel-facility";


describe("Charging", () => {
    let jsonString: string;
    let charging: Charging;

    beforeEach(() => {
        jsonString = `{
            "caller": "1234",
            "name": "John Doe",
            "called": "5678",
            "initialDialledNumber": "91011",
            "callNumber": 2,
            "chargingUnits": 50,
            "cost": 12.5,
            "startDate": "20240226 15:30:00",
            "duration": 120,
            "callType": "LocalNode",
            "effectiveCallDuration": 115,
            "actingExtensionNumberNode": 42,
            "internalFacilities": { "facilities": ["BasicCall", "CallForwardingOnBusy"] },
            "externalFacilities": { "facilities": ["CallWaiting"] }
        }`;

        const parsedJson = JSON.parse(jsonString);
        charging = Charging.fromJson(parsedJson);
    });

    test("should create a Charging instance from JSON", () => {
        expect(charging).toBeInstanceOf(Charging);
    });

    test("should correctly parse caller and name", () => {
        expect(charging.caller).toBe("1234");
        expect(charging.name).toBe("John Doe");
    });

    test("should correctly parse called and initialDialedNumber", () => {
        expect(charging.called).toBe("5678");
        expect(charging.initialDialedNumber).toBe("91011");
    });

    test("should correctly parse callNumber, chargingUnits, and cost", () => {
        expect(charging.callNumber).toBe(2);
        expect(charging.chargingUnits).toBe(50);
        expect(charging.cost).toBe(12.5);
    });

    test("should correctly parse startDate and duration", () => {
        expect(charging.startDate).toBeInstanceOf(Date);
        expect(charging.startDate?.getFullYear()).toBe(2024);
        expect(charging.startDate?.getMonth()).toBe(1); // February = 1
        expect(charging.startDate?.getDate()).toBe(26);
        expect(charging.startDate?.getHours()).toBe(15);
        expect(charging.duration).toBe(120);
    });

    test("should correctly parse callType, effectiveCallDuration, and actingExtensionNumberNode", () => {
        expect(charging.callType).toBe(CallType.LocalNode);
        expect(charging.effectiveCallDuration).toBe(115);
        expect(charging.actingExtensionNumberNode).toBe(42);
    });

    test("should correctly parse internal and external facilities", () => {
        expect(charging.internalFacilities).toContain(TelFacility.BasicCall);
        expect(charging.internalFacilities).toContain(TelFacility.CallForwardingOnBusy);
        expect(charging.externalFacilities).toContain(TelFacility.CallWaiting);
    });

    test("should handle missing optional fields", () => {
        const jsonMissingFields = JSON.parse(`{"caller":"9999"}`);
        const c = Charging.fromJson(jsonMissingFields);

        expect(c.caller).toBe("9999");
        expect(c.name).toBeNull();
        expect(c.called).toBeNull();
        expect(c.initialDialedNumber).toBeNull();
        expect(c.callNumber).toBe(0);
        expect(c.chargingUnits).toBe(0);
        expect(c.cost).toBe(0);
        expect(c.startDate).toBeNull();
        expect(c.duration).toBe(0);
        expect(c.callType).toBeNull();
        expect(c.effectiveCallDuration).toBe(0);
        expect(c.actingExtensionNumberNode).toBe(-1);
        expect(c.internalFacilities).toBeNull();
        expect(c.externalFacilities).toBeNull();
    });
});