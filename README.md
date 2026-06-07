# o2g-node-sdk

A Node.js SDK for the ALE International O2G (OmniPCX OpenTouch Gateway) platform,
providing a comprehensive TypeScript API for telephony, call control, management
and contact center services.

## Requirements

- Node.js >= 14
- An OmniPCX Enterprise node connected to an O2G server
- An O2G API license appropriate for the services you intend to use

## Installation

```bash
npm install o2g-node-sdk
```

## Quick Start

```typescript
import { O2G, O2GServers, Host, Subscription, Telephony } from 'o2g-node-sdk';

// 1. Initialize the SDK with the O2G server configuration
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("192.168.1.1"))
    .build());

// 2. Login — retries automatically if the server is not yet reachable
const success = await O2G.login("jdoe", "password");
if (!success) {
    console.error("Login failed");
    process.exit(1);
}

// 3. Subscribe to events
const subscription = Subscription.Builder
    .addTelephonyEvents([])
    .addRoutingEvents([])
    .setTimeout(10)
    .build();

await O2G.subscribe(subscription);

// 4. Listen for events
O2G.telephony.on(Telephony.ON_CALL_CREATED, (event) => {
    console.log("New call:", event.callRef);
});

// 5. Make a call
await O2G.telephony.makeCall("1234", "5678");

// 6. Shutdown when done
await O2G.shutdown();
```

## What's New in 2.5.9

### TLS certificate validation — `TlsOptions`

The SDK now provides fine-grained control over how the O2G server's TLS
certificate is validated, via a new `TlsOptions` class passed as the optional
fourth argument to `O2G.initialize()`.

| Mode | How to configure | When to use |
|---|---|---|
| Corporate CA (recommended) | `NODE_EXTRA_CA_CERTS=/path/ca.pem` env var | Standard production deployment — CA as a file on disk |
| Corporate CA (programmatic) | `TlsOptions.Builder.ca(pem).build()` | CA comes from a database, secret manager, or env var containing PEM content |
| Self-signed (dev only) | `TlsOptions.Builder.allowSelfSigned().build()` | Development and test environments only |
| Strict mode | `.rejectInsecureEnvironment()` | Refuse to start if `NODE_TLS_REJECT_UNAUTHORIZED=0` is set |

> **Note:** Node.js does not read the Windows or system certificate store.
> Internal CA certificates must always be provided explicitly via
> `NODE_EXTRA_CA_CERTS` or `TlsOptions.ca`.

`allowSelfSigned` is scoped to the SDK only — unlike the global
`NODE_TLS_REJECT_UNAUTHORIZED=0` environment variable it does not disable TLS
validation for the entire Node.js process.

