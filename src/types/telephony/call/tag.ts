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

import { TagJson } from '../../../internal/types/telephony/telephony-types';

/**
 * Represents a tag associated with a call.
 *
 * A tag consists of a `name`, an optional `value`, and optional `visibilities`
 * indicating who can see this tag. Use `Tag.fromJson()` to create instances
 * from JSON data.
 */
export class Tag {
    #name: string;
    #value?: string;
    #visibilities?: string[];

    /**
     * Private constructor. Use `Tag.fromJson()` to create instances.
     *
     * @param name - The tag name
     * @param value - Optional tag value
     * @param visibilities - Optional array of tag visibilities
     */
    private constructor(name: string, value?: string, visibilities?: string[]) {
        this.#name = name;
        this.#value = value;
        this.#visibilities = visibilities;
    }

    /**
     * Returns the name of the tag.
     *
     * @returns The tag name as a string
     */
    get name(): string {
        return this.#name;
    }

    /**
     * Returns the value of the tag.
     *
     * @returns The tag value as a string, or `null` if not set
     */
    get value(): string | null {
        return this.#value ?? null;
    }

    /**
     * Returns the visibilities of the tag.
     *
     * @returns An array of strings representing visibilities, or `null` if not set
     */
    get visibilities(): string[] | null {
        return this.#visibilities ?? null;
    }

    /**
     * Creates a `Tag` instance from a JSON object.
     *
     * @param json - JSON object representing a tag
     * @returns A new `Tag` instance
     */
    /** @internal */

    static fromJson(json: TagJson): Tag {
        return new Tag(json.name, json.value, json.visibilities);
    }
}
