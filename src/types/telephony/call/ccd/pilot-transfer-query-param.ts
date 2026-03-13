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

import { PilotQueryParamJson } from '../../../../internal/types/telephony/telephony-types';
import { CallProfile } from './call-profile';

/**
 * Represents the set of criteria used to query a CCD pilot for call transfer possibilities.
 *
 * Each criterion is optional. If a field is not set (`undefined`), it will be ignored
 * when building the query.
 *
 * Typical usage:
 *
 * ```ts
 * const params = new PilotTransferQueryParameters()
 *      .setAgentNumber("1234")
 *      .setPriorityTransfer(true)
 *      .setCallProfile(profile);
 * ```
 *
 * @since 2.7.4
 */
export class PilotTransferQueryParameters {
    #agentNumber?: string;
    #priorityTransfer?: boolean;
    #supervisedTransfer?: boolean;
    #callProfile?: CallProfile;

    /** Constructs an empty `PilotTransferQueryParameters` object. */
    constructor() {}

    /**
     * Returns the agent number criterion.
     *
     * @returns The agent number, or `null` if not set
     */
    get agentNumber(): string | null {
        return this.#agentNumber ?? null;
    }

    /**
     * Sets the agent number criterion.
     *
     * @param agentNumber - The agent number to filter by
     * @returns This instance for fluent chaining
     */
    setAgentNumber(agentNumber: string): this {
        this.#agentNumber = agentNumber;
        return this;
    }

    /**
     * Returns the priority transfer criterion.
     *
     * @returns `true` for priority transfers, `false` for non-priority,
     *          or `false` if not set (default)
     */
    get priorityTransfer(): boolean {
        return this.#priorityTransfer ?? false;
    }

    /**
     * Sets the priority transfer criterion.
     *
     * @param priorityTransfer - `true` for priority only, `false` for non-priority,
     *                            or `undefined` to ignore
     * @returns This instance for fluent chaining
     */
    setPriorityTransfer(priorityTransfer: boolean | undefined): this {
        this.#priorityTransfer = priorityTransfer;
        return this;
    }

    /**
     * Returns the supervised transfer criterion.
     *
     * @returns `true` for supervised transfers, `false` for unsupervised,
     *          or `false` if not set (default)
     */
    get supervisedTransfer(): boolean {
        return this.#supervisedTransfer ?? false;
    }

    /**
     * Sets the supervised transfer criterion.
     *
     * @param supervisedTransfer - `true` for supervised only, `false` for unsupervised,
     *                             or `undefined` to ignore
     * @returns This instance for fluent chaining
     */
    setSupervisedTransfer(supervisedTransfer: boolean | undefined): this {
        this.#supervisedTransfer = supervisedTransfer;
        return this;
    }

    /**
     * Returns the call profile criterion.
     *
     * @returns The {@link CallProfile} to match, or `null` if not set
     */
    get callProfile(): CallProfile | null {
        return this.#callProfile ?? null;
    }

    /**
     * Sets the call profile criterion.
     *
     * @param callProfile - The {@link CallProfile} to match
     * @returns This instance for fluent chaining
     */
    setCallProfile(callProfile: CallProfile | undefined): this {
        this.#callProfile = callProfile;
        return this;
    }

    /**
     * Returns `true` if an agent number has been set.
     *
     * @returns `true` if `agentNumber` is defined and non-empty
     */
    get hasAgentNumber(): boolean {
        return !!this.#agentNumber && this.#agentNumber.trim() !== '';
    }

    /**
     * Returns `true` if the priority transfer criterion is used.
     *
     * @returns `true` if `priorityTransfer` is defined
     */
    get hasPriorityTransferCriteria(): boolean {
        return this.#priorityTransfer !== undefined;
    }

    /**
     * Returns `true` if the supervised transfer criterion is used.
     *
     * @returns `true` if `supervisedTransfer` is defined
     */
    get hasSupervisedTransferCriteria(): boolean {
        return this.#supervisedTransfer !== undefined;
    }

    /**
     * Returns `true` if a call profile criterion has been set.
     *
     * @returns `true` if `callProfile` is defined
     */
    get hasCallProfile(): boolean {
        return this.#callProfile !== undefined;
    }

    /**
     * Converts this `PilotTransferQueryParameters` instance to the JSON format
     * expected by CCD queries (`PilotQueryParamJson`).
     *
     * @returns A JSON object containing all set criteria; unset criteria are replaced
     *          with default values where required
     */
    /** @internal */

    toJson(): PilotQueryParamJson {
        let pilotQueryParam: PilotQueryParamJson = new Object();
        if (this.#agentNumber) {
            pilotQueryParam.agentNumber = this.#agentNumber;
        }
        if (this.#priorityTransfer) {
            pilotQueryParam.priorityTransfer = this.#priorityTransfer;
        }
        if (this.#supervisedTransfer) {
            pilotQueryParam.supervisedTransfer = this.#supervisedTransfer;
        }
        if (this.#callProfile) {
            pilotQueryParam.skills = this.#callProfile.toJson();
        }

        return pilotQueryParam;
    }
}