See the [TLS Configuration](#tls-configuration) section for full examples.

---

## What's New in 2.5.8

### Service instance caching — fixes listeners silenced after recovery

Service getters (`O2G.eventSummary`, `O2G.telephony`, …) now return the **same
instance** for the lifetime of a session. Previously every call created a new
object, and because each constructor silently overwrites the shared `EventSink`
registration, any listener attached to an earlier instance would stop receiving
events — a particularly subtle failure after session recovery.

The instances are automatically invalidated on `O2G_SESSION_LOST` and
`O2G_RECONNECTED`, so the first access after recovery always binds to the new
session. Re-attach your listeners once in the `O2G_RECONNECTED` handler and they
will keep working across any number of recovery cycles.

```typescript
O2G.on(O2G.O2G_RECONNECTED, () => {
    // Re-attach — O2G.eventSummary now returns a fresh instance
    O2G.eventSummary.on(EventSummary.ON_EVENT_SUMMARY_UPDATED, onEventSummary);
});
```

## What's New in 2.5.7

- Add new field `emailAddress` in object `User`

## What's New in 2.5.6

- Fixed a syntax error in the `UserManagement` service that prevented compiling `createUsers`
- Improved JSDoc documentation across all services for consistency and completeness

## What's New in 2.5.5

### Automatic session recovery

The SDK now handles O2G server failures transparently. When the server crashes
or becomes unreachable, the SDK automatically detects the failure, retries the
connection with exponential backoff, re-subscribes to events, and notifies the
application when service is restored. No application-level reconnection logic
is required.

### `SessionMonitoringPolicy` — full control over recovery behaviour

A new `SessionMonitoringPolicy` class allows applications to customise how the
SDK reacts to each failure scenario:

| Callback | When called | Returns |
|---|---|---|
| `onConnectError(err)` | Initial connection or recovery attempt fails | `Behavior` — retry or abort |
| `onChunkError(err, consecutiveErrors)` | Chunk stream network error | `Behavior` — retry or abort |
| `onKeepAliveError(err)` | Keep-alive network error | `Behavior` — retry or abort |
| `onChunkEstablished()` | Chunk channel confirmed working | — |
| `onChunkFatalError(httpStatus)` | Chunk HTTP error (e.g. 401, 403) | — |
| `onKeepAliveDone()` | Keep-alive acknowledged by server | — |
| `onKeepAliveFatalError()` | Keep-alive rejected by server | — |
| `onEventError(err)` | Exception in an application event listener | — |

### Session lifecycle events

Three new events on the `O2G` facade:

- `O2G.O2G_SESSION_LOST` — fired when the session is lost; recovery starts automatically
- `O2G.O2G_RECONNECTED` — fired when the session has been successfully recovered
- `O2G.O2G_SERVER_SWITCHED` — fired when the SDK switches to the secondary server (geographic HA only)

### `O2GServers` — server topology configuration

A new `O2GServers` class with a fluent builder replaces the plain
`{ privateAddress }` object. It supports three deployment topologies:
standalone, local HA (virtual IP), and geographic HA (two distinct hosts).

```typescript
// Standalone
O2GServers.Builder.primaryHost(new Host("10.0.0.1")).build()

// Geographic HA — automatic permanent failover to secondary
O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .secondaryHost(new Host("10.0.0.2"))
    .build()
```

### Geographic HA — automatic permanent failover

When a secondary host is configured and the primary becomes unreachable, the
SDK switches to the secondary immediately and stays there permanently — no
manual intervention required. The `O2G.O2G_SERVER_SWITCHED` event is emitted
when the switch occurs.

### `O2G.setLogLevel()` — SDK verbosity control

A new static method to control internal SDK logging at runtime:

```typescript
O2G.setLogLevel(LogLevel.DEBUG);  // show all internal traces
O2G.setLogLevel(LogLevel.NONE);   // silent
```

### `O2G.currentHost` — active server visibility

A new getter exposes which server the SDK is currently connected to:

```typescript
console.log(`Connected to: ${O2G.currentHost}`);
```

---

## Getting Started

New to TypeScript or Node.js? Follow the [Getting Started guide](GETTING_STARTED.md)
for a complete step-by-step walkthrough from installing the tools to your first login.

## Server Configuration

Use `O2GServers` to configure the O2G server topology. Three deployment
configurations are supported:

### Standalone server

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .build());
```

### Local HA (virtual IP)

Two O2G server instances sharing the same virtual IP address or URL.
Configure it exactly like a standalone server — the virtual IP routes
transparently to whichever node is active:

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("vip.example.com"))
    .build());
```

### Geographic HA (two distinct hosts)

Two O2G server instances at different locations with distinct IP addresses.
On primary failure, the SDK switches immediately to the secondary and stays
there permanently. The {@link O2G.O2G_SERVER_SWITCHED} event is emitted when
the switch occurs:

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .secondaryHost(new Host("10.0.0.2"))
    .build());
```

A `Host` can also be configured with both a private and a public address:

```typescript
new Host("10.0.0.1", "93.12.1.1")
```

The SDK tries the private address first, then falls back to the public address.

## TLS Configuration

O2G servers in enterprise environments typically use certificates signed by an
internal CA. Node.js **does not read the Windows or system certificate store** —
it ships with its own Mozilla-derived CA bundle. You therefore need to explicitly
tell Node.js about your internal CA using one of the approaches below.

### `NODE_EXTRA_CA_CERTS` — recommended for most deployments

The standard Node.js mechanism: point to a PEM file on disk before the process
starts. Node.js adds those certificates to its built-in bundle without replacing
the existing public CAs.

```bash
NODE_EXTRA_CA_CERTS=/etc/ssl/certs/corporate-ca.pem node app.js
```

With this variable set, `O2G.initialize()` requires no `TlsOptions` at all —
Node.js already trusts the O2G server's certificate:

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .build());
```

This is the recommended approach for production deployments where the CA
certificate is a stable file on the server (systemd unit, Docker, PM2
ecosystem file, etc.).

### `TlsOptions.ca` — programmatic alternative

