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

import { ComHistoryRecordsJson } from '../../internal/types/comlog/comlog-types';
import { ComRecord } from './com-record';
import { Page } from './page';

/**
 * {@code QueryResult} represents the result of a communication log query.
 *
 * Instances of this class contain the records returned by a query, along with
 * paging information and the total count of matching records.
 *
 * The associated {@link Page} object provides details about the current page,
 * including the offset and limit, and can be used to navigate through pages
 * of results.
 *
 * Each {@code QueryResult} contains:
 * - The total number of records matching the query (`count`)
 * - Paging information for the current result set (`page`)
 * - The list of communication records (`records`)
 *
 * <p><b>Usage example:</b></p>
 *
 * ```ts
 * const result: QueryResult = QueryResult.fromJson(rawJson);
 *
 * console.log(result.count);     // total number of matching records
 * console.log(result.page.offset); // current page offset
 * console.log(result.records);   // array of ComRecord objects
 * ```
 *
 * <p>
 * Instances are immutable. The `fromJson` static method should be used
 * to create a `QueryResult` from raw JSON returned by the O2G API.
 * </p>
 *
 * @see CommunicationLogService#getComRecords
 */
export class QueryResult {
    #count: number;
    #page: Page;
    #records: ComRecord[];

    /**
     * @internal
     */
    private constructor(count: number, page: Page, records: ComRecord[]) {
        this.#count = count;
        this.#page = page;
        this.#records = records;
    }

    /**
     * Returns the total number of records in this result.
     *
     * @return the number of records
     */
    get count(): number {
        return this.#count;
    }

    /**
     * Returns the page information associated with this result.
     * <p>
     * The {@link Page} object provides the offset and limit used to retrieve
     * this set of records and can be used to navigate through the pages.
     *
     * @return the page
     */
    get page(): Page {
        return this.#page;
    }

    /** Gets the list of communication records returned by the query. */
    get records(): ComRecord[] {
        return this.#records;
    }

    /**
     * @internal
     */
    static fromJson(json: ComHistoryRecordsJson): QueryResult {
        const offset = json.offset ?? 0;
        const limit = json.limit ?? 0;
        const page = new Page(offset, limit);

        const count = json.totalCount ?? 0;
        const records = (json.comHistoryRecords ?? []).map(ComRecord.fromJson);

        return new QueryResult(count, page, records);
    }
}
