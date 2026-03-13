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

import { ChargingFileJson } from '../../internal/types/analytics/analytics-types';

function _makeIsoDate(date: string): string {
    const [dd, mm, yy] = date.trim().split('/');

    // Check that day and month are exactly 2 digits
    if (!/^\d{2}$/.test(dd) || !/^\d{2}$/.test(mm) || !/^\d{2}$/.test(yy)) {
        throw new Error(`Invalid date format: ${date}. Expected dd/mm/yy`);
    }

    const year = (2000 + parseInt(yy)).toString();
    return `${year}-${mm}-${dd}`;
}

function _makeDate(date: string, hour: string) {
    return new Date(_makeIsoDate(date) + 'T' + hour.trim());
}

/**
 * ChargingFile class represent a charging file on OmniPCX Enterprise.
 * @see {@link Analytics.getChargingFiles}
 */
export class ChargingFile {
    #name: string;
    #date: Date;

    private constructor(name: string, date: Date) {
        this.#name = name;
        this.#date = date;
    }

    /** The name of the charging file */
    get name(): string {
        return this.#name;
    }

    /** The date of the charging file */
    get date(): Date {
        return this.#date;
    }

    /** Creates a ChargingFile instance from JSON */
    /** @internal */

    static fromJson(json: ChargingFileJson): ChargingFile {
        return new ChargingFile(json.name, _makeDate(json.date, json.time));
    }
}
