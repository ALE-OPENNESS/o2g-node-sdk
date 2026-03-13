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

import { DeviceType } from '../../../types/common/device-type';
import { MainType } from '../../../types/common/main-type';

/** @internal */
export type O2GAuthenticateResult = {
    credential: string;
    internalUrl: string;
    publicUrl: string;
};
/** @internal */
export type Version = {
    id: string;
    status: string;
    publicUrl: string;
    internalUrl: string;
};
/** @internal */
export type ServerInfo = {
    productName: string;
    productType: string;
    productVersion: {
        major: string;
        minor: string;
    };
    haMode: boolean;
};
/** @internal */
export type RoxeRestApiDescriptor = {
    serverInfo: ServerInfo;
    versions: Version[];
};
/** @internal */
export type Service = {
    serviceName: string;
    serviceVersion: string;
    relativeUrl: string;
};

/** @internal */
export type UserSession = {
    sessionId: string;
    creationDate: string;
    timeToLive: BigInteger;
};

/** @internal */
export type SessionInfo = {
    admin: boolean;
    login: string;
    timeToLive: number;
    publicBaseUrl: string;
    privateBaseUrl: string;
    services: Service[];
    creationDate: string;
    expirationDate: string;
    otherSessions: UserSession[];
};
/** @internal */
export type SubscriptionResult = {
    subscriptionId: string;
    message: string;
    publicPollingUrl: string;
    privatePollingUrl: string;
    status: string;
};

/**
 * Identifier represents the information used to uniquely identify a participant; either the login name or the phone number.
 */
/** @internal */
export type IdentifierJson = {
    /**
     * Login name.
     */
    loginName: string;

    /**
     * Company phone number.
     */
    phoneNumber: string;

    /**
     * True is this phone number is part of a multi-device configuration.
     * @since 2.7.3
     */
    multiLine: boolean;
};

/**
 * PartyInfo represents a party involved in a call.
 */
/** @internal */
export type PartyInfoJson = {
    /**
     * This participant's identifier; Either the login name or the phone number.
     */
    id: IdentifierJson;

    /**
     * This participant's first name.
     */
    firstName?: string;

    /**
     * This participant's last name.
     */
    lastName?: string;

    /**
     * This participant's display name.
     * If 'firstName' and 'lastName' are filled, the 'displayName' is 'null'.
     */
    displayName?: string;

    /**
     * This participant's type.
     */
    type?: {
        /**
         * The main type.
         */
        main: MainType;

        /**
         * The sub-type.
         */
        subType?: string;
    };
};

/**
 * Device represents a device of a user.
 */
/** @internal */
export type DeviceJson = {
    /**
     * The device type
     */
    type: DeviceType;

    /**
     * The device identifier which is used to identify the device in telephony requests and events.
     */
    id: string;

    /**
     * The device sub-type. When set, the device sub-type provide information about the device model.
     */
    subType?: string;
};

/** @internal */
export enum DayOfWeekJson {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday',
}
