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
import { IntrusionMode } from '../../types/cc-agent/intrusion-mode';
import { AgentConfigJson, OperatorStateJson, WithdrawReasonJson } from '../types/cc-agent/cc-agent-types';
import { OperatorConfig } from '../../types/cc-agent/operator-config';
import { OperatorState } from '../../types/cc-agent/operator-state';
import { WithdrawReason } from '../../types/cc-agent/withdraw-reason';
import { IHttpClient } from '../util/IHttpClient';
import { Logger, LogLevel } from '../util/logger';

/** @internal */
type WithdrawReasonsJson = {
    reasons: WithdrawReasonJson[];
};

/** @internal */
export default class CallCenterAgentRest extends RestService {
    #logger = Logger.create('CallCenterAgentRest');
    
    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getConfiguration(loginName: string | null): Promise<OperatorConfig | null> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getConfiguration loginName=${loginName}`);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'config');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<AgentConfigJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getConfiguration result=${_json}`);
        }

        if (!_json) return null;
        return OperatorConfig.fromJson(_json);
    }

    async getState(loginName: string | null): Promise<OperatorState | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getState loginName=${loginName}`);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'state');
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const _json = this.getResult<OperatorStateJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getState result=${_json}`);
        }

        if (!_json) return null;
        return OperatorState.fromJson(_json);
    }

    async logon(
        proAcdNumber: string,
        pgNumber: string | null,
        headset: boolean,
        loginName: string | null
    ): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`logon proAcdNumber=${proAcdNumber}, pgNumber=${pgNumber}, headset=${headset}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'logon');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req: any = new Object();
        req.proAcdDeviceNumber = AssertUtil.notNullOrEmpty(proAcdNumber, 'proAcdNumber');
        if (pgNumber) {
            req.pgGroupNumber = pgNumber;
        }
        if (headset) {
            req.headset = true;
        }
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`logon request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async logoff(loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`logoff loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'logoff');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async enter(pgNumber: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`enter pgNumber=${pgNumber}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'enter');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        let req = {
            pgGroupNumber: AssertUtil.notNullOrEmpty(pgNumber, 'pgNumber'),
        };
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`enter request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async exit(loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`exit loginName=${loginName}`);
        }

        // First get the operator state to get the processing group
        const state = await this.getState(loginName);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`exit: getState return: {}`, state);
        }

        if (state && state.pgNumber) {
            let uriPost = UtilUri.appendPath(this._uri, 'exit');
            if (loginName) {
                uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
            }

            const json = JSON.stringify({
                pgGroupNumber: state.pgNumber,
            });
            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                this.#logger.debug(`exit request=${json}`);
            }

            const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
            return httpResponse.isSuccessStatusCode();
        } 
        else {
            return false;
        }
    }

    private async _doAgentAction(action: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`_doAgentAction action=${action}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, action);
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async setWrapup(loginName: string | null): Promise<boolean> {
        return this._doAgentAction('wrapUp', loginName);
    }

    async setReady(loginName: string | null): Promise<boolean> {
        return await this._doAgentAction('ready', loginName);
    }

    async setPause(loginName: string | null): Promise<boolean> {
        return await this._doAgentAction('pause', loginName);
    }

    async requestPermanentListening(agentNumber: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`requestPermanentListening agentNumber=${agentNumber}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'permanentListening');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const req = {
            agentNumber: AssertUtil.notNullOrEmpty(agentNumber, 'agentNumber'),
        };
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`requestPermanentListening request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async cancelPermanentListening(loginName: string | null = null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`cancelPermanentListening loginName=${loginName}`);
        }

        let uriDelete = UtilUri.appendPath(this._uri, 'permanentListening');
        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async requestIntrusion(
        agentNumber: string,
        intrusionMode: IntrusionMode,
        loginName: string | null
    ): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`requestIntrusion agentNumber=${agentNumber}, intrusionMode=${intrusionMode}, loginName=${loginName}`);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'intrusion');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const req = {
            agentNumber: AssertUtil.notNullOrEmpty(agentNumber, 'agentNumber'),
            mode: intrusionMode,
        };
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`requestIntrusion request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async changeIntrusionMode(newIntrusionMode: IntrusionMode, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`changeIntrusionMode newIntrusionMode=${newIntrusionMode}, loginName=${loginName}`);
        }

        let uriPut = UtilUri.appendPath(this._uri, 'intrusion');
        if (loginName) {
            uriPut = UtilUri.appendQuery(uriPut, 'loginName', loginName);
        }

        const req = {
            mode: newIntrusionMode,
        };
        const json = JSON.stringify(req);
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`changeIntrusionMode request=${json}`);
        }

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async requestSupervisorHelp(loginName: string | null): Promise<boolean> {
        return await this._doAgentAction('supervisorHelp', loginName);
    }

    private async _doCancelSupervisorHelpRequest(otherNumber: string, loginName: string | null): Promise<boolean> {
        let uriDelete = UtilUri.appendPath(this._uri, 'supervisorHelp');
        uriDelete = UtilUri.appendQuery(uriDelete, 'other', otherNumber);

        if (loginName) {
            uriDelete = UtilUri.appendQuery(uriDelete, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async rejectAgentHelpRequest(agentNumber: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`rejectAgentHelpRequest agentNumber=${agentNumber}, loginName=${loginName}`);
        }

        return this._doCancelSupervisorHelpRequest(AssertUtil.notNullOrEmpty(agentNumber, 'agentNumber'), loginName);
    }

    async cancelSupervisorHelpRequest(supervisorNumber: string, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`cancelSupervisorHelpRequest supervisorNumber=${supervisorNumber}, loginName=${loginName}`);
        }

        return this._doCancelSupervisorHelpRequest(
            AssertUtil.notNullOrEmpty(supervisorNumber, 'supervisorNumber'),
            loginName
        );
    }

    async requestSnapshot(loginName: string | null): Promise<boolean> {
        let uriPost = UtilUri.appendPath(this._uri, 'state/snapshot');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async activateSkills(skillNumbers: number[], loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`activateSkills skillNumbers={}, loginName={}`, skillNumbers, loginName);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'config/skills/activate');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const json = JSON.stringify({
            skills: skillNumbers,
        });
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`activateSkills request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deactivateSkills(skillNumbers: number[], loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deactivateSkills skillNumbers={}, loginName={}`, skillNumbers, loginName);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'config/skills/deactivate');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const json = JSON.stringify({
            skills: skillNumbers,
        });
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`deactivateSkills request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getWithdrawReasons(pgNumber: string, loginName: string | null): Promise<WithdrawReason[] | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getWithdrawReasons pgNumber=${pgNumber}, loginName=${loginName}`);
        }

        let uriGet = UtilUri.appendPath(this._uri, 'withdrawReasons');
        uriGet = UtilUri.appendQuery(uriGet, 'pgNumber', AssertUtil.notNullOrEmpty(pgNumber, 'pgNumber'));
        if (loginName) {
            uriGet = UtilUri.appendQuery(uriGet, 'loginName', loginName);
        }

        const json = this.getResult<WithdrawReasonsJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getWithdrawReasons result={}`, json);
        }

        if (json && Array.isArray(json.reasons)) {
            return (json.reasons ?? []).map(WithdrawReason.fromJson);
        } 
        else {
            return null;
        }
    }

    async setWithdraw(reason: WithdrawReason, loginName: string | null): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`setWithdraw reason={}, loginName={}`, reason, loginName);
        }

        let uriPost = UtilUri.appendPath(this._uri, 'withdraw');
        if (loginName) {
            uriPost = UtilUri.appendQuery(uriPost, 'loginName', loginName);
        }

        const json = JSON.stringify({
            reasonIndex: AssertUtil.notNull(reason, 'reason').index,
        });
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`setWithdraw request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }
}
