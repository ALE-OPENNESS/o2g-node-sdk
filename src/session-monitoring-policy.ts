/*
 * Copyright 2026 ALE International
 *
 * Licensed under the MIT License.
 */

/**
 * Represents the action the SDK should take in response to a failure.
 */
export enum BehaviorAction {
    Retry = 'retry',
    Abort = 'abort',
}

/**
 * Defines the defensive behavior to apply when an abnormal situation occurs.
 * Use the factory methods to create instances.
 *
 * @example
 * ```ts
 * // Retry after 5 seconds
 * return Behavior.retryAfter(5000);
 *
 * // Abort immediately
 * return Behavior.abort();
 * ```
 */
export interface Behavior {
    readonly action: BehaviorAction;
    readonly delayMs: number;
}

/**
 * Factory methods for creating {@link Behavior} instances.
 */
export const Behavior = {

    /** Retry the operation immediately. */
    retry: (): Behavior => ({
        action: BehaviorAction.Retry,
        delayMs: 0,
    }),

    /** Retry the operation after the specified delay in milliseconds. */
    retryAfter: (delayMs: number): Behavior => ({
        action: BehaviorAction.Retry,
        delayMs,
    }),

    /** Abort the operation permanently. */
    abort: (): Behavior => ({
        action: BehaviorAction.Abort,
        delayMs: 0,
    }),
};

/**
 * Defines how the SDK reacts to abnormal situations during session monitoring.
 *
 * Applications extend this class and override only the methods relevant to
 * their use case. The SDK ships a {@link DefaultSessionMonitoringPolicy} that
 * is used when no custom policy is provided.
 *
 * There are two kinds of methods:
 * - **Decision callbacks** (`onConnectError`, `onChunkError`, `onKeepAliveError`):
 *   must return a {@link Behavior}. The SDK acts on the returned value immediately.
 * - **Notification callbacks** (all others): informational only, no return value.
 *
 * @example
 * ```ts
 * class MyPolicy extends SessionMonitoringPolicy {
 *
 *     onConnectError(err: Error): Behavior {
 *         return Behavior.retryAfter(10_000);
 *     }
 *
 *     onChunkError(err: Error): Behavior {
 *         return Behavior.retryAfter(10_000);
 *     }
 *
 *     onKeepAliveFatalError(): void {
 *         alertOps('O2G session lost — reconnecting...');
 *     }
 * }
 *
 * O2G.setMonitoringPolicy(new MyPolicy());
 * ```
 */
export class SessionMonitoringPolicy {

    // ── Decision callbacks ────────────────────────────────────────────────

    /**
     * Called when the initial connection to the O2G server fails — for example
     * when the server is not yet started or unreachable at application startup.
     *
     * Return {@link Behavior.retryAfter} to retry the connection after a delay,
     * or {@link Behavior.abort} to fail immediately and let the error propagate
     * out of {@link O2G.login}.
     *
     * Default: retry after 5 seconds.
     */
    onConnectError(err: Error): Behavior {
        return Behavior.retryAfter(5_000);
    }

    /**
     * Called when the chunk stream fails with a network-level error, for example
     * when the server is unreachable after a reconnect attempt.
     *
     * @param err - the network error
     * @param consecutiveErrors - the number of consecutive failures so far
     *
     * Return {@link Behavior.retryAfter} to retry the chunk connection after a delay,
     * or {@link Behavior.abort} to stop retrying and trigger full session recovery,
     * which will attempt to reconnect on the other server if geographic redundancy
     * is configured.
     *
     * Default: abort immediately to trigger session recovery.
     */
    onChunkError(err: Error, consecutiveErrors: number): Behavior {
        return Behavior.abort();
    }

    /**
     * Called when the keep-alive request fails with a network-level error.
     *
     * Default: abort — when chunk eventing is active, the chunk listener
     * is already handling the failure. For no-event or webhook applications,
     * override this to return {@link Behavior.retry}.
     */
    onKeepAliveError(err: Error): Behavior {
        return Behavior.abort();
    }

    // ── Notification callbacks ────────────────────────────────────────────

    /**
     * Called when the chunk channel has been successfully (re-)established.
     */
    onChunkEstablished(): void { }

    /**
     * Called when the chunk channel fails with a fatal HTTP error (e.g. 401, 403).
     * The SDK will not retry — this indicates a configuration problem.
     *
     * @param httpStatus - the HTTP status code returned by the server
     */
    onChunkFatalError(httpStatus: number): void { }

    /**
     * Called when a keep-alive was acknowledged successfully by the server.
     */
    onKeepAliveDone(): void { }

    /**
     * Called when the server explicitly rejects the keep-alive — the session
     * no longer exists on the server. The SDK will initiate recovery.
     */
    onKeepAliveFatalError(): void { }

    /**
     * Called when an exception is thrown inside an application event listener.
     * Protects the SDK's internal dispatch loop from crashing due to errors
     * in application code.
     *
     * @param err - the error thrown by the event listener
     */
    onEventError(err: Error): void { }
}

/**
 * The default {@link SessionMonitoringPolicy} used when no custom policy
 * is provided.
 *
 * Default behaviors:
 * - Initial connection error → retry after 5 seconds
 * - Chunk network error      → retry after 2 seconds
 * - Keep-alive network error → abort (chunk handles recovery)
 * - All notifications        → no-op
 */
export class DefaultSessionMonitoringPolicy extends SessionMonitoringPolicy {

    onConnectError(err: Error): Behavior {
        return Behavior.retryAfter(5_000);
    }

    /**
     * Aborts immediately on any chunk network error to trigger session recovery.
     * If geographic redundancy is configured, the SDK will switch to the other
     * server as part of the recovery process.
     */
    onChunkError(err: Error, consecutiveErrors: number): Behavior {
        return Behavior.abort();
    }

    onKeepAliveError(err: Error): Behavior {
        return Behavior.abort();
    }
}