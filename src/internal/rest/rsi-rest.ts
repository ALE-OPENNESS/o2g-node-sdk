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
import { HttpContent } from '../util/http-content';
import { Tones } from '../../types/rsi/tones';
import { AdditionalDigitCollectionCriteria } from '../../types/rsi/add-digit-coll-criteria';
import { RouteSessionJson, RsiPointJson } from '../types/rsi/rsi-types';
import { RsiPoint } from '../../types/rsi/rsi-point';
import { RouteSession } from '../../types/rsi/route-session';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
type RsiPointListJson = {
    rsiPoints: RsiPointJson[];
};

/** @internal */
type RouteSessionListJson = {
    routeSessions: RouteSessionJson[];
};

/** @internal */
export default class RsiRest extends RestService {
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getRsiPoints(): Promise<RsiPoint[] | null> {
        const rsiPoints = this.getResult<RsiPointListJson>(await this._httpClient.get(this._uri));

        if (rsiPoints && Array.isArray(rsiPoints.rsiPoints)) {
            return rsiPoints.rsiPoints.map(RsiPoint.fromJson);
        } else {
            return null;
        }
    }

    async enableRsiPoint(rsiNumber: string): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'enable');
        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async disableRsiPoint(rsiNumber: string): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'disable');
        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async startCollectDigits(
        rsiNumber: string,
        callRef: string,
        numChars: number,
        flushChar: string | null,
        timeout: number | null,
        additionalCriteria: AdditionalDigitCollectionCriteria | null
    ) {
        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'),
            'collectDigits'
        );

        let req: any = new Object();
        req.callRef = AssertUtil.notNullOrEmpty(callRef, 'callRef');
        req.numChars = numChars;
        if (flushChar) {
            req.flushChar = flushChar;
        }
        if (timeout) {
            req.timeout = timeout;
        }
        if (additionalCriteria) {
            req.additionalCriteria = additionalCriteria;
        }
        const json = JSON.stringify(req);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return null;
    }

    async stopCollectDigits(rsiNumber: string, collCrid: string): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'),
            'collectDigits',
            AssertUtil.notNullOrEmpty(collCrid, 'collCrid')
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async playTone(rsiNumber: string, callRef: string, tone: Tones, duration: number): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'playTone');

        const json = JSON.stringify({
            callRef: AssertUtil.notNullOrEmpty(callRef, 'callRef'),
            tone: tone,
            duration: duration,
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async cancelTone(rsiNumber: string, callRef: string): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'stopTone');

        const json = JSON.stringify({
            callRef: AssertUtil.notNullOrEmpty(callRef, 'callRef'),
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async playVoiceGuide(
        rsiNumber: string,
        callRef: string,
        guideNumber: number,
        duration: number | null = null
    ): Promise<boolean> {
        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'),
            'playVoiceGuide'
        );

        let req: any = new Object();
        req.callRef = AssertUtil.notNullOrEmpty(callRef, 'callRef');
        req.guideNumber = guideNumber;
        if (duration) {
            req.duration = duration;
        }
        const json = JSON.stringify(req);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async routeEnd(rsiNumber: string, routeCrid: string): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'routeEnd');

        const json = JSON.stringify({
            routeCrid: routeCrid,
        });

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async routeSelect(
        rsiNumber: string,
        routeCrid: string,
        selectedRoute: string,
        callingLine: string | null,
        associatedData: string | null,
        routeToVoiceMail: boolean | null
    ): Promise<boolean> {
        const uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'), 'routeSelect');

        let req: any = new Object();
        req.routeCrid = AssertUtil.notNullOrEmpty(routeCrid, 'routeCrid');
        req.selectedRoute = AssertUtil.notNullOrEmpty(selectedRoute, 'selectedRoute');
        if (callingLine) {
            req.callingLine = callingLine;
        }
        if (associatedData) {
            req.associatedData = associatedData;
        }
        if (routeToVoiceMail) {
            req.routeToVoiceMail = routeToVoiceMail;
        }
        const json = JSON.stringify(req);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getRouteSessions(rsiNumber: string): Promise<RouteSession[] | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'),
            'routeSessions'
        );

        const routeSessions = this.getResult<RouteSessionListJson>(await this._httpClient.get(uriGet));

        if (routeSessions && Array.isArray(routeSessions.routeSessions)) {
            return routeSessions.routeSessions.map(RouteSession.fromJson);
        } else {
            return null;
        }
    }

    async getRouteSession(rsiNumber: string, routeCrid: string): Promise<RouteSession | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(rsiNumber, 'rsiNumber'),
            'routeSessions',
            AssertUtil.notNullOrEmpty(routeCrid, 'routeCrid')
        );

        const _json = this.getResult<RouteSessionJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return RouteSession.fromJson(_json);
    }
}
