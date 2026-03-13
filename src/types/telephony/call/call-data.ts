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

import { CallDataJson } from '../../../internal/types/telephony/telephony-types';
import { HexaString } from '../../../internal/util/hexa-string';
import { PartyInfo } from '../../common/party-info';
import { Call } from '../call';
import { MediaState } from './media-state';
import { RecordState } from './record-state';
import { TrunkIdentification } from '../trunk-indentification';
import { AcdData } from './ccd/acd-data';
import { CorrelatorData } from './correlator-data';
import { Tag } from './tag';

/**
 * Represents the data associated with a call.
 * <p>
 * Aggregates all relevant information about a call including the parties involved,
 * call state, recording state, tags, capabilities, ACD data, trunk information,
 * and attached correlator data.
 */
export class CallData {
    #initialCalled?: PartyInfo;
    #lastRedirecting?: PartyInfo | null;
    #deviceCall?: boolean;
    #anonymous?: boolean;
    #callUUID?: string;
    #state?: MediaState;
    #recordState?: RecordState;
    #tags?: Tag[];
    #capabilities?: Call.CallCapabilities;
    #associatedData?: string;
    #hexaBinaryAssociatedData?: string;
    #accountInfo?: string;
    #acdCallData?: AcdData;
    #trunkIdentification?: TrunkIdentification;

    /**
     * @internal
     */
    private constructor(
        initialCalled?: PartyInfo,
        lastRedirecting?: PartyInfo | null,
        deviceCall?: boolean,
        anonymous?: boolean,
        callUUID?: string,
        state?: MediaState,
        recordState?: RecordState,
        tags?: Tag[],
        capabilities?: Call.CallCapabilities,
        associatedData?: string,
        hexaBinaryAssociatedData?: string,
        accountInfo?: string,
        acdCallData?: AcdData,
        trunkIdentification?: TrunkIdentification
    ) {
        this.#initialCalled = initialCalled;
        this.#lastRedirecting = lastRedirecting;
        this.#deviceCall = deviceCall;
        this.#anonymous = anonymous;
        this.#callUUID = callUUID;
        this.#state = state;
        this.#recordState = recordState;
        this.#tags = tags;
        this.#capabilities = capabilities;
        this.#associatedData = associatedData;
        this.#hexaBinaryAssociatedData = hexaBinaryAssociatedData;
        this.#accountInfo = accountInfo;
        this.#acdCallData = acdCallData;
        this.#trunkIdentification = trunkIdentification;
    }

    /**
     * The initial party called in this call.
     */
    get initialCalled(): PartyInfo | null {
        return this.#initialCalled ?? null;
    }

    /**
     * The last party that redirected this call, if different from the initial called party.
     * `null` if the call was never redirected.
     *
     * @since 2.7.4
     */
    get lastRedirecting(): PartyInfo | null {
        return this.#lastRedirecting ?? null;
    }

    /**
     * Whether the call was initiated from a device.
     */
    get deviceCall(): boolean {
        return this.#deviceCall ?? false;
    }

    /**
     * Whether this call is anonymous.
     */
    get anonymous(): boolean {
        return this.#anonymous ?? false;
    }

    /**
     * The unique identifier of this call.
     */
    get callUUID(): string | null {
        return this.#callUUID ?? null;
    }

    /**
     * The current media state of the call.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState {
        return this.#state ?? MediaState.UNKNOWN;
    }

    /**
     * The recording state of this call.
     * `null` if the call is not being recorded.
     */
    get recordState(): RecordState | null {
        return this.#recordState ?? null;
    }

    /**
     * The tags associated with this call.
     */
    get tags(): Tag[] | null {
        return this.#tags ?? null;
    }

    /**
     * The operations currently available on this call.
     */
    get capabilities(): Call.CallCapabilities | null {
        return this.#capabilities ?? null;
    }

    /**
     * The correlator data attached to this call, if any.
     * <p>
     * May be derived from either string-based associated data or hexadecimal
     * binary data, whichever is present.
     */
    get correlatorData(): CorrelatorData | null {
        if (this.#associatedData != null) {
            return new CorrelatorData(this.#associatedData);
        } else if (this.#hexaBinaryAssociatedData != null) {
            return new CorrelatorData(HexaString.toByteArray(this.#hexaBinaryAssociatedData));
        }
        return null;
    }

    /**
     * The account information associated with this call, used for charging purposes.
     */
    get accountInfo(): string | null {
        return this.#accountInfo ?? null;
    }

    /**
     * The ACD data for this call.
     * `null` if the call was not handled by an ACD.
     */
    get acdCallData(): AcdData | null {
        return this.#acdCallData ?? null;
    }

    /**
     * The trunk identification for external calls.
     * `null` if the call is internal or trunk information is unavailable.
     */
    get trunkIdentification(): TrunkIdentification | null {
        return this.#trunkIdentification ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: CallDataJson): CallData {
        return new CallData(
            json.initialCalled ? PartyInfo.fromJson(json.initialCalled) : undefined,
            json.lastRedirecting ? PartyInfo.fromJson(json.lastRedirecting) : undefined,
            json.deviceCall,
            json.anonymous,
            json.callUUID,
            json.state,
            json.recordState,
            json.tags?.map(Tag.fromJson) ?? undefined,
            json.capabilities ? Call.CallCapabilities.fromJson(json.capabilities) : undefined,
            json.associatedData,
            json.hexaBinaryAssociatedData,
            json.accountInfo,
            json.acdCallData ? AcdData.fromJson(json.acdCallData) : undefined,
            json.trunkIdentification ? TrunkIdentification.fromJson(json.trunkIdentification) : undefined
        );
    }
}
