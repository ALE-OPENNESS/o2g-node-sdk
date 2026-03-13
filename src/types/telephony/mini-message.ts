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

import { MiniMessageJson } from '../../internal/types/telephony/telephony-types';

/**
 * Represents a mini message exchanged between two users.
 *
 * A mini message typically includes the sender, the date and time it was sent,
 * and the message text itself. Instances of this class are **immutable** once created.
 *
 */
export class MiniMessage {
    #sender?: string;
    #dateTime?: Date;
    #message?: string;

    /**
     * Private constructor. Use `MiniMessage.fromJson()` to create instances.
     *
     * @param sender - Optional sender of the message
     * @param dateTime - Optional date/time when the message was sent
     * @param message - Optional text of the message
     */
    private constructor(sender?: string, dateTime?: Date, message?: string) {
        this.#sender = sender;
        this.#dateTime = dateTime;
        this.#message = message;
    }

    /**
     * Returns the sender of this mini message.
     *
     * @returns The sender's name or `null` if not set
     */
    get sender(): string | null {
        return this.#sender ?? null;
    }

    /**
     * Returns the date and time when this mini message was sent.
     *
     * @returns A `Date` object, or `null` if not set
     */
    get date(): Date | null {
        return this.#dateTime ?? null;
    }

    /**
     * Returns the text content of this mini message.
     *
     * @returns The message text, or `null` if not set
     */
    get message(): string | null {
        return this.#message ?? null;
    }

    /**
     * Creates a `MiniMessage` instance from a JSON object.
     *
     * @param json - JSON object representing a mini message
     * @returns A new `MiniMessage` instance
     */
    /** @internal */

    static fromJson(json: MiniMessageJson): MiniMessage {
        return new MiniMessage(json.sender, json.dateTime ? new Date(json.dateTime) : undefined, json.message);
    }
}
