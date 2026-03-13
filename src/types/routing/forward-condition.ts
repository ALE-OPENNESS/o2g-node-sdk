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

/**
 * ForwardCondition represents the possible condition a user can associate to a forward.
 */
export enum ForwardCondition {
    /**
     * Incoming calls are immediately forwarded on the target.
     */
    IMMEDIATE = 'IMMEDIATE',

    /**
     * Incoming calls are forwarded on the target if the user is busy.
     */
    BUSY = 'BUSY',

    /**
     * Incoming calls are forwarded on the target if the user does not answer the call.
     */
    NO_ANSWER = 'NO_ANSWER',

    /**
     * Incoming calls are forwarded on the target if the user is busy or if the user does not answer the call.
     */
    BUSY_OR_NO_ANSWER = 'BUSY_OR_NO_ANSWER',
}

export namespace ForwardCondition {
    // Map from JSON string → ForwardCondition
    const fromJsonMap: Record<string, ForwardCondition> = {
        BUSY: ForwardCondition.BUSY,
        NO_ANSWER: ForwardCondition.NO_ANSWER,
        BUSY_NO_ANSWER: ForwardCondition.BUSY_OR_NO_ANSWER,
    };

    // Map from ForwardCondition → JSON string
    const toJsonMap: Record<ForwardCondition, string> = {
        [ForwardCondition.BUSY]: 'BUSY',
        [ForwardCondition.NO_ANSWER]: 'NO_ANSWER',
        [ForwardCondition.BUSY_OR_NO_ANSWER]: 'BUSY_NO_ANSWER',
        [ForwardCondition.IMMEDIATE]: 'IMMEDIATE', // optional
    };

    // Convert JSON string → ForwardCondition
    export function fromForwardType(forwardType?: string): ForwardCondition {
        if (!forwardType) {
            return ForwardCondition.IMMEDIATE; // default if undefined
        }
        return fromJsonMap[forwardType] ?? ForwardCondition.IMMEDIATE; // fallback to IMMEDIATE
    }

    // Convert ForwardCondition → JSON string
    export function toForwardType(condition: ForwardCondition): string | undefined {
        if (condition === ForwardCondition.IMMEDIATE) return undefined; // rule: IMMEDIATE → undefined
        return toJsonMap[condition];
    }
}
