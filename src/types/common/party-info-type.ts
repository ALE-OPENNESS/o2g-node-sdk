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

import { MainType } from './main-type';

/**
 * Represents the type of a party in a call, composed of a main type and an
 * optional sub-type.
 * <p>
 * Available via {@link PartyInfo.type} on call participants and party information.
 *
 * @see PartyInfo
 */
export class PartyInfoType {
    #main: MainType;
    #subType?: string;

    /**
     * @internal
     */
    private constructor(main: MainType, subType?: string) {
        this.#main = main;
        this.#subType = subType;
    }

    /**
     * The main type of this party.
     */
    get main(): MainType {
        return this.#main;
    }

    /**
     * The sub-type of this party, providing additional classification.
     * `null` if no sub-type is defined.
     */
    get subType(): string | null {
        return this.#subType ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: { main: MainType; subType?: string }): PartyInfoType {
        return new PartyInfoType(json.main, json.subType);
    }
}
