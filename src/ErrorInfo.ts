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

/**
 * Represents an O2G host.
 * <p>
 * An O2G host can be reacheable from the local network, or from a wide area
 * network. In this case, enterprise access can be secured by a reverse proxy
 * border element.
 */
export type ErrorInfo = {
    httpStatus?: string;
    code?: number;
    helpMessage?: string;
    type?: string;
    innerMessage?: string;
    canRetry?: boolean;
    routing?: RoutingErrorInfo;
    telephony?: TelephonyErrorInfo;
    userPreferences?: UserPreferencesErrorInfo;
};

export interface RoutingErrorInfo {
    errorType: RoutingErrorType;
    errorCause: RoutingErrorCause;
    message?: string;
}

export enum RoutingErrorType {
    Unknown = 'UNKNOWN',
    BadParameterValue = 'BAD_PARAMETER_VALUE',
    Unauthorized = 'UNAUTHORIZED',
    InvalidOperation = 'INVALID_OPERATION',
    IncompletePhoneNumber = 'INCOMPLETE_PHONE_NUMBER',
    UnknownPhoneNumber = 'UNKNOWN_PHONE_NUMBER',
}

export enum RoutingErrorCause {
    Unknown = 'UNKNOWN',
    BadPhoneNumberFormat = 'BAD_PHONE_NUMBER_FORMAT',
    InvalidCurrentDevice = 'INVALID_CURRENT_DEVICE',
    InvalidForwardRoute = 'INVALID_FORWARD_ROUTE',
    InvalidOverflowRoute = 'INVALID_OVERFLOW_ROUTE',
    NullOrEmptyParameter = 'NULL_OR_EMPTY_PARAMETER',
    NullParameter = 'NULL_PARAMETER',
    UnauthorizedCancelOverflow = 'UNAUTHORIZED_CANCEL_OVERFLOW',
    UnauthorizedNotAUser = 'UNAUTHORIZED_NOT_A_USER',
    UnauthorizedOverflow = 'UNAUTHORIZED_OVERFLOW',
    UnauthorizedPhoneNumber = 'UNAUTHORIZED_PHONE_NUMBER',
}

export interface TelephonyErrorInfo {
    errorType: TelephonyErrorType;
    errorCause: TelephonyErrorCause;
    message?: string;
}

export enum TelephonyErrorType {
    Unknown = 'UNKNOWN',
    CallReferenceNotFound = 'CALL_REFERENCE_NOT_FOUND',
    MegNotFound = 'LEG_NOT_FOUND',
    BasParameterValue = 'BAD_PARAMETER_VALUE',
    IncompatibleWithState = 'INCOMPATIBLE_WITH_STATE',
    ServiceNotProvided = 'SERVICE_NOT_PROVIDED',
    ServiceUnavailable = 'SERVICE_UNAVAILABLE',
    Initialization = 'INITIALIZATION',
    Unauthorized = 'UNAUTHORIZED',
    CallserverError = 'CALL_SERVER_ERROR',
    RequestTimeout = 'REQUEST_TIMEOUT',
}

export enum TelephonyErrorCause {
    Unknown = 'UNKNOWN',
    InvalidCalling = 'INVALID_CALLING',
    InvalidDestination = 'INVALID_DESTINATION',
    InvalidCallId = 'INVALID_CALL_ID',
    InvalidConnectionState = 'INVALID_CONNECTION_STATE',
    DeviceOutOfService = 'DEVICE_OUT_OF_SERVICE',
    InvalidDevice = 'INVALID_DEVICE',
    InvalidDeviceState = 'INVALID_DEVICE_STATE',
    InvalidData = 'INVALID_DATA',
    ResourceBusy = 'RESOURCE_BUSY',
}

export interface UserPreferencesErrorInfo {
    userPreferencesError: UserPreferencesErrorType;
    userPreferencesParameter: UserPreferenceParameter;
}

export enum UserPreferencesErrorType {
    Unknown = 'UNKNOWN',
    WrongValue = 'WRONG_VALUE',
    WrongNumberFormat = 'WRONG_NUMBER_FORMAT',
}

export enum UserPreferenceParameter {
    GuiLanguage = 'GUI_LANGUAGE',
    Unknown = 'UNKNOWN',
}
