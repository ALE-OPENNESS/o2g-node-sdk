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

import { DateRange } from "../../src/types/common/date-range";


describe('DateRange', () => {

    it('should create a valid DateRange', () => {
        const from = new Date('2026-01-01');
        const to = new Date('2026-01-31');

        const range = new DateRange(from, to);

        expect(range.from.getTime()).toBe(from.getTime());
        expect(range.to.getTime()).toBe(to.getTime());
    });

    it('should throw if from > to', () => {
        const from = new Date('2026-02-01');
        const to = new Date('2026-01-31');

        expect(() => new DateRange(from, to)).toThrow('"from" date must be before or equal to "to" date');
    });

    it('should return defensive copies for getters', () => {
        const from = new Date('2026-01-01');
        const to = new Date('2026-01-31');

        const range = new DateRange(from, to);

        const f = range.from;
        const t = range.to;

        f.setFullYear(2000);
        t.setFullYear(2000);

        // Original internal state should not change
        expect(range.from.getFullYear()).toBe(2026);
        expect(range.to.getFullYear()).toBe(2026);
    });

    it('should allow from and to to be the same date', () => {
        const date = new Date('2026-01-01');
        const range = new DateRange(date, date);

        expect(range.from.getTime()).toBe(date.getTime());
        expect(range.to.getTime()).toBe(date.getTime());
    });

});