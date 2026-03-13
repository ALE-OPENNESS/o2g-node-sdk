/*
 * Copyright 2025 ALE International
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

import { OnUserCreatedJson, OnUserDeletedJson, OnUserInfoChangedJson } from '../../internal/types/users/users-types';
import { User } from './user';

/**
 * Event that is emitted when a new user has been created in the system.
 *
 * <p>
 * This event provides access to the newly created {@link User} object.
 * </p>
 */
export class OnUserCreated {
    #user: User;

    /**
     * Creates a new {@link OnUserCreated} event instance.
     *
     * @param user - The newly created {@link User} instance
     * @private
     */
    private constructor(user: User) {
        this.#user = user;
    }

    /**
     * The user that was created.
     *
     * @returns The {@link User} object representing the new user
     */
    get user(): User {
        return this.#user;
    }

    /**
     * Creates a new {@link OnUserCreated} event from a JSON object.
     *
     * @param json - JSON object representing the event, following {@link OnUserCreatedJson} structure
     * @returns A fully constructed {@link OnUserCreated} instance
     */
    /** @internal */

    static fromJson(json: OnUserCreatedJson): OnUserCreated {
        return new OnUserCreated(User.fromJson(json.user));
    }
}

/**
 * Event that is emitted when a user has been deleted from the system.
 *
 * <p>
 * This event provides the login name of the user that was removed.
 * </p>
 */
export class OnUserDeleted {
    #loginName: string;

    /**
     * Creates a new {@link OnUserDeleted} event instance.
     *
     * @param loginName - The login name of the deleted user
     * @private
     */
    private constructor(loginName: string) {
        this.#loginName = loginName;
    }

    /**
     * Returns the login name of the deleted user.
     *
     * @returns The login name as a string
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * Creates a new {@link OnUserDeleted} event from a JSON object.
     *
     * @param json - JSON object representing the event, following {@link OnUserDeletedJson} structure
     * @returns A fully constructed {@link OnUserDeleted} instance
     */
    /** @internal */

    static fromJson(json: OnUserDeletedJson): OnUserDeleted {
        return new OnUserDeleted(json.loginName);
    }
}

/**
 * Event that is emitted when a user's information has been modified in the system.
 *
 * <p>
 * This event provides both the login name of the modified user and the updated {@link User} object.
 * </p>
 */
export class OnUserInfoChanged {
    #loginName?: string;
    #user: User;

    /**
     * Creates a new {@link OnUserInfoChanged} event instance.
     *
     * @param loginName - The login name of the modified user
     * @param user - The updated {@link User} object
     * @private
     */
    private constructor(loginName: string | undefined, user: User) {
        this.#loginName = loginName;
        this.#user = user;
    }

    /**
     * Returns the login name of the modified user.
     *
     * @returns The login name as a string
     */
    get loginName(): string | null {
        return this.#loginName ?? null;
    }

    /**
     * Returns the updated user object.
     *
     * @returns The {@link User} object representing the modified user
     */
    get user(): User {
        return this.#user;
    }

    /**
     * Creates a new {@link OnUserInfoChanged} event from a JSON object.
     *
     * @param json - JSON object representing the event, following {@link OnUserInfoChangedJson} structure
     * @returns A fully constructed {@link OnUserInfoChanged} instance
     */
    /** @internal */

    static fromJson(json: OnUserInfoChangedJson): OnUserInfoChanged {
        return new OnUserInfoChanged(json.loginName, User.fromJson(json.user));
    }
}
