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

import { EventRegistry } from "../../src/internal/events/event-dispatcher";
import CallCenterStatisticsRest from "../../src/internal/rest/ccStatistics-rest";
import { AgentFilterImpl } from "../../src/internal/types/cc-stat/ag-filter-impl";
import { ContextImpl } from "../../src/internal/types/cc-stat/context-impl";
import { PilotFilterImpl } from "../../src/internal/types/cc-stat/pil-filter-impl";
import { RequesterImpl } from "../../src/internal/types/cc-stat/requester-impl";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { StatsAgentByPilotAttributes } from "../../src/types/cc-stats/agbypilot-attributes";
import { StatsAgentAttributes } from "../../src/types/cc-stats/agent-attributes";
import { AgentFilter } from "../../src/types/cc-stats/agent-filter";
import { StatisticsData } from "../../src/types/cc-stats/data/stats-data";
import { Language } from "../../src/types/cc-stats/language";
import { StatsPilotAttributes } from "../../src/types/cc-stats/pilot-attributes";
import { PilotFilter } from "../../src/types/cc-stats/pilot-filter";
import { Requester } from "../../src/types/cc-stats/requester";
import { StatsFormat } from "../../src/types/cc-stats/stats-format";
import { StatsContext } from "../../src/types/cc-stats/stats-context";
import { StatsFilter } from "../../src/types/cc-stats/stats-filter";
import { TimeInterval } from "../../src/types/cc-stats/time-interval";
import { DateRange } from "../../src/types/common/date-range";
import os from "os";
import { ScheduledReport } from "../../src/types/cc-stats/scheduled/scheduled-report";
import { ReportObservationPeriod } from "../../src/types/cc-stats/scheduled/report-obs-period";
import { Recurrence } from "../../src/types/cc-stats/scheduled/recurrence";
import { DayOfWeek } from "../../src/o2g-node-sdk";
import { ScheduledReportImpl } from "../../src/internal/types/cc-stat/scheduled-rep-impl";


