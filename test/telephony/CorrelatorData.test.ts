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

import { CorrelatorData } from "../../src/types/telephony/call/correlator-data";


describe('CorrelatorData', () => {

    describe('constructor', () => {

        it('should construct from a string', () => {
            const str = 'Hello, World!';
            const data = new CorrelatorData(str);

            expect(data.asString()).toBe(str);
            expect(data.asByteArray()).toEqual(Buffer.from(str, 'utf8'));
        });

        it('should construct from a Buffer', () => {
            const buf = Buffer.from([0x01, 0x02, 0x03]);
            const data = new CorrelatorData(buf);

            expect(data.asByteArray()).toBe(buf); // same reference
            expect(data.asString()).toBe(buf.toString('utf8'));
        });

        it('should construct from a Uint8Array', () => {
            const arr = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
            const data = new CorrelatorData(arr);

            expect(data.asByteArray()).toEqual(Buffer.from(arr));
            expect(data.asString()).toBe('Hello');
        });

        it('should throw TypeError for invalid type', () => {
            expect(() => new CorrelatorData(123 as any)).toThrow(TypeError);
            expect(() => new CorrelatorData({} as any)).toThrow(TypeError);
        });

        it('should throw Error if buffer contains 0x00', () => {
            const buf = Buffer.from([0x01, 0x00, 0x02]);
            expect(() => new CorrelatorData(buf)).toThrow('Byte 0x00 is not authorized in correlator data');

            const strWithNull = 'abc\u0000def';
            expect(() => new CorrelatorData(strWithNull)).toThrow('Byte 0x00 is not authorized in correlator data');

            const arr = new Uint8Array([0x01, 0x00]);
            expect(() => new CorrelatorData(arr)).toThrow('Byte 0x00 is not authorized in correlator data');
        });
    });

});

describe('asByteArray', () => {
    it('should return the underlying Buffer', () => {
        const buf = Buffer.from([0x10, 0x20]);
        const data = new CorrelatorData(buf);

        expect(data.asByteArray()).toBe(buf); // same reference
    });
});

describe('asString', () => {
    it('should return UTF-8 string representation', () => {
        const str = 'TestString';
        const data = new CorrelatorData(str);

        expect(data.asString()).toBe(str);
    });
});
