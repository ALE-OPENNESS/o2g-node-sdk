# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.9] - 2026-06-27

### Fixed

- `Subscription.Builder` now resets its state after each `build()` call, matching the behavior of `O2GServers.Builder`. Previously, event packages accumulated silently across successive `build()` calls.
- `SessionMonitoringPolicy.onEventError()` now logs unhandled listener exceptions via the SDK logger (respecting `O2G.setLogLevel()`) instead of silently discarding them. The log message includes the error stack via a `{}` placeholder.
- `SupervisedAccount` documentation corrected: the constructor is private; examples now show the factory methods `withLoginName()` and `withPhoneNumber()`.
