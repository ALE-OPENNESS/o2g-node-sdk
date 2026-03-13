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

import { PilotJson } from '../../internal/types/cc-mngt/cc-mntg-types';
import { ServiceState } from '../common/service-state';
import { PilotStatus } from '../telephony/call/ccd/pilot-status';
import { PilotRule } from './pilot-rule';

/**
 * Represents an Automatic Call Distributor (ACD) pilot.
 * A pilot is an endpoint (e.g., agent or group) that can receive calls
 * according to routing rules and service states.
 */
export class Pilot {
    #number?: string;
    #name?: string;
    #state?: ServiceState;
    #detailedState?: PilotStatus;
    #waitingTime?: number;
    #saturation?: boolean;
    #rules?: PilotRule[];
    #possibleTransfer?: boolean;
    #supervisedTransfer?: boolean;

    private constructor(
        number?: string,
        name?: string,
        state?: ServiceState,
        detailedState?: PilotStatus,
        waitingTime?: number,
        saturation?: boolean,
        rules?: PilotRule[],
        possibleTransfer?: boolean,
        supervisedTransfer?: boolean
    ) {
        this.#number = number;
        this.#name = name;
        this.#state = state;
        this.#detailedState = detailedState;
        this.#waitingTime = waitingTime;
        this.#saturation = saturation;
        this.#rules = rules;
        this.#possibleTransfer = possibleTransfer;
        this.#supervisedTransfer = supervisedTransfer;
    }

    /**
     * The unique identifier of the pilot (e.g., agent extension or pilot number).
     * @returns {string | null} Pilot number or null if unavailable
     */
    get number(): string | null {
        return this.#number ?? null;
    }

    /**
     * The display name of the pilot (e.g., agent name).
     * @returns {string | null} Pilot name or null if unavailable
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * The current high-level service state of the pilot (e.g., available, busy).
     * @returns {ServiceState | null} Pilot state or null if unavailable
     */
    get state(): ServiceState | null {
        return this.#state ?? null;
    }

    /**
     * The detailed service status of the pilot (e.g., in a call, on break).
     * @returns {PilotStatus | null} Detailed pilot state or null if unavailable
     */
    get detailedState(): PilotStatus | null {
        return this.#detailedState ?? null;
    }

    /**
     * Estimated waiting time for the pilot to become available, in seconds.
     * @returns {number} Waiting time in seconds, defaults to 0
     */
    get waitingTime(): number {
        return this.#waitingTime ?? 0;
    }

    /**
     * Whether the pilot is currently saturated (i.e., unable to receive additional calls).
     * @returns {boolean} True if saturated, false otherwise
     */
    get saturation(): boolean {
        return this.#saturation ?? false;
    }

    /**
     * Routing rules associated with this pilot.
     * @returns {PilotRule[] | null} Array of routing rules or null if none
     */
    get rules(): PilotRule[] | null {
        return this.#rules ?? null;
    }

    /**
     * Indicates if transferring a call to this pilot is possible.
     * @returns {boolean} True if transfer is possible, false otherwise
     */
    get possibleTransfer(): boolean {
        return this.#possibleTransfer ?? false;
    }

    /**
     * Indicates if a call transfer to this pilot can be supervised.
     * @returns {boolean} True if supervised transfer is allowed, false otherwise
     */
    get supervisedTransfer(): boolean {
        return this.#supervisedTransfer ?? false;
    }

    /**
     * Constructs a Pilot instance from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {PilotJson} json - The JSON object containing pilot data
     * @returns {Pilot} A new Pilot instance
     * @internal
     */
    /** @internal */

    static fromJson(json: PilotJson): Pilot {
        return new Pilot(
            json.number,
            json.name,
            json.state,
            json.detailedState,
            json.waitingTime, // keeping JSON typo intentionally
            json.saturation,
            json.rules ? json.rules.map(PilotRule.fromJson) : undefined,
            json.possibleTransfer,
            json.supervisedTransfer
        );
    }
}
