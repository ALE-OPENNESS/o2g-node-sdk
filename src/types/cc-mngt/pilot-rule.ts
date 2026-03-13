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

import { PilotRuleJson } from '../../internal/types/cc-mngt/cc-mntg-types';

/**
 * Represents a routing rule associated with a pilot in an ACD system.
 * Each rule defines how calls are distributed to a pilot and whether it is currently active.
 */
export class PilotRule {
    #ruleNumber: number;
    #name?: string;
    #active: boolean;

    private constructor(ruleNumber: number, active: boolean, name?: string) {
        this.#ruleNumber = ruleNumber;
        this.#name = name;
        this.#active = active;
    }

    /**
     * The unique number identifying this rule.
     * @returns {number} Rule number
     */
    get ruleNumber(): number {
        return this.#ruleNumber;
    }

    /**
     * The display name of the rule, if defined.
     * @returns {string | null} Rule name or null if not set
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * Indicates whether this routing rule is currently active.
     * @returns {boolean} True if the rule is active, false otherwise
     */
    get active(): boolean {
        return this.#active;
    }

    /**
     * Constructs a PilotRule instance from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {PilotRuleJson} json - JSON representation of the rule
     * @returns {PilotRule} A new PilotRule instance
     * @internal
     */
    /** @internal */

    static fromJson(json: PilotRuleJson): PilotRule {
        return new PilotRule(json.ruleNumber, json.active, json.name);
    }
}
