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

import { OperatorStateJson } from '../../internal/types/cc-agent/cc-agent-types';

/**
 * `OperatorState` represents the current state of a CCD operator.
 *
 * This includes both the static login/logoff state (`mainState`) and
 * the dynamic activity state (`subState`). Additional properties track
 * the pro-ACD device, processing group, withdrawal status, and
 * withdrawal reason index.
 */
export class OperatorState {
    #mainState: OperatorState.OperatorMainState;
    #subState?: OperatorState.OperatorDynamicState;
    #proAcdDeviceNumber?: string;
    #pgNumber?: string;
    #withdrawReason?: number;
    #withdraw?: boolean;

    /**
     * @internal
     */
    constructor(
        mainState: OperatorState.OperatorMainState,
        subState?: OperatorState.OperatorDynamicState,
        proAcdDeviceNumber?: string,
        pgNumber?: string,
        withdraw?: boolean,
        withdrawReason?: number
    ) {
        this.#mainState = mainState;
        this.#subState = subState;
        this.#proAcdDeviceNumber = proAcdDeviceNumber;
        this.#pgNumber = pgNumber;
        this.#withdraw = withdraw;
        this.#withdrawReason = withdrawReason;
    }

    /**
     * Returns the static (main) state of the operator,
     * indicating login, logoff, or error status.
     */
    get mainState(): OperatorState.OperatorMainState {
        return this.#mainState;
    }

    /**
     * Returns the dynamic (sub) state of the operator,
     * indicating the operator's current activity or wrap-up phase.
     *
     * Defaults to `OperatorDynamicState.UNKNOWN` if undefined.
     */
    get subState(): OperatorState.OperatorDynamicState {
        return this.#subState ?? OperatorState.OperatorDynamicState.UNKNOWN;
    }

    /**
     * Returns the pro-ACD device number the operator is logged on.
     *
     * @returns The extension number, or `null` if the operator is not logged on.
     */
    get proAcdDeviceNumber(): string | null {
        return this.#proAcdDeviceNumber ?? null;
    }

    /**
     * Returns the processing group the operator is currently logged into.
     *
     * @returns The PG number, or `null` if the operator is not in any group.
     */
    get pgNumber(): string | null {
        return this.#pgNumber ?? null;
    }

    /**
     * Returns the withdraw reason index for the operator.
     *
     * @returns The withdraw reason index, or `null` if not in withdraw state.
     */
    get withdrawReason(): number | null {
        return this.#withdrawReason ?? null;
    }

    /**
     * Indicates whether the operator is currently in withdraw state.
     *
     * @returns `true` if the operator is withdrawn from call distribution, `false` otherwise.
     */
    get withdraw(): boolean {
        return this.#withdraw ?? false;
    }

    /**
     * Creates an `OperatorState` instance from JSON.
     *
     * @param json - The JSON representation of an operator state.
     * @returns A new `OperatorState` instance.
     */
    /** @internal */

    static fromJson(json: OperatorStateJson): OperatorState {
        return new OperatorState(
            json.mainState,
            json.subState,
            json.proAcdDeviceNumber,
            json.pgNumber,
            json.withdraw,
            json.withdrawReason
        );
    }
}

/**
 * Namespace containing enums used by `OperatorState`.
 */
export namespace OperatorState {
    /**
     * Represents the static login/logoff state of a CCD operator.
     */
    export enum OperatorMainState {
        /** The O2G server is unable to determine the operator's main state. */
        UNKNOWN = 'UNKNOWN',

        /** The operator is logged on a pro-ACD device. */
        LOG_ON = 'LOG_ON',

        /** The operator is logged off. */
        LOG_OFF = 'LOG_OFF',

        /** Error status. */
        ERROR = 'ERROR',
    }

    /**
     * Represents the dynamic activity state of a CCD operator.
     *
     * Dynamic states indicate the operator's current activity,
     * wrap-up phase, or pause status.
     */
    export enum OperatorDynamicState {
        /** The operator is ready to receive calls. */
        READY = 'READY',

        /** The operator is logged on but not entered into any agent group. */
        OUT_OF_PG = 'OUT_OF_PG',

        /** The operator is busy handling a call. */
        BUSY = 'BUSY',

        /** The operator is entering a transaction code. */
        TRANSACTION_CODE_INPUT = 'TRANSACTION_CODE_INPUT',

        /** The operator is in automatic wrap-up phase. */
        WRAPUP = 'WRAPUP',

        /** The operator is in a pause state. */
        PAUSE = 'PAUSE',

        /** The operator has withdrawn from call distribution. */
        WITHDRAW = 'WITHDRAW',

        /** The operator is in wrap-up due to handling an instant message (IM). */
        WRAPUP_IM = 'WRAPUP_IM',

        /** The operator is in wrap-up due to handling an email. */
        WRAPUP_EMAIL = 'WRAPUP_EMAIL',

        /** The operator is in wrap-up due to handling an email, but can still receive CCD calls. */
        WRAPUP_EMAIL_INTERRUPTIBLE = 'WRAPUP_EMAIL_INTERRUPTIBLE',

        /** The operator is in wrap-up after an outbound call. */
        WRAPUP_OUTBOUND = 'WRAPUP_OUTBOUND',

        /** The operator is in wrap-up after a web callback call. */
        WRAPUP_CALLBACK = 'WRAPUP_CALLBACK',

        /** The O2G server is unable to determine the operator's dynamic state. */
        UNKNOWN = 'UNKNOWN',
    }
}
