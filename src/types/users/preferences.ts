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

import { PreferencesJson } from '../../internal/types/users/users-types';

/**
 * Represents the preferred settings of a user.
 *
 * This class provides read-only access to language preferences for both the GUI
 * and the OXE system.
 */
export class Preferences {
    #guiLanguage?: string;
    #oxeLanguage?: string;

    /**
     * Private constructor. Use `Preferences.fromJson()` to create instances.
     *
     * @param guiLanguage - Optional preferred GUI language code
     * @param oxeLanguage - Optional preferred OXE language code
     */
    private constructor(guiLanguage?: string, oxeLanguage?: string) {
        this.#guiLanguage = guiLanguage;
        this.#oxeLanguage = oxeLanguage;
    }

    /**
     * Returns the preferred GUI language.
     *
     * @returns The GUI language code, or `null` if not set
     */
    get guiLanguage(): string | null {
        return this.#guiLanguage ?? null;
    }

    /**
     * Returns the preferred OXE language.
     *
     * @returns The OXE language code, or `null` if not set
     */
    get oxeLanguage(): string | null {
        return this.#oxeLanguage ?? null;
    }

    /**
     * Creates a `Preferences` instance from a JSON object.
     *
     * @param json - JSON object representing user preferences
     * @returns A new `Preferences` instance
     */
    /** @internal */

    static fromJson(json: PreferencesJson): Preferences {
        return new Preferences(json.guiLanguage, json.oxeLanguage);
    }
}
