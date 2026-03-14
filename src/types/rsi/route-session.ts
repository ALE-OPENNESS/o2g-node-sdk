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

import { RouteSessionJson } from '../../internal/types/rsi/rsi-types';

/**
 * RouteSession represents a route request session between a RSI point
 * and an application.
 * A route session is initiated by a RSI point by sending a
 * {@link ON_ROUTE_REQUEST}.
 * The application selects a route and answers the request by calling
 * {@link routeSelect}.
 */
export class RouteSession {
    #routeCrid: string;
    #caller: string;
    #called: string;
    #routedCallRef: string;

    private constructor(routeCrid: string, caller: string, called: string, routedCallRef: string) {
        this.#routeCrid = routeCrid;
        this.#caller = caller;
        this.#called = called;
        this.#routedCallRef = routedCallRef;
    }

    /** This route session unique identifier */
    get routeCrid(): string {
        return this.#routeCrid;
    }

    /** The call extension number */
    get caller(): string {
        return this.#caller;
    }

    /** The called number */
    get called(): string {
        return this.#called;
    }

    /** The routed call reference */
    get routedCallRef(): string {
        return this.#routedCallRef;
    }

    /** @internal */

    static fromJson(json: RouteSessionJson): RouteSession {
        return new RouteSession(json.routeCrid, json.caller, json.called, json.routedCallRef);
    }
}
