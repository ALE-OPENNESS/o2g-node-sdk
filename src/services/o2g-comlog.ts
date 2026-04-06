/*
 * Copyright 2021 ALE International
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

import EventEmitter from 'events';
import CommunicationLogRest from '../internal/rest/comlog-rest';
import { Page } from '../types/comlog/page';
import { QueryFilter } from '../types/comlog/query-filter';
import { QueryResult } from '../types/comlog/query-result';
import { EventRegistry } from '../events/event-dispatcher';
import {
    OnComRecordCreated,
    OnComRecordModified,
    OnComRecordsAck,
    OnComRecordsDeleted,
    OnComRecordsUnAck,
} from '../types/comlog/comlog-events';
import { ComRecord } from '../types/comlog/com-record';

/**
 * The CommunicationLog service allows a user to retrieve their last communication
 * history records and to manage them. Using this service requires having a
 * <b>TELEPHONY_ADVANCED</b> license.
 *
 * @example
 * ```typescript
 * // Query the last 10 unanswered records
 * const filter = new QueryFilter();
 * filter.setUnacknowledged(true);
 *
 * const page = new Page(0, 10);
 *
 * const result = await O2G.comlog.getComRecords(filter, page, true);
 * if (result) {
 *     console.log(`Total records: ${result.totalCount}`);
 *
 *     // Acknowledge all retrieved records
 *     const ids = result.records.map(r => r.recordId);
 *     await O2G.comlog.acknowledgeComRecords(ids);
 *
 *     // Delete records matching the filter
 *     await O2G.comlog.deleteComRecords(filter);
 * }
 * ```
 */
export class CommunicationLog extends EventEmitter {
    #comLogRest: CommunicationLogRest;

    /**
     * Occurs when a new comlog entry has been created.
     * @event
     */
    static readonly ON_COM_RECORD_CREATED = 'OnComRecordCreated';

    /**
     * Occurs when one or more records have been modified.
     * @event
     */
    static readonly ON_COM_RECORD_MODIFIED = 'OnComRecordModified';

    /**
     * Occurs when one or more call log records have been deleted.
     * @see deleteComRecords
     * @see deleteComRecord
     * @see deleteComRecordsById
     * @event
     */
    static readonly ON_COM_RECORDS_DELETED = 'OnComRecordsDeleted';

    /**
     * Occurs when one or more unanswered comlog records have been acknowledged.
     * @see acknowledgeComRecords
     * @see acknowledgeComRecord
     * @event
     */
    static readonly ON_COM_RECORDS_ACK = 'OnComRecordsAck';

    /**
     * Occurs when one or more unanswered comlog records have been unacknowledged.
     * @see unacknowledgeComRecords
     * @see unacknowledgeComRecord
     * @event
     */
    static readonly ON_COM_RECORDS_UNACK = 'OnComRecordsUnAck';

    /**
     * @internal
     */
    constructor(comLogRest: CommunicationLogRest, eventRegistry: EventRegistry) {
        super();
        this.#comLogRest = comLogRest;

        eventRegistry.register(this, CommunicationLog.ON_COM_RECORD_CREATED, OnComRecordCreated);
        eventRegistry.register(this, CommunicationLog.ON_COM_RECORD_MODIFIED, OnComRecordModified);
        eventRegistry.register(this, CommunicationLog.ON_COM_RECORDS_DELETED, OnComRecordsDeleted);
        eventRegistry.register(this, CommunicationLog.ON_COM_RECORDS_ACK, OnComRecordsAck);
        eventRegistry.register(this, CommunicationLog.ON_COM_RECORDS_UNACK, OnComRecordsUnAck);
    }

