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

import { PinCodeJson } from '../../internal/types/phoneset/phoneset-types';

/**
 * Represents a Personal Identification Number (PIN).
 *
 * Allows a user to declare a call as personal rather than business-related.
 * The PIN is confidential and should only be known by authorized administrators.
 */
export class Pin {
    #number?: string;
    #withSecretCode?: boolean;
    #control?: Pin.Control;
    #group?: number;

    /**
     * @internal
     */
    private constructor(number?: string, withSecretCode?: boolean, control?: Pin.Control, group?: number) {
        this.#number = number;
        this.#withSecretCode = withSecretCode;
        this.#control = control;
        this.#group = group;
    }

    /**
     * The PIN number associated with this Pin instance.
     * @returns {string | null} Returns the PIN number, or null if it is not set.
     */
    get number(): string | null {
        return this.#number ?? null;
    }

    /**
     * Indicates whether this PIN requires validation with the user's secret code.
     * @returns {boolean} Returns true if a secret code is required; false otherwise.
     */
    get withSecretCode(): boolean {
        return this.#withSecretCode ?? false;
    }

    /**
     * The access control associated with this PIN.
     * @returns {Pin.Control | null} Returns the control type if set; null otherwise.
     */
    get control(): Pin.Control | null {
        return this.#control ?? null;
    }

    /**
     * The group number associated with this PIN.
     * @returns {number | null} Returns the group number, or null if it is not set.
     */
    get group(): number | null {
        return this.#group ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: PinCodeJson): Pin {
        // Safe enum mapping
        let control: Pin.Control | undefined;
        switch (json.Pin_Type_Of_Control) {
            case Pin.Control.ByCategory:
            case Pin.Control.RestrictedToOwner:
            case Pin.Control.UniversalAccess:
            case Pin.Control.ByGroup:
                control = json.Pin_Type_Of_Control;
                break;
            default:
                control = undefined; // unknown or invalid value
        }

        return new Pin(json.Pin_Number, json.With_Secret_Code, control, json.Pin_Group);
    }

    /**
     * Converts a Pin instance into an O2GPinCode object.
     * @internal
     */
    static toJson(pin: Pin): PinCodeJson {
        return {
            Pin_Number: pin.#number,
            Pin_Group: pin.#group,
            With_Secret_Code: pin.#withSecretCode,
            Pin_Type_Of_Control: pin.#control,
        };
    }
}

export namespace Pin {
    /**
     * The type of access of a PIN code.
     */
    export enum Control {
        /**
         * PIN code can be used from any set according to categories.
         */
        ByCategory = 'PIN_Category',

        /**
         * PIN code is restricted to the users set.
         */
        RestrictedToOwner = 'PIN_Restricted_To_Owner_Set',

        /**
         * PIN code can be used on any set in the system.
         */
        UniversalAccess = 'PIN_Universal_Access',

        /**
         * PIN code is limited to specific group.
         */
        ByGroup = 'PIN_By_Group',
    }
}
