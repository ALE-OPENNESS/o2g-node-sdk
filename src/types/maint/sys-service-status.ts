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

import { SystemServiceStatusJson } from '../../internal/types/maint/maint-types';
import { ServiceStatus } from './service-status';

/**
 * Represents the status of all system services on an O2G server.
 *
 * Includes individual service statuses, the server's global IP address,
 * and the DRBD status for high availability.
 */
export class SystemServiceStatus {
    #services?: ServiceStatus[];
    #globalIPAddress?: string;
    #drbd?: string;

    /**
     * Creates a SystemServiceStatus instance.
     * @param services - Array of service statuses
     * @param globalIPAddress - Global IP address of the server
     * @param drbd - DRBD status (for HA configuration)
     */
    private constructor(services?: ServiceStatus[], globalIPAddress?: string, drbd?: string) {
        this.#services = services;
        this.#globalIPAddress = globalIPAddress;
        this.#drbd = drbd;
    }

    /**
     * Array of individual service statuses
     * @returns {ServiceStatus[] | null} List of services or null if not available
     */
    get services(): ServiceStatus[] | null {
        return this.#services ?? null;
    }

    /**
     * Global IP address of the server
     * @returns {string | null} Global IP address or null if not available
     */
    get globalIPAddress(): string | null {
        return this.#globalIPAddress ?? null;
    }

    /**
     * DRBD status for high availability
     * @returns {string | null} DRBD status or null if not available
     */
    get drbd(): string | null {
        return this.#drbd ?? null;
    }

    /**
     * Creates a SystemServiceStatus instance from JSON.
     * @param json - JSON representation of system service status
     * @returns {SystemServiceStatus} A new SystemServiceStatus instance
     */
    /** @internal */

    static fromJson(json: SystemServiceStatusJson): SystemServiceStatus {
        return new SystemServiceStatus(json.services?.map(ServiceStatus.fromJson), json.globalIPAdress, json.drbd);
    }
}
