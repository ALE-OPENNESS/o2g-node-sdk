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

import { AbstractFilter } from '../../internal/types/cc-stats/abstract-filter';
import { StatsAgentByPilotAttributes } from './agbypilot-attributes';
import { StatsAgentAttributes } from './agent-attributes';

/**
 * Filter for selecting agents in Call Center StatisticsData reports.
 *
 * An `AgentFilter` allows specifying which statistics to collect for
 * agents and, optionally, statistics broken down by pilots.
 *
 * Instances should be obtained via the `Filter.createAgentFilter()` factory method.
 * SDK users do not need to implement this interface directly.
 *
 * @since 2.7.4
 */
export interface AgentFilter extends AbstractFilter {
    /**
     * Returns the set of directory numbers associated with this filter.
     *
     * These numbers identify the agents whose statistics should be collected.
     *
     * @returns a set of agent directory numbers; never null, but may be empty
     */
    get numbers(): string[];

    /**
     * Adds one or more agent directory numbers to this filter.
     *
     * Once added, the corresponding agents will be included in the scope of
     * statistical reports.
     *
     * @param numbers an array of directory numbers to add; must not be null, though it may be empty
     */
    addNumbers(...numbers: string[]): void;

    /**
     * Returns the set of statistics attributes to collect for agents.
     *
     * @returns a set of `AgentAttributes`
     */
    get agentAttributes(): Set<StatsAgentAttributes>;

    /**
     * Returns the set of statistics attributes to collect for agents by pilot.
     *
     * @returns a set of `AgentByPilotAttributes`
     */
    get byPilotAttributes(): Set<StatsAgentByPilotAttributes>;

    /**
     * Sets the statistics attributes for agents in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the agent attributes to include
     */
    setAgentAttributes(...attributes: StatsAgentAttributes[]): void;

    /**
     * Sets the statistics attributes for agents broken down by pilot in this filter.
     * Any existing attributes may be replaced or supplemented depending on the implementation.
     *
     * @param attributes the agent-by-pilot attributes to include
     */
    setAgentByPilotAttributes(...attributes: StatsAgentByPilotAttributes[]): void;
}
