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

import { ProgrammeableKey } from "../../src/types/phoneset/prog-key";


describe('ProgrammeableKey', () => {
    it('should create a key with all fields set', () => {
        const key = new ProgrammeableKey(1, '12345', 'Reception', true);

        expect(key.position).toBe(1);
        expect(key.number).toBe('12345');
        expect(key.mnemonic).toBe('Reception');
        expect(key.locked).toBe(true);
    });

    it('should handle missing mnemonic', () => {
        const key = new ProgrammeableKey(2, '67890', undefined, false);

        expect(key.position).toBe(2);
        expect(key.number).toBe('67890');
        expect(key.mnemonic).toBeNull();
        expect(key.locked).toBe(false);
    });

    it('should handle all optional fields missing', () => {
        const key = new ProgrammeableKey();

        expect(key.position).toBeNull();
        expect(key.number).toBeNull();
        expect(key.mnemonic).toBeNull();
        expect(key.locked).toBe(false);
    });

    it('should create a key from JSON', () => {
        const jsonString = `{ 
            "position": 4, 
            "number": "99999", 
            "mnemonic": "Sales",
            "locked": true
        }`;

        const key = ProgrammeableKey.fromJson(JSON.parse(jsonString));
        expect(key.position).toBe(4);
        expect(key.number).toBe('99999');
        expect(key.mnemonic).toBe('Sales');
        expect(key.locked).toBe(true);
    });

    it('should serialize to JSON correctly', () => {
        const key = new ProgrammeableKey(4, '99999', 'Support', false);
        const jsonOut = key.toJson();

        expect(jsonOut.position).toBe(4);
        expect(jsonOut.number).toBe('99999');
        expect(jsonOut.mnemonic).toBe('Support');
        expect(jsonOut.locked).toBe(false);
    });

    it('should output undefined for unset fields in toJson', () => {
        const key = new ProgrammeableKey();
        const jsonOut = key.toJson();

        expect(jsonOut.position).toBeUndefined();
        expect(jsonOut.number).toBeUndefined();
        expect(jsonOut.mnemonic).toBeUndefined();
        expect(jsonOut.locked).toBeUndefined();
    });
});