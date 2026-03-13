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

import { RtiFilterJson } from '../../internal/types/cc-rt/cc-rt-types';
import { RtiAgentAttributes } from './agent-attributes';
import { RtiAgentProcessingGroupAttributes } from './agent-pg-attributes';
import { RtiOtherProcessingGroupAttributes } from './other-pg-attributes';
import { RtiPilotAttributes } from './pilot-attributes';
import { RtiQueueAttributes } from './queue-attributes';

abstract class AbstractRtiFilter<T> {
    #numbers: Set<string> = new Set();
    #attributes: Set<T> = new Set();

    get numbers(): Set<string> {
        return new Set(this.#numbers);
    }
    get attributes(): Set<T> {
        return new Set(this.#attributes);
    }

    addNumbers(numbers: string[]): void {
        this.#numbers = new Set([...this.#numbers, ...numbers]);
    }

    addAttributes(attributes: T[]): void {
        this.#attributes = new Set([...this.#attributes, ...attributes]);
    }

    /** @internal */

    toJson(): { numbers: string[]; attributes: T[] } {
        return {
            numbers: Array.from(this.#numbers),
            attributes: Array.from(this.#attributes),
        };
    }
}

class AgentRtiFilter extends AbstractRtiFilter<RtiAgentAttributes> {}

class PilotRtiFilter extends AbstractRtiFilter<RtiPilotAttributes> {}

class QueueRtiFilter extends AbstractRtiFilter<RtiQueueAttributes> {}

class AgentProcessingGroupRtiFilter extends AbstractRtiFilter<RtiAgentProcessingGroupAttributes> {}

class OtherProcessingGroupRtiFilter extends AbstractRtiFilter<RtiOtherProcessingGroupAttributes> {}

/**
 * The `Filter` class specifies which CCD objects and their attributes
 * should be included in real-time eventing.
 *
 * For each category of CCD objects (agents, pilots, queues, agent processing groups,
 * other processing groups), this class maintains a filter that defines:
 *
 * - The specific objects to monitor (directory numbers)
 * - The attributes of each object to include in the real-time notifications
 *
 * Typical usage:
 * ```ts
 * const filter = new RtiFilter();
 *
 * // Monitor specific agents with selected attributes
 * filter.setAgentNumbers(["60119", "60120"]);
 * filter.setAgentAttributes(RtiAgentAttributes.PrivateCallsTotalDuration, RtiAgentAttributes.LogonDate);
 *
 * // Monitor queues with selected attributes
 * filter.setQueueNumbers(["1001", "1002"]);
 * filter.setQueueAttributes(RtiQueueAttributes.WaitingCalls, RtiQueueAttributes.AverageWaitTime);
 *
 * // Use the filter to create a real-time context
 * const context = new RtiContext(30, 5, filter);
 * const rtiService = session.getCallCenterRealtimeService();
 * rtiService.setContext(context);
 * rtiService.start();
 * ```
 *
 * @see CallCenterRealtimeService
 * @see RtiObjects
 * @since 2.7.4
 */
export class RtiFilter {
    #agentFilter: AgentRtiFilter | null = null;
    #pilotFilter: PilotRtiFilter | null = null;
    #queueFilter: QueueRtiFilter | null = null;
    #agentProcessingGroupFilter: AgentProcessingGroupRtiFilter | null = null;
    #otherProcessingGroupFilter: OtherProcessingGroupRtiFilter | null = null;

    /**
     * @internal
     */
    #getAgentFilter(): AgentRtiFilter {
        if (!this.#agentFilter) {
            this.#agentFilter = new AgentRtiFilter();
        }
        return this.#agentFilter;
    }

    /**
     * @internal
     */
    #getPilotFilter(): PilotRtiFilter {
        if (!this.#pilotFilter) {
            this.#pilotFilter = new PilotRtiFilter();
        }
        return this.#pilotFilter;
    }

    /**
     * @internal
     */
    #getQueueFilter(): QueueRtiFilter {
        if (!this.#queueFilter) {
            this.#queueFilter = new QueueRtiFilter();
        }
        return this.#queueFilter;
    }

    /**
     * @internal
     */
    #getAgentProcessingGroupFilter(): AgentProcessingGroupRtiFilter {
        if (!this.#agentProcessingGroupFilter) {
            this.#agentProcessingGroupFilter = new AgentProcessingGroupRtiFilter();
        }
        return this.#agentProcessingGroupFilter;
    }

