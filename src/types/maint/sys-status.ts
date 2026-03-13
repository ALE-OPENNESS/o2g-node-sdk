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

import { SystemStatusJson } from '../../internal/types/maint/maint-types';
import { ConfigurationType } from './configuration-type';
import { LicenseStatus } from './license-status';
import { PbxStatus } from './pbx-status';
import { ServerAddress } from './server-address';
import { ServiceStatus } from './service-status';
import { SubscriberFilter } from './subscriber-filter';
import { SystemServiceStatus } from './sys-service-status';

/**
 * Provides a comprehensive status of the O2G server and its connected components.
 *
 * Includes details such as:
 * - Logical server address
 * - HA deployment mode
 * - Primary and secondary server FQDN, version, and service status
 * - Connected OmniPCX Enterprise (PBX) nodes
 * - License status
 * - Configuration type, application ID, and subscriber filters
 */
export class SystemStatus {
    #logicalAddress?: ServerAddress;
    #startDate?: Date;
    #haMode?: boolean;
    #primary?: string;
    #primaryVersion?: string;
    #primaryServiceStatus?: SystemServiceStatus;
    #secondary?: string;
    #secondaryVersion?: string;
    #secondaryServicesStatus?: ServiceStatus;
    #pbxs?: PbxStatus[];
    #license?: LicenseStatus;
    #configurationType?: ConfigurationType;
    #applicationId?: string;
    #subscriberFilter?: SubscriberFilter;

    private constructor(
        logicalAddress?: ServerAddress,
        startDate?: Date,
        haMode?: boolean,
        primary?: string,
        primaryVersion?: string,
        primaryServiceStatus?: SystemServiceStatus,
        pbxs?: PbxStatus[],
        license?: LicenseStatus,
        configurationType?: ConfigurationType,
        applicationId?: string,
        subscriberFilter?: SubscriberFilter,
        secondary?: string,
        secondaryVersion?: string,
        secondaryServicesStatus?: ServiceStatus
    ) {
        this.#logicalAddress = logicalAddress;
        this.#startDate = startDate;
        this.#haMode = haMode;
        this.#primary = primary;
        this.#primaryVersion = primaryVersion;
        this.#primaryServiceStatus = primaryServiceStatus;
        this.#pbxs = pbxs;
        this.#license = license;
        this.#configurationType = configurationType;
        this.#applicationId = applicationId;
        this.#subscriberFilter = subscriberFilter;
        this.#secondary = secondary;
        this.#secondaryVersion = secondaryVersion;
        this.#secondaryServicesStatus = secondaryServicesStatus;
    }

    /** Logical address of this O2G server
     * @returns {ServerAddress | null} The server's logical address or null if not available
     */
    get logicalAddress(): ServerAddress | null {
        return this.#logicalAddress ?? null;
    }

    /** Start date/time of the O2G server
     * @returns {Date | null} Server start date or null if not available
     */
    get startDate(): Date | null {
        return this.#startDate ?? null;
    }

    /** Indicates whether the server is deployed in High Availability (HA) mode
     * @returns {boolean} True if HA mode, false otherwise
     */
    get haMode(): boolean {
        return this.#haMode ?? false;
    }

    /** FQDN of the primary O2G server
     * @returns {string | null} Primary server FQDN or null if not available
     */
    get primary(): string | null {
        return this.#primary ?? null;
    }

    /** Version of the primary O2G server
     * @returns {string | null} Primary server version or null if not available
     */
    get primaryVersion(): string | null {
        return this.#primaryVersion ?? null;
    }

    /** Status of services on the primary O2G server
     * @returns {SystemServiceStatus | null} Primary server service status or null if not available
     */
    get primaryServiceStatus(): SystemServiceStatus | null {
        return this.#primaryServiceStatus ?? null;
    }

    /** FQDN of the secondary O2G server
     * @returns {string | null} Secondary server FQDN or null if not available
     */
    get secondary(): string | null {
        return this.#secondary ?? null;
    }

    /** Version of the secondary O2G server
     * @returns {string | null} Secondary server version or null if not available
     */
    get secondaryVersion(): string | null {
        return this.#secondaryVersion ?? null;
    }

    /** Status of services on the secondary O2G server
     * @returns {ServiceStatus | null} Secondary server service status or null if not available
     */
    get secondaryServicesStatus(): ServiceStatus | null {
        return this.#secondaryServicesStatus ?? null;
    }

    /** Collection of connected OmniPCX Enterprise (PBX) nodes
     * @returns {PbxStatus[] | null} Array of PBX statuses or null if not available
     */
    get pbxs(): PbxStatus[] | null {
        return this.#pbxs ?? null;
    }

    /** License status of this O2G server
     * @returns {LicenseStatus | null} License status or null if not available
     */
    get license(): LicenseStatus | null {
        return this.#license ?? null;
    }

    /** Configuration type of the O2G server
     * @returns {ConfigurationType | null} Configuration type or null if not available
     */
    get configurationType(): ConfigurationType | null {
        return this.#configurationType ?? null;
    }

    /** Application ID associated with the server
     * @returns {string | null} Application ID or null if not available
     */
    get applicationId(): string | null {
        return this.#applicationId ?? null;
    }

    /** Subscriber filter applied on the server
     * @returns {SubscriberFilter | null} Subscriber filter or null if not available
     */
    get subscriberFilter(): SubscriberFilter | null {
        return this.#subscriberFilter ?? null;
    }

    /**
     * Creates a SystemStatus instance from a JSON object.
     * Typically used internally to parse server API responses.
     *
     * @param {SystemStatusJson} json - JSON object containing system status data
     * @returns {SystemStatus} A new SystemStatus instance
     */
    /** @internal */

    static fromJson(json: SystemStatusJson): SystemStatus {
        return new SystemStatus(
            json.logicalAddress ? ServerAddress.fromJson(json.logicalAddress) : undefined,
            json.startDate ? new Date(json.startDate) : undefined,
            json.ha,
            json.primary,
            json.primaryVersion,
            json.primaryServicesStatus ? SystemServiceStatus.fromJson(json.primaryServicesStatus) : undefined,
            json.pbxs?.map(PbxStatus.fromJson),
            json.license ? LicenseStatus.fromJson(json.license) : undefined,
            json.configurationType,
            json.applicationId,
            json.subscriberFilter,
            json.secondary,
            json.secondaryVersion,
            json.secondaryServicesStatus ? ServiceStatus.fromJson(json.secondaryServicesStatus) : undefined
        );
    }
}
