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

import { HuntingGroupStatusJson } from '../../internal/types/telephony/telephony-types';

/**
 * Represents the status of a user in a hunting group.
 *
 * A hunting group is a collection of agents or devices that can receive calls
 * distributed by a contact center. This class indicates whether the user
 * is currently logged on to the hunting group.
 *
 * Use `HuntingGroupStatus.fromJson()` to create instances from JSON data.
 */
export class HuntingGroupStatus {
    #logon: boolean;

    /**
     * Private constructor. Use `HuntingGroupStatus.fromJson()` to create instances.
     *
     * @param logon - Whether the user is logged on to the hunting group
     */
    private constructor(logon: boolean) {
        this.#logon = logon;
    }

    /**
     * Indicates whether the user is currently logged on to the hunting group.
     *
     * @returns `true` if logged on; `false` otherwise
     */
    get loggedOn(): boolean {
        return this.#logon;
    }

    /**
     * Creates a `HuntingGroupStatus` instance from a JSON object.
     *
     * @param json - JSON object representing hunting group status
     * @returns A new `HuntingGroupStatus` instance
     */
    /** @internal */

    static fromJson(json: HuntingGroupStatusJson): HuntingGroupStatus {
        return new HuntingGroupStatus(json.logon);
    }
}
