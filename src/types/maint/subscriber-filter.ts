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
 * Defines how O2G automatically loads users from OXE subscribers.
 *
 * Controls which OXE subscribers are automatically imported or filtered
 * when provisioning users in the O2G system.
 */
export enum SubscriberFilter {
    /**
     * Only OXE subscribers with the **A4980 attribute** are automatically loaded.
     * Useful when selective subscriber provisioning is required.
     */
    A4980,

    /**
     * All OXE subscribers are automatically loaded.
     * Use this for full subscriber synchronization.
     */
    ALL,

    /**
     * No OXE subscribers are automatically loaded.
     * Users must be created manually or through another provisioning process.
     */
    NONE,
}
