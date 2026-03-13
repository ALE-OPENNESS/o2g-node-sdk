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

import { Criteria } from "../../src/types/directory/criteria";
import { FilterItem } from "../../src/types/directory/filter-item";
import { OperationFilter } from "../../src/types/directory/operation-filter";



describe('Criteria', () => {

    it('should create a simple Criteria with correct field, operation, and value', () => {
        const crit = Criteria.create(
            FilterItem.LAST_NAME,
            OperationFilter.BEGINS_WITH,
            'fr'
        );

        expect(crit).toBeInstanceOf(Criteria);
        expect(crit.field).toBe('lastName');
        expect(crit.operation).toBe('BEGIN_WITH');
        expect(crit.operand).toBe('fr');
    });

    it('should create a logical AND Criteria', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');

        const andCrit = Criteria.and(c1, c2);

        expect(andCrit).toBeInstanceOf(Criteria);
        expect(andCrit.field).toBeNull();
        expect(andCrit.operation).toBe('AND');
        expect(Array.isArray(andCrit.operand)).toBe(true);
        expect(andCrit.operand).toHaveLength(2);
        expect(andCrit.operand).toContain(c1);
        expect(andCrit.operand).toContain(c2);
    });

    it('should create a logical OR Criteria', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');

        const orCrit = Criteria.or(c1, c2);

        expect(orCrit).toBeInstanceOf(Criteria);
        expect(orCrit.field).toBeNull();
        expect(orCrit.operation).toBe('OR');
        expect(Array.isArray(orCrit.operand)).toBe(true);
        expect(orCrit.operand).toHaveLength(2);
        expect(orCrit.operand).toContain(c1);
        expect(orCrit.operand).toContain(c2);
    });

    it('should support nested AND/OR combinations', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');
        const c3 = Criteria.create(FilterItem.LOGIN_NAME, OperationFilter.EQUAL_IGNORE_CASE, 'user123');

        const andCrit = Criteria.and(c1, c2);
        const orCrit = Criteria.or(andCrit, c3);

        expect(orCrit.operation).toBe('OR');
        expect(orCrit.operand).toContain(andCrit);
        expect(orCrit.operand).toContain(c3);

        const nestedAnd = orCrit.operand[0] as Criteria;
        expect(nestedAnd.operation).toBe('AND');
        expect((nestedAnd.operand as Criteria[])).toContain(c1);
        expect((nestedAnd.operand as Criteria[])).toContain(c2);
    });


    it('should convert a simple Criteria to JSON', () => {
        const crit = Criteria.create(
            FilterItem.LAST_NAME,
            OperationFilter.BEGINS_WITH,
            'fr'
        );

        const json = crit.toJson();

        expect(json).toEqual({
            field: 'lastName',
            operation: 'BEGIN_WITH',
            operand: 'fr'
        });
    });

    it('should convert an AND Criteria to JSON', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');

        const andCrit = Criteria.and(c1, c2);

        const json = andCrit.toJson();

        expect(json).toEqual({
            operation: 'AND',
            operand: [
                {
                    field: 'lastName',
                    operation: 'BEGIN_WITH',
                    operand: 'fr'
                },
                {
                    field: 'firstName',
                    operation: 'CONTAIN',
                    operand: 'an'
                }
            ]
        });
    });

 it('should convert an OR Criteria to JSON', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');

        const orCrit = Criteria.or(c1, c2);

        const json = orCrit.toJson();

        expect(json).toEqual({
            operation: 'OR',
            operand: [
                {
                    field: 'lastName',
                    operation: 'BEGIN_WITH',
                    operand: 'fr'
                },
                {
                    field: 'firstName',
                    operation: 'CONTAIN',
                    operand: 'an'
                }
            ]
        });
    });

 it('should convert nested AND/OR Criteria to JSON', () => {
        const c1 = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, 'fr');
        const c2 = Criteria.create(FilterItem.FIRST_NAME, OperationFilter.CONTAINS, 'an');
        const c3 = Criteria.create(FilterItem.LOGIN_NAME, OperationFilter.EQUAL_IGNORE_CASE, 'user123');

        const andCrit = Criteria.and(c1, c2);
        const orCrit = Criteria.or(andCrit, c3);

        const json = orCrit.toJson();

        expect(json).toEqual({
            operation: 'OR',
            operand: [
                {
                    operation: 'AND',
                    operand: [
                        {
                            field: 'lastName',
                            operation: 'BEGIN_WITH',
                            operand: 'fr'
                        },
                        {
                            field: 'firstName',
                            operation: 'CONTAIN',
                            operand: 'an'
                        }
                    ]
                },
                {
                    field: 'id.loginName',
                    operation: 'EQUAL_IGNORE_CASE',
                    operand: 'user123'
                }
            ]
        });
    });   
});