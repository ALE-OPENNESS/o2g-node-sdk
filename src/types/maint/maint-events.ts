/*
 * Copyright 2025 ALE International
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

import {
    OnCtiLinkDownJson,
    OnCtiLinkUpJson,
    OnLicenseExpirationJson,
    OnPbxLinkDownJson,
    OnPbxLinkUpJson,
    OnPbxLoadedJson,
    OnServerStartJson,
} from '../../internal/types/maint/maint-types';

/**
 * Notification sent when the CTI link for a node goes down.
 *
 * This event is sent with a delay between 30 and 60 seconds.
 */
export class OnCtiLinkDown {
    #nodeId: number;

    private constructor(nodeId: number) {
        this.#nodeId = nodeId;
    }

    /**
     * Gets the node identifier for which the CTI link is down.
     *
     * @returns The node ID.
     */
    get nodeId(): number {
        return this.#nodeId;
    }

    /**
     * Creates an {@link OnCtiLinkDown} event from JSON.
     *
     * @param json - JSON payload representing the event.
     * @returns A new {@link OnCtiLinkDown} instance.
     */
    /** @internal */

    static fromJson(json: OnCtiLinkDownJson): OnCtiLinkDown {
        return new OnCtiLinkDown(Number(json.nodeId));
    }
}

/**
 * Notification sent when the CTI link for a node comes back up.
 */
export class OnCtiLinkUp {
    #nodeId: number;

    private constructor(nodeId: number) {
        this.#nodeId = nodeId;
    }

    /**
     * Gets the node identifier for which the CTI link is up.
     *
     * @returns The node ID.
     */
    get nodeId(): number {
        return this.#nodeId;
    }

    /** @internal */

    static fromJson(json: OnCtiLinkUpJson): OnCtiLinkUp {
        return new OnCtiLinkUp(Number(json.nodeId));
    }
}

/**
 * Notification sent when a license is about to expire or has recently expired.
 */
export class OnLicenseExpiration {
    #message: string;
    #nbDays: number;

    private constructor(message: string, nbDays: number) {
        this.#message = message;
        this.#nbDays = nbDays;
    }

    /**
     * Gets the alarm message for the license expiration.
     *
     * @returns The license message.
     */
    get message(): string {
        return this.#message;
    }

    /**
     * Gets the number of days since or until license expiration.
     *
     * - `nbDays > 0`: license will expire in nbDays
     * - `nbDays < 0`: license expired nbDays ago
     *
     * @returns Number of days relative to expiration.
     */
    get nbDays(): number {
        return this.#nbDays;
    }

    /** @internal */

    static fromJson(json: OnLicenseExpirationJson): OnLicenseExpiration {
        return new OnLicenseExpiration(json.message, json.nbDays);
    }
}

/**
 * Notification sent when data is fully loaded from an OXE node.
 */
export class OnPbxLoaded {
    #nodeId: number;

    private constructor(nodeId: number) {
        this.#nodeId = nodeId;
    }

    /**
     * Gets the node identifier for which the PBX is loaded.
     *
     * @returns The node ID.
     */
    get nodeId(): number {
        return this.#nodeId;
    }

    /** @internal */

    static fromJson(json: OnPbxLoadedJson): OnPbxLoaded {
        return new OnPbxLoaded(Number(json.nodeId));
    }
}

/**
 * Notification sent when a PBX link goes down.
 */
export class OnPbxLinkDown {
    #nodeId: number;

    private constructor(nodeId: number) {
        this.#nodeId = nodeId;
    }

    /**
     * Gets the node identifier for which the PBX link is down.
     *
     * @returns The node ID.
     */
    get nodeId(): number {
        return this.#nodeId;
    }

    /** @internal */

    static fromJson(json: OnPbxLinkDownJson): OnPbxLinkDown {
        return new OnPbxLinkDown(Number(json.nodeId));
    }
}

/**
 * Notification sent when a PBX link comes back up.
 */
export class OnPbxLinkUp {
    #nodeId: number;

    private constructor(nodeId: number) {
        this.#nodeId = nodeId;
    }

    /**
     * Gets the node identifier for which the PBX link is up.
     *
     * @returns The node ID.
     */
    get nodeId(): number {
        return this.#nodeId;
    }

    /** @internal */

    static fromJson(json: OnPbxLinkUpJson): OnPbxLinkUp {
        return new OnPbxLinkUp(Number(json.nodeId));
    }
}

/**
 * Notification sent when the O2G server is ready (all OXE nodes are connected and loaded).
 *
 * This event requires a webhook URL to be configured.
 */
export class OnServerStart {
    #serverId: string;

    private constructor(serverId: string) {
        this.#serverId = serverId;
    }

    /**
     * Gets the server identifier or IP address of the server that started.
     *
     * @returns The server ID.
     */
    get serverId(): string {
        return this.#serverId;
    }

    /** @internal */

    static fromJson(json: OnServerStartJson): OnServerStart {
        return new OnServerStart(json.serverId);
    }
}