Use this when the CA certificate is not available as a file on disk — for
example, when it is stored in a database, a secret manager, or an environment
variable containing the PEM content:

```typescript
import fs from 'node:fs';
import { O2G, O2GServers, Host, TlsOptions } from 'o2g-node-sdk';

O2G.initialize("MyApp",
    O2GServers.Builder.primaryHost(new Host("10.0.0.1")).build(),
    "1.0",
    TlsOptions.Builder
        .ca(fs.readFileSync('/etc/ssl/certs/o2g-ca.pem'))
        .build()
);
```

Unlike `NODE_EXTRA_CA_CERTS`, this is scoped to the SDK only and does not
affect other HTTPS connections in the same Node.js process.

### Self-signed certificate (development only)

If the O2G server uses a self-signed certificate, disable certificate validation
for the SDK:

```typescript
import { O2G, O2GServers, Host, TlsOptions } from 'o2g-node-sdk';

O2G.initialize("MyApp",
    O2GServers.Builder.primaryHost(new Host("10.0.0.1")).build(),
    "1.0",
    TlsOptions.Builder
        .allowSelfSigned()
        .build()
);
```

> **Warning:** `allowSelfSigned` disables certificate validation entirely.
> Only use this in development or test environments, never in production.

Unlike the global `NODE_TLS_REJECT_UNAUTHORIZED=0` environment variable,
`allowSelfSigned` is scoped to the SDK only and does not affect other HTTPS
connections in the process.

### Strict mode (production hardening)

To ensure that `NODE_TLS_REJECT_UNAUTHORIZED=0` cannot silently bypass TLS
validation in production, add `.rejectInsecureEnvironment()`:

```typescript
O2G.initialize("MyApp",
    O2GServers.Builder.primaryHost(new Host("10.0.0.1")).build(),
    "1.0",
    TlsOptions.Builder
        .rejectInsecureEnvironment()
        .build()
);
```

If `NODE_TLS_REJECT_UNAUTHORIZED=0` is present in the environment when
`initialize()` is called, the SDK throws an error and refuses to start.
This can be combined with `NODE_EXTRA_CA_CERTS` or `TlsOptions.ca`.

---

## Session Monitoring and Recovery

The SDK automatically handles session failures and recovery. When the O2G server
crashes or becomes unreachable, the SDK:

1. Detects the failure via the chunk stream or keep-alive
2. Notifies the application via the `O2G.O2G_SESSION_LOST` event
3. Retries the connection with exponential backoff
4. Switches to the secondary server permanently if geographic HA is configured
5. Re-subscribes to events after recovery
6. Notifies the application via the `O2G.O2G_RECONNECTED` event

### Custom monitoring policy

Extend `SessionMonitoringPolicy` to control SDK behaviour and receive
notifications:

```typescript
import { O2G, SessionMonitoringPolicy, Behavior, LogLevel } from 'o2g-node-sdk';

class MyMonitoringPolicy extends SessionMonitoringPolicy {

    onConnectError(err: Error): Behavior {
        console.warn(`Connection failed: ${err.message} — retrying in 5s`);
        return Behavior.retryAfter(5_000);
    }

    onChunkError(err: Error, consecutiveErrors: number): Behavior {
        console.warn(`Chunk error #${consecutiveErrors}: ${err.message}`);
        return Behavior.abort(); // trigger session recovery
    }

    onSessionLost(reason: string): void {
        console.warn(`Session lost (${reason}) — SDK is recovering...`);
    }

    onSessionRecovered(): void {
        console.log("Session recovered — back online.");
    }
}

O2G.setMonitoringPolicy(new MyMonitoringPolicy());
```

Set the policy before calling `O2G.login()`. If not set, the
`DefaultSessionMonitoringPolicy` is used.

### Session lifecycle events

```typescript
O2G.on(O2G.O2G_SESSION_LOST, ({ reason }) => {
    console.warn(`Session lost: ${reason} — reconnecting...`);
});

O2G.on(O2G.O2G_RECONNECTED, () => {
    console.log("Session recovered — resuming activity.");
    // Re-attach service listeners here: each service getter returns a fresh
    // instance after recovery, so listeners registered before the outage must
    // be re-registered (see "Service instance caching" in What's New 2.5.8).
    O2G.eventSummary.on(EventSummary.ON_EVENT_SUMMARY_UPDATED, onEventSummary);
});

