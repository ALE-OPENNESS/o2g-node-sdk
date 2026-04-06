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

import EventEmitter from 'events';
import UsersRest from '../internal/rest/users-rest';
import { EventRegistry } from '../events/event-dispatcher';
import { OnUserCreated, OnUserDeleted, OnUserInfoChanged } from '../types/users/users-events';
import { User } from '../types/users/user';
import { SupportedLanguages } from '../types/users/supported-languages';
import { Preferences } from '../types/users/preferences';

/**
 * The User service allows:
 * <ul>
 * <li>an administrator to retrieve the list of O2G users.</li>
 * <li>a user to get information on another user account.</li>
 * <li>a user to change their password or preferences such as supported language.</li>
 * </ul>
 *
 * @example
 * ```typescript
 * // Listen for user lifecycle events
 * O2G.users.on(Users.ON_USER_CREATED, (event) => {
 *     console.log("User created:", event.loginName);
 * });
 * O2G.users.on(Users.ON_USER_DELETED, (event) => {
 *     console.log("User deleted:", event.loginName);
 * });
 * O2G.users.on(Users.ON_USER_INFO_CHANGED, (event) => {
 *     console.log("User info changed:", event.loginName);
 * });
 *
 * // Look up a user by login name
 * const user = await O2G.users.getByLoginName("jdoe");
 * console.log(`${user?.firstName} ${user?.lastName}`);
 *
 * // Look up a user by their extension number
 * const userByPhone = await O2G.users.getByCompanyPhone("60200");
 *
 * // Change the current user's password
 * await O2G.users.changePassword("jdoe", "oldPass", "newPass");
 * ```
 */
export class Users extends EventEmitter {
    #usersRest: UsersRest;

    /**
     * Raised on creation of a user.
     * @event
     */
    static readonly ON_USER_CREATED = 'OnUserCreated';

    /**
     * Raised when a user is deleted.
     * @event
     */
    static readonly ON_USER_DELETED = 'OnUserDeleted';

    /**
     * Raised on any change on the user's data.
     * @event
     */
    static readonly ON_USER_INFO_CHANGED = 'OnUserInfoChanged';

    /**
     * @internal
     */
    constructor(usersRest: UsersRest, eventRegistry: EventRegistry) {
        super();
        this.#usersRest = usersRest;

        eventRegistry.register(this, Users.ON_USER_CREATED, OnUserCreated);
        eventRegistry.register(this, Users.ON_USER_INFO_CHANGED, OnUserInfoChanged);
        eventRegistry.register(this, Users.ON_USER_DELETED, OnUserDeleted);
    }

    /**
     * Retrieves a list of user login names from the connected OmniPCX Enterprise nodes.
     * <p>
     * If `nodeIds` is `null`, retrieves the login names from all connected nodes.
     * This method is generally used by an administrator. If used by a user, `nodeIds`
     * must be set to `null` and `onlyACD` to `false`, in which case only the current
     * user's login name is retrieved.
     *
     * @example
     * ```typescript
     * // Administrator — get all users from all nodes
     * const allLogins = await O2G.users.getLogins();
     *
     * // Administrator — get all users from a specific node
     * const nodeLogins = await O2G.users.getLogins([1]);
     *
     * // Administrator — get only ACD operators (agents and supervisors)
     * const acdLogins = await O2G.users.getLogins(null, true);
     *
     * // Administrator — get only users with an external login
     * const extLogins = await O2G.users.getLogins(null, false, true);
     *
     * // Regular user — returns only the current user's login name
     * const myLogin = await O2G.users.getLogins(null, false);
     * ```
     *
     * @param nodeIds          list of OXE node ids to restrict the query to.
     *                         Only valid for an administrator session.
     * @param onlyACD          if `true`, selects only ACD operators (agents or supervisors).
     *                         Only valid for an administrator session.
     * @param onlyWithExtLogin if `true`, selects only users with an external login.
     *                         Only valid for an administrator session.
     * @returns the list of user login names on success; `null` otherwise.
     */
    async getLogins(
        nodeIds: number[] | null = null,
        onlyACD: boolean = false,
        onlyWithExtLogin: boolean = false
    ): Promise<string[] | null> {
        return await this.#usersRest.getLogins(nodeIds, onlyACD, onlyWithExtLogin);
    }

    /**
     * Retrieves the information of a user identified by their login name.
     *
     * @param loginName the user login name
     * @returns the {@link User} information on success; `null` otherwise.
     */
    async getByLoginName(loginName: string): Promise<User | null> {
        return await this.#usersRest.getByLoginName(loginName);
    }

    /**
     * Retrieves the information of a user identified by their company extension number.
     *
     * @param companyPhone the user extension number
     * @returns the {@link User} information on success; `null` otherwise.
     */
    async getByCompanyPhone(companyPhone: string): Promise<User | null> {
        return await this.#usersRest.getByCompanyPhone(companyPhone);
    }

    /**
     * Returns the supported languages for the specified user.
     *
     * @param loginName the user login name
     * @returns the {@link SupportedLanguages} on success; `null` otherwise.
     */
    async getSupportedLanguages(loginName: string): Promise<SupportedLanguages | null> {
        return await this.#usersRest.getSupportedLanguages(loginName);
    }

    /**
     * Returns the preferences of the specified user.
     *
     * @param loginName the user login name
     * @returns the {@link Preferences} on success; `null` otherwise.
     */
    async getPreferences(loginName: string): Promise<Preferences | null> {
        return await this.#usersRest.getPreferences(loginName);
    }

    /**
     * Changes the specified user's password.
     *
     * @param loginName   the user login name
     * @param oldPassword the current password
     * @param newPassword the new password
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async changePassword(loginName: string, oldPassword: string, newPassword: string): Promise<boolean> {
        return await this.#usersRest.changePassword(loginName, oldPassword, newPassword);
    }
}
