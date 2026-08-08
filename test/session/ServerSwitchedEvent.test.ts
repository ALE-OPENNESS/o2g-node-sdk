import 'reflect-metadata';

// Make #openSession() fail so that login() enters its retry loop — that loop is
// what calls #checkFailover(). Nothing else about the session needs to work.
jest.mock('../../src/internal/service-factory', () => ({
    ServiceFactory: jest.fn().mockImplementation(() => ({
        bootstrap: jest.fn().mockRejectedValue(new Error('primary unreachable')),
    })),
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import { O2G } from '../../src/o2g-node-sdk';
import { O2GServers, Host } from '../../src/o2g-servers';
import { Behavior, SessionMonitoringPolicy } from '../../src/session-monitoring-policy';

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('O2G_SERVER_SWITCHED', () => {

    it('is exposed on the O2G facade and carries the internal event name', () => {
        expect(O2G.O2G_SERVER_SWITCHED).toBe('serverSwitched');
    });

    it('fires with { from, to } and O2G.currentHost already on the secondary', async () => {
        // Retry once so #checkFailover() runs, then abort to end the loop.
        let connectErrors = 0;
        class RetryOncePolicy extends SessionMonitoringPolicy {
            onConnectError(): Behavior {
                connectErrors++;
                return connectErrors === 1 ? Behavior.retryAfter(1) : Behavior.abort();
            }
        }

        O2G.initialize('test', O2GServers.Builder
            .primaryHost(new Host('10.0.0.1'))
            .secondaryHost(new Host('10.0.0.2'))
            .build());
        O2G.setMonitoringPolicy(new RetryOncePolicy());

        const seen: Array<{ from: Host; to: Host; hostDuringEvent: Host }> = [];
        O2G.on(O2G.O2G_SERVER_SWITCHED, ({ from, to }) => {
            seen.push({ from, to, hostDuringEvent: O2G.currentHost });
        });

        // login() swallows the abort and reports failure by returning false.
        await expect(O2G.login('user', 'password')).resolves.toBe(false);

        expect(seen).toHaveLength(1);
        expect(seen[0].from.privateAddress).toBe('10.0.0.1');
        expect(seen[0].to.privateAddress).toBe('10.0.0.2');

        // The ordering guarantee: #currentHost is assigned *before* the emit, so a
        // handler reading O2G.currentHost synchronously must see the secondary.
        expect(seen[0].hostDuringEvent.privateAddress).toBe('10.0.0.2');
        expect(O2G.currentHost.privateAddress).toBe('10.0.0.2');
    });
});
