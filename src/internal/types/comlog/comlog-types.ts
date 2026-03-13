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

import { Reason } from '../../../types/comlog/reason';
import { Role } from '../../../types/comlog/role';
import { PartyInfoJson } from '../common/common-types';

/**
 * ComRecordParticipant represents a participant referenced in a com
 * record.
 */
/** @internal */
export type ComRecordParticipantJson = {
    /**
     * The participant's role
     */
    role?: Role;

    /**
     * Whether this participant has answered the call.
     */
    answered?: boolean;

    /**
     * Returns this participant's identity.
     */
    identity: PartyInfoJson;

    /**
     * Whether this participant is anonymous.
     */
    anonymous?: boolean;

    /**
     * The number that has been initially called when this participant has
     * been entered in the call.
     */
    initialCalled?: PartyInfoJson;

    /**
     * The reason why the call has been established, rerouted, terminated ...
     */
    reason?: Reason;

    //device leg implicated in the call if the main device is not present
    leg?: string;
};

/** @internal */
export type ComHistoryRecordJson = {
    recordId: number;
    comRef: string;
    acknowledged?: boolean;
    participants?: ComRecordParticipantJson[];
    beginDate?: string;
    endDate?: string;
    convDate?: string;
    holdDuration?: number;
    transferredBy?: string;
    associatedData?: string;
};

/** @internal */
export type ComHistoryRecordsJson = {
    offset?: number;
    limit?: number;
    totalCount?: number;
    comHistoryRecords?: ComHistoryRecordJson[];
};

/**
 * Notification sent when a new comlog entry has been created.
 */
/** @internal */
export type OnComRecordCreatedJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;

    /**
     * Contains all the fields of a call log record.
     */
    record: ComHistoryRecordJson;
};

/**
 * Notification sent when one or more records have been modified.
 * <p>
 * Modification, could be trigerred by:
 * <ul>
 * <li>a change of state (e.g. from unanswered to answered)
 * <li>a change of media list (e.g. IM and call in a conference).
 * <li>a change of end date (e.g. when participants are dropped from a conference)
 * </ul>
 */
/** @internal */
export type OnComRecordModifiedJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;

    /**
     * Contains all or part of the modified fields of a modified com log record.(example: acknowledged).
     */
    record: ComHistoryRecordJson;
};

/**
 * Notification sent when one or more unanswered comlog records have been acknowledged.
 */
/** @internal */
export type OnComRecordsAckJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;

    /**
     * A list of IDs of records which have been acknowledged.
     */
    recordIds?: number[];
};

/**
 * Notification sent when one or more unanswered comlog records have been acknowledged.
 */
/** @internal */
export type OnComRecordsDeletedJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;

    /**
     * A list of IDs of records which have been destroyed Remark : if element is not present it means that all user's records have been destroyed.
     */
    recordIds?: number[];
};

/**
 * Notification sent when one or more unanswered comlog records have been unacknowledged.
 */
/** @internal */
export type OnComRecordsUnAckJson = {
    /**
     * Login name of the user (identifier which can be used for filtering).
     */
    loginName: string;

    /**
     * A list of IDs of records which have been unacknowledged.
     */
    recordIds?: number[];
};
