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

import { AgentConfigJson } from '../../internal/types/cc-agent/cc-agent-types';
import { AgentGroups } from './agent-groups';
import { AgentSkillSet } from './agent-skill-set';
import { OperatorType } from './operator-type';

/**
 * `OperatorConfig` represents the configuration of a CCD operator.
 *
 * A CCD operator can be an {@link OperatorType.AGENT | agent}
 * or an {@link OperatorType.SUPERVISOR | supervisor}. This class
 * provides access to the operator’s type, associated pro-ACD station,
 * group memberships, skills, and feature settings
 * (such as headset usage, self-assignment capability, or multiline configuration).
 */
export class OperatorConfig {
    #type: OperatorType;
    #proacd?: string;
    #processingGroups?: AgentGroups;
    #skills?: AgentSkillSet;
    #selfAssign?: boolean;
    #headset?: boolean;
    #help?: boolean;
    #multiline?: boolean;

    /**
     * @internal
     */
    constructor(
        type: OperatorType,
        proacd?: string,
        processingGroups?: AgentGroups,
        skills?: AgentSkillSet,
        selfAssign?: boolean,
        headset?: boolean,
        help?: boolean,
        multiline?: boolean
    ) {
        this.#type = type;
        this.#proacd = proacd;
        this.#processingGroups = processingGroups;
        this.#skills = skills;
        this.#selfAssign = selfAssign;
        this.#headset = headset;
        this.#help = help;
        this.#multiline = multiline;
    }

    /**
     * Returns the type of CCD operator (agent or supervisor).
     *
     * @returns The operator type.
     */
    get type(): OperatorType {
        return this.#type;
    }

    /**
     * Returns the associated pro-ACD station.
     *
     * @returns The pro-ACD station extension number,
     *          or `null` if none is associated.
     */
    get proacd(): string | null {
        return this.#proacd ?? null;
    }

    /**
     * Returns the agent groups the operator is attached to,
     * including the preferred group if defined.
     *
     * @returns The {@link AgentGroups} instance representing
     *          the operator’s group memberships,
     *          or `null` if none are configured.
     */
    get processingGroups(): AgentGroups | null {
        return this.#processingGroups ?? null;
    }

    /**
     * Returns the operator’s assigned skills.
     *
     * @returns The {@link AgentSkillSet} instance representing
     *          the operator’s skills,
     *          or `null` if none are defined.
     */
    get skills(): AgentSkillSet | null {
        return this.#skills ?? null;
    }

    /**
     * Indicates whether the operator can choose their own processing group.
     *
     * @returns `true` if the operator can self-assign a group;
     *          `false` otherwise.
     */
    get selfAssign(): boolean {
        return this.#selfAssign ?? false;
    }

    /**
     * Indicates whether the operator has the headset feature enabled.
     *
     * The headset feature allows a CCD operator to answer calls using a headset device.
     *
     * @returns `true` if headset functionality is enabled;
     *          `false` otherwise.
     */
    get headset(): boolean {
        return this.#headset ?? false;
    }

    /**
     * Indicates whether the operator can request help from a supervisor.
     *
     * @returns `true` if the operator can request help;
     *          `false` otherwise.
     */
    get help(): boolean {
        return this.#help ?? false;
    }

    /**
     * Indicates whether the operator is configured as multiline.
     *
     * @returns `true` if the operator supports multiline handling;
     *          `false` otherwise.
     */
    get multiline(): boolean {
        return this.#multiline ?? false;
    }

    /**
     * Creates an `OperatorConfig` instance from a JSON object.
     *
     * This method converts the provided {@link AgentConfigJson}
     * into a fully constructed `OperatorConfig`, including
     * nested {@link AgentGroups} and {@link AgentSkillSet} instances
     * when present.
     *
     * @param json - The JSON representation of an operator configuration.
     * @returns A new `OperatorConfig` instance.
     */
    /** @internal */

    static fromJson(json: AgentConfigJson): OperatorConfig {
        return new OperatorConfig(
            json.type,
            json.proacd,
            json.processingGroups ? AgentGroups.fromJson(json.processingGroups) : undefined,
            json.skills ? AgentSkillSet.fromJson(json.skills?.skills ?? []) : undefined,
            json.selfAssign,
            json.headset,
            json.help,
            json.multiline
        );
    }
}