O2G.on(O2G.O2G_SERVER_SWITCHED, ({ from, to }) => {
    console.warn(`Switched from ${from} to ${to} permanently.`);
});
```

### Default behaviours

| Situation | Default behaviour |
|---|---|
| Initial connection fails | Retry after 5 seconds |
| Chunk network error | Abort → trigger session recovery |
| Keep-alive network error | Abort → trigger session recovery |
| Keep-alive rejected by server | Trigger session recovery |
| Server switched to secondary | Permanent — never switches back |

### Logging

Control SDK verbosity using `O2G.setLogLevel()`:

```typescript
import { O2G, LogLevel } from 'o2g-node-sdk';

O2G.setLogLevel(LogLevel.DEBUG);   // show all internal SDK traces
O2G.setLogLevel(LogLevel.INFO);    // default
O2G.setLogLevel(LogLevel.ERROR);   // errors only
O2G.setLogLevel(LogLevel.NONE);    // silent
```

## Sessions

Three types of sessions are supported:

### User Session

Opened with user credentials. Allows the user to access all user-oriented services.
Most service methods that accept a `loginName` parameter will ignore it in a user
session — the session user is used automatically.

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("192.168.1.1"))
    .build());

await O2G.login("jdoe", "password");

// loginName is ignored — operates on the session user
await O2G.telephony.getCalls();
await O2G.routing.activateDnd();
```

### Administrator Session

Opened with administrator credentials. Allows access to all services for any user.
Methods that accept a `loginName` parameter require it to be specified in an
administrator session.

```typescript
await O2G.login("admin", "password");

// loginName is mandatory in an administrator session
await O2G.telephony.getCalls("jdoe");
await O2G.usersManagement.getLogins();
await O2G.callCenterAgent.getState("agent01");
```

### Supervised Session

Opened with administrator credentials combined with a supervised user identity.
Behaves exactly like a user session for the supervised user — `loginName` is ignored.

```typescript
import { O2G, O2GServers, Host, SupervisedAccount } from 'o2g-node-sdk';

O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("192.168.1.1"))
    .build());

// Open a supervised session on behalf of jdoe
await O2G.login("admin", "password", new SupervisedAccount("jdoe"));

// Now operates as jdoe — loginName is ignored
await O2G.telephony.getCalls();
await O2G.routing.activateDnd();
```

## Event Subscription

### Chunk eventing (default)

The SDK opens an outgoing HTTPS connection to the O2G server and receives events
as a stream. No server-side endpoint is required from the application.

```typescript
const subscription = Subscription.Builder
    .addTelephonyEvents([])
    .addRoutingEvents([])
    .setTimeout(10)
    .build();

await O2G.subscribe(subscription);
```

### Webhook eventing

The O2G server sends events via HTTP POST to a URL provided by the application.
The application must expose an HTTPS endpoint and implement the `WebHook` interface:

```typescript
import { O2G, Subscription, WebHook, EventDispatcher } from 'o2g-node-sdk';

const myWebHook: WebHook = {
    url: "https://myapp.example.com/o2g/events",
    connectDispatcher: (dispatcher: EventDispatcher) => {
        myDispatcher = dispatcher;
    }
};

const subscription = Subscription.Builder
    .addMaintenanceEvents()
    .setWebHook(myWebHook)
    .build();

await O2G.subscribe(subscription);
```

The SDK provides no built-in HTTP server — the application is responsible for
exposing the endpoint. See the [webhook examples](examples/webhook) for complete
working examples with common frameworks.

## Services

| Service | Description | License Required |
|---|---|---|
| `O2G.telephony` | Call control, transfer, conference, recording | `TELEPHONY_ADVANCED` |
| `O2G.routing` | Forward, overflow, Do Not Disturb | `TELEPHONY_ADVANCED` |
| `O2G.comlog` | Communication history records | `TELEPHONY_ADVANCED` |
| `O2G.messaging` | Voicemail and mailbox management | `TELEPHONY_ADVANCED` |
| `O2G.directory` | Enterprise directory search | `TELEPHONY_ADVANCED` |
| `O2G.eventSummary` | Missed calls, voicemail counters | `TELEPHONY_ADVANCED` |
| `O2G.users` | User profile and preferences | — |
| `O2G.callCenterAgent` | CCD agent state and skills | `CONTACTCENTER_AGENT` |
| `O2G.callCenterPilot` | CCD pilot monitoring | `CONTACTCENTER_SVCS` |
| `O2G.callCenterRealtime` | Real-time ACD statistics | `CONTACTCENTER_SVCS` |
| `O2G.callCenterStatistics` | Historical ACD statistics | `CONTACTCENTER_SVCS` |
| `O2G.callCenterManagement` | CCD pilot and calendar management | `CONTACTCENTER_SVCS` |
| `O2G.maintenance` | System status and PBX health | — |
| `O2G.pbxManagement` | PBX object model management | `MANAGEMENT` |
| `O2G.phoneSetProgramming` | Phone device keys and settings | — |
| `O2G.usersManagement` | Administrator user management | — |
| `O2G.analytics` | Charging and incident data | — |

