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

import { SupportedLanguagesJson } from '../../internal/types/users/users-types';

/**
 * Represents the languages supported by a user.
 *
 * This class provides read-only access to both the general supported languages
 * and the GUI-specific supported languages.
 */
export class SupportedLanguages {
    #supportedLanguages: string[];
    #supportedGuiLanguages?: string[];

    /**
     * Private constructor. Use `SupportedLanguages.fromJson()` to create instances.
     *
     * @param supportedLanguages - Array of supported language codes
     * @param supportedGuiLanguages - Optional array of supported GUI language codes
     */
    private constructor(supportedLanguages: string[], supportedGuiLanguages?: string[]) {
        this.#supportedLanguages = supportedLanguages;
        this.#supportedGuiLanguages = supportedGuiLanguages;
    }

    /**
     * Returns the list of supported languages.
     *
     * @returns An array of language codes
     */
    get supportedLanguages(): string[] {
        return this.#supportedLanguages;
    }

    /**
     * Returns the list of GUI-supported languages, if any.
     *
     * @returns An array of GUI language codes, or `null` if not set
     */
    get supportedGuiLanguages(): string[] | null {
        return this.#supportedGuiLanguages ?? null;
    }

    /**
     * Creates a `SupportedLanguages` instance from a JSON object.
     *
     * @param json - JSON object representing supported languages
     * @returns A new `SupportedLanguages` instance
     */
    /** @internal */

    static fromJson(json: SupportedLanguagesJson): SupportedLanguages {
        return new SupportedLanguages(json.supportedLanguages, json.supportedGuiLanguages);
    }
}
