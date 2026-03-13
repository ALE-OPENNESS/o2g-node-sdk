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

import { LegCapabilitiesJson, LegJson } from '../../../internal/types/telephony/telephony-types';
import { MediaState } from './media-state';

/**
 * Represents a call leg — a connection endpoint on a specific device within a call.
 * <p>
 * Each leg is associated with a device and carries its current media state,
 * remote ringing status, and the set of operations available on that leg.
 */
export class Leg {
    #deviceId: string;
    #state?: MediaState;
    #ringingRemote?: boolean;
    #capabilities?: Leg.LegCapabilities;

    /**
     * @internal
     */
    private constructor(
        deviceId: string,
        state?: MediaState,
        ringingRemote?: boolean,
        capabilities?: Leg.LegCapabilities
    ) {
        this.#deviceId = deviceId;
        this.#state = state;
        this.#ringingRemote = ringingRemote;
        this.#capabilities = capabilities;
    }

    /**
     * The identifier of the device associated with this leg.
     */
    get deviceId(): string {
        return this.#deviceId;
    }

    /**
     * The current media state of this leg.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState {
        return this.#state ?? MediaState.UNKNOWN;
    }

    /**
     * Whether the remote party is currently ringing on this leg.
     */
    get ringingRemote(): boolean {
        return this.#ringingRemote ?? false;
    }

    /**
     * The set of operations available on this leg.
     */
    get capabilities(): Leg.LegCapabilities | null {
        return this.#capabilities ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: LegJson): Leg {
        return new Leg(
            json.deviceId,
            json.state,
            json.ringingRemote,
            json.capabilities ? Leg.LegCapabilities.fromJson(json.capabilities) : undefined
        );
    }
}

export namespace Leg {
    /**
     * Represents the set of operations available on a call leg.
     * <p>
     * Each capability is a boolean indicating whether the leg currently supports
     * that operation. All capabilities default to `false` if not set.
     */
    export class LegCapabilities {
        #answer?: boolean;
        #drop?: boolean;
        #hold?: boolean;
        #retrieve?: boolean;
        #reconnect?: boolean;
        #mute?: boolean;
        #unMute?: boolean;
        #sendDtmf?: boolean;
        #switchDevice?: boolean;

        /**
         * @internal
         */
        private constructor(
            answer?: boolean,
            drop?: boolean,
            hold?: boolean,
            retrieve?: boolean,
            reconnect?: boolean,
            mute?: boolean,
            unMute?: boolean,
            sendDtmf?: boolean,
            switchDevice?: boolean
        ) {
            this.#answer = answer;
            this.#drop = drop;
            this.#hold = hold;
            this.#retrieve = retrieve;
            this.#reconnect = reconnect;
            this.#mute = mute;
            this.#unMute = unMute;
            this.#sendDtmf = sendDtmf;
            this.#switchDevice = switchDevice;
        }

        /** Whether this leg can answer an incoming call. */
        get canAnswer(): boolean {
            return this.#answer ?? false;
        }

        /** Whether this leg can be dropped from the call. */
        get canDrop(): boolean {
            return this.#drop ?? false;
        }

        /** Whether this leg can be put on hold. */
        get canHold(): boolean {
            return this.#hold ?? false;
        }

        /** Whether this leg can be retrieved from hold. */
        get canRetrieve(): boolean {
            return this.#retrieve ?? false;
        }

        /** Whether this leg can be reconnected (cancel a consultation call). */
        get canReconnect(): boolean {
            return this.#reconnect ?? false;
        }

        /** Whether this leg can be muted. */
        get canMute(): boolean {
            return this.#mute ?? false;
        }

        /** Whether this leg can be unmuted. */
        get canUnMute(): boolean {
            return this.#unMute ?? false;
        }

        /** Whether DTMF codes can be sent on this leg. */
        get canSendDtmf(): boolean {
            return this.#sendDtmf ?? false;
        }

        /** Whether the call can be switched to another device from this leg. */
        get canSwitchDevice(): boolean {
            return this.#switchDevice ?? false;
        }

        /**
         * @internal
         */
        /** @internal */

        static fromJson(json: LegCapabilitiesJson): LegCapabilities {
            return new LegCapabilities(
                json.answer,
                json.drop,
                json.hold,
                json.retrieve,
                json.reconnect,
                json.mute,
                json.unMute,
                json.sendDtmf,
                json.switchDevice
            );
        }
    }
}
