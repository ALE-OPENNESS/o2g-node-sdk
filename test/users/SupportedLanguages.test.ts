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

import { SupportedLanguages } from "../../src/types/users/supported-languages";



describe("SupportedLanguages", () => {

    it("should create instance from full JSON", () => {
        const jsonString = `{
            "supportedLanguages": ["en", "fr", "de"],
            "supportedGuiLanguages": ["en", "fr"]
        }`;

        const langs = SupportedLanguages.fromJson(JSON.parse(jsonString));

        expect(langs.supportedLanguages).toEqual(["en", "fr", "de"]);
        expect(langs.supportedGuiLanguages).toEqual(["en", "fr"]);
    });

    it("should handle missing GUI languages", () => {
        const jsonString = `{
            "supportedLanguages": ["en", "fr", "de"]
        }`;

        const langs = SupportedLanguages.fromJson(JSON.parse(jsonString));

        expect(langs.supportedLanguages).toEqual(["en", "fr", "de"]);
        expect(langs.supportedGuiLanguages).toBeNull();
    });

    it("should handle empty supportedLanguages array", () => {
        const jsonString = `{
            "supportedLanguages": []
        }`;

        const langs = SupportedLanguages.fromJson(JSON.parse(jsonString));

        expect(langs.supportedLanguages).toEqual([]);
        expect(langs.supportedGuiLanguages).toBeNull();
    });
});