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

import { ACRSkillJson } from '../../../../internal/types/telephony/telephony-types';

/**
 * Represents an immutable collection of skills required to handle a call in a contact center.
 *
 * This class provides convenient access to individual skills by their identifier,
 * allows checking for existence, and exposes all available skills or their identifiers.
 * Skills are used by the <em>Advanced Call Routing</em> strategy to influence
 * how calls are distributed among agents.
 *
 * <b>Example usage:</b>
 *
 * ```ts
 * // Create a call profile using varargs
 * const profile = new CallProfile(
 *     new CallProfile.Skill(101, 3, true),
 *     new CallProfile.Skill(102, 2, false),
 *     new CallProfile.Skill(103, 1, false)
 * );
 *
 * // Access a skill
 * const s = profile.get(101);
 * console.log(`Skill ${s?.number} mandatory? ${s?.mandatory}`);
 *
 * // Check if a skill exists
 * const hasSkill = profile.contains(102);
 *
 * // Iterate over all skills
 * for (const skill of profile.skills) {
 *     console.log(`${skill.number}: level ${skill.level}`);
 * }
 * ```
 */
export class CallProfile {
    #skills: Map<number, CallProfile.Skill>;

    /**
     * Creates a CallProfile.
     *
     * Can be called in three ways:
     * 1. No arguments → empty profile
     * 2. Varargs of skills → `new CallProfile(skill1, skill2, ...)`
     * 3. Single iterable (array, Set, etc.) of skills → `new CallProfile([skill1, skill2])`
     */
    constructor(...args: (CallProfile.Skill | Iterable<CallProfile.Skill>)[]) {
        this.#skills = new Map<number, CallProfile.Skill>();

        if (args.length === 0) return;

        let skillsInput: Iterable<CallProfile.Skill>;

        if (args.length === 1 && Symbol.iterator in Object(args[0]) && !(args[0] instanceof CallProfile.Skill)) {
            skillsInput = args[0] as Iterable<CallProfile.Skill>;
        } else {
            skillsInput = args as CallProfile.Skill[];
        }

        for (const skill of skillsInput) {
            if (skill?.number != null) {
                this.#skills.set(skill.number, skill);
            }
        }
    }

    /**
     * Returns the skill with the specified number.
     *
     * @param number - The skill number (identifier)
     * @returns The {@link CallProfile.Skill} with the given number, or `undefined` if not present
     */
    get(number: number): CallProfile.Skill | undefined {
        return this.#skills.get(number);
    }

    /**
     * Determines whether a skill with the specified number exists in this profile.
     *
     * @param number - The skill number to search for
     * @returns `true` if the skill exists; `false` otherwise
     */
    contains(number: number): boolean {
        return this.#skills.has(number);
    }

    /**
     * Returns a read-only set of all skill numbers contained in this profile.
     *
     * @returns A `ReadonlySet` of skill identifiers
     */
    get skillNumbers(): ReadonlySet<number> {
        return new Set(this.#skills.keys());
    }

    /**
     * Returns a read-only collection of all skills contained in this profile.
     *
     * @returns A `ReadonlyArray` of {@link CallProfile.Skill} instances
     */
    get skills(): ReadonlyArray<CallProfile.Skill> {
        return Array.from(this.#skills.values());
    }

    /**
     * Converts this CallProfile to JSON format suitable for `PilotQueryParamJson`.
     *
     * @returns An object with a `skills` array containing each skill's number, status, and level
     */
    /** @internal */

    toJson(): { skills: ACRSkillJson[] } {
        return {
            skills: this.skills
                .filter((s): s is NonNullable<typeof s> => s !== undefined)
                .map((s) => ({
                    skillNumber: s.number ?? undefined,
                    acrStatus: s.mandatory,
                    expertEvalLevel: s.level ?? undefined,
                })),
        };
    }
}

/**
 * Namespace for {@link CallProfile} related types.
 */
export namespace CallProfile {
    /**
     * Represents a skill assigned to a {@link CallProfile}.
     *
     * Each skill has a unique number (identifier), a proficiency level,
     * and a flag indicating whether it is mandatory for advanced call routing.
     */
    export class Skill {
        #number?: number;
        #level?: number;
        #mandatory?: boolean;

        /**
         * Constructs a new skill instance.
         *
         * @param number - The unique skill identifier
         * @param level - The skill proficiency level
         * @param mandatory - Whether this skill is mandatory
         */
        constructor(number: number, level: number, mandatory: boolean) {
            this.#number = number;
            this.#level = level;
            this.#mandatory = mandatory;
        }

        /**
         * Returns the unique identifier of this skill.
         *
         * @returns The skill number, or `null` if not set
         */
        get number(): number | null {
            return this.#number ?? null;
        }

        /**
         * Returns the proficiency level of this skill.
         *
         * Higher values indicate greater expertise or priority for call routing.
         *
         * @returns The skill level, or `null` if not set
         */
        get level(): number | null {
            return this.#level ?? null;
        }

        /**
         * Indicates whether this skill is mandatory when evaluating a call profile.
         *
         * @returns `true` if the skill is mandatory; `false` otherwise
         */
        get mandatory(): boolean {
            return this.#mandatory ?? false;
        }
    }
}
