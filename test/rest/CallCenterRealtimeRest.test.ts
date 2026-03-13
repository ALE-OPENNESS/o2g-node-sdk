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

import CallCenterRealtimeRest from "../../src/internal/rest/ccRealtime-rest";
import { HttpContent } from "../../src/internal/util/http-content";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { RtiAgentAttributes } from "../../src/types/cc-rt/agent-attributes";
import { RtiContext } from "../../src/types/cc-rt/rti-context";
import { RtiFilter } from "../../src/types/cc-rt/rti-filter";
import { RtiObjectIdentifier } from "../../src/types/cc-rt/rti-object-identifier";
import { RtiObjects } from "../../src/types/cc-rt/rti-objects";



describe("CallCenterRealtimeRest", () => {
    let mockHttpClient: jest.Mocked<IHttpClient>;
    let rest: CallCenterRealtimeRest;
    const baseUri = "https://api.example.com/callcenter";

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            delete: jest.fn(),
            put: jest.fn(),
        } as unknown as jest.Mocked<IHttpClient>;

        rest = new CallCenterRealtimeRest(baseUri, mockHttpClient);
    });

    it("should get RtiObjects", async () => {
        const jsonString = `{
            "agents": [{ "number": "100", "name": "Agent1", "firstName": "A" }],
            "pilots": [{ "number": "200", "name": "Pilot1", "firstName": "P" }],
            "queues": [{ "number": "300", "name": "Queue1", "firstName": "Q" }],
            "pgAgents": [{ "number": "400", "name": "PGAgent1", "firstName": "PG" }],
            "pgOthers": [{ "number": "500", "name": "PGOther1", "firstName": "O" }]
        }`;

        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, jsonString));

        const result = await rest.getRtiObjects();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(baseUri);

        const expected = RtiObjects.fromJson(JSON.parse(jsonString));
        expect(result).toEqual(expected);
    });

    it("should get agents", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "agents": [
                    { 
                        "number": "2000", 
                        "name": "Doe",
                        "firstName": "john"
                    },
                    { 
                        "number": "2001", 
                        "name": "Smith",
                        "firstName": "Alice"
                    }
                ]
            }`)
        );

        const rtiIdentifiers = await rest.getAgents();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/agents`);

        expect(rtiIdentifiers).toBeInstanceOf(Array);
        expect(rtiIdentifiers?.length).toBe(2);

        expect(rtiIdentifiers![0]).toBeInstanceOf(RtiObjectIdentifier);
        expect(rtiIdentifiers![0].number).toBe("2000");
        expect(rtiIdentifiers![1].number).toBe("2001");
    });

    it("should get pilots", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "pilots": [
                    { 
                        "number": "15000", 
                        "name": "Pilot15000"
                    },
                    { 
                        "number": "15001", 
                        "name": "Pilot15001"
                    }
                ]
            }`)
        );

        const rtiIdentifiers = await rest.getPilots();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/pilots`);

        expect(rtiIdentifiers).toBeInstanceOf(Array);
        expect(rtiIdentifiers?.length).toBe(2);

        expect(rtiIdentifiers![0]).toBeInstanceOf(RtiObjectIdentifier);
        expect(rtiIdentifiers![0].number).toBe("15000");
        expect(rtiIdentifiers![0].name).toBe("Pilot15000");
        expect(rtiIdentifiers![1].number).toBe("15001");
    });

    it("should get queues", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "queues": [
                    { 
                        "number": "15000", 
                        "name": "Queue15000"
                    },
                    { 
                        "number": "15001", 
                        "name": "Queue15001"
                    }
                ]
            }`)
        );

        const rtiIdentifiers = await rest.getQueues();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/queues`);
        expect(rtiIdentifiers).toBeInstanceOf(Array);
        expect(rtiIdentifiers?.length).toBe(2);

        expect(rtiIdentifiers![0]).toBeInstanceOf(RtiObjectIdentifier);
        expect(rtiIdentifiers![0].number).toBe("15000");
        expect(rtiIdentifiers![0].name).toBe("Queue15000");
        expect(rtiIdentifiers![1].number).toBe("15001");
    });

    it("should get agent processing groups", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "pgAgents": [
                    { 
                        "number": "15000", 
                        "name": "PGAgent15000"
                    },
                    { 
                        "number": "15001", 
                        "name": "PGAgent15001"
                    }
                ]
            }`)
        );

        const rtiIdentifiers = await rest.getAgentProcessingGroups();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/pgAgents`);

        expect(rtiIdentifiers).toBeInstanceOf(Array);
        expect(rtiIdentifiers?.length).toBe(2);

        expect(rtiIdentifiers![0]).toBeInstanceOf(RtiObjectIdentifier);
        expect(rtiIdentifiers![0].number).toBe("15000");
        expect(rtiIdentifiers![0].name).toBe("PGAgent15000");
        expect(rtiIdentifiers![1].number).toBe("15001");
    });

    it("should get other processing groups", async () => {
        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, `{
                "pgOthers": [
                    { 
                        "number": "15000", 
                        "name": "PGOther15000"
                    },
                    { 
                        "number": "15001", 
                        "name": "PGOther15001"
                    }
                ]
            }`)
        );

        const rtiIdentifiers = await rest.getOtherProcessingGroups();

        expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.get).toHaveBeenCalledWith(`${baseUri}/pgOthers`);

        expect(rtiIdentifiers).toBeInstanceOf(Array);
        expect(rtiIdentifiers?.length).toBe(2);

        expect(rtiIdentifiers![0]).toBeInstanceOf(RtiObjectIdentifier);
        expect(rtiIdentifiers![0].number).toBe("15000");
        expect(rtiIdentifiers![0].name).toBe("PGOther15000");
        expect(rtiIdentifiers![1].number).toBe("15001");
    });

    it("should delete context", async () => {
        mockHttpClient.delete.mockResolvedValue(new HttpResponse(200, null, null));

        const success = await rest.deleteContext();

        expect(mockHttpClient.delete).toHaveBeenCalledTimes(1);
        expect(mockHttpClient.delete).toHaveBeenCalledWith(`${baseUri}/ctx`);
        expect(success).toBe(true);
    });

    it("should set context with JSON body", async () => {

        mockHttpClient.post.mockResolvedValue(
            new HttpResponse(200, null, "")
        );

        const filter = new RtiFilter();
        filter.setAgentNumbers(["60119", "60120"]);
        filter.setAgentAttributes(RtiAgentAttributes.PrivateCallsTotalDuration, RtiAgentAttributes.LogonDate);
        const context = new RtiContext(30, 5, filter);

        const success = await rest.setContext(context);

        expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
        const [calledUrl, body] = mockHttpClient.post.mock.calls[0];

        expect(calledUrl).toBe(`${baseUri}/ctx`);
        const payload = JSON.parse((body as HttpContent).content);

        expect(payload).toEqual({
            obsPeriod: 30,
            notifFrequency: 5,
            filter: {
                agentFilter: {
                    numbers: ["60119", "60120"],
                    attributes: ["PrivateCallsTotalDuration", "LogonDate"]
                }
            },
            active: false
        });

        expect(success).toBe(true);
    });

    it("should start snapshot", async () => {
        mockHttpClient.post.mockResolvedValue(new HttpResponse(200, null, null));

        const success = await rest.start();

        expect(mockHttpClient.post).toHaveBeenCalledWith(`${baseUri}/snapshot`);
        expect(success).toBe(true);
    });
});