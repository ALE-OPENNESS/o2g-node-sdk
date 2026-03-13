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

import { PartyInfoJson } from '../../internal/types/common/common-types';
import { Identifier } from './identifier';
import { PartyInfoType } from './party-info-type';

/**
 * Represents a party involved in a call.
 */
export class PartyInfo {
    #id: Identifier;
    #firstName?: string;
    #lastName?: string;
    #displayName?: string;
    #type?: PartyInfoType;

    /**
     * Private constructor. Use `PartyInfo.fromJson()` to create instances.
     * @param id - Participant identifier
     * @param firstName - First name
     * @param lastName - Last name
     * @param displayName - Display name
     * @param type - Participant type
     */
    private constructor(
        id: Identifier,
        firstName?: string,
        lastName?: string,
        displayName?: string,
        type?: PartyInfoType
    ) {
        this.#id = id;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#displayName = displayName;
        this.#type = type;
    }

    /** Get the participant identifier */
    get id(): Identifier {
        return this.#id;
    }

    /** Get the participant's first name */
    get firstName(): string | null {
        return this.#firstName ?? null;
    }

    /** Get the participant's last name */
    get lastName(): string | null {
        return this.#lastName ?? null;
    }

    /** Get the participant's display name */
    get displayName(): string | null {
        return this.#displayName ?? null;
    }

    /** Get the participant's type */
    get type(): PartyInfoType | null {
        return this.#type ?? null;
    }

    /**
     * Creates a PartyInfo instance from JSON
     * @param json - JSON object representing PartyInfo
     */
    /** @internal */

    static fromJson(json: PartyInfoJson): PartyInfo {
        return new PartyInfo(
            Identifier.fromJson(json.id),
            json.firstName,
            json.lastName,
            json.displayName,
            json.type ? PartyInfoType.fromJson(json.type) : undefined
        );
    }
}
