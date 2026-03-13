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

import { TrunkIdentificationJson } from '../../internal/types/telephony/telephony-types';

/**
 * Represents the trunk identification of an external call.
 * <p>
 * Provides the network timeslot and trunk NEQTs (Network Equipment Queuing
 * Terminations) associated with the trunk used for the call.
 * Available via {@link CallData.trunkIdentification} on external calls.
 */
export class TrunkIdentification {
    #networkTimeslot: number;
    #trunkNeqt: number[];

    /**
     * @internal
     */
    private constructor(networkTimeslot: number, trunkNeqt: number[]) {
        this.#networkTimeslot = networkTimeslot;
        this.#trunkNeqt = trunkNeqt;
    }

    /**
     * The network timeslot used by this trunk.
     */
    get networkTimeslot(): number {
        return this.#networkTimeslot;
    }

    /**
     * The list of trunk NEQTs (Network Equipment Queuing Terminations).
     */
    get trunkNeqt(): number[] {
        return this.#trunkNeqt;
    }

    /**
     * @internal
     */
    /** @internal */
    static fromJson(json: TrunkIdentificationJson): TrunkIdentification {
        return new TrunkIdentification(json.networkTimeslot, json.trunkNeqt);
    }
}
