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

import CallCenterAgentRest from "../../src/internal/rest/ccAgent-rest";
import { AgentConfigJson, OperatorStateJson } from "../../src/internal/types/cc-agent/cc-agent-types";
import { HttpResponse } from "../../src/internal/util/http-response";
import { IHttpClient } from "../../src/internal/util/IHttpClient";
import { IntrusionMode } from "../../src/o2g-node-sdk";
import { OperatorConfig } from "../../src/types/cc-agent/operator-config";
import { OperatorState } from "../../src/types/cc-agent/operator-state";
import { OperatorType } from "../../src/types/cc-agent/operator-type";
import { WithdrawReason } from "../../src/types/cc-agent/withdraw-reason";


describe("CallCenterAgentRest", () => {

    const mockReason = { index: 5 } as WithdrawReason;

    const mockWithdrawReasons = {
        number: 3,
        reasons: [{
            index: 0,
            label: "lunch"
        }, {
            index: 1,
            label: "coffee"
        }]
    }

    const mockAgentStateJson: OperatorStateJson = {
        mainState: OperatorState.OperatorMainState.LOG_ON,
        subState: OperatorState.OperatorDynamicState.WRAPUP,
        proAcdDeviceNumber: "2000",
        pgNumber: "3000"
    }

    const mockAgentConfigJson: AgentConfigJson = {
        type: OperatorType.AGENT,
        proacd: "10000",
        processingGroups: {
            preferred: "20000",
            groups: ["20000", "21000"]
        },
        skills: {
            skills: [{
                number: 1,
                level: 2,
                active: true
            }, {
                number: 2,
                level: 1,
                active: false
            }]
        },
        selfAssign: true,
        headset: false,
        help: true,
        multiline: false
    };



    let mockHttpClient: jest.Mocked<IHttpClient>;
    let service: CallCenterAgentRest;

    beforeEach(() => {
        mockHttpClient = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn()
        };
        service = new CallCenterAgentRest("/ccagents", mockHttpClient);
    });

    // -----------------------
    // getConfiguration
    // -----------------------
    it("should return an OperatorState instance when", async () => {
        mockHttpClient.get.mockResolvedValue(new HttpResponse(200, null, mockAgentConfigJson));

        const agent = await service.getConfiguration(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/config");
        expect(agent).toBeInstanceOf(OperatorConfig);

        expect(agent?.type).toBe(OperatorType.AGENT);
        expect(agent?.skills!.skillsNumbers.size).toBe(2);
    });

    it("should GET /config with loginName", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockAgentConfigJson)
        );

        const agent = await service.getConfiguration("john");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/config?loginName=john");
        expect(agent).toBeInstanceOf(OperatorConfig);

        expect(agent?.type).toBe(OperatorType.AGENT);
        expect(agent?.skills!.skillsNumbers.size).toBe(2);
    });

    it("should return null if configuration body is null", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, null)
        );

        const result = await service.getConfiguration(null);
        expect(result).toBeNull();
    });

    // ---------------------------------------------
    // getState
    // ---------------------------------------------
    it("should GET /state without loginName", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockAgentStateJson)
        );

        const operatorState = await service.getState(null);

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/state");
        expect(operatorState).toBeInstanceOf(OperatorState);
        expect(operatorState?.mainState).toBe(OperatorState.OperatorMainState.LOG_ON)
        expect(operatorState?.withdraw).toBe(false);
        expect(operatorState?.withdrawReason).toBeNull();
    });

    it("should GET /state with loginName", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockAgentStateJson)
        );

        const operatorState = await service.getState("john");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/state?loginName=john");
        expect(operatorState).toBeInstanceOf(OperatorState);
        expect(operatorState?.mainState).toBe(OperatorState.OperatorMainState.LOG_ON)
        expect(operatorState?.withdraw).toBe(false);
        expect(operatorState?.withdrawReason).toBeNull();
    });

    it("should return null if state body is null", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, null)
        );

        const result = await service.getState(null);
        expect(result).toBeNull();
    });

    // ---------------------------------------------
    // getWithdrawReasons
    // ---------------------------------------------
    it("should GET withdrawReasons with pgNumber only", async () => {

        const mockJson = {
            reasons: [{ index: 1, label: "Break" }]
        };

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockWithdrawReasons)
        );

        const reasons = await service.getWithdrawReasons("20000", null);

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/withdrawReasons?pgNumber=20000");
        expect(reasons).toBeInstanceOf(Array);
        expect(reasons?.length).toBe(2);
        expect(reasons![0]).toBeInstanceOf(WithdrawReason);
    });

    it("should GET withdrawReasons with pgNumber and loginName", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, mockWithdrawReasons)
        );

        const reasons = await service.getWithdrawReasons("20000", "john");

        expect(mockHttpClient.get).toHaveBeenCalledWith("/ccagents/withdrawReasons?pgNumber=20000&loginName=john");
        expect(reasons).toBeInstanceOf(Array);
        expect(reasons?.length).toBe(2);
    });

    it("should return null if withdrawReasons response invalid", async () => {

        mockHttpClient.get.mockResolvedValue(
            new HttpResponse(200, null, {})
        );

        const result = await service.getWithdrawReasons("20000", null);
        expect(result).toBeNull();
    });


    // -----------------------
    // logon
    // -----------------------
    it("should send correct POST for logon with pgNumber and headset", async () => {
        mockHttpClient.post.mockResolvedValue({
            isSuccessStatusCode: () => true
        } as any);

        const result = await service.logon("10000", "20000", true, "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/logon?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({
                    proAcdDeviceNumber: "10000",
                    pgGroupNumber: "20000",
                    headset: true
                })
            })
        );
    });

    it("should send logon POST without optional pgNumber and headset", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.logon("10001", null, false, null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/logon",
            expect.objectContaining({
                content: JSON.stringify({ proAcdDeviceNumber: "10001" })
            })
        );
    });

    // -----------------------
    // logoff
    // -----------------------
    it("should send correct POST for logoff", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.logoff("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/logoff?loginName=user1");
    });

    it("should send logoff POST without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.logoff(null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/logoff");
    });

    // -----------------------
    // enter
    // -----------------------
    it("should send correct POST for enter", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.enter("20000", "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/enter?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ pgGroupNumber: "20000" })
            })
        );
    });

    // -----------------------
    // exit
    // -----------------------
    it("should send correct POST for exit if state has pgNumber", async () => {
        // mock getState to return pgNumber
        jest.spyOn(service, "getState").mockResolvedValue({
            pgNumber: "30000",
            mainState: "LOG_ON",
            subState: "READY",
            withdraw: false
        } as any);

        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.exit("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/exit?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ pgGroupNumber: "30000" })
            })
        );
    });

    it("should return false for exit if state has no pgNumber", async () => {
        jest.spyOn(service, "getState").mockResolvedValue({
            mainState: "LOG_ON",
            subState: "READY",
            withdraw: false
        } as any);

        const result = await service.exit("user1");

        expect(result).toBe(false);
        expect(mockHttpClient.post).not.toHaveBeenCalled();
    });


    it("setWrapup should call /wrapUp endpoint and return success", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setWrapup("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/wrapUp?loginName=user1");
    });

    it("setWrapup should call /wrapUp endpoint without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setWrapup(null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/wrapUp");
    });

    it("setReady should call /ready endpoint and return failure if isSuccessStatusCode is false", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => false } as any);

        const result = await service.setReady("user2");

        expect(result).toBe(false);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/ready?loginName=user2");
    });

    it("setPause should call /pause endpoint and return success", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setPause("user3");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/pause?loginName=user3");
    });

    it("setPause should call /pause endpoint without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setPause(null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/pause");
    });

    // -----------------------
    // Permanent Listening
    // -----------------------
    it("requestPermanentListening should POST correct JSON", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.requestPermanentListening("10001", "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/permanentListening?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ agentNumber: "10001" })
            })
        );
    });

    it("cancelPermanentListening should DELETE correct URI with loginName", async () => {
        mockHttpClient.delete.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.cancelPermanentListening("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccagents/permanentListening?loginName=user1");
    });

    it("cancelPermanentListening should DELETE correct URI without loginName", async () => {
        mockHttpClient.delete.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.cancelPermanentListening();

        expect(result).toBe(true);
        expect(mockHttpClient.delete).toHaveBeenCalledWith("/ccagents/permanentListening");
    });

    // -----------------------
    // Intrusion
    // -----------------------
    it("requestIntrusion should POST correct JSON", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.requestIntrusion("10001", "MODE_A" as IntrusionMode, "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/intrusion?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ agentNumber: "10001", mode: "MODE_A" })
            })
        );
    });

    it("changeIntrusionMode should PUT correct JSON", async () => {
        mockHttpClient.put.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.changeIntrusionMode("MODE_B" as IntrusionMode, "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.put).toHaveBeenCalledWith(
            "/ccagents/intrusion?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ mode: "MODE_B" })
            })
        );
    });

    // -----------------------
    // Supervisor Help
    // -----------------------
    it("requestSupervisorHelp should call _doAgentAction", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.requestSupervisorHelp("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/supervisorHelp?loginName=user1");
    });

    it("rejectAgentHelpRequest should DELETE correct URI", async () => {
        mockHttpClient.delete.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.rejectAgentHelpRequest("agent1", "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            "/ccagents/supervisorHelp?other=agent1&loginName=user1"
        );
    });

    it("cancelSupervisorHelpRequest should DELETE correct URI", async () => {
        mockHttpClient.delete.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.cancelSupervisorHelpRequest("super1", "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.delete).toHaveBeenCalledWith(
            "/ccagents/supervisorHelp?other=super1&loginName=user1"
        );
    });

    // -----------------------
    // Snapshot
    // -----------------------
    it("requestSnapshot should POST correct URI", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.requestSnapshot("user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith("/ccagents/state/snapshot?loginName=user1");
    });

    // -----------------------
    // Activate Skills
    // -----------------------
    it("activateSkills should POST correct JSON with loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.activateSkills([1, 2, 3], "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/config/skills/activate?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ skills: [1, 2, 3] })
            })
        );
    });

    it("activateSkills should POST correct JSON without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.activateSkills([4, 5], null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/config/skills/activate",
            expect.objectContaining({
                content: JSON.stringify({ skills: [4, 5] })
            })
        );
    });

    // -----------------------
    // Deactivate Skills
    // -----------------------
    it("deactivateSkills should POST correct JSON with loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.deactivateSkills([1, 2], "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/config/skills/deactivate?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ skills: [1, 2] })
            })
        );
    });

    it("deactivateSkills should POST correct JSON without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.deactivateSkills([3, 4], null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/config/skills/deactivate",
            expect.objectContaining({
                content: JSON.stringify({ skills: [3, 4] })
            })
        );
    });

    it("setWithdraw should POST correct JSON with loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setWithdraw(mockReason, "user1");

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/withdraw?loginName=user1",
            expect.objectContaining({
                content: JSON.stringify({ reasonIndex: 5 })
            })
        );
    });

    it("setWithdraw should POST correct JSON without loginName", async () => {
        mockHttpClient.post.mockResolvedValue({ isSuccessStatusCode: () => true } as any);

        const result = await service.setWithdraw(mockReason, null);

        expect(result).toBe(true);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            "/ccagents/withdraw",
            expect.objectContaining({
                content: JSON.stringify({ reasonIndex: 5 })
            })
        );
    });
});