    /**
     * Gets the com records corresponding to the specified filter, using the
     * specified page, with a possible optimization.
     * <p>
     * If `optimized` is set to `true`, the query returns the full identity of a
     * participant only the first time it occurs, when the same participant appears
     * in several records. When omitted, records are returned with no optimization.
     * <p>
     * The `page` parameter allows querying the communication log by page. The
     * {@link QueryResult} contains the same parameters and the total number of
     * records retrieved by the query.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Get all records with no filter, no pagination
     * const all = await O2G.comlog.getComRecords();
     *
     * // Get only missed calls, first page of 20, with optimization
     * const filter = new QueryFilter();
     * filter.setCallType(FilterOption.MISSED);
     * const page = new Page(0, 20);
     * const missed = await O2G.comlog.getComRecords(filter, page, true);
     *
     * // Administrator querying records for a specific user
     * const userRecords = await O2G.comlog.getComRecords(null, null, false, "jdoe");
     * ```
     *
     * @param filter    the filter describing the query criteria
     * @param page      the page description
     * @param optimized `true` to activate optimization
     * @param loginName the user login name
     * @returns the {@link QueryResult} on success; `null` otherwise.
     */
    async getComRecords(
        filter: QueryFilter | null = null,
        page: Page | null = null,
        optimized: boolean = false,
        loginName: string | null = null
    ): Promise<QueryResult | null> {
        return await this.#comLogRest.getComRecords(filter, page, optimized, loginName);
    }

    /**
     * Gets the specified com record.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns the {@link ComRecord} on success; `null` otherwise.
     */
    async getComRecord(recordId: string, loginName: string | null = null): Promise<ComRecord | null> {
        return await this.#comLogRest.getComRecord(recordId, loginName);
    }

    /**
     * Deletes the specified com record.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecordsById
     * @see deleteComRecords
     */
    async deleteComRecord(recordId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.deleteComRecord(recordId, loginName);
    }

    /**
     * Deletes the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_DELETED} event is raised containing the list of
     * com records that have been deleted.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to delete
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecord
     * @see deleteComRecords
     */
    async deleteComRecordsById(recordIds: string[], loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.deleteComRecordsById(recordIds, loginName);
    }

    /**
     * Deletes the com records corresponding to the given filter.
     * <p>
     * The `filter` parameter defines the search criteria for the delete operation.
     * <p>
     * An {@link ON_COM_RECORDS_DELETED} event is raised containing the list of
     * com records that have been deleted.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Delete all acknowledged records
     * const filter = new QueryFilter();
     * filter.setAcknowledged(true);
     * await O2G.comlog.deleteComRecords(filter);
     *
     * // Delete all records (no filter)
     * await O2G.comlog.deleteComRecords();
     *
     * // Note: to delete specific records by id, use deleteComRecordsById instead
     * await O2G.comlog.deleteComRecordsById(["id1", "id2", "id3"]);
     * ```
     *
     * @param filter    the filter describing the query criteria
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteComRecord
     * @see deleteComRecordsById
     */
    async deleteComRecords(filter: QueryFilter | null = null, loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.deleteComRecords(filter, loginName);
    }

    /**
     * Acknowledges the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_ACK} event is raised containing the list of
     * com records that have been acknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to acknowledge
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see acknowledgeComRecord
     */
    async acknowledgeComRecords(recordIds: string[], loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.acknowledgeComRecords(recordIds, loginName);
    }

    /**
     * Acknowledges the specified com record.
     * <p>
     * An {@link ON_COM_RECORDS_ACK} event is raised containing the list of
     * com records that have been acknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see acknowledgeComRecords
     */
    async acknowledgeComRecord(recordId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.acknowledgeComRecord(recordId, loginName);
    }

    /**
     * Unacknowledges the specified list of com records.
     * <p>
     * An {@link ON_COM_RECORDS_UNACK} event is raised containing the list of
     * com records that have been unacknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordIds the list of com record identifiers to unacknowledge
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unacknowledgeComRecord
     */
    async unacknowledgeComRecords(recordIds: string[], loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.unacknowledgeComRecords(recordIds, loginName);
    }

    /**
     * Unacknowledges the specified com record.
     * <p>
     * An {@link ON_COM_RECORDS_UNACK} event is raised containing the list of
     * com records that have been unacknowledged.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param recordId  the com record identifier
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see unacknowledgeComRecords
     */
    async unacknowledgeComRecord(recordId: string, loginName: string | null = null): Promise<boolean> {
        return await this.#comLogRest.unacknowledgeComRecord(recordId, loginName);
    }
}
