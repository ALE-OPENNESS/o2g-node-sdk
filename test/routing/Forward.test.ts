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

import { ForwardRouteJson, DestinationJson } from "../../src/internal/types/routing/routing-types";
import { Destination } from "../../src/types/routing/destination";
import { Forward } from "../../src/types/routing/forward";
import { ForwardCondition } from "../../src/types/routing/forward-condition";


// test/users/Forward.test.ts

describe('Forward', () => {

    describe('fromJson', () => {
        it('returns a Forward with NONE if null JSON', () => {
            const forward = Forward.fromJson(null);

            expect(forward.destination).toBe(Destination.NONE);
            expect(forward.number).toBeNull();
            expect(forward.condition).toBeNull();
        });

        it('returns a Forward with valid NUMBER', () => {
            const json: ForwardRouteJson = {
                forwardType: 'IMMEDIATE',
                destinations: [{ type: 'NUMBER', number: '1234', selected: true }]
            };

            const forward = Forward.fromJson(json);

            expect(forward.destination).toBe(Destination.NUMBER);
            expect(forward.number).toBe('1234');
            expect(forward.condition).toBe(ForwardCondition.IMMEDIATE);
        });

        it('returns a Forward with VOICEMAIL', () => {
            const json: ForwardRouteJson = {
                forwardType: 'BUSY',
                destinations: [{ type: 'VOICEMAIL', selected: true }]
            };

            const forward = Forward.fromJson(json);

            expect(forward.destination).toBe(Destination.VOICEMAIL);
            expect(forward.number).toBeNull();
            expect(forward.condition).toBe(ForwardCondition.BUSY);
        });

        it('returns NONE if destinations array is empty', () => {
            const json: ForwardRouteJson = { forwardType: 'IMMEDIATE', destinations: [] };
            const forward = Forward.fromJson(json);
            expect(forward.destination).toBe(Destination.NONE);
            expect(forward.number).toBeNull();
            expect(forward.condition).toBeNull();
        });
    });

    describe('factory methods', () => {
        it('onNumber creates a NUMBER Forward', () => {
            const forward = Forward.onNumber('5555', ForwardCondition.IMMEDIATE);

            expect(forward.destination).toBe(Destination.NUMBER);
            expect(forward.number).toBe('5555');
            expect(forward.condition).toBe(ForwardCondition.IMMEDIATE);
        });

        it('onVoiceMail creates a VOICEMAIL Forward', () => {
            const forward = Forward.onVoiceMail(ForwardCondition.BUSY);

            expect(forward.destination).toBe(Destination.VOICEMAIL);
            expect(forward.number).toBeNull();
            expect(forward.condition).toBe(ForwardCondition.BUSY);
        });
    });

    describe('getters', () => {
        it('returns correct destination, number and condition', () => {
            const forward = Forward.onNumber('9999', ForwardCondition.NO_ANSWER);

            expect(forward.destination).toBe(Destination.NUMBER);
            expect(forward.number).toBe('9999');
            expect(forward.condition).toBe(ForwardCondition.NO_ANSWER);
        });
    });

    describe('toJson', () => {
        it('serializes NUMBER Forward correctly', () => {
            const forward = Forward.onNumber('1234', ForwardCondition.IMMEDIATE);
            const json: ForwardRouteJson = forward.toJson();

            expect(json.forwardType).toBeUndefined();
            expect(json.destinations).toEqual([
                { type: 'NUMBER', number: '1234' } as DestinationJson
            ]);
        });

        it('serializes VOICEMAIL Forward correctly', () => {
            const forward = Forward.onVoiceMail(ForwardCondition.BUSY);
            const json: ForwardRouteJson = forward.toJson();

            expect(json.forwardType).toBe('BUSY');
            expect(json.destinations).toEqual([
                { type: 'VOICEMAIL', number: undefined } as DestinationJson
            ]);
        });

        it('serializes NONE Forward correctly', () => {
            // Directly create NONE Forward via constructor for testing
            const forward = new (Forward as any)(Destination.NONE, null, null);
            const json: ForwardRouteJson = forward.toJson();

            expect(json.forwardType).toBeUndefined();
            expect(json.destinations).toHaveLength(0);
        });
    });

});
