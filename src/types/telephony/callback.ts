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

import { CallbackJson } from '../../internal/types/telephony/telephony-types';
import { PartyInfo } from '../common/party-info';

/**
 * Represents a callback request in the system.
 *
 * A callback corresponds to a request from a party to be called back at a later time.
 * This class contains the unique callback identifier and the information about
 * the party who requested it.
 *
 * Use `Callback.fromJson()` to create instances from JSON data.
 */
export class Callback {
    #callbackId: string;
    #partyInfo: PartyInfo;

    /**
     * Private constructor. Use `Callback.fromJson()` to create instances.
     *
     * @param callbackId - The unique identifier of the callback request
     * @param partyInfo - The party who requested the callback
     */
    private constructor(callbackId: string, partyInfo: PartyInfo) {
        this.#callbackId = callbackId;
        this.#partyInfo = partyInfo;
    }

    /**
     * Returns the unique identifier of the callback request.
     *
     * @returns The callback ID as a string
     */
    get callbackId(): string {
        return this.#callbackId;
    }

    /**
     * Returns the information about the party who requested the callback.
     *
     * @returns A `PartyInfo` object containing the requestor’s details
     */
    get partyInfo(): PartyInfo {
        return this.#partyInfo;
    }

    /**
     * Creates a `Callback` instance from a JSON object.
     *
     * @param json - JSON object representing a callback request
     * @returns A new `Callback` instance
     */
    /** @internal */

    static fromJson(json: CallbackJson): Callback {
        return new Callback(json.callbackId, PartyInfo.fromJson(json.partyInfo));
    }
}
