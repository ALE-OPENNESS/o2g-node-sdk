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

import { SearchResultJson } from '../../internal/types/directory/directory-types';
import { ResultItem } from './result-item';

/**
 * Represents the outcome of a directory search performed via the `DirectoryService`.
 *
 * A search may return multiple batches of results. Each batch contains a set of
 * contacts along with a status code indicating the current state of the search.
 *
 * ## Example usage
 * ```ts
 * const searchResult = SearchResult.fromJson(jsonData);
 * console.log(searchResult.resultCode);
 * console.log(searchResult.resultElements);
 * ```
 */
export class SearchResult {
    #status?: SearchResult.Status;
    #resultElements?: ResultItem[];

    private constructor(status?: SearchResult.Status, resultElements?: ResultItem[]) {
        this.#status = status;
        this.#resultElements = resultElements;
    }

    /**
     * Returns the status code of this search result.
     *
     * The status code indicates whether more results are available or if the
     * search is complete.
     *
     * @returns The `SearchStatus` of this search result, or `null` if unavailable.
     */
    get status(): SearchResult.Status | null {
        return this.#status ?? null;
    }

    /**
     * Returns the list of result items from the search.
     *
     * Each element in the array corresponds to a `ResultItem`, which contains
     * contact information returned by the search.
     *
     * @returns An array of `ResultItem` objects, or `null` if no results are present.
     */
    get items(): ResultItem[] | null {
        return this.#resultElements ?? null;
    }

    /**
     * Creates a new `SearchResult` instance from a JSON object.
     *
     * @param json - The JSON object representing a search result.
     * @returns A `SearchResult` instance populated from the JSON data.
     */
    /** @internal */

    static fromJson(json: SearchResultJson): SearchResult {
        const elements = json.resultElements ? json.resultElements.map(ResultItem.fromJson) : undefined;
        return new SearchResult(json.resultCode, elements);
    }
}

export namespace SearchResult {
    /**
     * Code represents the status of a directory search. Each time a call to
     * {@link Directory.getResults} is done, the returned result code must be
     * tested.
     */
    export enum Status {
        /**
         * Responses are provided this time. Continue to invoking
         * {@linkplain Directory.getResults} periodically to get the next results.
         */
        OK = 'OK',

        /**
         * No response received. Continue to invoking
         * {@link Directory.getResults} to get more results.
         */
        NOK = 'NOK',

        /**
         * Search is finished.
         */
        FINISH = 'FINISH',

        /**
         * Search is ended for timeout reason.
         */
        TIMEOUT = 'TIMEOUT',
    }
}
