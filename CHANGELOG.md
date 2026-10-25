# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.6.0] - 2026-10-26

First release targeting O2G 2.8. The SDK minor version is incremented for each new O2G version supported (`2.5.x` targeted O2G 2.7.5).

### Added

- `Telephony.makePilotOrRSIConsultationCall(deviceId, pilot, pilotTransferMode, correlatorData, callProfile, loginName)` initiates a consultation call to a CCD pilot or RSI point with an explicit transfer mode, given by the new `PilotTransferMode` enum: `ForceSupervised` (the pilot performs call distribution), `ForceNotSupervised` (no distribution, so the call can be transferred whatever the agent availability) or `NotForced` (the pilot's own configuration decides). Requires O2G 2.8.
- `Telephony.putDeviceInService(deviceId)` and `Telephony.putDeviceOutOfService(deviceId)`. The resulting state change is notified through `ON_DEVICE_STATE_MODIFIED` and `ON_USER_STATE_MODIFIED`. Requires O2G 2.8.
- `Telephony.attachData()` accepts an optional fourth parameter `callProfile`, to associate a call profile (ACR skills) with an existing call. `correlatorData` may now be `null` when only a call profile is attached.
- `CallCenterRealtime.ON_AGENT_POS_RTI_CHANGED` event (`OnAgentPOSRtiChanged`), delivered at the end of each statistic observation period with the time spent by a CCD agent in each phone state (`phoneStateDistribution`, or `getDuration(state)` for a single state).
- `PartyInfoType.typeOfExternalNumber` indicates whether an external number is national or international, through the new `TypeOfNumber` enum; `null` for internal parties. Requires O2G 2.8.
- `PbxStatus.ctiSecuredLink`, `PbxStatus.afeConnectionStatus` and `PbxStatus.afeRTIStatus`.
- `CallCause.NETWORK_NOT_OBTAINABLE`.

### Changed

- When calling a pilot, `acdCall` is now only sent in the request when it carries something: a forced transfer mode or a call profile. With `NotForced` (or no mode) and no call profile, the request no longer contains an empty `acdCall` object.

### Deprecated

- `Telephony.makePilotOrRSISupervisedTransferCall()`: use `makePilotOrRSIConsultationCall()` with `PilotTransferMode.ForceSupervised`, which is exactly what the deprecated method now delegates to.

### Removed

- The `afeKey` getter on `OnAgentRtiChanged`, `OnPilotRtiChanged`, `OnQueueRtiChanged`, `OnAgentProcessingGroupRtiChanged` and `OnOtherProcessingGroupRtiChanged`. Code reading `event.afeKey` no longer compiles under TypeScript and gets `undefined` in JavaScript.

### Fixed

- `Telephony.attachData()` serialized the call profile with `JSON.stringify` directly. `CallProfile` keeps its skills in a private (`#`) field, which `JSON.stringify` ignores, so the server always received `skills: {}`. The profile is now serialized with `toJson()`, as `makePilotOrRSIConsultationCall()` already did.

## [2.5.12] - 2026-08-08

### Fixed

- Documentation: `O2G.analytics` prerequisites corrected. The service requires **three cumulative** conditions — the `ANALYTICS` license, SSH enabled on every OmniPCX Enterprise node, and an **administrator session** (it is unavailable to user and supervised sessions whatever the license). If any one is missing every method returns `null`, with no exception and nothing logged. The README services table previously listed `O2G.analytics` as requiring **no license at all**; the class JSDoc named the three conditions but never stated the silent-`null` consequence. Corrected in the class JSDoc, in all four method JSDoc blocks, and in the README. No code change.
- Documentation: the README services table gained a "Session / other prerequisites" column. A license-only table was misleading, since two of the three Analytics prerequisites are not licenses. The table also now records that the `CONTACTCENTER_SVCS` license applies in CAPEX mode, with 40 `api-tel-f` subscriptions as the OPEX (Purple On Demand) equivalent.
- Documentation: the `CallCenterManagement`, `CallCenterPilot` and `CallCenterStatistics` JSDoc all named a `CONTACTCENTER_SERVICE` license; the correct value is `CONTACTCENTER_SVCS`, as already used in the README table and in `Subscription`. The three service JSDoc blocks were the only remaining users of the wrong name.
- Documentation: `CallCenterRealtime` JSDoc named no license at all, so the `CONTACTCENTER_SVCS` requirement listed in the README table was unbacked by the sources. All four `CONTACTCENTER_SVCS` services now state the license, with the CAPEX/OPEX alternative, in their class JSDoc.

### Added

- `O2G.O2G_SERVER_SWITCHED` is now exposed as a static accessor on the `O2G` facade. The event itself has been emitted since 2.5.5 and documented in the README, but the accessor was never added, so `O2G.on(O2G.O2G_SERVER_SWITCHED, ...)` failed to compile under TypeScript (`TS2339`) and silently registered a listener under the event name `undefined` in JavaScript. The event name is unchanged (`"serverSwitched"`), so code that worked around this with the string literal keeps working. The handler receives `{ from: Host, to: Host }`, and because geographic failover is permanent the event is emitted at most once per process.

### Fixed

- The `O2G_SERVER_SWITCHED` event is now emitted *after* the internal current-host update rather than before it. `EventEmitter` dispatches synchronously, so a handler that read `O2G.currentHost` during the event previously observed the primary — the server just left behind — instead of the secondary now in use.
- README: the two `O2G_SERVER_SWITCHED` examples interpolated the `Host` objects directly (`${from}`), printing `[object Object]`; they now read `from.privateAddress` / `to.privateAddress`. Added guidance to register the listener between `initialize()` and `login()`, since failover can occur during the initial connection retries — before `login()` resolves.

## [2.5.11] - 2026-07-01

### Fixed

- Chunk eventing now honors `TlsOptions`. The chunk-eventing stream opened its connection with the global `fetch`, bypassing the SDK's TLS configuration, so a custom CA or `allowSelfSigned` applied to REST calls but not to the event stream. The TLS-scoped undici `Agent` created once in the `Application` constructor is now threaded down to `ChunkEventing` and passed as the fetch `dispatcher`, so the event stream validates the server certificate with the same rules as every other SDK request. No API change.

## [2.5.10] - 2026-06-27

### Fixed

- `Subscription.Builder` now resets its state after each `build()` call, matching the behavior of `O2GServers.Builder`. Previously, event packages accumulated silently across successive `build()` calls.
- `SessionMonitoringPolicy.onEventError()` now logs unhandled listener exceptions via the SDK logger (respecting `O2G.setLogLevel()`) instead of silently discarding them. The log message includes the error stack via a `{}` placeholder.
- `SupervisedAccount` documentation corrected: the constructor is private; examples now show the factory methods `withLoginName()` and `withPhoneNumber()`.

## [2.5.9] - 2026-06-07

### Added

- TLS certificate validation support via a new `TlsOptions` class, passed as the optional fourth argument to `O2G.initialize()`. Three modes: system truststore (default), custom CA (PEM chain) via `TlsOptions.Builder.ca(pem)`, and `allowSelfSigned()` (scoped to the SDK only — does not affect the whole process, unlike `NODE_TLS_REJECT_UNAUTHORIZED=0`).
- `TlsOptions.Builder.rejectInsecureEnvironment()` causes `initialize()` to throw if `NODE_TLS_REJECT_UNAUTHORIZED=0` is detected; a `console.warn` is always emitted when that environment variable is set.
- The TLS-scoped undici `Agent` is created once in the `Application` constructor and reused across all reconnections.
