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

import { AttributeFilter, InstanceFilter, PbxAttribute } from "../../src/o2g-node-sdk";


describe('InstanceFilter', () => {

    describe('create()', () => {
        it('should create filter for each operation', () => {
            const attrName = 'TestAttr';

            const equalsFilter = InstanceFilter.create(attrName, AttributeFilter.Equals, 'val');
            expect(equalsFilter.value).toBe('TestAttr==val');

            const notEqualsFilter = InstanceFilter.create(attrName, AttributeFilter.NotEquals, 'val');
            expect(notEqualsFilter.value).toBe('TestAttr!=val');

            const startsWithFilter = InstanceFilter.create(attrName, AttributeFilter.StartsWith, 'val');
            expect(startsWithFilter.value).toBe('TestAttr==val*');

            const endsWithFilter = InstanceFilter.create(attrName, AttributeFilter.EndsWith, 'val');
            expect(endsWithFilter.value).toBe('TestAttr==*val');

            const geFilter = InstanceFilter.create(attrName, AttributeFilter.GreatherThanOrEquals, 'val');
            expect(geFilter.value).toBe('TestAttr=ge=val');

            const leFilter = InstanceFilter.create(attrName, AttributeFilter.LessThanOrEquals, 'val');
            expect(leFilter.value).toBe('TestAttr=le=val');
        });

        it('should throw an error for unknown operation', () => {
            const unknownOperation = 'UnknownOp' as unknown as AttributeFilter;
            expect((): any => InstanceFilter.create('Attr', unknownOperation, 'val'))
                .toThrow(/Unknown operation/);
        });

        it('should accept PbxAttribute object', () => {
            const pbxAttr = { name: 'PBXAttr' } as PbxAttribute;
            const filter = InstanceFilter.create(pbxAttr, AttributeFilter.Equals, 'val');
            expect(filter.value).toBe('PBXAttr==val');
        });
    });

    describe('and() / or()', () => {
        it('should combine two filters with AND', () => {
            const f1 = InstanceFilter.create('A', AttributeFilter.Equals, '1');
            const f2 = InstanceFilter.create('B', AttributeFilter.Equals, '2');
            const combined = InstanceFilter.and(f1, f2);

            expect(combined.value).toBe('A==1 and B==2');
        });

        it('should combine multiple filters with AND', () => {
            const f1 = InstanceFilter.create('A', AttributeFilter.Equals, '1');
            const f2 = InstanceFilter.create('B', AttributeFilter.Equals, '2');
            const f3 = InstanceFilter.create('C', AttributeFilter.Equals, '3');
            const combined = InstanceFilter.and(f1, f2, f3);

            expect(combined.value).toBe('A==1 and B==2 and C==3');
        });

        it('should combine two filters with OR', () => {
            const f1 = InstanceFilter.create('X', AttributeFilter.Equals, '1');
            const f2 = InstanceFilter.create('Y', AttributeFilter.Equals, '2');
            const combined = InstanceFilter.or(f1, f2);

            expect(combined.value).toBe('X==1 or Y==2');
        });

        it('should combine multiple filters with OR', () => {
            const f1 = InstanceFilter.create('X', AttributeFilter.Equals, '1');
            const f2 = InstanceFilter.create('Y', AttributeFilter.Equals, '2');
            const f3 = InstanceFilter.create('Z', AttributeFilter.Equals, '3');
            const combined = InstanceFilter.or(f1, f2, f3);

            expect(combined.value).toBe('X==1 or Y==2 or Z==3');
        });
    });

});