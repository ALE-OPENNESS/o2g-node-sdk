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

import { FilterOption } from "../../src/o2g-node-sdk";
import { QueryFilter } from "../../src/types/comlog/query-filter";
import { Role } from "../../src/types/comlog/role";


describe('QueryFilter', () => {

    it('should create an empty filter when no params are provided', () => {
        const filter = new QueryFilter({});

        expect(filter.after).toBeNull();
        expect(filter.before).toBeNull();
        expect(filter.callRef).toBeNull();
        expect(filter.remotePartyId).toBeNull();
        expect(filter.role).toBe(Role.UNKNOWN);
        expect(filter.options.size).toBe(0);
    });

    it('should set all provided fields correctly', () => {
        const after = new Date('2026-01-01');
        const before = new Date('2026-01-31');

        const filter = new QueryFilter({
            after,
            before,
            options: [FilterOption.UNANSWERED],
            callRef: '12345',
            remotePartyId: 'user@example.com',
            role: Role.CALLER
        });

        expect(filter.after?.getTime()).toBe(after.getTime());
        expect(filter.before?.getTime()).toBe(before.getTime());
        expect(filter.callRef).toBe('12345');
        expect(filter.remotePartyId).toBe('user@example.com');
        expect(filter.role).toBe(Role.CALLER);
        expect(filter.options.has(FilterOption.UNANSWERED)).toBe(true);
    });

    it('should defensively copy Date values', () => {
        const originalDate = new Date('2026-01-01');

        const filter = new QueryFilter({ after: originalDate });

        originalDate.setFullYear(2000);

        expect(filter.after?.getFullYear()).toBe(2026);
    });

    it('should defensively copy options Set', () => {
        const options = new Set<FilterOption>([FilterOption.UNANSWERED]);

        const filter = new QueryFilter({ options });

        options.add(FilterOption.UNACKNOWLEDGED);

        expect(filter.options.has(FilterOption.UNACKNOWLEDGED)).toBe(false);
    });

    it('should return a defensive copy of options', () => {
        const filter = new QueryFilter({
            options: [FilterOption.UNANSWERED]
        });

        const retrieved = filter.options as Set<FilterOption>;
        retrieved.add(FilterOption.UNACKNOWLEDGED);

        expect(filter.options.has(FilterOption.UNACKNOWLEDGED)).toBe(false);
    });

    it('should return null for unset optional values', () => {
        const filter = new QueryFilter({});

        expect(filter.after).toBeNull();
        expect(filter.before).toBeNull();
        expect(filter.callRef).toBeNull();
        expect(filter.remotePartyId).toBeNull();
    });

});