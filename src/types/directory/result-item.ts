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

import { ResultElementJson } from '../../internal/types/directory/directory-types';
import { PartyInfo } from '../common/party-info';

/**
 * Represents a single batch of contacts returned from a directory search.
 *
 * Each `ResultItem` contains a collection of `PartyInfo` objects representing
 * the contacts found in that batch.
 *
 */
export class ResultItem {
    #contacts?: PartyInfo[];

    private constructor(contacts?: PartyInfo[]) {
        this.#contacts = contacts;
    }

    /**
     * Returns the contacts found in this batch.
     *
     * The returned array is read-only. Modifying the array directly will not
     * affect the internal state of the `ResultItem`.
     *
     * @returns A read-only array of `PartyInfo` objects, or `null` if no contacts are available.
     */
    get contacts(): ReadonlyArray<PartyInfo> | null {
        return this.#contacts ?? null;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: ResultElementJson): ResultItem {
        const contacts = json.contacts ? json.contacts.map(PartyInfo.fromJson) : undefined;
        return new ResultItem(contacts);
    }
}
