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

import { AgentFilterImpl } from '../../internal/types/cc-stats/ag-filter-impl';
import { StatsFilterJson } from '../../internal/types/cc-stats/cc-stat-types';
import { PilotAbandonedCallsFilterImpl } from '../../internal/types/cc-stats/pil-aband-calls-filter-impl';
import { PilotFilterImpl } from '../../internal/types/cc-stats/pil-filter-impl';
import { AgentFilter } from './agent-filter';
import { PilotAbandonedCallsFilter } from './pilot-abandonned-calls-filter';
import { PilotFilter } from './pilot-filter';

/**
 * Base interface for filters used in the Call Center StatisticsData SDK.
 *
 * A filter defines criteria for selecting objects (such as agents or pilots) to
 * include in statistical reports.
 *
 * This interface also serves as a factory for creating concrete filter
 * instances. Users can obtain pre-built filters without directly instantiating
 * the underlying classes:
 *
 * ```ts
 * const agentFilter = StatFilter.createAgentFilter();
 * const pilotFilter = StatFilter.createPilotFilter();
 * ```
 *
 * @since 2.7.4
 */
export abstract class StatsFilter {
    /**
     * Creates a new filter for selecting agents.
     *
     * @returns a new `AgentFilter` instance
     */
    static createAgentFilter(): AgentFilter {
        return new AgentFilterImpl();
    }

    /**
     * Creates a new filter for selecting pilots.
     *
     * @returns a new `PilotFilter` instance
     */
    static createPilotFilter(): PilotFilter {
        return new PilotFilterImpl();
    }

    /**
     * Creates a new filter for selecting calls abandoned on pilots.
     *
     * @returns a new `PilotAbandonedCallsFilter` instance
     */
    static createPilotAbandonedCallsFilter(): PilotAbandonedCallsFilter {
        return new PilotAbandonedCallsFilterImpl();
    }

    /**
     * @internal
     */
    static fromJson(json: StatsFilterJson): StatsFilter | null {
        if (json.agentFilter) {
            return AgentFilterImpl.fromJson(json.agentFilter);
        } 
        else if (json.pilotFilter) {
            return PilotFilterImpl.fromJson(json.pilotFilter);
        }
        else if (json.pilotAbandonedCallFilter) {
            return PilotAbandonedCallsFilterImpl.fromJson(json.pilotAbandonedCallFilter);
        }
        else {
            return null;
        }
    }
}
