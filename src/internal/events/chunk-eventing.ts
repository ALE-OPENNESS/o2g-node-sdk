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

import { Logger, LogLevel } from '../util/logger';
import { EventDispatcher } from './event-dispatcher';

/** @internal */
export default class ChunkEventing {
    #logger = Logger.create('ChunkEventing');

    #uri: string;
    #abortController: AbortController | null = null;
    #eventDispatcher: EventDispatcher;
    #isRunning = false;
    #reconnectScheduled = false;

    constructor(uri: string, eventDispatcher: EventDispatcher) {
        this.#uri = uri;
        this.#eventDispatcher = eventDispatcher;
    }

    async start(): Promise<void> {
        if (this.#isRunning || this.#reconnectScheduled) {
            this.#logger.warn('ChunkEventing: Already running or reconnect scheduled.');
            return;
        }

        this.#isRunning = true;
        this.#abortController = new AbortController();
        const signal = this.#abortController.signal;

        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: { Accept: '*/*' },
            signal,
        };

        try {
            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                this.#logger.debug(`ChunkEventing: fetch ${this.#uri}`)
            }
            const response = await fetch(this.#uri, fetchOptions);

            if (!response.ok) {
                this.#logger.error(`ChunkEventing: HTTP error ${response.status} - ${response.statusText}`);
                
                const errorBody = await response.text();

                this.#logger.error('unkEChventing: Response body={}', errorBody);
                
                return this.scheduleReconnect();
            }

            if (!response.body) {
                this.#logger.error('ChunkEventing: Response body is null.');
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
                            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                                this.#logger.debug('receive {}', line);
                            }

                            const event = JSON.parse(line);
                            this.#eventDispatcher.dispatch(event);
                        } 
                        catch (e) {
                            this.#logger.error('ChunkEventing: Failed to parse line: {} => error={}', line, e);
                        }
                    }
                }

                if (done) {
                    if (buffer.length > 0) {
                        try {
                            const finalEvent = JSON.parse(buffer);
                            this.#eventDispatcher.dispatch(finalEvent);

                            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                                this.#logger.debug('ChunkEventing: Final event dispatched: {}', finalEvent);
                            }
                        } 
                        catch (e) {
                            this.#logger.error('ChunkEventing: Failed to parse final buffer: {}', e);
                        }
                    }
                    this.#logger.info('ChunkEventing: Stream ended.');
                    break;
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                this.#logger.debug('ChunkEventing: Fetch aborted.');
            } 
            else {
                if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                    this.#logger.debug('ChunkEventing: Fetch error: {}', error);
                }
                return this.scheduleReconnect();
            }
        } 
        finally {
            this.#abortController = null;
            this.#isRunning = false;
        }
    }

    stop(): void {
        if (this.#abortController) {
            this.#abortController.abort();
            if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
                this.#logger.debug('ChunkEventing: Streaming stopped.');
            }
        }
        this.#reconnectScheduled = false;
    }

    private scheduleReconnect(initial = false): void {
        if (this.#reconnectScheduled) return;
        this.#reconnectScheduled = true;

        const delay = initial ? 0 : 1000;

        if (this.#logger.isLevelEnabled(LogLevel.DEBUG)) { 
            this.#logger.debug(`ChunkEventing: Reconnecting in {} s...`, delay / 1000);
        }

        setTimeout(() => {
            this.#reconnectScheduled = false;
            this.start().catch((err) => {
                this.#logger.error('ChunkEventing: Reconnection failed: {}', err);
                // Retry again after 1s on next failure
                this.scheduleReconnect(false);
            });
        }, delay);
    }
}
