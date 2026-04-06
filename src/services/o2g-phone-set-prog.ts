/*
 * Copyright 2021 ALE International
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

import PhoneSetProgrammingRest from '../internal/rest/phone-set-prog-rest';
import { DynamicState } from '../types/phoneset/dynamic-state';
import { Pin } from '../types/phoneset/pin';
import { ProgrammeableKey } from '../types/phoneset/prog-key';
import { SoftKey } from '../types/phoneset/soft-key';
import { Device } from '../types/common/device';

/**
 * This service allows managing the programmable keys, soft keys, and device settings
 * of the phone sets assigned to a user.
 * <p>
 * Most methods accept a `loginName` parameter. When `loginName` is `null`, the operation
 * applies to the user of the current session. When specified, it allows an administrator
 * to manage another user's devices.
 *
 * @example
 * ```typescript
 * // Current session user — pass null for loginName
 * const devices = await O2G.phoneSetProgramming.getDevices(null);
 * if (devices && devices.length > 0) {
 *     const deviceId = devices[0].id;
 *
 *     // Retrieve all programmed keys
 *     const keys = await O2G.phoneSetProgramming.getProgrammedKeys(null, deviceId);
 *
 *     // Assign a new programmable key at position 1
 *     const key = new ProgrammeableKey({ position: 1, type: "SPEED_DIAL", number: "5001" });
 *     await O2G.phoneSetProgramming.setProgrammableKey(null, deviceId, key);
 *
 *     // Lock the device
 *     await O2G.phoneSetProgramming.lockDevice(null, deviceId);
 *
 *     // Unlock when done
 *     await O2G.phoneSetProgramming.unlockDevice(null, deviceId);
 * }
 *
 * // Administrator managing another user's device
 * const adminDevices = await O2G.phoneSetProgramming.getDevices("jdoe");
 * ```
 */
export class PhoneSetProgramming {
    #phoneSetProgrRest: PhoneSetProgrammingRest;

    /**
     * @internal
     */
    constructor(phoneSetProgrRest: PhoneSetProgrammingRest) {
        this.#phoneSetProgrRest = phoneSetProgrRest;
    }

    /**
     * Retrieves the list of devices assigned to the specified user.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @returns the list of {@link Device} objects on success; `null` otherwise.
     */
    async getDevices(loginName: string | null): Promise<Device[] | null> {
        return this.#phoneSetProgrRest.getDevices(loginName);
    }

    /**
     * Retrieves the information of a specific device assigned to the specified user.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link Device} information on success; `null` otherwise.
     */
    async getDevice(loginName: string | null, deviceId: string): Promise<Device | null> {
        return this.#phoneSetProgrRest.getDevice(loginName, deviceId);
    }

    /**
     * Retrieves all programmable keys of the specified device, including unassigned positions.
     * <p>
     * Use this method when you need to know the full layout of the device, including
     * empty positions. To retrieve only the keys that have been assigned, use
     * {@link getProgrammedKeys} instead.
     *
     * @example
     * ```typescript
     * // Get all positions (including empty ones) to inspect the full key layout
     * const allKeys = await O2G.phoneSetProgramming.getProgrammableKeys(null, "1234");
     *
     * // Get only the assigned keys to display what is currently programmed
     * const assignedKeys = await O2G.phoneSetProgramming.getProgrammedKeys(null, "1234");
     *
     * console.log(`Total positions: ${allKeys?.length}`);
     * console.log(`Assigned keys: ${assignedKeys?.length}`);
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of {@link ProgrammeableKey} objects on success; `null` otherwise.
     * @see getProgrammedKeys
     */
    async getProgrammableKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null> {
        return this.#phoneSetProgrRest.getProgrammableKeys(loginName, deviceId);
    }

    /**
     * Retrieves only the programmed (assigned) programmable keys of the specified device.
     * <p>
     * Use this method when you only need the keys that have been assigned. To retrieve
     * the full layout including unassigned positions, use {@link getProgrammableKeys} instead.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of assigned {@link ProgrammeableKey} objects on success; `null` otherwise.
     * @see getProgrammableKeys
     */
    async getProgrammedKeys(loginName: string | null, deviceId: string): Promise<ProgrammeableKey[] | null> {
        return this.#phoneSetProgrRest.getProgrammedKeys(loginName, deviceId);
    }

    /**
     * Assigns or updates a programmable key on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param key       the programmable key configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteProgrammableKey
     */
    async setProgrammableKey(loginName: string | null, deviceId: string, key: ProgrammeableKey): Promise<boolean> {
        return this.#phoneSetProgrRest.setProgrammableKey(loginName, deviceId, key);
    }

    /**
     * Deletes the programmable key at the specified position on the given device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param position  the position of the programmable key to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setProgrammableKey
     */
    async deleteProgrammableKey(loginName: string | null, deviceId: string, position: number): Promise<boolean> {
        return this.#phoneSetProgrRest.deleteProgrammableKey(loginName, deviceId, position);
    }

