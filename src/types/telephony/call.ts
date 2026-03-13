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

import { CallCapabilitiesJson, CallJson } from '../../internal/types/telephony/telephony-types';
import { CallData } from './call/call-data';
import { Leg } from './call/leg';
import { Participant } from './call/participant';

/**
 * Represents a call in progress, including its reference, associated data,
 * legs and participants.
 */
export class Call {
    #callRef: string;
    #callData?: CallData;
    #legs?: Leg[];
    #participants?: Participant[];

    /**
     * @internal
     */
    private constructor(callRef: string, callData?: CallData, legs?: Leg[], participants?: Participant[]) {
        this.#callRef = callRef;
        this.#callData = callData;
        this.#legs = legs;
        this.#participants = participants;
    }

    /**
     * The unique reference identifier of this call, used to identify it across
     * all telephony operations.
     */
    get callRef(): string {
        return this.#callRef;
    }

    /**
     * The detailed data associated with this call, including state, ACD data,
     * tags and capabilities.
     */
    get callData(): CallData | null {
        return this.#callData ?? null;
    }

    /**
     * The legs associated with this call. Each leg represents a connection
     * endpoint on a device.
     */
    get legs(): Leg[] | null {
        return this.#legs ?? null;
    }

    /**
     * The participants involved in this call.
     */
    get participants(): Participant[] | null {
        return this.#participants ?? null;
    }

    /**
     * @internal
     */
    /** @internal */

    static fromJson(json: CallJson): Call {
        return new Call(
            json.callRef,
            json.callData ? CallData.fromJson(json.callData) : undefined,
            json.legs?.map(Leg.fromJson) ?? undefined,
            json.participants?.map(Participant.fromJson) ?? undefined
        );
    }
}

export namespace Call {
    /**
     * Represents the set of operations that can be performed on a call.
     * <p>
     * Each property indicates whether a specific action is currently available.
     * All capabilities default to `false` if not explicitly set.
     * <p>
     * A `CallCapabilities` instance is available via {@link CallData.capabilities}
     * on the call's associated {@link CallData}.
     */
    export class CallCapabilities {
        #addDevice?: boolean;
        #addParticipant?: boolean;
        #intruded?: boolean;
        #intrusion?: boolean;
        #transfer?: boolean;
        #blindTransfer?: boolean;
        #merge?: boolean;
        #redirect?: boolean;
        #pickedUp?: boolean;
        #redirectToVoiceMail?: boolean;
        #overflowToVoiceMail?: boolean;
        #dropMe?: boolean;
        #terminate?: boolean;
        #reject?: boolean;
        #callBack?: boolean;
        #park?: boolean;
        #startRecord?: boolean;
        #stopRecord?: boolean;
        #pauseRecord?: boolean;
        #resumeRecord?: boolean;
        #dropParticipant?: boolean;
        #muteParticipant?: boolean;
        #holdParticipant?: boolean;

        /**
         * @internal
         */
        private constructor(
            addDevice?: boolean,
            addParticipant?: boolean,
            intruded?: boolean,
            intrusion?: boolean,
            transfer?: boolean,
            blindTransfer?: boolean,
            merge?: boolean,
            redirect?: boolean,
            pickedUp?: boolean,
            redirectToVoiceMail?: boolean,
            overflowToVoiceMail?: boolean,
            dropMe?: boolean,
            terminate?: boolean,
            reject?: boolean,
            callBack?: boolean,
            park?: boolean,
            startRecord?: boolean,
            stopRecord?: boolean,
            pauseRecord?: boolean,
            resumeRecord?: boolean,
            dropParticipant?: boolean,
            muteParticipant?: boolean,
            holdParticipant?: boolean
        ) {
            this.#addDevice = addDevice;
            this.#addParticipant = addParticipant;
            this.#intruded = intruded;
            this.#intrusion = intrusion;
            this.#transfer = transfer;
            this.#blindTransfer = blindTransfer;
            this.#merge = merge;
            this.#redirect = redirect;
            this.#pickedUp = pickedUp;
            this.#redirectToVoiceMail = redirectToVoiceMail;
            this.#overflowToVoiceMail = overflowToVoiceMail;
            this.#dropMe = dropMe;
            this.#terminate = terminate;
            this.#reject = reject;
            this.#callBack = callBack;
            this.#park = park;
            this.#startRecord = startRecord;
            this.#stopRecord = stopRecord;
            this.#pauseRecord = pauseRecord;
            this.#resumeRecord = resumeRecord;
            this.#dropParticipant = dropParticipant;
            this.#muteParticipant = muteParticipant;
            this.#holdParticipant = holdParticipant;
        }

