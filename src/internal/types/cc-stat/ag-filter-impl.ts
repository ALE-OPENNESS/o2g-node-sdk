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

import { StatsAgentByPilotAttributes } from '../../../types/cc-stats/agbypilot-attributes';
import { StatsAgentAttributes } from '../../../types/cc-stats/agent-attributes';
import { AgentFilter } from '../../../types/cc-stats/agent-filter';
import { AbstractFilter } from './abstract-filter';
import { StatsAgentFilterJson } from './cc-stat-types';

/**
 */
/** @internal */
export class AgentFilterImpl extends AbstractFilter implements AgentFilter {
    #agentAttributes: Set<StatsAgentAttributes> = new Set<StatsAgentAttributes>();
    #byPilotAttributes: Set<StatsAgentByPilotAttributes> = new Set<StatsAgentByPilotAttributes>();

    get agentAttributes(): Set<StatsAgentAttributes> {
        return this.#agentAttributes;
    }

    get byPilotAttributes(): Set<StatsAgentByPilotAttributes> {
        return this.#byPilotAttributes;
    }

    setAgentAttributes(...attributes: StatsAgentAttributes[]): void {
        attributes.forEach((attr) => this.#agentAttributes.add(attr));
    }

    setAgentByPilotAttributes(...attributes: StatsAgentByPilotAttributes[]): void {
        attributes.forEach((attr) => this.#byPilotAttributes.add(attr));
    }

    toJson(): StatsAgentFilterJson {
        return {
            numbers: this.numbers, // Convert Set<string> to string[]
            agentAttributes: Array.from(this.#agentAttributes), // Convert Set<AgentAttributes> to AgentAttributes[]
            pilotAttributes: Array.from(this.#byPilotAttributes), // Convert Set<AgentByPilotAttributes> to AgentByPilotAttributes[]
        };
    }

    /**
     * @internal
     */
    static fromJson(json: StatsAgentFilterJson): AgentFilterImpl {
        const filter = new AgentFilterImpl();

        // Restore numbers (assuming AbstractFilter has addNumber method)
        if (json.numbers && json.numbers.length > 0) {
            filter.addNumbers(...json.numbers);
        }

        // Restore agent attributes
        if (json.agentAttributes && json.agentAttributes.length > 0) {
            filter.setAgentAttributes(...json.agentAttributes);
        }

        // Restore pilot attributes
        if (json.pilotAttributes && json.pilotAttributes.length > 0) {
            filter.setAgentByPilotAttributes(...json.pilotAttributes);
        }

        return filter;
    }
}
