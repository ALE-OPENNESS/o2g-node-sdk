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

/* ---------------------------------------------
 * OctetStringLength: Length constraints for byte strings
 * --------------------------------------------- */
export class OctetStringLength {
    private constructor(
        private readonly _min: number,
        private readonly _max: number
    ) {}

    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }

    /**
     * @ignore
     */
    static parseLengthValue(value: string | null | undefined): OctetStringLength | null {
        if (!value) return null;

        const values = value.split('..').map((v) => parseInt(v));
        if (values.length === 2 && !isNaN(values[0]) && !isNaN(values[1])) {
            return new OctetStringLength(values[0], values[1]);
        } else if (values.length === 1 && !isNaN(values[0])) {
            return new OctetStringLength(0, values[0]);
        }

        return null;
    }
}
