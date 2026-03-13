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

/** @internal */
export type DestinationJson = {
    type: string;
    deviceId?: string;
    number?: string;
    selected?: boolean;
};

/** @internal */
export type RoutingCapabilitiesJson = {
    presentationRoute: boolean;
    forwardRoute: boolean;
    overflowRoute: boolean;
    dnd: boolean;
};

/** @internal */
export type PresentationRouteJson = {
    destinations: DestinationJson[];
};

/** @internal */
export type ForwardRouteJson = {
    forwardType?: string;
    destinations: DestinationJson[];
};

/** @internal */
export type OverflowRouteJson = {
    overflowType?: string;
    destinations: DestinationJson[];
};

/**
 * Represents the DoNotDisturb state. When the DoNotDisturb is activated for a
 * user, he does not receive any call.
 */
/** @internal */
export type DndStateJson = {
    /**
     * Whether the DoNotDisturb is activated.
     */
    activate: boolean;
};

/** @internal */
export type RoutingStateJson = {
    presentationRoutes?: PresentationRouteJson[];
    forwardRoutes?: ForwardRouteJson[];
    overflowRoutes?: OverflowRouteJson[];
    dndState?: DndStateJson;
};
