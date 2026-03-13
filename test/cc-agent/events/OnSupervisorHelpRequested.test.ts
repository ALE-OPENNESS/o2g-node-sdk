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

import { OnSupervisorHelpRequested } from "../../../src/types/cc-agent/cc-agent-events";



describe("OnSupervisorHelpRequested", () => {

    const jsonString = `{
        "loginName": "supervisor007",
        "agentNumber": "agent123"
    }`;

    it("should create an instance from JSON", () => {
        const event = OnSupervisorHelpRequested.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnSupervisorHelpRequested);
        expect(event.loginName).toBe("supervisor007");
        expect(event.agentNumber).toBe("agent123");
    });

    it("should handle missing agentNumber field", () => {
        const jsonWithoutAgentNumber = { loginName: "supervisorX" } as any;
        const event = OnSupervisorHelpRequested.fromJson(jsonWithoutAgentNumber);

        expect(event.loginName).toBe("supervisorX");
        expect(event.agentNumber).toBeUndefined();
    });

    it("should handle missing loginName field", () => {
        const jsonWithoutLoginName = { agentNumber: "agent999" } as any;
        const event = OnSupervisorHelpRequested.fromJson(jsonWithoutLoginName);

        expect(event.loginName).toBeUndefined();
        expect(event.agentNumber).toBe("agent999");
    });

    it("should handle empty JSON object", () => {
        const event = OnSupervisorHelpRequested.fromJson({} as any);

        expect(event.loginName).toBeUndefined();
        expect(event.agentNumber).toBeUndefined();
    });

});