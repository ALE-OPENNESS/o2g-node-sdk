/*
 * Copyright 2022 ALE International
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

import { Logger } from './util/logger';
import { AssertUtil } from './util/assert';
import { O2GAuthenticateResult, ServerInfo, SessionInfo } from './types/common/common-types';
import { ServiceFactory } from './service-factory';
import { Session } from './session';
import { SupervisedAccount } from '../supervised-account';
import SessionsRest from './rest/sessions-rest';

/** @internal */
export class ServiceEndPoint {
    #serviceFactory: ServiceFactory;
    #serverInfo: ServerInfo;

    #logger = Logger.create('ServiceEndPoint');

    constructor(serviceFactory: ServiceFactory, serverInfo: ServerInfo) {
        this.#serviceFactory = serviceFactory;
        this.#serverInfo = serverInfo;
    }

    async openSession(
        login: string,
        password: string,
        applicationName: string,
        supervisedAccount: SupervisedAccount | null
    ): Promise<Session> {
        AssertUtil.notNullOrEmpty(login, 'login');
        AssertUtil.notNullOrEmpty(password, 'password');
        AssertUtil.notNullOrEmpty(applicationName, 'applicationName');

        this.#logger.debug(`OpenSession -> Authenticate user ${login}`);

        const authenticationService = this.#serviceFactory.getAuthenticationService();
        const authenticationResult: O2GAuthenticateResult = await authenticationService.authenticate(login, password);

        this.#logger.info('Authentication done.');

        this.#serviceFactory.setSessionUris(authenticationResult.internalUrl, authenticationResult.publicUrl);

        this.#logger.debug('OpenSession -> OpenSession {application}', applicationName);

        const sessionsService: SessionsRest = this.#serviceFactory.getSessionsService();
        const sessionInfo: SessionInfo | null = await sessionsService.open(applicationName, supervisedAccount);
        if (sessionInfo) {
            this.#logger.debug('Session opened: TimeToLive = {timeToLive}', sessionInfo.timeToLive);
            this.#serviceFactory.setServices(sessionInfo);
            return new Session(this.#serviceFactory, sessionInfo, login);
        } 
        else {
            await sessionsService.close();
            throw new Error('Unable to open session');
        }
    }
}
