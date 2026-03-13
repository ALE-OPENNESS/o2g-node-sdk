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

import { TelephonicStateJson } from '../../internal/types/telephony/telephony-types';
import { Device } from '../common/device';
import { Call } from './call';
import { UserState } from './user/user-state';

/**
 * Represents the telephonic state of a user, including active calls,
 * device capabilities, and the current user state.
 *
 * This class provides read-only access to:
 * - the list of active calls
 * - the capabilities of the user's devices
 * - the current state of the user (e.g., available, busy)
 */
export class TelephonicState {
    #calls?: Call[];
    #deviceCapabilities?: Device.Capabilities[];
    #userState?: UserState;

    /**
     * @internal
     */
    private constructor(calls?: Call[], deviceCapabilities?: Device.Capabilities[], userState?: UserState) {
        this.#calls = calls;
        this.#deviceCapabilities = deviceCapabilities;
        this.#userState = userState;
    }

    /**
     * Returns the collection of active calls for this user.
     *
     * @returns An array of `Call` objects, or `null` if not set
     */
    get calls(): Call[] | null {
        return this.#calls ?? null;
    }

    /**
     * Returns the collection of device capabilities for this user.
     *
     * @returns An array of `Device.Capabilities` objects, or `null` if not set
     */
    get deviceCapabilities(): Device.Capabilities[] | null {
        return this.#deviceCapabilities ?? null;
    }

    /**
     * Returns the current user state.
     *
     * @returns The `UserState` of the user, or `null` if not set
     */
    get userState(): UserState | null {
        return this.#userState ?? null;
    }

    /**
     * @internal
     */
    static fromJson(json: TelephonicStateJson): TelephonicState {
        return new TelephonicState(
            json.calls?.map(Call.fromJson) ?? undefined,
            json.deviceCapabilities?.map(Device.Capabilities.fromJson) ?? undefined,
            json.userState
        );
    }
}
