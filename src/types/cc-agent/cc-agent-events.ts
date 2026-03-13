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

import {
    OnAgentSkillChangedJson,
    OnAgentStateChangedJson,
    OnSupervisorHelpCancelledJson,
    OnSupervisorHelpRequestedJson,
} from '../../internal/types/cc-agent/cc-agent-types';
import { AgentSkillSet } from './agent-skill-set';
import { OperatorState } from './operator-state';

/**
 * Notification sent when an agent's skills have changed.
 */
export class OnAgentSkillChanged {
    #loginName: string;
    #skills: AgentSkillSet;

    private constructor(loginName: string, skills: AgentSkillSet) {
        this.#loginName = loginName;
        this.#skills = skills;
    }

    /** Login name of the agent (identifier which can be used for filtering). */
    get loginName(): string {
        return this.#loginName;
    }

    /** Updated set of skills for the agent. */
    get skills(): AgentSkillSet {
        return this.#skills;
    }

    /**
     * Creates an OnAgentSkillChanged instance from JSON.
     * @param json The OnAgentSkillChangedJson object
     */
    /** @internal */

    static fromJson(json: OnAgentSkillChangedJson): OnAgentSkillChanged {
        return new OnAgentSkillChanged(json.loginName, AgentSkillSet.fromJson(json.skills ?? []));
    }
}

/**
 * Notification sent when an agent's state has changed.
 */
export class OnAgentStateChanged {
    #loginName: string;
    #state: OperatorState;

    private constructor(loginName: string, state: OperatorState) {
        this.#loginName = loginName;
        this.#state = state;
    }

    /** Login name of the agent (identifier which can be used for filtering). */
    get loginName(): string {
        return this.#loginName;
    }

    /** Updated state of the agent. */
    get state(): OperatorState {
        return this.#state;
    }

    /**
     * Creates an OnAgentStateChanged instance from JSON.
     * @param json The OnAgentStateChangedJson object
     */
    /** @internal */

    static fromJson(json: OnAgentStateChangedJson): OnAgentStateChanged {
        return new OnAgentStateChanged(json.loginName, OperatorState.fromJson(json.state));
    }
}

/**
 * Notification sent when a supervisor cancels a help request from an agent.
 */
export class OnSupervisorHelpCancelled {
    #loginName!: string;
    #agentNumber!: string;

    /**
     * @internal
     */
    private constructor(loginName: string, agentNumber: string) {
        this.#loginName = loginName;
        this.#agentNumber = agentNumber;
    }

    /** Login name of the supervisor or agent requesting help. */
    get loginName(): string {
        return this.#loginName;
    }

    /** The agent number for whom the help was cancelled. */
    get agentNumber(): string {
        return this.#agentNumber;
    }

    /**
     * @internal
     */
    static fromJson(json: OnSupervisorHelpCancelledJson): OnSupervisorHelpCancelled {
        return new OnSupervisorHelpCancelled(json.loginName, json.agentNumber);
    }
}

/**
 * Notification sent when a supervisor help is requested by an agent.
 */
export class OnSupervisorHelpRequested {
    #loginName: string;
    #agentNumber: string;

    /**
     * @internal
     */
    private constructor(loginName: string, agentNumber: string) {
        this.#loginName = loginName;
        this.#agentNumber = agentNumber;
    }

    /** Login name of the supervisor or agent requesting help. */
    get loginName(): string {
        return this.#loginName;
    }

    /** The agent number requesting the supervisor's help. */
    get agentNumber(): string {
        return this.#agentNumber;
    }

    /**
     * @internal
     */
    static fromJson(json: OnSupervisorHelpRequestedJson): OnSupervisorHelpRequested {
        return new OnSupervisorHelpRequested(json.loginName, json.agentNumber);
    }
}
