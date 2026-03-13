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

import { CallDataPilot } from "../../src/types/cc-pilot/call-data-pilot";
import { CorrelatorData } from "../../src/types/telephony/call/correlator-data";
import { TrunkIdentification } from "../../src/types/telephony/trunk-indentification";

/**
 * Unit tests for CallDataPilot with private constructor
 */


describe('CallDataPilot', () => {

    it('should create instance via fromJson', () => {
        const jsonString = `{
            "initialCalled": "12345",
            "anonymous": true,
            "associatedData": "abc123",
            "trunkIdentification": {
                "networkTimeslot": 2,
                "trunkNeqt": [101]
            },
            "networkRerouted": true
        }`;

        const call = CallDataPilot.fromJson(JSON.parse(jsonString));

        expect(call.initialCalled).toBe('12345');
        expect(call.anonymous).toBe(true);
        expect(call.networkRerouted).toBe(true);

        // TrunkIdentification should be parsed correctly
        expect(call.trunkIdentification).toBeInstanceOf(TrunkIdentification);
        expect(call.trunkIdentification?.networkTimeslot).toBe(2);
        expect(call.trunkIdentification?.trunkNeqt).toEqual([101]);

        // CorrelatorData created from associatedData takes priority over hex
        const correlator = call.correlatorData;
        expect(correlator).toBeInstanceOf(CorrelatorData);
        expect(correlator?.asString()).toBe('abc123');
    });

    it('should return null correlatorData when no data is provided', () => {

        const jsonString = `{
            "initialCalled": "12345"
        }`;

        const call = CallDataPilot.fromJson(JSON.parse(jsonString));

        expect(call.correlatorData).toBeNull();
        expect(call.trunkIdentification).toBeNull();
        expect(call.initialCalled).toBe('12345');
        expect(call.anonymous).toBe(false);
        expect(call.networkRerouted).toBe(false);
    });
});