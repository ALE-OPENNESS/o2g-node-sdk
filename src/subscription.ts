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

import { EventDispatcher } from './internal/events/event-dispatcher';
import { EventPackage } from './internal/events/event-packages';

class Selector {
    private names: string[];
    private ids!: string[];

    constructor(ids: string[], names: string[]) {
        if (ids != null) {
            this.ids = ids;
        }
        this.names = names;
    }
}

class EventFilter {
    private selectors: Selector[];

    constructor() {
        this.selectors = [];
    }

    add(ids: string[], name: string[]) {
        this.selectors.push(new Selector(ids, name));
    }

    addPackage(ids: string[], eventPackage: EventPackage) {
        this.add(ids, [eventPackage]);
    }
}

/**
 * Interface used when eventing is received via webhook.
 * This object is passed to the O2G SDK; `connectDispatcher` is called by the SDK
 * when the event channel is established.
 */
export interface WebHook {
    /**
     * The URL for the webhook endpoint.
     */
    url: string;

    /**
     * Called by the SDK when the event channel is established, providing the
     * dispatcher to use for forwarding events.
     *
     * @param dispatcher the event dispatcher to connect to
     */
    connectDispatcher: (dispatcher: Object) => void;
}

/**
 * A builder for {@link Subscription}.
 * <p>
 * An instance of `Builder` is available via {@link Subscription.Builder}.
 * <p>
 * The builder configures an event subscription for the O2G server. Each method
 * modifies the state of the builder and returns the same instance, enabling
 * method chaining. The {@link build} method returns a new `Subscription` each
 * time it is invoked.
 *
 * @example
 * ```typescript
 * // User session — subscribe to routing and telephony events for the current user
 * const subscription = Subscription.Builder
 *     .addRoutingEvents([])
 *     .addTelephonyEvents([])
 *     .addEventSummaryEvents([])
 *     .setTimeout(10)
 *     .build();
 *
 * // Administrator session — subscribe to events for specific users
 * const adminSubscription = Subscription.Builder
 *     .addTelephonyEvents(["1000", "1001"])
 *     .addCallCenterAgentEvents(["12000"])
 *     .addMaintenanceEvents()
 *     .build();
 *
 * await O2G.subscribe(subscription);
 * ```
 */
export interface Builder {
    /**
     * Adds routing events to the subscription.
     * <p>
     * The following event associated to the {@link Routing} service is added:
     * <ul>
     * <li>{@link Routing.ON_ROUTING_STATE_CHANGED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to routing events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addRoutingEvents: (ids: string[]) => Builder;

    /**
     * Adds telephony events to the subscription.
     * <p>
     * The following events associated to the {@link Telephony} service are added:
     * <ul>
     * <li>{@link Telephony.ON_TELEPHONY_STATE}</li>
     * <li>{@link Telephony.ON_CALL_CREATED}</li>
     * <li>{@link Telephony.ON_CALL_MODIFIED}</li>
     * <li>{@link Telephony.ON_CALL_REMOVED}</li>
     * <li>{@link Telephony.ON_USER_STATE_MODIFIED}</li>
     * <li>{@link Telephony.ON_DEVICE_STATE_MODIFIED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to telephony events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addTelephonyEvents: (ids: string[]) => Builder;

    /**
     * Adds user management events to the subscription.
     * <p>
     * The following events associated to the {@link Users} service are added:
     * <ul>
     * <li>{@link Users.ON_USER_CREATED}</li>
     * <li>{@link Users.ON_USER_DELETED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to user management events does not require any license.
     *
     * @returns this builder instance
     */
    addUsersManagementEvents: () => Builder;

    /**
     * Adds event summary events to the subscription.
     * <p>
     * The following event associated to the {@link EventSummary} service is added:
     * <ul>
     * <li>{@link EventSummary.ON_EVENT_SUMMARY_UPDATED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to event summary events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addEventSummaryEvents: (ids: string[]) => Builder;

    /**
     * Adds PBX management events to the subscription.
     * <p>
     * The following events associated to the {@link PbxManagement} service are added:
     * <ul>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_CREATED}</li>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_DELETED}</li>
     * <li>{@link PbxManagement.ON_PBX_OBJECT_INSTANCE_MODIFIED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to PBX management events requires having a <b>MANAGEMENT</b> license.
     *
     * @returns this builder instance
     */
    addPbxManagementEvents: () => Builder;

