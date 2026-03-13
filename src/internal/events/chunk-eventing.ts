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

import { EventDispatcher } from './event-dispatcher';

/** @internal */
export default class ChunkEventing {
    private _uri: string;
    private _abortController: AbortController | null = null;
    private _eventDispatcher: EventDispatcher;
    private _isRunning = false;
    private _reconnectScheduled = false;

    constructor(uri: string, eventDispatcher: EventDispatcher) {
        this._uri = uri;
        this._eventDispatcher = eventDispatcher;
    }

    async start(): Promise<void> {
        if (this._isRunning || this._reconnectScheduled) {
            console.warn('ChunkEventing: Already running or reconnect scheduled.');
            return;
        }

        this._isRunning = true;
        this._abortController = new AbortController();
        const signal = this._abortController.signal;

        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: { Accept: '*/*' },
            signal,
        };

        try {
            const response = await fetch(this._uri, fetchOptions);

            if (!response.ok) {
                console.error(`ChunkEventing: HTTP error ${response.status} - ${response.statusText}`);
                const errorBody = await response.text();
                console.error('ChunkEventing: Response body:', errorBody);
                return this.scheduleReconnect();
            }

            if (!response.body) {
                console.error('ChunkEventing: Response body is null.');
                return this.scheduleReconnect();
            }

            const decoder = new TextDecoder('utf-8');
            const reader = response.body.getReader();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                buffer += decoder.decode(value, { stream: true });

                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                    const line = buffer.slice(0, newlineIndex).trim();
                    buffer = buffer.slice(newlineIndex + 1);

                    if (line) {
                        try {
                            console.debug('receive ' + line);
                            const event = JSON.parse(line);
                            this._eventDispatcher.dispatch(event);
                        } catch (e) {
                            console.error('ChunkEventing: Failed to parse line:', line, e);
                        }
                    }
                }

                if (done) {
                    if (buffer.length > 0) {
                        try {
                            const finalEvent = JSON.parse(buffer);
                            this._eventDispatcher.dispatch(finalEvent);
                            console.log('ChunkEventing: Final event dispatched:', finalEvent);
                        } catch (e) {
                            console.error('ChunkEventing: Failed to parse final buffer:', e);
                        }
                    }
                    console.log('ChunkEventing: Stream ended.');
                    break;
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('ChunkEventing: Fetch aborted.');
            } else {
                console.error('ChunkEventing: Fetch error:', error);
                return this.scheduleReconnect();
            }
        } finally {
            this._abortController = null;
            this._isRunning = false;
        }
    }

    stop(): void {
        if (this._abortController) {
            this._abortController.abort();
            console.log('ChunkEventing: Streaming stopped.');
        }
        this._reconnectScheduled = false;
    }

    private scheduleReconnect(initial = false): void {
        if (this._reconnectScheduled) return;
        this._reconnectScheduled = true;

        const delay = initial ? 0 : 1000;

        console.log(`ChunkEventing: Reconnecting in ${delay / 1000}s...`);

        setTimeout(() => {
            this._reconnectScheduled = false;
            this.start().catch((err) => {
                console.error('ChunkEventing: Reconnection failed:', err);
                // Retry again after 1s on next failure
                this.scheduleReconnect(false);
            });
        }, delay);
    }
}
