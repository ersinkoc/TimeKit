# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with 511 tests covering all core functionality
- Test coverage reporting with Vitest and v8 coverage provider (71.84% coverage)
- GitHub Actions workflow for automatic GitHub Pages deployment
- Project website at timekit.oxog.dev with landing page
- Documentation organized in dedicated `docs/` folder
- Duration module with creation, manipulation, formatting, and humanization
- Validation utilities for date/time inputs
- Timezone utilities with IANA timezone database support
- Calendar utilities for grid generation and month views
- Configuration management system
- Locale system with English and Turkish support
- React hooks: useTime, useNow, useCountdown, useTimer, useTimeAgo
- React components: TimeAgo, Countdown, Clock

### Changed
- Improved test organization with separate test files for each module
- Enhanced documentation structure

### Fixed
- Duration humanization thresholds for accurate display
- Config default weekStartsOn to Monday (1)
- Turkish locale ordinal formatting (dot suffix)
- Turkish locale weekday minimum abbreviations

## [0.0.1] - 2024-01-01

### Added
- Initial release of TimeKit
- Core date/time formatting and manipulation
- Timezone support with IANA database
- Relative time calculations
- Immutable time objects with chainable API
- Duration formatting and humanization
- Calendar grid generation
- React adapter with hooks and components
- TypeScript support with full type definitions
- Zero dependencies architecture
- Tree-shakeable ES module exports
