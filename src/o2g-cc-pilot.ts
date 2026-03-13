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

import EventEmitter from 'events';
import CallCenterPilotRest from './internal/rest/ccPilot-rest';
import { EventRegistry } from './internal/events/event-dispatcher';
import { OnPilotCallCreated, OnPilotCallQueued, OnPilotCallRemoved } from './types/cc-pilot/cc-pilot-events';

/**
 * CallCenterPilot allows an administrator to monitor the CCD pilots. Using this
 * service requires having a <b>CONTACTCENTER_SRV</b> license.
 * <p>
 * Monitoring a pilot consists of starting the monitoring with {@link monitorStart},
 * then listening to events to track call activity on the pilot. When monitoring
 * is no longer needed, stop it with {@link monitorStop}.
 *
 * @example
 * ```typescript
 * // Register event listeners before starting monitoring
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_CREATED, (event) => {
 *     console.log("New call on pilot:", event.pilotNumber);
 * });
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_QUEUED, (event) => {
 *     console.log("Call queued on pilot:", event.pilotNumber);
 * });
 * O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_REMOVED, (event) => {
 *     console.log("Call removed from pilot:", event.pilotNumber);
 * });
 *
 * // Start monitoring
 * await O2G.callCenterPilot.monitorStart("60141");
 *
 * // Stop monitoring and clean up when done
 * await O2G.callCenterPilot.monitorStop("60141");
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_CREATED);
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_QUEUED);
 * O2G.callCenterPilot.removeAllListeners(CallCenterPilot.ON_PILOT_CALL_REMOVED);
 * ```
 */
export class CallCenterPilot extends EventEmitter {
    #ccPilotRest: CallCenterPilotRest;

    /**
     * Occurs when a new call arrives on a pilot.
     * @event
     */
    static readonly ON_PILOT_CALL_CREATED = 'OnPilotCallCreated';

    /**
     * Occurs when the call has been queued.
     * @event
     */
    static readonly ON_PILOT_CALL_QUEUED = 'OnPilotCallQueued';

    /**
     * Occurs when a call has been removed from the pilot: by distribution, cancellation or overflow.
     * @event
     */
    static readonly ON_PILOT_CALL_REMOVED = 'OnPilotCallRemoved';

    /**
     *
     * @internal
     */
    constructor(ccPilotRest: CallCenterPilotRest, eventRegistry: EventRegistry) {
        super();
        this.#ccPilotRest = ccPilotRest;

        eventRegistry.register(this, CallCenterPilot.ON_PILOT_CALL_CREATED, OnPilotCallCreated);
        eventRegistry.register(this, CallCenterPilot.ON_PILOT_CALL_QUEUED, OnPilotCallQueued);
        eventRegistry.register(this, CallCenterPilot.ON_PILOT_CALL_REMOVED, OnPilotCallRemoved);
    }

    /**
     * Starts the monitoring of a pilot.
     * <p>
     * If the pilot is already being monitored, no error is returned.
     *
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see monitorStop
     */
    async monitorStart(pilotNumber: string): Promise<boolean> {
        return await this.#ccPilotRest.monitorStart(pilotNumber);
    }

    /**
     * Stops the monitoring of a pilot.
     * <p>
     * If the pilot is not being monitored, no error is returned.
     *
     * @param pilotNumber the pilot number
     * @returns `true` if the operation succeeded; `false` otherwise.
     * @see monitorStart
     */
    async monitorStop(pilotNumber: string): Promise<boolean> {
        return await this.#ccPilotRest.monitorStop(pilotNumber);
    }
}
