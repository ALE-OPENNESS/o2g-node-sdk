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

import { StatsContext } from '../../../types/cc-stats/stats-context';
import { StatsFilter } from '../../../types/cc-stats/stats-filter';
import { AgentFilterImpl } from './ag-filter-impl';
import { StatsContextJson } from './cc-stat-types';
import { PilotFilterImpl } from './pil-filter-impl';

/**
 * Implementation of `Context` representing the configuration needed to retrieve
 * a statistics report from the Call Center Statistics Service.
 */
/** @internal */
export class ContextImpl implements StatsContext {
    /** Internal type to hold either an agent or pilot filter */
    private _filter: StatsFilter | null = null;

    #ctxId: string;
    #supervisorId: string;
    #label?: string;
    #description?: string;
    #isScheduled: boolean = false;

    /**
     * @internal
     */
    constructor(ctxId: string, supervisorId: string) {
        this.#ctxId = ctxId;
        this.#supervisorId = supervisorId;
    }

    /**
     * Returns the filter associated with this context.
     * @returns the agent or pilot filter
     */
    get filter(): StatsFilter | null {
        return this._filter;
    }

    /**
     * Sets the filter associated with this context.
     * @param filter an AgentFilterImpl or PilotFilterImpl
     */
    set filter(filter: StatsFilter) {
        if (filter instanceof AgentFilterImpl || filter instanceof PilotFilterImpl) {
            this._filter = filter;
        } else {
            throw new Error('Invalid filter type; must be AgentFilterImpl or PilotFilterImpl');
        }
    }

    /**
     * Sets the description of this context.
     * @param description the description to set
     */
    set description(description: string) {
        this.#description = description;
    }

    /**
     * Sets the label of this context.
     * @param label the label to set
     */
    set label(label: string) {
        this.#label = label;
    }

    /**
     * Returns the unique identifier of this context.
     * @returns the context ID
     */
    get id(): string {
        return this.#ctxId;
    }

    /**
     * Returns the human-readable label of this context.
     * @returns the label
     */
    get label(): string | undefined {
        return this.#label;
    }

    /**
     * Returns the description of this context.
     * @returns the description
     */
    get description(): string | undefined {
        return this.#description;
    }

    /**
     * Indicates whether this context is associated with a scheduled report.
     * @returns true if scheduled, false otherwise
     */
    get scheduled(): boolean {
        return this.#isScheduled;
    }

    /**
     * Returns the identifier of the requester who owns this context.
     * @returns the supervisor/requester ID
     */
    get requesterId(): string {
        return this.#supervisorId;
    }

    /**
     * @internal
     */
    static fromJson(json: StatsContextJson): ContextImpl {
        const ctx = new ContextImpl(json.ctxId, json.supervisorId);

        // Set optional properties if they exist
        if (json.label) {
            ctx.label = json.label;
        }

        if (json.description) {
            ctx.description = json.description;
        }

        ctx.#isScheduled = json.isScheduled;

        // Convert the filter JSON into a StatsFilter instance
        if (json.filter) {
            // Assume you have a helper to parse StatsFilterJson to StatsFilter
            ctx._filter = StatsFilter.fromJson(json.filter);
        }

        return ctx;
    }
}
