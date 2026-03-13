/*
 * Copyright 2021 ALE International
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

import { IncidentJson } from '../../internal/types/analytics/analytics-types';

/**
 * Represents an incident on an OmniPCX Enterprise node.
 *
 * Each incident contains details such as severity, description, node, rack, board,
 * and the date it was raised. Incidents may occur on the main call server or on
 * a specific node, and may reference specific equipment or termination points.
 */
export class Incident {
    #id: number;
    #severity: number;
    #description!: string;
    #nbOccurs: number;
    #node: number;
    #main: boolean;
    #rack?: string;
    #board?: string;
    #equipment?: string;
    #termination?: string;
    #date: Date;

    /**
     * @ignore
     */
    private constructor(
        id: number,
        severity: number,
        description: string,
        nbOccurs: number,
        node: number,
        date: Date,
        main: boolean,
        rack?: string,
        board?: string,
        equipment?: string,
        termination?: string
    ) {
        this.#id = id;
        this.#severity = severity;
        this.#description = description;
        this.#nbOccurs = nbOccurs;
        this.#node = node;
        this.#main = main;
        this.#rack = rack;
        this.#board = board;
        this.#equipment = equipment;
        this.#termination = termination;
        this.#date = date;
    }

    /** @returns The unique identifier of this incident. */
    get id(): number {
        return this.#id;
    }

    /** @returns The date and time when this incident was raised. */
    get date(): Date {
        return this.#date;
    }

    /** @returns The severity level of this incident. */
    get severity(): number {
        return this.#severity;
    }

    /** @returns The textual description of the incident. */
    get description(): string {
        return this.#description;
    }

    /** @returns The number of occurrences of this incident. */
    get nbOccurs(): number {
        return this.#nbOccurs;
    }

    /** @returns The OmniPCX Enterprise node on which this incident occurred. */
    get node(): number {
        return this.#node;
    }

    /** @returns Whether this incident occurred on the main call server. */
    get main(): boolean {
        return this.#main;
    }

    /** @returns The rack associated with this incident, or `null` if not set. */
    get rack(): string | null {
        return this.#rack ?? null;
    }

    /** @returns The board associated with this incident, or `null` if not set. */
    get board(): string | null {
        return this.#board ?? null;
    }

    /** @returns The equipment associated with this incident, or `null` if not set. */
    get equipment(): string | null {
        return this.#equipment ?? null;
    }

    /** @returns The termination associated with this incident, or `null` if not set. */
    get termination(): string | null {
        return this.#termination ?? null;
    }

    /**
     * Creates an Incident instance from a JSON object.
     * @param json - The JSON object containing incident details.
     * @returns A new `Incident` instance populated from the JSON.
     */
    /** @internal */

    static fromJson(json: IncidentJson): Incident {
        return new Incident(
            parseInt(json.value),
            json.severity,
            json.type,
            json.nbOccurs,
            parseInt(json.node),
            Incident._makeDate(json.date, json.hour),
            json.main,
            json.rack,
            json.board,
            json.equipment,
            json.termination
        );
    }

    /** @ignore Converts a DD/MM/YY string to ISO YYYY-MM-DD format. */
    private static _makeIsoDate(date: string): string {
        const [day, month, yearSuffix] = date.trim().split('/');
        const year = (2000 + parseInt(yearSuffix)).toString();
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    /** @ignore Converts date and hour strings from JSON to a Date object. */
    private static _makeDate(date: string, hour: string): Date {
        return new Date(`${this._makeIsoDate(date)}T${hour.trim()}`);
    }
}
