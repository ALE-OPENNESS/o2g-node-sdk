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

import { DynamicStateJson } from '../../internal/types/phoneset/phoneset-types';

/**
 * Represents the dynamic state of a device.
 *
 * DynamicState provides information about:
 * - Whether the device is locked
 * - Whether the camp-on feature is activated
 * - The associated phone number
 */
export class DynamicState {
    #lock?: boolean;
    #campon?: boolean;
    #associate?: string;

    /**
     * @internal
     */
    private constructor(lock?: boolean, campon?: boolean, associate?: string) {
        this.#lock = lock;
        this.#campon = campon;
        this.#associate = associate;
    }

    /**
     * Indicates whether the device is locked.
     *
     * @returns {boolean} True if the device is locked; otherwise false.
     */
    get lock(): boolean {
        return this.#lock ?? false;
    }

    /**
     * Indicates whether the camp-on feature is active.
     *
     * @returns {boolean} True if camp-on is active; otherwise false.
     */
    get campon(): boolean {
        return this.#campon ?? false;
    }

    /**
     * Returns the associated phone number.
     *
     * @returns {string | null} The associated number, or null if not set.
     */
    get associate(): string | null {
        return this.#associate ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: DynamicStateJson): DynamicState {
        return new DynamicState(json.lock, json.campon, json.associate);
    }
}
