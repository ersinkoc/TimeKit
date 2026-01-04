# TimeKit - Package Specification

## 1. Overview

**Package Name**: `@oxog/timekit`
**Version**: 0.0.1
**License**: MIT
**Author**: Ersin KOÇ
**Repository**: https://github.com/ersinkoc/timekit
**Documentation**: https://timekit.oxog.dev

TimeKit is a zero-dependency, lightweight JavaScript library for date/time formatting, manipulation, and timezone support.

## 2. Design Principles

### 2.1 Zero Dependencies
- **Runtime dependencies**: NONE
- All functionality implemented from scratch
- No external libraries

### 2.2 Immutable Operations
- All methods return new instances
- Original Time objects never modified
- Predictable behavior

### 2.3 Chainable API
- All Time methods return Time instances
- All Duration methods return Duration instances
- Fluent, readable code

### 2.4 TypeScript First
- Full type definitions
- Strict mode enabled
- No `any` types

### 2.5 Tree-Shakeable
- ESM modules
- Named exports
- Minimal bundle size

## 3. Core Types

### 3.1 TimeInput
Accepts multiple input types for date/time creation:
- `Time` instance
- `Date` object
- ISO 8601 string
- Unix timestamp (milliseconds)
- `TimeObject` with components
- `null` or `undefined` (treated as current time)

### 3.2 TimeUnit
Normalizable time units:
- Long form: `year`, `month`, `week`, `day`, `hour`, `minute`, `second`, `millisecond`
- Plural forms: `years`, `months`, etc.
- Short forms: `y`, `M`, `w`, `d`, `h`, `m`, `s`, `ms`

### 3.3 Time Interface
The main Time interface with:
- **Getters**: year, month, date, day, hour, minute, second, millisecond
- **Setters**: setYear, setMonth, setDate, setHour, setMinute, setSecond, setMillisecond
- **Manipulation**: add, subtract, startOf, endOf
- **Formatting**: format, toISOString, toJSON, toString, toLocaleString
- **Relative**: fromNow, from, toNow, to
- **Comparison**: isBefore, isAfter, isSame, isSameOrBefore, isSameOrAfter, isBetween
- **Queries**: isToday, isTomorrow, isYesterday, isThisWeek, isThisMonth, isThisYear, isWeekend, isWeekday, isLeapYear, isValid, isDST
- **Difference**: diff
- **Calendar**: daysInMonth, daysInYear, weeksInYear, weekOfYear, dayOfYear, quarter
- **Timezone**: utc, local, tz, utcOffset, timezone
- **Conversion**: toDate, toTimestamp, toUnix, toArray, toObject, valueOf
- **Clone**: clone

### 3.4 Duration Interface
Duration representation with:
- **Component getters**: years, months, weeks, days, hours, minutes, seconds, milliseconds
- **Total getters**: asYears, asMonths, asWeeks, asDays, asHours, asMinutes, asSeconds, asMilliseconds
- **Manipulation**: add, subtract
- **Formatting**: format, humanize, toISOString, toJSON
- **Conversion**: toObject
- **Queries**: isValid
- **Clone**: clone

### 3.5 Calendar Types
- `CalendarDay`: Single day with metadata
- `CalendarWeek`: Array of days with week number
- `CalendarMonth`: Array of weeks for a month

## 4. Format Tokens

### 4.1 Year
- `YYYY` - 4-digit year (2025)
- `YY` - 2-digit year (25)

### 4.2 Month
- `MMMM` - Full month name (December)
- `MMM` - Abbreviated (Dec)
- `MM` - 2-digit (01-12)
- `M` - (1-12)

### 4.3 Day of Month
- `DD` - 2-digit (01-31)
- `D` - (1-31)
- `Do` - With ordinal (1st, 2nd, 3rd)

### 4.4 Day of Week
- `dddd` - Full name (Tuesday)
- `ddd` - Abbreviated (Tue)
- `dd` - 2-letter (Tu)
- `d` - (0-6, Sunday=0)
- `E` - ISO (1-7, Monday=1)

### 4.5 Hour
- `HH` - 24-hour 2-digit (00-23)
- `H` - 24-hour (0-23)
- `hh` - 12-hour 2-digit (01-12)
- `h` - 12-hour (1-12)

### 4.6 Minute
- `mm` - 2-digit (00-59)
- `m` - (0-59)

### 4.7 Second
- `ss` - 2-digit (00-59)
- `s` - (0-59)

### 4.8 Millisecond
- `SSS` - 3-digit (000-999)
- `SS` - 2-digit (00-99)
- `S` - (0-9)

### 4.9 AM/PM
- `A` - Uppercase (AM/PM)
- `a` - Lowercase (am/pm)

