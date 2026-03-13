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

import { AcdStatsProgressStep, OnAcdStatsProgressJson } from './cc-stat-types';

/** @internal */
export class OnAcdStatsProgress {
    #step: AcdStatsProgressStep;
    #nbTotObjects: number;
    #nbProcessedObjects: number;
    #resPath?: string;
    #fullResPath?: string;
    #xlsFullResPath?: string;

    // --- Private constructor ---
    private constructor(json: OnAcdStatsProgressJson) {
        this.#step = json.step;
        this.#nbTotObjects = json.nbTotObjects ?? 0; // default 0 if undefined
        this.#nbProcessedObjects = json.nbProcessedObjects ?? 0;
        this.#resPath = json.resPath;
        this.#fullResPath = json.fullResPath;
        this.#xlsFullResPath = json.xlsfullResPath;
    }

    // --- Static factory method ---
    static fromJson(json: OnAcdStatsProgressJson): OnAcdStatsProgress {
        return new OnAcdStatsProgress(json);
    }

    get step(): AcdStatsProgressStep {
        return this.#step;
    }

    get nbTotObjects(): number {
        return this.#nbTotObjects;
    }

    get nbProcessedObjects(): number {
        return this.#nbProcessedObjects;
    }

    get resPath(): string | undefined {
        return this.#resPath;
    }

    get fullResPath(): string | undefined {
        return this.#fullResPath;
    }

    get xlsFullResPath(): string | undefined {
        return this.#xlsFullResPath;
    }
}
