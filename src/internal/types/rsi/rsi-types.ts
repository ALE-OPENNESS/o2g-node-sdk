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

import { RoutingReason } from '../../../types/rsi/routing-reason';
import { Tones } from '../../../types/rsi/tones';

/** @internal */
export type RsiPointJson = {
    /**
     * This rsi point extension number.
     */
    number: string;

    /**
     * The name of this rsi point.
     */
    name: string;

    /**
     * The OmniPcx Enterprise node on which this RSI point is configured.
     */
    node: number;

    /**
     * Whether this rsi point is registered.
     */
    registered: boolean;
};

/** @internal */
export type RouteSessionJson = {
    /**
     * This Route session unique idnetifier.
     */
    routeCrid: string;

    /**
     * The call extension number.
     */
    caller: string;

    /**
     * The called number.
     */
    called: string;

    /**
     * The routed call reference.
     */
    routedCallRef: string;
};

/**
 * Notification sent when a data collection has ended.
 */
/** @internal */
export type OnToneGeneratedStopJson = {
    /**
     * The RSI point extension number.
     */
    rsiPoint: string;

    /**
     * The reference of the call on which the tones are played.
     */
    callRef: string;
};

/**
 * This event is sent from a RSI point when a tone generation is started.
 */
/** @internal */
export type OnToneGeneratedStartJson = {
    /**
     * The RSI point extension number.
     */
    rsiPoint: string;

    /**
     * The reference of the call on which the tones are played.
     */
    callRef: string;

    /**
     * The tones types
     */
    tonesTypes: Tones;
};

/**
 * This event is raised when a data collection has ended..
 */
/** @internal */
export type OnDigitCollectedJson = {
    /**
     * The RSI point extension number.
     */
    rsiPoint: string;

    /**
     * The reference of the call on which the tones are played.
     */
    callRef: string;

    /**
     * The collected DTMF tones.
     */
    //    dataCollected: DataCollected;
};

/**
 * This event is sent from a Routing point to request a route.
 */
/** @internal */
export type OnRouteRequestJson = {
    /**
     * The RSI point extension number.
     */
    rsiPoint: string;

    /**
     * The routing request.
     */
    //    request: RouteRequest;
};

/**
 * This event is sent from a Routing point to close a route session (routing crid is no longer valid).
 */
/** @internal */
export type OnRouteEndJson = {
    /**
     * The RSI point extension number.
     */
    rsiPoint: string;

    /**
     * The routing session unique identifier.
     */
    routeCrid: string;

    /**
     * The routed call reference.
     */
    routedCallRef: string;

    /**
     * The routing reason.
     */
    reason: RoutingReason;
};
