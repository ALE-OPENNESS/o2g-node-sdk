/*
 * Copyright 2025 ALE International
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

import { PilotTransitionJson } from '../../../internal/types/cc-mngt/cc-mntg-types';
import { PilotOperatingMode } from './pilot-operating-Mode';

/**
 * Represents a state transition of a pilot.
 * Each transition indicates a change in the pilot's operating mode,
 * triggered by a specific rule, at a specific time.
 */
export class Transition {
    #time: Transition.Time;
    #ruleNumber: number;
    #mode: PilotOperatingMode;

    /**
     * Creates a new Transition instance.
     * @param {Transition.Time} time - The time of the transition
     * @param {number} ruleNumber - The rule number that triggered this transition
     * @param {PilotOperatingMode} mode - The operating mode of the pilot after the transition
     */
    constructor(time: Transition.Time, ruleNumber: number, mode: PilotOperatingMode) {
        this.#time = time;
        this.#ruleNumber = ruleNumber;
        this.#mode = mode;
    }

    /**
     * The time at which the transition occurred.
     * @returns {Transition.Time} Transition time
     */
    get time(): Transition.Time {
        return this.#time;
    }

    /**
     * The rule number that triggered this transition.
     * @returns {number} Rule number
     */
    get ruleNumber(): number {
        return this.#ruleNumber;
    }

    /**
     * The pilot's operating mode after this transition.
     * @returns {PilotOperatingMode} Operating mode
     */
    get mode(): PilotOperatingMode {
        return this.#mode;
    }

    /**
     * Constructs a Transition from a JSON object.
     * Typically used internally when parsing API responses.
     * @param {PilotTransitionJson} json - JSON representation of the transition
     * @returns {Transition} A new Transition instance
     * @internal
     */
    /** @internal */

    static fromJson(json: PilotTransitionJson): Transition {
        return new Transition(Transition.Time.parse(json.time), json.ruleNumber, json.mode);
    }

    /**
     * Serializes this transition to JSON.
     * @returns {PilotTransitionJson} JSON representation of the transition
     */
    /** @internal */

    toJson(): PilotTransitionJson {
        return {
            time: this.#time.toString(),
            ruleNumber: this.#ruleNumber,
            mode: this.#mode,
        };
    }
}

export namespace Transition {
    /**
     * Represents the time of a transition in a pilot calendar.
     * Time is expressed in 24-hour format (HH:mm).
     */
    export class Time {
        constructor(
            private _hour: number,
            private _minute: number
        ) {}

        /**
         * The hour of the transition (0-23).
         * @returns {number} Hour component
         */
        get hour(): number {
            return this._hour;
        }

        /**
         * The minute of the transition (0-59).
         * @returns {number} Minute component
         */
        get minute(): number {
            return this._minute;
        }

        /**
         * Returns the time formatted as a string in HH:mm format.
         * @returns {string} Time as HH:mm
         */
        toString(): string {
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${pad(this._hour)}:${pad(this._minute)}`;
        }

        /**
         * Parses a time string in HH:mm format and returns a Time instance.
         * @param {string} value - Time string to parse
         * @returns {Time} Parsed Time instance
         * @throws {Error} If the time string is invalid or out of range
         */
        static parse(value: string): Time {
            if (!value) throw new Error(`Invalid time format: null`);

            const [hourStr, minuteStr] = value.split(':');
            const hour = parseInt(hourStr, 10);
            const minute = parseInt(minuteStr, 10);

            if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                throw new Error(`Invalid time format: ${value}`);
            }

            return new Time(hour, minute);
        }
    }
}
