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
import { PilotRule } from './pilot-rule';

/**
 * Represents a collection of routing rules associated with a pilot.
 * Provides convenient access to individual rules by number, checks for rule existence,
 * and allows retrieval of all rule numbers or rules.
 */
export class PilotRuleSet {
    #rules: Map<number, PilotRule>;

    private constructor(rules: Map<number, PilotRule>) {
        this.#rules = rules;
    }

    /**
     * Retrieves the pilot rule with the specified number.
     * @param {number} number - The unique number of the rule to retrieve
     * @returns {PilotRule | undefined} The corresponding PilotRule, or undefined if not found
     */
    get(number: number): PilotRule | undefined {
        return this.#rules.get(number);
    }

    /**
     * Determines whether a rule with the specified number exists in this rule set.
     * @param {number} number - The rule number to search for
     * @returns {boolean} True if the rule exists, false otherwise
     */
    contains(number: number): boolean {
        return this.#rules.has(number);
    }

    /**
     * Returns the set of rule numbers present in this rule set.
     * @returns {Set<number>} A Set containing all rule numbers
     */
    get rulesNumbers(): Set<number> {
        return new Set(this.#rules.keys());
    }

    /**
     * Returns all the rules in this rule set as an array.
     * @returns {PilotRule[]} An array of PilotRule objects
     */
    get rules(): PilotRule[] {
        return Array.from(this.#rules.values());
    }

    /**
     * Constructs a PilotRuleSet from an array of JSON objects.
     * Typically used internally when parsing API responses.
     * @param {PilotRuleJson[]} json - Array of JSON objects representing rules
     * @returns {PilotRuleSet} A new PilotRuleSet instance
     * @internal
     */
    /** @internal */

    static fromJson(json: PilotRuleJson[]): PilotRuleSet {
        const map = new Map<number, PilotRule>();
        for (const r of json) {
            map.set(r.ruleNumber, PilotRule.fromJson(r));
        }
        return new PilotRuleSet(map);
    }
}
