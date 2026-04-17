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
import RsiRest from '../internal/rest/rsi-rest';
import { AdditionalDigitCollectionCriteria } from '../types/rsi/add-digit-coll-criteria';
import { Tones } from '../types/rsi/tones';
import { EventRegistry } from '../events/event-dispatcher';
import {
    OnDigitCollected,
    OnRouteEnd,
    OnRouteRequest,
    OnToneGeneratedStart,
    OnToneGeneratedStop,
} from '../types/rsi/rsi-events';
import { RsiPoint } from '../types/rsi/rsi-point';
import { RouteSession } from '../types/rsi/route-session';

/**
 * `Rsi` provides access to the RSI (Routing Service Intelligence) point features:
 * <ul>
 * <li>Makes route selection.</li>
 * <li>Makes digits collection.</li>
 * <li>Plays voice guides or tones.</li>
 * <li>Plays announcements (prompts and/or digits).</li>
 * </ul>
 * <p>
 * To be able to receive route requests from the OmniPCX Enterprise, the application
 * must first subscribe to RSI events and then enable the RSI point.
 * <p>
 * Using this service requires having a <b>CONTACTCENTER_RSI</b> license.
 */
export class Rsi extends EventEmitter {
    #rsiRest: RsiRest;

    /**
     * Raised when a digit collection session has ended.
     * @event
     */
    static readonly ON_DIGIT_COLLECTED = 'OnDigitCollected';

    /**
     * Raised from an RSI point when a tone generation starts.
     * @event
     */
    static readonly ON_TONE_GENERATED_START = 'OnToneGeneratedStart';

    /**
     * Raised from an RSI point when a tone generation stops.
     * @event
     */
    static readonly ON_TONE_GENERATED_STOP = 'OnToneGeneratedStop';

    /**
     * Raised from a routing point to close a route session (the routing Crid is no longer valid).
     * @event
     */
    static readonly ON_ROUTE_END = 'OnRouteEnd';

    /**
     * Raised from a routing point to request a route selection.
     * @event
     */
    static readonly ON_ROUTE_REQUEST = 'OnRouteRequest';

    /**
     *
     * @internal
     */
    constructor(rsiRest: RsiRest, eventRegistry: EventRegistry) {
        super();
        this.#rsiRest = rsiRest;

        eventRegistry.register(this, Rsi.ON_DIGIT_COLLECTED, OnDigitCollected);
        eventRegistry.register(this, Rsi.ON_TONE_GENERATED_START, OnToneGeneratedStart);
        eventRegistry.register(this, Rsi.ON_TONE_GENERATED_STOP, OnToneGeneratedStop);
        eventRegistry.register(this, Rsi.ON_ROUTE_END, OnRouteEnd);
        eventRegistry.register(this, Rsi.ON_ROUTE_REQUEST, OnRouteRequest);
    }

    /**
     * Gets the configured RSI points.
     *
     * @returns the list of {@link RsiPoint} objects representing all declared RSI points, or `null` in case of error.
     */
    async getRsiPoints(): Promise<RsiPoint[] | null> {
        return this.#rsiRest.getRsiPoints();
    }

    /**
     * Enables the specified RSI point.
     *
     * @param rsiNumber the RSI point extension number
     * @param backup `true` to enable the RSI point in backup mode
     * @returns `true` in case of success; `false` otherwise.
     */
    async enableRsiPoint(rsiNumber: string, backup: boolean = false): Promise<boolean> {
        return this.#rsiRest.enableRsiPoint(rsiNumber, backup);
    }

    /**
     * Disables the specified RSI point.
     *
     * @param rsiNumber the RSI point extension number
     * @returns `true` in case of success; `false` otherwise.
     */
    async disableRsiPoint(rsiNumber: string): Promise<boolean> {
        return this.#rsiRest.disableRsiPoint(rsiNumber);
    }

    /**
     * Starts a digits collection on the specified RSI point, for the specified call.
     *
     * @param rsiNumber          the RSI point extension number
     * @param callRef            the call reference
     * @param numChars           the optional number of digits to collect; the digit collection stops when this number is reached
     * @param flushChar          the optional character that stops the digit collection when pressed
     * @param timeout            the optional timeout in seconds; the digit collection stops when this delay elapses
     * @param additionalCriteria extension criteria used to collect digits
     * @returns a unique identifier (Crid) for this digit collection session, or `null` in case of error.
     * @see {@link ON_DIGIT_COLLECTED} event
     * @see {@link stopCollectDigits}
     */
    async startCollectDigits(
        rsiNumber: string,
        callRef: string,
        numChars: number,
        flushChar: string | null = null,
        timeout: number | null = null,
        additionalCriteria: AdditionalDigitCollectionCriteria | null = null
    ): Promise<boolean | null> {
        return this.#rsiRest.startCollectDigits(rsiNumber, callRef, numChars, flushChar, timeout, additionalCriteria);
    }

