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

import EventEmitter from 'events';
import MaintenanceRest from '../internal/rest/maint-rest';
import {
    OnCtiLinkDown,
    OnCtiLinkUp,
    OnLicenseExpiration,
    OnPbxLinkDown,
    OnPbxLinkUp,
    OnPbxLoaded,
    OnRemoteServerLinkDown,
    OnRemoteServerLinkUp,
    OnServerStart,
} from '../types/maint/maint-events';
import { EventRegistry } from '../events/event-dispatcher';
import { SystemStatus } from '../types/maint/sys-status';

/**
 * The Maintenance service provides information about the system state,
 * in particular information on the OmniPCX Enterprise nodes and their connection state.
 * Information about licenses is also provided per item: total allocated licenses,
 * number currently in use, and expiration date.
 * <p>
 * This service does not require any specific license on the O2G server.
 *
 * @example
 * ```typescript
 * // Monitor system readiness and connection state
 * O2G.maintenance.on(Maintenance.ON_SERVER_STARTED, async () => {
 *     console.log("O2G server is ready");
 *     const status = await O2G.maintenance.getSystemStatus();
 *     if (status) {
 *         console.log(`Connected PBXs: ${status.pbxs.length}`);
 *     }
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_PBX_LINK_DOWN, (event) => {
 *     console.warn(`PBX link down: node ${event.nodeId}`);
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_PBX_LINK_UP, (event) => {
 *     console.log(`PBX link restored: node ${event.nodeId}`);
 * });
 *
 * O2G.maintenance.on(Maintenance.ON_LICENSE_EXPIRATION, (event) => {
 *     console.warn(`License expiring soon: ${event.licenseType}`);
 * });
 * ```
 */
export class Maintenance extends EventEmitter {
    #maintenanceRest: MaintenanceRest;

    /**
     * Occurs when the connection to the remote twin O2G server is lost.
     * @event
     */
    static readonly ON_REMOTE_SERVER_LINK_DOWN = 'OnRemoteServerLinkDown';

    /**
     * Occurs when the connection to the remote twin O2G server is recovered.
     * @event
     */
    static readonly ON_REMOTE_SERVER_LINK_UP = 'OnRemoteServerLinkUp';

    /**
     * Occurs when a CTI link is down.
     * @event
     */
    static readonly ON_CTI_LINK_DOWN = 'OnCtiLinkDown';

    /**
     * Occurs when a CTI link is up.
     * @event
     */
    static readonly ON_CTI_LINK_UP = 'OnCtiLinkUp';

    /**
     * Occurs when the CMIS link to an OmniPCX Enterprise node goes down.
     * @event
     */
    static readonly ON_PBX_LINK_DOWN = 'OnPbxLinkDown';

    /**
     * Occurs when the CMIS link to an OmniPCX Enterprise node is re-established.
     * @event
     */
    static readonly ON_PBX_LINK_UP = 'OnPbxLinkUp';

    /**
     * Occurs when data is fully loaded from an OmniPCX Enterprise node.
     * @event
     */
    static readonly ON_PBX_LOADED = 'OnPbxLoaded';

    /**
     * Occurs when a license is about to expire or has expired.
     * @event
     */
    static readonly ON_LICENSE_EXPIRATION = 'OnLicenseExpiration';

    /**
     * Occurs when the O2G server has started (all OmniPCX Enterprise nodes are connected and loaded).
     * @event
     */
    static readonly ON_SERVER_STARTED = 'OnServerStart';

    /**
     * @internal
     */
    constructor(maintenanceRest: MaintenanceRest, eventRegistry: EventRegistry) {
        super();

        this.#maintenanceRest = maintenanceRest;

        eventRegistry.register(this, Maintenance.ON_SERVER_STARTED, OnServerStart);
        eventRegistry.register(this, Maintenance.ON_LICENSE_EXPIRATION, OnLicenseExpiration);
        eventRegistry.register(this, Maintenance.ON_PBX_LOADED, OnPbxLoaded);
        eventRegistry.register(this, Maintenance.ON_CTI_LINK_UP, OnCtiLinkUp);
        eventRegistry.register(this, Maintenance.ON_CTI_LINK_DOWN, OnCtiLinkDown);
        eventRegistry.register(this, Maintenance.ON_PBX_LINK_UP, OnPbxLinkUp);
        eventRegistry.register(this, Maintenance.ON_PBX_LINK_DOWN, OnPbxLinkDown);
        eventRegistry.register(this, Maintenance.ON_REMOTE_SERVER_LINK_DOWN, OnRemoteServerLinkDown);
        eventRegistry.register(this, Maintenance.ON_REMOTE_SERVER_LINK_UP, OnRemoteServerLinkUp);
    }

    /**
     * Retrieves information about the system state and the total number of each
     * license type available for the system.
     * <p>
     * This operation is restricted to an administrator session only.
     *
     * @returns the {@link SystemStatus} on success; `null` otherwise
     */
    async getSystemStatus(): Promise<SystemStatus | null> {
        return await this.#maintenanceRest.getSystemStatus();
    }
}