    /**
     * @internal
     */
    #getOtherProcessingGroupFilter(): OtherProcessingGroupRtiFilter {
        if (!this.#otherProcessingGroupFilter) {
            this.#otherProcessingGroupFilter = new OtherProcessingGroupRtiFilter();
        }
        return this.#otherProcessingGroupFilter;
    }

    // --- Agent methods ---

    /**
     * Sets the attributes of agents to include in real-time eventing.
     * Only the specified attributes of the selected agents will be included
     * in the real-time notifications.
     *
     * @param attributes The agent attributes to monitor
     */
    setAgentAttributes(...attributes: RtiAgentAttributes[]): void {
        this.#getAgentFilter().addAttributes(attributes);
    }

    /**
     * Sets the directory numbers of agents to include in real-time eventing.
     * Only events related to these agents will be sent.
     *
     * @param numbers The agent directory numbers to monitor
     */
    setAgentNumbers(numbers: string[]): void {
        this.#getAgentFilter().addNumbers(numbers);
    }

    // --- Pilot methods ---

    /**
     * Sets the attributes of pilots to include in real-time eventing.
     * Only the specified attributes of the selected pilots will be included
     * in the real-time notifications.
     *
     * @param attributes The pilot attributes to monitor
     */
    setPilotAttributes(...attributes: RtiPilotAttributes[]): void {
        this.#getPilotFilter().addAttributes(attributes);
    }

    /**
     * Sets the directory numbers of pilots to include in real-time eventing.
     * Only events related to these pilots will be sent.
     *
     * @param numbers The pilot directory numbers to monitor
     */
    setPilotNumbers(numbers: string[]): void {
        this.#getPilotFilter().addNumbers(numbers);
    }

    // --- Queue methods ---

    /**
     * Sets the attributes of queues to include in real-time eventing.
     * Only the specified attributes of the selected queues will be included
     * in the real-time notifications.
     *
     * @param attributes The queue attributes to monitor
     */
    setQueueAttributes(...attributes: RtiQueueAttributes[]): void {
        this.#getQueueFilter().addAttributes(attributes);
    }

    /**
     * Sets the directory numbers of queues to include in real-time eventing.
     * Only events related to these queues will be sent.
     *
     * @param numbers The queue directory numbers to monitor
     */
    setQueueNumbers(numbers: string[]): void {
        this.#getQueueFilter().addNumbers(numbers);
    }

    // --- Agent Processing Group methods ---

    /**
     * Sets the attributes of agent processing groups to include in real-time eventing.
     * Only the specified attributes of the selected processing groups will be included
     * in the real-time notifications.
     *
     * @param attributes The agent processing group attributes to monitor
     */
    setAgentProcessingGroupAttributes(...attributes: RtiAgentProcessingGroupAttributes[]): void {
        this.#getAgentProcessingGroupFilter().addAttributes(attributes);
    }

    /**
     * Sets the directory numbers of agent processing groups to include in real-time eventing.
     * Only events related to these processing groups will be sent.
     *
     * @param numbers The agent processing group directory numbers to monitor
     */
    setAgentProcessingGroupNumbers(numbers: string[]): void {
        this.#getAgentProcessingGroupFilter().addNumbers(numbers);
    }

    // --- Other Processing Group methods ---

    /**
     * Sets the attributes of other processing groups to include in real-time eventing.
     * Only the specified attributes of the selected processing groups will be included
     * in the real-time notifications.
     *
     * @param attributes The other processing group attributes to monitor
     */
    setOtherProcessingGroupAttributes(...attributes: RtiOtherProcessingGroupAttributes[]): void {
        this.#getOtherProcessingGroupFilter().addAttributes(attributes);
    }

    /**
     * Sets the directory numbers of other processing groups to include in real-time eventing.
     * Only events related to these processing groups will be sent.
     *
     * @param numbers The other processing group directory numbers to monitor
     */
    setOtherProcessingGroupNumbers(numbers: string[]): void {
        this.#getOtherProcessingGroupFilter().addNumbers(numbers);
    }

    /**
     * @internal
     */
    toJson(): RtiFilterJson {
        const json: RtiFilterJson = {};

        if (this.#agentFilter) {
            json.agentFilter = this.#agentFilter.toJson();
        }

        if (this.#pilotFilter) {
            json.pilotFilter = this.#pilotFilter.toJson();
        }

        if (this.#queueFilter) {
            json.queueFilter = this.#queueFilter.toJson();
        }

        if (this.#agentProcessingGroupFilter) {
            json.pgAgentFilter = this.#agentProcessingGroupFilter.toJson();
        }

        if (this.#otherProcessingGroupFilter) {
            json.pgOtherFilter = this.#otherProcessingGroupFilter.toJson();
        }

        return json;
    }

    /**
     * @internal
     */
    static fromJson(json: RtiFilterJson): RtiFilter {
        const filter = new RtiFilter();

        // Generic helper for any filter type
        const applyFilter = <AttrType>(
            data: { numbers?: string[]; attributes?: AttrType[] } | undefined,
            setNumbers: (nums: string[]) => void,
            setAttributes: (...attrs: AttrType[]) => void
        ) => {
            if (!data) return;

            if (data.numbers) setNumbers(data.numbers);
            if (data.attributes) setAttributes(...data.attributes);
        };

        applyFilter<RtiAgentAttributes>(
            json.agentFilter,
            filter.setAgentNumbers.bind(filter),
            filter.setAgentAttributes.bind(filter)
        );
        applyFilter<RtiPilotAttributes>(
            json.pilotFilter,
            filter.setPilotNumbers.bind(filter),
            filter.setPilotAttributes.bind(filter)
        );
        applyFilter<RtiQueueAttributes>(
            json.queueFilter,
            filter.setQueueNumbers.bind(filter),
            filter.setQueueAttributes.bind(filter)
        );
        applyFilter<RtiAgentProcessingGroupAttributes>(
            json.pgAgentFilter,
            filter.setAgentProcessingGroupNumbers.bind(filter),
            filter.setAgentProcessingGroupAttributes.bind(filter)
        );
        applyFilter<RtiOtherProcessingGroupAttributes>(
            json.pgOtherFilter,
            filter.setOtherProcessingGroupNumbers.bind(filter),
            filter.setOtherProcessingGroupAttributes.bind(filter)
        );

        return filter;
    }
}
