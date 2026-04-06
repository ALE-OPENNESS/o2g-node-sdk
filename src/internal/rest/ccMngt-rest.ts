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

import { Calendar } from '../../types/cc-mngt/calendar/calendar';
import { DayOfWeek } from '../../types/common/day-of-week';
import { ExceptionCalendar } from '../../types/cc-mngt/calendar/exception-calendar';
import { NormalCalendar } from '../../types/cc-mngt/calendar/normal-calendar';
import { Transition } from '../../types/cc-mngt/calendar/transition';
import { Pilot } from '../../types/cc-mngt/pilot';
import { PilotJson, CalendarJson, ExceptionCalendarJson, NormalCalendarJson } from '../types/cc-mngt/cc-mntg-types';
import { AssertUtil } from '../util/assert';
import { IHttpClient } from '../util/IHttpClient';
import { HttpContent } from '../util/http-content';
import UtilUri from '../util/util-uri';
import { RestService } from './rest-service';
import { PilotTransferQueryParameters } from '../../types/telephony/call/ccd/pilot-transfer-query-param';
import { Logger } from '../util/logger';
import { LogLevel } from '../../log-level';

/** @internal */
type PilotListJson = {
    pilotList: PilotJson[];
};

/** @internal */
function formatCalendarDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

/** @internal */
export default class CallCenterManagementRest extends RestService {
    #logger = Logger.create('CallCenterManagementRest');

    constructor(uri: string, httpClient: IHttpClient) {
        super(uri, httpClient);
    }

