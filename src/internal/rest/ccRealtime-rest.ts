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

import { RestService } from './rest-service';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { RtiObjects } from '../../types/cc-rt/rti-objects';
import { RtiContextJson, RtiObjectIdentifierJson, RtiObjectsJson } from '../types/cc-rt/cc-rt-types';
import { RtiObjectIdentifier } from '../../types/cc-rt/rti-object-identifier';
import { RtiContext } from '../../types/cc-rt/rti-context';
import { HttpContent } from '../util/http-content';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
export default class CallCenterRealtimeRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getRtiObjects(): Promise<RtiObjects | null> {
        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(this._uri));
        if (!_json) return null;
        return RtiObjects.fromJson(_json);
    }

    async getAgents(): Promise<RtiObjectIdentifier[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'agents');

        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiObjects.fromJson(_json).agents;
    }

    async getPilots(): Promise<RtiObjectIdentifier[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'pilots');

        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiObjects.fromJson(_json).pilots;
    }

    async getQueues(): Promise<RtiObjectIdentifier[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'queues');

        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiObjects.fromJson(_json).queues;
    }

    async getAgentProcessingGroups(): Promise<RtiObjectIdentifier[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'pgAgents');

        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiObjects.fromJson(_json).agentProcessingGroups;
    }

    async getOtherProcessingGroups(): Promise<RtiObjectIdentifier[] | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'pgOthers');

        const _json = this.getResult<RtiObjectsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiObjects.fromJson(_json).otherProcessingGroups;
    }

    async getContext(): Promise<RtiContext | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'ctx');

        const _json = this.getResult<RtiContextJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RtiContext.fromJson(_json);
    }

    async deleteContext(): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(this._uri, 'ctx');

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async setContext(context: RtiContext): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, 'ctx');

        const json = JSON.stringify(AssertUtil.notNull(context, 'context').toJson());

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async start(): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, 'snapshot');
        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }
}
