/*
 * Copyright 2021 ALE International
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

import { IntrusionMode } from '../types/cc-agent/intrusion-mode';
import CallCenterAgentRest from '../internal/rest/ccAgent-rest';
import EventEmitter from 'events';
import { EventRegistry } from '../events/event-dispatcher';
import {
    OnAgentSkillChanged,
    OnAgentStateChanged,
    OnSupervisorHelpCancelled,
    OnSupervisorHelpRequested,
} from '../types/cc-agent/cc-agent-events';
import { OperatorConfig } from '../types/cc-agent/operator-config';
import { OperatorState } from '../types/cc-agent/operator-state';
import { WithdrawReason } from '../types/cc-agent/withdraw-reason';

/**
 * `CallCenterAgent` provides access to Contact Center features for CCD operators.
 * A CCD operator can be either a CCD agent or a CCD supervisor.
 * <p>
 * Using this service requires having a <b>CONTACTCENTER_AGENT</b> license.
 */
export class CallCenterAgent extends EventEmitter {
    #ccAgentRest: CallCenterAgentRest;

    /**
     * Occurs when an agent state has changed.
     * @event
     */
    static readonly ON_AGENT_STATE_CHANGED = 'OnAgentStateChanged';

    /**
     * Occurs when CCD agent skills are modified: one or several skills have been activated or deactivated.
     * @event
     */
    static readonly ON_AGENT_SKILL_CHANGED = 'OnAgentSkillChanged';

    /**
     * Occurs when an agent requests help from their supervisor.
     * @see requestPermanentListening
     * @see requestSupervisorHelp
     * @event
     */
    static readonly ON_SUPERVISOR_HELP_REQUESTED = 'OnSupervisorHelpRequested';

    /**
     * Occurs when an agent has requested the assistance of their supervisor and the request
     * is cancelled by the agent, or rejected by the supervisor.
     * @see cancelSupervisorHelpRequest
     * @see rejectAgentHelpRequest
     * @event
     */
    static readonly ON_SUPERVISOR_HELP_CANCELLED = 'OnSupervisorHelpCancelled';

    /**
     * @internal
     */
    constructor(ccAgentRest: CallCenterAgentRest, eventRegistry: EventRegistry) {
        super();
        this.#ccAgentRest = ccAgentRest;

        eventRegistry.register(this, CallCenterAgent.ON_AGENT_STATE_CHANGED, OnAgentStateChanged);
        eventRegistry.register(this, CallCenterAgent.ON_AGENT_SKILL_CHANGED, OnAgentSkillChanged);
        eventRegistry.register(this, CallCenterAgent.ON_SUPERVISOR_HELP_REQUESTED, OnSupervisorHelpRequested);
        eventRegistry.register(this, CallCenterAgent.ON_SUPERVISOR_HELP_CANCELLED, OnSupervisorHelpCancelled);
    }

    /**
     * Gets the operator configuration.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the operator login name
     * @returns the {@link OperatorConfig} on success; `null` otherwise.
     */
    async getConfiguration(loginName: string | null = null): Promise<OperatorConfig | null> {
        return await this.#ccAgentRest.getConfiguration(loginName);
    }

    /**
     * Gets the specified agent or supervisor state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the operator login name
     * @returns the {@link OperatorState} on success; `null` otherwise.
     * @see requestSnapshot
     */
    async getState(loginName: string | null = null): Promise<OperatorState | null> {
        return await this.#ccAgentRest.getState(loginName);
    }

    /**
     * Logs on an agent or a supervisor.
     * <p>
     * For a supervisor, if `pgNumber` is omitted, the supervisor is logged on out of group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Log on an agent to processing group "pg001" with headset mode
     * await O2G.callCenterAgent.logon("acd001", "pg001", true);
     *
     * // Log on a supervisor out of group (no pgNumber)
     * await O2G.callCenterAgent.logon("acd001");
     *
     * // Administrator logging on an agent on behalf of a user
     * await O2G.callCenterAgent.logon("acd001", "pg001", false, "jdoe");
     * ```
     *
     * @param proAcdNumber the pro-ACD device number
     * @param pgNumber     the agent processing group number
     * @param headset      activate the headset mode
     * @param loginName    the CCD operator login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see logoff
     */
    async logon(
        proAcdNumber: string,
        pgNumber: string | null = null,
        headset = false,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#ccAgentRest.logon(proAcdNumber, pgNumber, headset, loginName);
    }

