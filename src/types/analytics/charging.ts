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

import { ChargingJson } from '../../internal/types/analytics/analytics-types';
import { CallType } from './call-type';
import { TelFacility } from './tel-facility';

function _makeDate(date: string): Date {
    let items = date.split(' ');
    return new Date(
        items[0].substring(0, 4) + '-' + items[0].substring(4, 6) + '-' + items[0].substring(6, 8) + 'T' + items[1]
    );
}

/**
 * Represents a single charging record from OmniPCX Enterprise.
 *
 * Each record contains details about the call, including caller, called party,
 * duration, cost, facilities, and call type. Certain fields are only populated
 * if the query was executed with the 'all' option.
 *
 */
export class Charging {
    #caller: string;
    #name?: string;
    #called?: string;
    #initialDialedNumber?: string;
    #callNumber?: number;
    #chargingUnits?: number;
    #cost?: number;
    #startDate?: Date;
    #duration?: number;
    #callType?: CallType;
    #effectiveCallDuration?: number;
    #actingExtensionNumberNode?: number;
    #internalFacilities?: TelFacility[];
    #externalFacilities?: TelFacility[];

    /**
     * Creates a Charging instance.
     * @param caller - The caller phone number.
     * @param name - The caller name.
     * @param called - The called phone number.
     * @param initialDialedNumber - The initially dialed number (available with 'all' option).
     * @param callNumber - Number of charged calls (available with 'all' option).
     * @param chargingUnits - Number of charged units (available with 'all' option).
     * @param cost - The call cost (available with 'all' option).
     * @param startDate - The call start date (available with 'all' option).
     * @param duration - The call duration in seconds.
     * @param callType - The type of the call (available with 'all' option).
     * @param effectiveCallDuration - The effective call duration in seconds.
     * @param actingExtensionNumberNode - Acting extension node number.
     * @param internalFacilities - Internal facilities used for the call.
     * @param externalFacilities - External facilities used for the call.
     */
    private constructor(
        caller: string,
        name?: string,
        called?: string,
        initialDialedNumber?: string,
        callNumber?: number,
        chargingUnits?: number,
        cost?: number,
        startDate?: Date,
        duration?: number,
        callType?: CallType,
        effectiveCallDuration?: number,
        actingExtensionNumberNode?: number,
        internalFacilities?: TelFacility[],
        externalFacilities?: TelFacility[]
    ) {
        this.#caller = caller;
        this.#name = name;
        this.#called = called;
        this.#initialDialedNumber = initialDialedNumber;
        this.#callNumber = callNumber;
        this.#chargingUnits = chargingUnits;
        this.#cost = cost;
        this.#startDate = startDate;
        this.#duration = duration;
        this.#callType = callType;
        this.#effectiveCallDuration = effectiveCallDuration;
        this.#actingExtensionNumberNode = actingExtensionNumberNode;
        this.#internalFacilities = internalFacilities;
        this.#externalFacilities = externalFacilities;
    }

    /** @returns The caller phone number. */
    get caller(): string {
        return this.#caller;
    }

    /** @returns The caller name, or `null` if not set. */
    get name(): string | null {
        return this.#name ?? null;
    }

    /** @returns The called phone number, or `null` if not set. */
    get called(): string | null {
        return this.#called ?? null;
    }

    /**
     * @returns The initially dialed number, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get initialDialedNumber(): string | null {
        return this.#initialDialedNumber ?? null;
    }

    /** @returns The number of charged calls (defaults to 0 if not set). */
    get callNumber(): number {
        return this.#callNumber ?? 0;
    }

    /** @returns The number of charged units (defaults to 0 if not set). */
    get chargingUnits(): number {
        return this.#chargingUnits ?? 0;
    }

    /** @returns The cost of the call (defaults to 0 if not set). */
    get cost(): number {
        return this.#cost ?? 0;
    }

    /**
     * @returns The call start date, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get startDate(): Date | null {
        return this.#startDate ?? null;
    }

    /** @returns The call duration in seconds (defaults to 0 if not set). */
    get duration(): number {
        return this.#duration ?? 0;
    }

    /**
     * @returns The call type, or `null` if not set.
     * Available only if the query was done with the 'all' option.
     */
    get callType(): CallType | null {
        return this.#callType ?? null;
    }

    /** @returns The effective call duration in seconds (defaults to 0 if not set). */
    get effectiveCallDuration(): number {
        return this.#effectiveCallDuration ?? 0;
    }

    /** @returns The acting extension node number (defaults to -1 if not set). */
    get actingExtensionNumberNode(): number {
        return this.#actingExtensionNumberNode ?? -1;
    }

    /** @returns The internal facilities, or `null` if not set. */
    get internalFacilities(): TelFacility[] | null {
        return this.#internalFacilities ?? null;
    }

    /** @returns The external facilities, or `null` if not set. */
    get externalFacilities(): TelFacility[] | null {
        return this.#externalFacilities ?? null;
    }

    /**
     * Creates a `Charging` instance from a JSON object.
     * @param json - The JSON object representing a charging record.
     * @returns A new `Charging` instance populated from the JSON.
     */
    /** @internal */

    static fromJson(json: ChargingJson): Charging {
        const _startDate = json.startDate ? _makeDate(json.startDate) : undefined;
        const _callType = json.callType
            ? CallType.isCallType(json.callType)
                ? (json.callType as CallType)
                : CallType.Unspecified
            : undefined;

        let _internalFacility: TelFacility[] | undefined = undefined;
        if (json.internalFacilities) {
            _internalFacility = json.internalFacilities.facilities
                .map((f: string) => TelFacility[f as keyof typeof TelFacility])
                .filter((fac) => fac !== undefined);
        }

        let _externalFacilities: TelFacility[] | undefined = undefined;
        if (json.externalFacilities) {
            _externalFacilities = json.externalFacilities.facilities
                .map((f: string) => TelFacility[f as keyof typeof TelFacility])
                .filter((fac) => fac !== undefined);
        }

        return new Charging(
            json.caller,
            json.name,
            json.called,
            json.initialDialledNumber,
            json.callNumber,
            json.chargingUnits,
            json.cost,
            _startDate,
            json.duration,
            _callType,
            json.effectiveCallDuration,
            json.actingExtensionNumberNode,
            _internalFacility,
            _externalFacilities
        );
    }
}
