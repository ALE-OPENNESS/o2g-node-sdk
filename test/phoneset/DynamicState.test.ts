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

import { DynamicState } from "../../src/types/phoneset/dynamic-state";



describe('DynamicState', () => {
    it('should create a DynamicState with all fields set', () => {
        const jsonString = `{ 
            "lock": true, 
            "campon": true, 
            "associate": "12345"
        }`;

        const state = DynamicState.fromJson(JSON.parse(jsonString));

        expect(state.lock).toBe(true);
        expect(state.campon).toBe(true);
        expect(state.associate).toBe('12345');
    });

    it('should handle missing fields gracefully', () => {
        const state = DynamicState.fromJson({});

        expect(state.lock).toBe(false);      // default
        expect(state.campon).toBe(false);    // default
        expect(state.associate).toBeNull();  // default
    });

    it('should handle partially set fields', () => {
        const jsonString = `{ 
            "lock": true
        }`;

        const state = DynamicState.fromJson(JSON.parse(jsonString));
        
        expect(state.lock).toBe(true);
        expect(state.campon).toBe(false);
        expect(state.associate).toBeNull();
    });
});