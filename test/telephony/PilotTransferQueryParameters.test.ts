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

import { CallProfile } from "../../src/types/telephony/call/ccd/call-profile";
import { PilotTransferQueryParameters } from "../../src/types/telephony/call/ccd/pilot-transfer-query-param";


describe('PilotTransferQueryParameters', () => {

    let profile: CallProfile;

    beforeEach(() => {
        profile = new CallProfile(new CallProfile.Skill(101, 3, true));
    });

    describe('constructor', () => {
        it('should create an empty object', () => {
            const params = new PilotTransferQueryParameters();
            expect(params.agentNumber).toBeNull();
            expect(params.priorityTransfer).toBe(false);
            expect(params.supervisedTransfer).toBe(false);
            expect(params.callProfile).toBeNull();
            expect(params.hasAgentNumber).toBe(false);
            expect(params.hasPriorityTransferCriteria).toBe(false);
            expect(params.hasSupervisedTransferCriteria).toBe(false);
            expect(params.hasCallProfile).toBe(false);
        });
    });

    describe('fluent setters and getters', () => {
        it('should set and get agentNumber', () => {
            const params = new PilotTransferQueryParameters()
                .setAgentNumber('1234');

            expect(params.agentNumber).toBe('1234');
            expect(params.hasAgentNumber).toBe(true);
        });

        it('should set and get priorityTransfer', () => {
            const params = new PilotTransferQueryParameters()
                .setPriorityTransfer(true);

            expect(params.priorityTransfer).toBe(true);
            expect(params.hasPriorityTransferCriteria).toBe(true);

            params.setPriorityTransfer(false);
            expect(params.priorityTransfer).toBe(false);
        });

        it('should set and get supervisedTransfer', () => {
            const params = new PilotTransferQueryParameters()
                .setSupervisedTransfer(true);

            expect(params.supervisedTransfer).toBe(true);
            expect(params.hasSupervisedTransferCriteria).toBe(true);

            params.setSupervisedTransfer(false);
            expect(params.supervisedTransfer).toBe(false);
        });

        it('should set and get callProfile', () => {
            const params = new PilotTransferQueryParameters()
                .setCallProfile(profile);

            expect(params.callProfile).toBe(profile);
            expect(params.hasCallProfile).toBe(true);

            params.setCallProfile(undefined);
            expect(params.callProfile).toBeNull();
            expect(params.hasCallProfile).toBe(false);
        });
    });

    describe('hasAgentNumber edge cases', () => {
        it('should return false for empty string agentNumber', () => {
            const params = new PilotTransferQueryParameters().setAgentNumber('');
            expect(params.hasAgentNumber).toBe(false);
        });

        it('should return true for non-empty string agentNumber', () => {
            const params = new PilotTransferQueryParameters().setAgentNumber('5678');
            expect(params.hasAgentNumber).toBe(true);
        });
    });

    describe('chaining', () => {
        it('should support fluent chaining', () => {
            const params = new PilotTransferQueryParameters()
                .setAgentNumber('1234')
                .setPriorityTransfer(true)
                .setSupervisedTransfer(false)
                .setCallProfile(profile);

            expect(params.agentNumber).toBe('1234');
            expect(params.priorityTransfer).toBe(true);
            expect(params.supervisedTransfer).toBe(false);
            expect(params.callProfile).toBe(profile);
            expect(params.hasAgentNumber).toBe(true);
            expect(params.hasPriorityTransferCriteria).toBe(true);
            expect(params.hasSupervisedTransferCriteria).toBe(true);
            expect(params.hasCallProfile).toBe(true);
        });
    });
});