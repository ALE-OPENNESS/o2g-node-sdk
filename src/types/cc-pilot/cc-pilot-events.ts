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

import {
    OnPilotCallCreatedJson,
    OnPilotCallQueuedJson,
    OnPilotCallRemovedJson,
} from '../../internal/types/cc-pilot/cc-pilot-types';
import { CallCause } from '../telephony/call/call-cause';
import { CallDataPilot } from './call-data-pilot';

/**
 * Event fired when a new call is received by a specific pilot.
 * 
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_CREATED, (e: OnPilotCallCreated) => {
 *      console.log(e.pilot, e.caller, e.callRef);
    });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_CREATED
 */
export class OnPilotCallCreated {
    #pilot: string;
    #caller: string;
    #callRef: string;
    #cause: CallCause;
    #callData?: CallDataPilot;

    /**
     * @internal
     * Use {@link OnPilotCallCreated.fromJson} to create an instance.
     */
    private constructor(pilot: string, caller: string, callRef: string, cause: CallCause, callData?: CallDataPilot) {
        this.#pilot = pilot;
        this.#caller = caller;
        this.#callRef = callRef;
        this.#cause = cause;
        this.#callData = callData;
    }

    /**
     * Gets the pilot number receiving the call.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string {
        return this.#pilot;
    }

    /**
     * Gets the caller's phone number.
     * @returns The caller's phone number as a string.
     */
    get caller(): string {
        return this.#caller;
    }

    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * Gets the cause or reason for the call event.
     * @returns The {@link CallCause} of this call event.
     */
    get cause(): CallCause {
        return this.#cause;
    }

    /**
     * Gets optional additional data associated with the call for this pilot.
     * @returns The {@link CallDataPilot} if available, otherwise `null`.
     */
    get callData(): CallDataPilot | null {
        return this.#callData ?? null;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: OnPilotCallCreatedJson): OnPilotCallCreated {
        return new OnPilotCallCreated(
            json.pilot,
            json.caller,
            json.callRef,
            json.cause,
            json.callData ? CallDataPilot.fromJson(json.callData) : undefined
        );
    }
}

/**
 * Event fired when a call is queued for a specific pilot.
 *
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot;
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_QUEUED, (e: OnPilotCallQueued) => {
 *      console.log(e.pilot, e.caller, e.queue, e.callRef, e.queuedCallsCount);
 * });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_QUEUED
 */
export class OnPilotCallQueued {
    #pilot: string;
    #caller: string;
    #queue?: string;
    #callRef: string;
    #cause: CallCause;
    #queuedCallsCount?: number;

    /**
     * @internal
     * Use {@link OnPilotCallQueued.fromJson} to create an instance.
     */
    private constructor(
        pilot: string,
        caller: string,
        queue: string,
        callRef: string,
        cause: CallCause,
        queuedCallsCount: number
    ) {
        this.#pilot = pilot;
        this.#caller = caller;
        this.#queue = queue;
        this.#callRef = callRef;
        this.#cause = cause;
        this.#queuedCallsCount = queuedCallsCount;
    }

    /**
     * Gets the pilot number for which the call is queued.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string {
        return this.#pilot;
    }

    /**
     * Gets the caller's phone number.
     * @returns The caller's phone number as a string.
     */
    get caller(): string {
        return this.#caller;
    }

    /**
     * Gets the queue identifier or number.
     * @returns The queue number (if distribution) or identifier (if overflow) as a string.
     */
    get queue(): string | null {
        return this.#queue ?? null;
    }

    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * Gets the cause or reason for this queued call event.
     * @returns The {@link CallCause} of this event.
     */
    get cause(): CallCause {
        return this.#cause;
    }

    /**
     * Gets the number of calls currently queued in the pilot's queue.
     * Returns -1 if the value is unavailable.
     * @returns Number of queued calls as a number.
     */
    get queuedCallsCount(): number {
        return this.#queuedCallsCount ?? -1;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: OnPilotCallQueuedJson): OnPilotCallQueued {
        return new OnPilotCallQueued(
            json.pilot,
            json.caller,
            json.queue,
            json.callRef,
            json.cause,
            json.numberOfQueued
        );
    }
}

/**
 * Event fired when a call has been removed from a specific pilot.
 *
 * This can happen due to distribution, cancellation, or overflow.
 *
 * Example usage:
 * ```ts
 * const callCenterPilot = O2G.callCenterPilot;
 * callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_REMOVED, (e: OnPilotCallRemoved) => {
 *      console.log(e.pilot, e.releasingDevice, e.newDestination, e.callRef, e.cause);
 * });
 * ```
 * @see CallCenterPilot.ON_PILOT_CALL_REMOVED
 */
export class OnPilotCallRemoved {
    #pilot: string;
    #releasingDevice: string;
    #newDestination: string;
    #callRef: string;
    #cause: CallCause;

    /**
     * @internal
     * Use {@link OnPilotCallRemoved.fromJson} to create an instance.
     */
    private constructor(
        pilot: string,
        releasingDevice: string,
        newDestination: string,
        callRef: string,
        cause: CallCause
    ) {
        this.#pilot = pilot;
        this.#releasingDevice = releasingDevice;
        this.#newDestination = newDestination;
        this.#callRef = callRef;
        this.#cause = cause;
    }

    /**
     * Gets the pilot number from which the call was removed.
     * @returns The pilot's phone number as a string.
     */
    get pilot(): string {
        return this.#pilot;
    }

    /**
     * Gets the device that released the call.
     * @returns The releasing device's phone number as a string.
     */
    get releasingDevice(): string {
        return this.#releasingDevice;
    }

    /**
     * Gets the new destination of the call after it was removed.
     * @returns The new destination's phone number as a string.
     */
    get newDestination(): string {
        return this.#newDestination;
    }

    /**
     * Gets the unique reference identifier for this call.
     * @returns The call reference as a string.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * Gets the cause or reason why the call was removed.
     * @returns The {@link CallCause} of this event.
     */
    get cause(): CallCause {
        return this.#cause;
    }

    /**
     * @ignore
     */
    /** @internal */

    static fromJson(json: OnPilotCallRemovedJson): OnPilotCallRemoved {
        return new OnPilotCallRemoved(json.pilot, json.releasingDevice, json.newDestination, json.callRef, json.cause);
    }
}