    /**
     * Retrieves the soft keys of the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the list of {@link SoftKey} objects on success; `null` otherwise.
     */
    async getSoftKeys(loginName: string | null, deviceId: string): Promise<SoftKey[] | null> {
        return this.#phoneSetProgrRest.getSoftKeys(loginName, deviceId);
    }

    /**
     * Assigns or updates a soft key on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param key       the soft key configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteSoftKey
     */
    async setSoftKey(loginName: string | null, deviceId: string, key: SoftKey): Promise<boolean> {
        return this.#phoneSetProgrRest.setSoftKey(loginName, deviceId, key);
    }

    /**
     * Deletes the soft key at the specified position on the given device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param position  the position of the soft key to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see setSoftKey
     */
    async deleteSoftKey(loginName: string | null, deviceId: string, position: number): Promise<boolean> {
        return this.#phoneSetProgrRest.deleteSoftKey(loginName, deviceId, position);
    }

    /**
     * Locks the specified device, preventing it from being used to place or receive calls.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unlockDevice
     */
    async lockDevice(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.lockDevice(loginName, deviceId);
    }

    /**
     * Unlocks the specified device, restoring normal call capabilities.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see lockDevice
     */
    async unlockDevice(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.unlockDevice(loginName, deviceId);
    }

    /**
     * Enables the camp-on feature on the specified device.
     * <p>
     * When camp-on is enabled, the user is automatically connected when a busy
     * destination becomes available.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see disableCampon
     */
    async enableCampon(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.enableCampon(loginName, deviceId);
    }

    /**
     * Disables the camp-on feature on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see enableCampon
     */
    async disableCampon(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.disableCampon(loginName, deviceId);
    }

    /**
     * Retrieves the PIN code configuration of the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link Pin} configuration on success; `null` otherwise.
     * @see setPinCode
     */
    async getPinCode(loginName: string | null, deviceId: string): Promise<Pin | null> {
        return this.#phoneSetProgrRest.getPinCode(loginName, deviceId);
    }

    /**
     * Sets the PIN code on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param code      the PIN configuration to set
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getPinCode
     */
    async setPinCode(loginName: string | null, deviceId: string, code: Pin): Promise<boolean> {
        return this.#phoneSetProgrRest.setPinCode(loginName, deviceId, code);
    }

    /**
     * Retrieves the dynamic state of the specified device.
     * <p>
     * The dynamic state reflects runtime settings such as the associated device
     * and remote extension activation status.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns the {@link DynamicState} on success; `null` otherwise.
     */
    async getDynamicState(loginName: string | null, deviceId: string): Promise<DynamicState | null> {
        return this.#phoneSetProgrRest.getDynamicState(loginName, deviceId);
    }

    /**
     * Associates an additional device with the specified device.
     * <p>
     * The associate feature allows calls to ring simultaneously on both devices,
     * which is useful for example to have a mobile phone ring alongside a desk phone.
     *
     * @example
     * ```typescript
     * // Associate a mobile number with the desk phone so both ring simultaneously
     * await O2G.phoneSetProgramming.setAssociate(null, "1234", "0612345678");
     *
     * // Check the dynamic state to verify the association is active
     * const state = await O2G.phoneSetProgramming.getDynamicState(null, "1234");
     * console.log("Associated device:", state?.associatedNumber);
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @param associate the phone number of the device to associate
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setAssociate(loginName: string | null, deviceId: string, associate: string): Promise<boolean> {
        return this.#phoneSetProgrRest.setAssociate(loginName, deviceId, associate);
    }

    /**
     * Activates the remote extension on the specified device.
     * <p>
     * When activated, the device operates as a remote extension, allowing the user
     * to use an off-site phone as if it were connected to the PBX.
     *
     * @example
     * ```typescript
     * // Check current remote extension state before activating
     * const state = await O2G.phoneSetProgramming.getDynamicState(null, "1234");
     * console.log("Remote extension active:", state?.remoteExtensionActivated);
     *
     * // Activate the remote extension
     * await O2G.phoneSetProgramming.activateRemoteExtension(null, "1234");
     *
     * // Deactivate when the user returns to the office
     * await O2G.phoneSetProgramming.deactivateRemoteExtension(null, "1234");
     * ```
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deactivateRemoteExtension
     * @see getDynamicState
     */
    async activateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.activateRemoteExtension(loginName, deviceId);
    }

    /**
     * Deactivates the remote extension on the specified device.
     *
     * @param loginName the user login name, or `null` for the current session user.
     * @param deviceId  the device identifier
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateRemoteExtension
     * @see getDynamicState
     */
    async deactivateRemoteExtension(loginName: string | null, deviceId: string): Promise<boolean> {
        return this.#phoneSetProgrRest.deactivateRemoteExtension(loginName, deviceId);
    }
}
