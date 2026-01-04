# TimeKit - Implementation Tasks

## Phase 0: Foundation ✅ COMPLETED
- [x] Create package.json
- [x] Create tsconfig.json
- [x] Create vitest.config.ts
- [x] Create tsup.config.ts
- [x] Create eslint.config.js
- [x] Create .prettierrc
- [x] Create .gitignore
- [x] Create LICENSE
- [x] Create README.md
- [x] Create SPECIFICATION.md
- [x] Create IMPLEMENTATION.md
- [x] Create TASKS.md

## Phase 1: Core Infrastructure

### 1.1 Types & Constants
- [ ] Create `src/types.ts` - All type definitions
- [ ] Create `src/utils/constants.ts` - Month names, day names, constants
- [ ] Create `src/utils/helpers.ts` - Helper functions
- [ ] Create `src/utils/validate.ts` - Validation functions

### 1.2 Configuration
- [ ] Create `src/core/config.ts` - Global configuration module
  - [ ] Default config object
  - [ ] `configure()` function
  - [ ] `setDefaultTimezone()` function
  - [ ] `setDefaultLocale()` function
  - [ ] Config getter/setter

### 1.3 Locales
- [ ] Create `src/locales/en.ts` - English locale
- [ ] Create `src/locales/tr.ts` - Turkish locale
- [ ] Create `src/locales/index.ts` - Locale registry

## Phase 2: Core Time Implementation

### 2.1 Time Class
- [ ] Create `src/core/time.ts` - Main Time class
  - [ ] Constructor with timestamp, offset, timezone
  - [ ] `clone()` method
  - [ ] `valueOf()` method
  - [ ] `toString()` method
  - [ ] `toISOString()` method
  - [ ] `toJSON()` method
  - [ ] `toLocaleString()` method

### 2.2 Getters
- [ ] Implement all getter methods in Time class
  - [ ] `year()` - Get year
  - [ ] `month()` - Get month (1-12)
  - [ ] `date()` - Get day of month (1-31)
  - [ ] `day()` - Get day of week (0-6)
  - [ ] `hour()` - Get hour (0-23)
  - [ ] `minute()` - Get minute (0-59)
  - [ ] `second()` - Get second (0-59)
  - [ ] `millisecond()` - Get millisecond (0-999)
  - [ ] `get(unit)` - Generic getter

### 2.3 Factory Functions
- [ ] Create `src/core/create.ts`
  - [ ] `createTime()` - Main factory function
  - [ ] `createTime.unix()` - From Unix timestamp
  - [ ] `now()` - Current time
  - [ ] `today()` - Today at midnight
  - [ ] Input type detection and parsing

## Phase 3: Parsing

### 3.1 Parse Module
- [ ] Create `src/core/parse.ts`
  - [ ] `parse()` - Main parse function with format
  - [ ] ISO 8601 parser
  - [ ] Common format parsers (DD/MM/YYYY, etc.)
  - [ ] Natural language parser
  - [ ] TimeObject parser
  - [ ] Array parser
  - [ ] Strict mode validation
  - [ ] `isValid()` function

## Phase 4: Formatting

### 4.1 Format Module
- [ ] Create `src/core/format.ts`
  - [ ] `format()` - Main format method
  - [ ] Token replacement engine
  - [ ] All format tokens (YYYY, MM, DD, etc.)
  - [ ] Ordinal suffixes (1st, 2nd, 3rd)
  - [ ] Month/day name lookup
  - [ ] Escaped text handling
  - [ ] Timezone formatting

## Phase 5: Manipulation

### 5.1 Add/Subtract
- [ ] Create `src/manipulation/add.ts`
  - [ ] Time unit normalization
  - [ ] Millisecond conversion
  - [ ] `add()` method implementation
  - [ ] `subtract()` method implementation

### 5.2 Setters
- [ ] Create `src/manipulation/set.ts`
  - [ ] `setYear()` method
  - [ ] `setMonth()` method
  - [ ] `setDate()` method
  - [ ] `setHour()` method
  - [ ] `setMinute()` method
  - [ ] `setSecond()` method
  - [ ] `setMillisecond()` method
  - [ ] `set(unit, value)` - Generic setter
  - [ ] `set(object)` - Set multiple

### 5.3 Start/End
- [ ] Create `src/manipulation/startend.ts`
  - [ ] `startOf()` method for all units
  - [ ] `endOf()` method for all units

## Phase 6: Comparison

### 6.1 Compare Module
- [ ] Create `src/comparison/compare.ts`
  - [ ] `isBefore()` method
  - [ ] `isAfter()` method
  - [ ] `isSame()` method
  - [ ] `isSameOrBefore()` method
  - [ ] `isSameOrAfter()` method
  - [ ] `isBetween()` method with inclusivity

### 6.2 Diff Module
- [ ] Create `src/comparison/diff.ts`
  - [ ] `diff()` method implementation
  - [ ] Unit-based calculation
  - [ ] Precise mode

