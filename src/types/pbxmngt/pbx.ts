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

import { PbxJson } from '../../internal/types/pbxmngt/pbxmngt-types';

/**
 * Represents the basic information of a PBX (OmniPCX Enterprise).
 *
 * <p>
 * In an OmniPCX Enterprise sub-network, each OXE node is identified by a unique node ID.
 * </p>
 */
export class Pbx {
    #nodeId?: number;
    #fqdn?: string;

    /**
     * @internal
     */
    private constructor(nodeId?: number, fqdn?: string) {
        this.#nodeId = nodeId;
        this.#fqdn = fqdn;
    }

    /**
     * Returns the OmniPCX Enterprise node ID.
     *
     * @returns The node ID of this PBX, or null if not set
     */
    get nodeId(): number | null {
        return this.#nodeId ?? null;
    }

    /**
     * Returns the fully qualified domain name (FQDN) of this OmniPCX Enterprise node.
     *
     * @returns The FQDN of this PBX, or null if not set
     */
    get fqdn(): string | null {
        return this.#fqdn ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: PbxJson): Pbx {
        return new Pbx(json.nodeId, json.fqdn);
    }
}
