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

import { OverflowRouteJson } from '../../internal/types/routing/routing-types';
import { Destination } from './destination';
import { OverflowCondition } from './overflow-condition';

/**
 * Represents the overflow currently activated for a user.
 * <p>
 * An overflow redirects calls to a voice mail ({@link onVoiceMail}) or a phone
 * number ({@link onNumber}) when a specific condition is met, such as when the
 * user is busy or does not answer.
 * <p>
 * Use {@link Routing.getOverflow} to retrieve the current overflow state, and
 * {@link Routing.overflowOnVoiceMail} to activate one.
 *
 * @see Routing.getOverflow
 * @see Routing.overflowOnVoiceMail
 */
export class Overflow {
    #destination: Destination;
    #number: string | null = null;
    #condition: OverflowCondition | null = null;

    /**
     * @internal
     */
    private constructor(destination: Destination, number: string | null = null, condition: OverflowCondition | null) {
        this.#destination = destination;
        this.#number = number;
        this.#condition = condition;
    }

    /**
     * The destination type of this overflow.
     */
    get destination(): Destination {
        return this.#destination;
    }

    /**
     * The phone number target of this overflow.
     * <p>
     * Only set when `destination` is {@link Destination.NUMBER};
     * `null` otherwise.
     */
    get number(): string | null {
        return this.#number;
    }

    /**
     * The condition under which this overflow applies.
     */
    get condition(): OverflowCondition | null {
        return this.#condition;
    }

    /**
     * @internal
     */
    static fromJson(json: OverflowRouteJson | null = null): Overflow {
        if (!json || !json.destinations || json.destinations.length !== 1) {
            return new Overflow(Destination.NONE, null, null);
        }

        const destinationData = json.destinations[0];
        const condition = OverflowCondition.fromOverflowType(json.overflowType);
        const typeKey = destinationData.type as keyof typeof Destination;
        const destination: Destination = Destination[typeKey] ?? Destination.NONE;
        const numberValue = destination === Destination.NUMBER ? destinationData.number : null;

        return new Overflow(destination, numberValue, condition ?? null);
    }

    /**
     * Creates an `Overflow` targeting the specified phone number with the specified condition.
     *
     * @param number    the phone number to overflow to
     * @param condition the condition under which the overflow applies
     * @returns a new {@link Overflow} instance targeting a phone number
     */
    static onNumber(number: string, condition: OverflowCondition): Overflow {
        return new Overflow(Destination.NUMBER, number, condition);
    }

    /**
     * Creates an `Overflow` targeting the user's voice mail with the specified condition.
     *
     * @param condition the condition under which the overflow applies
     * @returns a new {@link Overflow} instance targeting voice mail
     * @see Routing.overflowOnVoiceMail
     */
    static onVoiceMail(condition: OverflowCondition): Overflow {
        return new Overflow(Destination.VOICEMAIL, null, condition);
    }

    /**
     * @internal
     */
    toJson(): OverflowRouteJson {
        return {
            overflowType: this.#condition ? OverflowCondition.toOverflowType(this.#condition) : undefined,
            destinations: [
                {
                    type: this.#destination.toString(),
                    selected: true,
                },
            ],
        };
    }
}