    /**
     * Logs off an agent or a supervisor.
     * <p>
     * This method does nothing and returns `true` if the agent or supervisor is already logged off.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the CCD operator login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see logon
     */
    async logoff(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.logoff(loginName);
    }

    /**
     * Enters an agent group. Only for a supervisor.
     * <p>
     * This method is used by a supervisor to enter an agent group when in
     * pre-assigned state (logged on but not in an agent group).
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param pgNumber  the agent processing group number
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see exit
     */
    async enter(pgNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.enter(pgNumber, loginName);
    }

    /**
     * Exits from an agent group. Only for a supervisor.
     * <p>
     * This method is used by a supervisor to leave an agent group and go back to
     * pre-assigned state (logged on but not in an agent group).
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see enter
     */
    async exit(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.exit(loginName);
    }

    /**
     * Puts the specified agent in wrapup state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setWrapup(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.setWrapup(loginName);
    }

    /**
     * Puts the specified agent in ready state.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setReady(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.setReady(loginName);
    }

    /**
     * Puts the specified agent in pause.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setPause(loginName: string | null = null) {
        return await this.#ccAgentRest.setPause(loginName);
    }

    /**
     * Requests a supervisor to listen to the specified agent (permanent listening).
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_REQUESTED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Start permanent listening on agent "5001"
     * await O2G.callCenterAgent.requestPermanentListening("5001");
     *
     * // Listen to events to know when listening is established
     * O2G.callCenterAgent.on(CallCenterAgent.ON_SUPERVISOR_HELP_REQUESTED, (event) => {
     *     console.log("Listening established");
     * });
     *
     * // Cancel the listening when done
     * await O2G.callCenterAgent.cancelPermanentListening();
     * ```
     *
     * @param agentNumber the extension number of the agent to listen to
     * @param loginName   the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelPermanentListening
     */
    async requestPermanentListening(agentNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.requestPermanentListening(agentNumber, loginName);
    }

    /**
     * Cancels a permanent listening by a supervisor.
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestPermanentListening
     */
    async cancelPermanentListening(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.cancelPermanentListening(loginName);
    }

    /**
     * Requests intrusion in a CCD call.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // Intrude on agent "5001" in normal mode
     * await O2G.callCenterAgent.requestIntrusion("5001");
     *
     * // Intrude in coach mode (agent hears supervisor, caller does not)
     * await O2G.callCenterAgent.requestIntrusion("5001", IntrusionMode.COACH);
     *
     * // Switch from coach mode to normal intrusion
     * await O2G.callCenterAgent.changeIntrusionMode(IntrusionMode.NORMAL);
     *
     * // Cancel the intrusion by passing the current mode
     * await O2G.callCenterAgent.changeIntrusionMode(IntrusionMode.NORMAL);
     * ```
     *
     * @param agentNumber   the extension number of the CCD agent who answers the CCD call
     * @param intrusionMode the intrusion mode
     * @param loginName     the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see changeIntrusionMode
     */
    async requestIntrusion(
        agentNumber: string,
        intrusionMode = IntrusionMode.NORMAL,
        loginName: string | null = null
    ): Promise<boolean> {
        return await this.#ccAgentRest.requestIntrusion(agentNumber, intrusionMode, loginName);
    }

    /**
     * Changes the intrusion mode.
     * <p>
     * This method allows changing the intrusion mode or cancelling an intrusion.
     * To cancel an intrusion, pass the current mode in the `newIntrusionMode` parameter.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param newIntrusionMode the new intrusion mode
     * @param loginName        the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestIntrusion
     */
    async changeIntrusionMode(newIntrusionMode: IntrusionMode, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.changeIntrusionMode(newIntrusionMode, loginName);
    }

    /**
     * Requests help from the supervisor.
     * <p>
     * On success, an {@link ON_SUPERVISOR_HELP_REQUESTED} event is raised for both the agent and the supervisor.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelSupervisorHelpRequest
     */
    async requestSupervisorHelp(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.requestSupervisorHelp(loginName);
    }

