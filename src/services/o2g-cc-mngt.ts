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

import CallCenterManagementRest from '../internal/rest/ccMngt-rest';
import { Calendar } from '../types/cc-mngt/calendar/calendar';
import { DayOfWeek } from '../types/common/day-of-week';
import { ExceptionCalendar } from '../types/cc-mngt/calendar/exception-calendar';
import { NormalCalendar } from '../types/cc-mngt/calendar/normal-calendar';
import { Transition } from '../types/cc-mngt/calendar/transition';
import { Pilot } from '../types/cc-mngt/pilot';
import { PilotTransferQueryParameters } from '../types/telephony/call/ccd/pilot-transfer-query-param';

/**
 * `CallCenterManagement` provides operations to configure and manage CCD pilots
 * and their associated calendars.
 * <p>
 * Each CCD pilot has two types of calendars:
 * <ul>
 *   <li><b>Normal calendar</b> — defines standard pilot behaviour for each day of the
 *       week. Each day can have up to 10 transitions (time slots).</li>
 *   <li><b>Exception calendar</b> — defines special days that override the normal
 *       calendar (e.g. holidays). Each exceptional day can also have up to 10
 *       transitions.</li>
 * </ul>
 * A {@link Transition} represents a time slot in a calendar, including the start
 * time, the pilot rule to apply, and the pilot operating mode.
 * <p>
 * Using this service requires having a <b>CONTACTCENTER_SERVICE</b> license in
 * CAPEX mode, or 40 api-tel-f subscriptions in OPEX mode (Purple On Demand).
 */
export class CallCenterManagement {
    #ccManagementRest: CallCenterManagementRest;

    /**
     *
     * @internal
     */
    constructor(ccManagementRest: CallCenterManagementRest) {
        this.#ccManagementRest = ccManagementRest;
    }

    /**
     * Returns all CCD pilots configured on the specified OmniPCX Enterprise node.
     *
     * @param nodeId the OmniPCX Enterprise node identifier
     * @returns the list of {@link Pilot} objects, or `null` if no pilots are configured.
     */
    async getPilots(nodeId: number): Promise<Pilot[] | null> {
        return this.#ccManagementRest.getPilots(nodeId);
    }

    /**
     * Get information about a CCD pilot.
     *
     * When called without `pilotTransferQueryParam`, returns the pilot's current
     * configuration and state.
     *
     * When called with `pilotTransferQueryParam`, returns the pilot's routing
     * capabilities evaluated against the specified call profile context (agent,
     * skills, transfer type). This advanced form requires O2G version 2.7.4 or later.
     *
     * @example
     * ```typescript
     * // Simple form — get the pilot's current configuration
     * const pilot = await O2G.callCenterManagement.getPilot(1, "60141");
     *
     * // Advanced form — evaluate routing for a specific agent and skill set
     * const queryParam = new PilotTransferQueryParameters({
     *     agentNumber: "5001",
     *     skills: { skills: [{ skillNumber: 1, acrStatus: true, expertEvalLevel: 3 }] },
     *     priorityTransfer: true
     * });
     * const pilotAdvanced = await O2G.callCenterManagement.getPilot(1, "60141", queryParam);
     * ```
     *
     * @param nodeId                  the OmniPCX Enterprise node identifier
     * @param pilotNumber             the pilot number
     * @param pilotTransferQueryParam optional call profile context. When provided,
     *                                the pilot information is evaluated against the
     *                                specified agent number, skills and transfer type.
     *                                Requires O2G >= 2.7.4.
     * @returns the {@link Pilot} information, or `null` if not found.
     */
    async getPilot(
        nodeId: number,
        pilotNumber: string,
        pilotTransferQueryParam: PilotTransferQueryParameters | null = null
    ): Promise<Pilot | null> {
        if (pilotTransferQueryParam) {
            return this.#ccManagementRest.getPilotAdvanced(nodeId, pilotNumber, pilotTransferQueryParam);
        } else {
            return this.#ccManagementRest.getPilot(nodeId, pilotNumber);
        }
    }

    /**
     * Returns the calendar associated with the specified CCD pilot.
     * <p>
     * The calendar combines the normal and exception schedules that govern
     * the pilot's open/closed state over time.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @returns the {@link Calendar} of the pilot, or `null` if not found.
     */
    async getCalendar(nodeId: number, pilotNumber: string): Promise<Calendar | null> {
        return this.#ccManagementRest.getCalendar(nodeId, pilotNumber);
    }

    /**
     * Returns the exception calendar for the specified CCD pilot.
     * <p>
     * The exception calendar contains date-specific transitions that override
     * the normal weekly schedule.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @returns the {@link ExceptionCalendar}, or `null` if not found.
     */
    async getExceptionCalendar(nodeId: number, pilotNumber: string): Promise<ExceptionCalendar | null> {
        return this.#ccManagementRest.getExceptionCalendar(nodeId, pilotNumber);
    }

