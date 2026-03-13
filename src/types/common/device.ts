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

import { DeviceJson } from '../../internal/types/common/common-types';
import { DeviceCapabilitiesJson } from '../../internal/types/telephony/telephony-types';
import { DeviceType } from './device-type';

/**
 * Represents a telephony device for a user.
 */
export class Device {
    #type?: DeviceType;
    #id?: string;
    #subType?: string;

    /**
     * Private constructor. Use `Device.fromJson()` to create instances.
     * @param type - The device type
     * @param id - The device identifier
     * @param subType - Optional device sub-type
     */
    private constructor(type: DeviceType, id: string, subType?: string) {
        this.#type = type;
        this.#id = id;
        this.#subType = subType;
    }

    /** Get the device type */
    get type(): DeviceType | null {
        return this.#type ?? null;
    }

    /** Get the device identifier */
    get id(): string | null {
        return this.#id ?? null;
    }

    /** Get the device sub-type, if any */
    get subType(): string | null {
        return this.#subType ?? null;
    }

    /**
     * Creates a Device instance from JSON
     * @param json - JSON object representing a Device
     */
    /** @internal */

    static fromJson(json: DeviceJson): Device {
        return new Device(json.type, json.id, json.subType);
    }
}

/**
 * Namespace for device-related types.
 */
export namespace Device {
    /**
     * Represents the capabilities of a device.
     *
     * Each device has a unique `deviceId` and may support various telephony
     * operations, such as making calls, business calls, private calls, or
     * unparking calls. Use `Capabilities.fromJson()` to create instances
     * from JSON data.
     */
    export class Capabilities {
        #deviceId: string;
        #makeCall?: boolean;
        #makeBusinessCall?: boolean;
        #makePrivateCall?: boolean;
        #unParkCall?: boolean;

        /**
         * Private constructor. Use `Capabilities.fromJson()` to create instances.
         *
         * @param deviceId - The unique identifier of the device
         * @param makeCall - Whether the device can make a call
         * @param makeBusinessCall - Whether the device can make a business call
         * @param makePrivateCall - Whether the device can make a private call
         * @param unParkCall - Whether the device can unpark a call
         */
        private constructor(
            deviceId: string,
            makeCall?: boolean,
            makeBusinessCall?: boolean,
            makePrivateCall?: boolean,
            unParkCall?: boolean
        ) {
            this.#deviceId = deviceId;
            this.#makeCall = makeCall;
            this.#makeBusinessCall = makeBusinessCall;
            this.#makePrivateCall = makePrivateCall;
            this.#unParkCall = unParkCall;
        }

        /**
         * Returns the unique identifier of the device.
         */
        get deviceId(): string {
            return this.#deviceId;
        }

        /**
         * Indicates whether the device can make a regular call.
         *
         * @returns `true` if the device can make calls; otherwise `false` (default `false`)
         */
        get canMakeCall(): boolean {
            return this.#makeCall ?? false;
        }

        /**
         * Indicates whether the device can make a business call.
         *
         * @returns `true` if the device can make business calls; otherwise `false` (default `false`)
         */
        get canMakeBusinessCall(): boolean {
            return this.#makeBusinessCall ?? false;
        }

        /**
         * Indicates whether the device can make a private call.
         *
         * @returns `true` if the device can make private calls; otherwise `false` (default `false`)
         */
        get canMakePrivateCall(): boolean {
            return this.#makePrivateCall ?? false;
        }

        /**
         * Indicates whether the device can unpark a call.
         *
         * @returns `true` if the device can unpark calls; otherwise `false` (default `false`)
         */
        get canUnParkCall(): boolean {
            return this.#unParkCall ?? false;
        }

        /**
         * Creates a `Capabilities` instance from a JSON object.
         *
         * @param json - JSON object representing device capabilities
         * @returns A new `Capabilities` instance
         */
        /** @internal */

        static fromJson(json: DeviceCapabilitiesJson): Capabilities {
            return new Capabilities(
                json.deviceId,
                json.makeCall,
                json.makeBusinessCall,
                json.makePrivateCall,
                json.unParkCall
            );
        }
    }
}
