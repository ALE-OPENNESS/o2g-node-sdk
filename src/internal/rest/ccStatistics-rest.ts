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

import _default from 'uuid/dist/cjs/nil';
import { Language } from '../../types/cc-stats/language';
import { Requester } from '../../types/cc-stats/requester';
import { StatsContext } from '../../types/cc-stats/stats-context';
import { StatsFilter } from '../../types/cc-stats/stats-filter';
import { AgentFilterImpl } from '../types/cc-stat/ag-filter-impl';
import { ContextImpl } from '../types/cc-stat/context-impl';
import { PilotFilterImpl } from '../types/cc-stat/pil-filter-impl';
import { RequesterImpl } from '../types/cc-stat/requester-impl';
import { AssertUtil } from '../util/assert';
import UtilUri from '../util/util-uri';
import { RestService } from './rest-service';
import {
    AcdStatsProgressStep,
    StatsContextJson,
    StatsFilterJson,
    StatsJson,
    StatsScheduleJson,
    SupervisorJson,
} from '../types/cc-stat/cc-stat-types';
import { IHttpClient } from '../util/IHttpClient';
import { DateRange } from '../../types/common/date-range';
import { StatisticsData } from '../../types/cc-stats/data/stats-data';
import { TimeInterval } from '../../types/cc-stats/time-interval';
import { ProgressCallback } from '../../types/cc-stats/events/progress-callback';
import { StatsFormat } from '../../types/cc-stats/stats-format';
import { EventRegistry, IEventSink } from '../events/event-dispatcher';
import { EventEmitter } from 'events';
import { OnAcdStatsProgress } from '../types/cc-stat/on-stats-progress';
import { ProgressStep } from '../../types/cc-stats/events/progress-step';
import AdmZip from 'adm-zip';
import { HttpResponse } from '../util/http-response';
import * as fs from 'fs';
import { FileUtil } from '../util/file-utils';
import { HttpContent } from '../util/http-content';
import { Recurrence } from '../../types/cc-stats/scheduled/recurrence';
import { ReportObservationPeriod } from '../../types/cc-stats/scheduled/report-obs-period';
import { ScheduledReport } from '../../types/cc-stats/scheduled/scheduled-report';
import { ScheduledReportImpl } from '../types/cc-stat/scheduled-rep-impl';

/** @internal */
type SupervisedJson = {
    number: string;
};

/** @internal */
type RespIdJson = {
    id: string;
};

/** @internal */
type StatsContextsJson = {
    contexts: StatsContextJson[];
};

/** @internal */
type ScheduledReportsJson = {
    schedules: StatsScheduleJson[];
};

/**
 * Formats a Date as 'yyyy-MM-dd HH:mm' using native JS.
 * @internal
 */
function formatDateTime(date: Date): string {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}`;
}

/**
 * Formats a Date as 'yyyy-MM-dd' using native JS.
 * @internal
 */
function formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}`;
}

/**
 * Helper class to manage asynchronous statistic file requests.
 */
class StatAsyncRequest {
    private directory: string;
    private progressCallback?: ProgressCallback;

    private _resolve!: (value: string) => void;
    private _reject!: (reason?: any) => void;

    readonly promise: Promise<string>;

    constructor(directory: string, progressCallback?: ProgressCallback) {
        this.directory = directory;
        this.progressCallback = progressCallback;

        this.promise = new Promise<string>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    getDirectory(): string {
        return this.directory;
    }

    reportProgress(step: ProgressStep, nbObjects: number, processedObjects: number) {
        if (this.progressCallback) {
            const progress = nbObjects > 0 ? Math.floor((processedObjects / nbObjects) * 100) : 0;
            this.progressCallback(step, progress);
        }
    }

    complete(filePath: string) {
        this._resolve(filePath);
    }

    fail(reason?: any) {
        this._reject(reason);
    }
}

const ON_ACD_STATS_PROGRESS = 'OnAcdStatsProgress';

export default class CallCenterStatisticsRest extends RestService {
    #currentAsyncRequest: StatAsyncRequest | null = null;
    #running = false;
    #eventEmitter = new EventEmitter();

