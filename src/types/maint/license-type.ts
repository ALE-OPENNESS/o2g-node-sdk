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

/**
 * Defines the license control mode for the O2G system.
 *
 * Determines how licenses are managed and provisioned, either via an external
 * FlexLM server (CAPEX mode) or the internal License Manager Server (OPEX mode).
 */
export enum LicenseType {
    /**
     * License controlled via an external **FlexLM server** (CAPEX mode).
     * Typically used for on-premises deployments with traditional license management.
     */
    FLEXLM = 'FLEXLM',

    /**
     * License controlled via the **License Manager Server** (OPEX mode, "Purple on Demand").
     * Typically used for subscription-based deployments.
     */
    LMS = 'LMS',
}
