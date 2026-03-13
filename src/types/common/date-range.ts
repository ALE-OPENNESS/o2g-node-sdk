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
 * DateRange represents an interval between two dates.
 */
export class DateRange {
    #from: Date;
    #to: Date;

    /**
     * Constructs a new DateRange, with the specified "from" date and "to" date.
     * @param from the beginning of the range
     * @param to the end of the range
     */
    constructor(from: Date, to: Date) {
        if (from > to) {
            throw new Error('"from" date must be before or equal to "to" date');
        }
        this.#from = new Date(from);
        this.#to = new Date(to);
    }

    /** Returns the "from" date. */
    get from(): Date {
        return new Date(this.#from);
    }

    /** Returns the "to" date. */
    get to(): Date {
        return new Date(this.#to);
    }
}
