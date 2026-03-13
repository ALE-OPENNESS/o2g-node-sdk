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
 * PilotStatus represents the possible state of a CCD pilot.
 */
export enum PilotStatus {
    /**
     * The pilot is opened.
     */
    OPEN = 'OPEN',

    /**
     * The pilot is blocked.
     */
    BLOCKED = 'BLOCKED',

    /**
     * The pilot is on a blocked on a rule.
     */
    BLOCKED_ON_RULE = 'BLOCKED_ON_RULE',

    /**
     * The pilot is blocked on a blocking rule.
     */
    BLOCKED_ON_BLOCKED_RULE = 'BLOCKED_ON_BLOCKED_RULE',

    /**
     * The pilot is in general forwarding.
     */
    GENERAL_FORWARDING = 'GENERAL_FORWARDING',

    /**
     * The pilot is in general forwarding on a rule.
     */
    GENERAL_FORWARDING_ON_RULE = 'GENERAL_FORWARDING_ON_RULE',

    /**
     * The pilot is blocked while in general forwarding on a rule.
     */
    BLOCKED_ON_GENERAL_FORWARDING_RULE = 'BLOCKED_ON_GENERAL_FORWARDING_RULE',

    /**
     * Other state
     */
    OTHER = 'OTHER',
}
