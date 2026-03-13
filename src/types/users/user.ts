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

import { UserJson } from '../../internal/types/users/users-types';
import { Device } from '../common/device';
import { Voicemail } from './voicemail';

/**
 * Represents a subscriber in the OmniPCX Enterprise system.
 *
 * A user can have one or multiple devices and optionally a voicemail mailbox.
 * This class provides access to the user's personal and account information,
 * devices, and system configuration.
 */
export class User {
    #companyPhone?: string;
    #firstName?: string;
    #lastName?: string;
    #loginName?: string;
    #voicemail?: Voicemail | null;
    #devices?: Device[];
    #nodeId?: number;
    #externalLogin?: string;

    /**
     * Constructs a new User instance.
     * @param companyPhone - The user's company phone number (main device for multi-device users)
     * @param firstName - The user's first name
     * @param lastName - The user's last name
     * @param loginName - The user's login name
     * @param voicemail - The user's voicemail information, or null if none
     * @param devices - The user's devices, or undefined if none
     * @param nodeId - The OmniPCX Enterprise node ID
     * @param externalLogin - The user's external login, or undefined if none
     * @private
     */
    private constructor(
        companyPhone?: string,
        firstName?: string,
        lastName?: string,
        loginName?: string,
        voicemail?: Voicemail | null,
        devices?: Device[],
        nodeId?: number,
        externalLogin?: string
    ) {
        this.#companyPhone = companyPhone;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#loginName = loginName;
        this.#voicemail = voicemail;
        this.#devices = devices;
        this.#nodeId = nodeId;
        this.#externalLogin = externalLogin;
    }

    /**
     * Returns the user's company phone number.
     * For multi-device users, this is the phone number of the main device.
     * @returns The company phone number, or null if not set
     */
    get companyPhone(): string | null {
        return this.#companyPhone ?? null;
    }

    /**
     * Returns the user's first name.
     * @returns The first name, or null if not set
     */
    get firstName(): string | null {
        return this.#firstName ?? null;
    }

    /**
     * Returns the user's last name.
     * @returns The last name, or null if not set
     */
    get lastName(): string | null {
        return this.#lastName ?? null;
    }

    /**
     * Returns the user's login name.
     * @returns The login name, or null if not set
     */
    get loginName(): string | null {
        return this.#loginName ?? null;
    }

    /**
     * Returns the user's voicemail information.
     * @returns A {@link Voicemail} object, or null if none
     */
    get voicemail(): Voicemail | null {
        return this.#voicemail ?? null;
    }

    /**
     * Returns the collection of devices assigned to the user.
     * @returns An array of {@link Device} objects, or null if none
     */
    get devices(): Device[] | null {
        return this.#devices ?? null;
    }

    /**
     * Returns the OmniPCX Enterprise node ID for this user.
     * @returns The node ID, or null if not set
     */
    get nodeId(): number | null {
        return this.#nodeId ?? null;
    }

    /**
     * Returns the user's external login.
     * @returns The external login, or null if none
     */
    get externalLogin(): string | null {
        return this.#externalLogin ?? null;
    }

    /**
     * Creates a new {@link User} instance from JSON data.
     *
     * The JSON object should follow the {@link UserJson} structure. Devices
     * and voicemail are converted using their respective `fromJson` methods.
     *
     * @param json - JSON object representing a User
     * @returns A fully constructed {@link User} instance
     */
    /** @internal */

    static fromJson(json: UserJson): User {
        return new User(
            json.companyPhone,
            json.firstName,
            json.lastName,
            json.loginName,
            json.voicemail ? Voicemail.fromJson(json.voicemail) : null,
            json.devices?.map((d) => Device.fromJson(d)),
            Number(json.nodeId),
            json.externalLogin
        );
    }
}
