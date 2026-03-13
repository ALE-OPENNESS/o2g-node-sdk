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

import UsersManagementRest from './internal/rest/users-mngt-rest';
import { User } from './types/users/user';

/**
 * The Users Management service allows an administrator to create, delete and retrieve O2G users.
 * <p>
 * This service requires an administrator session.
 *
 * @example
 * ```typescript
 * // List all users across all nodes
 * const logins = await O2G.usersManagement.getLogins();
 *
 * // Find a user by their device number
 * const loginName = await O2G.usersManagement.getByDeviceNumber("60200");
 *
 * // Retrieve full user information
 * const user = await O2G.usersManagement.getByLoginName("jdoe");
 * console.log(`${user?.firstName} ${user?.lastName}`);
 *
 * // Create specific users on node 1 by device number
 * await O2G.usersManagement.createUsers(1, ["60200", "60201", "60202"]);
 *
 * // Create all users on node 1
 * await O2G.usersManagement.createUsers(1, null);
 *
 * // Delete a user
 * await O2G.usersManagement.deleteUser("jdoe");
 * ```
 */
export class UsersManagement {
    #usersManagementRest: UsersManagementRest;

    /**
     * @internal
     */
    constructor(usersManagementRest: UsersManagementRest) {
        this.#usersManagementRest = usersManagementRest;
    }

    /**
     * Retrieves the login names of users from the connected OmniPCX Enterprise nodes.
     * <p>
     * If `nodeIds` is `null`, retrieves the login names from all connected nodes.
     *
     * @param nodeIds optional list of OXE node ids to restrict the query to.
     *                Only valid for an administrator session.
     * @returns the list of user login names on success; `null` otherwise.
     */
    async getLogins(nodeIds: number[] | null = null): Promise<string[] | null> {
        return await this.#usersManagementRest.getLogins(nodeIds);
    }

    /**
     * Retrieves the login name of a user identified by one of their devices.
     *
     * @param deviceNumber the device phone number
     * @returns the user login name on success; `null` otherwise.
     */
    async getByDeviceNumber(deviceNumber: string): Promise<string | null> {
        return await this.#usersManagementRest.getByDeviceNumber(deviceNumber);
    }

    /**
     * Creates O2G users on the specified OmniPCX Enterprise node.
     * <p>
     * If `deviceNumbers` is `null` or empty, all users on the specified node are created.
     *
     * @example
     * ```typescript
     * // Create specific users by device number
     * await O2G.usersManagement.createUsers(1, ["60200", "60201"]);
     *
     * // Create all users on the node
     * await O2G.usersManagement.createUsers(1, null);
     * ```
     *
     * @param nodeId        the OXE node number
     * @param deviceNumbers optional list of device phone numbers identifying the users to create.
     *                      Pass `null` or an empty array to create all users on the node.
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async createUsers(nodeId: number, deviceNumbers: string[] | null): Promise<boolean> {
        return await this.#usersManagementRest.createUsers(nodeId, deviceNumbers);
    }

    /**
     * Retrieves the information of a user identified by their login name.
     *
     * @param loginName the user login name
     * @returns the {@link User} information on success; `null` otherwise.
     */
    async getByLoginName(loginName: string): Promise<User | null> {
        return await this.#usersManagementRest.getByLoginName(loginName);
    }

    /**
     * Deletes the O2G user identified by their login name.
     *
     * @param loginName the login name of the user to delete
     * @returns `true` if the user was successfully deleted; `false` otherwise.
     */
    async deleteUser(loginName: string): Promise<boolean> {
        return await this.#usersManagementRest.deleteUser(loginName);
    }
}
