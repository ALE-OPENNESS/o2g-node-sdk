# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
