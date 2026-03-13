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

import { DestinationJson, ForwardRouteJson } from '../../internal/types/routing/routing-types';
import { Destination } from './destination';
import { ForwardCondition } from './forward-condition';

/**
 * Represents the forward currently activated for a user.
 * <p>
 * A forward can target a voice mail ({@link onVoiceMail}) or a phone number
 * ({@link onNumber}), and is always associated with a {@link ForwardCondition}
 * that determines when the forward applies.
 * <p>
 * Use {@link Routing.getForward} to retrieve the current forward state, and
 * {@link Routing.forwardOnVoiceMail} or {@link Routing.forwardOnNumber} to
 * activate one.
 *
 * @see Routing.getForward
 * @see Routing.forwardOnVoiceMail
 * @see Routing.forwardOnNumber
 */
export class Forward {
    #destination: Destination;
    #number: string | null = null;
    #condition: ForwardCondition | null = null;

    /**
     * @internal
     */
    private constructor(
        destination: Destination,
        number: string | null = null,
        condition: ForwardCondition | null = null
    ) {
        this.#destination = destination;
        this.#number = number;
        this.#condition = condition;
    }

    /**
     * The destination type of this forward.
     */
    get destination(): Destination {
        return this.#destination;
    }

    /**
     * The phone number target of this forward.
     * <p>
     * Only set when `destination` is {@link Destination.NUMBER};
     * `null` otherwise.
     */
    get number(): string | null {
        return this.#number;
    }

    /**
     * The condition under which this forward applies.
     */
    get condition(): ForwardCondition | null {
        return this.#condition;
    }

    /**
     * @internal
     */
    static fromJson(json: ForwardRouteJson | null = null): Forward {
        if (!json || !json.destinations || json.destinations.length !== 1) {
            return new Forward(Destination.NONE, null, null);
        }

        const destinationData = json.destinations[0];
        const condition = ForwardCondition.fromForwardType(json.forwardType);
        const typeKey = destinationData.type as keyof typeof Destination;
        const destination: Destination = Destination[typeKey] ?? Destination.NONE;
        const numberValue = destination === Destination.NUMBER ? destinationData.number : null;

        return new Forward(destination, numberValue, condition);
    }

    /**
     * Creates a `Forward` targeting the user's voice mail with the specified condition.
     *
     * @param condition the condition under which the forward applies
     * @returns a new {@link Forward} instance targeting voice mail
     * @see Routing.forwardOnVoiceMail
     */
    static onVoiceMail(condition: ForwardCondition): Forward {
        return new Forward(Destination.VOICEMAIL, null, condition);
    }

    /**
     * Creates a `Forward` targeting the specified phone number with the specified condition.
     *
     * @param number    the phone number to forward to
     * @param condition the condition under which the forward applies
     * @returns a new {@link Forward} instance targeting a phone number
     * @see Routing.forwardOnNumber
     */
    static onNumber(number: string, condition: ForwardCondition): Forward {
        return new Forward(Destination.NUMBER, number, condition);
    }

    /**
     * @internal
     */
    toJson(): ForwardRouteJson {
        const destination: DestinationJson = {
            type: this.#destination.toString(),
            number: this.#destination === Destination.NUMBER ? (this.#number ?? undefined) : undefined,
        };

        return {
            forwardType: this.#condition ? ForwardCondition.toForwardType(this.#condition) : undefined,
            destinations: this.#destination === Destination.NONE ? [] : [destination],
        };
    }
}
