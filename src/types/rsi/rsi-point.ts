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

import { RsiPointJson } from '../../internal/types/rsi/rsi-types';

/**
 * RsiPoint represents a RSI point. When a call is received by a RSI
 * routing point, a {@link Rsi.ON_ROUTE_REQUEST} is sent to the application.
 */
export class RsiPoint {
    #number: string;
    #name: string;
    #node: number;
    #registered: boolean;

    private constructor(number: string, name: string, node: number, registered: boolean) {
        this.#number = number;
        this.#name = name;
        this.#node = node;
        this.#registered = registered;
    }

    /** This RSI point extension number */
    get number(): string {
        return this.#number;
    }

    /** The name of this RSI point */
    get name(): string {
        return this.#name;
    }

    /** The OmniPCX Enterprise node on which this RSI point is configured */
    get node(): number {
        return this.#node;
    }

    /** Whether this RSI point is registered */
    get registered(): boolean {
        return this.#registered;
    }

    /** @internal */

    static fromJson(json: RsiPointJson): RsiPoint {
        return new RsiPoint(json.number, json.name, json.node, json.registered);
    }
}
