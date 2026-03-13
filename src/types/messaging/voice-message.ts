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

import { VoiceMessageJson } from '../../internal/types/messaging/messaging-types';
import { PartyInfo } from '../common/party-info';

/**
 * VoiceMessage represents a single message stored in a user's voice mailbox.
 *
 * <p>This class provides information about the message, including its identifier,
 * the party who left the message, duration, date, unread status, and priority.
 */
export class VoiceMessage {
    #voicemailId: string;
    #from?: PartyInfo;
    #duration: number;
    #date: Date;
    #unread: boolean;
    #highPriority: boolean;

    /**
     * @private
     * @param {string} voicemailId Unique identifier of the voicemail
     * @param {PartyInfo | undefined} from Party who left the message (optional)
     * @param {number} duration Duration of the message in seconds
     * @param {Date} date Date when the message was deposited
     * @param {boolean} unread Whether the message is unread
     * @param {boolean} highPriority Whether the message has high priority
     */
    private constructor(
        voicemailId: string,
        from: PartyInfo | undefined,
        duration: number,
        date: Date,
        unread: boolean,
        highPriority: boolean
    ) {
        this.#voicemailId = voicemailId;
        this.#from = from;
        this.#duration = duration;
        this.#date = date;
        this.#unread = unread;
        this.#highPriority = highPriority;
    }

    /**
     * Get the unique identifier of the voicemail.
     *
     * @returns {string} Voicemail ID
     */
    get voicemailId(): string {
        return this.#voicemailId;
    }

    /**
     * Get the party who left the message.
     *
     * @returns {PartyInfo | null} Party information or null if not available
     */
    get from(): PartyInfo | null {
        return this.#from ?? null;
    }

    /**
     * Get the duration of the message in seconds.
     *
     * @returns {number} Duration in seconds
     */
    get duration(): number {
        return this.#duration;
    }

    /**
     * Get the date when the message was deposited.
     *
     * @returns {Date} Date of the message
     */
    get date(): Date {
        return this.#date;
    }

    /**
     * Check if the message is unread.
     *
     * @returns {boolean} True if the message is unread, false otherwise
     */
    get unread(): boolean {
        return this.#unread;
    }

    /**
     * Check if the message has high priority.
     *
     * @returns {boolean} True if the message is high priority, false otherwise
     */
    get highPriority(): boolean {
        return this.#highPriority;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: VoiceMessageJson): VoiceMessage {
        return new VoiceMessage(
            json.voicemailId,
            json.from ? PartyInfo.fromJson(json.from) : undefined,
            json.duration,
            new Date(json.date),
            json.unread,
            json.highPriority
        );
    }
}
