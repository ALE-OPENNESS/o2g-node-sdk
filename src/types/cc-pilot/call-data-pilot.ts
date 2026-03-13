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

import { CallDataPilotJson } from '../../internal/types/cc-pilot/cc-pilot-types';
import { HexaString } from '../../internal/util/hexa-string';
import { CorrelatorData } from '../telephony/call/correlator-data';
import { TrunkIdentification } from '../telephony/trunk-indentification';

/**
 * Represents the detailed information associated with a pilot call.
 *
 * Provides access to the initial called party, call anonymity status,
 * trunk information for external calls, network rerouting status,
 * and any associated correlator data.
 */
export class CallDataPilot {
    #initialCalled?: string;
    #anonymous?: boolean;
    #associatedData?: string;
    #hexaBinaryAssociatedData?: string;
    #trunkIdentification?: TrunkIdentification;
    #networkRerouted?: boolean;

    /**
     * @ignore
     */
    private constructor(
        initialCalled: string,
        anonymous: boolean,
        associatedData?: string,
        hexaBinaryAssociatedData?: string,
        trunkIdentification?: TrunkIdentification,
        networkRerouted: boolean = false
    ) {
        this.#initialCalled = initialCalled;
        this.#anonymous = anonymous;
        this.#associatedData = associatedData;
        this.#hexaBinaryAssociatedData = hexaBinaryAssociatedData;
        this.#trunkIdentification = trunkIdentification;
        this.#networkRerouted = networkRerouted;
    }

    /**
     * Returns the initial party that was called.
     *
     * @returns the initial called party
     */
    get initialCalled(): string | null {
        return this.#initialCalled ?? null;
    }

    /**
     * Indicates whether this call is anonymous.
     *
     * @returns `true` if the call is anonymous; `false` otherwise
     */
    get anonymous(): boolean {
        return this.#anonymous ?? false;
    }

    /**
     * Returns the trunk information in case of an external call.
     *
     * @returns the {@link TrunkIdentification} associated with the call, or `undefined` if not applicable
     */
    get trunkIdentification(): TrunkIdentification | null {
        return this.#trunkIdentification ?? null;
    }

    /**
     * Indicates whether this call has been rerouted over the network.
     *
     * @returns `true` if the call has been rerouted; `false` otherwise
     */
    get networkRerouted(): boolean {
        return this.#networkRerouted ?? false;
    }

    /**
     * Returns the correlator data associated with this call.
     *
     * The data may come from either a standard string or a hexadecimal binary
     * representation. If no data is attached, this method returns `null`.
     *
     * @returns the {@link CorrelatorData} associated with this call, or `null` if none is available
     */
    get correlatorData(): CorrelatorData | null {
        if (this.#associatedData != null) {
            return new CorrelatorData(this.#associatedData);
        } else if (this.#hexaBinaryAssociatedData != null) {
            return new CorrelatorData(HexaString.toByteArray(this.#hexaBinaryAssociatedData));
        } else {
            return null;
        }
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: CallDataPilotJson): CallDataPilot {
        return new CallDataPilot(
            json.initialCalled,
            json.anonymous,
            json.associatedData,
            json.hexaBinaryAssociatedData,
            json.trunkIdentification ? TrunkIdentification.fromJson(json.trunkIdentification) : undefined,
            json.networkRerouted ?? false
        );
    }
}
