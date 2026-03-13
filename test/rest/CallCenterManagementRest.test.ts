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

import CallCenterManagementRest from "../../src/internal/rest/ccMngt-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { CallProfile } from "../../src/o2g-node-sdk";
import { PilotOperatingMode } from "../../src/types/cc-mngt/calendar/pilot-operating-Mode";
import { Transition } from "../../src/types/cc-mngt/calendar/transition";
import { Pilot } from "../../src/types/cc-mngt/pilot";
import { DayOfWeek } from "../../src/types/common/day-of-week";
import { PilotTransferQueryParameters } from "../../src/types/telephony/call/ccd/pilot-transfer-query-param";

describe("CallCenterManagementRest", () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let rest: CallCenterManagementRest;
    const baseUri = "https://api.example.com/callcenter/acd";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
            put: jest.fn(),
        } as unknown as jest.Mocked<IHttpClient>;

        rest = new CallCenterManagementRest(baseUri, mockHttpClient);
    });

    //-------------
    // getPilots
    //-------------
    describe("getPilots", () => {
        it("should fetch pilots for a node", async () => {
            const jsonString = `{
                "pilotList": [
                    { "number": "10001", "name": "pilot1", "state": "OPEN", "detailedState": "OPEN", "waitingTime": 5, "saturation": false, "rules": [], "possibleTransfer": true, "supervisedTransfer": false },
                    { "number": "10002", "name": "pilot2", "state": "OPEN", "detailedState": "OPEN", "waitingTime": 3, "saturation": false, "rules": [], "possibleTransfer": true, "supervisedTransfer": false }
                ]
            }`;

            mockHttpClient.get.mockResolvedValue(
                new HttpResponse(200, null, jsonString)
            );

            const pilots = await rest.getPilots(1);

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/pilots`);
            expect(pilots?.length).toBe(2);
            expect(pilots?.[0].name).toBe("pilot1");
            expect(pilots?.[1].number).toBe("10002");
        });
    });

    //-------------
    // getPilot
    //-------------
    describe("getPilot", () => {
        it("should fetch a single pilot", async () => {
            mockHttpClient.get.mockResolvedValue(
                new HttpResponse(200, null, `{ 
                    "number": "10001", 
                    "name": "pilot1" 
                }`)
            );

            const pilot = await rest.getPilot(1, "10001");

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/pilots/10001`);
            expect(pilot?.name).toBe("pilot1");
        });
    });

