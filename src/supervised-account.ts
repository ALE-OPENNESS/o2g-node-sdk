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

enum SupervisedAccountType {
    LOGIN_NAME = 'LOGIN_NAME',
    PHONE_NUMBER = 'PHONE_NUMBER',
}

/**
 * Represents a supervised account when an administrator opens a supervised session.
 *
 * ## Supervised Session
 * A supervised session is opened by a supervisor (administrator) using their credentials
 * and the identification of a target user or another administrator (login name or phone number).
 *
 * If the session is successfully opened, the supervisor's credentials will be used in all subsequent
 * requests to identify the session, the supervised user, or the supervised administrator.
 *
 * After opening, a supervised session can be used like a normal user session or an administrator session.
 * In other words, this allows a supervisor to operate as the supervised user or administrator for services
 * that rely on the session.
 *
 * @see Application.login
 */
export class SupervisedAccount {
    #type: SupervisedAccountType;
    #id: string;

    /**
     * Private constructor. Use static methods to create a SupervisedAccount.
     * @param type the type of supervised account (phone number or login name)
     * @param id the identifier for the supervised account
     */
    private constructor(type: SupervisedAccountType, id: string) {
        this.#id = id;
        this.#type = type;
    }

    /**
     * Creates a `SupervisedAccount` using the supervised user's phone number.
     *
     * @param phoneNumber - The phone number of the supervised user.
     * @returns A `SupervisedAccount` representing the supervised user.
     */
    static withPhoneNumber(phoneNumber: string): SupervisedAccount {
        return new SupervisedAccount(SupervisedAccountType.PHONE_NUMBER, phoneNumber);
    }

    /**
     * Creates a `SupervisedAccount` using the supervised user's login name.
     *
     * @param loginName - The login name of the supervised user.
     * @returns A `SupervisedAccount` representing the supervised user.
     */
    static withLoginName(loginName: string): SupervisedAccount {
        return new SupervisedAccount(SupervisedAccountType.LOGIN_NAME, loginName);
    }

    /** @ignore */
    /** @internal */
    toJson() {
        return {
            id: this.#id,
            type: this.#type,
        };
    }
}