### 4.10 Timezone
- `Z` - Offset with colon (+03:00)
- `ZZ` - Offset without colon (+0300)
- `z` - Abbreviation (EET)
- `zzz` - Full name (Eastern European Time)

### 4.11 Timestamp
- `X` - Unix seconds
- `x` - Unix milliseconds

### 4.12 Quarter/Week
- `Q` - Quarter (1-4)
- `Qo` - Quarter with ordinal (1st)
- `W` - Week of year (1-53)
- `WW` - Week 2-digit (01-53)
- `Wo` - Week with ordinal (1st)

### 4.13 Day of Year
- `DDD` - Day of year (1-366)
- `DDDD` - Day 3-digit (001-366)

### 4.14 Escaping
- Text in square brackets is escaped: `[Today is] dddd`

## 5. Parsing Rules

### 5.1 Auto-Detection
Priority order for string parsing:
1. ISO 8601 with timezone
2. ISO 8601 without timezone
3. Common formats (DD/MM/YYYY, MM/DD/YYYY, etc.)
4. Natural language (December 30, 2025)

### 5.2 Strict Mode
When `strict: true`:
- Invalid values produce invalid Time (not error)
- Month must be 1-12
- Day must be valid for month/year
- Hour must be 0-23
- Minute must be 0-59

### 5.3 TimeObject Parsing
- `month`: 1-12 (not 0-11 like Date)
- `date`: 1-31
- `hour`: 0-23
- Omitted fields default to:
  - year/month/date: current date
  - hour/minute/second: 0

## 6. Relative Time

### 6.1 Default Thresholds
- Seconds → Minutes: 45 seconds
- Minutes → Hours: 45 minutes
- Hours → Days: 22 hours
- Days → Months: 26 days
- Months → Years: 11 months

### 6.2 Default Labels (English)
- Future: `in %s`
- Past: `%s ago`
- `s`: `a few seconds`
- `ss`: `%d seconds`
- `m`: `a minute`
- `mm`: `%d minutes`
- `h`: `an hour`
- `hh`: `%d hours`
- `d`: `a day`
- `dd`: `%d days`
- `w`: `a week`
- `ww`: `%d weeks`
- `M`: `a month`
- `MM`: `%d months`
- `y`: `a year`
- `yy`: `%d years`

## 7. Duration Format

### 7.1 ISO 8601 Duration
- `PT1H30M` - 1 hour 30 minutes
- `P1DT2H30M` - 1 day 2 hours 30 minutes
- `P1Y2M3D` - 1 year 2 months 3 days

### 7.2 Duration Object
```typescript
{
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}
```

## 8. Timezone Handling

### 8.1 Supported Operations
- Convert to/from UTC
- Convert to IANA timezone
- Set fixed UTC offset
- Get current timezone
- Get UTC offset in minutes
- Detect DST

### 8.2 Timezone Data
- Uses native Intl API for IANA timezones
- No bundled timezone database
- Relies on browser/node timezone support

## 9. Calendar Generation

### 9.1 Week Configuration
- `weekStartsOn`: 0-6 (Sunday-Saturday)
- Default: 1 (Monday)
- Affects `startOf('week')`, calendar generation

### 9.2 Week Numbering
- ISO 8601 week numbering
- First week contains first Thursday
- `firstWeekContainsDate`: 4 (ISO standard)

## 10. React Integration

### 10.1 Hooks
- `useTime` - Core time utilities
- `useNow` - Live updating current time
- `useCountdown` - Countdown to target
- `useStopwatch` - Stopwatch with laps
- `useRelativeTime` - Auto-updating relative time
- `useCalendar` - Calendar state management

### 10.2 Components
- `TimeAgo` - Relative time display
- `Countdown` - Countdown timer
- `Clock` - Live clock display
- `Calendar` - Interactive calendar
- `DatePicker` - Date selection

### 10.3 Provider
- `TimeProvider` - Context for configuration
- Merges with global config
- Optional for usage

## 11. Bundle Size Targets

- **Core**: < 3KB minified + gzipped
- **React**: < 5KB minified + gzipped (including core)
- **Tree-shakeable**: All features

## 12. Testing Requirements

- **Coverage**: 100% lines, branches, functions, statements
- **Framework**: Vitest
- **Test Types**:
  - Unit tests for each module
  - Integration tests for workflows
  - Edge case coverage
  - Timezone test cases

## 13. API Compatibility

### 13.1 Similar Libraries
- Inspired by Day.js, date-fns
- Not drop-in compatible
- Similar API patterns

### 13.2 Breaking Changes
None - initial release

## 14. Platform Support

- **Node.js**: >= 16.0.0
- **Browsers**: Modern (ES2020+)
- **React**: >= 18.0.0 (for React adapter)
