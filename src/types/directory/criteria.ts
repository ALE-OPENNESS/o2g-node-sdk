/*
 * Copyright 2021 ALE International
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

import { CriterionJson } from '../../internal/types/directory/directory-types';
import { FilterItem } from './filter-item';
import { LogicalOperation } from './logical-operation';
import { OperationFilter } from './operation-filter';

/**
 * Represents a filter criteria to apply on a directory search.
 *
 * A simple criteria is a tuple of the form: `[Attribute, Operation, Value]`.
 * Example: `[LAST_NAME, BEGINS_WITH, "fr"]`.
 *
 * A `Criteria` can also be a logical combination (AND / OR) of multiple other `Criteria` objects.
 *
 * ## Acceptable values for attributes
 * | Value        | Description         |
 * |--------------|---------------------|
 * | LAST_NAME    | The last name       |
 * | FIRST_NAME   | The first name      |
 * | LOGIN_NAME   | The login name      |
 * | PHONE_NUMBER | The phone number    |
 *
 * ## Acceptable values for operations
 * | Value            | Description                                         |
 * |------------------|-----------------------------------------------------|
 * | BEGINS_WITH      | Attribute must begin with the given value           |
 * | ENDS_WITH        | Attribute must end with the given value             |
 * | CONTAINS         | Attribute must contain the given value              |
 * | EQUAL_IGNORE_CASE| Attribute equals the value (case-insensitive)       |
 *
 * ## Examples
 * ```ts
 * // Search users whose last name begins with 'b'
 * const criteria = Criteria.create(
 *     FilterItem.LAST_NAME,
 *     OperationFilter.BEGINS_WITH,
 *     'b'
 * );
 *
 * // Search users whose last name begins with 'b' AND first name contains 'ja'
 * const criteria2 = Criteria.and(
 *     Criteria.create(
 *         FilterItem.LAST_NAME,
 *         OperationFilter.BEGINS_WITH,
 *         'b'
 *     ),
 *     Criteria.create(
 *         FilterItem.FIRST_NAME,
 *         OperationFilter.CONTAINS,
 *         'ja'
 *     )
 * );
 * ```
 */
export class Criteria {
    #field: FilterItem | null;
    #operation: LogicalOperation | OperationFilter;
    #operand: string | Criteria[];

    /**
     * @internal
     * Use the static factory methods `create`, `and`, or `or` to construct instances.
     */
    private constructor(
        field: FilterItem | null,
        operation: LogicalOperation | OperationFilter,
        operand: string | Criteria[]
    ) {
        this.#field = field;
        this.#operation = operation;
        this.#operand = operand;
    }

    /**
     * Creates a new search `Criteria` with the specified attribute, operation, and value.
     *
     * @param field - The attribute to filter
     * @param operation - The operation to apply
     * @param value - The value to match
     * @returns A new `Criteria` instance
     */
    static create(field: FilterItem, operation: OperationFilter, value: string): Criteria {
        return new Criteria(field, operation, value);
    }

    /**
     * Creates a `Criteria` that is the logical OR of multiple criteria.
     *
     * @param criterias - One or more `Criteria` objects
     * @returns A new `Criteria` representing the OR combination
     */
    static or(...criterias: Criteria[]): Criteria {
        return new Criteria(null, LogicalOperation.OR, criterias);
    }

    /**
     * Creates a `Criteria` that is the logical AND of multiple criteria.
     *
     * @param criterias - One or more `Criteria` objects
     * @returns A new `Criteria` representing the AND combination
     */
    static and(...criterias: Criteria[]): Criteria {
        return new Criteria(null, LogicalOperation.AND, criterias);
    }

    /**
     * Returns the operation of this filter.
     *
     * @returns The operation as a string (or "AND"/"OR" for logical combinations)
     */
    get operation(): string {
        return this.#operation;
    }

    /**
     * Returns the field of this filter.
     *
     * @returns The field as a string, or `null` for logical combinations
     */
    get field(): string | null {
        return this.#field;
    }

    /**
     * Returns the operand of this `Criteria`.
     *
     * @returns The operand value (`string` for single filters, `Criteria[]` for logical combinations)
     */
    get operand(): string | Criteria[] {
        return this.#operand;
    }

    /**
     * @ignore
     */
    /** @internal */

    toJson(): CriterionJson {
        const operand = Array.isArray(this.#operand) ? this.#operand.map((c) => c.toJson()) : this.#operand;

        return {
            ...(this.#field && { field: this.#field }),
            operation: this.#operation,
            operand,
        };
    }
}
