# Getting Started with o2g-node-sdk

This guide walks you through everything you need — from installing the required tools to successfully logging in to an O2G server — with no prior programming experience required.

---

## What you will need

- A computer running **Windows**, **macOS**, or **Linux**
- Access to an **O2G server** (hostname or IP address, login name and password)
- An internet connection

---

## Step 1 — Install Node.js

Node.js is the runtime that allows you to run JavaScript and TypeScript code on your computer.

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

Then create a TypeScript configuration file. Run:

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

> The `experimentalDecorators` and `emitDecoratorMetadata` options are required by the SDK.

---

## Step 5 — Install the O2G SDK

```bash
npm install o2g-node-sdk reflect-metadata
```

---

## Step 6 — Write your first program

Create a new file called `index.ts` in your project folder and paste the following code:

```typescript
import 'reflect-metadata';
import { O2G } from 'o2g-node-sdk';

async function main() {

    // 1. Configure the SDK with your O2G server address
    O2G.initialize("MyFirstApp", {
        privateAddress: "https://YOUR_O2G_SERVER_ADDRESS"
    });

    // 2. Log in with your credentials
    console.log("Logging in...");
    const success = await O2G.login("YOUR_LOGIN", "YOUR_PASSWORD");

    if (success) {
        console.log("Login successful!");

        // 3. The SDK is now ready — you can call any service here

        // 4. Always log out when done
        await O2G.logout();
        console.log("Logged out.");
    } else {
        console.log("Login failed. Please check your credentials and server address.");
    }
}

main().catch(console.error);
```

Replace the following placeholders:
- `YOUR_O2G_SERVER_ADDRESS` — the hostname or IP address of your O2G server (e.g. `192.168.1.100`)
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
Logging in...
Login successful!
Logged out.
```

---

## Troubleshooting

**`Login failed`**
- Double-check the server address, login name and password
- Make sure the O2G server is reachable from your computer (try opening the address in a browser)
- If the server uses a self-signed SSL certificate, you may need to disable certificate verification for testing:

```typescript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

Add this line at the very top of `index.ts`, before any imports. Remove it in production.

**`Cannot find module 'o2g-node-sdk'`**
- Make sure you ran `npm install o2g-node-sdk` in the correct folder
- Try running `npm install` again

**`experimentalDecorators` error**
- Make sure your `tsconfig.json` contains `"experimentalDecorators": true` and `"emitDecoratorMetadata": true`

---

## What's next?

Once logged in, you can start using the SDK services. Here are a few examples:

**Make a phone call:**
```typescript
await O2G.telephony.makeCall("myDeviceId", "1234");
```

**Get your active calls:**
```typescript
const calls = await O2G.telephony.getCalls();
console.log(calls);
```

**Subscribe to telephony events:**
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

For a full list of available services and methods, see the [O2G REST API Reference](https://api.dspp.al-enterprise.com/o2g/).