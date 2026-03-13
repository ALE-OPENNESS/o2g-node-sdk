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

import { RoutingCapabilitiesJson } from '../../internal/types/routing/routing-types';

/**
 * RoutingCapabilities represents the routing features available for a user.
 */
export class RoutingCapabilities {
    #presentationRoute: boolean;
    #forwardRoute: boolean;
    #overflowRoute: boolean;
    #dnd: boolean;

    /**
     * @internal
     */
    private constructor(presentationRoute: boolean, forwardRoute: boolean, overflowRoute: boolean, dnd: boolean) {
        this.#presentationRoute = presentationRoute;
        this.#forwardRoute = forwardRoute;
        this.#overflowRoute = overflowRoute;
        this.#dnd = dnd;
    }

    /** Whether presentation routing is available */
    get presentationRoute(): boolean {
        return this.#presentationRoute;
    }

    /** Whether forward routing is available */
    get forwardRoute(): boolean {
        return this.#forwardRoute;
    }

    /** Whether overflow routing is available */
    get overflowRoute(): boolean {
        return this.#overflowRoute;
    }

    /** Whether Do Not Disturb can be activated */
    get dnd(): boolean {
        return this.#dnd;
    }

    /**
     * @internal
     */
    static fromJson(json: RoutingCapabilitiesJson): RoutingCapabilities {
        return new RoutingCapabilities(json.presentationRoute, json.forwardRoute, json.overflowRoute, json.dnd);
    }
}