//-------------
    // getPilotAdvanced
    //-------------
    describe("getPilotAdvanced", () => {
        it("should fetch a pilot with advanced parameters", async () => {
            mockHttpClient.post.mockResolvedValue(
                new HttpResponse(200, null, `{ 
                    "number": "10001", 
                    "name": "pilot1" 
                }`)
            );

            const ptqp = new PilotTransferQueryParameters();
            ptqp.setAgentNumber("312345");
            ptqp.setSupervisedTransfer(true);
            ptqp.setCallProfile(new CallProfile(new CallProfile.Skill(2, 3, true)));

            const pilot = await rest.getPilotAdvanced(1, "10001", ptqp);

            expect(mockHttpClient.post).toHaveBeenCalled();

            const [url, body] = mockHttpClient.post.mock.calls[0];
            expect(url).toBe(`${baseUri}/1/pilots/10001`);

            const payload = JSON.parse((body as HttpContent).content);
            expect(payload).toEqual({
                agentNumber: "312345",
                supervisedTransfer: true,
                skills: {
                    skills: [{
                        skillNumber: 2,
                        expertEvalLevel: 3,
                        acrStatus: true
                    }]
                }
            });

            expect(pilot?.name).toBe("pilot1");
        });
    });

    //-------------
    // getCalendar
    //-------------
    describe("getCalendar", () => {
        it("should fetch a pilot calendar", async () => {
            mockHttpClient.get.mockResolvedValue(
                new HttpResponse(200, null, `{ 
                    "normalDays": {}, 
                    "exceptionDays": {} 
                }`)
            );

            const calendar = await rest.getCalendar(1, "10001");

            expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/1/pilots/10001/calendar`);
            expect(calendar).not.toBeNull();
        });
    });

    //-------------
    // addExceptionTransition
    //-------------
    describe("addExceptionTransition", () => {
        it("should post an exception transition", async () => {

            mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

            const transition = new Transition(
                new Transition.Time(12, 0), 
                1, 
                PilotOperatingMode.NORMAL);

            const result = await rest.addExceptionTransition(1, "10001", new Date(2026, 1, 28), transition);

            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/exception/20260228`,
                new HttpContent(JSON.stringify(
                    { 
                        time: "12:00", 
                        ruleNumber: 1,
                        mode: "normal"
                    }
                ))
            );

            expect(result).toBe(true);
        });
    });

    //-------------
    // deleteExceptionTransition
    //-------------
    describe("deleteExceptionTransition", () => {
        it("should delete to delete exception transition", async () => {

            mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

            const result = await rest.deleteExceptionTransition(1, "10001", new Date(2026, 1, 28), 0);

            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/exception/20260228/transitions/1`
            );
            expect(result).toBe(true);
        });
    });

    //-------------
    // setExceptionTransition
    //-------------
    describe("setExceptionTransition", () => {
        it("should put to update exception transition", async () => {

            mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

            const transition = new Transition(
                new Transition.Time(14, 30), 
                2, 
                PilotOperatingMode.FORWARD);
            const result = await rest.setExceptionTransition(1, "10001", new Date(2026, 1, 28), 0, transition);

            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/exception/20260228/transitions/1`,
                new HttpContent(JSON.stringify(
                    { 
                        time: "14:30", 
                        ruleNumber: 2,
                        mode: "forward"
                    }
                ))
            );

            expect(result).toBe(true);
        });
    });


    //-------------
    // addNormalTransition
    //-------------
    describe("addNormalTransition", () => {
        it("should post a normal transition", async () => {

            mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

            const transition = new Transition(
                new Transition.Time(12, 0), 
                1, 
                PilotOperatingMode.NORMAL);

            const result = await rest.addNormalTransition(1, "10001", DayOfWeek.MONDAY, transition);

            expect(mockHttpClient.post).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/normal/monday`,
                new HttpContent(JSON.stringify(
                    { 
                        time: "12:00", 
                        ruleNumber: 1,
                        mode: "normal"
                    }
                ))
            );

            expect(result).toBe(true);
        });
    });

    //-------------
    // deleteNormalTransition
    //-------------
    describe("deleteNormalTransition", () => {
        it("should delete to delete normal transition", async () => {

            mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, ''));

            const result = await rest.deleteNormalTransition(1, "10001", DayOfWeek.FRIDAY, 0);

            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/normal/friday/transitions/1`
            );
            expect(result).toBe(true);
        });
    });

    //-------------
    // setNormalTransition
    //-------------
    describe("setNormalTransition", () => {
        it("should put to update normal transition", async () => {

            mockHttpClient.put.mockResolvedValue(new HttpResponse(200, null, ''));

            const transition = new Transition(
                new Transition.Time(14, 30), 
                2, 
                PilotOperatingMode.FORWARD);
            const result = await rest.setNormalTransition(1, "10001", DayOfWeek.SATURDAY, 0, transition);

            expect(mockHttpClient.put).toHaveBeenCalledWith(
                `${baseUri}/1/pilots/10001/calendar/normal/saturday/transitions/1`,
                new HttpContent(JSON.stringify(
                    { 
                        time: "14:30", 
                        ruleNumber: 2,
                        mode: "forward"
                    }
                ))
            );

            expect(result).toBe(true);
        });
    });


    //-------------
    // openPilot
    //-------------
    it("should post to open a pilot", async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await rest.openPilot(1, "10001");

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/1/pilots/10001/open`);
        expect(result).toBe(true);
    });

    //-------------
    // closePilot
    //-------------
    it("should post to close a pilot", async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, ''));

        const result = await rest.closePilot(1, "10001");

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/1/pilots/10001/close`);
        expect(result).toBe(true);
    });

});