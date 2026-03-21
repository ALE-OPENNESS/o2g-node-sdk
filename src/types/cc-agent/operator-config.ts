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
 * Represents the configuration of a CCD operator.
 * <p>
 * A CCD operator can be an {@link OperatorType.AGENT} or an
 * {@link OperatorType.SUPERVISOR}. This class provides access to the
 * operator's type, associated pro-ACD station, group memberships, skills,
 * and feature settings such as headset usage, self-assignment capability
 * and multiline configuration.
 * <p>
 * An `OperatorConfig` instance is returned by
 * {@link CallCenterAgent.getConfiguration}.
 *
 * @see CallCenterAgent.getConfiguration
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
     * The type of this CCD operator.
     *
     * @returns the {@link OperatorType} of this operator
     */
    get type(): OperatorType {
        return this.#type;
    }

    /**
     * The pro-ACD station extension number associated with this operator.
     *
     * @returns the pro-ACD station number, or `null` if none is configured
     */
    get proacd(): string | null {
        return this.#proacd ?? null;
    }

    /**
     * The agent groups this operator belongs to, including the preferred
     * group if defined.
     *
     * @returns the {@link AgentGroups} instance, or `null` if no groups are configured
     */
    get processingGroups(): AgentGroups | null {
        return this.#processingGroups ?? null;
    }

    /**
     * The skills assigned to this operator.
     *
     * @returns the {@link AgentSkillSet} instance, or `null` if no skills are defined
     */
    get skills(): AgentSkillSet | null {
        return this.#skills ?? null;
    }

    /**
     * Whether the operator can choose their own processing group.
     *
     * @returns `true` if the operator can self-assign a group; `false` otherwise
     */
    get selfAssign(): boolean {
        return this.#selfAssign ?? false;
    }

    /**
     * Whether the headset feature is enabled for this operator.
     * <p>
     * When enabled, the operator can answer calls using a headset device.
     *
     * @returns `true` if headset functionality is enabled; `false` otherwise
     */
    get headset(): boolean {
        return this.#headset ?? false;
    }

    /**
     * Whether the operator can request help from a supervisor.
     *
     * @returns `true` if the operator can request help; `false` otherwise
     */
    get help(): boolean {
        return this.#help ?? false;
    }

    /**
     * Whether the operator is configured for multiline handling.
     *
     * @returns `true` if the operator supports multiline handling; `false` otherwise
     */
    get multiline(): boolean {
        return this.#multiline ?? false;
    }

    /**
     * @internal
     */
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