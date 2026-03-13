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

/** @internal */
export class HexaString {
    /**
     * Convert a hexadecimal string to a byte array.
     *
     * @param hexaString hexadecimal string (even length)
     */
    static toByteArray(hexaString: string): Buffer {
        const len = hexaString.length;

        if (len % 2 !== 0) {
            throw new Error('Invalid hexadecimal string');
        }

        const data = Buffer.alloc(len / 2);

        for (let i = 0; i < len; i += 2) {
            const high = parseInt(hexaString[i], 16);
            const low = parseInt(hexaString[i + 1], 16);

            if (Number.isNaN(high) || Number.isNaN(low)) {
                throw new Error('Invalid hexadecimal string');
            }

            data[i / 2] = (high << 4) + low;
        }

        return data;
    }

    /**
     * Convert a byte array to a hexadecimal string.
     *
     * @param byteValue byte array
     */
    static toHexaString(byteValue: Buffer | Uint8Array): string {
        let result = '';

        for (const b of byteValue) {
            result += ((b >> 4) & 0xf).toString(16);
            result += (b & 0xf).toString(16);
        }

        return result;
    }
}
