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

import { PbxStatusJson } from '../../internal/types/maint/maint-types';
import { CTILinkState } from './cti-link-state';
import { ServerAddress } from './server-address';

/**
 * Represents the status of an OmniPCX Enterprise (PBX) node connected to the O2G server.
 *
 * Includes node identification, addresses, version, connection status, security, monitored users,
 * and the CSTA link state between the O2G server and the PBX node.
 */
export class PbxStatus {
    #name?: string;
    #nodeId?: number;
    #mainAddress?: ServerAddress;
    #secondaryAddress?: ServerAddress;
    #version?: string;
    #connected?: boolean;
    #loaded?: boolean;
    #ctiLinkState?: CTILinkState;
    #secured?: boolean;
    #monitoredUserNumber?: number;

    /**
     * Creates a PbxStatus instance.
     * @param name - PBX node name
     * @param nodeId - PBX node number
     * @param mainAddress - Main address of the PBX node
     * @param secondaryAddress - Secondary address of the PBX node
     * @param version - Version of the PBX software
     * @param connected - Whether O2G is connected to this PBX node
     * @param loaded - Whether all users on this PBX node are loaded
     * @param ctiLinkState - Current CSTA link state
     * @param secured - Whether the PBX node is secured (SSH)
     * @param monitoredUserNumber - Number of monitored users on this PBX node
     */
    private constructor(
        name?: string,
        nodeId?: number,
        mainAddress?: ServerAddress,
        secondaryAddress?: ServerAddress,
        version?: string,
        connected?: boolean,
        loaded?: boolean,
        ctiLinkState?: CTILinkState,
        secured?: boolean,
        monitoredUserNumber?: number
    ) {
        this.#name = name;
        this.#nodeId = nodeId;
        this.#mainAddress = mainAddress;
        this.#secondaryAddress = secondaryAddress;
        this.#version = version;
        this.#connected = connected;
        this.#loaded = loaded;
        this.#ctiLinkState = ctiLinkState;
        this.#secured = secured;
        this.#monitoredUserNumber = monitoredUserNumber;
    }

    /**
     * PBX node name
     * @returns {string | null} Name of the PBX node, or null if not available
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * PBX node number
     * @returns {number} Node ID (defaults to 0 if not set)
     */
    get nodeId(): number {
        return this.#nodeId ?? 0;
    }

    /**
     * Main address of the PBX node
     * @returns {ServerAddress | null} Main server address or null if not available
     */
    get mainAddress(): ServerAddress | null {
        return this.#mainAddress ?? null;
    }

    /**
     * Secondary address of the PBX node
     * @returns {ServerAddress | null} Secondary server address or null if not available
     */
    get secondaryAddress(): ServerAddress | null {
        return this.#secondaryAddress ?? null;
    }

    /**
     * PBX software version
     * @returns {string | null} Version string or null if not available
     */
    get version(): string | null {
        return this.#version ?? null;
    }

    /**
     * Connection status between O2G and the PBX node
     * @returns {boolean} True if connected, false otherwise
     */
    get connected(): boolean {
        return this.#connected ?? false;
    }

    /**
     * Indicates whether all users on this PBX node have been loaded by O2G
     * @see {@link Maintenance.ON_PBX_LOADED} event
     * @returns {boolean} True if all users are loaded, false otherwise
     */
    get loaded(): boolean {
        return this.#loaded ?? false;
    }

    /**
     * CSTA link state between the O2G server and this PBX node
     * @returns {CTILinkState | null} Current CSTA link state or null if not available
     */
    get ctiLinkState(): CTILinkState | null {
        return this.#ctiLinkState ?? null;
    }

    /**
     * Whether the PBX node is secured. If true, the connection with O2G uses SSH.
     * @returns {boolean} True if secured, false otherwise
     */
    get secured(): boolean {
        return this.#secured ?? false;
    }

    /**
     * Number of monitored users on this PBX node
     * @returns {number} Number of monitored users (defaults to 0 if not set)
     */
    get monitoredUserNumber(): number {
        return this.#monitoredUserNumber ?? 0;
    }

    /**
     * Creates a PbxStatus instance from a JSON object.
     * @param json - JSON representation of a PBX node status
     * @returns {PbxStatus} A new PbxStatus instance
     */
    /** @internal */

    static fromJson(json: PbxStatusJson): PbxStatus {
        return new PbxStatus(
            json.name,
            json.nodeId,
            json.mainAddress ? ServerAddress.fromJson(json.mainAddress) : undefined,
            json.secondaryAddress ? ServerAddress.fromJson(json.secondaryAddress) : undefined,
            json.version,
            json.connected,
            json.loaded,
            json.ctiLinkState,
            json.secured,
            json.monitoredUserNumber
        );
    }
}
