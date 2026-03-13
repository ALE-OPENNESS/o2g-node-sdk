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

import { ComHistoryRecordJson } from '../../internal/types/comlog/comlog-types';
import { HexaString } from '../../internal/util/hexa-string';
import { CorrelatorData } from '../telephony/call/correlator-data';
import { ComRecordParticipant } from './com-record-participant';

/**
 * Represents a communication record, which is a call history entry stored
 * for each conversation.
 *
 * Each record contains information about the call, including its unique
 * identifier, reference, participants, timestamps, and acknowledgment status.
 *
 * A record may represent an incoming or outgoing call, and includes details
 * such as the start and end times, as well as the conversation time
 * when the call was answered.
 */
export class ComRecord {
    #id: number;
    #comRef: string;
    #acknowledged?: boolean;
    #participants?: ComRecordParticipant[];
    #beginDate?: Date;
    #endDate?: Date;
    #convDate?: Date;
    #holdDuration?: number;
    #transferredBy?: string;
    #associatedData?: string;
    #hexaBinaryAssociatedData?: string;

    /**
     * Protected constructor for internal use and deserialization.
     */
    private constructor(
        id: number,
        comRef: string,
        acknowledged?: boolean,
        participants?: ComRecordParticipant[],
        beginDate?: Date,
        endDate?: Date,
        convDate?: Date,
        holdDuration?: number,
        transferredBy?: string,
        associatedData?: string,
        hexaBinaryAssociatedData?: string
    ) {
        this.#id = id;
        this.#comRef = comRef;
        this.#acknowledged = acknowledged;
        this.#participants = participants;
        this.#beginDate = beginDate;
        this.#endDate = endDate;
        this.#convDate = convDate;
        this.#holdDuration = holdDuration;
        this.#transferredBy = transferredBy;
        this.#associatedData = associatedData;
        this.#hexaBinaryAssociatedData = hexaBinaryAssociatedData;
    }

    /**
     * Returns the unique identifier of this communication record.
     *
     * @returns The record ID.
     */
    get id(): number {
        return this.#id;
    }

    /**
     * Returns the reference of the call that created this communication record.
     *
     * @returns The call reference.
     */
    get comRef(): string {
        return this.#comRef;
    }

    /**
     * Indicates whether this communication record has been acknowledged.
     *
     * Only missed incoming calls can have this flag set to `true`.
     *
     * @returns `true` if the call has been acknowledged; `false` otherwise.
     */
    get acknowledged(): boolean {
        return this.#acknowledged ?? false;
    }

    /**
     * Returns the collection of participants in this communication record.
     *
     * @returns An array of `ComRecordParticipant` objects representing all
     *          participants in the call.
     */
    get participants(): ComRecordParticipant[] | null {
        return this.#participants ?? null;
    }

    /**
     * Returns the start date and time of this call.
     *
     * @returns The call start date.
     */
    get beginDate(): Date | null {
        return this.#beginDate ?? null;
    }

    /**
     * Returns the end date and time of this call.
     *
     * @returns The call end date.
     */
    get endDate(): Date | null {
        return this.#endDate ?? null;
    }

    /**
     * Returns the date and time when the call was answered.
     *
     * For missed calls, this value may be `null`.
     *
     * @returns The conversation date.
     * @since 2.6
     */
    get convDate(): Date | null {
        return this.#convDate ?? null;
    }

    /**
     * Returns the duration this call has been on hold.
     *
     * @returns The hold duration in milliseconds (or seconds depending on your backend).
     * @since 2.7.4
     */
    get holdDuration(): number {
        return this.#holdDuration ?? 0;
    }

    /**
     * Returns the number of the user who performed the transfer for this call,
     * if the call has been transferred.
     *
     * This value may be `null` if the call has not been transferred.
     *
     * @returns The number of the user who transferred the call, or `null` if
     *          no transfer occurred.
     * @since 2.7.4
     */
    get transferredBy(): string | null {
        return this.#transferredBy ?? null;
    }

    /**
     * Returns the correlator data associated with this call, if present.
     *
     * This method may return `null` if no correlator data is associated
     * with the call.
     *
     * @returns The `CorrelatorData` associated with this call, or `null` if none is present.
     * @since 2.7.4
     */
    get correlatorData(): CorrelatorData | null {
        if (this.#associatedData != null) {
            return new CorrelatorData(this.#associatedData);
        } else if (this.#hexaBinaryAssociatedData != null) {
            return new CorrelatorData(HexaString.toByteArray(this.#hexaBinaryAssociatedData));
        } else {
            return null;
        }
    }

    /**
     * Deserializes a `ComHistoryRecord` from its JSON representation.
     *
     * @param json The JSON object representing a communication record.
     * @returns A `ComHistoryRecord` instance.
     */
    /** @internal */

    static fromJson(json: ComHistoryRecordJson): ComRecord {
        return new ComRecord(
            json.recordId,
            json.comRef,
            json.acknowledged,
            json.participants ? json.participants.map(ComRecordParticipant.fromJson) : undefined,
            json.beginDate ? new Date(json.beginDate) : undefined,
            json.endDate ? new Date(json.endDate) : undefined,
            json.convDate ? new Date(json.convDate) : undefined,
            json.holdDuration,
            json.transferredBy,
            json.associatedData,
            undefined
        );
    }
}
