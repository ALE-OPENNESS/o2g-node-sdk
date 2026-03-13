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

import { LicenseJson } from '../../internal/types/maint/maint-types';
import { FormatUtil } from '../../internal/util/format-util';

/**
 * Represents a license in the O2G system.
 *
 * Includes the license name, total available licenses, the number currently used,
 * and the license expiration date.
 */
export class License {
    #name?: string;
    #total?: number;
    #currentUsed?: number;
    #expiration?: Date;

    /**
     * Creates a License instance.
     * @param name - License name
     * @param total - Total number of licenses
     * @param currentUsed - Number of licenses currently in use
     * @param expiration - Expiration date of the license
     */
    private constructor(name?: string, total?: number, currentUsed?: number, expiration?: Date) {
        this.#name = name;
        this.#total = total;
        this.#currentUsed = currentUsed;
        this.#expiration = expiration;
    }

    /**
     * License name
     * @returns {string | null} The license name, or null if not set
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Total number of licenses
     * @returns {number} Total licenses (defaults to 0 if not set)
     */
    get total(): number {
        return this.#total ?? 0;
    }

    /**
     * Number of licenses currently used
     * @returns {number} Currently used licenses (defaults to 0 if not set)
     */
    get currentUsed(): number {
        return this.#currentUsed ?? 0;
    }

    /**
     * License expiration date
     * @returns {Date | null} Expiration date, or null if not set
     */
    get expiration(): Date | null {
        return this.#expiration ?? null;
    }

    /**
     * Creates a License instance from a JSON object.
     * @param json - JSON representation of a license
     * @returns {License} A new License instance
     */
    /** @internal */

    static fromJson(json: LicenseJson): License {
        return new License(
            json.name,
            json.total,
            json.currentUsed,
            json.expiration ? FormatUtil.parseDDMMYYYYDate(json.expiration) : undefined
        );
    }
}
