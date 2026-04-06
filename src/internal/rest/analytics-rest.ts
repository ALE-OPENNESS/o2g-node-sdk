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
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { Incident } from '../../types/analytics/incident';
import { ChargingFile } from '../../types/analytics/charging-file';
import { ChargingResult } from '../../types/analytics/charging-result';
import { DateRange } from '../../types/common/date-range';
import { ChargingFileJson, ChargingResultJson, IncidentJson } from '../types/analytics/analytics-types';
import { IHttpClient } from '../util/IHttpClient';
import { Logger } from '../util/logger';
import { LogLevel } from '../../log-level';

/** @internal */
type ChargingFileResultJson = {
    files: ChargingFileJson[];
};

/** @internal */
type IncidentsJson = {
    incidents: IncidentJson[];
};

/** @internal */
export default class AnalyticsRest extends RestService {
    #logger = Logger.create('AnalyticsRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    padTo2Digits(num: number) {
        return num.toString().padStart(2, '0');
    }

    _formatDateFilter(date: Date) {
        return [
            date.getFullYear(),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0'),
        ].join('');
    }

    async getIncidents(nodeId: number, last: number): Promise<Array<Incident> | null> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getIncidents nodeId={}, last={}`, nodeId, last);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'incidents');
        uriGet = UtilUri.appendQuery(uriGet, 'nodeId', AssertUtil.positive(nodeId, 'nodeId').toString());

        if (last > 0) {
            uriGet = UtilUri.appendQuery(uriGet, 'last', last.toString());
        }

        let _json = this.getResult<IncidentsJson>(await this._httpClient.get(uriGet));

        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getIncidents result={}`, _json);
        }

        if (_json && Array.isArray(_json.incidents)) {
            return _json.incidents.map(Incident.fromJson);
        } 
        else {
            return null;
        }
    }

    async getChargingFiles(nodeId: number, filter: DateRange | null): Promise<Array<ChargingFile> | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getChargingFiles nodeId={}, filter={}`, nodeId, filter);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'charging', 'files');
        uriGet = UtilUri.appendQuery(uriGet, 'nodeId', AssertUtil.positive(nodeId, 'nodeId').toString());

        if (filter) {
            uriGet = UtilUri.appendQuery(uriGet, 'fromDate', this._formatDateFilter(filter.from));
            uriGet = UtilUri.appendQuery(uriGet, 'toDate', this._formatDateFilter(filter.to));
        }

        let _json = this.getResult<ChargingFileResultJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getChargingFiles result={}`, _json);
        }

        if (_json && Array.isArray(_json.files)) {
            return _json.files.map(ChargingFile.fromJson);
        } 
        else {
            return null;
        }
    }

    async getChargingsFromFilter(
        nodeId: number,
        filter: DateRange | null,
        topResults: number | null,
        all: boolean
    ): Promise<ChargingResult | null> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getChargingsFromFilter nodeId={}, filter={}, topResults={}, all={}`, nodeId, filter, topResults, all);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'charging');
        uriGet = UtilUri.appendQuery(uriGet, 'nodeId', AssertUtil.positive(nodeId, 'nodeId').toString());

        if (filter) {
            uriGet = UtilUri.appendQuery(uriGet, 'fromDate', this._formatDateFilter(filter.from));
            uriGet = UtilUri.appendQuery(uriGet, 'toDate', this._formatDateFilter(filter.to));
        }

        if (topResults) {
            uriGet = UtilUri.appendQuery(uriGet, 'top', topResults.toString());
        }

        if (all) {
            uriGet = UtilUri.appendQuery(uriGet, 'all', 'true');
        }

        const _json = this.getResult<ChargingResultJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getChargingsFromFilter result={}`, _json);
        }

        if (!_json) return null;
        return ChargingResult.fromJson(_json, filter);
    }

    async getChargingsFromFiles(
        nodeId: number,
        files: Array<ChargingFile>,
        topResults: number | null,
        all: boolean
    ): Promise<ChargingResult | null> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getChargingsFromFiles nodeId={}, files={}, topResults={}, all={}`, nodeId, files, topResults, all);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'charging');
        uriGet = UtilUri.appendQuery(uriGet, 'nodeId', AssertUtil.positive(nodeId, 'nodeId').toString());
        uriGet = UtilUri.appendQuery(
            uriGet,
            'files',
            AssertUtil.notNull(files, 'files')
                .map((file: ChargingFile) => file.name)
                .join(',')
        );

        if (topResults) {
            uriGet = UtilUri.appendQuery(uriGet, 'top', topResults.toString());
        }

        if (all) {
            uriGet = UtilUri.appendQuery(uriGet, 'all', 'true');
        }

        const _json = this.getResult<ChargingResultJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getChargingsFromFiles result={}`, _json);
        }

        if (!_json) return null;
        return ChargingResult.fromJson(_json);
    }
}
