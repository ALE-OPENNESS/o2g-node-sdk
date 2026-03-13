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

import { PilotInfoJson } from '../../../../internal/types/telephony/telephony-types';
import { PilotTransferInfo } from './pilot-transfer-info';

/**
 * Represents a pilot handling a call, including its queue information,
 * transfer status, and possible pilot transfer details.
 */
export class PilotInfo {
    #number?: string;
    #waitingTime?: number;
    #saturation?: boolean;
    #supervisedTransfer?: boolean;
    #pilotTransferInfo?: PilotTransferInfo;

    /**
     * Private constructor. Use `PilotInfo.fromJson()` to create instances.
     * @param number - The pilot number
     * @param waitingTime - Estimated waiting time in the queue (seconds)
     * @param saturation - Indicates whether the queue is saturated
     * @param supervisedTransfer - Indicates whether the transfer can be supervised
     * @param pilotTransferInfo - Information about possible pilot transfer
     */
    private constructor(
        number?: string,
        waitingTime?: number,
        saturation?: boolean,
        supervisedTransfer?: boolean,
        pilotTransferInfo?: PilotTransferInfo
    ) {
        this.#number = number;
        this.#waitingTime = waitingTime;
        this.#saturation = saturation;
        this.#supervisedTransfer = supervisedTransfer;
        this.#pilotTransferInfo = pilotTransferInfo;
    }

    /**
     * Returns the pilot number.
     * @returns The pilot number, or `null` if not available
     */
    get number(): string | null {
        return this.#number ?? null;
    }

    /**
     * Returns the estimated waiting time in the queue.
     * @returns The waiting time in seconds, or `null` if not available
     */
    get waitingTime(): number | null {
        return this.#waitingTime ?? null;
    }

    /**
     * Indicates whether this queue is currently saturated.
     * @returns `true` if the queue is saturated; `false` otherwise
     */
    get saturation(): boolean {
        return this.#saturation ?? false;
    }

    /**
     * Indicates whether the transfer on this pilot can be supervised.
     * @returns `true` if supervised transfer is possible; `false` otherwise
     */
    get supervisedTransfer(): boolean {
        return this.#supervisedTransfer ?? false;
    }

    /**
     * Returns information about a possible transfer on this pilot.
     * @returns The {@link PilotTransferInfo}, or `null` if not available
     */
    get pilotTransferInfo(): PilotTransferInfo | null {
        return this.#pilotTransferInfo ?? null;
    }

    /**
     * Creates a `PilotInfo` instance from a JSON object.
     * @param json - The JSON object representing pilot information
     * @returns A new `PilotInfo` instance
     */
    /** @internal */

    static fromJson(json: PilotInfoJson): PilotInfo {
        return new PilotInfo(
            json.number,
            json.waitingTime,
            json.saturation,
            json.supervisedTransfer,
            json.pilotTransferInfo ? PilotTransferInfo.fromJson(json.pilotTransferInfo) : undefined
        );
    }
}
