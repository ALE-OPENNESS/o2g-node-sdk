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

import { AcdDataJson } from '../../../../internal/types/telephony/telephony-types';
import { AcdCallInfo } from './acd-call-info';
import { PilotTransferInfo } from './pilot-transfer-info';
import { QueueData } from './queue-data';

/**
 * Represents the ACD extension for an ACD call.
 */
export class AcdData {
    #callInfo?: AcdCallInfo;
    #queueData?: QueueData;
    #pilotNumber?: string;
    #rsiNumber?: string;
    #supervisedTransfer?: boolean;
    #pilotTransferInfo?: PilotTransferInfo;

    /**
     * Private constructor. Use `AcdData.fromJson()` to create instances.
     * @param callInfo - The ACD call information
     * @param queueData - The queue data
     * @param pilotNumber - Pilot number
     * @param rsiNumber - RSI number
     * @param supervisedTransfer - Whether transfer was supervised
     * @param pilotTransferInfo - Information about possible transfer
     */
    private constructor(
        callInfo?: AcdCallInfo,
        queueData?: QueueData,
        pilotNumber?: string,
        rsiNumber?: string,
        supervisedTransfer?: boolean,
        pilotTransferInfo?: PilotTransferInfo
    ) {
        this.#callInfo = callInfo;
        this.#queueData = queueData;
        this.#pilotNumber = pilotNumber;
        this.#rsiNumber = rsiNumber;
        this.#supervisedTransfer = supervisedTransfer;
        this.#pilotTransferInfo = pilotTransferInfo;
    }

    /**
     * Returns the information associated with this ACD call.
     * @returns The ACD call information, or `null` if not available.
     */
    get callInfo(): AcdCallInfo | null {
        return this.#callInfo ?? null;
    }

    /**
     * Returns the information about the queue that distributed this call.
     * @returns The queue data, or `null` if not available.
     */
    get queueData(): QueueData | null {
        return this.#queueData ?? null;
    }

    /**
     * Returns the pilot number that distributed this call.
     * @returns The pilot number, or `null` if not available.
     */
    get pilotNumber(): string | null {
        return this.#pilotNumber ?? null;
    }

    /**
     * Returns the RSI point that distributed this call.
     * @returns The RSI number, or `null` if not available.
     */
    get rsiNumber(): string | null {
        return this.#rsiNumber ?? null;
    }

    /**
     * Indicates whether the transfer on the pilot was supervised.
     * @returns `true` if the transfer was supervised; `false` otherwise.
     */
    get isSupervisedTransfer(): boolean {
        return this.#supervisedTransfer ?? false;
    }

    /**
     * Returns information about a possible transfer on a pilot.
     * @returns The pilot transfer information, or `null` if not available.
     */
    get pilotTransferInfo(): PilotTransferInfo | null {
        return this.#pilotTransferInfo ?? null;
    }

    /**
     * Creates an `AcdData` instance from a JSON object.
     * @param json - The JSON object representing the ACD data
     * @returns A new `AcdData` instance
     */
    /** @internal */

    static fromJson(json: AcdDataJson): AcdData {
        return new AcdData(
            json.callInfo ? AcdCallInfo.fromJson(json.callInfo) : undefined,
            json.queueData ? QueueData.fromJson(json.queueData) : undefined,
            json.pilotNumber,
            json.rsiNumber,
            json.supervisedTransfer,
            json.pilotTransferInfo ? PilotTransferInfo.fromJson(json.pilotTransferInfo) : undefined
        );
    }
}
