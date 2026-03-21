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
import { Logger, LogLevel } from '../util/logger';
import { MailBox } from '../../types/messaging/mailbox';
import { MailBoxInfoJson, MailBoxJson, VoiceMessageJson } from '../types/messaging/messaging-types';
import { MailBoxInfo } from '../../types/messaging/mailbox-info';
import { VoiceMessage } from '../../types/messaging/voice-message';
import { IHttpClient } from '../util/IHttpClient';

/** @internal */
type MailBoxesJson = {
    mailboxes: MailBoxJson[];
};

/** @internal */
type VoicemailsListJson = {
    voicemails: VoiceMessageJson[];
};

/** @internal */
export default class MessagingRest extends RestService {
    #logger = Logger.create('MessagingRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getMailboxes(loginName: string | null): Promise<MailBox[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getMailboxes loginName=${loginName}`);
        }

        let uriGet = this._uri;
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const json = this.getResult<MailBoxesJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getMailboxes result={}`, json);
        }

        if (json && Array.isArray(json.mailboxes)) {
            return json.mailboxes.map(MailBox.fromJson);
        } 
        else {
            return null;
        }
    }

    async getMailboxInfo(
        mailboxId: string,
        password: string | null,
        loginName: string | null
    ): Promise<MailBoxInfo | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getMailboxInfo mailboxId=${mailboxId}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'));
        if (loginName != null) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        if (password) {
            var json = JSON.stringify({
                password: password,
            });

            const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
            const _json = this.getResult<MailBoxInfoJson>(httpResponse);
            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                this.#logger.debug(`getMailboxInfo result={}`, _json);
            }

            if (!_json) return null;
            return MailBoxInfo.fromJson(_json);
        } 
        else {
            uriPost = UtilUri.appendQuery(uriPost, 'withUserPwd');

            const httpResponse = await this._httpClient.post(uriPost);
            const _json = this.getResult<MailBoxInfoJson>(httpResponse);
            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                this.#logger.debug(`getMailboxInfo result={}`, _json);
            }

            if (!_json) return null;
            return MailBoxInfo.fromJson(_json);
        }
    }

    async getVoiceMessages(
        mailboxId: string,
        newOnly: boolean,
        offset: number | null,
        limit: number | null,
        loginName: string | null
    ): Promise<VoiceMessage[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getVoiceMessages mailboxId={}, newOnly={}, offet={}, limit={}, loginName={}`, mailboxId, newOnly, offset, limit, loginName);
        }

        let uriGet = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'), 'voicemails');
        if (loginName != null) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        if (newOnly) {
            uriGet = UtilUri.appendQuery(uriGet, 'newOnly', 'true');
        }
        if (offset) {
            uriGet = UtilUri.appendQuery(uriGet, 'offset', offset.toString());
        }
        if (limit) {
            uriGet = UtilUri.appendQuery(uriGet, 'limit', limit.toString());
        }

        const json = this.getResult<VoicemailsListJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getVoiceMessages result={}`, json);
        }

        if (json && Array.isArray(json.voicemails)) {
            return json.voicemails.map(VoiceMessage.fromJson);
        } 
        else {
            this.#logger.error(`Error in getVoiceMessages`);
            return null;
        }
    }

    async downloadVoiceMessage(
        mailboxId: string,
        voicemailId: string,
        wavPath: string | null,
        loginName: string | null
    ): Promise<string | null> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`downloadVoiceMessage mailboxId={}, voicemailId={}, wavPath={}, loginName={}`, mailboxId, voicemailId, wavPath, loginName);
        }

        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'),
            'voicemails',
            AssertUtil.notNullOrEmpty(voicemailId, 'voicemailId')
        );


        if (loginName != null) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        // Get the file as an array buffer
        const httpResponse = await this._httpClient.get(uriGet, 'arrayBuffer');
        return await this.downloadFile(httpResponse, wavPath, 'wav');
    }

    async acknowledgeVoiceMessage(mailboxId: string, voicemailId: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`acknowledgeVoiceMessage mailboxId=${mailboxId}, voicemailId=${voicemailId}, loginName=${loginName}`);
        }
        
        let uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'),
            'voicemails',
            AssertUtil.notNullOrEmpty(voicemailId, 'voicemailId')
        );

        if (loginName != null) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        let additionalHeaders: Record<string, string> = {};
        additionalHeaders['Range'] = 'bytes=0-1';

        // Get the file as an array buffer
        const httpResponse = await this._httpClient.get(uriGet, 'arrayBuffer', additionalHeaders);
        return httpResponse.isSuccessStatusCode();
    }

    async deleteVoiceMessages(mailboxId: string, msgIds: string[], loginName: string | null = null): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`acknowledgeVoiceMessage mailboxId={}, msgIds={}, loginName={}`, mailboxId, msgIds, loginName);
        }
        
        let uriDelete = UtilUri.appendPath(this._uri, AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'), 'voicemails');

        if (loginName != null) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        if (msgIds) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'msgIds', msgIds.join(';'));
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async deleteVoiceMessage(
        mailboxId: string,
        voicemailId: string,
        loginName: string | null = null
    ): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deleteVoiceMessage mailboxId=${mailboxId}, voicemailId=${voicemailId}, loginName=${loginName}`);
        }
        
        let uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.notNullOrEmpty(mailboxId, 'mailboxId'),
            'voicemails',
            AssertUtil.notNullOrEmpty(voicemailId, 'voicemailId')
        );

        if (loginName != null) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }
}
