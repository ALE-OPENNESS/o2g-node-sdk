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

import { StatsFilter } from './stats-filter';

/**
 * `StatContext` represents the configuration needed to retrieve a statistics report
 * from the Call Center Statistics Service.
 *
 * A context defines the parameters and metadata for generating a report, including:
 * - The objects to include in the report (e.g., CCD agents, CCD pilots).
 * - The counters or metrics for each category of object.
 * - Metadata such as label, description, requester, and scheduling information.
 *
 * Contexts are used to specify what data should be included in a report, how it should
 * be filtered, and how the report should be generated or scheduled.
 *
 * @since 2.7.4
 */
export interface StatsContext {
    /**
     * Returns the unique identifier of this context.
     * @returns The context identifier.
     */
    get id(): string;

    /**
     * Returns the identifier of the requester who owns this context.
     * @returns The requester identifier.
     */
    get requesterId(): string;

    /**
     * Returns the human-readable label of this context.
     * @returns The context label.
     */
    get label(): string | undefined;

    /**
     * Returns the description of this context.
     * @returns The context description.
     */
    get description(): string | undefined;

    /**
     * Indicates whether the data are returned with short header (compact number of header attributes).
     * @returns `true` if the short header is considered; otherwise `false`.
     */
    get shortHeader() : boolean;

    /**
     * Indicates whether this context is associated with a scheduled report.
     * @returns `true` if the context is scheduled; otherwise `false`.
     * @since 2.7.5
     */
    get scheduled(): boolean;

    /**
     * Returns the filter associated with this context.
     *
     * The filter specifies which objects (agents or pilots) and counters should
     * be included in the report.
     * @returns The associated filter.
     */
    get filter(): StatsFilter | null;

    /**
     * Sets the filter associated with this context.
     * @param filter - The filter to set.
     */
    set filter(filter: StatsFilter);

    /**
     * Sets the description of this context.
     * @param description - The description to set.
     */
    set description(description: string);

    /**
     * Sets the label of this context.
     * @param label - The label to set.
     */
    set label(label: string);
}
