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

import { MailBoxInfoJson } from '../../internal/types/messaging/messaging-types';

/**
 * MailBoxInfo provides information about the user's mailbox.
 *
 * <p>This class allows access to the total number of voice messages,
 * the number of new (unread) voice messages, and the mailbox storage usage.
 */
export class MailBoxInfo {
    #totalVoiceMsg?: number;
    #newVoiceMsg?: number;
    #storageUsage?: number;

    /**
     * @private
     * @param {number} [totalVoiceMsg] Total number of voice messages in the mailbox
     * @param {number} [newVoiceMsg] Number of new (unread) voice messages
     * @param {number} [storageUsage] Storage usage of the mailbox in bytes
     */
    private constructor(totalVoiceMsg?: number, newVoiceMsg?: number, storageUsage?: number) {
        this.#totalVoiceMsg = totalVoiceMsg;
        this.#newVoiceMsg = newVoiceMsg;
        this.#storageUsage = storageUsage;
    }

    /**
     * Get the total number of voice messages in the mailbox.
     *
     * @returns {number} Total voice messages (0 if unspecified)
     */
    get totalVoiceMsg(): number {
        return this.#totalVoiceMsg ?? 0;
    }

    /**
     * Get the number of new (unread) voice messages.
     *
     * @returns {number} New voice messages (0 if unspecified)
     */
    get newVoiceMsg(): number {
        return this.#newVoiceMsg ?? 0;
    }

    /**
     * Get the mailbox storage usage in bytes.
     *
     * @returns {number} Storage usage in bytes (0 if unspecified)
     */
    get storageUsage(): number {
        return this.#storageUsage ?? 0;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: MailBoxInfoJson): MailBoxInfo {
        return new MailBoxInfo(json.totalVoiceMsg, json.newVoiceMsg, json.storageUsage);
    }

    /**
     * @ignore
     */
    /** @internal */

    toJson(): MailBoxInfoJson {
        return {
            totalVoiceMsg: this.#totalVoiceMsg,
            newVoiceMsg: this.#newVoiceMsg,
            storageUsage: this.#storageUsage,
        };
    }
}