    /**
     * Adds a transition to the exception calendar of the specified CCD pilot.
     *
     * @example
     * ```typescript
     * // Add a closing transition on December 25th
     * const christmas = new Date(2025, 11, 25);
     * const closingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addExceptionTransition(1, "60141", christmas, closingTransition);
     *
     * // Later, update that transition (index 0 = first transition of the day)
     * const updatedTransition = new Transition({ ... });
     * await O2G.callCenterManagement.setExceptionTransition(1, "60141", christmas, 0, updatedTransition);
     *
     * // Or remove it entirely
     * await O2G.callCenterManagement.deleteExceptionTransition(1, "60141", christmas, 0);
     * ```
     *
     * @param nodeId         the OmniPCX Enterprise node identifier
     * @param pilotNumber    the pilot number
     * @param dateTransition the exceptional day to which the transition applies
     * @param transition     the {@link Transition} to add
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async addExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        transition: Transition
    ): Promise<boolean> {
        return this.#ccManagementRest.addExceptionTransition(nodeId, pilotNumber, dateTransition, transition);
    }

    /**
     * Deletes a transition from the exception calendar of the specified CCD pilot.
     * <p>
     * The transition is identified by its zero-based index in the list of transitions for the day.
     *
     * @param nodeId         the OmniPCX Enterprise node identifier
     * @param pilotNumber    the pilot number
     * @param dateTransition the exceptional day from which to remove the transition
     * @param index          the zero-based index of the transition to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async deleteExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        index: number
    ): Promise<boolean> {
        return this.#ccManagementRest.deleteExceptionTransition(nodeId, pilotNumber, dateTransition, index);
    }

    /**
     * Modifies a transition in the exception calendar of the specified CCD pilot.
     * <p>
     * The transition is identified by its zero-based index in the list of transitions for the day.
     *
     * @param nodeId         the OmniPCX Enterprise node identifier
     * @param pilotNumber    the pilot number
     * @param dateTransition the exceptional day containing the transition to modify
     * @param index          the zero-based index of the transition to modify
     * @param transition     the new {@link Transition} value
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setExceptionTransition(
        nodeId: number,
        pilotNumber: string,
        dateTransition: Date,
        index: number,
        transition: Transition
    ): Promise<boolean> {
        return this.#ccManagementRest.setExceptionTransition(nodeId, pilotNumber, dateTransition, index, transition);
    }

    /**
     * Returns the normal (weekly) calendar of the specified CCD pilot.
     * <p>
     * The normal calendar defines the recurring weekly schedule of open/closed
     * transitions for each day of the week.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @returns the {@link NormalCalendar}, or `null` if not found.
     */
    async getNormalCalendar(nodeId: number, pilotNumber: string): Promise<NormalCalendar | null> {
        return this.#ccManagementRest.getNormalCalendar(nodeId, pilotNumber);
    }

    /**
     * Adds a transition to the normal calendar of the specified CCD pilot for the given day of the week.
     *
     * @example
     * ```typescript
     * // Add an opening transition on Monday at 08:00
     * const openingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addNormalTransition(1, "60141", DayOfWeek.MONDAY, openingTransition);
     *
     * // Add a closing transition on Monday at 18:00
     * const closingTransition = new Transition({ ... });
     * await O2G.callCenterManagement.addNormalTransition(1, "60141", DayOfWeek.MONDAY, closingTransition);
     *
     * // Later, update the closing transition (index 1 = second transition of the day)
     * const updatedTransition = new Transition({ ... });
     * await O2G.callCenterManagement.setNormalTransition(1, "60141", DayOfWeek.MONDAY, 1, updatedTransition);
     *
     * // Or remove it
     * await O2G.callCenterManagement.deleteNormalTransition(1, "60141", DayOfWeek.MONDAY, 1);
     * ```
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @param day         the day of the week to which the transition applies
     * @param transition  the {@link Transition} to add
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async addNormalTransition(
        nodeId: number,
        pilotNumber: string,
        day: DayOfWeek,
        transition: Transition
    ): Promise<boolean> {
        return this.#ccManagementRest.addNormalTransition(nodeId, pilotNumber, day, transition);
    }

    /**
     * Deletes a transition from the normal calendar of the specified CCD pilot.
     * <p>
     * The transition is identified by its zero-based index in the list of transitions for the day.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @param day         the day of the week from which to remove the transition
     * @param index       the zero-based index of the transition to delete
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async deleteNormalTransition(nodeId: number, pilotNumber: string, day: DayOfWeek, index: number): Promise<boolean> {
        return this.#ccManagementRest.deleteNormalTransition(nodeId, pilotNumber, day, index);
    }

    /**
     * Modifies a transition in the normal calendar of the specified CCD pilot.
     * <p>
     * The transition is identified by its zero-based index in the list of transitions for the day.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @param day         the day of the week containing the transition to modify
     * @param index       the zero-based index of the transition to modify
     * @param transition  the new {@link Transition} value
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async setNormalTransition(
        nodeId: number,
        pilotNumber: string,
        day: DayOfWeek,
        index: number,
        transition: Transition
    ): Promise<boolean> {
        return this.#ccManagementRest.setNormalTransition(nodeId, pilotNumber, day, index, transition);
    }

    /**
     * Forces the specified CCD pilot into the open state, regardless of its calendar schedule.
     *
     * @example
     * ```typescript
     * // Force a pilot open outside its normal schedule
     * await O2G.callCenterManagement.openPilot(1, "60141");
     *
     * // Force it closed (e.g. during an incident)
     * await O2G.callCenterManagement.closePilot(1, "60141");
     *
     * // Note: these methods override the calendar schedule.
     * // The pilot will remain in the forced state until the next
     * // scheduled calendar transition occurs.
     * ```
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async openPilot(nodeId: number, pilotNumber: string): Promise<boolean> {
        return this.#ccManagementRest.openPilot(nodeId, pilotNumber);
    }

    /**
     * Forces the specified CCD pilot into the closed state, regardless of its calendar schedule.
     *
     * @param nodeId      the OmniPCX Enterprise node identifier
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     */
    async closePilot(nodeId: number, pilotNumber: string): Promise<boolean> {
        return this.#ccManagementRest.closePilot(nodeId, pilotNumber);
    }
}
