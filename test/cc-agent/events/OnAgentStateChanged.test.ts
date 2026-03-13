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

import { OnAgentStateChanged } from "../../../src/types/cc-agent/cc-agent-events";
import { OperatorState } from "../../../src/types/cc-agent/operator-state";


describe("OnAgentStateChanged", () => {

    it("should create an instance from JSON", () => {
        const jsonString = `{
            "loginName": "agent007",
            "state": { 
                "mainState": "LOG_ON",
                "subState": "BUSY",
                "proAcdDeviceNumber": "10001",
                "pgNumber": "2300"
            }
        }`;
        const event = OnAgentStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnAgentStateChanged);
        expect(event.loginName).toBe("agent007");
        expect(event.state).toBeInstanceOf(OperatorState);

        // Check that the state is correctly parsed
        expect(event.state.mainState).toBe(OperatorState.OperatorMainState.LOG_ON);
        expect(event.state.subState).toBe(OperatorState.OperatorDynamicState.BUSY);
        expect(event.state.proAcdDeviceNumber).toBe("10001");
        expect(event.state.pgNumber).toBe("2300");
        expect(event.state.withdraw).toBe(false);
        expect(event.state.withdrawReason).toBeNull();
    });

    it("should handle null proAcdDeviceNumber field", () => {
        const jsonString = `{
            "loginName": "agent007",
            "state": { 
                "mainState": "LOG_ON",
                "subState": "BUSY"
            }
        }`;
        const event = OnAgentStateChanged.fromJson(JSON.parse(jsonString));

        expect(event.loginName).toBe("agent007");
        expect(event.state.proAcdDeviceNumber).toBeNull();
        expect(event.state.pgNumber).toBeNull();
    });

    it("should handle null state main and substate field", () => {
        const jsonString = `{
            "loginName": "agent007",
            "state": { 
                "mainState": "LOG_ON"
            }
        }`;
        const event = OnAgentStateChanged.fromJson(JSON.parse(jsonString));

        expect(event.loginName).toBe("agent007");
        expect(event.state.mainState).toBe(OperatorState.OperatorMainState.LOG_ON);
        expect(event.state.pgNumber).toBeNull();
    });
});