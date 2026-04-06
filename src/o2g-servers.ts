/*
 * Copyright 2026 ALE International
 *
 * Licensed under the MIT License.
 */

/**
 * Represents a single O2G server address, with an optional private and public address.
 *
 * @example
 * ```ts
 * // Private address only
 * const host = new Host("10.0.0.1");
 *
 * // Both private and public addresses
 * const host = new Host("10.0.0.1", "93.12.1.1");
 * ```
 */
export class Host {
    /**
     * The private (internal network) address of the O2G server.
     */
    readonly privateAddress?: string;

    /**
     * The public (external network) address of the O2G server.
     */
    readonly publicAddress?: string;

    constructor(privateAddress?: string, publicAddress?: string) {
        if (!privateAddress && !publicAddress) {
            throw new Error('At least one address must be provided.');
        }
        this.privateAddress = privateAddress;
        this.publicAddress = publicAddress;
    }

    /**
     * Returns a human-readable representation of the host address.
     */
    toString(): string {
        if (this.privateAddress && this.publicAddress) {
            return `${this.privateAddress} / ${this.publicAddress}`;
        }
        return this.privateAddress ?? this.publicAddress ?? 'unknown';
    }
}

/**
 * Represents the O2G server configuration, supporting both single server
 * and geographic redundancy deployments.
 *
 * Use the fluent {@link O2GServers.Builder} to construct an instance.
 *
 * @example
 * ```ts
 * // Single server
 * const servers = O2GServers.Builder
 *     .primaryHost(new Host("10.0.0.1"))
 *     .build();
 *
 * // Geographic redundancy
 * const servers = O2GServers.Builder
 *     .primaryHost(new Host("10.0.0.1", "93.12.1.1"))
 *     .secondaryHost(new Host("10.0.0.2", "93.12.1.2"))
 *     .build();
 * ```
 */
export class O2GServers {

    /**
     * The primary O2G server.
     */
    readonly primaryHost: Host;

    /**
     * The secondary O2G server.
     * When set, geographic redundancy is enabled.
     */
    readonly secondaryHost?: Host;

    private constructor(primaryHost: Host, secondaryHost?: Host) {
        this.primaryHost = primaryHost;
        this.secondaryHost = secondaryHost;
    }

    /**
     * Returns whether geographic redundancy is configured.
     */
    get hasSecondary(): boolean {
        return !!this.secondaryHost;
    }

    // ── Builder ───────────────────────────────────────────────────────────

    public static _builder = new (class O2GServersBuilder {

        _primaryHost?: Host;
        _secondaryHost?: Host;

        /**
         * Sets the primary O2G server.
         * @param host - the primary server address
         */
        primaryHost(host: Host): this {
            this._primaryHost = host;
            return this;
        }

        /**
         * Sets the secondary O2G server, enabling geographic redundancy.
         * When the primary server is unreachable after the configured number
         * of attempts, the SDK automatically switches to this server.
         * @param host - the secondary server address
         */
        secondaryHost(host: Host): this {
            this._secondaryHost = host;
            return this;
        }

        /**
         * Builds and returns a new {@link O2GServers} instance from the current
         * builder state. The builder is reset after each call and can be reused.
         * @throws {Error} if no primary host has been set
         */
        build(): O2GServers {
            if (!this._primaryHost) {
                throw new Error('A primary host must be provided.');
            }
            const instance = new O2GServers(
                this._primaryHost,
                this._secondaryHost
            );
            this._primaryHost = undefined;
            this._secondaryHost = undefined;
            return instance;
        }
    })();

    /**
     * The fluent builder for {@link O2GServers}.
     */
    static get Builder() {
        return O2GServers._builder;
    }
}
