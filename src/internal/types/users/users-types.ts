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

import { DeviceJson } from '../common/common-types';

/** @internal */
export type UserJson = {
    /**
     * The user company phone. This company phone number is the phone
     * number of the main device when the user has a multi-device configuration.
     */
    companyPhone?: string;

    /**
     * The user's first name.
     */
    firstName?: string;

    /**
     * The user's last name.
     */
    lastName?: string;

    /**
     * The user's login.
     */
    loginName?: string;

    /**
     * The user's voice mail information.
     */
    voicemail?: {
        /**
         * The voice mail number.
         */
        number: string;

        /**
         * The voice mail type.
         */
        type: string;
    };

    /**
     * The user's devices.
     */
    devices?: DeviceJson[];

    /**
     * The OmniPCX Enterprise node this user is configured on.
     */
    nodeId?: string;

    /**
     * User external login
     */
    externalLogin?: string;
};

/** @internal */
export type PreferencesJson = {
    /**
     * The preferred GUI language. This is the language the user prefers
     * when it uses an application with a graphical user interface.
     */
    guiLanguage?: string;

    /**
     * The prefered OXE language. This is the language the user prefers when
     * it uses his phone set.
     */
    oxeLanguage?: string;
};

/**
 * SupportedLanguages represents the languages supported by a user.
 */
/** @internal */
export type SupportedLanguagesJson = {
    /**
     * The supported languages.
     */
    supportedLanguages: string[];

    /**
     * The supported GUI languages.
     */
    supportedGuiLanguages?: string[];
};

/**
 * This notification indicates that a new call has been created.
 */
/** @internal */
export type OnUserCreatedJson = {
    /**
     * The created user
     */
    user: UserJson;
};

/**
 * This event is sent when user is deleted (only for administrator).
 */
/** @internal */
export type OnUserDeletedJson = {
    /**
     * the login name of the deleted user.
     */
    loginName: string;
};

/**
 * This event is sent on any change on the user's data.
 */
/** @internal */
export type OnUserInfoChangedJson = {
    /**
     * the login name of the modified user.
     */
    loginName?: string;

    /**
     * The modified user
     */
    user: UserJson;
};
