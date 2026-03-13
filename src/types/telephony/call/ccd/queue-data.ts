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

import { QueueDataJson } from '../../../../internal/types/telephony/telephony-types';

/**
 * Represents information about the queue that distributed a call.
 */
export class QueueData {
    #waitingTime?: number;
    #saturated?: boolean;

    /**
     * Private constructor. Use `QueueData.fromJson()` to create instances.
     * @param waitingTime - The estimated waiting time in the queue
     * @param saturated - Indicates whether the queue is saturated
     */
    private constructor(waitingTime?: number, saturated?: boolean) {
        this.#waitingTime = waitingTime;
        this.#saturated = saturated;
    }

    /**
     * Returns the estimated waiting time in the queue.
     * @returns The waiting time in seconds, or `null` if not available.
     */
    get waitingTime(): number | null {
        return this.#waitingTime ?? null;
    }

    /**
     * Indicates whether the queue is currently saturated.
     * @returns `true` if the queue is saturated; `false` otherwise.
     */
    get saturated(): boolean {
        return this.#saturated ?? false;
    }

    /**
     * Creates a `QueueData` instance from a JSON object.
     * @param json - The JSON object representing the queue data
     * @returns A new `QueueData` instance
     */
    /** @internal */

    static fromJson(json: QueueDataJson): QueueData {
        return new QueueData(json.waitingTime, json.saturated);
    }
}
