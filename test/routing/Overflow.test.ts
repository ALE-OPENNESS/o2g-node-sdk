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

import { OverflowRouteJson } from "../../src/internal/types/routing/routing-types";
import { Destination } from "../../src/types/routing/destination";
import { Overflow } from "../../src/types/routing/overflow";
import { OverflowCondition } from "../../src/types/routing/overflow-condition";

// test/routing/Overflow.test.ts

describe('Overflow', () => {
    describe('fromJson', () => {
        it('returns default Overflow when JSON is null', () => {
            const overflow = Overflow.fromJson(null);
            expect(overflow.destination).toBe(Destination.NONE);
            expect(overflow.condition).toBeNull();
        });

        it('returns default Overflow when destinations array is empty', () => {
            const overflow = Overflow.fromJson({ destinations: [] } as OverflowRouteJson);
            expect(overflow.destination).toBe(Destination.NONE);
            expect(overflow.condition).toBeNull();
        });

        it('parses valid JSON with destination and condition', () => {
            const json: OverflowRouteJson = {
                destinations: [{ type: 'VOICEMAIL', selected: true }],
                overflowType: 'BUSY'
            };

            const overflow = Overflow.fromJson(json);
            expect(overflow.destination).toBe(Destination.VOICEMAIL);
            expect(overflow.condition).toBe(OverflowCondition.BUSY);
        });

        it('falls back to NONE for unknown destination', () => {
            const json: OverflowRouteJson = {
                destinations: [{ type: 'UNKNOWN' as any, selected: true }],
                overflowType: 'BUSY'
            };

            const overflow = Overflow.fromJson(json);
            expect(overflow.destination).toBe(Destination.NONE);
            expect(overflow.condition).toBe(OverflowCondition.BUSY);
        });

        it('falls back to null for unknown condition', () => {
            const json: OverflowRouteJson = {
                destinations: [{ type: 'VOICEMAIL', selected: true }],
                overflowType: 'UNKNOWN' as any
            };

            const overflow = Overflow.fromJson(json);
            expect(overflow.destination).toBe(Destination.VOICEMAIL);
            expect(overflow.condition).toBeNull();
        });
    });

    describe('onVoiceMail', () => {
        it('creates an Overflow with VOICEMAIL destination', () => {
            const overflow = Overflow.onVoiceMail(OverflowCondition.BUSY);
            expect(overflow.destination).toBe(Destination.VOICEMAIL);
            expect(overflow.condition).toBe(OverflowCondition.BUSY);
        });
    });

    describe('getters', () => {
        it('returns the correct destination and condition', () => {
            const overflow = Overflow.onVoiceMail(OverflowCondition.NO_ANSWER);
            expect(overflow.destination).toBe(Destination.VOICEMAIL);
            expect(overflow.condition).toBe(OverflowCondition.NO_ANSWER);
        });
    });

    describe('toJson', () => {
        it('serializes to correct JSON', () => {
            const overflow = Overflow.onVoiceMail(OverflowCondition.BUSY);
            const json = overflow.toJson();

            expect(json).toEqual({
                overflowType: OverflowCondition.BUSY,
                destinations: [
                    { type: 'VOICEMAIL', selected: true }
                ]
            });
        });

        it('serializes correctly when condition is null', () => {
            const overflow = Overflow.fromJson(null);
            const json = overflow.toJson();

            expect(json).toEqual({
                overflowType: undefined,
                destinations: [
                    { type: 'NONE', selected: true }
                ]
            });
        });
    });
});
