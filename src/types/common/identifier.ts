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

import { IdentifierJson } from '../../internal/types/common/common-types';

/**
 * Represents the information used to uniquely identify a participant; either the login name or the phone number.
 */
export class Identifier {
    #loginName?: string;
    #phoneNumber?: string;

    private constructor(loginName: string, phoneNumber: string) {
        this.#loginName = loginName;
        this.#phoneNumber = phoneNumber;
    }

    /**
     * Returns the login name of the participant.
     *
     * @return the login name, or {@code null} if not available
     */
    get loginName(): string | null {
        return this.#loginName ?? null;
    }

    /**
     * Returns the phone number of the participant.
     *
     * @return the phone number, or {@code null} if not available
     */
    get phoneNumber(): string | null {
        return this.#phoneNumber ?? null;
    }

    /**
     * Creates an Identifier instance from JSON
     * @param json - JSON object representing Identifier
     */
    /** @internal */

    static fromJson(json: IdentifierJson): Identifier {
        return new Identifier(json.loginName, json.phoneNumber);
    }
}
