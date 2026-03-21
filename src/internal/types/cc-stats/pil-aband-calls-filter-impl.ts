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

import { StatsPilotAbandonedCallsAttributes } from '../../../types/cc-stats/pilot-abandoned-calls-attributes';
import { PilotAbandonedCallsFilter } from '../../../types/cc-stats/pilot-abandonned-calls-filter';
import { AbstractFilter } from './abstract-filter';
import { StatsPilotAbandonedCallFilterJson } from './cc-stat-types';

/**
 * Implementation of `PilotAbandonedCallsFilter` for selecting pilots abandoned calls in Call Center StatisticsData reports.
 */
/** @internal */
export class PilotAbandonedCallsFilterImpl extends AbstractFilter implements PilotAbandonedCallsFilter {
    #attributes: Set<StatsPilotAbandonedCallsAttributes> = new Set<StatsPilotAbandonedCallsAttributes>();

    get pilotAttributes(): Set<StatsPilotAbandonedCallsAttributes> {
        throw new Error('Method not implemented.');
    }

    /**
     * Returns the set of statistics attributes to collect for pilots.
     * @returns a set of `PilotAttributes`
     */
    get pilotAbandonedCallsAttributes(): Set<StatsPilotAbandonedCallsAttributes> {
        return this.#attributes;
    }

    /**
     * Sets the statistics attributes for pilots in this filter.
     * Any existing attributes may be replaced or supplemented.
     * @param attributes the pilot attributes to include
     */
    setPilotAbandonedCallsAttributes(...attributes: StatsPilotAbandonedCallsAttributes[]): void {
        attributes.forEach((attr) => this.#attributes.add(attr));
    }

    toJson(): StatsPilotAbandonedCallFilterJson {
        return {
            numbers: this.numbers, // Convert Set<string> to string[]
            attributes: Array.from(this.#attributes),
        };
    }

    static fromJson(json: StatsPilotAbandonedCallFilterJson): PilotAbandonedCallsFilterImpl {
        const filter = new PilotAbandonedCallsFilterImpl();

        // Restore numbers (assuming AbstractFilter has addNumber)
        if (json.numbers && json.numbers.length > 0) {
            filter.addNumbers(...json.numbers);
        }

        // Restore pilot attributes
        if (json.attributes && json.attributes.length > 0) {
            filter.setPilotAbandonedCallsAttributes(...json.attributes);
        }

        return filter;
    }
}
