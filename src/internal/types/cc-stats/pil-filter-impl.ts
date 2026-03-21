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

import { StatsPilotAttributes } from '../../../types/cc-stats/pilot-attributes';
import { PilotFilter } from '../../../types/cc-stats/pilot-filter';
import { AbstractFilter } from './abstract-filter';
import { StatsPilotFilterJson } from './cc-stat-types';

/**
 * Implementation of `PilotFilter` for selecting pilots in Call Center StatisticsData reports.
 */
/** @internal */
export class PilotFilterImpl extends AbstractFilter implements PilotFilter {
    #attributes: Set<StatsPilotAttributes> = new Set<StatsPilotAttributes>();

    /**
     * Returns the set of statistics attributes to collect for pilots.
     * @returns a set of `PilotAttributes`
     */
    get pilotAttributes(): Set<StatsPilotAttributes> {
        return this.#attributes;
    }

    /**
     * Sets the statistics attributes for pilots in this filter.
     * Any existing attributes may be replaced or supplemented.
     * @param attributes the pilot attributes to include
     */
    setPilotAttributes(...attributes: StatsPilotAttributes[]): void {
        attributes.forEach((attr) => this.#attributes.add(attr));
    }

    toJson(): StatsPilotFilterJson {
        return {
            numbers: this.numbers, // Convert Set<string> to string[]
            attributes: Array.from(this.#attributes),
        };
    }

    static fromJson(json: StatsPilotFilterJson): PilotFilterImpl {
        const filter = new PilotFilterImpl();

        // Restore numbers (assuming AbstractFilter has addNumber)
        if (json.numbers && json.numbers.length > 0) {
            filter.addNumbers(...json.numbers);
        }

        // Restore pilot attributes
        if (json.attributes && json.attributes.length > 0) {
            filter.setPilotAttributes(...json.attributes);
        }

        return filter;
    }
}
