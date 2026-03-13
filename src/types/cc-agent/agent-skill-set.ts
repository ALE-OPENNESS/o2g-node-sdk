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

import { AgentSkillJson } from '../../internal/types/cc-agent/cc-agent-types';
import { AgentSkill } from './agent-skill';

/**
 * Represents the set of skills assigned to a CCD agent.
 * <p>
 * An `AgentSkillSet` is a collection of {@link AgentSkill} objects indexed by
 * skill number. It is returned as part of the agent's configuration and state,
 * and can be used to check which skills an agent has and whether specific
 * skills are active.
 *
 * @see CallCenterAgent.getConfiguration
 * @see CallCenterAgent.activateSkills
 * @see CallCenterAgent.deactivateSkills
 */
export class AgentSkillSet {
    #skills: Map<number, AgentSkill>;

    /**
     * @internal
     */
    private constructor(rules: Map<number, AgentSkill>) {
        this.#skills = rules;
    }

    /**
     * Returns the skill with the specified number.
     *
     * @param number the skill number
     * @returns the {@link AgentSkill} with the specified number, or `null` if not found
     */
    get(number: number): AgentSkill | null {
        return this.#skills.get(number) ?? null;
    }

    /**
     * Returns whether the specified skill number exists in this skill set.
     *
     * @param number the skill number to check
     * @returns `true` if the skill is present; `false` otherwise
     */
    contains(number: number): boolean {
        return this.#skills.has(number) ?? false;
    }

    /**
     * Returns the set of skill numbers contained in this skill set.
     *
     * @returns a `Set` of skill numbers
     */
    get skillsNumbers(): Set<number> {
        return new Set(this.#skills.keys());
    }

    /**
     * Returns all skills in this skill set.
     *
     * @returns the list of {@link AgentSkill} objects
     */
    get skills(): AgentSkill[] {
        return Array.from(this.#skills.values());
    }

    /**
     * @internal
     */
    static fromJson(json: AgentSkillJson[]): AgentSkillSet {
        const map = new Map<number, AgentSkill>();
        for (const s of json) {
            const skill = AgentSkill.fromJson(s);
            map.set(skill.number, skill);
        }
        return new AgentSkillSet(map);
    }
}
