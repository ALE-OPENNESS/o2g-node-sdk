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
import { HttpContent } from '../util/http-content';
import { ForwardCondition } from '../../types/routing/forward-condition';
import { OverflowCondition } from '../../types/routing/overflow-condition';
import {
    DndStateJson,
    ForwardRouteJson,
    OverflowRouteJson,
    RoutingCapabilitiesJson,
    RoutingStateJson,
} from '../types/routing/routing-types';
import { DndState } from '../../types/routing/dnd-state';
import { Forward } from '../../types/routing/forward';
import { Overflow } from '../../types/routing/overflow';
import { RoutingCapabilities } from '../../types/routing/routing-capabilities';
import { RoutingState } from '../../types/routing/routing-state';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
export default class RoutingRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async activateDnd(loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'dnd');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async cancelDnd(loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(this._uri, 'dnd');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getDndState(loginName: string | null): Promise<DndState | null> {
        let uriGet = UtilUri.appendPath(this._uri, 'dnd');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<DndStateJson>(await this._httpClient.get(uriGet));
        if (_json == null) return null;
        return DndState.fromJson(_json);
    }

    async getCapabilities(loginName: string | null): Promise<RoutingCapabilities | null> {
        let uriGet = this._uri;
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<RoutingCapabilitiesJson>(await this._httpClient.get(uriGet));
        if (_json == null) return null;
        return RoutingCapabilities.fromJson(_json);
    }

    async cancelForward(loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(this._uri, 'forwardroute');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getForward(loginName: string | null): Promise<Forward | null> {
        let uriGet = UtilUri.appendPath(this._uri, 'forwardroute');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.get(uriGet);
        const json = httpResponse.response;
        if (httpResponse.isSuccessStatusCode()) {
            if (json.length === 0) {
                return Forward.fromJson(null);
            } else {
                const forwardRoute: ForwardRouteJson = JSON.parse(json);
                return Forward.fromJson(forwardRoute);
            }
        } else {
            return null;
        }
    }

    async forwardOnVoiceMail(condition: ForwardCondition, loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'forwardroute');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _forward = Forward.onVoiceMail(condition);
        let json = JSON.stringify({
            forwardRoute: _forward.toJson(),
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async forwardOnNumber(number: string, condition: ForwardCondition, loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'forwardroute');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _forward = Forward.onNumber(number, condition);

        const json = JSON.stringify({
            forwardRoute: _forward.toJson(),
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async overflowOnVoiceMail(condition: OverflowCondition, loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'overflowroute');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const _overflow = Overflow.onVoiceMail(condition);

        const json = JSON.stringify({
            overflowRoutes: _overflow.toJson(),
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getOverflow(loginName: string | null): Promise<Overflow | null> {
        let uriGet = UtilUri.appendPath(this._uri, 'overflowroute');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.get(uriGet);
        const json = httpResponse.response;
        if (httpResponse.isSuccessStatusCode()) {
            if (json.length === 0) {
                return Overflow.fromJson(null);
            } else {
                const _overflowRouteJson: OverflowRouteJson = JSON.parse(json);
                return Overflow.fromJson(_overflowRouteJson);
            }
        } else {
            return null;
        }
    }

    async cancelOverflow(loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(this._uri, 'overflowroute');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async setRemoteExtensionActivation(active: boolean, loginName: string | null): Promise<boolean> {
        let uriPost = this._uri;
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const json = JSON.stringify({
            presentationRoutes: [
                {
                    destinations: [
                        {
                            type: 'MOBILE',
                            selected: true,
                        },
                    ],
                },
            ],
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getRoutingState(loginName: string | null): Promise<RoutingState | null> {
        let uriGet = UtilUri.appendPath(this._uri, 'state');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<RoutingStateJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RoutingState.fromJson(_json);
    }

    async requestSnapshot(loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'state/snapshot');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }
}
