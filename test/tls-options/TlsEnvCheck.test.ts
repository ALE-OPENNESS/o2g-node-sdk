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

// ── Mocks (hoisted by Jest before any import) ─────────────────────────────────

// Prevent inversify from actually binding — it would throw on repeated binds
// across tests because the Container is module-level state.
jest.mock('../../src/internal/util/injection-container', () => ({
    containerInit: jest.fn(),
    TYPES: { EventSink: Symbol.for('EventSink') },
    ObjectsContainer: { get: jest.fn(), bind: jest.fn() },
}));

// Prevent Application from creating an HttpClient / undici Agent / timers.
// Export the string constants so the O2G facade can still register its
// O2G_SESSION_LOST / O2G_RECONNECTED listeners without error.
jest.mock('../../src/internal/o2g-application', () => {
    const MockApplication = jest.fn().mockImplementation(() => ({
        on: jest.fn(),
    }));
    return {
        __esModule: true,
        default: MockApplication,
        O2G_SESSION_LOST:    'sessionLost',
        O2G_RECONNECTED:     'reconnected',
        O2G_SERVER_SWITCHED: 'serverSwitched',
    };
});

// ── Imports ───────────────────────────────────────────────────────────────────

import { O2G } from '../../src/o2g-node-sdk';
import { TlsOptions } from '../../src/tls-options';
import { O2GServers } from '../../src/o2g-servers';
import { Host } from '../../src/o2g-servers';

// ── Helpers ───────────────────────────────────────────────────────────────────

const servers = O2GServers.Builder.primaryHost(new Host('10.0.0.1')).build();

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('O2G.initialize() — NODE_TLS_REJECT_UNAUTHORIZED handling', () => {

    const ENV_KEY = 'NODE_TLS_REJECT_UNAUTHORIZED';
    let savedEnv: string | undefined;

    beforeEach(() => {
        savedEnv = process.env[ENV_KEY];
    });

    afterEach(() => {
        // Reset the O2G singleton so initialize() can be called again
        (O2G as any)._application = null;

        // Restore the env variable to its original value
        if (savedEnv === undefined) {
            delete process.env[ENV_KEY];
        } else {
            process.env[ENV_KEY] = savedEnv;
        }

        jest.restoreAllMocks();
    });

    // ── Env var absent ────────────────────────────────────────────────────────

    it('does not warn when NODE_TLS_REJECT_UNAUTHORIZED is not set', () => {
        delete process.env[ENV_KEY];
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        O2G.initialize('TestApp', servers);

        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('does not throw when NODE_TLS_REJECT_UNAUTHORIZED is not set, even with rejectInsecureEnvironment', () => {
        delete process.env[ENV_KEY];

        expect(() =>
            O2G.initialize('TestApp', servers, '1.0',
                TlsOptions.Builder.rejectInsecureEnvironment().build()
            )
        ).not.toThrow();
    });

    // ── Env var set to '0' ────────────────────────────────────────────────────

    it('emits a console.warn when NODE_TLS_REJECT_UNAUTHORIZED=0', () => {
        process.env[ENV_KEY] = '0';
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        O2G.initialize('TestApp', servers);

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('NODE_TLS_REJECT_UNAUTHORIZED=0')
        );
    });

    it('still initialises (does not throw) when NODE_TLS_REJECT_UNAUTHORIZED=0 without rejectInsecureEnvironment', () => {
        process.env[ENV_KEY] = '0';
        jest.spyOn(console, 'warn').mockImplementation(() => {});

        expect(() => O2G.initialize('TestApp', servers)).not.toThrow();
    });

    it('throws when NODE_TLS_REJECT_UNAUTHORIZED=0 and rejectInsecureEnvironment=true', () => {
        process.env[ENV_KEY] = '0';

        expect(() =>
            O2G.initialize('TestApp', servers, '1.0',
                TlsOptions.Builder.rejectInsecureEnvironment().build()
            )
        ).toThrow(/NODE_TLS_REJECT_UNAUTHORIZED=0/);
    });

    it('does not throw when NODE_TLS_REJECT_UNAUTHORIZED=0 and rejectInsecureEnvironment=false', () => {
        process.env[ENV_KEY] = '0';
        jest.spyOn(console, 'warn').mockImplementation(() => {});

        expect(() =>
            O2G.initialize('TestApp', servers, '1.0',
                TlsOptions.Builder.rejectInsecureEnvironment(false).build()
            )
        ).not.toThrow();
    });

    // ── Env var set to another value ──────────────────────────────────────────

    it('does not warn when NODE_TLS_REJECT_UNAUTHORIZED=1 (only "0" triggers the check)', () => {
        process.env[ENV_KEY] = '1';
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

        O2G.initialize('TestApp', servers);

        expect(warnSpy).not.toHaveBeenCalled();
    });
});
