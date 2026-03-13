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

import { MailBoxCapabilitiesJson, MailBoxJson } from '../../internal/types/messaging/messaging-types';

/**
 * Represents a mailbox in a voice mail system.
 *
 * <p>A mailbox has an identifier, a name, and optional capabilities describing
 * which operations are supported on the mailbox.
 */
export class MailBox {
    #id?: string;
    #name?: string;
    #capabilities?: MailBox.MailBoxCapabilities;

    private constructor(id?: string, name?: string, capabilities?: MailBox.MailBoxCapabilities) {
        this.#id = id;
        this.#name = name;
        this.#capabilities = capabilities;
    }

    /**
     * Get the mailbox identifier.
     *
     * @returns {string} The unique ID of this mailbox
     */
    get id(): string | null {
        return this.#id ?? null;
    }

    /**
     * Get the mailbox name.
     *
     * @returns {string} The name of this mailbox
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Get the mailbox capabilities.
     *
     * @returns {MailBox.MailBoxCapabilities} The capabilities of this mailbox
     */
    get capabilities(): MailBox.MailBoxCapabilities | null {
        return this.#capabilities ?? null;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: MailBoxJson): MailBox {
        return new MailBox(
            json.id,
            json.name,
            json.capabilities ? MailBox.MailBoxCapabilities.fromJson(json.capabilities) : undefined
        );
    }
}

export namespace MailBox {
    /**
     * Represents the capabilities of a mailbox.
     *
     * <p>Each capability indicates whether a certain action (e.g., playing messages,
     * recording, forwarding) is supported by the mailbox.
     */
    export class MailBoxCapabilities {
        #listMessages?: boolean;
        #getMessages?: boolean;
        #getRecord?: boolean;
        #play?: boolean;
        #pause?: boolean;
        #hangup?: boolean;
        #record?: boolean;
        #resume?: boolean;
        #cancel?: boolean;
        #forward?: boolean;
        #callback?: boolean;
        #send?: boolean;
        #events?: boolean;

        private constructor(
            listMessages?: boolean,
            getMessages?: boolean,
            getRecord?: boolean,
            play?: boolean,
            pause?: boolean,
            hangup?: boolean,
            record?: boolean,
            resume?: boolean,
            cancel?: boolean,
            forward?: boolean,
            callback?: boolean,
            send?: boolean,
            events?: boolean
        ) {
            this.#listMessages = listMessages;
            this.#getMessages = getMessages;
            this.#getRecord = getRecord;
            this.#play = play;
            this.#pause = pause;
            this.#hangup = hangup;
            this.#record = record;
            this.#resume = resume;
            this.#cancel = cancel;
            this.#forward = forward;
            this.#callback = callback;
            this.#send = send;
            this.#events = events;
        }

        /**
         * Indicates whether the voicemail server can list messages.
         *
         * @returns {boolean} True if the voicemail server can return the list of messages, false otherwise
         */
        get canListMessages(): boolean {
            return this.#listMessages ?? false;
        }

        /**
         * Indicates whether voice messages can be downloaded.
         *
         * @returns {boolean} True if voice messages can be downloaded, false otherwise
         */
        get canGetMessages(): boolean {
            return this.#getMessages ?? false;
        }

        /**
         * Indicates whether recorded messages can be downloaded.
         *
         * @returns {boolean} True if recorded messages can be downloaded, false otherwise
         */
        get canGetRecord(): boolean {
            return this.#getRecord ?? false;
        }

        /**
         * Indicates whether the voicemail server is capable of playing voice messages.
         *
         * @returns {boolean} True if playback is supported, false otherwise
         */
        get canPlay(): boolean {
            return this.#play ?? false;
        }

        /**
         * Indicates whether playing a voice message can be paused and resumed from the paused position.
         *
         * @returns {boolean} True if pausing is supported, false otherwise
         */
        get canPause(): boolean {
            return this.#pause ?? false;
        }

        /**
         * Indicates whether the media session can be terminated.
         *
         * @returns {boolean} True if hangup is supported, false otherwise
         */
        get canHangup(): boolean {
            return this.#hangup ?? false;
        }

        /**
         * Indicates whether the voicemail server is capable of recording voice messages.
         *
         * @returns {boolean} True if recording is supported, false otherwise
         */
        get canRecord(): boolean {
            return this.#record ?? false;
        }

        /**
         * Indicates whether voice message recording can be resumed after being stopped.
         *
         * @returns {boolean} True if resuming recording is supported, false otherwise
         */
        get canResume(): boolean {
            return this.#resume ?? false;
        }

        /**
         * Indicates whether the current recording can be cancelled.
         *
         * @returns {boolean} True if cancelling is supported, false otherwise
         */
        get canCancel(): boolean {
            return this.#cancel ?? false;
        }

        /**
         * Indicates whether the voicemail server is capable of forwarding voice messages.
         *
         * @returns {boolean} True if forwarding is supported, false otherwise
         */
        get canForward(): boolean {
            return this.#forward ?? false;
        }

        /**
         * Indicates whether the voicemail server can call back the originator of the voice message.
         *
         * @returns {boolean} True if callback is supported, false otherwise
         */
        get canCallback(): boolean {
            return this.#callback ?? false;
        }

        /**
         * Indicates whether a voice message or recording can be sent to recipients.
         *
         * @returns {boolean} True if sending is supported, false otherwise
         */
        get canSend(): boolean {
            return this.#send ?? false;
        }

        /**
         * Indicates whether the voicemail server can send events in case of message deposit or removal.
         *
         * @returns {boolean} True if event notifications are supported, false otherwise
         */
        get canSendEvents(): boolean {
            return this.#events ?? false;
        }

        /** @internal */

        static fromJson(json: MailBoxCapabilitiesJson): MailBoxCapabilities {
            return new MailBoxCapabilities(
                json.listMessages,
                json.getMessages,
                json.getRecord,
                json.play,
                json.pause,
                json.hangup,
                json.record,
                json.resume,
                json.cancel,
                json.forward,
                json.callback,
                json.send,
                json.events
            );
        }

        /** @internal */

        toJson(): MailBoxJson['capabilities'] {
            return {
                listMessages: this.#listMessages,
                getMessages: this.#getMessages,
                getRecord: this.#getRecord,
                play: this.#play,
                pause: this.#pause,
                hangup: this.#hangup,
                record: this.#record,
                resume: this.#resume,
                cancel: this.#cancel,
                forward: this.#forward,
                callback: this.#callback,
                send: this.#send,
                events: this.#events,
            };
        }
    }
}
