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

import { ComRecordParticipantJson } from '../../internal/types/comlog/comlog-types';
import { PartyInfo } from '../common/party-info';
import { Reason } from './reason';
import { Role } from './role';

/**
 * Represents a participant referenced in a communication record (com record).
 *
 * <b>Record Content:</b>
 *
 * <b>Simple call</b> (user A calls user B): the call record on each participant's side
 * will include both participants, though the order is not guaranteed between successive responses.
 *
 * <b>Re-routed call</b> (user A -> B, rerouted to C due to overflow, redirection, or pickup):
 * participant records reflect the rerouting, including the initially called party.
 *
 * <b>Multi-party calls:</b> Participants added during the call will appear in records
 * of already connected users. Their `answered` status indicates whether they accepted or declined the call.
 *
 * <b>Participant Identification:</b>
 * - In comlog notification events, the participant owner is identified by `loginName` only.
 * - Other participants include full identity (`loginName`, `phoneNumber`).
 * - In `QueryResult`:
 *   - If no optimization is requested, all participants use full identity.
 *   - If `optimized=true`, only the first occurrence uses full identity; subsequent ones use only phone numbers.
 */
export class ComRecordParticipant {
    #role?: Role;
    #answered?: boolean;
    #identity: PartyInfo;
    #anonymous?: boolean;
    #initialCalled?: PartyInfo;
    #reason?: Reason;
    #leg?: string;

    private constructor(
        identity: PartyInfo,
        role?: Role,
        answered?: boolean,
        anonymous?: boolean,
        initialCalled?: PartyInfo,
        reason?: Reason,
        leg?: string
    ) {
        this.#role = role;
        this.#answered = answered;
        this.#identity = identity;
        this.#anonymous = anonymous;
        this.#initialCalled = initialCalled;
        this.#reason = reason;
        this.#leg = leg;
    }

    /**
     * Returns this participant's role in the communication.
     *
     * @returns The role of the participant.
     */
    get role(): Role | null {
        return this.#role ?? null;
    }

    /**
     * Returns whether this participant answered the call.
     *
     * @returns `true` if answered, `false` if not, or `false` if unknown.
     */
    get answered(): boolean {
        return this.#answered ?? false;
    }

    /**
     * Returns the participant's identity.
     *
     * @returns The `PartyInfo` representing this participant.
     */
    get identity(): PartyInfo {
        return this.#identity;
    }

    /**
     * Indicates if the participant is anonymous.
     *
     * @returns `true` if anonymous; `false` otherwise.
     */
    get anonymous(): boolean {
        return this.#anonymous ?? false;
    }

    /**
     * Returns the number that was initially called when this participant joined the call.
     *
     * @returns The initial called `PartyInfo`, or `null` if not applicable.
     */
    get initialCalled(): PartyInfo | null {
        return this.#initialCalled ?? null;
    }

    /**
     * Returns the reason for the call being established, rerouted, or terminated.
     *
     * @returns The `Reason` for this participant in the call. Defaults to `Reason.UNKNOWN` if not set.
     */
    get reason(): Reason {
        return this.#reason ?? Reason.UNKNOWN;
    }

    /**
     * Returns the device leg involved in the call.
     *
     * Typically set when the main device is not a participant in the call.
     * May return `null` if the main device is present or leg is not set.
     *
     * @returns The device leg as a string, or `null` if none is present.
     * @since 2.7.4
     */
    get leg(): string | null {
        return this.#leg ?? null;
    }

    /**
     * Deserializes a `ComRecordParticipant` from JSON representation.
     *
     * @param json The JSON object representing a participant.
     * @returns A `ComRecordParticipant` instance.
     */
    /** @internal */

    static fromJson(json: ComRecordParticipantJson): ComRecordParticipant {
        return new ComRecordParticipant(
            PartyInfo.fromJson(json.identity),
            json.role,
            json.answered,
            json.anonymous,
            json.initialCalled ? PartyInfo.fromJson(json.initialCalled) : undefined,
            json.reason,
            json.leg
        );
    }
}
