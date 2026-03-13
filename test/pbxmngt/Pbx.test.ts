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

import { Pbx } from "../../src/types/pbxmngt/pbx";

/**
 * Jest unit tests for the Pbx class
 */


describe('Pbx', () => {

    it('should create a Pbx instance from JSON', () => {
        const jsonString = `{
            "nodeId": 123,
            "fqdn": "oxe1.company.com"
        }`;

        const json = JSON.parse(jsonString);
        const pbx = Pbx.fromJson(json);

        expect(pbx).toBeInstanceOf(Pbx);
        expect(pbx.nodeId).toBe(123);
        expect(pbx.fqdn).toBe('oxe1.company.com');
    });

    it('should return null for missing fields', () => {
        const jsonString = `{}`;
        const json = JSON.parse(jsonString);
        const pbx = Pbx.fromJson(json);

        expect(pbx.nodeId).toBeNull();
        expect(pbx.fqdn).toBeNull();
    });

    it('should handle partial JSON', () => {
        const jsonString = `{"nodeId": 456}`;
        const json = JSON.parse(jsonString);
        const pbx = Pbx.fromJson(json);

        expect(pbx.nodeId).toBe(456);
        expect(pbx.fqdn).toBeNull();
    });

});