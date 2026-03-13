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

import { InfoJson } from '../../../../internal/types/telephony/telephony-types';

/**
 * Represents the information associated to an ACD call.
 */
export class AcdCallInfo {
    #queueWaitingTime?: number;
    #globalWaitingTime?: number;
    #agentGroup?: number;
    #local?: boolean;

    /**
     * Private constructor. Use `Info.fromJson()` to create instances.
     * @param queueWaitingTime - Waiting time in the queue
     * @param globalWaitingTime - Global waiting time in the CCD
     * @param agentGroup - Agent group ID
     * @param local - Whether the call is local
     */
    private constructor(queueWaitingTime?: number, globalWaitingTime?: number, agentGroup?: number, local?: boolean) {
        this.#queueWaitingTime = queueWaitingTime;
        this.#globalWaitingTime = globalWaitingTime;
        this.#agentGroup = agentGroup;
        this.#local = local;
    }

    /**
     * Returns the waiting time in a queue from which the call has been distributed.
     * @returns The estimated queue waiting time.
     */
    get queueWaitingTime(): number | null {
        return this.#queueWaitingTime ?? null;
    }

    /**
     * Returns the global waiting time in the CCD.
     * @returns The estimated global waiting time.
     */
    get globalWaitingTime(): number | null {
        return this.#globalWaitingTime ?? null;
    }

    /**
     * Returns the agent group the agent who answered the call is logged in.
     * @returns The agent group.
     */
    get agentGroup(): number | null {
        return this.#agentGroup ?? null;
    }

    /**
     * Returns whether it's a local ACD call.
     * @returns `true` if it is a local ACD call; `false` otherwise.
     */
    get local(): boolean {
        return this.#local ?? false;
    }

    /**
     * Creates an Info instance from JSON
     * @param json - JSON object representing Info
     */
    /** @internal */

    static fromJson(json: InfoJson): AcdCallInfo {
        return new AcdCallInfo(json.queueWaitingTime, json.globalWaitingTime, json.agentGroup, json.local);
    }
}
