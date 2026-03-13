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

import { RoutingStateJson } from '../../internal/types/routing/routing-types';
import { RoutingState } from './routing-state';

/**
 * Event raised when a user's routing state has changed.
 * <p>
 * Received via the {@link Routing.ON_ROUTING_STATE_CHANGED} event, and also
 * in response to a {@link Routing.requestSnapshot} call.
 *
 * @see Routing.ON_ROUTING_STATE_CHANGED
 * @see Routing.requestSnapshot
 */
export class OnRoutingStateChanged {
    #loginName: string;
    #routingState: RoutingState;

    /**
     * @internal
     */
    private constructor(loginName: string, routingState: RoutingState) {
        this.#loginName = loginName;
        this.#routingState = routingState;
    }

    /**
     * The login name of the user receiving the event.
     */
    get loginName(): string {
        return this.#loginName;
    }

    /**
     * The current routing state of the user, including forward, overflow and
     * Do Not Disturb settings.
     */
    get routingState(): RoutingState {
        return this.#routingState;
    }

    /**
     * @internal
     */
    static fromJson(json: { loginName: string; routingState: RoutingStateJson }): OnRoutingStateChanged {
        const routingState = RoutingState.fromJson(json.routingState);
        return new OnRoutingStateChanged(json.loginName, routingState);
    }
}
