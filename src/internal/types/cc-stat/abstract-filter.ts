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
 * AbstractFilter represents a base class for filters with a set of numbers.
 *
 * It provides methods to get the current numbers and add new numbers to the filter.
 */
/** @internal */
export abstract class AbstractFilter {
    /** The numbers associated with this filter */
    private _numbers: Set<string> = new Set<string>();

    /**
     * Returns the numbers associated with this filter.
     * @returns the numbers set
     */
    get numbers(): string[] {
        return Array.from(this._numbers);
    }

    /**
     * Adds an array of numbers to this filter.
     * @param numbers The directory numbers of the objects to add in the statistic filter.
     */
    addNumbers(...numbers: string[]): void {
        numbers.forEach((n) => this._numbers.add(n));
    }
}
