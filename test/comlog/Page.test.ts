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

import { Page } from "../../src/types/comlog/page";



describe('Page', () => {
    it('should initialize with the correct offset and limit', () => {
        const page = new Page(10, 5);
        expect(page.offset).toBe(10);
        expect(page.limit).toBe(5);
    });

    it('should move to the next page correctly', () => {
        const page = new Page(0, 5);
        page.next();
        expect(page.offset).toBe(5);
        page.next();
        expect(page.offset).toBe(10);
    });

    it('should move to the previous page correctly', () => {
        const page = new Page(10, 5);
        page.previous();
        expect(page.offset).toBe(5);
        page.previous();
        expect(page.offset).toBe(0);
    });

    it('should not allow offset to go below 0', () => {
        const page = new Page(2, 5);
        page.previous();
        expect(page.offset).toBe(0);
        page.previous();
        expect(page.offset).toBe(0); // still 0, cannot go negative
    });

    it('should keep limit unchanged when moving pages', () => {
        const page = new Page(0, 5);
        page.next();
        expect(page.limit).toBe(5);
        page.previous();
        expect(page.limit).toBe(5);
    });
});