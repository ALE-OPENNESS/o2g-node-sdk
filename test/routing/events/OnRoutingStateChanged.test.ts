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

import { Destination } from "../../../src/types/routing/destination";
import { ForwardCondition } from "../../../src/types/routing/forward-condition";
import { OverflowCondition } from "../../../src/types/routing/overflow-condition";
import { OnRoutingStateChanged } from "../../../src/types/routing/routing-events";
import { RoutingState } from "../../../src/types/routing/routing-state";

describe('OnRoutingStateChanged (from JSON string)', () => {

    it('should create an event for DND change', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "routingState": {
                "dndState": {
                    "activate": true
                }
            }
        }`;

        const event = OnRoutingStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnRoutingStateChanged);
        expect(event.loginName).toBe('oxe1000');
        expect(event.routingState).toBeInstanceOf(RoutingState);
        expect(event.routingState.dndState.activate).toBe(true);
        expect(event.routingState.forward.destination).toBe(Destination.NONE);
        expect(event.routingState.overflow.destination).toBe(Destination.NONE);
        expect(event.routingState.remoteExtensionActivated).toBe(false);
    });

    it('should create an event for forward change', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "routingState": {
                "forwardRoutes": [
                    {
                        "forwardType": "BUSY_NO_ANSWER",
                        "destinations": [
                            {
                                "type": "VOICEMAIL"
                            }
                        ]
                    }
                ]
            }
        }`;

        const event = OnRoutingStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnRoutingStateChanged);
        expect(event.loginName).toBe('oxe1000');
        expect(event.routingState).toBeInstanceOf(RoutingState);
        expect(event.routingState.dndState.activate).toBe(false);
        expect(event.routingState.forward.destination).toBe(Destination.VOICEMAIL);
        expect(event.routingState.forward.condition).toBe(ForwardCondition.BUSY_OR_NO_ANSWER);
        expect(event.routingState.forward.number).toBeNull();
        expect(event.routingState.overflow.destination).toBe(Destination.NONE);
        expect(event.routingState.remoteExtensionActivated).toBe(false);
    });

    it('should create an event for overflow change', () => {
        const jsonString = `{
            "loginName": "oxe1000",
            "routingState": {
                "overflowRoutes": [
                    {
                        "overflowType": "NO_ANSWER",
                        "destinations": [
                            {
                                "type": "NUMBER",
                                "number": "12500"
                            }
                        ]
                    }
                ]
            }
        }`;

        const event = OnRoutingStateChanged.fromJson(JSON.parse(jsonString));

        expect(event).toBeInstanceOf(OnRoutingStateChanged);
        expect(event.loginName).toBe('oxe1000');
        expect(event.routingState).toBeInstanceOf(RoutingState);
        expect(event.routingState.dndState.activate).toBe(false);

        expect(event.routingState.overflow.destination).toBe(Destination.NUMBER);
        expect(event.routingState.overflow.condition).toBe(OverflowCondition.NO_ANSWER);
        expect(event.routingState.overflow.number).toBe("12500");

        expect(event.routingState.forward.destination).toBe(Destination.NONE);
        expect(event.routingState.remoteExtensionActivated).toBe(false);
    });

});