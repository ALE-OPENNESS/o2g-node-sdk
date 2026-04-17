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

import DirectoryRest from '../internal/rest/directory-rest';
import { Criteria } from '../types/directory/criteria';
import { SearchResult } from '../types/directory/search-result';

/**
 * The Directory service allows searching for contacts in the OmniPCX Enterprise
 * phone book. Using this service requires having a <b>TELEPHONY_ADVANCED</b> license.
 * <p>
 * A directory search involves a sequence of operations:
 * <ol>
 * <li>Initiate the search with a set of criteria.</li>
 * <li>Retrieve results using one or more subsequent calls to {@link getResults}.</li>
 * </ol>
 * <p>
 * Note: For each session (user or administrator), only 5 concurrent searches are
 * allowed. An unused search context is automatically freed after 1 minute.
 *
 * @example
 * ```typescript
 * await O2G.directory.search(myCriteria);
 *
 * let finished = false;
 * while (!finished) {
 *     const result = await O2G.directory.getResults();
 *     if (result?.resultCode === SearchResult.ResultCode.NOK) {
 *         // Search still in progress, wait before retrying
 *         await new Promise(resolve => setTimeout(resolve, 500));
 *     } else if (result?.resultCode === SearchResult.ResultCode.OK) {
 *         // Process available results
 *         result.items.forEach(item => console.log(item.firstName, item.lastName));
 *     } else {
 *         // FINISH or TIMEOUT — search is complete
 *         finished = true;
 *     }
 * }
 * ```
 */
export class Directory {
    #directoryRest: DirectoryRest;

    /**
     * @internal
     */
    constructor(directoryRest: DirectoryRest) {
        this.#directoryRest = directoryRest;
    }

    /**
     * Initiates a directory search with the specified filter, limited to the
     * specified number of results.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param filter    the search filter
     * @param limit     the maximum number of results, in the range [1..100]
     * @param loginName the target user's login name
     * @returns `true` if the search was successfully initiated; `false` otherwise.
     * @see getResults
     * @see cancel
     */
    async search(filter: Criteria, limit: number | null = null, loginName: string | null = null): Promise<boolean> {
        return await this.#directoryRest.search(filter, limit, loginName);
    }

    /**
     * Cancels the current search query for the specified user.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the target user's login name
     * @returns `true` if the search was successfully cancelled; `false` otherwise.
     * @see search
     */
    async cancel(loginName: string | null = null): Promise<boolean> {
        return await this.#directoryRest.cancel(loginName);
    }

    /**
     * Retrieves the next available results for the current search.
     * <p>
     * `getResults` is generally called in a loop. For each iteration:
     * <ul>
     * <li>if the result code is `NOK`, the search is in progress but no results are
     * available yet — it is recommended to wait before the next iteration (e.g., 500ms)</li>
     * <li>if the result code is `OK`, results are available and can be processed</li>
     * <li>if the result code is `FINISH` or `TIMEOUT`, the search has ended — exit the loop</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * await O2G.directory.search(criteria);
     *
     * let finished = false;
     * while (!finished) {
     *     const result = await O2G.directory.getResults();
     *     if (result?.resultCode === SearchResult.ResultCode.NOK) {
     *         // Search still in progress, wait before retrying
     *         await new Promise(resolve => setTimeout(resolve, 500));
     *     } else if (result?.resultCode === SearchResult.ResultCode.OK) {
     *         // Process available results
     *         result.items.forEach(item => console.log(item.firstName, item.lastName));
     *     } else {
     *         // FINISH or TIMEOUT — search is complete
     *         finished = true;
     *     }
     * }
     * ```
     *
     * @param loginName the target user's login name
     * @returns the {@link SearchResult} on success; `null` otherwise.
     * @see search
     */
    async getResults(loginName: string | null = null): Promise<SearchResult | null> {
        return await this.#directoryRest.getResults(loginName);
    }
}
