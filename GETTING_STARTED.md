# Getting Started with o2g-node-sdk

This guide walks you through everything you need — from installing the required
tools to successfully logging in to an O2G server — with no prior programming
experience required.

---

## What you will need

- A computer running **Windows**, **macOS**, or **Linux**
- Access to an **O2G server** (hostname or IP address, login name and password)
- An internet connection

---

## Step 1 — Install Node.js

Node.js is the runtime that allows you to run JavaScript and TypeScript code on
your computer.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (recommended for most users)
3. Run the installer and follow the on-screen instructions
4. Verify the installation by opening a terminal and running:

```bash
node --version
npm --version
```

Both commands should print a version number (e.g. `v20.11.0` and `10.2.4`).

> **Opening a terminal:**
> - **Windows**: press `Win + R`, type `cmd`, press Enter
> - **macOS**: press `Cmd + Space`, type `Terminal`, press Enter
> - **Linux**: press `Ctrl + Alt + T`

---

## Step 2 — Install Visual Studio Code (optional but recommended)

Visual Studio Code is a free code editor that makes writing TypeScript much easier.

1. Go to [https://code.visualstudio.com](https://code.visualstudio.com)
2. Download and install the version for your operating system

---

## Step 3 — Create your project

Open a terminal and run the following commands one by one:

```bash
mkdir my-o2g-app
cd my-o2g-app
npm init -y
```

This creates a new folder called `my-o2g-app` and initialises it as a Node.js project.

---

## Step 4 — Install TypeScript

```bash
npm install --save-dev typescript ts-node @types/node
```

Then create a TypeScript configuration file by running:

```bash
npx tsc --init
```

Open the generated `tsconfig.json` file and make sure it contains at least:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": false,
    "outDir": "./dist"
  }
}
```

> The `experimentalDecorators` and `emitDecoratorMetadata` options are required
> by the SDK.

---

## Step 5 — Install the O2G SDK

```bash
npm install o2g-node-sdk reflect-metadata
```

---

## Step 6 — Write your first program

Create a new file called `index.ts` in your project folder and paste the
following code:

```typescript
import 'reflect-metadata';
import { O2G, O2GServers, Host } from 'o2g-node-sdk';

// Disable SSL certificate verification for testing only
// Remove this line in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function main() {

    // 1. Configure the SDK with your O2G server address
    //    The SDK automatically retries if the server is not yet reachable
    O2G.initialize("MyFirstApp", O2GServers.Builder
        .primaryHost(new Host("YOUR_O2G_SERVER_ADDRESS"))
        .build());

    // 2. Log in with your credentials
    console.log("Connecting to O2G server...");
    const success = await O2G.login("YOUR_LOGIN", "YOUR_PASSWORD");

    if (success) {
        console.log("Login successful!");

        // 3. The SDK is now ready — you can call any service here

        // 4. Always shut down when done
        await O2G.shutdown();
        console.log("Logged out.");
    } else {
        console.log("Login failed. Please check your credentials and server address.");
    }
}

main().catch(console.error);
```

Replace the following placeholders:
- `YOUR_O2G_SERVER_ADDRESS` — the hostname or IP address of your O2G server
  (e.g. `192.168.1.100`)
- `YOUR_LOGIN` — your O2G user login name
- `YOUR_PASSWORD` — your O2G user password

---

## Step 7 — Run your program

In your terminal, run:

```bash
npx ts-node index.ts
```

If everything is configured correctly, you should see:

```
Connecting to O2G server...
Login successful!
Logged out.
```

> **Note:** If the O2G server is not yet reachable when you start the program,
> the SDK will automatically retry every 5 seconds until it connects. You will
> see retry messages in the console. Start the server and the program will
> connect automatically.

---

## Step 8 — Add session monitoring (recommended)

In production, you should add a monitoring policy to be notified when the
session is lost and recovered. Update your `index.ts`:

```typescript
import 'reflect-metadata';
import { O2G, O2GServers, Host, SessionMonitoringPolicy, Behavior } from 'o2g-node-sdk';

class MyMonitoringPolicy extends SessionMonitoringPolicy {

    onConnectError(err: Error): Behavior {
        console.warn(`Connection failed: ${err.message} — retrying in 5s`);
        return Behavior.retryAfter(5_000);
    }

    onChunkError(err: Error, consecutiveErrors: number): Behavior {
        console.warn(`Chunk error #${consecutiveErrors}: ${err.message}`);
        return Behavior.abort();
    }
}

async function main() {

    O2G.initialize("MyFirstApp", O2GServers.Builder
        .primaryHost(new Host("YOUR_O2G_SERVER_ADDRESS"))
        .build());

    // Set monitoring policy before login
    O2G.setMonitoringPolicy(new MyMonitoringPolicy());

    // Listen for session lifecycle events
    O2G.on(O2G.O2G_SESSION_LOST, ({ reason }: { reason: string }) => {
        console.warn(`Session lost (${reason}) — SDK is recovering...`);
    });

    O2G.on(O2G.O2G_RECONNECTED, () => {
        console.log("Session recovered — back online.");
    });

    const success = await O2G.login("YOUR_LOGIN", "YOUR_PASSWORD");
    if (success) {
        console.log("Login successful!");
        await O2G.shutdown();
    }
}

main().catch(console.error);
```

---

## Troubleshooting

**`Login failed`**
- Double-check the server address, login name and password
- Make sure the O2G server is reachable from your computer (try opening the
  address in a browser)
- If the server uses a self-signed SSL certificate, add the following line at
  the very top of `index.ts`, before any imports — and remove it in production:

```typescript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

**Program keeps retrying and never connects**
- The SDK retries automatically when the server is unreachable — this is normal
  behaviour. Check that the server address is correct and the server is running.
- To abort immediately instead of retrying, override `onConnectError` in your
  monitoring policy and return `Behavior.abort()`.

**`Cannot find module 'o2g-node-sdk'`**
- Make sure you ran `npm install o2g-node-sdk` in the correct folder
- Try running `npm install` again

**`experimentalDecorators` error**
- Make sure your `tsconfig.json` contains `"experimentalDecorators": true` and
  `"emitDecoratorMetadata": true`

---

## What's next?

Once logged in, you can start using the SDK services. Here are a few examples:

### Make a phone call

```typescript
const myDeviceId = "12000";
await O2G.telephony.makeCall(myDeviceId, "1234");
```

### Get your active calls

```typescript
const calls = await O2G.telephony.getCalls();
console.log(calls);
```

### Subscribe to telephony events

```typescript
import { Subscription, Telephony } from 'o2g-node-sdk';

const subscription = Subscription.Builder
    .addTelephonyEvents([])
    .build();

await O2G.subscribe(subscription);

O2G.telephony.on(Telephony.ON_CALL_CREATED, (event) => {
    console.log("Incoming call:", event.callRef);
});
```

### Configure geographic HA

```typescript
O2G.initialize("MyApp", O2GServers.Builder
    .primaryHost(new Host("10.0.0.1"))
    .secondaryHost(new Host("10.0.0.2"))
    .build());
```

For a full list of available services and methods, see the [README](README.md)
and the [O2G REST API Reference](https://api.dspp.al-enterprise.com/o2g/).