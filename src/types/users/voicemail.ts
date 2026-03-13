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

import { VoicemailType } from './voicemail-type';

/**
 * Represents a voicemail associated with a user.
 * <p>
 * Provides the voicemail number and its type. Available via the
 * {@link User} object returned by {@link Users.getByLoginName} or
 * {@link Users.getByCompanyPhone}.
 */
export class Voicemail {
    #number: string;
    #type: VoicemailType;

    /**
     * @internal
     */
    private constructor(number: string, type: VoicemailType) {
        this.#number = number;
        this.#type = type;
    }

    /**
     * The voicemail number.
     */
    get number(): string {
        return this.#number;
    }

    /**
     * The voicemail type.
     */
    get type(): VoicemailType {
        return this.#type;
    }

    /**
     * @internal
     */
    /** @internal */
    static fromJson(json: { number: string; type: string }): Voicemail {
        return new Voicemail(json.number, VoicemailType[json.type as keyof typeof VoicemailType]);
    }
}
