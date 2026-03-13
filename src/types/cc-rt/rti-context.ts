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

import { RtiContextJson } from '../../internal/types/cc-rt/cc-rt-types';
import { RtiFilter } from './rti-filter';

/**
 * The `RtiContext` class represents a subscription to CCD real-time events
 * provided by the `RtiService`.
 *
 * A context defines the set of CCD objects to monitor, the attributes of
 * interest, the observation period, and the notification frequency for events.
 * It is associated with a {@link RtiFilter} that specifies which agents, pilots,
 * queues, and processing groups are included in the real-time notifications.
 */
export class RtiContext {
    #active?: boolean;
    #obsPeriod?: number;
    #notifFrequency?: number;
    #filter?: RtiFilter;

    /**
     * Constructs a new `RtiContext` with the specified observation period,
     * notification frequency, and filter.
     *
     * @param obsPeriod - The observation period in minutes. Must be between 15 and 60 minutes.
     * @param notifFrequency - The frequency of real-time notifications in seconds. Minimum value is 5 seconds.
     * @param filter - The {@link RtiFilter} defining which CCD objects and attributes are included in this context.
     */
    constructor(obsPeriod?: number, notifFrequency?: number, filter?: RtiFilter) {
        this.#active = false;
        this.#obsPeriod = obsPeriod;
        this.#notifFrequency = notifFrequency;
        this.#filter = filter;
    }

    // --- Getters ---

    /**
     * Returns whether this RTI context is currently active.
     *
     * @returns `true` if the context is active; `false` otherwise.
     */
    get active(): boolean {
        return this.#active ?? false;
    }

    /**
     * Returns the observation period for this context.
     *
     * This defines the duration (in minutes) during which the context is active
     * and collects real-time events.
     *
     * @returns The observation period in minutes.
     */
    get observationPeriod(): number {
        return this.#obsPeriod ?? 0;
    }

    /**
     * Returns the notification frequency for this context.
     *
     * This defines how often (in seconds) real-time notifications are sent
     * for changes in the monitored CCD objects.
     *
     * @returns The notification frequency in seconds.
     */
    get notificationFrequency(): number {
        return this.#notifFrequency ?? 0;
    }

    /**
     * Returns the {@link RtiFilter} associated with this context.
     *
     * The filter specifies which CCD objects and their attributes will be included
     * in real-time event notifications.
     *
     * @returns The filter.
     */
    get filter(): RtiFilter | null {
        return this.#filter ?? null;
    }

    /**
     * Converts this context into a JSON representation.
     *
     * @returns An object representing this context suitable for serialization.
     */
    /** @internal */

    toJson(): RtiContextJson {
        return {
            active: this.#active,
            obsPeriod: this.#obsPeriod,
            notifFrequency: this.#notifFrequency,
            filter: this.#filter ? this.#filter.toJson() : undefined,
        };
    }

    /**
     * @internal
     */
    private static createWithActive(
        active?: boolean,
        obsPeriod?: number,
        notifFrequency?: number,
        filter?: RtiFilter
    ): RtiContext {
        const context = new RtiContext(obsPeriod, notifFrequency, filter);
        context.#active = active;
        return context;
    }

    /**
     * @internal
     */
    static fromJson(json: RtiContextJson): RtiContext {
        const filter = json.filter ? RtiFilter.fromJson(json.filter) : undefined;
        return RtiContext.createWithActive(json.active, json.obsPeriod, json.notifFrequency, filter);
    }
}
