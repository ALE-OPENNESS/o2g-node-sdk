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

/**
 * Represents a CCD operator skill.
 * Skills are used by the "Advanced Call Routing" strategy.
 */
export class AgentSkill {
    /** Unique identifier of this skill */
    #number: number;

    /** Skill level */
    #level: number;

    /** Whether the skill is active */
    #active: boolean;

    private constructor(number: number, level: number, active: boolean) {
        this.#number = number;
        this.#level = level;
        this.#active = active;
    }

    /** @internal */

    static fromJson(json: { number: number; level: number; active: boolean }): AgentSkill {
        return new AgentSkill(json.number, json.level, json.active);
    }

    /** Getter for the skill number */
    get number(): number {
        return this.#number;
    }

    /** Getter for the skill level */
    get level(): number {
        return this.#level;
    }

    /** Getter for whether the skill is active */
    get active(): boolean {
        return this.#active;
    }
}
