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

import { RoutingStateJson, PresentationRouteJson } from '../../internal/types/routing/routing-types';
import { DndState } from './dnd-state';
import { Overflow } from './overflow';
import { Forward } from './forward';

/**
 * RoutingState represente a user routing state. A routing state is
 * composed of four elements:
 * <table>
 * <caption>Routing state elements</caption>
 * <tr>
 * <td>Remote extension activation</td>
 * <td>When the user is configured with a remote extension, he has the
 * possibility to activate or deactivate this remote extension. when the remote
 * extension is de-activated, call are not presented on the mobile device.</td>
 * </tr>
 * <tr>
 * <td>Forward</td>
 * <td>The user can configure a forward, on his voice mail if any or on any
 * other number (depending on the cOmniPCX Enterprise configuration).</td>
 * </tr>
 * <tr>
 * <td>Overflow</td>
 * <td>The user can configure an overflow on his voice mail.
 * If a forward is configured, it is considered prior the overflow.</td>
 * </tr>
 * <tr>
 * <td>Do Not Disturb</td>
 * <td>When Do Not Disturb (DND) is activated, call are not presented to the
 * user.</td>
 * </tr>
 *
 * </table>
 */
export class RoutingState {
    #dndState: DndState;
    #forward: Forward;
    #overflow: Overflow;
    #remoteExtensionActivated: boolean;

    /**
     * @internal
     */
    private constructor(dndState: DndState, forward: Forward, overflow: Overflow, remoteExtensionActivated: boolean) {
        this.#dndState = dndState;
        this.#forward = forward;
        this.#overflow = overflow;
        this.#remoteExtensionActivated = remoteExtensionActivated;
    }

    /**
     * Return the do not disturb state.
     */
    get dndState(): DndState {
        return this.#dndState;
    }

    /**
     * Returns the forward.
     */
    get forward(): Forward {
        return this.#forward;
    }

    /**
     * Returns the overflow.
     */
    get overflow(): Overflow {
        return this.#overflow;
    }

    /**
     * Returns whether the routing on remote extension is activated.
     */
    get remoteExtensionActivated(): boolean {
        return this.#remoteExtensionActivated;
    }

    /**
     * @internal
     */
    static fromJson(json: RoutingStateJson | null = null): RoutingState {
        if (!json) {
            return new RoutingState(
                DndState.fromJson({ activate: false }),
                Forward.fromJson(null),
                Overflow.fromJson(null),
                false
            );
        }

        const dndState = json.dndState ? DndState.fromJson(json.dndState) : DndState.fromJson({ activate: false });

        const forward = json.forwardRoutes?.[0] ? Forward.fromJson(json.forwardRoutes[0]) : Forward.fromJson(null);

        const overflow = json.overflowRoutes?.[0] ? Overflow.fromJson(json.overflowRoutes[0]) : Overflow.fromJson(null);

        const remoteExtensionActivated = this.getRemoteExtensionActivation(json.presentationRoutes);

        return new RoutingState(dndState, forward, overflow, remoteExtensionActivated);
    }

    /**
     * @internal
     */
    private static getRemoteExtensionActivation(presentationRoutes: PresentationRouteJson[] = []): boolean {
        return presentationRoutes.some((route) =>
            route.destinations?.some((dest) => dest.type === 'MOBILE' && dest.selected)
        );
    }
}