## Examples

### Forward calls to voicemail when busy

```typescript
import { O2G } from 'o2g-node-sdk';
import { ForwardCondition } from 'o2g-node-sdk';

await O2G.routing.forwardOnVoiceMail(ForwardCondition.BUSY);
```

### Transfer a call

```typescript
// Supervised transfer
await O2G.telephony.transfer(activeCallRef, heldCallRef);

// Blind transfer
await O2G.telephony.blindTransfer(callRef, "5678");
```

### Monitor a CCD pilot

```typescript
import { O2G, CallCenterPilot, Subscription } from 'o2g-node-sdk';

const subscription = Subscription.Builder
    .addCallCenterPilotEvents(["60141"])
    .build();

await O2G.subscribe(subscription);

O2G.callCenterPilot.on(CallCenterPilot.ON_PILOT_CALL_CREATED, (event) => {
    console.log("Call on pilot:", event.pilotNumber);
});

await O2G.callCenterPilot.monitorStart("60141");
```

### Search the directory

```typescript
import { O2G, Criteria, FilterItem, OperationFilter, SearchResult } from 'o2g-node-sdk';

const criteria = Criteria.create(FilterItem.LAST_NAME, OperationFilter.BEGINS_WITH, "Smith");
await O2G.directory.search(criteria, 10);

let finished = false;
while (!finished) {
    const result = await O2G.directory.getResults();
    if (result?.status === SearchResult.Status.NOK) {
        await new Promise(resolve => setTimeout(resolve, 500));
    } else if (result?.status === SearchResult.Status.OK) {
        result.items?.forEach(item => {
            item.contacts?.forEach(contact =>
                console.log(contact.firstName, contact.lastName));
        });
    } else {
        finished = true;
    }
}
```

### Query communication log records

```typescript
import { O2G, QueryFilter, FilterOption } from 'o2g-node-sdk';

const filter = new QueryFilter({
    after: new Date('2026-01-01'),
    before: new Date('2026-01-31'),
    options: [FilterOption.UNANSWERED]
});

const result = await O2G.comlog.getComRecords(filter);
console.log(`Total records: ${result?.totalCount}`);
```

### Log on a CCD agent

```typescript
import { O2G, CallCenterAgent, Subscription } from 'o2g-node-sdk';

const subscription = Subscription.Builder
    .addCallCenterAgentEvents([])
    .build();

await O2G.subscribe(subscription);

O2G.callCenterAgent.on(CallCenterAgent.ON_AGENT_STATE_CHANGED, (event) => {
    console.log("Agent state changed:", event);
});

await O2G.callCenterAgent.logon("acd001", "pg001");
await O2G.callCenterAgent.setReady();
```

### Configure geographic HA

```typescript
import { O2G, O2GServers, Host } from 'o2g-node-sdk';

O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .secondaryHost(new Host("10.0.0.2"))
    .build());

O2G.on(O2G.O2G_SERVER_SWITCHED, ({ from, to }) => {
    console.warn(`Switched from ${from} to ${to} permanently.`);
});
```

## Migration from previous versions

If you were using the old `{ privateAddress }` syntax, update your code as follows:

```typescript
// Before
O2G.initialize("MyApp", { privateAddress: "10.0.0.1" });

// After
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .build());
```

## API Reference

- [O2G REST API Reference](https://api.dspp.al-enterprise.com/o2g/)

## Versioning

This SDK follows the O2G API version it targets:

- **Major**: O2G API major version (currently 2)
- **Minor**: O2G API patch version (currently 7.5 → 5)
- **Patch**: SDK release number

For example, `2.5.0` targets O2G API version 2.7.5.

## License

Copyright 2026 ALE International

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.