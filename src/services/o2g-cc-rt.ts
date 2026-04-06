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

import EventEmitter from 'events';
import { EventRegistry } from '../events/event-dispatcher';
import { RtiObjects } from '../types/cc-rt/rti-objects';
import CallCenterRealtimeRest from '../internal/rest/ccRealtime-rest';
import { RtiObjectIdentifier } from '../types/cc-rt/rti-object-identifier';
import { RtiContext } from '../types/cc-rt/rti-context';
import {
    OnAgentProcessingGroupRtiChanged,
    OnAgentRtiChanged,
    OnOtherProcessingGroupRtiChanged,
    OnPilotRtiChanged,
    OnQueueRtiChanged,
} from '../types/cc-rt/cc-rt-events';

/**
 * Provides real-time information about CCD objects from an OXE system
 * in the form of events.
 * <p>
 * This service is available only to administrators and delivers the same
 * level of information as the legacy RTI interface available in the CCS.
 * <p>
 * The CCD objects that can be monitored include CCD agents, pilots, waiting
 * queues, processing groups associated with agents, and other processing
 * groups (e.g. forward, guide).
 * <p>
 * The typical usage sequence is:
 * <ol>
 * <li>Build an {@link RtiFilter} specifying which objects and attributes to monitor.</li>
 * <li>Create an {@link RtiContext} with the filter and the desired notification frequency.</li>
 * <li>Set the context with {@link setContext}.</li>
 * <li>Register event listeners for the RTI events of interest.</li>
 * <li>Start monitoring with {@link start}.</li>
 * </ol>
 * <p>
 * After initialization, the application is notified whenever one or more monitored
 * attributes change. Each event contains only the attributes that have changed
 * since the previous notification.
 *
 * @example
 * ```typescript
 * // Build a filter for specific agents and attributes
 * const filter = new RtiFilter();
 * filter.setAgentAttributes(
 *     AgentAttributes.PrivateCallsTotalDuration,
 *     AgentAttributes.AssociatedSet,
 *     AgentAttributes.LogonDate
 * );
 * filter.setAgentNumbers(["60119", "60120"]);
 *
 * // Create a context: notification every 30s, data refresh every 5s
 * const context = new RtiContext(30, 5, filter);
 * await O2G.callCenterRealtime.setContext(context);
 *
 * // Register event listeners
 * O2G.callCenterRealtime.on(CallCenterRealtime.ON_AGENT_RTI_CHANGED, (event) => {
 *     console.log("Agent RTI changed:", event);
 * });
 *
 * // Start monitoring
 * await O2G.callCenterRealtime.start();
 *
 * // Stop monitoring and clean up when done
 * await O2G.callCenterRealtime.deleteContext();
 * O2G.callCenterRealtime.removeAllListeners(CallCenterRealtime.ON_AGENT_RTI_CHANGED);
 * ```
 *
 * @since 2.7.4
 */
export class CallCenterRealtime extends EventEmitter {
    #ccRealtimeRest: CallCenterRealtimeRest;

    /**
     * Occurs when the real-time information of a CCD agent has changed.
     * @event
     */
    static readonly ON_AGENT_RTI_CHANGED = 'OnAgentRtiChanged';

    /**
     * Occurs when the real-time information of a CCD queue has changed.
     * @event
     */
    static readonly ON_QUEUE_RTI_CHANGED = 'OnQueueRtiChanged';

    /**
     * Occurs when the real-time information of a CCD pilot has changed.
     * @event
     */
    static readonly ON_PILOT_RTI_CHANGED = 'OnPilotRtiChanged';

    /**
     * Occurs when the real-time information of a CCD agent processing group has changed.
     * @event
     */
    static readonly ON_AGENT_PG_RTI_CHANGED = 'OnPGAgentRtiChanged';

