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

/** @internal */
export type ProgrammeableKeyJson = {
    position?: number;
    number?: string;
    mnemonic?: string;
    locked?: boolean;
};

/** @internal */
export type SoftKeyJson = {
    position?: number;
    number?: string;
    mnemonic?: string;
};

/** @internal */
export type PinCodeJson = {
    Pin_Number?: string;
    With_Secret_Code?: boolean;
    Pin_Type_Of_Control?: string;
    Pin_Group?: number;
};

/**
 * DynamicState represents the dynamic state of a device. This state provide information on the associate, and the locked and campon state.
 */
/** @internal */
export type DynamicStateJson = {
    /**
     * Whether the device is locked.
     */
    lock?: boolean;

    /**
     * Whether the camp on is activated.
     */
    campon?: boolean;

    /**
     * The associated phone number.
     */
    associate?: string;
};
