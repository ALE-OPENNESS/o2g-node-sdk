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

import { ServiceStatusJson } from '../../internal/types/maint/maint-types';

/**
 * Represents the status of an individual system service on the O2G server.
 *
 * Includes the service name, its current status, and an optional operating mode.
 */
export class ServiceStatus {
    #name?: string;
    #status?: string;
    #mode?: string;

    /**
     * Creates a ServiceStatus instance.
     * @param name - Name of the service
     * @param status - Current status of the service (e.g., running, stopped)
     * @param mode - Optional mode or configuration of the service
     */
    private constructor(name?: string, status?: string, mode?: string) {
        this.#name = name;
        this.#status = status;
        this.#mode = mode;
    }

    /**
     * Name of the service
     * @returns {string | null} Service name or null if not available
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Current status of the service
     * @returns {string | null} Service status or null if not available
     */
    get status(): string | null {
        return this.#status ?? null;
    }

    /**
     * Optional mode or configuration of the service
     * @returns {string | null} Service mode or null if not set
     */
    get mode(): string | null {
        return this.#mode ?? null;
    }

    /**
     * Creates a ServiceStatus instance from a JSON object.
     * @param json - JSON representation of the service status
     * @returns {ServiceStatus} A new ServiceStatus instance
     */
    /** @internal */

    static fromJson(json: ServiceStatusJson): ServiceStatus {
        return new ServiceStatus(json.name, json.status, json.mode);
    }
}
