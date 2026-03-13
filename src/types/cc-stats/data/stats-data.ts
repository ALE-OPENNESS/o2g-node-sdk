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

import { SelectedPeriodJson, StatsJson } from '../../../internal/types/cc-stat/cc-stat-types';
import { AgentStatisticsRow } from './ag-stats-row';
import { PilotStatisticsRow } from './pil-stats-row';
import { SelectedPeriod } from './selected-period';

/**
 * Represents the statistical results for a specific observation period and time slot.
 * <p>
 * Each `ObjectStatistics<T>` instance groups the data rows collected for a given
 * {@link SelectedPeriod} and an optional time slot (e.g. a 15-minute or hourly interval).
 * <p>
 * The class is generic and can represent either agent-level or pilot-level statistics:
 * <ul>
 * <li>`ObjectStatistics<AgentStatisticsRow>` — for agent statistics</li>
 * <li>`ObjectStatistics<PilotStatisticsRow>` — for pilot statistics</li>
 * </ul>
 *
 * @template T the type of the statistics row, either `AgentStatisticsRow` or `PilotStatisticsRow`
 * @see StatisticsData
 * @see CallCenterStatistics.getDayData
 * @see CallCenterStatistics.getDaysData
 */
export class ObjectStatistics<T> {
    #timeSlot?: string;
    #selectedPeriod?: SelectedPeriod;
    #rows?: T[];

    /**
     * @internal
     */
    private constructor(timeSlot: string, selectedPeriod: SelectedPeriod, rows?: T[]) {
        this.#timeSlot = timeSlot;
        this.#selectedPeriod = selectedPeriod;
        this.#rows = rows;
    }

    /**
     * The start date and time of this time slot.
     * <p>
     * The time slot represents the period during which the statistics were aggregated
     * (e.g. `2025-09-02T10:00` for a 15-minute interval starting at 10:00).
     */
    get timeSlot(): Date | null {
        if (!this.#timeSlot) return null;
        return new Date(this.#timeSlot);
    }

    /**
     * The selected period during which these statistics were collected.
     */
    get selectedPeriod(): SelectedPeriod | null {
        return this.#selectedPeriod ?? null;
    }

    /**
     * The list of statistics rows collected for this time slot and period.
     */
    get rows(): T[] | null {
        return this.#rows ?? null;
    }

    /**
     * @internal
     */
    static fromJson<T>(
        json: { timeSlot: string; selectedPeriod: SelectedPeriodJson; rows?: any[] },
        rowFactory: (json: any) => T
    ): ObjectStatistics<T> {
        const selectedPeriod = SelectedPeriod.fromJson(json.selectedPeriod);
        const rows = json.rows?.map(rowFactory);
        return new ObjectStatistics(json.timeSlot, selectedPeriod, rows);
    }
}

/**
 * Represents the statistical data returned for a requester, including agent-level
 * and pilot-level statistics grouped by time slot and observation period.
 * <p>
 * A `StatisticsData` instance is returned by {@link CallCenterStatistics.getDayData}
 * and {@link CallCenterStatistics.getDaysData}.
 *
 * @see CallCenterStatistics.getDayData
 * @see CallCenterStatistics.getDaysData
 */
export class StatisticsData {
    #supervisor: string;
    #agentsStats?: ObjectStatistics<AgentStatisticsRow>[];
    #pilotsStats?: ObjectStatistics<PilotStatisticsRow>[];

    /**
     * @internal
     */
    private constructor(
        supervisor: string,
        agentsStats?: ObjectStatistics<AgentStatisticsRow>[],
        pilotsStats?: ObjectStatistics<PilotStatisticsRow>[]
    ) {
        this.#supervisor = supervisor;
        this.#agentsStats = agentsStats;
        this.#pilotsStats = pilotsStats;
    }

    /**
     * The identifier of the requester (supervisor) for whom the statistics were retrieved.
     */
    get requesterId(): string {
        return this.#supervisor;
    }

    /**
     * The agent-level statistics, grouped by time slot and observation period.
     */
    get agentsStats(): ObjectStatistics<AgentStatisticsRow>[] | undefined {
        return this.#agentsStats;
    }

    /**
     * The pilot-level statistics, grouped by time slot and observation period.
     */
    get pilotsStats(): ObjectStatistics<PilotStatisticsRow>[] | undefined {
        return this.#pilotsStats;
    }

    /**
     * @internal
     */
    static fromJson(json: StatsJson): StatisticsData {
        const agentsStats = json.agentsStats?.map((statJson: any) =>
            ObjectStatistics.fromJson<AgentStatisticsRow>(statJson, AgentStatisticsRow.fromJson)
        );

        const pilotsStats = json.pilotsStats?.map((statJson: any) =>
            ObjectStatistics.fromJson<PilotStatisticsRow>(statJson, PilotStatisticsRow.fromJson)
        );

        return new StatisticsData(json.supervisor, agentsStats, pilotsStats);
    }
}