    /**
     * Occurs when the real-time information of a CCD other processing group has changed.
     * @event
     */
    static readonly ON_OTHER_PG_RTI_CHANGED = 'OnPGOtherRtiChanged';
    /**
     *
     * @internal
     */
    constructor(ccRealtimeRest: CallCenterRealtimeRest, eventRegistry: EventRegistry) {
        super();
        this.#ccRealtimeRest = ccRealtimeRest;

        eventRegistry.register(this, CallCenterRealtime.ON_AGENT_RTI_CHANGED, OnAgentRtiChanged);
        eventRegistry.register(this, CallCenterRealtime.ON_AGENT_PG_RTI_CHANGED, OnAgentProcessingGroupRtiChanged);
        eventRegistry.register(this, CallCenterRealtime.ON_OTHER_PG_RTI_CHANGED, OnOtherProcessingGroupRtiChanged);
        eventRegistry.register(this, CallCenterRealtime.ON_PILOT_RTI_CHANGED, OnPilotRtiChanged);
        eventRegistry.register(this, CallCenterRealtime.ON_QUEUE_RTI_CHANGED, OnQueueRtiChanged);
    }

    /**
     * Retrieves all CCD objects that currently provide real-time information.
     *
     * The returned {@link RtiObjects} includes collections of agents, pilots,
     * queues, and processing groups that can be monitored.
     *
     * Returns `null` if no objects are available or an error occurs.
     */
    async getRtiObjects(): Promise<RtiObjects | null> {
        return this.#ccRealtimeRest.getRtiObjects();
    }

    /**
     * Returns all CCD agents that provide real-time information.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agents,
     *          or an empty array if none exist.
     */
    async getAgents(): Promise<RtiObjectIdentifier[] | null> {
        return this.#ccRealtimeRest.getAgents();
    }

    /**
     * Returns all CCD pilots that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for pilots,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    async getPilots(): Promise<RtiObjectIdentifier[] | null> {
        return this.#ccRealtimeRest.getPilots();
    }

    /**
     * Returns all CCD queues that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for queues,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    async getQueues(): Promise<RtiObjectIdentifier[] | null> {
        return this.#ccRealtimeRest.getQueues();
    }

    /**
     * Returns all CCD agent processing groups that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for agent processing groups,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    async getAgentProcessingGroups(): Promise<RtiObjectIdentifier[] | null> {
        return this.#ccRealtimeRest.getAgentProcessingGroups();
    }

    /**
     * Returns all CCD processing groups (other than agents) that provide real-time information.
     *
     * @returns A promise resolving to an array of {@link RtiObjectIdentifier} for other processing groups,
     *          or an empty array if none exist, or `null` if an error occurs.
     */
    async getOtherProcessingGroups(): Promise<RtiObjectIdentifier[] | null> {
        return this.#ccRealtimeRest.getOtherProcessingGroups();
    }

    /**
     * Returns the monitoring Context associated with this administrator (session).
     *
     * @returns The Context associated with this administrator, or `null` if none exists.
     */
    async getContext(): Promise<RtiContext | null> {
        return this.#ccRealtimeRest.getContext();
    }

    /**
     * Deletes the monitoring Context associated with this administrator (session),
     * stopping any RTI event notifications.
     *
     * @returns `true` if the deletion was successful; `false` otherwise.
     */
    async deleteContext(): Promise<boolean> {
        return this.#ccRealtimeRest.deleteContext();
    }

    /**
     * Associates or updates the monitoring Context for this administrator (session).
     * If no context exists, a new one is created.
     *
     * The context defines which objects and attributes are monitored and the
     * notification frequency for RTI events.
     *
     * @param context The Context to associate with this administrator.
     * @returns `true` if the update was successful; `false` otherwise.
     */
    async setContext(context: RtiContext): Promise<boolean> {
        return this.#ccRealtimeRest.setContext(context);
    }

    /**
     * Starts the monitoring of CCD objects according to the associated context.
     *
     * After calling this method, RTI events will be sent to any registered listeners.
     *
     * @returns `true` if the monitoring started successfully; `false` otherwise.
     */
    async start(): Promise<boolean> {
        return this.#ccRealtimeRest.start();
    }
}
