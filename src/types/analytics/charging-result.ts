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

import { Charging } from './charging';
import { DateRange } from '../common/date-range';
import { ChargingResultJson } from '../../internal/types/analytics/analytics-types';

/**
 * Represents the result of a charging query on an OmniPCX Enterprise system.
 *
 * A `ChargingResult` contains a list of individual `Charging` entries, along with
 * optional statistics such as the number of charging files, total ticket count, and
 * number of valuable tickets. Queries can originate from a list of {@link ChargingFile}
 * or by specifying a {@link DateRange} to filter the period of interest.
 *
 * @see {@link Analytics.getChargingsFromFiles} for querying from files
 * @see {@link Analytics.getChargingsFromFilter} for querying from a time filter
 */
export class ChargingResult {
    #chargings: Charging[];
    #range: DateRange | null;
    #chargingFilesCount?: number;
    #totalTicketCount?: number;
    #valuableTicketCount?: number;

    /**
     * @param chargings - Array of `Charging` entries returned by the query
     * @param range - The date range covered by the charging result, or `null` if not applicable
     * @param chargingFilesCount - Optional count of charging files used in the query
     * @param totalTicketCount - Optional total number of tickets in this result
     * @param valuableTicketCount - Optional number of valuable tickets in this result
     */
    private constructor(
        chargings: Charging[],
        range: DateRange | null,
        chargingFilesCount?: number,
        totalTicketCount?: number,
        valuableTicketCount?: number
    ) {
        this.#chargings = chargings;
        this.#range = range;
        this.#chargingFilesCount = chargingFilesCount;
        this.#totalTicketCount = totalTicketCount;
        this.#valuableTicketCount = valuableTicketCount;
    }

    /**
     * Returns the list of individual `Charging` entries in this result.
     * @returns Array of `Charging` objects
     */
    get chargings(): Charging[] {
        return this.#chargings;
    }

    /**
     * Returns the date range over which this charging result applies.
     * @returns The `DateRange` object or `null` if not specified
     */
    get range(): DateRange | null {
        return this.#range;
    }

    /**
     * Returns the number of charging files used to produce this result.
     * @returns Number of charging files (0 if not set)
     */
    get chargingFilesCount(): number {
        return this.#chargingFilesCount ?? 0;
    }

    /**
     * Returns the total number of tickets in this charging result.
     * @returns Total ticket count (0 if not set)
     */
    get totalTicketCount(): number {
        return this.#totalTicketCount ?? 0;
    }

    /**
     * Returns the number of valuable tickets in this charging result.
     * @returns Count of valuable tickets (0 if not set)
     */
    get valuableTicketCount(): number {
        return this.#valuableTicketCount ?? 0;
    }

    /**
     * Creates a `ChargingResult` instance from a JSON object.
     *
     * The JSON should include an array of charging entries (`chargings`) and optionally
     * statistics such as `nbChargingFiles`, `totalTicketNb`, and `valuableTicketNb`.
     *
     * @param json - JSON object representing the charging result
     * @param range - Optional `DateRange` specifying the period of the query
     * @returns A new `ChargingResult` instance populated from the JSON
     */
    /** @internal */

    static fromJson(json: ChargingResultJson, range: DateRange | null = null): ChargingResult {
        const chargings = (json.chargings ?? []).map((ch) => Charging.fromJson(ch));

        return new ChargingResult(chargings, range, json.nbChargingFiles, json.totalTicketNb, json.valuableTicketNb);
    }
}
