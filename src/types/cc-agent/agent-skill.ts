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

import { AgentSkillJson } from "../../internal/types/cc-agent/cc-agent-types";

/**
 * Represents a skill assigned to a CCD agent.
 * <p>
 * Skills are used by the <b>Advanced Call Routing</b> strategy to influence
 * how calls are distributed among agents. Each skill has a unique identifier,
 * a proficiency level, and may belong to a specific domain.
 * <p>
 * An agent's skills are available via {@link AgentSkillSet}, which is returned
 * as part of the agent configuration from {@link CallCenterAgent.getConfiguration}.
 *
 * @see AgentSkillSet
 * @see CallCenterAgent.getConfiguration
 */
export class AgentSkill {
    #number?: number;
    #level?: number;
    #active?: boolean;
    #domain?: number;
    #name?: string;
    #abvName?: string;

    /**
     * @internal
     */
    private constructor(number?: number, level?: number, active?: boolean, domain?: number, name?: string, abvName?: string) {
        this.#number = number;
        this.#level = level;
        this.#active = active;
        this.#domain = domain;
        this.#name = name;
        this.#abvName = abvName;
    }

    /**
     * @internal
     */
    static fromJson(json: AgentSkillJson): AgentSkill {
        return new AgentSkill(
            json.number,
            json.level,
            json.active,
            json.domain,
            json.name,
            json.abvName
        );
    }

    /**
     * The unique identifier of this skill.
     *
     * @returns the skill number, or `-1` if not set
     */
    get number(): number {
        return this.#number ?? -1;
    }

    /**
     * The proficiency level of this skill.
     * <p>
     * A higher level typically indicates greater expertise or priority
     * when routing calls.
     *
     * @returns the skill level, or `-1` if not set
     */
    get level(): number {
        return this.#level ?? -1;
    }

    /**
     * Whether this skill is currently active.
     *
     * @returns `true` if the skill is active; `false` otherwise
     */
    get active(): boolean {
        return this.#active ?? false;
    }

    /**
     * The domain identifier this skill belongs to.
     *
     * @returns the domain id, or `-1` if not set
     * @since 2.7.5
     */
    get domain(): number {
        return this.#domain ?? -1;
    }

    /**
     * The full name of this skill.
     *
     * @returns the skill name, or `null` if not set
     * @since 2.7.5
     */
    get name(): string | null {
        return this.#name ?? null;
    }

    /**
     * The abbreviated name of this skill.
     *
     * @returns the abbreviated skill name, or `null` if not set
     * @since 2.7.5
     */
    get abvName(): string | null {
        return this.#abvName ?? null;
    }
}