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
 * Represents correlator data attached to a call.
 * <p>
 * Correlator data is application-provided information (limited to 32 bytes)
 * that travels with a call. It is typically used to carry application context
 * from one party to another across telephony operations such as transfer.
 * <p>
 * For example, user A receives an external call and attaches correlator data
 * to it. When user A transfers the call to user B, user B receives a
 * {@link Telephony.ON_CALL_CREATED} event whose {@link CallData} contains the
 * same correlator data, allowing user B's application to retrieve the original
 * context.
 *
 * @example
 * ```typescript
 * // Attach correlator data to a call
 * const data = new CorrelatorData("transactionId=abc123");
 * await O2G.telephony.makeCallEx("1234", "5678", true, false, data);
 *
 * // Read correlator data from a received call event
 * O2G.telephony.on(Telephony.ON_CALL_CREATED, (event) => {
 *     const correlator = event.callData?.correlatorData;
 *     if (correlator) {
 *         console.log("Context:", correlator.asString());
 *     }
 * });
 * ```
 */
export class CorrelatorData {
    #value: Buffer;

    /**
     * Creates a new `CorrelatorData` from a string or byte array.
     * <p>
     * Strings are encoded as UTF-8. The byte value `0x00` is not permitted.
     *
     * @param value the correlator data as a string, `Buffer`, or `Uint8Array`
     * @throws TypeError if the value is not a string or byte array
     * @throws Error if the value contains the byte `0x00`
     */
    constructor(value: string | Buffer | Uint8Array) {
        if (typeof value === 'string') {
            this.#value = Buffer.from(value, 'utf8');
        } else if (Buffer.isBuffer(value)) {
            this.#value = value;
        } else if (value instanceof Uint8Array) {
            this.#value = Buffer.from(value);
        } else {
            throw new TypeError('CorrelatorData expects a string or byte array');
        }

        if (this.#value.includes(0x00)) {
            throw new Error('Byte 0x00 is not authorized in correlator data');
        }
    }

    /**
     * Returns the correlator data as a byte array.
     *
     * @returns the correlator data as a `Buffer`
     */
    asByteArray(): Buffer {
        return this.#value;
    }

    /**
     * Returns the correlator data as a UTF-8 string.
     *
     * @returns the correlator data as a string
     */
    asString(): string {
        return this.#value.toString('utf8');
    }
}
