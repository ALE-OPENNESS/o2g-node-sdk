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

import { DeviceKey } from "../../src/types/phoneset/device-key";



describe('DeviceKey', () => {
    it('should create a DeviceKey with all fields set', () => {
        const key = new DeviceKey(1, '12345', 'Reception');

        expect(key.position).toBe(1);
        expect(key.number).toBe('12345');
        expect(key.mnemonic).toBe('Reception');
    });

    it('should handle missing mnemonic', () => {
        const key = new DeviceKey(2, '67890');

        expect(key.position).toBe(2);
        expect(key.number).toBe('67890');
        expect(key.mnemonic).toBeNull(); // mnemonic is optional
    });

    it('should handle all optional fields missing', () => {
        const key = new DeviceKey();

        expect(key.position).toBeNull();
        expect(key.number).toBeNull();
        expect(key.mnemonic).toBeNull();
    });

    it('should accept mnemonic as null explicitly', () => {
        const key = new DeviceKey(3, '55555');

        expect(key.position).toBe(3);
        expect(key.number).toBe('55555');
        expect(key.mnemonic).toBeNull();
    });
});