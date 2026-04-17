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

import AnalyticsRest from '../internal/rest/analytics-rest';
import { Incident } from '../types/analytics/incident';
import { ChargingFile } from '../types/analytics/charging-file';
import { ChargingResult } from '../types/analytics/charging-result';
import { DateRange } from '../types/common/date-range';

/**
 * The Analytics service provides access to OmniPCX Enterprise charging information and incident reports.
 * <p>
 * Using this service requires an <b>ANALYTICS</b> license and an administrative login.
 * O2G uses SSH to collect information from an OmniPCX Enterprise node, so
 * <b>SSH must be enabled</b> on the node.
 */
export class Analytics {
    #analyticsRest: AnalyticsRest;

    /**
     *
     * @internal
     */
    constructor(analyticsRest: AnalyticsRest) {
        this.#analyticsRest = analyticsRest;
    }

    /**
     * Retrieves a list of incidents from the specified OmniPCX Enterprise node.
     *
     * @param nodeId the OmniPCX Enterprise node identifier
     * @param last the maximum number of incidents to retrieve; pass `0` to retrieve all incidents currently in progress
     * @returns an array of {@link Incident} objects, or `null` if the request fails
     */
    async getIncidents(nodeId: number, last: number = 0): Promise<Array<Incident> | null> {
        return await this.#analyticsRest.getIncidents(nodeId, last);
    }

    /**
     * Retrieves the list of charging files available on the specified node.
     *
     * @param nodeId the OmniPCX Enterprise node identifier
     * @param filter an optional date range filter; when omitted, all available charging files are returned
     * @returns an array of {@link ChargingFile} objects, or `null` if the request fails
     * @see {@link getChargingsFromFiles}
     */
    async getChargingFiles(nodeId: number, filter: DateRange | null = null): Promise<Array<ChargingFile> | null> {
        return await this.#analyticsRest.getChargingFiles(nodeId, filter);
    }

    /**
     * Queries the charging information for the specified node using a date range filter and the given options.
     * <p>
     * If `all` is set to `true`, all tickets are returned, including zero-cost tickets and the called party.
     * If `all` is set to `false`, the total charging information is returned per user, with the call count
     * reflecting only calls that have a non-null charging cost.
     * <p>
     * Processing is limited to a maximum of 100 charging files for performance reasons. If the date range filter
     * is too wide and the number of files to process exceeds 100, the method fails and returns `null`. In that
     * case, a narrower date range must be specified.
     *
     * @param nodeId the OmniPCX Enterprise node identifier
     * @param filter an optional date range filter
     * @param topResults an optional limit to return only the top N tickets
     * @param all `true` to include tickets with a 0 cost
     * @returns a {@link ChargingResult} object, or `null` in case of error or if the filter yields no results
     */
    async getChargingsFromFilter(
        nodeId: number,
        filter: DateRange | null = null,
        topResults: number | null = null,
        all: boolean = false
    ): Promise<ChargingResult | null> {
        return await this.#analyticsRest.getChargingsFromFilter(nodeId, filter, topResults, all);
    }

    /**
     * Queries the charging information for the specified node, processing the given charging files with the specified options.
     * <p>
     * This method gives finer control over the request by letting the caller specify the exact list of charging files to
     * process. The list can be obtained via {@link getChargingFiles}.
     * <p>
     * If `all` is set to `true`, all tickets are returned, including zero-cost tickets and the called party.
     * If `all` is set to `false`, the total charging information is returned per user, with the call count
     * reflecting only calls that have a non-null charging cost.
     * <p>
     * Processing is limited to a maximum of 100 files for performance reasons. If the number of files exceeds 100,
     * the method fails and returns `null`.
     *
     * @param nodeId the OmniPCX Enterprise node identifier
     * @param files the list of charging files to process
     * @param topResults an optional limit to return only the top N tickets
     * @param all `true` to include tickets with a 0 cost
     * @returns a {@link ChargingResult} object, or `null` in case of error or if the specified files yield no results
     */
    async getChargingsFromFiles(
        nodeId: number,
        files: Array<ChargingFile>,
        topResults: number | null = null,
        all: boolean = false
    ): Promise<ChargingResult | null> {
        return await this.#analyticsRest.getChargingsFromFiles(nodeId, files, topResults, all);
    }
}