    async getPilots(nodeId: number): Promise<Pilot[] | null> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPilots nodeId=${nodeId}`);
        }

        const uriGet = UtilUri.appendPath(this._uri, AssertUtil.positive(nodeId, 'nodeId').toString(), 'pilots');

        const _json = this.getResult<PilotListJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPilots result={}`, _json);
        }

        if (_json && Array.isArray(_json.pilotList)) {
            return _json.pilotList.map(Pilot.fromJson);
        } 
        else {
            return null;
        }
    }

    async getPilot(nodeId: number, pilotNumber: string): Promise<Pilot | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPilot nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber')
        );

        const _json = this.getResult<PilotJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPilot result={}`, _json);
        }

        if (!_json) return null;
        return Pilot.fromJson(_json);
    }

    async getPilotAdvanced(
        nodeId: number,
        pilotNumber: string,
        pilotTransferQueryParam: PilotTransferQueryParameters
    ): Promise<Pilot | null> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getPilotAdvanced nodeId={}, pilotNumber={}, pilotTransferQueryParam={}`, nodeId, pilotNumber, pilotTransferQueryParam);
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber')
        );

        const req = JSON.stringify(pilotTransferQueryParam.toJson());
        const _json = this.getResult<PilotJson>(await this._httpClient.post(uriPost, new HttpContent(req)));

        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getPilotAdvanced result={}`, _json);
        }

        if (!_json) return null;
        return Pilot.fromJson(_json);
    }

    async getCalendar(nodeId: number, pilotNumber: string): Promise<Calendar | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getCalendar nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar'
        );

        const _json = this.getResult<CalendarJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getCalendar result={}`, _json);
        }

        if (!_json) return null;
        return Calendar.fromJson(_json);
    }

    async getExceptionCalendar(nodeId: number, pilotNumber: string): Promise<ExceptionCalendar | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getExceptionCalendar nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/exception'
        );

        const _json = this.getResult<ExceptionCalendarJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getExceptionCalendar result={}`, _json);
        }

        if (!_json) return null;
        return ExceptionCalendar.fromJson(_json);
    }

    async addExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        transition: Transition
    ): Promise<boolean> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`addExceptionTransition nodeId={}, pilotNumber={}, dateTransition={}, transition={}`, nodeId, pilotNumber, dateTransition, transition);
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/exception',
            formatCalendarDate(AssertUtil.notNull(dateTransition, 'dateTransition'))
        );

        const json = JSON.stringify(transition.toJson());
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`addExceptionTransition request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        transitionIndex: number
    ): Promise<boolean> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deleteExceptionTransition nodeId={}, pilotNumber={}, dateTransition={}, transitionIndex={}`, nodeId, pilotNumber, dateTransition, transitionIndex);
        }

        const uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/exception',
            formatCalendarDate(AssertUtil.notNull(dateTransition, 'dateTransition')),
            'transitions',
            (AssertUtil.positive(transitionIndex, 'transitionIndex') + 1).toString()
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async setExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        transitionIndex: number,
        transition: Transition
    ): Promise<boolean> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`setExceptionTransition nodeId={}, pilotNumber={}, dateTransition={}, transitionIndex={}, transition={}`,
                nodeId, pilotNumber, dateTransition, transitionIndex, transition);
        }

        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/exception',
            formatCalendarDate(AssertUtil.notNull(dateTransition, 'dateTransition')),
            'transitions',
            (AssertUtil.positive(transitionIndex, 'transitionIndex') + 1).toString()
        );

        const json = JSON.stringify(transition.toJson());
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`setExceptionTransition request=${json}`);
        }

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async getNormalCalendar(nodeId: number, pilotNumber: string): Promise<NormalCalendar | null> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`getNormalCalendar nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriGet = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/normal'
        );

        const _json = this.getResult<NormalCalendarJson>(await this._httpClient.get(uriGet));
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`getNormalCalendar result={}`, _json);
        }

        if (!_json) return null;
        return NormalCalendar.fromJson(_json);
    }

    async addNormalTransition(
        nodeId: number,
        pilotNumber: string,
        day: DayOfWeek,
        transition: Transition
    ): Promise<boolean> {
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`addNormalTransition nodeId={}, pilotNumber={}, day={}, transition={}`, nodeId, pilotNumber, day, transition);
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/normal',
            DayOfWeek.toJson(day)
        );

        const json = JSON.stringify(transition.toJson());
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`addNormalTransition request=${json}`);
        }

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async deleteNormalTransition(
        nodeId: number,
        pilotNumber: string,
        day: DayOfWeek,
        transitionIndex: number
    ): Promise<boolean> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`deleteNormalTransition nodeId={}, pilotNumber={}, day={}, transitionIndex={}`, nodeId, pilotNumber, day, transitionIndex);
        }

        const uriDelete = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/normal',
            DayOfWeek.toJson(day),
            'transitions',
            (AssertUtil.positive(transitionIndex, 'transitionIndex') + 1).toString()
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async setNormalTransition(
        nodeId: number,
        pilotNumber: string,
        day: DayOfWeek,
        transitionIndex: number,
        transition: Transition
    ): Promise<boolean> {
        
        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`setNormalTransition nodeId={}, pilotNumber={}, day={}, transitionIndex={}, transition={}`, 
                nodeId, pilotNumber, day, transitionIndex, transition);
        }

        const uriPut = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'calendar/normal',
            DayOfWeek.toJson(day),
            'transitions',
            (AssertUtil.positive(transitionIndex, 'transitionIndex') + 1).toString()
        );

        const json = JSON.stringify(transition.toJson());
        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`setNormalTransition request=${json}`);
        }

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }

    async openPilot(nodeId: number, pilotNumber: string): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`openPilot nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'open'
        );

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }

    async closePilot(nodeId: number, pilotNumber: string): Promise<boolean> {

        if (this.#logger.isLevelEnabled(LogLevel.INFO)) { 
            this.#logger.info(`closePilot nodeId=${nodeId}, pilotNumber=${pilotNumber}`);
        }

        const uriPost = UtilUri.appendPath(
            this._uri,
            AssertUtil.positive(nodeId, 'nodeId').toString(),
            'pilots',
            AssertUtil.notNullOrEmpty(pilotNumber, 'pilotNumber'),
            'close'
        );

        const httpResponse = await this._httpClient.post(uriPost);
        return httpResponse.isSuccessStatusCode();
    }
}