### 6.3 Queries Module
- [ ] Create `src/comparison/queries.ts`
  - [ ] `isToday()` method
  - [ ] `isTomorrow()` method
  - [ ] `isYesterday()` method
  - [ ] `isThisWeek()` method
  - [ ] `isThisMonth()` method
  - [ ] `isThisYear()` method
  - [ ] `isWeekend()` method
  - [ ] `isWeekday()` method
  - [ ] `isLeapYear()` method
  - [ ] `isValid()` method
  - [ ] `isDST()` method
  - [ ] `daysInMonth()` method
  - [ ] `daysInYear()` method
  - [ ] `weeksInYear()` method
  - [ ] `weekOfYear()` method
  - [ ] `dayOfYear()` method
  - [ ] `quarter()` method

## Phase 7: Relative Time

### 7.1 Relative Module
- [ ] Create `src/relative/relative.ts`
  - [ ] `fromNow()` method
  - [ ] `toNow()` method
  - [ ] `from()` method
  - [ ] `to()` method
  - [ ] Threshold-based unit selection
  - [ ] Suffix handling

### 7.2 Labels Module
- [ ] Create `src/relative/labels.ts`
  - [ ] Default English labels
  - [ ] Label function support
  - [ ] Custom label registration

## Phase 8: Duration

### 8.1 Duration Class
- [ ] Create `src/duration/duration.ts`
  - [ ] Duration class with millisecond storage
  - [ ] `clone()` method
  - [ ] `toISOString()` method
  - [ ] `toJSON()` method
  - [ ] `isValid()` method

### 8.2 Duration Getters
- [ ] Implement component getters
  - [ ] `years()`, `months()`, `weeks()`, `days()`
  - [ ] `hours()`, `minutes()`, `seconds()`, `milliseconds()`
  - [ ] `asYears()`, `asMonths()`, `asWeeks()`, `asDays()`
  - [ ] `asHours()`, `asMinutes()`, `asSeconds()`, `asMilliseconds()`

### 8.3 Duration Factory
- [ ] `createDuration()` function
  - [ ] From milliseconds (number)
  - [ ] From DurationObject
  - [ ] From ISO 8601 string

### 8.4 Duration Manipulation
- [ ] `add()` method
- [ ] `subtract()` method

### 8.5 Duration Formatting
- [ ] Create `src/duration/format.ts`
  - [ ] `format()` method
  - [ ] Template-based formatting
  - [ ] `formatDuration()` utility

### 8.6 Duration Humanize
- [ ] Create `src/duration/humanize.ts`
  - [ ] `humanize()` method
  - [ ] `humanizeDuration()` utility
  - [ ] Threshold-based selection

## Phase 9: Timezone

### 9.1 Timezone Module
- [ ] Create `src/timezone/timezone.ts`
  - [ ] `tz()` method for timezone conversion
  - [ ] `timezone()` getter
  - [ ] `utcOffset()` getter/setter
  - [ ] `getTimezones()` utility
  - [ ] `getTimezoneOffset()` utility
  - [ ] `createTimeInZone()` factory

### 9.2 UTC Module
- [ ] Create `src/timezone/utc.ts`
  - [ ] `utc()` method
  - [ ] `local()` method

### 9.3 Timezone Data
- [ ] Create `src/timezone/data.ts`
  - [ ] IANA timezone list
  - [ ] Offset calculation utilities

## Phase 10: Calendar

### 10.1 Calendar Module
- [ ] Create `src/calendar/calendar.ts`
  - [ ] `getCalendar()` - Simple 2D grid
  - [ ] `getMonthCalendar()` - Full calendar with metadata
  - [ ] `getWeekCalendar()` - Week view

### 10.2 Month Utilities
- [ ] Create `src/calendar/month.ts`
  - [ ] `getDaysInMonth()` utility
  - [ ] `getFirstDayOfMonth()` utility
  - [ ] `getLastDayOfMonth()` utility

### 10.3 Week Utilities
- [ ] Create `src/calendar/week.ts`
  - [ ] `getFirstDayOfWeek()` utility
  - [ ] `getWeeksInYear()` utility
  - [ ] Week calculation helpers

## Phase 11: Conversion Methods

### 11.1 Time Conversion
- [ ] Add conversion methods to Time class
  - [ ] `toDate()` - To native Date
  - [ ] `toTimestamp()` - To milliseconds
  - [ ] `toUnix()` - To Unix seconds
  - [ ] `toArray()` - To array [y, M, d, h, m, s, ms]
  - [ ] `toObject()` - To TimeObject

## Phase 12: React Integration

### 12.1 React Foundation
- [ ] Create `src/adapters/react/context.ts`
  - [ ] TimeContext definition
  - [ ] Context value interface

### 12.2 TimeProvider
- [ ] Create `src/adapters/react/TimeProvider.tsx`
  - [ ] Provider component
  - [ ] Config merging
  - [ ] Export context

### 12.3 React Hooks
- [ ] Create `src/adapters/react/hooks/useTime.ts`
  - [ ] Core utilities hook

- [ ] Create `src/adapters/react/hooks/useNow.ts`
  - [ ] Live updating time
  - [ ] Interval support
  - [ ] Format option

