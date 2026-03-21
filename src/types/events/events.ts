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

import { OnAcdStatsProgress } from '../../internal/types/cc-stats/on-stats-progress';
import {
    OnAgentSkillChanged,
    OnAgentStateChanged,
    OnSupervisorHelpCancelled,
    OnSupervisorHelpRequested,
} from '../cc-agent/cc-agent-events';
import { OnPilotCallCreated, OnPilotCallQueued, OnPilotCallRemoved } from '../cc-pilot/cc-pilot-events';
import {
    OnAgentProcessingGroupRtiChanged,
    OnAgentRtiChanged,
    OnOtherProcessingGroupRtiChanged,
    OnPilotRtiChanged,
    OnQueueRtiChanged,
} from '../cc-rt/cc-rt-events';
import {
    OnComRecordCreated,
    OnComRecordModified,
    OnComRecordsAck,
    OnComRecordsDeleted,
    OnComRecordsUnAck,
} from '../comlog/comlog-events';
import { OnEventSummaryUpdated } from '../eventsummary/event-summary-events';
import {
    OnCtiLinkUp,
    OnCtiLinkDown,
    OnLicenseExpiration,
    OnPbxLoaded,
    OnServerStart,
    OnPbxLinkDown,
    OnPbxLinkUp,
    OnRemoteServerLinkDown,
    OnRemoteServerLinkUp,
} from '../maint/maint-events';
import {
    OnPbxObjectInstanceCreated,
    OnPbxObjectInstanceDeleted,
    OnPbxObjectInstanceModified,
} from '../pbxmngt/pbxmngt-events';
import { OnRoutingStateChanged } from '../routing/routing-events';
import {
    OnToneGeneratedStart,
    OnToneGeneratedStop,
    OnDigitCollected,
    OnRouteRequest,
    OnRouteEnd,
} from '../rsi/rsi-events';
import {
    OnCallCreated,
    OnCallModified,
    OnCallRemoved,
    OnDeviceStateModified,
    OnDynamicStateChanged,
    OnTelephonyState,
    OnUserStateModified,
} from '../telephony/telephony-events';
import { OnUserCreated, OnUserInfoChanged, OnUserDeleted } from '../users/users-events';

/**
 * Event emitted when an event occurs related to the event channel.
 *
 * This event provides textual information about the channel activity,
 * which can be used for logging, monitoring, or triggering business logic.
 */
export class OnChannelInformation {
    #text: string;

    private constructor(text: string) {
        this.#text = text;
    }

    /**
     * Creates an {@link OnChannelInformation} instance from a JSON payload.
     *
     * @param json - JSON object containing the event information.
     * @returns A new {@link OnChannelInformation} instance.
     */
    /** @internal */

    static fromJson(json: { text: string }): OnChannelInformation {
        return new OnChannelInformation(json.text);
    }

    /**
     * Gets the textual information for this channel event.
     *
     * @returns The channel information as a string.
     */
    get text(): string {
        return this.#text;
    }
}

export interface EventMap {
    OnChannelInformation: OnChannelInformation;

    // eventSummary
    OnEventSummaryUpdated: OnEventSummaryUpdated;

    // users
    OnUserCreated: OnUserCreated;
    OnUserInfoChanged: OnUserInfoChanged;
    OnUserDeleted: OnUserDeleted;

    // telephony
    OnCallCreated: OnCallCreated;
    OnCallModified: OnCallModified;
    OnCallRemoved: OnCallRemoved;
    OnDeviceStateModified: OnDeviceStateModified;
    OnDynamicStateChanged: OnDynamicStateChanged;
    OnTelephonyState: OnTelephonyState;
    OnUserStateModified: OnUserStateModified;

    // routing
    OnRoutingStateChanged: OnRoutingStateChanged;

    // comlog
    OnComRecordCreated: OnComRecordCreated;
    OnComRecordModified: OnComRecordModified;
    OnComRecordsDeleted: OnComRecordsDeleted;
    OnComRecordsAck: OnComRecordsAck;
    OnComRecordsUnAck: OnComRecordsUnAck;

    // maint
    OnPbxLinkUp: OnPbxLinkUp;
    OnPbxLinkDown: OnPbxLinkDown;
    OnCtiLinkUp: OnCtiLinkUp;
    OnCtiLinkDown: OnCtiLinkDown;
    OnLicenseExpiration: OnLicenseExpiration;
    OnPbxLoaded: OnPbxLoaded;
    OnServerStart: OnServerStart;
    OnRemoteServerLinkDown: OnRemoteServerLinkDown;
    OnRemoteServerLinkUp: OnRemoteServerLinkUp;

    // pbxmngt
    OnPbxObjectInstanceCreated: OnPbxObjectInstanceCreated;
    OnPbxObjectInstanceDeleted: OnPbxObjectInstanceDeleted;
    OnPbxObjectInstanceModified: OnPbxObjectInstanceModified;

    // callCenterAgent
    OnAgentSkillChanged: OnAgentSkillChanged;
    OnAgentStateChanged: OnAgentStateChanged;
    OnSupervisorHelpCancelled: OnSupervisorHelpCancelled;
    OnSupervisorHelpRequested: OnSupervisorHelpRequested;

    // callCenterPilot
    OnPilotCallCreated: OnPilotCallCreated;
    OnPilotCallQueued: OnPilotCallQueued;
    OnPilotCallRemoved: OnPilotCallRemoved;

    // callCenterRealtime
    OnAgentRtiChanged: OnAgentRtiChanged;
    OnPGAgentRtiChanged: OnAgentProcessingGroupRtiChanged;
    OnPGOtherRtiChanged: OnOtherProcessingGroupRtiChanged;
    OnPilotRtiChanged: OnPilotRtiChanged;
    OnQueueRtiChanged: OnQueueRtiChanged;

    // callCenterStatistics
    OnAcdStatsProgress: OnAcdStatsProgress;

    // rsi
    OnToneGeneratedStart: OnToneGeneratedStart;
    OnToneGeneratedStop: OnToneGeneratedStop;
    OnDigitCollected: OnDigitCollected;
    OnRouteRequest: OnRouteRequest;
    OnRouteEnd: OnRouteEnd;
}
