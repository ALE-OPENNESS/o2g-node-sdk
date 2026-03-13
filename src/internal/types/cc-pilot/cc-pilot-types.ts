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

import { CallCause } from '../../../types/telephony/call/call-cause';
import { TrunkIdentificationJson } from '../telephony/telephony-types';

/**
 * Describes data associated to a pilot call.
 */
/** @internal */
export type CallDataPilotJson = {
    /**
     * Initial user called for this call.
     */
    initialCalled: string;

    /**
     * true it's a anonymous call.
     */
    anonymous: boolean;

    /**
     * Associated data (or Correlator data).
     */
    associatedData: string;

    /**
     * Hexa binary array format for Associated data (or Correlator data).
     */
    hexaBinaryAssociatedData: string;

    /**
     * TrunkIdentification if external call
     */
    trunkIdentification: TrunkIdentificationJson;

    /**
     * if the call has been rerouted in the network (absent if not)
     */
    networkRerouted: boolean;
};

/**
 * This event indicates that a new call arrives on a pilot.
 */
/** @internal */
export type OnPilotCallCreatedJson = {
    /**
     * Pilot number.
     */
    pilot: string;

    /**
     * Caller number.
     */
    caller: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause: CallCause;

    /**
     * Call data
     */
    callData: CallDataPilotJson;
};

/**
 * This event indicates that the call has been queued.
 */
/** @internal */
export type OnPilotCallQueuedJson = {
    /**
     * Pilot number.
     */
    pilot: string;

    /**
     * Caller number.
     */
    caller: string;

    /**
     * Queue number (if distribution) or identifier (if overflow).
     */
    queue: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause: CallCause;

    /**
     * Number of queued calls in the pilot queue.
     */
    numberOfQueued: number;
};

/**
 * This event indicates that the call has been removed from the pilot: cause distribution, cancel or overflow.
 */
/** @internal */
export type OnPilotCallRemovedJson = {
    /**
     * Pilot number.
     */
    pilot: string;

    /**
     * ReleasingDevice number.
     */
    releasingDevice: string;

    /**
     * new Destination number.
     */
    newDestination: string;

    /**
     * The call reference.
     */
    callRef: string;

    /**
     * Cause of the event.
     */
    cause: CallCause;
};
