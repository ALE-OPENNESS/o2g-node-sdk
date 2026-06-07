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

import { TlsOptions } from '../../src/tls-options';

describe('TlsOptions.Builder', () => {

    describe('defaults', () => {
        it('returns all-false defaults when build() is called with no options', () => {
            const opts = TlsOptions.Builder.build();
            expect(opts.ca).toBeUndefined();
            expect(opts.allowSelfSigned).toBe(false);
            expect(opts.rejectInsecureEnvironment).toBe(false);
        });
    });

    describe('ca()', () => {
        it('sets ca from a string', () => {
            const pem = '-----BEGIN CERTIFICATE-----\nABC\n-----END CERTIFICATE-----';
            const opts = TlsOptions.Builder.ca(pem).build();
            expect(opts.ca).toBe(pem);
            expect(opts.allowSelfSigned).toBe(false);
        });

        it('sets ca from a Buffer', () => {
            const buf = Buffer.from('PEM content');
            const opts = TlsOptions.Builder.ca(buf).build();
            expect(opts.ca).toBe(buf);
        });

        it('sets ca from an array of strings', () => {
            const chain = ['-----BEGIN CERTIFICATE-----\nA\n-----END CERTIFICATE-----',
                           '-----BEGIN CERTIFICATE-----\nB\n-----END CERTIFICATE-----'];
            const opts = TlsOptions.Builder.ca(chain).build();
            expect(opts.ca).toEqual(chain);
        });
    });

    describe('allowSelfSigned()', () => {
        it('defaults to true when called with no argument', () => {
            const opts = TlsOptions.Builder.allowSelfSigned().build();
            expect(opts.allowSelfSigned).toBe(true);
        });

        it('accepts explicit true', () => {
            const opts = TlsOptions.Builder.allowSelfSigned(true).build();
            expect(opts.allowSelfSigned).toBe(true);
        });

        it('accepts explicit false', () => {
            const opts = TlsOptions.Builder.allowSelfSigned(false).build();
            expect(opts.allowSelfSigned).toBe(false);
        });
    });

    describe('rejectInsecureEnvironment()', () => {
        it('defaults to true when called with no argument', () => {
            const opts = TlsOptions.Builder.rejectInsecureEnvironment().build();
            expect(opts.rejectInsecureEnvironment).toBe(true);
        });

        it('accepts explicit true', () => {
            const opts = TlsOptions.Builder.rejectInsecureEnvironment(true).build();
            expect(opts.rejectInsecureEnvironment).toBe(true);
        });

        it('accepts explicit false', () => {
            const opts = TlsOptions.Builder.rejectInsecureEnvironment(false).build();
            expect(opts.rejectInsecureEnvironment).toBe(false);
        });
    });

    describe('chaining', () => {
        it('can combine ca + rejectInsecureEnvironment', () => {
            const pem = '-----BEGIN CERTIFICATE-----\nABC\n-----END CERTIFICATE-----';
            const opts = TlsOptions.Builder
                .ca(pem)
                .rejectInsecureEnvironment()
                .build();
            expect(opts.ca).toBe(pem);
            expect(opts.allowSelfSigned).toBe(false);
            expect(opts.rejectInsecureEnvironment).toBe(true);
        });

        it('allowSelfSigned and rejectInsecureEnvironment can be set together', () => {
            const opts = TlsOptions.Builder
                .allowSelfSigned()
                .rejectInsecureEnvironment()
                .build();
            expect(opts.allowSelfSigned).toBe(true);
            expect(opts.rejectInsecureEnvironment).toBe(true);
        });
    });

    describe('builder reset after build()', () => {
        it('returns defaults on a second build() without reconfiguring', () => {
            TlsOptions.Builder
                .ca('some-pem')
                .allowSelfSigned()
                .rejectInsecureEnvironment()
                .build();  // first call — consumes the state

            const second = TlsOptions.Builder.build();  // should be reset
            expect(second.ca).toBeUndefined();
            expect(second.allowSelfSigned).toBe(false);
            expect(second.rejectInsecureEnvironment).toBe(false);
        });

        it('each build() produces an independent instance', () => {
            const a = TlsOptions.Builder.allowSelfSigned().build();
            const b = TlsOptions.Builder.build();
            expect(a.allowSelfSigned).toBe(true);
            expect(b.allowSelfSigned).toBe(false);
        });
    });
});
