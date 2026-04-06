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


import { EventDispatcher } from '../types/events/events';
import { BehaviorAction, SessionMonitoringPolicy } from '../session-monitoring-policy';
import { Logger } from '../internal/util/logger';
import { LogLevel } from '../log-level';

/** @internal */
export default class ChunkEventing {
    #logger = Logger.create('ChunkEventing');

    #uri: string;
    #abortController: AbortController | null = null;
    #eventDispatcher: EventDispatcher;
    #monitoringPolicy: SessionMonitoringPolicy;
    #onSessionLost: (reason: string) => void;
    #isRunning = false;
    #reconnectScheduled = false;
    #chunkEstablished = false;

    // Tracks consecutive network-level errors to allow policy escalation
    #consecutiveErrors = 0;

    constructor(
        uri: string,
        eventDispatcher: EventDispatcher,
        monitoringPolicy: SessionMonitoringPolicy,
        onSessionLost: (reason: string) => void
    ) {
        this.#uri = uri;
        this.#eventDispatcher = eventDispatcher;
        this.#monitoringPolicy = monitoringPolicy;
        this.#onSessionLost = onSessionLost;
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
                this.#logger.debug(`ChunkEventing: fetch ${this.#uri}`);
            }

            const response = await fetch(this.#uri, fetchOptions);

            if (!response.ok) {
                this.#logger.error(
                    `ChunkEventing: HTTP error ${response.status} - ${response.statusText}`
                );

                if (!this.#chunkEstablished) {
                    this.#monitoringPolicy.onChunkFatalError(response.status);
                }
                this.#onSessionLost('chunk-http-error');
                return;
            }

            if (!response.body) {
                this.#logger.error('ChunkEventing: Response body is null.');
                this.#scheduleReconnect();
                return;
            }

            // Stream opened successfully — reset error counter
            this.#consecutiveErrors = 0;

            if (!this.#chunkEstablished) {
                this.#chunkEstablished = true;
                this.#monitoringPolicy.onChunkEstablished();
                this.#logger.info('ChunkEventing: Channel established.');
            }

            const decoder = new TextDecoder('utf-8');
            const reader = response.body.getReader();
            let buffer = '';
            let streamBroken = false;

            try {
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
                                    this.#logger.debug('ChunkEventing: receive {}', line);
                                }
                                const event = JSON.parse(line);
                                this.#eventDispatcher.dispatch(event);
                            } catch (e) {
                                this.#monitoringPolicy.onEventError(e as Error);
                                this.#logger.error(
                                    'ChunkEventing: Failed to parse line: {} => error={}',
                                    line,
                                    e
                                );
                            }
                        }
                    }

                    if (done) {
                        if (buffer.length > 0) {
                            try {
                                const finalEvent = JSON.parse(buffer);
                                this.#eventDispatcher.dispatch(finalEvent);
                            } catch (e) {
                                this.#logger.error(
                                    'ChunkEventing: Failed to parse final buffer: {}',
                                    e
                                );
                            }
                        }
                        this.#logger.info('ChunkEventing: Stream ended.');
                        break;
                    }
                }
            } catch (streamError: any) {
                if (streamError.name !== 'AbortError') {
                    this.#logger.error('ChunkEventing: Stream read error:', streamError);
                    streamBroken = true;
                }
            } finally {
                reader.releaseLock();
            }

            if (streamBroken) {
                // Treat stream break as a clean server-side close — reconnect immediately
                // without consulting policy or incrementing error counter
                this.#consecutiveErrors = 0;
                this.#scheduleReconnect();
            } 
            else if (!signal.aborted) {
                this.#consecutiveErrors = 0;
                this.#logger.info('ChunkEventing: Server closed chunk — reconnecting...');
                this.#scheduleReconnect();
            }

        } catch (error: any) {
            if (error.name === 'AbortError') {
                this.#logger.debug('ChunkEventing: Fetch aborted.');
            } else {
                this.#logger.error('ChunkEventing: Fetch error:', error);
                this.#scheduleReconnect(error);
            }
        } finally {
            this.#abortController = null;
            this.#isRunning = false;
        }
    }

    stop(): void {
        if (this.#abortController) {
            this.#abortController.abort();
            this.#logger.debug('ChunkEventing: Streaming stopped.');
        }
        this.#reconnectScheduled = false;
    }

    #scheduleReconnect(error?: Error): void {
        if (this.#reconnectScheduled) return;

        if (error) {
            // Increment consecutive error counter before consulting policy
            this.#consecutiveErrors++;

            const behavior = this.#monitoringPolicy.onChunkError(error, this.#consecutiveErrors);

            if (behavior.action === BehaviorAction.Abort) {
                this.#logger.debug(
                    `ChunkEventing: Aborted by policy after ${this.#consecutiveErrors} consecutive errors.`
                );
                this.#onSessionLost('chunk-error-abort');
                return;
            }

            const delay = behavior.delayMs > 0 ? behavior.delayMs : 1000;
            this.#reconnectScheduled = true;
            this.#logger.debug(`ChunkEventing: Reconnecting in ${delay}ms...`);

            setTimeout(() => {
                this.#reconnectScheduled = false;
                this.start().catch((err) => {
                    this.#logger.error('ChunkEventing: Reconnection failed:', err);
                    this.#scheduleReconnect(err);
                });
            }, delay);
        } else {
            // Clean stream end — reconnect immediately
            this.#reconnectScheduled = true;
            this.#logger.debug('ChunkEventing: Stream ended cleanly, reconnecting...');

            setTimeout(() => {
                this.#reconnectScheduled = false;
                this.start().catch((err) => {
                    this.#logger.error('ChunkEventing: Reconnection failed:', err);
                    this.#scheduleReconnect(err);
                });
            }, 0);
        }
    }
}