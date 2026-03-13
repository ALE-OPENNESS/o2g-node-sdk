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

import { Tag } from "../../../src/types/telephony/call/tag";


describe('Tag', () => {

    it('should create a Tag with all fields', () => {
        const jsonString = `{
            "name": "Priority",
            "value": "High",
            "visibilities": ["Agent", "Supervisor"]
        }`;

        const tag = Tag.fromJson(JSON.parse(jsonString));

        expect(tag.name).toBe("Priority");
        expect(tag.value).toBe("High");
        expect(tag.visibilities).toEqual(["Agent", "Supervisor"]);
    });

    it('should handle missing optional fields', () => {
        const jsonString = `{
            "name": "Info"
        }`;

        const tag = Tag.fromJson(JSON.parse(jsonString));

        expect(tag.name).toBe("Info");
        expect(tag.value).toBeNull();
        expect(tag.visibilities).toBeNull();
    });

    it('should handle empty visibilities', () => {
        const jsonString = `{
            "name": "Note",
            "visibilities": []
        }`;

        const tag = Tag.fromJson(JSON.parse(jsonString));

        expect(tag.name).toBe("Note");
        expect(tag.value).toBeNull();
        expect(tag.visibilities).toEqual([]);
    });
});