describe("CallCenterStatisticsRest", () => {

    const statDataJson = {
        supervisor: "john doe",
        agentsStats: [
            {
                timeSlot: "2026-02-25T00:00",
                selectedPeriod: {
                    "periodType": "oneDay",
                    "slotType": "aQuarterOfAnHour",
                    "beginDate": "2026-02-21T00:00",
                    "endDate": "2026-02-21T15:00"
                },
                rows: [
                    {
                        date: "2026-02-21", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                        nbRotating: 3,
                        nbPickedUp: 7
                    },
                    {
                        date: "2026-02-22", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                        nbRotating: 3,
                        nbPickedUp: 7
                    }
                ]
            },
            {
                timeSlot: "2026-02-25T15:00",
                selectedPeriod: {
                    "periodType": "oneDay",
                    "slotType": "aQuarterOfAnHour",
                    "beginDate": "2026-02-25T00:00",
                    "endDate": "2026-02-25T15:00"
                },
                rows: [
                    {
                        date: "2026-02-21", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                        nbRotating: 8,
                        nbPickedUp: 2
                    },
                    {
                        date: "2026-02-22", login: "agent123", operator: "Op1", firstName: "John", lastName: "Doe", number: "1001", group: "Support",
                        nbRotating: 9,
                        nbPickedUp: 3
                    }
                ]
            }
        ]

    } as any;

    let mockHttpClient: jest.Mocked<IHttpClient>;
    let mockEventRegistry: jest.Mocked<EventRegistry>;
    let service: CallCenterStatisticsRest;

    beforeEach(() => {
        // Create a fresh mock for each test
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };

        mockEventRegistry = {
            register: jest.fn(),
        };

        service = new CallCenterStatisticsRest("/ccstate", mockHttpClient, mockEventRegistry);
    });

    it("should create a Requester when createRequester is called", async () => {
        // Arrange: mock the HTTP response
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const requester: Requester | null = await service.createRequester("john doe", Language.EN, "+02", ["1000", "1001", "1002"]);

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalledTimes(1);

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/ccstate/scope");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            supervisor: {
                identifier: "john doe",
                language: "EN",
                timezone: "+02"
            },
            agents: [{ number: "1000" }, { number: "1001" }, { number: "1002" }]
        });

        expect(requester).not.toBeNull();
        expect(requester?.id).toBe("john doe");
        expect(requester?.language).toBe(Language.EN);
        expect(requester?.timezone).toBe("+02");
    });

    it("should call delete when deleted a requester", async () => {
        // Arrange: mock the HTTP response
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const result: boolean = await service.deleteRequester(new RequesterImpl("john doe", Language.FR, "+03"));

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccstate/scope/john%20doe");

        // Analyse call
        expect(result).toBeTruthy();
    });

    it("should call get when quering a requester", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                identifier: "john doe",
                language: "FR",
                timezone: "-01"
            })
        );

        // Act
        const requester: Requester | null = await service.getRequester("john doe");

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe");

        // Analyse call
        expect(requester).not.toBeNull();
        expect(requester?.id).toBe("john doe");
        expect(requester?.language).toBe(Language.FR);
        expect(requester?.timezone).toBe("-01");
    });

    it("should create a context", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, {
                id: "123"
            })
        );

        // Act
        const requester = new RequesterImpl("john doe", Language.FR, "+03");

        const filter: AgentFilter = StatsFilter.createAgentFilter();
        filter.addNumbers("2000", "2001", "2002");
        filter.setAgentAttributes(StatsAgentAttributes.acdWorkTDur, StatsAgentAttributes.nbExtInNonAcdDirect);
        filter.setAgentByPilotAttributes(StatsAgentByPilotAttributes.convADur);

        const context: StatsContext | null = await service.createContext(requester, "the label", "the description", filter);

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalledTimes(1);

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/ccstate/scope/john%20doe/ctx");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            supervisorId: "john doe",
            label: "the label",
            description: "the description",
            filter: {
                agentFilter: {
                    numbers: ["2000", "2001", "2002"],
                    agentAttributes: ["acdWorkTDur", "nbExtInNonacdDirect"],
                    pilotAttributes: ["convADur"]
                }
            }
        });

        // Analyse call
        expect(context).not.toBeNull();
        expect(context?.description).toBe("the description");
        expect(context?.id).toBe("123");
        expect(context?.label).toBe("the label");
        expect(context?.filter).toEqual(filter);
    });

    it("should get a list of context", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                contexts: [
                    {
                        ctxId: "ctx0",
                        supervisorId: "john doe",
                        label: "label 0",
                        filter: {
                            agentFilter: {
                                numbers: ["2000", "2001", "2002"],
                                agentAttributes: ["acdWorkTDur", "nbExtInNonacdDirect"],
                                pilotAttributes: ["convADur"]
                            }
                        }
                    },

                    {
                        ctxId: "ctx1",
                        supervisorId: "john doe",
                        label: "label 1",
                        description: "description 1",
                        filter: {
                            pilotFilter: {
                                numbers: ["3000", "3001"],
                                attributes: ["nbCallsOpen", "nbCallsDissuaded"]
                            }
                        }
                    },
                ]
            })
        );

        // Act
        const requester = new RequesterImpl("john doe", Language.FR, "+03");

        const contexts: StatsContext[] | null = await service.getContexts(requester);

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx");

        // Analyse call
        expect(contexts).toBeInstanceOf(Array<StatsContext>);
        expect(contexts).toHaveLength(2);

        expect(contexts![0].id).toBe("ctx0");
        expect(contexts![0].label).toBe("label 0");
        expect(contexts![0].description).toBeUndefined();
        expect(contexts![0].filter).toBeInstanceOf(AgentFilterImpl);

        const agFilter: AgentFilter | null = contexts![0].filter as AgentFilter
        const agNumbers = agFilter?.numbers;
        const agAttrs = agFilter?.agentAttributes;
        expect(agNumbers[0]).toBe("2000");
        expect(agNumbers[1]).toBe("2001");
        expect(agAttrs.has(StatsAgentAttributes.nbExtInNonAcdDirect)).toBe(true);

        expect(contexts![1].id).toBe("ctx1");
        expect(contexts![1].label).toBe("label 1");
        expect(contexts![1].description).toBe("description 1");
        expect(contexts![1].filter).toBeInstanceOf(PilotFilterImpl);

        const piFilter: PilotFilter | null = contexts![1].filter as PilotFilter
        const piNumbers = piFilter?.numbers;

        const piAttrs = piFilter?.pilotAttributes;

        expect(piNumbers[0]).toBe("3000");
        expect(piNumbers[1]).toBe("3001");
        expect(piAttrs.has(StatsPilotAttributes.nbCallsOpen)).toBe(true);

    });

    it("should call get when quering a specific context", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                ctxId: "ctx0",
                supervisorId: "john doe",
                label: "label 0",
                description: "description 1",
                filter: {
                    agentFilter: {
                        numbers: ["2000", "2001", "2002"],
                        agentAttributes: ["acdWorkTDur", "nbExtInNonacdDirect"],
                        pilotAttributes: ["convADur"]
                    }
                }
            })
        );

        // Act
        const requester = new RequesterImpl("john doe", Language.FR, "+03");
        const context: StatsContext | null = await service.getContext(requester, "ctx0");

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx0");

        // Analyse call
        expect(context).not.toBeNull();
        expect(context?.description).toBe("description 1");
        expect(context?.id).toBe("ctx0");
        expect(context?.label).toBe("label 0");
        expect(context?.requesterId).toBe("john doe");
        expect(context?.filter).toBeInstanceOf(AgentFilterImpl);
    });

    it("should call delete when deleting contexts", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const requester = new RequesterImpl("john doe", Language.FR, "+03");
        const result = await service.deleteContexts(requester);

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx");

        // Analyse call
        expect(result).toBe(true);
    });

    it("should call delete when deleting one context", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const result = await service.deleteContext(context);

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01");

        // Analyse call
        expect(result).toBe(true);
    });

    it("should call getDataByRange when quiering data on date range", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, statDataJson)
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const data = await service.getDaysData(context, new DateRange(new Date(2026, 1, 10, 1, 0), new Date(2026, 1, 15, 4, 30)));

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/days/data?begindate=2026-02-10%2001%3A00&enddate=2026-02-15%2004%3A30&format=json");

        // Analyse call
        expect(data).toBeInstanceOf(StatisticsData);
        expect(data?.requesterId).toBe("john doe");
        expect(data?.agentsStats).not.toBeUndefined();
        expect(data?.pilotsStats).toBeUndefined();

        expect(data?.agentsStats?.length).toBe(2);
    });

    it("should call getDataByDateAndInterval when quiering data on date and interval", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, statDataJson)
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const data = await service.getDayData(context, new Date(2026, 1, 10, 1, 0), TimeInterval.HALF_HOUR);

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/oneday/data?date=2026-02-10&slotType=halfAnHour&format=json");

        // Analyse call
        expect(data).toBeInstanceOf(StatisticsData);
        expect(data?.requesterId).toBe("john doe");
        expect(data?.agentsStats).not.toBeUndefined();
        expect(data?.pilotsStats).toBeUndefined();

        expect(data?.agentsStats?.length).toBe(2);
    });

    it("should allow timeInterval to be undefined", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, statDataJson)
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const data = await service.getDayData(context, new Date(2026, 1, 10, 1, 0));

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/oneday/data?date=2026-02-10&format=json");

        // Analyse call
        expect(data).toBeInstanceOf(StatisticsData);
        expect(data?.requesterId).toBe("john doe");
        expect(data?.agentsStats).not.toBeUndefined();
        expect(data?.pilotsStats).toBeUndefined();

        expect(data?.agentsStats?.length).toBe(2);
    });

    it("getDayFileData should return a promise resolving with file path on success", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Override the factory to return a controlled mock
        const fakeRequest = {
            promise: Promise.resolve("C://temp/dayStat.xls"),
            complete: jest.fn(),
            fail: jest.fn(),
            reportProgress: jest.fn(),
        };
        (service as any).createAsyncRequest = jest.fn().mockReturnValue(fakeRequest);

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const result = await service.getDayFileData(
            context,
            new Date(2026, 1, 10, 1, 0),
            TimeInterval.HALF_HOUR,
            StatsFormat.CSV,
            os.tmpdir()
        );

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalled();
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/oneday/data?date=2026-02-10&slotType=halfAnHour&format=csv&async=true");

        // Analyse call
        expect(result).toBe("C://temp/dayStat.xls");
    });

    it("getDaysFileData should return a promise resolving with file path on success", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, "C://temp/dayStat.xls")
        );

        // Override the factory to return a controlled mock
        const fakeRequest = {
            promise: Promise.resolve("C://temp/dayStat.xls"),
            complete: jest.fn(),
            fail: jest.fn(),
            reportProgress: jest.fn(),
        };
        (service as any).createAsyncRequest = jest.fn().mockReturnValue(fakeRequest);

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const result = await service.getDaysFileData(
            context,
            new DateRange(new Date(2026, 1, 10, 1, 0), new Date(2026, 1, 15, 4, 30)),
            StatsFormat.CSV,
            os.tmpdir()
        );

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalled();
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/days/data?begindate=2026-02-10%2001%3A00&enddate=2026-02-15%2004%3A30&format=json&format=csv&async=true");

        // Analyse call
        expect(result).toBe("C://temp/dayStat.xls");
    });

    it("cancelRequest should call delete", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const result = await service.cancelRequest(context)

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalled();
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccstate/scope/john%20doe/data/request");

        // Analyse call
        expect(result).toBe(true);
    });

    it("createRecurrentScheduledReport should create a ScheduleReportImpl", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, {
                id: "Statistic report"
            })
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");

        const report: ScheduledReport | null = await service.createRecurrentScheduledReport(
            context,
            "Statistic report",
            "A statistic report description",
            ReportObservationPeriod.onCurrentMonth(),
            Recurrence.monthly(15),
            StatsFormat.EXCEL,
            ["john.doe@mycompany.com", "emily.brown@supervisor.com"]
        );

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalledTimes(1);

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/ccstate/scope/john%20doe/ctx/ctx01/schedule");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            name: "Statistic report",
            description: "A statistic report description",
            obsPeriod: {
                periodType: "currentMonth"
            },
            frequency: {
                periodicity: "monthly",
                dayInMonth: 15
            },
            recipients: ["john.doe@mycompany.com", "emily.brown@supervisor.com"],
            fileType: "xls"
        });

        // Analyse call
        expect(report).not.toBeNull();
        expect(report?.description).toBe("A statistic report description");
        expect(report?.id).toBe("Statistic report");
        expect(report?.enabled).toBe(false);
        expect(report?.context.id).toBe("ctx01");
        expect(report?.lastExecutionDate).toBeNull();
        expect(report?.observationPeriod.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_MONTH);
        expect(report?.recurrence?.monthly).toBe(true);
    });

    it("createOneTimeScheduledReport should create a ScheduleReportImpl", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, {
                id: "Statistic report"
            })
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");

        const report: ScheduledReport | null = await service.createOneTimeScheduledReport(
            context,
            "Statistic report",
            "A statistic report description",
            ReportObservationPeriod.onCurrentDay(),
            StatsFormat.EXCEL,
            ["john.doe@mycompany.com", "emily.brown@supervisor.com"]
        );

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalled();

        // Analyse call
        const [url, body] = mockHttpClient.post.mock.calls[0];
        expect(url).toBe("/ccstate/scope/john%20doe/ctx/ctx01/schedule");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            name: "Statistic report",
            description: "A statistic report description",
            obsPeriod: {
                periodType: "currentDay"
            },
            frequency: {
                periodicity: "once",
            },
            recipients: ["john.doe@mycompany.com", "emily.brown@supervisor.com"],
            fileType: "xls"
        });

        // Analyse call
        expect(report).not.toBeNull();
        expect(report?.description).toBe("A statistic report description");
        expect(report?.id).toBe("Statistic report");
        expect(report?.enabled).toBe(false);
        expect(report?.context.id).toBe("ctx01");
        expect(report?.lastExecutionDate).toBeNull();
        expect(report?.observationPeriod.periodType).toBe(ReportObservationPeriod.PeriodType.CURRENT_DAY);
        expect(report?.recurrence).toBeNull();
        expect(report?.once).toBe(true);
    });

    it("getScheduledReports should return an array of ScheduleReportImpl", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                schedules: [
                    {
                        name: "report 1",
                        desciption: "The report 1",
                        obsPeriod: {
                            periodType: "lastDays",
                            lastNb: 6
                        },
                        frequency: {
                            periodicity: "weekly",
                            daysInWeek: ["monday", "friday"]
                        },
                        recipients: ["john.doe@mycompany.com", "emily.brown@supervisor.com"],
                        state: "Executed",
                        enable: true,
                        lastExecDate: "2026-02-10T02:00",
                        fileType: "xls"
                    },
                    {
                        name: "report 2",
                        desciption: "The report 2",
                        obsPeriod: {
                            periodType: "fromDateToDate",
                            beginDate: "2026-02-10T02:00",
                            endDate: "2026-02-20T02:00"
                        },
                        frequency: {
                            periodicity: "once",
                        },
                        recipients: ["john.doe@mycompany.com"],
                        state: "Not_executed",
                        enable: false,
                        fileType: "csv"
                    }
                ]
            })
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const reports = await service.getScheduledReports(context);

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalled();
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/schedule");

        // Analyse call
        expect(reports).not.toBeNull();
        const safeReports = reports!;
        expect(safeReports).toHaveLength(2);

        let report = safeReports[0];
        expect(report.context.id).toBe("ctx01");
        expect(report.id).toBe("report 1");
        expect(report.format).toBe(StatsFormat.EXCEL);
        expect(report.enabled).toBe(true);
        expect(report.lastExecutionDate?.toISOString()).toBe(new Date("2026-02-10T02:00").toISOString());
        expect(report.observationPeriod.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_DAYS);
        expect(report.observationPeriod.lastUnits).toBe(6);
        expect(report.once).toBe(false);
        expect(report.recurrence?.weekly).toBe(true);
        expect(report.recurrence?.daysInWeek).toContain(DayOfWeek.MONDAY);
        expect(report.recurrence?.daysInWeek).toContain(DayOfWeek.FRIDAY);
        expect(report.state).toBe(ScheduledReport.State.EXECUTED);
        expect(report.recipients.length).toBe(2);

        report = safeReports[1];
        expect(report.context.id).toBe("ctx01");
        expect(report.id).toBe("report 2");
        expect(report.format).toBe(StatsFormat.CSV);
        expect(report.enabled).toBe(false);
        expect(report.lastExecutionDate).toBeNull();
        expect(report.observationPeriod.periodType).toBe(ReportObservationPeriod.PeriodType.FROM_DATE_TO_DATE);
        expect(report.observationPeriod.beginDate?.toISOString()).toBe(new Date("2026-02-10T02:00").toISOString());
        expect(report.observationPeriod.endDate?.toISOString()).toBe(new Date("2026-02-20T02:00").toISOString());
        expect(report.once).toBe(true);
        expect(report.recurrence).toBeNull();
        expect(report.state).toBe(ScheduledReport.State.NOT_EXECUTED);
        expect(report.recipients.length).toBe(1);
    });

    it("deleteScheduledReport should delete a report", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.delete.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const report: ScheduledReport = new ScheduledReportImpl(
            new ContextImpl("ctx01", "john doe"),
            "report 1",
            "A report description",
            ReportObservationPeriod.onCurrentDay(),
            null,
            StatsFormat.CSV, ["john.doe@mycompany.com"]);

            const result = await service.deleteScheduledReport(report);

        // Assert
        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/schedule/report%201");

        // Analyse call
        expect(result).toBe(true);
    });

    
    it("setScheduledReportEnabled should change a report", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        // Act
        const report: ScheduledReport = new ScheduledReportImpl(
            new ContextImpl("ctx01", "john doe"),
            "report 1",
            "A report description",
            ReportObservationPeriod.onCurrentDay(),
            null,
            StatsFormat.CSV, ["john.doe@mycompany.com"]);

        const result = await service.setScheduledReportEnabled(report, true);

        // Assert
        expect(mockHttpClient.post).toHaveBeenCalled();
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/schedule/report%201/enable?enable=true");

        // Analyse call
        expect(result).toBe(true);
    });

    it("getScheduledReport should return one ScheduleReportImpl", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {
                name: "report 1",
                desciption: "The report 1",
                obsPeriod: {
                    periodType: "lastDays",
                    lastNb: 6
                },
                frequency: {
                    periodicity: "weekly",
                    daysInWeek: ["monday", "friday"]
                },
                recipients: ["john.doe@mycompany.com", "emily.brown@supervisor.com"],
                state: "Executed",
                enable: true,
                lastExecDate: "2026-02-10T02:00",
                fileType: "xls"
            })
        );

        // Act
        const context: StatsContext = new ContextImpl("ctx01", "john doe");
        const report = await service.getScheduledReport(context, "report 1");

        // Assert
        expect(mockHttpClient.get).toHaveBeenCalled();
        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccstate/scope/john%20doe/ctx/ctx01/schedule/report%201");

        // Analyse call
        expect(report).not.toBeNull();
        expect(report?.context.id).toBe("ctx01");
        expect(report?.id).toBe("report 1");
        expect(report?.format).toBe(StatsFormat.EXCEL);
        expect(report?.enabled).toBe(true);
        expect(report?.lastExecutionDate?.toISOString()).toBe(new Date("2026-02-10T02:00").toISOString());
        expect(report?.observationPeriod.periodType).toBe(ReportObservationPeriod.PeriodType.LAST_DAYS);
        expect(report?.observationPeriod.lastUnits).toBe(6);
        expect(report?.once).toBe(false);
        expect(report?.recurrence?.weekly).toBe(true);
        expect(report?.recurrence?.daysInWeek).toContain(DayOfWeek.MONDAY);
        expect(report?.recurrence?.daysInWeek).toContain(DayOfWeek.FRIDAY);
        expect(report?.state).toBe(ScheduledReport.State.EXECUTED);
        expect(report?.recipients.length).toBe(2);
    });

    it("updateScheduledReport should modify a ScheduleReportImpl", async () => {

        // Arrange: mock the HTTP response
        mockHttpClient.put.mockResolvedValue(
            new HttpResponse(200, null, {
                id: "Statistic report"
            })
        );

        // Act
        const report: ScheduledReport = new ScheduledReportImpl(
            new ContextImpl("ctx01", "john doe"),
            "report 1",
            "A report description",
            ReportObservationPeriod.onCurrentDay(),
            null,
            StatsFormat.CSV, 
            ["john.doe@mycompany.com"]);

        const result = await service.updateScheduledReport(report);

        // Assert
        expect(mockHttpClient.put).toHaveBeenCalled();

        // Analyse call
        const [url, body] = mockHttpClient.put.mock.calls[0];
        expect(url).toBe("/ccstate/scope/john%20doe/ctx/ctx01/schedule/report%201");

        // The call body = StatsScope
        const parsed = JSON.parse(body?.content);
        expect(parsed).toEqual({
            name: "report 1",
            description: "A report description",
            obsPeriod: {
                periodType: "currentDay"
            },
            frequency: {
                periodicity: "once"
            },
            recipients: ["john.doe@mycompany.com"],
            fileType: "csv"
        });

        // Analyse call
        expect(result).toBe(true);
    });

});
