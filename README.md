# TimeKit

<div align="center">
  <h3>Lightweight date/time formatting and manipulation</h3>
  <p>
    <a href="https://timekit.oxog.dev">Website</a> •
    <a href="https://github.com/ersinkoc/timekit">Repository</a> •
    <a href="https://github.com/ersinkoc/timekit/blob/main/docs/SPECIFICATION.md">API Docs</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/timekit.svg)](https://www.npmjs.com/package/@oxog/timekit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/timekit)](https://bundlephobia.com/package/@oxog/timekit)
[![license](https://img.shields.io/npm/l/@oxog/timekit.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-511%20passing-brightgreen)](https://github.com/ersinkoc/timekit/actions)
[![Coverage](https://img.shields.io/badge/coverage-71.84%25-brightgreen)](https://github.com/ersinkoc/timekit/actions)

</div>

---

## Features

- **Formatting** - Flexible date/time patterns
- **Parsing** - Multiple input formats
- **Relative Time** - "2 hours ago"
- **Manipulation** - Add, subtract, chainable
- **Comparison** - Before, after, between
- **Duration** - Format and humanize
- **Timezone** - Convert and handle DST
- **Calendar** - Grid generation
- **Immutable** - Predictable operations
- **React** - Hooks & components
- **Zero Dependencies**
- **< 3KB** - Tiny bundle

## Installation

```bash
npm install @oxog/timekit
```

## Quick Start

```typescript
import { createTime, now } from '@oxog/timekit'

// Format
now().format('MMMM D, YYYY')  // 'January 4, 2026'

// Relative
createTime('2026-01-02').fromNow()  // '2 days ago'

// Manipulate
now().add(1, 'week').startOf('day')

// Compare
now().isBefore('2026-02-01')  // true
```

## React

```tsx
import { useNow, useCountdown, TimeAgo } from '@oxog/timekit/react'

// Live clock
const time = useNow({ interval: 1000, format: 'HH:mm:ss' })

// Countdown
const { days, hours, minutes, seconds } = useCountdown('2026-02-01')

// Relative time component
<TimeAgo date={post.createdAt} />
```

## Testing

TimeKit comes with comprehensive test coverage:

- **511 tests** covering all core functionality
- **71.84% code coverage** with v8 reporter
- **100% success rate** across all test suites

Test suites include:
- Time manipulation (add, subtract, startOf, endOf)
- Formatting and parsing
- Timezone conversions (IANA database)
- Duration calculations and humanization
- Calendar utilities and generation
- Validation utilities
- Configuration management
- Internationalization (locales)
- React hooks and components

Run tests with:

```bash
npm test                # Run all tests
npm run test:coverage   # Generate coverage report
npm run test:ui         # Interactive test UI
```

## Documentation

- **[API Specification](docs/SPECIFICATION.md)** - Complete API reference
- **[Implementation Guide](docs/IMPLEMENTATION.md)** - Implementation details
- **[Development Tasks](docs/TASKS.md)** - Development roadmap
- **[Website](https://timekit.oxog.dev)** - Project homepage with examples

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
