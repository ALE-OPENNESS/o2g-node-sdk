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

import { ParticipantJson } from '../../../internal/types/telephony/telephony-types';
import { PartyInfo } from '../../common/party-info';
import { MediaState } from './media-state';

/**
 * Represents a participant in a call.
 * <p>
 * Participants are identified by a unique `participantId` and may optionally
 * include identity information. Flags indicate whether the participant is
 * anonymous or cannot be dropped, and their current media state is also tracked.
 */
export class Participant {
    #participantId: string;
    #identity?: PartyInfo;
    #anonymous?: boolean;
    #undroppable?: boolean;
    #state?: MediaState;

    /**
     * @internal
     */
    private constructor(
        participantId: string,
        identity?: PartyInfo,
        anonymous?: boolean,
        undroppable?: boolean,
        state?: MediaState
    ) {
        this.#participantId = participantId;
        this.#identity = identity;
        this.#anonymous = anonymous;
        this.#undroppable = undroppable;
        this.#state = state;
    }

    /**
     * The unique identifier of this participant.
     */
    get participantId(): string {
        return this.#participantId;
    }

    /**
     * The identity of this participant.
     */
    get identity(): PartyInfo | null {
        return this.#identity ?? null;
    }

    /**
     * Whether this participant is anonymous.
     */
    get anonymous(): boolean {
        return this.#anonymous ?? false;
    }

    /**
     * Whether this participant cannot be dropped from the call.
     */
    get undroppable(): boolean {
        return this.#undroppable ?? false;
    }

    /**
     * The current media state of this participant.
     * Defaults to `MediaState.UNKNOWN` if not set.
     */
    get state(): MediaState {
        return this.#state ?? MediaState.UNKNOWN;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: ParticipantJson): Participant {
        return new Participant(
            json.participantId,
            json.identity ? PartyInfo.fromJson(json.identity) : undefined,
            json.anonymous,
            json.undroppable,
            json.state
        );
    }
}
