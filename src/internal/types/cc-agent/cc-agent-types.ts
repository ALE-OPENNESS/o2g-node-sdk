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

import { OperatorState } from '../../../types/cc-agent/operator-state';
import { OperatorType } from '../../../types/cc-agent/operator-type';

/** @internal */
export type AgentSkillJson = {
    /** Unique identifier of this skill */
    number: number;

    /** Skill level */
    level: number;

    /** Whether the skill is active */
    active: boolean;
};

/**
 * Represents the group configuration of a CCD operator.
 */
/** @internal */
export type AgentGroupsJson = {
    /** Preferred agent group */
    preferred?: string;

    /** All agent groups the operator is part of */
    groups?: string[];
};

/** @internal */
export type AgentConfigJson = {
    type: OperatorType;
    proacd?: string;
    processingGroups?: AgentGroupsJson;
    skills?: {
        skills?: AgentSkillJson[];
    };
    selfAssign?: boolean;
    headset?: boolean;
    help?: boolean;
    multiline?: boolean;
};

/**
 * Represents the state of a CCD operator.
 */
/** @internal */
export type OperatorStateJson = {
    /** Static (main) state */
    mainState: OperatorState.OperatorMainState;

    /** Dynamic (sub) state */
    subState?: OperatorState.OperatorDynamicState;

    /** Device number of the pro-acd the operator is logged into */
    proAcdDeviceNumber?: string;

    /** Agent group the operator is currently logged into */
    pgNumber?: string;

    /** Reason index for withdrawal, if applicable */
    withdrawReason?: number;

    /** Whether the operator is in withdrawal state */
    withdraw?: boolean;
};

/**
 * Represents a reason for agent withdrawal used in statistics.
 */
/** @internal */
export type WithdrawReasonJson = {
    /** Index of the reason */
    index: number;

    /** Human-readable label for the reason */
    label?: string;
};

/** @internal */
export type OnAgentSkillChangedJson = {
    loginName: string;
    skills: AgentSkillJson[];
};

/** @internal */
export type OnAgentStateChangedJson = {
    loginName: string;
    state: OperatorStateJson;
};

/** @internal */
export type OnSupervisorHelpCancelledJson = {
    loginName: string;
    agentNumber: string;
};

/** @internal */
export type OnSupervisorHelpRequestedJson = {
    loginName: string;
    agentNumber: string;
};