    /**
     * Adds communication log events to the subscription.
     * <p>
     * The following events associated to the {@link CommunicationLog} service are added:
     * <ul>
     * <li>{@link CommunicationLog.ON_COM_RECORD_CREATED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORD_MODIFIED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_DELETED}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_ACK}</li>
     * <li>{@link CommunicationLog.ON_COM_RECORDS_UNACK}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to communication log events requires having a <b>TELEPHONY_ADVANCED</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addCommunicationLogEvents: (ids: string[]) => Builder;

    /**
     * Adds call center agent events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterAgent} service are added:
     * <ul>
     * <li>{@link CallCenterAgent.ON_AGENT_STATE_CHANGED}</li>
     * <li>{@link CallCenterAgent.ON_AGENT_SKILL_CHANGED}</li>
     * <li>{@link CallCenterAgent.ON_SUPERVISOR_HELP_REQUESTED}</li>
     * <li>{@link CallCenterAgent.ON_SUPERVISOR_HELP_CANCELLED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to call center agent events requires having a <b>CONTACTCENTER_AGENT</b> license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addCallCenterAgentEvents: (ids: string[]) => Builder;

    /**
     * Adds call center pilot events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterPilot} service are added:
     * <ul>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_CREATED}</li>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_QUEUED}</li>
     * <li>{@link CallCenterPilot.ON_PILOT_CALL_REMOVED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to call center pilot events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @param ids the pilot numbers to filter events on
     * @returns this builder instance
     */
    addCallCenterPilotEvents: (ids: string[]) => Builder;

    /**
     * Adds call center realtime events to the subscription.
     * <p>
     * The following events associated to the {@link CallCenterRealtime} service are added:
     * <ul>
     * <li>{@link CallCenterRealtime.ON_AGENT_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_PILOT_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_QUEUE_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_AGENT_PG_RTI_CHANGED}</li>
     * <li>{@link CallCenterRealtime.ON_OTHER_PG_RTI_CHANGED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to call center realtime events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @returns this builder instance
     */
    addCallCenterRealtimeEvents: () => Builder;

    /**
     * Adds call center statistics events to the subscription.
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to call center statistics events requires having a <b>CONTACTCENTER_SVCS</b> license.
     *
     * @returns this builder instance
     */
    addCallCenterStatisticsEvents: () => Builder;

    /**
     * Adds maintenance events to the subscription.
     * <p>
     * The following events associated to the {@link Maintenance} service are added:
     * <ul>
     * <li>{@link Maintenance.ON_CTI_LINK_DOWN}</li>
     * <li>{@link Maintenance.ON_CTI_LINK_UP}</li>
     * <li>{@link Maintenance.ON_PBX_LOADED}</li>
     * <li>{@link Maintenance.ON_PBX_LINK_DOWN}</li>
     * <li>{@link Maintenance.ON_PBX_LINK_UP}</li>
     * <li>{@link Maintenance.ON_LICENSE_EXPIRATION}</li>
     * <li>{@link Maintenance.ON_SERVER_STARTED}</li>
     * </ul>
     * <p>
     * The session must have been opened by an administrator.
     * <p>
     * Subscribing to maintenance events does not require any license.
     *
     * @returns this builder instance
     */
    addMaintenanceEvents: () => Builder;

    /**
     * Adds user events to the subscription.
     * <p>
     * The following event associated to the {@link Users} service is added:
     * <ul>
     * <li>{@link Users.ON_USER_INFO_CHANGED}</li>
     * </ul>
     * <p>
     * If the session has been opened for a user, the `ids` parameter is
     * ignored, but it is mandatory if the session has been opened by an
     * administrator.
     * <p>
     * Subscribing to user events does not require any license.
     *
     * @param ids the user login names to filter events on
     * @returns this builder instance
     */
    addUserEvents: (ids: string[]) => Builder;

    /**
     * Sets the lifetime of the event channel.
     *
     * @param value the lifetime of the event channel in minutes
     * @returns this builder instance
     */
    setTimeout: (value: number) => Builder;

    /**
     * Sets the required event version. Defaults to `"1.0"` if not specified.
     *
     * @param value the event version
     * @returns this builder instance
     */
    setVersion: (value: string) => Builder;

    /**
     * Sets the webhook to use for event notification instead of the default
     * chunked HTTP connection.
     *
     * @param webHook the webhook configuration
     * @returns this builder instance
     */
    setWebHook: (webHook: WebHook) => Builder;

    /**
     * Builds and returns a new {@link Subscription} from the current builder state.
     *
     * @returns a new {@link Subscription} instance
     */
    build: () => Subscription;
}

