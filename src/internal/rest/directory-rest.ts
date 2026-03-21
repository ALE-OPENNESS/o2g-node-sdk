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
import { Criteria } from '../../types/directory/criteria';
import { SearchResultJson } from '../types/directory/directory-types';
import { SearchResult } from '../../types/directory/search-result';
import { IHttpClient } from '../util/IHttpClient';
import { Logger, LogLevel } from '../util/logger';

/** @internal */
export default class DirectoryRest extends RestService {
    #logger = Logger.create('DirectoryRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async search(filter: Criteria, limit: number | null = null, loginName: string | null = null): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`search filter={}, limit={} loginName={}`, filter, limit, loginName);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'search');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.filter = filter.toJson();

        if (limit) {
            req.limit = limit;
        }
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`search request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async cancel(loginName: string | null = null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`cancel loginName=${loginName}`);
        }

        let uriDelete = UtilUri.appendPath(this._uri, 'search');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getResults(loginName: string | null = null): Promise<SearchResult | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getResults loginName=${loginName}`);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'search');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<SearchResultJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getResults result={}`, _json);
        }

        if (!_json) return null;
        return SearchResult.fromJson(_json);
    }
}
