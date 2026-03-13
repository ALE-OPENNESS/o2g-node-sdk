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

import { RoutingStateJson, ForwardRouteJson, OverflowRouteJson, PresentationRouteJson } from "../../src/internal/types/routing/routing-types";
import { DndState } from "../../src/types/routing/dnd-state";
import { Forward } from "../../src/types/routing/forward";
import { ForwardCondition } from "../../src/types/routing/forward-condition";
import { Overflow } from "../../src/types/routing/overflow";
import { OverflowCondition } from "../../src/types/routing/overflow-condition";
import { RoutingState } from "../../src/types/routing/routing-state";



describe('RoutingState', () => {

    describe('fromJson', () => {
        it('creates default RoutingState when json is null', () => {
            const state = RoutingState.fromJson(null);

            expect(state.dndState.activate).toBe(false);
            expect(state.forward.destination).toBeDefined();
            expect(state.overflow.destination).toBeDefined();
            expect(state.remoteExtensionActivated).toBe(false);
        });

        it('creates RoutingState with provided forward and overflow', () => {
            const json: RoutingStateJson = {
                dndState: { activate: true },
                forwardRoutes: [{
                    forwardType: "BUSY_NO_ANSWER",
                    destinations: [{ type: 'NUMBER', number: '1234', selected: true }]
                }] as ForwardRouteJson[],
                overflowRoutes: [{
                    overflowType: "BUSY",
                    destinations: [{ type: 'VOICEMAIL', selected: true }]
                }] as OverflowRouteJson[],
                presentationRoutes: []
            };

            const state = RoutingState.fromJson(json);

            expect(state.dndState.activate).toBe(true);
            expect(state.forward.number).toBe('1234');
            expect(state.forward.condition).toBe(ForwardCondition.BUSY_OR_NO_ANSWER);
            expect(state.overflow.destination.toString()).toBe('VOICEMAIL');
            expect(state.overflow.condition).toBe(OverflowCondition.BUSY);
            expect(state.remoteExtensionActivated).toBe(false);
        });

        it('sets remoteExtensionActivated correctly when MOBILE is selected', () => {
            const json: RoutingStateJson = {
                dndState: { activate: false },
                forwardRoutes: [],
                overflowRoutes: [],
                presentationRoutes: [
                    {
                        destinations: [
                            { type: 'MOBILE', selected: true }
                        ]
                    }
                ] as PresentationRouteJson[]
            };

            const state = RoutingState.fromJson(json);
            expect(state.remoteExtensionActivated).toBe(true);
        });

        it('handles empty presentationRoutes', () => {
            const json: RoutingStateJson = {
                dndState: { activate: true },
                forwardRoutes: [],
                overflowRoutes: [],
                presentationRoutes: []
            };

            const state = RoutingState.fromJson(json);
            expect(state.remoteExtensionActivated).toBe(false);
        });
    });

    describe('getters', () => {
        it('returns correct values from getters', () => {
            const json: RoutingStateJson = {
                dndState: { activate: true },
                forwardRoutes: [],
                overflowRoutes: [],
                presentationRoutes: []
            };

            const state = RoutingState.fromJson(json);

            expect(state.dndState).toBeInstanceOf(DndState);
            expect(state.forward).toBeInstanceOf(Forward);
            expect(state.overflow).toBeInstanceOf(Overflow);
            expect(typeof state.remoteExtensionActivated).toBe('boolean');
        });
    });
});
