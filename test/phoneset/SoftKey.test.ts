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

import { SoftKey } from "../../src/types/phoneset/soft-key";


describe('SoftKey', () => {
    it('should create a SoftKey with all fields set', () => {
        const key = new SoftKey(1, '12345', 'Reception');

        expect(key.position).toBe(1);
        expect(key.number).toBe('12345');
        expect(key.mnemonic).toBe('Reception');
    });

    it('should handle missing mnemonic', () => {
        const key = new SoftKey(2, '67890');

        expect(key.position).toBe(2);
        expect(key.number).toBe('67890');
        expect(key.mnemonic).toBeNull(); // mnemonic is optional
    });

    it('should handle all optional fields missing', () => {
        const key = new SoftKey();

        expect(key.position).toBeNull();
        expect(key.number).toBeNull();
        expect(key.mnemonic).toBeNull();
    });

    it('should accept mnemonic as null explicitly', () => {
        const key = new SoftKey(3, '55555');

        expect(key.position).toBe(3);
        expect(key.number).toBe('55555');
        expect(key.mnemonic).toBeNull();
    });

    it('should create a SoftKey from JSON', () => {
        const jsonString = `{ 
            "position": 4, 
            "number": "99999", 
            "mnemonic": "Sales"
        }`;

        const key = SoftKey.fromJson(JSON.parse(jsonString));
        expect(key.position).toBe(4);
        expect(key.number).toBe('99999');
        expect(key.mnemonic).toBe('Sales');
    });

    it('should convert a SoftKey to JSON correctly', () => {
        const key = new SoftKey(5, '11111', 'Support');
        const jsonOut = key.toJson();

        expect(jsonOut.position).toBe(5);
        expect(jsonOut.number).toBe('11111');
        expect(jsonOut.mnemonic).toBe('Support');
    });

    it('should output undefined for unset fields in toJson', () => {
        const key = new SoftKey();
        const jsonOut = key.toJson();

        expect(jsonOut.position).toBeUndefined();
        expect(jsonOut.number).toBeUndefined();
        expect(jsonOut.mnemonic).toBeUndefined();
    });
});