    constructor(uri: string, httpClient: IHttpClient, eventRegistry: EventRegistry) {
        super(uri, httpClient);

        eventRegistry.register(this.#eventEmitter, ON_ACD_STATS_PROGRESS, OnAcdStatsProgress);

        this.#eventEmitter.on(ON_ACD_STATS_PROGRESS, (e: OnAcdStatsProgress) => {
            this.handleAcdStatsProgress(e);
        });
    }

    private createAsyncRequest = (dir: string, cb?: ProgressCallback) => new StatAsyncRequest(dir, cb);

    private saveInDirectory(httpResponse: HttpResponse, directory: string): string | null {
        try {
            if (!httpResponse || !httpResponse.response) {
                return null;
            }

            const compressedBuffer = Buffer.from(httpResponse.response as ArrayBuffer);
            const zip = new AdmZip(compressedBuffer);
            const entries = zip.getEntries();

            if (!entries || entries.length === 0) {
                return null;
            }

            fs.mkdirSync(directory, { recursive: true });

            const firstEntry = entries[0];
            const fileName = firstEntry.entryName;
            const filePath = FileUtil.withTimestamp(directory, fileName);
            const fileData = firstEntry.getData();

            fs.writeFileSync(filePath, fileData);

            return filePath;
        } catch (error) {
            console.error('Error while saving file:', error);
            return null;
        }
    }

    private async downloadDataFile(fileUri: string, directory: string, request: StatAsyncRequest) {
        try {
            const uriGet = UtilUri.appendPath(UtilUri.getBaseUri(this._uri), fileUri);

            const filePath = this.saveInDirectory(await this._httpClient.get(uriGet, 'arrayBuffer'), directory);
            if (filePath) {
                request.complete(filePath);
            } else {
                request.fail('Unable to save data in ' + directory);
            }
        } catch (error) {
            request.fail(error);
        }
    }

    private handleAcdStatsProgress(e: OnAcdStatsProgress) {
        const step = e.step;

        if (!this.#currentAsyncRequest) {
            return;
        }

        switch (step) {
            case AcdStatsProgressStep.COLLECT:
                this.#currentAsyncRequest.reportProgress(ProgressStep.COLLECTING, e.nbTotObjects, e.nbProcessedObjects);
                break;

            case AcdStatsProgressStep.PROCESSED:
                this.#currentAsyncRequest.reportProgress(ProgressStep.PROCESSED, 1, 1);
                break;

            case AcdStatsProgressStep.FORMATED:
                this.#currentAsyncRequest.reportProgress(ProgressStep.FORMATTED, 1, 1);

                this.downloadDataFile(
                    e.fullResPath!,
                    this.#currentAsyncRequest.getDirectory(),
                    this.#currentAsyncRequest
                );

                this.#running = false;
                break;

            case AcdStatsProgressStep.CANCELLED:
                this.#currentAsyncRequest.fail(new Error('Request cancelled'));
                this.#currentAsyncRequest = null;
                this.#running = false;
                break;

            case AcdStatsProgressStep.ERROR:
                this.#currentAsyncRequest.fail(new Error('Error while getting statistics'));
                this.#currentAsyncRequest = null;
                this.#running = false;
                break;
        }
    }

    hasAsyncRequestInProgress(): boolean {
        return this.#running;
    }

    async createRequester(
        id: string,
        language: Language,
        timezone: string,
        agents: string[]
    ): Promise<Requester | null> {
        const uriPost = UtilUri.appendPath(this._uri, 'scope');

        const supervised: SupervisedJson[] = AssertUtil.notEmpty(agents, 'agents').map((agent) => ({
            number: agent,
        }));

        const supervisor: SupervisorJson = {
            identifier: id,
            language: language,
            timezone: timezone,
        };

        const statScope = {
            supervisor: supervisor,
            agents: supervised,
        };

        const json = JSON.stringify(statScope);

        const httpResponse = await this._httpClient.post(uriPost, new HttpContent(json));
        if (!httpResponse.isSuccessStatusCode()) return null;

        return new RequesterImpl(id, language, timezone);
    }

