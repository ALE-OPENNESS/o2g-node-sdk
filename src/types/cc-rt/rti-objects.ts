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

import { RtiObjectsJson } from '../../internal/types/cc-rt/cc-rt-types';
import { RtiAgentAttributes } from './agent-attributes';
import { RtiAgentProcessingGroupAttributes } from './agent-pg-attributes';
import { RtiOtherProcessingGroupAttributes } from './other-pg-attributes';
import { RtiPilotAttributes } from './pilot-attributes';
import { RtiQueueAttributes } from './queue-attributes';
import { RtiFilter } from './rti-filter';
import { RtiObjectIdentifier } from './rti-object-identifier';

/**
 * Represents a collection of CCD objects for which real-time information is available.
 *
 * This class groups CCD objects by type, including agents, pilots, queues, and processing groups
 * (both agent and other). Each object is represented by an {@link RtiObjectIdentifier}.
 *
 * Instances of this class are typically returned by the {@link RtiService}
 * to provide the list of available CCD objects for which real-time data can be retrieved.
 *
 * A {@link RtiFilter} can be created from an `RtiObjects` instance using
 * {@link #createFilter} to subscribe only to the selected objects in real-time event monitoring.
 *
 * @see RtiObjectIdentifier
 * @see RtiService
 * @see RtiFilter
 * @since 2.7.4
 */
export class RtiObjects {
    #agents?: RtiObjectIdentifier[];
    #pilots?: RtiObjectIdentifier[];
    #queues?: RtiObjectIdentifier[];
    #pgAgents?: RtiObjectIdentifier[];
    #pgOthers?: RtiObjectIdentifier[];

    /**
     * @internal
     */
    private constructor(
        agents?: RtiObjectIdentifier[],
        pilots?: RtiObjectIdentifier[],
        queues?: RtiObjectIdentifier[],
        pgAgents?: RtiObjectIdentifier[],
        pgOthers?: RtiObjectIdentifier[]
    ) {
        this.#agents = agents;
        this.#pilots = pilots;
        this.#queues = queues;
        this.#pgAgents = pgAgents;
        this.#pgOthers = pgOthers;
    }

    /**
     * Returns the list of CCD agents.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agents.
     */
    get agents(): RtiObjectIdentifier[] | null {
        return this.#agents ? this.#agents.slice() : null;
    }

    /**
     * Returns the list of CCD pilots.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing pilots.
     */
    get pilots(): RtiObjectIdentifier[] | null {
        return this.#pilots ? this.#pilots.slice() : null;
    }

    /**
     * Returns the list of CCD queues.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing queues.
     */
    get queues(): RtiObjectIdentifier[] | null {
        return this.#queues ? this.#queues.slice() : null;
    }

    /**
     * Returns the list of agent processing groups.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing agent processing groups.
     */
    get agentProcessingGroups(): RtiObjectIdentifier[] | null {
        return this.#pgAgents ? this.#pgAgents.slice() : null;
    }

    /**
     * Returns the list of other (non-agent) processing groups.
     *
     * @returns An array of {@link RtiObjectIdentifier} representing other processing groups.
     */
    get otherProcessingGroups(): RtiObjectIdentifier[] | null {
        return this.#pgOthers ? this.#pgOthers.slice() : null;
    }

    /**
     * @internal
     */
    static fromJson(json: RtiObjectsJson): RtiObjects {
        return new RtiObjects(
            json.agents ? json.agents.map(RtiObjectIdentifier.fromJson) : undefined,
            json.pilots ? json.pilots.map(RtiObjectIdentifier.fromJson) : undefined,
            json.queues ? json.queues.map(RtiObjectIdentifier.fromJson) : undefined,
            json.pgAgents ? json.pgAgents.map(RtiObjectIdentifier.fromJson) : undefined,
            json.pgOthers ? json.pgOthers.map(RtiObjectIdentifier.fromJson) : undefined
        );
    }

    /**
     * Creates a {@link RtiFilter} initialized with all CCD objects in this instance.
     *
     * The resulting filter can be used to create a real-time context for event monitoring
     * with {@link RtiService}. It includes all agents, pilots, queues, and processing groups
     * present in this `RtiObjects` instance.
     *
     * @returns A {@link RtiFilter} containing all objects from this `RtiObjects` instance.
     *
     * @example
     * ```ts
     * const rtiObjects = rtiService.getRtiObjects();
     * const filter = rtiObjects.createFilter();
     * const context = new RtiContext(30, 5, filter);
     * rtiService.setContext(context);
     * rtiService.start();
     * ```
     */
    createFilter(): RtiFilter {
        const filter = new RtiFilter();

        if (this.#agents?.length) {
            filter.setAgentNumbers(this.#agents.map((a) => a.number));
            filter.setAgentAttributes(RtiAgentAttributes.ALL);
        }

        if (this.#pilots?.length) {
            filter.setPilotNumbers(this.#pilots.map((p) => p.number));
            filter.setPilotAttributes(RtiPilotAttributes.ALL);
        }

        if (this.#queues?.length) {
            filter.setQueueNumbers(this.#queues.map((q) => q.number));
            filter.setQueueAttributes(RtiQueueAttributes.ALL);
        }

        if (this.#pgAgents?.length) {
            filter.setAgentProcessingGroupNumbers(this.#pgAgents.map((pg) => pg.number));
            filter.setAgentProcessingGroupAttributes(RtiAgentProcessingGroupAttributes.ALL);
        }

        if (this.#pgOthers?.length) {
            filter.setOtherProcessingGroupNumbers(this.#pgOthers.map((pg) => pg.number));
            filter.setOtherProcessingGroupAttributes(RtiOtherProcessingGroupAttributes.ALL);
        }

        return filter;
    }
}