    /**
     * Stops the specified digits collection on the specified RSI point.
     *
     * @param rsiNumber the RSI point extension number
     * @param collCrid  the digit collection identifier returned by {@link startCollectDigits}
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link startCollectDigits}
     */
    async stopCollectDigits(rsiNumber: string, collCrid: string): Promise<boolean> {
        return this.#rsiRest.stopCollectDigits(rsiNumber, collCrid);
    }

    /**
     * Plays the specified tone on the specified call.
     *
     * @param rsiNumber the RSI point extension number
     * @param callRef   the call reference
     * @param tone      the tone to play
     * @param duration  the duration the tone is played, in seconds
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link ON_TONE_GENERATED_START} event
     * @see {@link cancelTone}
     */
    async playTone(rsiNumber: string, callRef: string, tone: Tones, duration: number): Promise<boolean> {
        return this.#rsiRest.playTone(rsiNumber, callRef, tone, duration);
    }

    /**
     * Cancels the tone currently playing on the specified call.
     *
     * @param rsiNumber the RSI point extension number
     * @param callRef   the call reference
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link ON_TONE_GENERATED_STOP} event
     * @see {@link playTone}
     */
    async cancelTone(rsiNumber: string, callRef: string): Promise<boolean> {
        return this.#rsiRest.cancelTone(rsiNumber, callRef);
    }

    /**
     * Plays the specified voice guide on the specified call.
     *
     * @param rsiNumber   the RSI point extension number
     * @param callRef     the call reference
     * @param guideNumber the voice guide number as defined in the OmniPCX Enterprise
     * @param duration    an optional duration for the voice guide, in seconds
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link ON_TONE_GENERATED_START}
     */
    async playVoiceGuide(
        rsiNumber: string,
        callRef: string,
        guideNumber: number,
        duration: number | null = null
    ): Promise<boolean> {
        return this.#rsiRest.playVoiceGuide(rsiNumber, callRef, guideNumber, duration);
    }

    /**
     * Ends a route session, indicating that no route will be selected.
     *
     * @param rsiNumber the RSI point extension number
     * @param routeCrid the routing session unique identifier
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link ON_ROUTE_REQUEST} event
     */
    async routeEnd(rsiNumber: string, routeCrid: string): Promise<boolean> {
        return this.#rsiRest.routeEnd(rsiNumber, routeCrid);
    }

    /**
     * Selects a route as a response to a route request.
     * <p>
     * `callingLine` can be used to change the identity of the calling number presented to the called party.
     *
     * @param rsiNumber        the RSI point extension number
     * @param routeCrid        the routing session unique identifier
     * @param selectedRoute    the selected route number
     * @param callingLine      an optional calling line number that will be presented to the selected route
     * @param associatedData   optional correlator data to attach to the call
     * @param routeToVoiceMail `true` if the selected route is the voice mail; `false` otherwise
     * @returns `true` in case of success; `false` otherwise.
     * @see {@link ON_ROUTE_REQUEST} event
     */
    async routeSelect(
        rsiNumber: string,
        routeCrid: string,
        selectedRoute: string,
        callingLine: string | null = null,
        associatedData: string | null = null,
        routeToVoiceMail: boolean | null = null
    ): Promise<boolean> {
        return this.#rsiRest.routeSelect(
            rsiNumber,
            routeCrid,
            selectedRoute,
            callingLine,
            associatedData,
            routeToVoiceMail
        );
    }

    /**
     * Gets the list of existing route sessions for the specified RSI point.
     *
     * @param rsiNumber the RSI point extension number
     * @returns the list of {@link RouteSession} objects representing the route sessions in progress, or `null` in case of error.
     */
    async getRouteSessions(rsiNumber: string): Promise<RouteSession[] | null> {
        return this.#rsiRest.getRouteSessions(rsiNumber);
    }

    /**
     * Returns the specified route session.
     *
     * @param rsiNumber the RSI point extension number
     * @param routeCrid the routing session unique identifier
     * @returns the {@link RouteSession} object on success; `null` in case of error or if no such route session exists.
     */
    async getRouteSession(rsiNumber: string, routeCrid: string): Promise<RouteSession | null> {
        return this.#rsiRest.getRouteSession(rsiNumber, routeCrid);
    }
}
