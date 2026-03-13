/*
 * Copyright 2025 ALE International
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

import {
    OnComRecordCreatedJson,
    OnComRecordModifiedJson,
    OnComRecordsAckJson,
    OnComRecordsDeletedJson,
    OnComRecordsUnAckJson,
} from '../../internal/types/comlog/comlog-types';
import { ComRecord } from './com-record';

/**
 * Notification sent when a new communication log entry has been created.
 *
 * This event represents a single new record created for the user.
 */
export class OnComRecordCreated {
    #loginName: string;
    #record: ComRecord;

    private constructor(loginName: string, record: ComRecord) {
        this.#loginName = loginName;
        this.#record = record;
    }

    /**
     * Gets the login name of the user for whom the communication log entry was created.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the created communication record.
     *
     * @returns The created {@link ComRecord}.
     */
    get record(): ComRecord {
        return this.#record;
    }

    /**
     * Creates an {@link OnComRecordCreated} event from JSON.
     *
     * @param json - JSON payload representing the created record.
     * @returns A new {@link OnComRecordCreated} instance.
     */
    /** @internal */

    static fromJson(json: OnComRecordCreatedJson): OnComRecordCreated {
        return new OnComRecordCreated(json.loginName, ComRecord.fromJson(json.record));
    }
}

/**
 * Notification sent when one or more communication log records have been modified.
 *
 * Modification can include changes such as:
 * - State changes (e.g., unanswered → answered)
 * - Media list updates (e.g., IM and call in a conference)
 * - End date updates (e.g., participants dropped from a conference)
 */
export class OnComRecordModified {
    #loginName: string;
    #record: ComRecord;

    private constructor(loginName: string, record: ComRecord) {
        this.#loginName = loginName;
        this.#record = record;
    }

    /**
     * Gets the login name of the user for whom the communication log entry was modified.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the modified communication record.
     *
     * @returns The modified {@link ComRecord}.
     */
    get record(): ComRecord {
        return this.#record;
    }

    /** @internal */

    static fromJson(json: OnComRecordModifiedJson): OnComRecordModified {
        return new OnComRecordModified(json.loginName, ComRecord.fromJson(json.record));
    }
}

/**
 * Notification sent when one or more unanswered communication log records have been acknowledged.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export class OnComRecordsAck {
    #loginName: string;
    #recordIds?: number[];

    private constructor(loginName: string, recordIds?: number[]) {
        this.#loginName = loginName;
        this.#recordIds = recordIds;
    }

    /**
     * Gets the login name of the user for whom the records were acknowledged.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the identifiers of the acknowledged communication log entries.
     *
     * @returns An array of acknowledged record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null {
        return this.#recordIds ?? null;
    }

    /** @internal */

    static fromJson(json: OnComRecordsAckJson): OnComRecordsAck {
        return new OnComRecordsAck(json.loginName, json.recordIds ?? undefined);
    }
}

/**
 * Notification sent when one or more unanswered communication log records have been deleted.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export class OnComRecordsDeleted {
    #loginName: string;
    #recordIds?: number[];

    private constructor(loginName: string, recordIds?: number[]) {
        this.#loginName = loginName;
        this.#recordIds = recordIds;
    }

    /**
     * Gets the login name of the user for whom the records were deleted.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the identifiers of the deleted communication log entries.
     *
     * @returns An array of deleted record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null {
        return this.#recordIds ?? null;
    }

    /** @internal */

    static fromJson(json: OnComRecordsDeletedJson): OnComRecordsDeleted {
        return new OnComRecordsDeleted(json.loginName, json.recordIds ?? undefined);
    }
}

/**
 * Notification sent when one or more previously unanswered communication log records have been unacknowledged.
 *
 * If `recordIds` is `null`, it means **all records** for the user are concerned.
 */
export class OnComRecordsUnAck {
    #loginName: string;
    #recordIds?: number[];

    private constructor(loginName: string, recordIds?: number[]) {
        this.#loginName = loginName;
        this.#recordIds = recordIds;
    }

    /**
     * Gets the login name of the user for whom the records were unacknowledged.
     *
     * @returns The user's login name.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Gets the identifiers of the unacknowledged communication log entries.
     *
     * @returns An array of unacknowledged record IDs, or `null` if all records are concerned.
     */
    get recordIds(): number[] | null {
        return this.#recordIds ?? null;
    }

    /** @internal */

    static fromJson(json: OnComRecordsUnAckJson): OnComRecordsUnAck {
        return new OnComRecordsUnAck(json.loginName, json.recordIds ?? undefined);
    }
}