/**
 * Represents a subscription request used to subscribe to events from the O2G server.
 * <p>
 * By default, the application receives events over a chunked HTTP connection
 * established with the O2G server. Alternatively, a {@link WebHook} can be
 * configured to receive events via HTTP POST callbacks.
 * <p>
 * A subscription is built using the {@link Subscription.Builder} object, which
 * provides a fluent API for selecting which event packages to subscribe to.
 *
 * @example
 * ```typescript
 * // User session — subscribe to routing, telephony and event summary
 * const subscription = Subscription.Builder
 *     .addRoutingEvents([])
 *     .addTelephonyEvents([])
 *     .addEventSummaryEvents([])
 *     .setTimeout(10)
 *     .build();
 *
 * await O2G.subscribe(subscription);
 *
 * // Administrator session — subscribe to events for specific users
 * const adminSubscription = Subscription.Builder
 *     .addTelephonyEvents(["1000", "1001"])
 *     .addCallCenterAgentEvents(["*"])
 *     .addMaintenanceEvents()
 *     .build();
 *
 * await O2G.subscribe(adminSubscription);
 *
 * // Using a webhook instead of chunked HTTP
 * const webhookSubscription = Subscription.Builder
 *     .addTelephonyEvents([])
 *     .setWebHook({
 *         url: "https://myapp.example.com/o2g/events",
 *         connectDispatcher: (dispatcher) => { myDispatcher = dispatcher; }
 *     })
 *     .build();
 *
 * await O2G.subscribe(webhookSubscription);
 * ```
 */
export abstract class Subscription {
    private _timeout: number;
    private _filter: EventFilter;
    private _version: string;
    private _webHook: WebHook | null;

    /**
     * @internal
     */
    protected constructor(version: string, timeout: number, filter: EventFilter, webHook: WebHook | null) {
        this._timeout = timeout;
        this._version = version;
        this._filter = filter;
        this._webHook = webHook;
    }

    get timeout(): number {
        return this._timeout;
    }

    get version(): string {
        return this._version;
    }

    get filter(): EventFilter {
        return this._filter;
    }

    get webHook(): WebHook | null {
        return this._webHook;
    }

    /**
     * The subscription builder used to construct a new {@link Subscription}.
     * <p>
     * Use the fluent API to select which event packages to subscribe to, then
     * call {@link Builder.build} to produce the subscription.
     *
     * @example
     * ```typescript
     * const subscription = Subscription.Builder
     *     .addRoutingEvents([])
     *     .addTelephonyEvents([])
     *     .setTimeout(10)
     *     .build();
     * ```
     */
    static Builder: Builder = new (class implements Builder {
        _version: string;
        _timeout: number;
        _filter: EventFilter;
        _webHook: WebHook | null;

        constructor() {
            this._version = '1.0';
            this._timeout = 0;
            this._filter = new EventFilter();
            this._webHook = null;
        }

        addRoutingEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.Routing);
            return this;
        }

        addTelephonyEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.Telephony);
            return this;
        }

        addEventSummaryEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.EventSummary);
            return this;
        }

        addUsersManagementEvents() {
            this._filter.addPackage([], EventPackage.Users);
            return this;
        }

        addMaintenanceEvents() {
            this._filter.addPackage([], EventPackage.System);
            return this;
        }

        addCallCenterRealtimeEvents() {
            this._filter.addPackage(['*'], EventPackage.Rti);
            return this;
        }

        addCallCenterStatisticsEvents() {
            this._filter.addPackage(['*'], EventPackage.AcdStatistics);
            return this;
        }

        addRsiEvents() {
            this._filter.addPackage([], EventPackage.Rsi);
            return this;
        }

        addPbxManagementEvents() {
            this._filter.addPackage([], EventPackage.PbxManagement);
            return this;
        }

        addCommunicationLogEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.CommunicationLog);
            return this;
        }

        addCallCenterAgentEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.Agent);
            return this;
        }

        addCallCenterPilotEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.Pilot);
            return this;
        }

        addUserEvents(ids: string[]) {
            this._filter.addPackage(ids, EventPackage.User);
            return this;
        }

        setTimeout(value: number) {
            this._timeout = value;
            return this;
        }

        setVersion(value: string) {
            this._version = value;
            return this;
        }

        setWebHook(value: WebHook) {
            this._webHook = value;
            return this;
        }

        build() {
            return new SubscriptionImpl(this._version, this._timeout, this._filter, this._webHook);
        }
    })();
}

class SubscriptionImpl extends Subscription {
    /**
     * @internal
     */
    constructor(version: string, timeout: number, filter: EventFilter, webHook: WebHook | null) {
        super(version, timeout, filter, webHook);
    }
}
