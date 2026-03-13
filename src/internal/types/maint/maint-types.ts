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

import { ConfigurationType } from '../../../types/maint/configuration-type';
import { CTILinkState } from '../../../types/maint/cti-link-state';
import { LicenseType } from '../../../types/maint/license-type';
import { SubscriberFilter } from '../../../types/maint/subscriber-filter';

/**
 * ServerAddress defines an OmniPCX Enterprise address.
 */
/** @internal */
export type ServerAddressJson = {
    /**
     * This address FQDN.
     */
    fqdn?: string;

    /**
     * This address IPv4 address.
     */
    ip?: string;
};

/** @internal */
export type ServiceStatusJson = {
    name?: string;
    status?: string;
    mode?: string;
};

/** @internal */
export type PbxStatusJson = {
    /**
     * The name of the OmniPCX Enterprise.
     */
    name?: string;

    /**
     * The OmniPCX Enterprise node number.
     */
    nodeId?: number;

    /**
     * The OmniPCX Enterprise main address.
     */
    mainAddress?: ServerAddressJson;

    /**
     * The OmniPCX Enterprise secondary address.
     */
    secondaryAddress?: ServerAddressJson;

    /**
     * The OmniPCX Enterprise version.
     */
    version?: string;

    /**
     * Whether this O2G is connected to this OmniPCX Enterprise node.
     */
    connected?: boolean;

    /**
     * Whether the O2G has loaded all this OmniPCX Enterprise node's users.
     * @see {@link Maintenance.ON_PBX_LOADED} event.
     */
    loaded?: boolean;

    /**
     * The state of the CSTA link between the O2Gserver and this OmniPCX
     * Enterprise node.
     */
    ctiLinkState?: CTILinkState;

    /**
     * Whether the OmniPCX Enterprise node is secured. If the OmniPCX
     * Enterprise node is secured, the connection with the O2G server is done using
     * SSH.
     */
    secured?: boolean;

    /**
     * The number of monitored users on this OmniPCX Enterprise node.
     */
    monitoredUserNumber?: number;

    lmsConnectionStatus?: boolean;
};

/**
 * License represents an O2G license.
 */
/** @internal */
export type LicenseJson = {
    /**
     * The license name.
     */
    name?: string;

    /**
     * The number of licenses.
     */
    total?: number;

    /**
     * The number of licenses used.
     */
    currentUsed?: number;

    /**
     * The expiration date.
     */
    expiration?: string;
};

/** @internal */
export type SystemServiceStatusJson = {
    services?: ServiceStatusJson[];
    globalIPAdress?: string;
    drbd?: string;
};

/** @internal */
export type LicenseStatusJson = {
    type?: LicenseType;
    context?: string;
    currentServer?: string;
    status?: string;
    statusMessage?: string;
    lics?: LicenseJson[];
};

/**
 * SystemStatus provide a full status of the O2G server and its connections.
 */
/** @internal */
export type SystemStatusJson = {
    /**
     * This O2G server logical address.
     */
    logicalAddress?: ServerAddressJson;

    /**
     * The start date of the O2G server.
     */
    startDate?: Date;

    /**
     * Whether this O2G is deployed in high availability mode.
     */
    ha?: boolean;

    /**
     * The FQDN of the currently active O2G server when it is configured in
     * HA mode.
     */
    primary?: string;

    /**
     * The version of the current active O2G server when it is configured in
     * HA mode.
     */
    primaryVersion?: string;

    primaryServicesStatus?: SystemServiceStatusJson;

    /**
     * The FQDN of the backup O2G server when it is configured in HA mode.
     */
    secondary?: string;

    /**
     * The version of the backup O2G server when it is configured in HA mode.
     */
    secondaryVersion?: string;

    secondaryServicesStatus?: ServiceStatusJson;

    /**
     * The collection of OmniPCX Enterprise nodes connected to this O2G server
     */
    pbxs?: PbxStatusJson[];

    license?: LicenseStatusJson;

    /**
     * The O2G Server configuration
     */
    configurationType?: ConfigurationType;

    applicationId?: string;

    subscriberFilter?: SubscriberFilter;
};

/**
 * Notification sent when CTI link is down. This event is sent with a 30 s minimum and 60 s maximum delay.
 */
/** @internal */
export type OnCtiLinkDownJson = {
    /**
     * the nodeId which CTI link is down.
     */
    nodeId: string;
};

/**
 * Notification sent when CTI link is up.
 */
/** @internal */
export type OnCtiLinkUpJson = {
    /**
     * the nodeId which CTI link is down.
     */
    nodeId: string;
};

/**
 * Notification sent when PBX link is down.
 */
/** @internal */
export type OnPbxLinkDownJson = {
    /**
     * the nodeId which PBX link is down.
     */
    nodeId: string;
};

/**
 * Notification sent when PBX link is up.
 */
/** @internal */
export type OnPbxLinkUpJson = {
    /**
     * the nodeId which PBX link is down.
     */
    nodeId: string;
};

/**
 * Notification sent when the license file will soon expire or has recently expired.
 */
/** @internal */
export type OnLicenseExpirationJson = {
    /**
     * Alarm message.
     */
    message: string;

    /**
     * Number of days since or to expiration date: nbDays>0 means the license will expire in nb days and nbDays<0 means the license has already expired since nb days
     */
    nbDays: number;
};

/**
 * Notification sent when datas are fully loaded from an OXE.
 */
/** @internal */
export type OnPbxLoadedJson = {
    /**
     * the nodeId identifier.
     */
    nodeId: string;
};

/**
 * Notification sent when O2G is ready (all oxe nodes are connected and loaded).
 * To be received, this event needs a webhook url to be configured.
 */
/** @internal */
export type OnServerStartJson = {
    /**
     * the IP address of the server which starts.
     */
    serverId: string;
};
