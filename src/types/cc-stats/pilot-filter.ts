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

import { AbstractFilter } from '../../internal/types/cc-stats/abstract-filter';
import { StatsPilotAttributes } from './pilot-attributes';

/**
 * Filter for selecting pilots in Call Center StatisticsData reports.
 *
 * A `PilotFilter` allows specifying which statistics to collect for pilots.
 *
 * Instances should be obtained via the `Filter.createPilotFilter()` factory method.
 * SDK users do not need to implement this interface directly.
 *
 * @since 2.7.4
 */
export interface PilotFilter extends AbstractFilter {
    /**
     * Returns the set of directory numbers associated with this filter.
     *
     * These numbers identify the pilots whose statistics should be collected.
     *
     * @returns a set of pilot directory numbers; never null, but may be empty
     */
    get numbers(): string[];

    /**
     * Adds one or more pilot directory numbers to this filter.
     *
     * Once added, the corresponding pilots will be included in the scope of
     * statistical reports.
     *
     * @param numbers an array of directory numbers to add; must not be null, though it may be empty
     */
    addNumbers(...numbers: string[]): void;

    /**
     * Returns the set of statistics attributes to collect for pilots.
     *
     * @returns a set of `PilotAttributes`
     */
    get pilotAttributes(): Set<StatsPilotAttributes>;

    /**
     * Sets the statistics attributes for pilots in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the pilot attributes to include
     */
    setPilotAttributes(...attributes: StatsPilotAttributes[]): void;
}