        /** Whether a device can be added to this call. */
        get canAddDevice(): boolean {
            return this.#addDevice ?? false;
        }

        /** Whether a participant can be added to this call. */
        get canAddParticipant(): boolean {
            return this.#addParticipant ?? false;
        }

        /** Whether this call can be intruded upon. */
        get canIntruded(): boolean {
            return this.#intruded ?? false;
        }

        /** Whether intrusion is possible on the called party. */
        get canIntrusion(): boolean {
            return this.#intrusion ?? false;
        }

        /** Whether this call can be transferred. */
        get canTransfer(): boolean {
            return this.#transfer ?? false;
        }

        /** Whether this call can be blind transferred. */
        get canBlindTransfer(): boolean {
            return this.#blindTransfer ?? false;
        }

        /** Whether this call can be merged with another call. */
        get canMerge(): boolean {
            return this.#merge ?? false;
        }

        /** Whether this call can be redirected. */
        get canRedirect(): boolean {
            return this.#redirect ?? false;
        }

        /** Whether this call can be picked up. */
        get canPickedUp(): boolean {
            return this.#pickedUp ?? false;
        }

        /** Whether this call can be redirected to voicemail. */
        get canRedirectToVoiceMail(): boolean {
            return this.#redirectToVoiceMail ?? false;
        }

        /** Whether this call can overflow to voicemail. */
        get canOverflowToVoiceMail(): boolean {
            return this.#overflowToVoiceMail ?? false;
        }

        /** Whether the current user can drop themselves from this call. */
        get canDropMe(): boolean {
            return this.#dropMe ?? false;
        }

        /** Whether this call can be terminated (all parties released). */
        get canTerminate(): boolean {
            return this.#terminate ?? false;
        }

        /** Whether this call can be rejected. */
        get canReject(): boolean {
            return this.#reject ?? false;
        }

        /** Whether a callback can be requested on this call. */
        get canCallBack(): boolean {
            return this.#callBack ?? false;
        }

        /** Whether this call can be parked. */
        get canPark(): boolean {
            return this.#park ?? false;
        }

        /** Whether recording can be started on this call. */
        get canStartRecord(): boolean {
            return this.#startRecord ?? false;
        }

        /** Whether recording can be stopped on this call. */
        get canStopRecord(): boolean {
            return this.#stopRecord ?? false;
        }

        /** Whether recording can be paused on this call. */
        get canPauseRecord(): boolean {
            return this.#pauseRecord ?? false;
        }

        /** Whether recording can be resumed on this call. */
        get canResumeRecord(): boolean {
            return this.#resumeRecord ?? false;
        }

        /** Whether a participant can be dropped from this call. */
        get canDropParticipant(): boolean {
            return this.#dropParticipant ?? false;
        }

        /** Whether a participant can be muted in this call. */
        get canMuteParticipant(): boolean {
            return this.#muteParticipant ?? false;
        }

        /** Whether a participant can be put on hold in this call. */
        get canHoldParticipant(): boolean {
            return this.#holdParticipant ?? false;
        }

        /**
         * @internal
         */
        /** @internal */

        static fromJson(json: CallCapabilitiesJson): CallCapabilities {
            return new CallCapabilities(
                json.addDevice,
                json.addParticipant,
                json.intruded,
                json.intrusion,
                json.transfer,
                json.blindTransfer,
                json.merge,
                json.redirect,
                json.pickedUp,
                json.redirectToVoiceMail,
                json.overflowToVoiceMail,
                json.dropMe,
                json.terminate,
                json.reject,
                json.callBack,
                json.park,
                json.startRecord,
                json.stopRecord,
                json.pauseRecord,
                json.resumeRecord,
                json.dropParticipant,
                json.muteParticipant,
                json.holdParticipant
            );
        }
    }
}
