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

import { SoftKeyJson } from '../../internal/types/phoneset/phoneset-types';
import { DeviceKey } from './device-key';

/**
 * Represents a software key (SoftKey) on an OmniPCX Enterprise device.
 *
 * A SoftKey is a programmable key on the device that may store a number
 * and an optional mnemonic for easier identification. It extends `DeviceKey`.
 */
export class SoftKey extends DeviceKey {
    /**
     * Constructs a new SoftKey instance.
     *
     * @param position - The key position on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic for the key (e.g., "Reception" or "Sales").
     */
    constructor(position?: number, number?: string, mnemonic?: string) {
        super(position, number, mnemonic);
    }

    /**
     * Creates a SoftKey instance from a JSON object.
     *
     * @internal
     * @param json - The JSON representation of a SoftKey.
     * @returns A new SoftKey instance.
     */
    /** @internal */

    static fromJson(json: SoftKeyJson): SoftKey {
        return new SoftKey(json.position, json.number, json.mnemonic);
    }

    /**
     * Converts the SoftKey instance into a JSON object.
     *
     * @returns A JSON representation of the SoftKey, with `undefined` for any unset fields.
     */
    /** @internal */

    toJson(): SoftKeyJson {
        return {
            position: this.position ?? undefined,
            number: this.number ?? undefined,
            mnemonic: this.mnemonic ?? undefined,
        };
    }
}