    async deleteRequester(requester: Requester): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(requester, 'requester').id)
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getRequester(id: string): Promise<Requester | null> {
        const uriGet = UtilUri.appendPath(this._uri, 'scope', encodeURIComponent(AssertUtil.notNullOrEmpty(id, 'id')));

        const _json = this.getResult<SupervisorJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;
        return new RequesterImpl(_json.identifier, _json.language, _json.timezone);
    }

    async createContext(
        requester: Requester,
        label: string,
        description: string,
        filter: StatsFilter
    ): Promise<StatsContext | null> {
        const uriPost = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(requester, 'requester').id),
            'ctx'
        );

        AssertUtil.notNull(filter, 'filter');
        let _filter: StatsFilterJson;

        if (filter instanceof AgentFilterImpl) {
            _filter = {
                agentFilter: (filter as AgentFilterImpl).toJson(),
            };
        } else {
            _filter = {
                pilotFilter: (filter as PilotFilterImpl).toJson(),
            };
        }

        const json = JSON.stringify({
            supervisorId: requester.id,
            description: description,
            label: label,
            filter: _filter,
        });

        const _json = this.getResult<RespIdJson>(await this._httpClient.post(uriPost, new HttpContent(json)));
        if (!_json) return null;

        let _context: ContextImpl = new ContextImpl(_json.id, requester.id);
        _context.description = description;
        _context.label = label;
        _context.filter = filter;

        return _context;
    }

    async getContexts(requester: Requester): Promise<StatsContext[] | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(requester, 'requester').id),
            'ctx'
        );

        const _json = this.getResult<StatsContextsJson>(await this._httpClient.get(uriGet));
        if (_json && Array.isArray(_json.contexts)) {
            return _json.contexts.map(ContextImpl.fromJson);
        } else {
            return null;
        }
    }

    async deleteContexts(requester: Requester): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(requester, 'requester').id),
            'ctx'
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getContext(requester: Requester, contextId: string): Promise<StatsContext | null> {
        const uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(requester, 'requester').id),
            'ctx',
            AssertUtil.notNullOrEmpty(contextId, 'contextId')
        );

        const _json = this.getResult<StatsContextJson>(await this._httpClient.get(uriGet));
        if (!_json) {
            return null;
        }

        return ContextImpl.fromJson(_json);
    }

    async deleteContext(context: StatsContext): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(context, 'context').requesterId),
            'ctx',
            AssertUtil.notNull(context, 'context').id
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async getDaysData(context: StatsContext, range: DateRange): Promise<StatisticsData | null> {
        AssertUtil.notNull(context, 'context');
        AssertUtil.notNull(range, 'range');

        let uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'days/data'
        );

        uriGet = UtilUri.appendQuery(uriGet, 'begindate', formatDateTime(range.from));
        uriGet = UtilUri.appendQuery(uriGet, 'enddate', formatDateTime(range.to));
        uriGet = UtilUri.appendQuery(uriGet, 'format', 'json');

        const _json = this.getResult<StatsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;

        return StatisticsData.fromJson(_json);
    }

    async getDayData(context: StatsContext, date?: Date, timeInterval?: TimeInterval): Promise<StatisticsData | null> {
        let uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'oneday/data'
        );

        if (!date) date = new Date();

        uriGet = UtilUri.appendQuery(uriGet, 'date', formatDate(date));
        if (timeInterval) {
            uriGet = UtilUri.appendQuery(uriGet, 'slotType', timeInterval);
        }
        uriGet = UtilUri.appendQuery(uriGet, 'format', 'json');

        const _json = this.getResult<StatsJson>(await this._httpClient.get(uriGet));
        if (!_json) return null;

        return StatisticsData.fromJson(_json);
    }

    async getDayFileData(
        context: StatsContext,
        date: Date,
        timeInterval: TimeInterval,
        statFormat: StatsFormat,
        directory: string,
        progressCallback?: ProgressCallback
    ): Promise<string> {
        if (this.#running) {
            throw new Error('A statistic request is already in progress');
        }

        this.#running = true;
        this.#currentAsyncRequest = this.createAsyncRequest(
            AssertUtil.notNull(directory, 'directory'),
            progressCallback
        );

        let uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'oneday/data'
        );

        uriGet = UtilUri.appendQuery(uriGet, 'date', formatDate(AssertUtil.notNull(date, 'date')));
        if (timeInterval) {
            uriGet = UtilUri.appendQuery(uriGet, 'slotType', timeInterval);
        }
        if (statFormat == StatsFormat.CSV) {
            uriGet = UtilUri.appendQuery(uriGet, 'format', 'csv');
        } else if (statFormat == StatsFormat.EXCEL) {
            uriGet = UtilUri.appendQuery(uriGet, 'format', 'xls');
        }
        uriGet = UtilUri.appendQuery(uriGet, 'async', 'true');

        const httpResponse = await this._httpClient.get(uriGet);

        const promise = this.#currentAsyncRequest.promise;

        if (!httpResponse.isSuccessStatusCode()) {
            this.#currentAsyncRequest.fail(new Error('Error while getting statistics'));
        }

        return promise;
    }

    async getDaysFileData(
        context: StatsContext,
        range: DateRange,
        statFormat: StatsFormat,
        directory: string,
        progressCallback?: ProgressCallback
    ): Promise<string> {
        AssertUtil.notNull(context, 'context');
        AssertUtil.notNull(range, 'range');

        if (this.#running) {
            throw new Error('A statistic request is already in progress');
        }

        this.#running = true;
        this.#currentAsyncRequest = this.createAsyncRequest(
            AssertUtil.notNull(directory, 'directory'),
            progressCallback
        );

        let uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'days/data'
        );

        uriGet = UtilUri.appendQuery(uriGet, 'begindate', formatDateTime(range.from));
        uriGet = UtilUri.appendQuery(uriGet, 'enddate', formatDateTime(range.to));

        if (statFormat == StatsFormat.CSV) {
            uriGet = UtilUri.appendQuery(uriGet, 'format', 'csv');
        } else if (statFormat == StatsFormat.EXCEL) {
            uriGet = UtilUri.appendQuery(uriGet, 'format', 'xls');
        }
        uriGet = UtilUri.appendQuery(uriGet, 'async', 'true');

        const httpResponse = await this._httpClient.get(uriGet);

        const promise = this.#currentAsyncRequest.promise;

        if (!httpResponse.isSuccessStatusCode()) {
            this.#currentAsyncRequest.fail(new Error('Error while getting statistics'));
        }

        return promise;
    }

    async cancelRequest(context: StatsContext): Promise<boolean> {
        const uriDelete = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(AssertUtil.notNull(context, 'context').requesterId),
            'data/request'
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async createRecurrentScheduledReport(
        context: StatsContext,
        id: string,
        description: string,
        observationPeriod: ReportObservationPeriod,
        recurrence: Recurrence,
        format: StatsFormat,
        recipients: string[]
    ): Promise<ScheduledReport | null> {
        AssertUtil.notNull(context, 'context');

        const uriPost = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule'
        );

        if (recipients == null || recipients.length < 1) {
            throw new Error("'recipients' must be not null and not empty");
        }

        const json = JSON.stringify({
            name: AssertUtil.notNullOrEmpty(id, 'id'),
            description: description,
            obsPeriod: AssertUtil.notNull(observationPeriod, 'observationPeriod').toJson(),
            frequency: AssertUtil.notNull(recurrence, 'recurrence').toJson(),
            recipients: recipients,
            fileType: format,
        });

        const _json = this.getResult<RespIdJson>(await this._httpClient.post(uriPost, new HttpContent(json)));
        if (!_json) return null;

        return new ScheduledReportImpl(
            context,
            _json.id,
            description,
            observationPeriod,
            recurrence,
            format,
            recipients
        );
    }

    async createOneTimeScheduledReport(
        context: StatsContext,
        id: string,
        description: string,
        observationPeriod: ReportObservationPeriod,
        format: StatsFormat,
        recipients: string[]
    ): Promise<ScheduledReport | null> {
        AssertUtil.notNull(context, 'context');

        const uriPost = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule'
        );

        if (recipients == null || recipients.length < 1) {
            throw new Error("'recipients' must be not null and not empty");
        }

        const json = JSON.stringify({
            name: AssertUtil.notNullOrEmpty(id, 'id'),
            description: description,
            obsPeriod: AssertUtil.notNull(observationPeriod, 'observationPeriod').toJson(),
            frequency: {
                periodicity: 'once',
            },
            recipients: recipients,
            fileType: format,
        });

        const _json = this.getResult<RespIdJson>(await this._httpClient.post(uriPost, new HttpContent(json)));
        if (!_json) return null;

        return new ScheduledReportImpl(context, _json.id, description, observationPeriod, null, format, recipients);
    }

    async getScheduledReports(context: StatsContext): Promise<ScheduledReport[] | null> {
        AssertUtil.notNull(context, 'context');

        const uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule'
        );

        const _json = this.getResult<ScheduledReportsJson>(await this._httpClient.get(uriGet));
        if (_json && Array.isArray(_json.schedules)) {
            return _json.schedules.map((json) => {
                const report = ScheduledReportImpl.fromJson(json);
                report.context = context;
                return report;
            });
        } else {
            return null;
        }
    }

    async deleteScheduledReport(report: ScheduledReport): Promise<boolean> {
        const context = AssertUtil.notNull(report, 'report').context;

        const uriDelete = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule',
            encodeURIComponent(report.id)
        );

        const httpResponse = await this._httpClient.delete(uriDelete);
        return httpResponse.isSuccessStatusCode();
    }

    async setScheduledReportEnabled(report: ScheduledReport, enabled: boolean): Promise<boolean> {
        const context = AssertUtil.notNull(report, 'report').context;

        let uriPost = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule',
            encodeURIComponent(report.id),
            'enable'
        );

        uriPost = UtilUri.appendQuery(uriPost, 'enable', enabled ? 'true' : 'false');

        const httpResponse = await this._httpClient.post(uriPost);

        console.log('VALUEOF' + httpResponse);
        return httpResponse.isSuccessStatusCode();
    }

    async getScheduledReport(context: StatsContext, scheduleReportId: string): Promise<ScheduledReport | null> {
        AssertUtil.notNull(context, 'context');

        const uriGet = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule',
            encodeURIComponent(AssertUtil.notNullOrEmpty(scheduleReportId, 'scheduleReportId'))
        );

        const _json = this.getResult<StatsScheduleJson>(await this._httpClient.get(uriGet));
        if (!_json) {
            return null;
        }

        const report = ScheduledReportImpl.fromJson(_json);
        report.context = context;

        return report;
    }

    async updateScheduledReport(report: ScheduledReport): Promise<boolean> {
        const context = AssertUtil.notNull(report, 'report').context;

        let uriPut = UtilUri.appendPath(
            this._uri,
            'scope',
            encodeURIComponent(context.requesterId),
            'ctx',
            context.id,
            'schedule',
            encodeURIComponent(report.id)
        );

        const recipients = report.recipients;
        if (recipients == null || recipients.length < 1) {
            throw new Error("'recipients' must be not null and not empty");
        }

        const json = JSON.stringify({
            name: report.id,
            description: report.description,
            obsPeriod: report.observationPeriod.toJson(),
            frequency: report.recurrence?.toJson() ?? { periodicity: 'once' },
            recipients: recipients,
            fileType: report.format,
        });

        const httpResponse = await this._httpClient.put(uriPut, new HttpContent(json));
        return httpResponse.isSuccessStatusCode();
    }
}