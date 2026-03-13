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

import { CallProfile } from "../../../src/types/telephony/call/ccd/call-profile";
import { PilotTransferQueryParameters } from "../../../src/types/telephony/call/ccd/pilot-transfer-query-param";


describe('PilotTransferQueryParameters', () => {
    let profile: CallProfile;

    beforeEach(() => {
        profile = new CallProfile(
            new CallProfile.Skill(101, 3, true),
            new CallProfile.Skill(102, 2, false)
        );
    });

    it('should create empty parameters by default', () => {
        const params = new PilotTransferQueryParameters();

        expect(params.agentNumber).toBeNull();
        expect(params.priorityTransfer).toBe(false);
        expect(params.supervisedTransfer).toBe(false);
        expect(params.callProfile).toBeNull();
        expect(params.hasAgentNumber).toBe(false);
        expect(params.hasPriorityTransferCriteria).toBe(false);
        expect(params.hasSupervisedTransferCriteria).toBe(false);
        expect(params.hasCallProfile).toBe(false);

        const json = params.toJson();
        expect(json.agentNumber).toBe('');
        expect(json.priorityTransfer).toBe(false);
        expect(json.supervisedTransfer).toBe(false);
        expect(json.skills!.skills).toHaveLength(0);
    });

    it('should set and get agent number', () => {
        const params = new PilotTransferQueryParameters().setAgentNumber('12345');
        expect(params.agentNumber).toBe('12345');
        expect(params.hasAgentNumber).toBe(true);

        const json = params.toJson();
        expect(json.agentNumber).toBe('12345');
    });

    it('should set and get priorityTransfer', () => {
        const params = new PilotTransferQueryParameters().setPriorityTransfer(true);
        expect(params.priorityTransfer).toBe(true);
        expect(params.hasPriorityTransferCriteria).toBe(true);

        const json = params.toJson();
        expect(json.priorityTransfer).toBe(true);
    });

    it('should set and get supervisedTransfer', () => {
        const params = new PilotTransferQueryParameters().setSupervisedTransfer(true);
        expect(params.supervisedTransfer).toBe(true);
        expect(params.hasSupervisedTransferCriteria).toBe(true);

        const json = params.toJson();
        expect(json.supervisedTransfer).toBe(true);
    });

    it('should set and get callProfile', () => {
        const params = new PilotTransferQueryParameters().setCallProfile(profile);
        expect(params.callProfile).toBe(profile);
        expect(params.hasCallProfile).toBe(true);

        const json = params.toJson();
        expect(json.skills!.skills).toHaveLength(2);
        expect(json.skills!.skills[0].skillNumber).toBe(101);
        expect(json.skills!.skills[1].skillNumber).toBe(102);
    });

    it('should allow fluent chaining', () => {
        const params = new PilotTransferQueryParameters()
            .setAgentNumber('9999')
            .setPriorityTransfer(false)
            .setSupervisedTransfer(true)
            .setCallProfile(profile);

        expect(params.agentNumber).toBe('9999');
        expect(params.priorityTransfer).toBe(false);
        expect(params.supervisedTransfer).toBe(true);
        expect(params.callProfile).toBe(profile);

        const json = params.toJson();
        expect(json.agentNumber).toBe('9999');
        expect(json.priorityTransfer).toBe(false);
        expect(json.supervisedTransfer).toBe(true);
        expect(json.skills!.skills).toHaveLength(2);
    });

    it('should handle unset optional fields in toJson', () => {
        const params = new PilotTransferQueryParameters().setPriorityTransfer(undefined);
        expect(params.priorityTransfer).toBe(false);
        expect(params.hasPriorityTransferCriteria).toBe(false);

        const json = params.toJson();
        expect(json.priorityTransfer).toBe(false);
    });
});