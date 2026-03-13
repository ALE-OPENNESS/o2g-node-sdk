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

import { RestService } from './rest-service';
import { HttpContent } from '../util/http-content';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { QueryResult } from '../../types/comlog/query-result';
import { Page } from '../../types/comlog/page';
import { QueryFilter } from '../../types/comlog/query-filter';
import { Role } from '../../types/comlog/role';
import { ComHistoryRecordJson, ComHistoryRecordsJson } from '../types/comlog/comlog-types';
import { IHttpClient } from '../util/IHttpClient';
import { FilterOption } from '../../types/comlog/filter-option';
import { ComRecord } from '../../types/comlog/com-record';

/** @internal */
export default class CommunicationLogRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getComRecords(
        filter: QueryFilter | null,
        page: Page | null,
        optimized: boolean,
        loginName: string | null
    ): Promise<QueryResult | null> {
        let uriGet = this._uri;
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        if (filter) {
            if (filter.after) {
                uriGet = UtilUri.appendQuery(uriGet, 'afterDate', filter.after.toISOString());
            }
            if (filter.before) {
                uriGet = UtilUri.appendQuery(uriGet, 'beforeDate', filter.before.toISOString());
            }

            if (filter.options) {
                if (filter.options.has(FilterOption.UNACKNOWLEDGED)) {
                    uriGet = UtilUri.appendQuery(uriGet, 'unacknowledged', 'true');
                }

                if (filter.options.has(FilterOption.UNANSWERED)) {
                    uriGet = UtilUri.appendQuery(uriGet, 'unanswered', 'true');
                }
            }

            if (filter.role) {
                if (filter.role === Role.CALLEE) {
                    uriGet = UtilUri.appendQuery(uriGet, 'role', 'CALLEE');
                } else if (filter.role == Role.CALLER) {
                    uriGet = UtilUri.appendQuery(uriGet, 'role', 'CALLER');
                }
            }

            if (filter.callRef) {
                uriGet = UtilUri.appendQuery(uriGet, 'comRef', filter.callRef);
            }

            if (filter.remotePartyId) {
                uriGet = UtilUri.appendQuery(uriGet, 'remotePartyId', filter.remotePartyId);
            }
        }

        if (page) {
            if (AssertUtil.positive(page.offset, 'page.offset') > 0) {
                uriGet = UtilUri.appendQuery(uriGet, 'offset', page.offset.toString());
            }

            if (AssertUtil.positive(page.limit, 'page.limit') > 0) {
                uriGet = UtilUri.appendQuery(uriGet, 'limit', page.limit.toString());
            }
        }

        if (optimized) {
            uriGet = UtilUri.appendQuery(uriGet, 'optimized', 'true');
        }

        const _json = this.getResult<ComHistoryRecordsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return QueryResult.fromJson(_json);
    }

    async getComRecord(recordId: string, loginName: string | null): Promise<ComRecord | null> {
        let uriGet = UtilUri.appendPath(this._uri, recordId);
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<ComHistoryRecordJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return ComRecord.fromJson(_json);
    }

    async deleteComRecord(recordId: string, loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(this._uri, recordId);
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async deleteComRecords(filter: QueryFilter | null, loginName: string | null): Promise<boolean> {
        let uriDelete = this._uri;
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        if (filter) {
            if (filter.after) {
                uriDelete = UtilUri.appendQuery(uriDelete, 'afterDate', filter.after.toISOString());
            }
            if (filter.before) {
                uriDelete = UtilUri.appendQuery(uriDelete, 'beforeDate', filter.before.toISOString());
            }

            if (filter.options) {
                if (filter.options.has(FilterOption.UNACKNOWLEDGED)) {
                    uriDelete = UtilUri.appendQuery(uriDelete, 'unacknowledged', 'true');
                }

                if (filter.options.has(FilterOption.UNANSWERED)) {
                    uriDelete = UtilUri.appendQuery(uriDelete, 'unanswered', 'true');
                }
            }

            if (filter.role) {
                if (filter.role == Role.CALLEE) {
                    uriDelete = UtilUri.appendQuery(uriDelete, 'role', 'CALLEE');
                } else if (filter.role == Role.CALLER) {
                    uriDelete = UtilUri.appendQuery(uriDelete, 'role', 'CALLER');
                }
            }

            if (filter.callRef) {
                uriDelete = UtilUri.appendQuery(uriDelete, 'comRef', filter.callRef);
            }

            if (filter.remotePartyId) {
                uriDelete = UtilUri.appendQuery(uriDelete, 'remotePartyId', filter.remotePartyId);
            }
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async deleteComRecordsById(recordIds: string[], loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendQuery(this._uri, 'recordIdList', recordIds.join(','));
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    private async _ackOrUnAckComRecords(ack: string, recordIds: string[], loginName: string | null): Promise<boolean> {
        let uriPut = UtilUri.appendQuery(this._uri, 'acknowledge', ack);
        if (loginName) {
            uriPut = UtilUri.appendQuery(uriPut, 'loginName', loginName);
        }

        let req: any = new Object();
        req.recordIds = recordIds;

        const json = JSON.stringify(req);

        var httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async acknowledgeComRecords(recordIds: string[], loginName: string | null): Promise<boolean> {
        return this._ackOrUnAckComRecords('true', recordIds, loginName);
    }

    async acknowledgeComRecord(recordId: string, loginName: string | null): Promise<boolean> {
        return this._ackOrUnAckComRecords('true', [recordId], loginName);
    }

    async unacknowledgeComRecords(recordIds: string[], loginName: string | null): Promise<boolean> {
        return this._ackOrUnAckComRecords('false', recordIds, loginName);
    }

    async unacknowledgeComRecord(recordId: string, loginName: string | null): Promise<boolean> {
        return this._ackOrUnAckComRecords('false', [recordId], loginName);
    }
}
