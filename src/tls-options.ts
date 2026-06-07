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
 * TLS options controlling how the SDK validates the O2G server's certificate.
 *
 * Use the fluent {@link TlsOptions.Builder} to construct an instance.
 *
 * @example — private CA
 * ```ts
 * import fs from 'node:fs';
 *
 * O2G.initialize(
 *     "MyApp",
 *     O2GServers.Builder.primaryHost(new Host("10.0.0.1")).build(),
 *     "1.0",
 *     TlsOptions.Builder
 *         .ca(fs.readFileSync('/etc/ssl/certs/o2g-ca.pem'))
 *         .build()
 * );
 * ```
 *
 * @example — self-signed certificate (dev/test only)
 * ```ts
 * O2G.initialize("MyApp", servers, "1.0",
 *     TlsOptions.Builder.allowSelfSigned().build()
 * );
 * ```
 *
 * @example — strict mode: refuse to start if TLS validation is globally disabled
 * ```ts
 * O2G.initialize("MyApp", servers, "1.0",
 *     TlsOptions.Builder
 *         .ca(fs.readFileSync('ca.pem'))
 *         .rejectInsecureEnvironment()
 *         .build()
 * );
 * ```
 */
export class TlsOptions {

    /**
     * Complete PEM-encoded CA certificate chain used to validate the O2G
     * server's TLS certificate.
     * Pass the file content, not a file path.
     * Accepts a single certificate, a chain (concatenated PEMs), or an array.
     */
    readonly ca?: string | Buffer | Array<string | Buffer>;

    /**
     * When `true`, disables certificate validation for connections made by
     * the SDK (sets `rejectUnauthorized: false` on the internal undici Agent).
     *
     * This is scoped to the SDK only — unlike `NODE_TLS_REJECT_UNAUTHORIZED=0`
     * which disables validation for the entire Node.js process.
     *
     * **Only use this in development or test environments.**
     */
    readonly allowSelfSigned: boolean;

    /**
     * When `true`, {@link O2G.initialize} throws an error if
     * `NODE_TLS_REJECT_UNAUTHORIZED=0` is present in the environment.
     *
     * Use this in production deployments to ensure that TLS validation
     * cannot be silently bypassed via environment variables.
     */
    readonly rejectInsecureEnvironment: boolean;

    private constructor(
        ca: string | Buffer | Array<string | Buffer> | undefined,
        allowSelfSigned: boolean,
        rejectInsecureEnvironment: boolean
    ) {
        this.ca = ca;
        this.allowSelfSigned = allowSelfSigned;
        this.rejectInsecureEnvironment = rejectInsecureEnvironment;
    }

    // ── Builder ───────────────────────────────────────────────────────────────

    public static _builder = new (class TlsOptionsBuilder {

        _ca?: string | Buffer | Array<string | Buffer>;
        _allowSelfSigned: boolean = false;
        _rejectInsecureEnvironment: boolean = false;

        /**
         * Sets the PEM-encoded CA certificate chain used to validate the O2G
         * server's TLS certificate.
         * @param ca - PEM content (string, Buffer, or array of either)
         */
        ca(ca: string | Buffer | Array<string | Buffer>): this {
            this._ca = ca;
            return this;
        }

        /**
         * Disables certificate validation for SDK connections.
         * Scoped to the SDK only — does not affect the rest of the process.
         * **Only use in development or test environments.**
         * @param value - defaults to `true`
         */
        allowSelfSigned(value: boolean = true): this {
            this._allowSelfSigned = value;
            return this;
        }

        /**
         * Causes {@link O2G.initialize} to throw if
         * `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in the environment.
         * @param value - defaults to `true`
         */
        rejectInsecureEnvironment(value: boolean = true): this {
            this._rejectInsecureEnvironment = value;
            return this;
        }

        /**
         * Builds and returns a new {@link TlsOptions} instance from the current
         * builder state. The builder is reset after each call and can be reused.
         */
        build(): TlsOptions {
            const instance = new TlsOptions(
                this._ca,
                this._allowSelfSigned,
                this._rejectInsecureEnvironment
            );
            this._ca                    = undefined;
            this._allowSelfSigned       = false;
            this._rejectInsecureEnvironment = false;
            return instance;
        }
    })();

    /**
     * The fluent builder for {@link TlsOptions}.
     */
    static get Builder() {
        return TlsOptions._builder;
    }
}
