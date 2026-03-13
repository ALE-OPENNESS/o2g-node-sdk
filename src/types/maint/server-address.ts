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

import { ServerAddressJson } from '../../internal/types/maint/maint-types';

/**
 * Represents an OmniPCX Enterprise server address.
 *
 * Includes both the fully qualified domain name (FQDN) and the IPv4 address of the server.
 */
export class ServerAddress {
    #fqdn?: string;
    #ip?: string;

    /**
     * Creates a ServerAddress instance.
     * @param fqdn - Fully qualified domain name of the server
     * @param ip - IPv4 address of the server
     */
    private constructor(fqdn?: string, ip?: string) {
        this.#fqdn = fqdn;
        this.#ip = ip;
    }

    /**
     * Fully qualified domain name of the server
     * @returns {string | null} FQDN or null if not set
     */
    get fqdn(): string | null {
        return this.#fqdn ?? null;
    }

    /**
     * IPv4 address of the server
     * @returns {string | null} IP address or null if not set
     */
    get ip(): string | null {
        return this.#ip ?? null;
    }

    /**
     * Creates a ServerAddress instance from a JSON object.
     * @param json - JSON representation of a server address
     * @returns {ServerAddress} A new ServerAddress instance
     */
    /** @internal */

    static fromJson(json: ServerAddressJson): ServerAddress {
        return new ServerAddress(json.fqdn, json.ip);
    }
}
