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

import { ProgrammeableKeyJson } from '../../internal/types/phoneset/phoneset-types';
import { DeviceKey } from './device-key';

/**
 * Represents a programmable key on an OmniPCX Enterprise device.
 *
 * A ProgrammableKey can store a number, an optional mnemonic, and a locked state.
 * It extends `DeviceKey` and adds the `locked` property to control key usability.
 */
export class ProgrammeableKey extends DeviceKey {
    #locked?: boolean;

    /**
     * Constructs a new ProgrammableKey instance.
     *
     * @param position - The key position on the device.
     * @param number - The phone number associated with this key.
     * @param mnemonic - An optional mnemonic for the key (e.g., "Reception" or "Sales").
     * @param locked - True if the key is locked; false otherwise.
     */
    constructor(position?: number, number?: string, mnemonic?: string, locked?: boolean) {
        super(position, number, mnemonic);
        this.#locked = locked;
    }

    /**
     * Indicates whether this key is locked.
     *
     * @returns {boolean} True if locked; false otherwise.
     */
    get locked(): boolean {
        return this.#locked ?? false;
    }

    /**
     * @internal
     */
    static fromJson(json: ProgrammeableKeyJson): ProgrammeableKey {
        return new ProgrammeableKey(json.position, json.number, json.mnemonic, json.locked);
    }

    /**
     * @internal
     */
    toJson(): ProgrammeableKeyJson {
        return {
            position: this.position ?? undefined,
            number: this.number ?? undefined,
            mnemonic: this.mnemonic ?? undefined,
            locked: this.#locked,
        };
    }
}
