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
import { Subscription } from '../../subscription';
import { SubscriptionResult } from '../types/common/common-types';
import { IHttpClient } from '../util/IHttpClient';
import { Logger, LogLevel } from '../util/logger';

/** @internal */
export default class SubscriptionsRest extends RestService {
    #logger = Logger.create('SubscriptionsRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async create(subscription: Subscription): Promise<SubscriptionResult | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`create subscription=${JSON.stringify(subscription)}`);
        }

        const payload: any = {
            filter: subscription.filter,
            version: subscription.version,
        };

        if (subscription.webHook?.url) {
            payload.webHookUrl = subscription.webHook.url;
        } 
        else {
            payload.timeout = subscription.timeout;
        }

        const subscriptionJson = JSON.stringify(payload);
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.debug(`create request=${subscriptionJson}`);
        }
        
        const httpContent = new HttpContent(subscriptionJson);

        const response = await this._httpClient.post(this._uri, httpContent);
        return this.getResult<SubscriptionResult>(response);
    }
}
