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
 * Represents a key on an OmniPCX Enterprise device.
 *
 * A DeviceKey can correspond to a programmable key on the device,
 * which may store a phone number and an optional mnemonic for easier identification.
 */
export class DeviceKey {
    #position?: number;
    #number?: string;
    #mnemonic?: string | null;

    /**
     * Constructs a new DeviceKey.
     *
     * @param position - The physical or logical position of the key on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic to identify the key (e.g., "Reception" or "Sales").
     */
    constructor(position?: number, number?: string, mnemonic?: string) {
        this.#position = position;
        this.#number = number;
        this.#mnemonic = mnemonic;
    }

    /**
     * The position of the key on the device.
     *
     * @returns {number | null} Returns the key position, or null if not set.
     */
    get position(): number | null {
        return this.#position ?? null;
    }

    /**
     * The phone number assigned to this key.
     *
     * @returns {string | null} Returns the associated number, or null if not set.
     */
    get number(): string | null {
        return this.#number ?? null;
    }

    /**
     * The mnemonic label for this key.
     *
     * @returns {string | null} Returns the mnemonic if set; otherwise, null.
     */
    get mnemonic(): string | null {
        return this.#mnemonic ?? null;
    }
}
