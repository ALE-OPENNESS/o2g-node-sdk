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

import { WithdrawReasonJson } from '../../internal/types/cc-agent/cc-agent-types';

/**
 * `WithdrawReason` represents a reason why a CCD agent is in a withdraw state.
 *
 * Withdraw reasons are used by the CCD system for reporting and statistical purposes.
 * They help to understand why an agent is temporarily unavailable for call distribution.
 * Each reason has a unique index within the processing group and a descriptive label.
 */
export class WithdrawReason {
    #index: number;
    #label?: string;

    /**
     * @internal
     */
    constructor(index: number, label?: string) {
        this.#index = index;
        this.#label = label;
    }

    /**
     * Returns the index of this withdraw reason within the agent's processing group.
     *
     * @returns The unique numeric index for this withdraw reason.
     */
    get index(): number {
        return this.#index;
    }

    /**
     * Returns the human-readable label describing this withdraw reason.
     *
     * @returns The descriptive label for the reason, or `null` if none is set.
     */
    get label(): string | null {
        return this.#label ?? null;
    }

    /**
     * Creates a WithdrawReason instance from a JSON object.
     *
     * This is typically used when parsing API responses containing withdraw reason data.
     *
     * @param json - The JSON object containing the withdraw reason data.
     * @returns A new WithdrawReason instance with the index and label from the JSON.
     */
    /** @internal */

    static fromJson(json: WithdrawReasonJson): WithdrawReason {
        return new WithdrawReason(json.index, json.label);
    }
}
