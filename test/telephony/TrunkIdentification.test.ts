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

import { TrunkIdentification } from "../../src/types/telephony/trunk-indentification";

/**
 * Unit tests for TrunkIdentification
 */

describe('TrunkIdentification', () => {
    const sampleJson = {
        networkTimeslot: 5,
        trunkNeqt: [10, 20, 30],
    };

    it('should create an instance from JSON', () => {
        const trunk = TrunkIdentification.fromJson(sampleJson);

        expect(trunk).toBeInstanceOf(TrunkIdentification);
        expect(trunk.networkTimeslot).toBe(5);
        expect(trunk.trunkNeqt).toEqual([10, 20, 30]);
    });

    it('should return correct networkTimeslot', () => {
        const trunk = TrunkIdentification.fromJson(sampleJson);
        expect(trunk.networkTimeslot).toBe(5);
    });

    it('should return correct trunkNeqt array', () => {
        const trunk = TrunkIdentification.fromJson(sampleJson);
        expect(trunk.trunkNeqt).toEqual([10, 20, 30]);
    });

    it('should create separate instances for multiple calls', () => {
        const trunk1 = TrunkIdentification.fromJson(sampleJson);
        const trunk2 = TrunkIdentification.fromJson({ networkTimeslot: 7, trunkNeqt: [1, 2] });

        expect(trunk1).not.toBe(trunk2);
        expect(trunk1.networkTimeslot).toBe(5);
        expect(trunk2.networkTimeslot).toBe(7);
    });
});