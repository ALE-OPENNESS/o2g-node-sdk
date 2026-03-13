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

import { DndStateJson } from "../../src/internal/types/routing/routing-types";
import { DndState } from "../../src/types/routing/dnd-state";


// test/users/DndState.test.ts

describe('DndState', () => {

    describe('fromJson', () => {
        it('creates a DndState with activate = true', () => {
            const json: DndStateJson = { activate: true };
            const dnd = DndState.fromJson(json);
            expect(dnd.activate).toBe(true);
        });

        it('creates a DndState with activate = false', () => {
            const json: DndStateJson = { activate: false };
            const dnd = DndState.fromJson(json);
            expect(dnd.activate).toBe(false);
        });
    });

    describe('getter isActivate', () => {
        it('returns the correct activation state', () => {
            const dndTrue = DndState.fromJson({ activate: true });
            expect(dndTrue.activate).toBe(true);

            const dndFalse = DndState.fromJson({ activate: false });
            expect(dndFalse.activate).toBe(false);
        });
    });
});
