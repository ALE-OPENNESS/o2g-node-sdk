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
import { StatsPilotAbandonedCallsAttributes } from './pilot-abandoned-calls-attributes';

/**
 * Filter for selecting pilots in abandoned call statistics reports.
 * <p>
 * A `PilotAbandonedCallsFilter` specifies which pilots to include and which
 * abandoned call attributes to collect when generating statistics.
 * <p>
 * Instances should be created via {@link StatsFilter.createPilotAbandonedCallsFilter}.
 *
 * @see StatsFilter.createPilotAbandonedCallsFilter
 * @see StatsPilotAbandonedCallAttributes
 * @since 2.7.5
 */
export interface PilotAbandonedCallsFilter extends AbstractFilter {

    /**
     * The pilot directory numbers included in this filter.
     *
     * @returns the list of pilot directory numbers; never `null`, but may be empty
     */
    get numbers(): string[];

    /**
     * Adds one or more pilot directory numbers to this filter.
     * <p>
     * The corresponding pilots will be included in the scope of the
     * abandoned call statistics report.
     *
     * @param numbers the pilot directory numbers to add
     */
    addNumbers(...numbers: string[]): void;

    /**
     * The abandoned call attributes to collect for the pilots in this filter.
     *
     * @returns the set of {@link StatsPilotAbandonedCallAttributes} to include
     */
    get pilotAbandonedCallsAttributes(): Set<StatsPilotAbandonedCallsAttributes>;

    /**
     * Sets the abandoned call attributes to collect for the pilots in this filter.
     * <p>
     * Replaces any previously configured attributes.
     *
     * @param attributes the {@link StatsPilotAbandonedCallAttributes} to include
     */
    setPilotAbandonedCallsAttributes(...attributes: StatsPilotAbandonedCallsAttributes[]): void;
}