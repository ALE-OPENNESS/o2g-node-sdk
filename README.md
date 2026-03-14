# o2g-node-sdk

A Node.js SDK for the ALE International O2G (OmniPCX OpenTouch Gateway) platform, providing a comprehensive TypeScript API for telephony, call control, and contact center services.

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
import { O2G, Subscription, Telephony } from 'o2g-node-sdk';

// 1. Initialize the SDK
O2G.initialize("MyApp", { privateAddress: "192.168.1.1" });

// 2. Login
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

## Sessions

Three types of sessions are supported:

### User Session

Opened with user credentials. Allows the user to access all user-oriented services.
Most service methods that accept a `loginName` parameter will ignore it in a user session —
the session user is used automatically.

```typescript
O2G.initialize("MyApp", { privateAddress: "192.168.1.1" });
await O2G.login("jdoe", "password");

// loginName is ignored — operates on the session user
await O2G.telephony.getCalls();
await O2G.routing.activateDnd();
```

### Administrator Session

Opened with administrator credentials. Allows access to all services for any user.
Methods that accept a `loginName` parameter require it to be specified in an administrator session.

```typescript
O2G.initialize("MyApp", { privateAddress: "192.168.1.1" });
await O2G.login("admin", "password");

// loginName is mandatory in an administrator session
await O2G.telephony.getCalls("jdoe");
await O2G.usersManagement.getLogins();
await O2G.callCenterAgent.getState("agent01");
```

### Supervised Session

Opened with administrator credentials combined with a supervised user identity.
Behaves exactly like a user session for the supervised user — `loginName` is ignored.
This allows an application to use user-oriented services on behalf of a specific user.

```typescript
import { O2G, SupervisedAccount } from 'o2g-node-sdk';

O2G.initialize("MyApp", { privateAddress: "192.168.1.1" });

// Open a supervised session on behalf of jdoe
await O2G.login("admin", "password", new SupervisedAccount("jdoe"));

// Now operates as jdoe — loginName is ignored
await O2G.telephony.getCalls();
await O2G.routing.activateDnd();
```

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
| `O2G.callCenterManagement` | CCD pilot and calendar management | `CONTACTCENTER_SRV` |
| `O2G.maintenance` | System status and PBX health | — |
| `O2G.pbxManagement` | PBX object model management | `MANAGEMENT` |
| `O2G.phoneSetProgramming` | Phone device keys and settings | — |
| `O2G.usersManagement` | Administrator user management | — |
| `O2G.analytics` | Charging and incident data | — |

## Examples

### Forward calls to voicemail when busy

```typescript
import { O2G, ForwardCondition } from 'o2g-node-sdk';

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
import { O2G, Criteria, SearchResult } from 'o2g-node-sdk';

const criteria = new Criteria({ lastName: "Smith" });
await O2G.directory.search(criteria, 10);

let finished = false;
while (!finished) {
    const result = await O2G.directory.getResults();
    if (result?.resultCode === SearchResult.ResultCode.OK) {
        result.items.forEach(item => console.log(item.firstName, item.lastName));
    } else if (result?.resultCode === SearchResult.ResultCode.FINISH) {
        finished = true;
    } else {
        await new Promise(resolve => setTimeout(resolve, 500));
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

## API Reference

- [O2G REST API Reference](https://api.dspp.al-enterprise.com/o2g/)

## Versioning

This SDK follows the O2G API version it targets:

- **Major**: O2G API major version (currently 2)
- **Minor**: O2G API patch version (currently 7.4 → 4)
- **Patch**: SDK release number

For example, `2.4.0` targets O2G API version 2.7.4.

## License

Copyright 2026 ALE International

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.