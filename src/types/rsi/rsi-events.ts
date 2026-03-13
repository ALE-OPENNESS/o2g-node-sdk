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

import {
    OnDigitCollectedJson,
    OnRouteEndJson,
    OnRouteRequestJson,
    OnToneGeneratedStartJson,
    OnToneGeneratedStopJson,
} from '../../internal/types/rsi/rsi-types';
import { RoutingReason } from './routing-reason';
import { Tones } from './tones';

export class OnToneGeneratedStop {
    #rsiPoint: string;
    #callRef: string;

    private constructor(rsiPoint: string, callRef: string) {
        this.#rsiPoint = rsiPoint;
        this.#callRef = callRef;
    }

    /** The RSI point extension number */
    get rsiPoint(): string {
        return this.#rsiPoint;
    }

    /** The reference of the call on which the tones are played */
    get callRef(): string {
        return this.#callRef;
    }

    /** @internal */

    static fromJson(json: OnToneGeneratedStopJson): OnToneGeneratedStop {
        return new OnToneGeneratedStop(json.rsiPoint, json.callRef);
    }
}

export class OnToneGeneratedStart {
    #rsiPoint: string;
    #callRef: string;
    #tonesTypes: Tones;

    private constructor(rsiPoint: string, callRef: string, tonesTypes: Tones) {
        this.#rsiPoint = rsiPoint;
        this.#callRef = callRef;
        this.#tonesTypes = tonesTypes;
    }

    /** The RSI point extension number */
    get rsiPoint(): string {
        return this.#rsiPoint;
    }

    /** The reference of the call on which the tones are played */
    get callRef(): string {
        return this.#callRef;
    }

    /** The tones types */
    get tonesTypes(): Tones {
        return this.#tonesTypes;
    }

    /** @internal */

    static fromJson(json: OnToneGeneratedStartJson): OnToneGeneratedStart {
        return new OnToneGeneratedStart(json.rsiPoint, json.callRef, json.tonesTypes);
    }
}

export class OnDigitCollected {
    #rsiPoint: string;
    #callRef: string;
    // #dataCollected: DataCollected; // Uncomment when DataCollected class exists

    private constructor(rsiPoint: string, callRef: string /*, dataCollected: DataCollected */) {
        this.#rsiPoint = rsiPoint;
        this.#callRef = callRef;
        // this.#dataCollected = dataCollected;
    }

    /** The RSI point extension number */
    get rsiPoint(): string {
        return this.#rsiPoint;
    }

    /** The reference of the call on which the tones are played */
    get callRef(): string {
        return this.#callRef;
    }

    // /** The collected DTMF tones */
    // get dataCollected(): DataCollected {
    //     return this.#dataCollected;
    // }

    /** @internal */

    static fromJson(json: OnDigitCollectedJson): OnDigitCollected {
        return new OnDigitCollected(json.rsiPoint, json.callRef /*, json.dataCollected */);
    }
}

export class OnRouteRequest {
    #rsiPoint: string;
    // #request: RouteRequest; // Uncomment when RouteRequest class exists

    private constructor(rsiPoint: string /*, request: RouteRequest */) {
        this.#rsiPoint = rsiPoint;
        // this.#request = request;
    }

    /** The RSI point extension number */
    get rsiPoint(): string {
        return this.#rsiPoint;
    }

    // /** The routing request */
    // get request(): RouteRequest {
    //     return this.#request;
    // }

    /** @internal */

    static fromJson(json: OnRouteRequestJson): OnRouteRequest {
        return new OnRouteRequest(json.rsiPoint /*, json.request */);
    }
}

export class OnRouteEnd {
    #rsiPoint: string;
    #routeCrid: string;
    #routedCallRef: string;
    #reason: RoutingReason;

    private constructor(rsiPoint: string, routeCrid: string, routedCallRef: string, reason: RoutingReason) {
        this.#rsiPoint = rsiPoint;
        this.#routeCrid = routeCrid;
        this.#routedCallRef = routedCallRef;
        this.#reason = reason;
    }

    /** The RSI point extension number */
    get rsiPoint(): string {
        return this.#rsiPoint;
    }

    /** The routing session unique identifier */
    get routeCrid(): string {
        return this.#routeCrid;
    }

    /** The routed call reference */
    get routedCallRef(): string {
        return this.#routedCallRef;
    }

    /** The routing reason */
    get reason(): RoutingReason {
        return this.#reason;
    }

    /** @internal */

    static fromJson(json: OnRouteEndJson): OnRouteEnd {
        return new OnRouteEnd(json.rsiPoint, json.routeCrid, json.routedCallRef, json.reason);
    }
}