- [ ] Create `src/adapters/react/hooks/useCountdown.ts`
  - [ ] Countdown logic
  - [ ] Pause/resume
  - [ ] Callbacks

- [ ] Create `src/adapters/react/hooks/useStopwatch.ts`
  - [ ] Stopwatch logic
  - [ ] Lap tracking
  - [ ] Format option

- [ ] Create `src/adapters/react/hooks/useRelativeTime.ts`
  - [ ] Auto-updating relative time
  - [ ] Threshold option

- [ ] Create `src/adapters/react/hooks/useCalendar.ts`
  - [ ] Calendar state
  - [ ] Navigation methods
  - [ ] Selection handling

### 12.4 React Components
- [ ] Create `src/adapters/react/components/TimeAgo.tsx`
  - [ ] Relative time display
  - [ ] Auto-update

- [ ] Create `src/adapters/react/components/Countdown.tsx`
  - [ ] Countdown display
  - [ ] Render prop support

- [ ] Create `src/adapters/react/components/Clock.tsx`
  - [ ] Live clock
  - [ ] Timezone support

- [ ] Create `src/adapters/react/components/Calendar.tsx`
  - [ ] Interactive calendar
  - [ ] Day rendering

- [ ] Create `src/adapters/react/components/DatePicker.tsx`
  - [ ] Date selection
  - [ ] Range support

### 12.5 React Exports
- [ ] Create `src/adapters/react/index.ts`
  - [ ] Export all hooks
  - [ ] Export all components
  - [ ] Export Provider

## Phase 13: Main Exports

### 13.1 Core Exports
- [ ] Create `src/index.ts`
  - [ ] Export factory functions
  - [ ] Export Time class
  - [ ] Export Duration
  - [ ] Export all utility functions
  - [ ] Export types
  - [ ] Export configure functions

## Phase 14: Testing

### 14.1 Unit Tests - Core
- [ ] `tests/unit/core/time.test.ts`
- [ ] `tests/unit/core/create.test.ts`
- [ ] `tests/unit/core/parse.test.ts`
- [ ] `tests/unit/core/format.test.ts`
- [ ] `tests/unit/core/config.test.ts`

### 14.2 Unit Tests - Manipulation
- [ ] `tests/unit/manipulation/add.test.ts`
- [ ] `tests/unit/manipulation/set.test.ts`
- [ ] `tests/unit/manipulation/startend.test.ts`

### 14.3 Unit Tests - Comparison
- [ ] `tests/unit/comparison/compare.test.ts`
- [ ] `tests/unit/comparison/diff.test.ts`
- [ ] `tests/unit/comparison/queries.test.ts`

### 14.4 Unit Tests - Relative
- [ ] `tests/unit/relative/relative.test.ts`
- [ ] `tests/unit/relative/labels.test.ts`

### 14.5 Unit Tests - Duration
- [ ] `tests/unit/duration/duration.test.ts`
- [ ] `tests/unit/duration/format.test.ts`
- [ ] `tests/unit/duration/humanize.test.ts`

### 14.6 Unit Tests - Timezone
- [ ] `tests/unit/timezone/timezone.test.ts`
- [ ] `tests/unit/timezone/utc.test.ts`

### 14.7 Unit Tests - Calendar
- [ ] `tests/unit/calendar/calendar.test.ts`
- [ ] `tests/unit/calendar/month.test.ts`
- [ ] `tests/unit/calendar/week.test.ts`

### 14.8 Integration Tests
- [ ] `tests/integration/time.test.ts`
- [ ] `tests/integration/duration.test.ts`
- [ ] `tests/integration/timezone.test.ts`
- [ ] `tests/integration/react.test.tsx`

### 14.9 Coverage Verification
- [ ] Run coverage report
- [ ] Verify 100% coverage
- [ ] Add missing tests

## Phase 15: Build & Release

### 15.1 Build Verification
- [ ] Run `npm run build`
- [ ] Verify ESM output
- [ ] Verify CJS output
- [ ] Verify type declarations
- [ ] Check bundle size

### 15.2 Type Check
- [ ] Run `npm run typecheck`
- [ ] Fix any type errors

### 15.3 Lint
- [ ] Run `npm run lint`
- [ ] Fix any lint errors

### 15.4 Test
- [ ] Run `npm run test`
- [ ] Ensure all tests pass
- [ ] Run `npm run test:coverage`
- [ ] Verify 100% coverage

### 15.5 Documentation
- [ ] Update README.md if needed
- [ ] Verify all examples work
- [ ] Create website (separate phase)

## Dependencies Between Phases

- Phase 1 must complete before any other phase
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 depends on Phase 2
- Phase 5 depends on Phase 2
- Phase 6 depends on Phase 2
- Phase 7 depends on Phase 2, 6
- Phase 8 is independent (after Phase 1)
- Phase 9 depends on Phase 2
- Phase 10 depends on Phase 2
- Phase 11 depends on Phase 2
- Phase 12 depends on Phase 2, 13
- Phase 13 depends on all previous
- Phase 14 depends on implementation
- Phase 15 depends on all previous
