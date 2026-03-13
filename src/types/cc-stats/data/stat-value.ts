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

/**
 * Represents a statistical value that can be interpreted as different types.
 * <p>
 * A `StatValue` wraps a raw value returned in statistics data and provides
 * typed accessors to read it as an integer, float, string or duration.
 * All accessors return `null` if the underlying value is not set or cannot
 * be converted to the requested type.
 */
export class StatValue {
    /**
     * @internal
     */
    constructor(private value: string | number | null) {}

    /**
     * Returns the value as an integer.
     *
     * @returns the integer value, or `null` if the value is not set or cannot be parsed
     */
    asInteger(): number | null {
        if (this.value === null) return null;
        if (typeof this.value === 'number') return Math.floor(this.value);
        const parsed = parseInt(this.value, 10);
        return isNaN(parsed) ? null : parsed;
    }

    /**
     * Returns the value as a floating-point number.
     *
     * @returns the float value, or `null` if the value is not set or cannot be parsed
     */
    asFloat(): number | null {
        if (this.value === null) return null;
        if (typeof this.value === 'number') return this.value;
        const parsed = parseFloat(this.value);
        return isNaN(parsed) ? null : parsed;
    }

    /**
     * Returns the value as a string.
     *
     * @returns the string representation, or `null` if the value is not set
     */
    asString(): string | null {
        if (this.value === null) return null;
        return this.value.toString();
    }

    /**
     * Returns the value as a duration string in `hh:mm:ss` format.
     *
     * @returns the duration string, or `null` if the value is not set
     */
    asDuration(): string | null {
        return this.value !== null ? this.value.toString() : null;
    }
}
