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

import { RoutingCapabilitiesJson } from "../../src/internal/types/routing/routing-types";
import { RoutingCapabilities } from "../../src/types/routing/routing-capabilities";

// test/users/RoutingCapabilities.test.ts

describe('RoutingCapabilities', () => {
    const sampleJson: RoutingCapabilitiesJson = {
        presentationRoute: true,
        forwardRoute: false,
        overflowRoute: true,
        dnd: false
    };

    const sampleJsonAllTrue: RoutingCapabilitiesJson = {
        presentationRoute: true,
        forwardRoute: true,
        overflowRoute: true,
        dnd: true
    };

    const sampleJsonAllFalse: RoutingCapabilitiesJson = {
        presentationRoute: false,
        forwardRoute: false,
        overflowRoute: false,
        dnd: false
    };

    describe('fromJson', () => {
        it('creates a RoutingCapabilities instance with mixed boolean values', () => {
            const rc = RoutingCapabilities.fromJson(sampleJson);
            expect(rc.presentationRoute).toBe(true);
            expect(rc.forwardRoute).toBe(false);
            expect(rc.overflowRoute).toBe(true);
            expect(rc.dnd).toBe(false);
        });

        it('creates a RoutingCapabilities instance with all true', () => {
            const rc = RoutingCapabilities.fromJson(sampleJsonAllTrue);
            expect(rc.presentationRoute).toBe(true);
            expect(rc.forwardRoute).toBe(true);
            expect(rc.overflowRoute).toBe(true);
            expect(rc.dnd).toBe(true);
        });

        it('creates a RoutingCapabilities instance with all false', () => {
            const rc = RoutingCapabilities.fromJson(sampleJsonAllFalse);
            expect(rc.presentationRoute).toBe(false);
            expect(rc.forwardRoute).toBe(false);
            expect(rc.overflowRoute).toBe(false);
            expect(rc.dnd).toBe(false);
        });
    });

    describe('getters', () => {
        it('returns the correct values from getters', () => {
            const rc = RoutingCapabilities.fromJson(sampleJson);
            expect(rc.presentationRoute).toBe(true);
            expect(rc.forwardRoute).toBe(false);
            expect(rc.overflowRoute).toBe(true);
            expect(rc.dnd).toBe(false);
        });
    });
});
