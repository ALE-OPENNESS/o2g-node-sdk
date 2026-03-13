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

import { DeviceStateJson } from '../../../internal/types/telephony/telephony-types';
import { OperationalState } from './operational-state';

/**
 * Represents the current operational state of a device.
 *
 * Each device has a unique `deviceId` and an associated `OperationalState`.
 * Use `DeviceState.fromJson()` to create instances from JSON data.
 */
export class DeviceState {
    #deviceId: string;
    #state: OperationalState;

    /**
     * Private constructor. Use `DeviceState.fromJson()` to create instances.
     *
     * @param deviceId - The unique identifier of the device
     * @param state - The current operational state of the device
     */
    private constructor(deviceId: string, state: OperationalState) {
        this.#deviceId = deviceId;
        this.#state = state;
    }

    /**
     * Returns the unique identifier of the device.
     *
     * @returns The device ID as a string
     */
    get deviceId(): string {
        return this.#deviceId;
    }

    /**
     * Returns the operational state of the device.
     *
     * @returns The `OperationalState` of the device
     */
    get state(): OperationalState {
        return this.#state;
    }

    /**
     * Creates a `DeviceState` instance from a JSON object.
     *
     * @param json - JSON object representing a device state
     * @returns A new `DeviceState` instance
     */
    /** @internal */

    static fromJson(json: DeviceStateJson): DeviceState {
        return new DeviceState(json.deviceId, json.state);
    }
}
