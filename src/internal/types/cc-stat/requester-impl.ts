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

import { Language } from '../../../types/cc-stats/language';
import { Requester } from '../../../types/cc-stats/requester';

/**
 * `RequesterImpl` is an immutable implementation of {@link Requester}.
 *
 * It encapsulates the requester's identifier, preferred language, and
 * time zone information.
 *
 * @since 2.7.4
 */
/** @internal */
export class RequesterImpl implements Requester {
    /** Unique identifier of this requester. */
    #id: string;

    /** Preferred language of this requester. */
    #language: Language;

    /** Time zone string in UTC offset format (e.g., "+02:00"). */
    #timezone: string;

    /**
     * Constructs a new RequesterImpl.
     *
     * @param id - Unique identifier of the requester
     * @param language - Preferred language
     * @param timezone - Timezone offset as a string (e.g., "+02:00")
     */
    constructor(id: string, language: Language, timezone: string) {
        this.#id = id;
        this.#language = language;
        this.#timezone = timezone;
    }

    /** Returns the unique identifier of this requester. */
    get id(): string {
        return this.#id;
    }

    /** Returns the preferred language of this requester. */
    get language(): Language {
        return this.#language;
    }

    /**
     * Returns the time zone of this requester as a string representing
     * the UTC offset (e.g., "+02:00", "-05", "+09").
     *
     * Returns `null` if the stored string is not a valid UTC offset.
     */
    get timezone(): string | null {
        // Matches:
        // +HH:MM or -HH:MM
        // +HH or -HH
        const regex = /^[+-](?:[01]\d|2[0-3])(?::[0-5]\d)?$/;

        return regex.test(this.#timezone) ? this.#timezone : null;
    }
}
