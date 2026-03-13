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

import { HuntingGroupsJson } from '../../internal/types/telephony/telephony-types';

/**
 * Represents the hunting groups associated with a user.
 *
 * In this system, a user can be a member of **only one active hunting group**
 * at a time, but may have multiple groups available in their configuration.
 * This class tracks both the complete list of groups and the current group
 * the user is assigned to.
 *
 * Use `HuntingGroups.fromJson()` to create instances from JSON data.
 */
export class HuntingGroups {
    #hgList?: string[];
    #currentHg?: string;

    /**
     * Private constructor. Use `HuntingGroups.fromJson()` to create instances.
     *
     * @param hgList - Optional list of hunting group names available to the user
     * @param currentHg - Optional name of the current hunting group
     */
    private constructor(hgList?: string[], currentHg?: string) {
        this.#hgList = hgList;
        this.#currentHg = currentHg;
    }

    /**
     * Returns the list of hunting groups available to the user.
     *
     * @returns An array of hunting group names, or `null` if no groups are defined
     */
    get list(): string[] | null {
        return this.#hgList ?? null;
    }

    /**
     * Returns the hunting group the user is currently a member of.
     *
     * @returns The current hunting group name, or `null` if not assigned
     */
    get current(): string | null {
        return this.#currentHg ?? null;
    }

    /**
     * Creates a `HuntingGroups` instance from a JSON object.
     *
     * @param json - JSON object representing hunting groups
     * @returns A new `HuntingGroups` instance
     */
    /** @internal */

    static fromJson(json: HuntingGroupsJson): HuntingGroups {
        return new HuntingGroups(json.hgList, json.currentHg);
    }
}
