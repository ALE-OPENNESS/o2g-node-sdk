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

import { RestService } from './rest-service';
import UtilUri from '../util/util-uri';
import { AssertUtil } from '../util/assert';
import { User } from '../../types/users/user';
import { UserJson } from '../types/users/users-types';
import { IHttpClient } from '../util/IHttpClient';
import { HttpContent } from '../util/http-content';
import { Logger } from '../util/logger';
import { LogLevel } from '../../log-level';

/** @internal */
type LoginsResponse = {
    loginNames: string[];
};

type Users = {
    users: UserJson[];
};


/** @internal */
export default class UsersManagementRest extends RestService {
    #logger = Logger.create('UsersManagementRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getLogins(nodeIds: number[] | null): Promise<string[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getLogins nodeIds=${nodeIds}`);
        }

        let uriGet = this._uri;
        if (nodeIds) {
            uriGet = UtilUri.appendQuery(uriGet, 'nodeIds', nodeIds.join(';'));
        }

        const logins = this.getResult<LoginsResponse>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getLogins result={}`, logins);
        }

        if (logins && Array.isArray(logins.loginNames)) {
            return logins.loginNames;
        } 
        else {
            return null;
        }
    }

    async getByDeviceNumber(deviceNumber: string): Promise<string | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getByDeviceNumber deviceNumber=${deviceNumber}`);
        }

        const uriGet = UtilUri.appendQuery(
            this._uri,
            'deviceNumber',
            AssertUtil.notNullOrEmpty(deviceNumber, 'deviceNumber')
        );

        const logins = this.getResult<LoginsResponse>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getByDeviceNumber result={}`, logins);
        }

        if (logins && Array.isArray(logins.loginNames)) {
            return logins.loginNames[0];
        } 
        else {
            return null;
        }
    }

    async createUsers(nodeId: number, deviceNumbers: string[] | null): Promise<User[]|null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`createUsers nodeId=${nodeId}, deviceNumbers=${deviceNumbers}`);
        }

        let uriPost = this._uri;

        let req: any = new Object();
        req.nodeId = AssertUtil.positive(nodeId, 'nodeId');

        if (deviceNumbers && deviceNumbers.length > 0) {
            req.deviceNumbers = deviceNumbers;
        } 
        else {
            req.all = true;
        }
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`createUsers request={}`, req);
        }

        const _json = this.getResult<Users>(await this._httpClient.post(uriPost, new HttpContent(JSON.stringify(req))));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`createUsers result={}`, _json);
        }

        if (_json && Array.isArray(_json.users)) {
            return _json.users.map(User.fromJson);
        } 
        else {
            return null;
        }
    }

    async getByLoginName(loginName: string): Promise<User | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getByLoginName loginName=${loginName}`);
        }

        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(loginName, 'loginName'));

        const _json = this.getResult<UserJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getByLoginName result={}`, _json);
        }

        if (!_json) return null;
        return User.fromJson(_json);
    }

    async deleteUser(loginName: string): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deleteUser loginName=${loginName}`);
        }

        const uriDelete = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(loginName, 'loginName'));

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }
}