    /**
     * Rejects a help request from an agent.
     * <p>
     * This method is invoked by a supervisor to reject a help request from an agent.
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param agentNumber the extension number of the agent who has requested help
     * @param loginName   the supervisor login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see cancelSupervisorHelpRequest
     */
    async rejectAgentHelpRequest(agentNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.rejectAgentHelpRequest(agentNumber, loginName);
    }

    /**
     * Cancels a supervisor help request.
     * <p>
     * This method is invoked by an agent to cancel a help request.
     * On success, an {@link ON_SUPERVISOR_HELP_CANCELLED} event is raised.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param supervisorNumber the extension number of the requested supervisor
     * @param loginName        the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see requestSupervisorHelp
     */
    async cancelSupervisorHelpRequest(supervisorNumber: string, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.cancelSupervisorHelpRequest(supervisorNumber, loginName);
    }

    /**
     * Asks a snapshot event to receive an {@link ON_AGENT_STATE_CHANGED} event.
     * <p>
     * The {@link ON_AGENT_STATE_CHANGED} event contains the operator {@link OperatorState}.
     * If a second request is asked while the previous one is still in progress, it has no effect.
     * <p>
     * If an administrator invokes this method with `loginName` set to `null`, the snapshot
     * request is done for all agents. The event processing can be long depending on the number
     * of users.
     *
     * @param loginName the agent login name
     * @returns `true` if the request was successfully submitted; `false` otherwise.
     * @see getState
     */
    async requestSnapshot(loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.requestSnapshot(loginName);
    }

    /**
     * Activates the specified skills.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     * <p>
     * This method does not validate skill numbers. If a skill number is invalid
     * (not assigned to the operator), it is ignored and the method returns `true`.
     *
     * @example
     * ```typescript
     * // Activate skills 1, 2 and 5 for the current user
     * await O2G.callCenterAgent.activateSkills([1, 2, 5]);
     *
     * // Activate skills for a specific agent (administrator session)
     * await O2G.callCenterAgent.activateSkills([1, 2, 5], "jdoe");
     *
     * // Invalid skill numbers are silently ignored — this still returns true
     * await O2G.callCenterAgent.activateSkills([1, 99, 100]);
     * ```
     *
     * @param skillNumbers the list of skill numbers to activate
     * @param loginName    the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see deactivateSkills
     */
    async activateSkills(skillNumbers: number[], loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.activateSkills(skillNumbers, loginName);
    }

    /**
     * Deactivates the specified skills.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     * <p>
     * This method does not validate skill numbers. If a skill number is invalid
     * (not assigned to the operator), it is ignored and the method returns `true`.
     *
     * @param skillNumbers the list of skill numbers to deactivate
     * @param loginName    the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see activateSkills
     */
    async deactivateSkills(skillNumbers: number[], loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.deactivateSkills(skillNumbers, loginName);
    }

    /**
     * Returns the list of withdraw reasons for the specified processing group.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @param pgNumber  the agent processing group number
     * @param loginName the agent login name
     * @returns the list of {@link WithdrawReason} objects on success; `null` otherwise.
     * @see setWithdraw
     */
    async getWithdrawReasons(pgNumber: string, loginName: string | null = null): Promise<WithdrawReason[] | null> {
        return await this.#ccAgentRest.getWithdrawReasons(pgNumber, loginName);
    }

    /**
     * Withdraws an agent with the specified reason.
     * <p>
     * If the session has been opened for a user, the `loginName` parameter is
     * ignored, but it is mandatory if the session has been opened by an administrator.
     *
     * @example
     * ```typescript
     * // First retrieve the available withdraw reasons for the processing group
     * const reasons = await O2G.callCenterAgent.getWithdrawReasons("pg001");
     *
     * // Then withdraw the agent using one of the returned reasons
     * if (reasons && reasons.length > 0) {
     *     await O2G.callCenterAgent.setWithdraw(reasons[0]);
     * }
     * ```
     *
     * @param reason    the withdraw reason
     * @param loginName the agent login name
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see getWithdrawReasons
     */
    async setWithdraw(reason: WithdrawReason, loginName: string | null = null): Promise<boolean> {
        return await this.#ccAgentRest.setWithdraw(reason, loginName);
    }
}
