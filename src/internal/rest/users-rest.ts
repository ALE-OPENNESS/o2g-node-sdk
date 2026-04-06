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
import { User } from '../../types/users/user';
import { PreferencesJson, SupportedLanguagesJson, UserJson } from '../types/users/users-types';
import { Preferences } from '../../types/users/preferences';
import { SupportedLanguages } from '../../types/users/supported-languages';
import { IHttpClient } from '../util/IHttpClient';
import { HttpContent } from '../util/http-content';
import { Logger } from '../util/logger';
import { LogLevel } from '../../log-level';

/** @internal */
type LoginsResponse = {
    loginNames: string[];
};

/** @internal */
export default class UsersRest extends RestService {
    #logger = Logger.create('UsersRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getByLoginName(loginName: string | null = null): Promise<User | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getByLoginName loginName=${loginName}`);
        }

        let uriGet = this._uri;
        if (loginName) {
            uriGet = UtilUri.appendPath(uriGet, loginName);
        }

        const _json = this.getResult<UserJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getByLoginName result={}`, _json);
        }

        if (!_json) return null;
        return User.fromJson(_json);
    }

    async getLogins(nodeIds: number[] | null, onlyACD: boolean, onlyWithExtLogin: boolean): Promise<string[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getLogins nodeIds={}, onlyACD={}, onlyWithExtLogin={}`, nodeIds, onlyACD, onlyWithExtLogin);
        }

        let uriGet = this._uri.replace('/users', '/logins');
        if (nodeIds) {
            uriGet = UtilUri.appendQuery(uriGet, 'nodeIds', nodeIds.join(';'));
        }

        if (onlyACD) {
            uriGet = UtilUri.appendQuery(uriGet, 'onlyACD');
        }

        if (onlyWithExtLogin) {
            uriGet = UtilUri.appendQuery(uriGet, 'onlyWithExtLogin');
        }

        const _json = this.getResult<LoginsResponse>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getLogins result={}`, _json);
        }

        if (_json && Array.isArray(_json.loginNames)) {
            return _json.loginNames;
        } 
        else {
            return null;
        }
    }

    async getByCompanyPhone(companyPhone: string): Promise<User | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getByCompanyPhone companyPhone=${companyPhone}`);
        }

        const _json = this.getResult<UserJson>(
            await this._httpClient.get(UtilUri.appendQuery(this._uri, 'companyPhone', companyPhone))
        );
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getByCompanyPhone result={}`, _json);
        }

        if (!_json) return null;
        return User.fromJson(_json);
    }

    async getPreferences(loginName: string): Promise<Preferences | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPreferences loginName=${loginName}`);
        }

        const _json = this.getResult<PreferencesJson>(
            await this._httpClient.get(UtilUri.appendPath(this._uri, loginName, 'preferences'))
        );
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPreferences result={}`, _json);
        }

        if (!_json) return null;
        return Preferences.fromJson(_json);
    }

    async getSupportedLanguages(loginName: string): Promise<SupportedLanguages | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getSupportedLanguages loginName=${loginName}`);
        }

        const _json = this.getResult<SupportedLanguagesJson>(
            await this._httpClient.get(UtilUri.appendPath(this._uri, loginName, 'preferences/supportedLanguages'))
        );
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getSupportedLanguages result={}`, _json);
        }

        if (!_json) return null;
        return SupportedLanguages.fromJson(_json);
    }

    async changePassword(loginName: string, oldPassword: string, newPassword: string): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`changePassword loginName=${loginName}`);
        }

        let json = JSON.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
        });

        let httpResponse = await this._httpClient.put(
            UtilUri.appendPath(this._uri, loginName, 'password'),
            new HttpContent(json)
        );
        return httpResponse.isSuccessStatusCode();
    }
}
