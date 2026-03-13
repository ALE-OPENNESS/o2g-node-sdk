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

import { AssertUtil } from '../../internal/util/assert';
import { AttributeFilter } from './attribute-filter';
import { PbxAttribute } from './pbx-attribute';

/**
 * Represents a filter used to query OmniPCX Enterprise object instances.
 * <p>
 * Filters can be created for specific attributes using {@link create}, and
 * combined using the logical operators {@link and} and {@link or}.
 *
 * @example
 * ```typescript
 * // Simple filter — all analog subscribers
 * const analog = InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG");
 *
 * // Combined filter — analog or ALE-300 subscribers whose name starts with "f"
 * const complex = InstanceFilter.and(
 *     InstanceFilter.or(
 *         InstanceFilter.create("StationType", AttributeFilter.Equals, "ANALOG"),
 *         InstanceFilter.create("StationType", AttributeFilter.Equals, "ALE-300")
 *     ),
 *     InstanceFilter.create("Directory_Name", AttributeFilter.StartsWith, "f")
 * );
 *
 * const ids = await O2G.pbxManagement.getObjectInstances(1, "Subscriber", complex);
 * ```
 *
 * @see PbxManagement.getObjectInstances
 */
export class InstanceFilter {
    #value: string;

    /**
     * @internal
     */
    constructor(value: string) {
        this.#value = value;
    }

    /**
     * Returns the internal string representation of this filter.
     *
     * @returns the filter expression as a string
     */
    get value(): string {
        return this.#value;
    }

    /**
     * Creates a new filter for a specific attribute using the given operation and value.
     *
     * @param attribute the attribute to filter on, either a {@link PbxAttribute} object or a string name
     * @param operation the comparison operation to apply
     * @param value     the value to test against
     * @returns a new {@link InstanceFilter} instance representing the condition
     * @throws Error if an unknown operation is provided
     * @see AttributeFilter
     */
    static create(attribute: string | PbxAttribute, operation: AttributeFilter, value: string): InstanceFilter {
        let attrName = typeof attribute === 'object' ? attribute.name : attribute;

        switch (operation) {
            case AttributeFilter.Equals:
                return new InstanceFilter(attrName + '==' + value);
            case AttributeFilter.NotEquals:
                return new InstanceFilter(attrName + '!=' + value);
            case AttributeFilter.StartsWith:
                return new InstanceFilter(attrName + '==' + value + '*');
            case AttributeFilter.EndsWith:
                return new InstanceFilter(attrName + '==*' + value);
            case AttributeFilter.GreatherThanOrEquals:
                return new InstanceFilter(attrName + '=ge=' + value);
            case AttributeFilter.LessThanOrEquals:
                return new InstanceFilter(attrName + '=le=' + value);
            default:
                throw new Error('Unknown operation: ' + operation);
        }
    }

    /**
     * Combines multiple filters with a logical AND operator.
     * <p>
     * All provided filters must be satisfied for the combined filter to match.
     *
     * @param filter1      the first filter
     * @param filter2      the second filter
     * @param otherFilters additional optional filters
     * @returns a new {@link InstanceFilter} representing the combined condition
     * @see or
     */
    static and(filter1: InstanceFilter, filter2: InstanceFilter, ...otherFilters: InstanceFilter[]): InstanceFilter {
        return this.combineOperator('and', filter1, filter2, otherFilters);
    }

    /**
     * Combines multiple filters with a logical OR operator.
     * <p>
     * At least one of the provided filters must be satisfied for the combined filter to match.
     *
     * @param filter1      the first filter
     * @param filter2      the second filter
     * @param otherFilters additional optional filters
     * @returns a new {@link InstanceFilter} representing the combined condition
     * @see and
     */
    static or(filter1: InstanceFilter, filter2: InstanceFilter, ...otherFilters: InstanceFilter[]): InstanceFilter {
        return this.combineOperator('or', filter1, filter2, otherFilters);
    }

    /**
     * @internal
     */
    private static combineOperator(
        ope: string,
        filter1: InstanceFilter,
        filter2: InstanceFilter,
        otherFilters: InstanceFilter[]
    ): InstanceFilter {
        let result =
            AssertUtil.notNull(filter1, 'filter1').value +
            ' ' +
            ope +
            ' ' +
            AssertUtil.notNull(filter2, 'filter2').value;
        otherFilters.forEach((f) => (result = result + ' ' + ope + ' ' + f.value));
        return new InstanceFilter(result);
    }
}
