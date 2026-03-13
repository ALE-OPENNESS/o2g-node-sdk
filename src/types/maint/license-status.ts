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

import { LicenseStatusJson } from '../../internal/types/maint/maint-types';
import { License } from './license';
import { LicenseType } from './license-type';

/**
 * Represents the license status of the O2G server.
 *
 * Contains information about the license type, context, the current server,
 * overall status, detailed status message, and the list of individual licenses.
 */
export class LicenseStatus {
    #type?: LicenseType;
    #context?: string;
    #currentServer?: string;
    #status?: string;
    #statusMessage?: string;
    #licenses?: License[];

    /**
     * @internal
     */
    private constructor(
        type?: LicenseType,
        context?: string,
        currentServer?: string,
        status?: string,
        statusMessage?: string,
        licenses?: License[]
    ) {
        this.#type = type;
        this.#context = context;
        this.#currentServer = currentServer;
        this.#status = status;
        this.#statusMessage = statusMessage;
        this.#licenses = licenses;
    }

    /**
     * Type of license control (e.g., FLEXLM or LMS).
     * @returns {LicenseType | null} The license type or null if not set
     */
    get type(): LicenseType | null {
        return this.#type ?? null;
    }

    /**
     * Context or scope of the license.
     * @returns {string | null} License context or null if not set
     */
    get context(): string | null {
        return this.#context ?? null;
    }

    /**
     * Name of the current server managing the license.
     * @returns {string | null} Server name or null if not set
     */
    get currentServer(): string | null {
        return this.#currentServer ?? null;
    }

    /**
     * Overall status of the license.
     * @returns {string | null} License status or null if not set
     */
    get status(): string | null {
        return this.#status ?? null;
    }

    /**
     * Additional status message describing the license state.
     * @returns {string | null} Status message or null if not set
     */
    get statusMessage(): string | null {
        return this.#statusMessage ?? null;
    }

    /**
     * Array of individual licenses associated with this license status.
     * @returns {License[] | null} List of licenses or null if none
     */
    get licenses(): License[] | null {
        return this.#licenses ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: LicenseStatusJson): LicenseStatus {
        return new LicenseStatus(
            json.type,
            json.context,
            json.currentServer,
            json.status,
            json.statusMessage,
            json.lics?.map(License.fromJson)
        );
    }
}
