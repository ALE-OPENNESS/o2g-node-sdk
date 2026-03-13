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

import { Voicemail } from "../../src/types/users/voicemail";
import { VoicemailType } from "../../src/types/users/voicemail-type";

// test/users/Voicemail.test.ts

describe('Voicemail', () => {
  const sampleNumbers = ['1234', '5678'];

  describe('fromJson', () => {
    it('creates a Voicemail instance for VM_4635', () => {
      const json = { number: sampleNumbers[0], type: 'VM_4635' };
      const vm = Voicemail.fromJson(json);

      expect(vm.number).toBe('1234');
      expect(vm.type).toBe(VoicemailType.VM_4635);
    });

    it('creates a Voicemail instance for VM_4645', () => {
      const json = { number: sampleNumbers[1], type: 'VM_4645' };
      const vm = Voicemail.fromJson(json);

      expect(vm.number).toBe('5678');
      expect(vm.type).toBe(VoicemailType.VM_4645);
    });

    it('creates a Voicemail instance for EXTERNAL type', () => {
      const json = { number: '9999', type: 'EXTERNAL' };
      const vm = Voicemail.fromJson(json);

      expect(vm.number).toBe('9999');
      expect(vm.type).toBe(VoicemailType.EXTERNAL);
    });

    it('throws or fails gracefully for invalid type', () => {
      const json = { number: '0000', type: 'INVALID_TYPE' as string };
      // Depending on your implementation, either it throws or returns undefined
      // Here we check that it returns undefined for type mapping
      const vm = Voicemail.fromJson(json);
      expect(vm.number).toBe('0000');
      expect(vm.type).toBeUndefined();
    });
  });

  describe('getters', () => {
    it('returns the correct number and type', () => {
      const json = { number: '1234', type: 'VM_4635' };
      const vm = Voicemail.fromJson(json);

      expect(vm.number).toBe('1234');
      expect(vm.type).toBe(VoicemailType.VM_4635);
    });
  });
});
