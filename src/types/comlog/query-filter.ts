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

import { FilterOption } from './filter-option';
import { Role } from './role';

/**
 * Represents a filter used to query communication log records.
 * <p>
 * This filter can be applied when retrieving records via
 * {@link CommunicationLog.getComRecords}. All parameters are optional —
 * omitted parameters are not applied to the query.
 * <p>
 * The filter allows specifying:
 * <ul>
 *   <li>a date range (`after` / `before`)</li>
 *   <li>a call reference</li>
 *   <li>a remote party identifier</li>
 *   <li>a participant role</li>
 *   <li>additional search options (e.g. unanswered calls)</li>
 * </ul>
 *
 * @example
 * ```typescript
 * // Filter unanswered records in January 2026
 * const filter = new QueryFilter({
 *     after: new Date('2026-01-01'),
 *     before: new Date('2026-01-31'),
 *     options: [FilterOption.UNANSWERED]
 * });
 *
 * const result = await O2G.comlog.getComRecords(filter);
 *
 * // Filter by call reference and role
 * const filter2 = new QueryFilter({
 *     callRef: '12345',
 *     role: Role.CALLER
 * });
 * ```
 *
 * @see CommunicationLog.getComRecords
 */
export class QueryFilter {
    #after?: Date;
    #before?: Date;
    #options: Set<FilterOption>;
    #callRef?: string;
    #remotePartyId?: string;
    #role?: Role;

    /**
     * Creates a new `QueryFilter`.
     *
     * @param params optional filter parameters
     */
    constructor(params: {
        after?: Date;
        before?: Date;
        options?: Set<FilterOption> | FilterOption[];
        callRef?: string;
        remotePartyId?: string;
        role?: Role;
    }) {
        this.#after = params.after ? new Date(params.after) : undefined;
        this.#before = params.before ? new Date(params.before) : undefined;
        this.#options = params.options instanceof Set ? new Set(params.options) : new Set(params.options ?? []);
        this.#callRef = params.callRef;
        this.#remotePartyId = params.remotePartyId;
        this.#role = params.role;
    }

    /**
     * The start date of the query filter — records created after this date are included.
     */
    get after(): Date | null {
        return this.#after ? new Date(this.#after) : null;
    }

    /**
     * The end date of the query filter — records created before this date are included.
     */
    get before(): Date | null {
        return this.#before ? new Date(this.#before) : null;
    }

    /**
     * The set of filter options applied to the query (e.g. unanswered calls only).
     */
    get options(): ReadonlySet<FilterOption> {
        return new Set(this.#options);
    }

    /**
     * The call reference used for filtering.
     */
    get callRef(): string | null {
        return this.#callRef ?? null;
    }

    /**
     * The remote party identifier used for filtering.
     */
    get remotePartyId(): string | null {
        return this.#remotePartyId ?? null;
    }

    /**
     * The participant role used for filtering.
     */
    get role(): Role {
        return this.#role ?? Role.UNKNOWN;
    }
}
