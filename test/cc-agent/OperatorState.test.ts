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

import { OperatorState } from "../../src/types/cc-agent/operator-state";



describe("OperatorState", () => {
    let json: any;
    let state: OperatorState;

    beforeEach(() => {
        const jsonString = `{
            "mainState": "LOG_ON",
            "subState": "READY",
            "proAcdDeviceNumber": "23000",
            "pgNumber": "32000",
            "withdraw": true,
            "withdrawReason": 5
        }`;

        json = JSON.parse(jsonString);
        state = OperatorState.fromJson(json);
    });

    // -------------------------------------------------
    // Basic creation
    // -------------------------------------------------
    test("should create OperatorState from JSON", () => {
        expect(state).toBeInstanceOf(OperatorState);
    });

    test("should have correct mainState", () => {
        expect(state.mainState).toBe("LOG_ON");
    });

    test("should have correct subState", () => {
        expect(state.subState).toBe("READY");
    });

    test("should have correct proAcdDeviceNumber", () => {
        expect(state.proAcdDeviceNumber).toBe("23000");
    });

    test("should have correct pgNumber", () => {
        expect(state.pgNumber).toBe("32000");
    });

    test("should have correct withdraw", () => {
        expect(state.withdraw).toBe(true);
    });

    test("should have correct withdrawReason", () => {
        expect(state.withdrawReason).toBe(5);
    });

    // -------------------------------------------------
    // Missing optional fields
    // -------------------------------------------------
    test("should handle missing optional withdrawReason", () => {
        const jsonString = `{
            "mainState": "LOG_ON",
            "subState": "READY",
            "proAcdDeviceNumber": "23000",
            "pgNumber": "32000",
            "withdraw": false
        }`;
        const parsedJson = JSON.parse(jsonString);
        const s = OperatorState.fromJson(parsedJson);

        expect(s.withdraw).toBe(false);
        expect(s.withdrawReason).toBeNull();
    });

    test("should default subState to UNKNOWN if missing", () => {
        const jsonString = `{
            "mainState": "LOG_OFF",
            "proAcdDeviceNumber": "23001"
        }`;
        const parsedJson = JSON.parse(jsonString);
        const s = OperatorState.fromJson(parsedJson);

        expect(s.mainState).toBe("LOG_OFF");
        expect(s.subState).toBe("UNKNOWN");
    });

    test("should return null for optional string fields if missing", () => {
        const jsonString = `{
            "mainState": "LOG_OFF"
        }`;
        const parsedJson = JSON.parse(jsonString);
        const s = OperatorState.fromJson(parsedJson);

        expect(s.proAcdDeviceNumber).toBeNull();
        expect(s.pgNumber).toBeNull();
        expect(s.withdrawReason).toBeNull();
        expect(s.withdraw).toBe(false);
    });

    // -------------------------------------------------
    // All enum values coverage
    // -------------------------------------------------
    it("should correctly parse all OperatorMainState values using strings", () => {
        // Array of strings instead of enum members
        const values = ["UNKNOWN", "LOG_ON", "LOG_OFF", "ERROR"];

        values.forEach(valueStr => {
            // simulate JSON parsing
            const json = JSON.parse(`{"mainState":"${valueStr}"}`);
            const s = OperatorState.fromJson(json);
            expect(s.mainState).toBe(valueStr as OperatorState.OperatorMainState);
        });
    });

    it("should correctly parse all OperatorDynamicState values using strings", () => {
        // Array of strings instead of enum members
        const values = [
            "READY",
            "OUT_OF_PG",
            "BUSY",
            "TRANSACTION_CODE_INPUT",
            "WRAPUP",
            "PAUSE",
            "WITHDRAW",
            "WRAPUP_IM",
            "WRAPUP_EMAIL",
            "WRAPUP_EMAIL_INTERRUPTIBLE",
            "WRAPUP_OUTBOUND",
            "WRAPUP_CALLBACK",
            "UNKNOWN"
        ];

        values.forEach(valueStr => {
            // simulate JSON parsing like a real API response
            const json = JSON.parse(`{"mainState":"LOG_ON","subState":"${valueStr}"}`);
            const s = OperatorState.fromJson(json);

            // cast string to enum type
            expect(s.subState).toBe(valueStr as OperatorState.OperatorDynamicState);
        });
    });
    
    // -------------------------------------------------
    // Defensive / malformed JSON
    // -------------------------------------------------
    test("should handle completely empty JSON gracefully", () => {
        const s = OperatorState.fromJson({} as any);

        expect(s.mainState).toBeUndefined();
        expect(s.subState).toBe("UNKNOWN");
        expect(s.proAcdDeviceNumber).toBeNull();
        expect(s.pgNumber).toBeNull();
        expect(s.withdraw).toBe(false);
        expect(s.withdrawReason).toBeNull();
    });

});