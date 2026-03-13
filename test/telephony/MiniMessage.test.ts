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

import { MiniMessage } from "../../src/types/telephony/mini-message";



describe("MiniMessage", () => {
    it("should correctly create a MiniMessage from JSON", () => {
        const jsonString = `{
            "sender": "JohnDoe",
            "dateTime": "2026-02-25T10:30:00Z",
            "message": "Hello, world!"
        }`;

        const msg = MiniMessage.fromJson(JSON.parse(jsonString));

        expect(msg.sender).toBe("JohnDoe");
        expect(msg.date).toEqual(new Date("2026-02-25T10:30:00Z"));
        expect(msg.message).toBe("Hello, world!");
    });

    it("should handle missing optional fields", () => {
        const jsonString = `{
            "sender": "JaneDoe"
        }`;

        const msg = MiniMessage.fromJson(JSON.parse(jsonString));

        expect(msg.sender).toBe("JaneDoe");
        expect(msg.date).toBeNull();
        expect(msg.message).toBeNull();
    });

    it("should return null for all getters if created with empty JSON", () => {
        const msg = MiniMessage.fromJson({});

        expect(msg.sender).toBeNull();
        expect(msg.date).toBeNull();
        expect(msg.message).toBeNull();
    });
});