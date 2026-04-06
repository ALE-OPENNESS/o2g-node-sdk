/*
 * Copyright 2021 ALE International
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

import MessagingRest from '../internal/rest/messaging-rest';
import { MailBox } from '../types/messaging/mailbox';
import { MailBoxInfo } from '../types/messaging/mailbox-info';
import { VoiceMessage } from '../types/messaging/voice-message';

/**
 * Messaging service provides access to the user's voice mail box.
 * It is possible using this service to connect to the voice mail box, retrieve
 * the information and the list of voice mails, and manage the mail box. Using
 * this service requires having a <b>TELEPHONY_ADVANCED</b> license.
 * <p>
 * It is possible to download a voice mail as a wav file and to delete existing messages.
 */
export class Messaging {
    #messagingRest: MessagingRest;

    /**
     * @internal
     */
    constructor(messagingRest: MessagingRest) {
        this.#messagingRest = messagingRest;
    }

    /**
     * Gets the specified user's mailboxes. This is the logical first step to
     * access further operations on the voice mail feature.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param loginName the user login name
     * @returns the list of {@link MailBox} objects on success; `null` otherwise.
     */
    async getMailboxes(loginName: string | null = null): Promise<MailBox[] | null> {
        return this.#messagingRest.getMailboxes(loginName);
    }

    /**
     * Gets the information on the specified mail box.
     * <p>
     * The `password` is optional. If not set, the user password is used to
     * connect to the voicemail. This is only possible if the OmniPCX Enterprise
     * administrator has configured the same password for the user and their mailbox.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailBoxId the mail box identifier given in a {@link MailBox} object
     * @param password  the mail box password
     * @param loginName the user login name
     * @returns the {@link MailBoxInfo} on success; `null` otherwise.
     */
    async getMailboxInfo(
        mailBoxId: string,
        password: string | null = null,
        loginName: string | null = null
    ): Promise<MailBoxInfo | null> {
        return this.#messagingRest.getMailboxInfo(mailBoxId, password, loginName);
    }

    /**
     * Gets the list of voice messages in the specified mail box.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * @example
     * ```typescript
     * // Get all voice messages in the mailbox
     * const messages = await O2G.messaging.getVoiceMessages("mbx001");
     *
     * // Get only unread messages
     * const newMessages = await O2G.messaging.getVoiceMessages("mbx001", true);
     *
     * // Get a page of 10 messages starting from the 20th
     * const page = await O2G.messaging.getVoiceMessages("mbx001", false, 20, 10);
     * ```
     *
     * @param mailboxId the mail box identifier given in a {@link MailBox} object
     * @param newOnly   if `true`, returns only unread voice messages
     * @param offset    the offset from which to start retrieving the voice message list
     * @param limit     the maximum number of items to return
     * @param loginName the user login name
     * @returns the list of {@link VoiceMessage} objects on success; `null` otherwise.
     */
    async getVoiceMessages(
        mailboxId: string,
        newOnly: boolean = false,
        offset: number | null = null,
        limit: number | null = null,
        loginName: string | null = null
    ): Promise<VoiceMessage[] | null> {
        return this.#messagingRest.getVoiceMessages(mailboxId, newOnly, offset, limit, loginName);
    }

    /**
     * Deletes the specified voice message.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param loginName   the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteVoiceMessages
     */
    async deleteVoiceMessage(
        mailboxId: string,
        voicemailId: string,
        loginName: string | null = null
    ): Promise<boolean> {
        return this.#messagingRest.deleteVoiceMessage(mailboxId, voicemailId, loginName);
    }

    /**
     * Acknowledges the specified voice message.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param loginName   the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async acknowledgeVoiceMessage(
        mailboxId: string,
        voicemailId: string,
        loginName: string | null = null
    ): Promise<boolean> {
        return this.#messagingRest.acknowledgeVoiceMessage(mailboxId, voicemailId, loginName);
    }

    /**
     * Deletes the specified list of voice messages.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @param mailboxId the mail box identifier given in a {@link MailBox} object
     * @param msgIds    the list of voice mail identifiers to delete
     * @param loginName the user login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deleteVoiceMessage
     */
    async deleteVoiceMessages(mailboxId: string, msgIds: string[], loginName: string | null = null): Promise<boolean> {
        return this.#messagingRest.deleteVoiceMessages(mailboxId, msgIds, loginName);
    }

    /**
     * Downloads a voice mail as a wav file.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     *
     * @example
     * ```typescript
     * // Download to a specific path
     * const path = await O2G.messaging.downloadVoiceMessage("mbx001", "msg42", "/tmp/voicemail.wav");
     *
     * // Let the SDK choose the destination path
     * const autoPath = await O2G.messaging.downloadVoiceMessage("mbx001", "msg42", null);
     * if (autoPath) {
     *     console.log(`Downloaded to: ${autoPath}`);
     * }
     * ```
     *
     * @param mailboxId   the mail box identifier given in a {@link MailBox} object
     * @param voicemailId the voice mail identifier given in a {@link VoiceMessage} object
     * @param wavPath     an optional destination file path for the downloaded wav file
     * @param loginName   the user login name
     * @returns the path to the downloaded wav file on success; `null` otherwise.
     */
    async downloadVoiceMessage(
        mailboxId: string,
        voicemailId: string,
        wavPath: string | null,
        loginName: string | null = null
    ): Promise<string | null> {
        return this.#messagingRest.downloadVoiceMessage(mailboxId, voicemailId, wavPath, loginName);
    }
}
