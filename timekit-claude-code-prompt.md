# TimeKit - Lightweight Date/Time Formatting and Manipulation with Timezone Support

## Package Identity

- **NPM Package**: `@oxog/timekit`
- **GitHub Repository**: `https://github.com/ersinkoc/timekit`
- **Documentation Site**: `https://timekit.oxog.dev`
- **License**: MIT
- **Author**: Ersin KOÇ
- **Created**: 2025-12-30

**NO social media, Discord, email, or external links.**

## Package Description

Zero-dependency date/time formatting and manipulation library with timezone support.

TimeKit is a lightweight, framework-agnostic library for working with dates and times in JavaScript applications. Features intuitive date formatting with customizable tokens, flexible date parsing from multiple input types, relative time formatting ("2 hours ago", "in 3 days"), date manipulation with add/subtract operations, start/end of period calculations, comprehensive date comparison methods, duration formatting and humanization, timezone conversion and handling, calendar grid generation utilities, week and quarter calculations, leap year detection, immutable operations for predictability, chainable method API, and comprehensive React integration with useTime, useNow, useCountdown, useStopwatch, useRelativeTime hooks and TimeAgo, Countdown, Clock, Calendar components—all under 3KB with zero runtime dependencies.

---

## NON-NEGOTIABLE RULES

These rules are ABSOLUTE and must be followed without exception:

### 1. ZERO DEPENDENCIES
```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```
Implement EVERYTHING from scratch. No runtime dependencies allowed.

### 2. 100% TEST COVERAGE & 100% SUCCESS RATE
- Every line of code must be tested
- Every branch must be tested
- All tests must pass (100% success rate)
- Use Vitest for testing
- Coverage report must show 100%

### 3. DEVELOPMENT WORKFLOW
Create these documents FIRST, before any code:
1. **SPECIFICATION.md** - Complete package specification
2. **IMPLEMENTATION.md** - Architecture and design decisions
3. **TASKS.md** - Ordered task list with dependencies

Only after these documents are complete, implement the code following TASKS.md sequentially.

### 4. TYPESCRIPT STRICT MODE
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### 5. NO EXTERNAL LINKS
- ❌ No social media (Twitter, LinkedIn, etc.)
- ❌ No Discord/Slack links
- ❌ No email addresses
- ❌ No donation/sponsor links
- ✅ Only GitHub repo and documentation site allowed

### 6. BUNDLE SIZE TARGET
- Core package: < 3KB minified + gzipped
- With React adapter: < 5KB
- Tree-shakeable

---

## CORE TYPES

```typescript
// ============ TIME INPUT ============

type TimeInput = Time | Date | string | number | TimeObject | null | undefined

interface TimeObject {
  year?: number
  month?: number      // 1-12
  date?: number       // 1-31
  hour?: number       // 0-23
  minute?: number     // 0-59
  second?: number     // 0-59
  millisecond?: number // 0-999
}

// ============ TIME UNIT ============

type TimeUnit =
  | 'year' | 'years' | 'y'
  | 'month' | 'months' | 'M'
  | 'week' | 'weeks' | 'w'
  | 'day' | 'days' | 'd'
  | 'hour' | 'hours' | 'h'
  | 'minute' | 'minutes' | 'm'
  | 'second' | 'seconds' | 's'
  | 'millisecond' | 'milliseconds' | 'ms'

type TimeUnitNormalized =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'

// ============ CONFIG ============

interface TimeConfig {
  // Default locale for formatting
  locale?: string
  
  // Default timezone
  timezone?: string
  
  // Week configuration
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6  // 0 = Sunday, 1 = Monday
  firstWeekContainsDate?: 1 | 4
  
  // Default formats
  formats?: {
    date?: string       // Default: 'YYYY-MM-DD'
    time?: string       // Default: 'HH:mm:ss'
    datetime?: string   // Default: 'YYYY-MM-DD HH:mm:ss'
  }
  
  // Relative time thresholds (in the respective unit)
  relativeTimeThresholds?: {
    second?: number  // Default: 45 (switch to minutes after 45 seconds)
    minute?: number  // Default: 45 (switch to hours after 45 minutes)
    hour?: number    // Default: 22 (switch to days after 22 hours)
    day?: number     // Default: 26 (switch to months after 26 days)
    month?: number   // Default: 11 (switch to years after 11 months)
  }
  
  // Relative time labels
  relativeTimeLabels?: RelativeTimeLabels
}

interface RelativeTimeLabels {
  future: string           // 'in %s'
  past: string             // '%s ago'
  s: string | RelativeTimeFn   // 'a few seconds'
  ss: string | RelativeTimeFn  // '%d seconds'
  m: string | RelativeTimeFn   // 'a minute'
  mm: string | RelativeTimeFn  // '%d minutes'
  h: string | RelativeTimeFn   // 'an hour'
  hh: string | RelativeTimeFn  // '%d hours'
  d: string | RelativeTimeFn   // 'a day'
  dd: string | RelativeTimeFn  // '%d days'
  w: string | RelativeTimeFn   // 'a week'
  ww: string | RelativeTimeFn  // '%d weeks'
  M: string | RelativeTimeFn   // 'a month'
  MM: string | RelativeTimeFn  // '%d months'
  y: string | RelativeTimeFn   // 'a year'
  yy: string | RelativeTimeFn  // '%d years'
}

type RelativeTimeFn = (value: number, withoutSuffix: boolean, key: string, isFuture: boolean) => string

// ============ TIME INSTANCE ============

interface Time {
  // ========== GETTERS ==========
  year(): number
  month(): number           // 1-12
  date(): number            // 1-31 (day of month)
  day(): number             // 0-6 (day of week, 0 = Sunday)
  hour(): number            // 0-23
  minute(): number          // 0-59
  second(): number          // 0-59
  millisecond(): number     // 0-999
  
  // Get specific unit
  get(unit: TimeUnit): number
  
  // ========== SETTERS (immutable, return new Time) ==========
  setYear(value: number): Time
  setMonth(value: number): Time
  setDate(value: number): Time
  setHour(value: number): Time
  setMinute(value: number): Time
  setSecond(value: number): Time
  setMillisecond(value: number): Time
  
  // Set specific unit
  set(unit: TimeUnit, value: number): Time
  set(values: Partial<TimeObject>): Time
  
  // ========== MANIPULATION ==========
  add(amount: number, unit: TimeUnit): Time
  subtract(amount: number, unit: TimeUnit): Time
  startOf(unit: TimeUnit): Time
  endOf(unit: TimeUnit): Time
  
  // ========== FORMATTING ==========
  format(pattern?: string): string
  toISOString(): string
  toJSON(): string
  toString(): string
  toLocaleString(locale?: string, options?: Intl.DateTimeFormatOptions): string
  
  // ========== RELATIVE TIME ==========
  fromNow(withoutSuffix?: boolean): string
  from(time: TimeInput, withoutSuffix?: boolean): string
  toNow(withoutSuffix?: boolean): string
  to(time: TimeInput, withoutSuffix?: boolean): string
  
  // ========== COMPARISON ==========
  isBefore(time: TimeInput, unit?: TimeUnit): boolean
  isAfter(time: TimeInput, unit?: TimeUnit): boolean
  isSame(time: TimeInput, unit?: TimeUnit): boolean
  isSameOrBefore(time: TimeInput, unit?: TimeUnit): boolean
  isSameOrAfter(time: TimeInput, unit?: TimeUnit): boolean
  isBetween(
    start: TimeInput,
    end: TimeInput,
    unit?: TimeUnit,
    inclusivity?: '()' | '[]' | '[)' | '(]'
  ): boolean
  
  // ========== QUERIES ==========
  isToday(): boolean
  isTomorrow(): boolean
  isYesterday(): boolean
  isThisWeek(): boolean
  isThisMonth(): boolean
  isThisYear(): boolean
  isWeekend(): boolean
  isWeekday(): boolean
  isLeapYear(): boolean
  isValid(): boolean
  isDST(): boolean
  
  // ========== DIFFERENCE ==========
  diff(time: TimeInput, unit?: TimeUnit, precise?: boolean): number
  
  // ========== CALENDAR INFO ==========
  daysInMonth(): number
  daysInYear(): number
  weeksInYear(): number
  weekOfYear(): number
  dayOfYear(): number
  quarter(): number
  
  // ========== TIMEZONE ==========
  utc(): Time
  local(): Time
  tz(timezone: string): Time
  utcOffset(): number
  utcOffset(offset: number | string): Time
  timezone(): string
  
  // ========== CONVERSION ==========
  toDate(): Date
  toTimestamp(): number
  toUnix(): number
  toArray(): [number, number, number, number, number, number, number]
  toObject(): TimeObject
  valueOf(): number
  
  // ========== CLONE ==========
  clone(): Time
}

// ============ DURATION ============

interface Duration {
  // Getters (component values)
  years(): number
  months(): number
  weeks(): number
  days(): number
  hours(): number
  minutes(): number
  seconds(): number
  milliseconds(): number
  
  // Total in specific unit
  asYears(): number
  asMonths(): number
  asWeeks(): number
  asDays(): number
  asHours(): number
  asMinutes(): number
  asSeconds(): number
  asMilliseconds(): number
  
  // Manipulation
  add(amount: number, unit: TimeUnit): Duration
  add(duration: DurationInput): Duration
  subtract(amount: number, unit: TimeUnit): Duration
  subtract(duration: DurationInput): Duration
  
  // Formatting
  format(template?: string): string
  humanize(withSuffix?: boolean): string
  toISOString(): string
  toJSON(): string
  
  // Conversion
  toObject(): DurationObject
  
  // Queries
  isValid(): boolean
  
  // Clone
  clone(): Duration
}

interface DurationObject {
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

type DurationInput = Duration | DurationObject | string | number

// ============ CALENDAR ============

interface CalendarDay {
  date: number
  time: Time
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  isSelected?: boolean
  isDisabled?: boolean
}

interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
}

interface CalendarMonth {
  year: number
  month: number
  weeks: CalendarWeek[]
}

interface CalendarOptions {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  showWeekNumbers?: boolean
  minDate?: TimeInput
  maxDate?: TimeInput
  disabledDates?: TimeInput[]
  selectedDate?: TimeInput
}
```

---

## FACTORY FUNCTION

```typescript
import { createTime, now, today } from '@oxog/timekit'

// ===== CREATE FROM VARIOUS INPUTS =====

// Current time
const t1 = createTime()
const t2 = now()

// ISO string
const t3 = createTime('2025-12-30')
const t4 = createTime('2025-12-30T14:30:00')
const t5 = createTime('2025-12-30T14:30:00+03:00')

// Timestamp (milliseconds)
const t6 = createTime(1735567200000)

// Unix timestamp (seconds)
const t7 = createTime.unix(1735567200)

// Date object
const t8 = createTime(new Date())

// Object
const t9 = createTime({
  year: 2025,
  month: 12,
  date: 30,
  hour: 14,
  minute: 30,
})

// Array [year, month, date, hour, minute, second, ms]
const t10 = createTime([2025, 12, 30, 14, 30, 0, 0])

// Today at midnight
const t11 = today()


// ===== GLOBAL CONFIGURATION =====

import { configure, setDefaultTimezone, setDefaultLocale } from '@oxog/timekit'

configure({
  locale: 'tr',
  timezone: 'Europe/Istanbul',
  weekStartsOn: 1, // Monday
  formats: {
    date: 'DD.MM.YYYY',
    time: 'HH:mm',
    datetime: 'DD.MM.YYYY HH:mm',
  },
})

// Or individually
setDefaultTimezone('Europe/Istanbul')
setDefaultLocale('tr')
```

---

## FORMATTING

```typescript
import { createTime } from '@oxog/timekit'

const t = createTime('2025-12-30T14:30:45.123')


// ============ YEAR TOKENS ============

t.format('YYYY')    // '2025' - 4-digit year
t.format('YY')      // '25'   - 2-digit year


// ============ MONTH TOKENS ============

t.format('MMMM')    // 'December' - Full month name
t.format('MMM')     // 'Dec'      - Abbreviated month name
t.format('MM')      // '12'       - 2-digit month (01-12)
t.format('M')       // '12'       - Month (1-12)


// ============ DAY OF MONTH TOKENS ============

t.format('DD')      // '30'   - 2-digit day (01-31)
t.format('D')       // '30'   - Day (1-31)
t.format('Do')      // '30th' - Day with ordinal


// ============ DAY OF WEEK TOKENS ============

t.format('dddd')    // 'Tuesday' - Full day name
t.format('ddd')     // 'Tue'     - Abbreviated day name
t.format('dd')      // 'Tu'      - 2-letter day name
t.format('d')       // '2'       - Day of week (0-6, 0 = Sunday)
t.format('E')       // '2'       - ISO day of week (1-7, 1 = Monday)


// ============ HOUR TOKENS ============

t.format('HH')      // '14' - 24-hour, 2-digit (00-23)
t.format('H')       // '14' - 24-hour (0-23)
t.format('hh')      // '02' - 12-hour, 2-digit (01-12)
t.format('h')       // '2'  - 12-hour (1-12)


// ============ MINUTE TOKENS ============

t.format('mm')      // '30' - 2-digit (00-59)
t.format('m')       // '30' - (0-59)


// ============ SECOND TOKENS ============

t.format('ss')      // '45' - 2-digit (00-59)
t.format('s')       // '45' - (0-59)


// ============ MILLISECOND TOKENS ============

t.format('SSS')     // '123' - 3-digit (000-999)
t.format('SS')      // '12'  - 2-digit (00-99)
t.format('S')       // '1'   - (0-9)


// ============ AM/PM TOKENS ============

t.format('A')       // 'PM' - Uppercase
t.format('a')       // 'pm' - Lowercase


// ============ TIMEZONE TOKENS ============

t.format('Z')       // '+03:00' - Offset with colon
t.format('ZZ')      // '+0300'  - Offset without colon
t.format('z')       // 'EET'    - Timezone abbreviation
t.format('zzz')     // 'Eastern European Time' - Full timezone name


// ============ TIMESTAMP TOKENS ============

t.format('X')       // '1735562445'    - Unix seconds
t.format('x')       // '1735562445123' - Unix milliseconds


// ============ QUARTER & WEEK TOKENS ============

t.format('Q')       // '4'  - Quarter (1-4)
t.format('Qo')      // '4th' - Quarter with ordinal
t.format('W')       // '1'  - Week of year (1-53)
t.format('WW')      // '01' - Week of year, 2-digit
t.format('Wo')      // '1st' - Week with ordinal


// ============ DAY OF YEAR TOKEN ============

t.format('DDD')     // '364' - Day of year (1-366)
t.format('DDDD')    // '364' - Day of year, 3-digit


// ============ COMMON PATTERNS ============

t.format('YYYY-MM-DD')                    // '2025-12-30'
t.format('DD/MM/YYYY')                    // '30/12/2025'
t.format('MM/DD/YYYY')                    // '12/30/2025'
t.format('YYYY-MM-DD HH:mm:ss')           // '2025-12-30 14:30:45'
t.format('YYYY-MM-DDTHH:mm:ssZ')          // '2025-12-30T14:30:45+03:00'
t.format('ddd, DD MMM YYYY HH:mm:ss ZZ')  // 'Tue, 30 Dec 2025 14:30:45 +0300'
t.format('MMMM D, YYYY')                  // 'December 30, 2025'
t.format('dddd, MMMM D, YYYY')            // 'Tuesday, December 30, 2025'
t.format('h:mm A')                        // '2:30 PM'
t.format('h:mm:ss a')                     // '2:30:45 pm'


// ============ ESCAPE CHARACTERS ============

t.format('[Today is] dddd')               // 'Today is Tuesday'
t.format('YYYY [yılı] MMMM [ayı]')        // '2025 yılı December ayı'
t.format('[Week] W [of] YYYY')            // 'Week 1 of 2025'


// ============ LOCALE-AWARE FORMATTING ============

t.toLocaleString('en-US', { dateStyle: 'full' })
// 'Tuesday, December 30, 2025'

t.toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })
// '30 Aralık 2025 14:30'
```

---

## PARSING

```typescript
import { createTime, parse, isValid } from '@oxog/timekit'


// ============ ISO 8601 (AUTO-DETECTED) ============

createTime('2025-12-30')
createTime('2025-12-30T14:30:00')
createTime('2025-12-30T14:30:00.123')
createTime('2025-12-30T14:30:00Z')
createTime('2025-12-30T14:30:00+03:00')
createTime('2025-12-30T14:30:00-05:00')


// ============ COMMON FORMATS (AUTO-DETECTED) ============

createTime('30/12/2025')           // DD/MM/YYYY
createTime('12/30/2025')           // MM/DD/YYYY (US)
createTime('30-12-2025')           // DD-MM-YYYY
createTime('December 30, 2025')    // MMMM D, YYYY
createTime('30 Dec 2025')          // D MMM YYYY


// ============ WITH EXPLICIT FORMAT ============

parse('30.12.2025', 'DD.MM.YYYY')
parse('2025/12/30', 'YYYY/MM/DD')
parse('30-Dec-2025 14:30', 'DD-MMM-YYYY HH:mm')
parse('12:30 PM', 'h:mm A')
parse('14:30:45', 'HH:mm:ss')


// ============ STRICT MODE ============

parse('2025-13-45', 'YYYY-MM-DD', { strict: true })
// Returns invalid Time (month 13, day 45 don't exist)


// ============ VALIDATION ============

const t = createTime('invalid')
t.isValid()  // false

const t2 = createTime('2025-12-30')
t2.isValid() // true

// Standalone validation
isValid('2025-12-30')           // true
isValid('2025-13-45')           // false
isValid('not a date')           // false
isValid(1735567200000)          // true
isValid(new Date())             // true
isValid(new Date('invalid'))    // false
```

---

## RELATIVE TIME

```typescript
import { createTime, now } from '@oxog/timekit'

// Assume current time: 2025-12-30T14:30:00


// ============ FROM NOW ============

createTime('2025-12-30T14:29:30').fromNow()  // 'a few seconds ago'
createTime('2025-12-30T14:25:00').fromNow()  // '5 minutes ago'
createTime('2025-12-30T12:30:00').fromNow()  // '2 hours ago'
createTime('2025-12-29T14:30:00').fromNow()  // 'a day ago'
createTime('2025-12-28T14:30:00').fromNow()  // '2 days ago'
createTime('2025-12-23T14:30:00').fromNow()  // 'a week ago'
createTime('2025-11-30T14:30:00').fromNow()  // 'a month ago'
createTime('2024-12-30T14:30:00').fromNow()  // 'a year ago'


// ============ TO NOW ============

createTime('2025-12-30T14:35:00').toNow()    // 'in 5 minutes'
createTime('2025-12-31T14:30:00').toNow()    // 'in a day'
createTime('2026-01-01T00:00:00').toNow()    // 'in 2 days'
createTime('2026-01-30T14:30:00').toNow()    // 'in a month'
createTime('2026-12-30T14:30:00').toNow()    // 'in a year'


// ============ WITHOUT SUFFIX ============

createTime('2025-12-28T14:30:00').fromNow(true)  // '2 days'
createTime('2025-12-31T14:30:00').toNow(true)    // 'a day'


// ============ FROM / TO SPECIFIC TIME ============

const start = createTime('2025-12-01')
const end = createTime('2025-12-30')

start.from(end)           // '29 days ago'
start.from(end, true)     // '29 days'
start.to(end)             // 'in 29 days'
start.to(end, true)       // '29 days'


// ============ RELATIVE TIME OUTPUTS ============

/*
Seconds:
  - 'a few seconds ago' / 'in a few seconds'
  - 'X seconds ago' / 'in X seconds'

Minutes:
  - 'a minute ago' / 'in a minute'
  - 'X minutes ago' / 'in X minutes'

Hours:
  - 'an hour ago' / 'in an hour'
  - 'X hours ago' / 'in X hours'

Days:
  - 'a day ago' / 'in a day'
  - 'X days ago' / 'in X days'

Weeks:
  - 'a week ago' / 'in a week'
  - 'X weeks ago' / 'in X weeks'

Months:
  - 'a month ago' / 'in a month'
  - 'X months ago' / 'in X months'

Years:
  - 'a year ago' / 'in a year'
  - 'X years ago' / 'in X years'
*/


// ============ CUSTOM THRESHOLDS ============

import { configure } from '@oxog/timekit'

configure({
  relativeTimeThresholds: {
    second: 60,   // Use seconds up to 60 seconds
    minute: 60,   // Use minutes up to 60 minutes
    hour: 24,     // Use hours up to 24 hours
    day: 30,      // Use days up to 30 days
    month: 12,    // Use months up to 12 months
  },
})
```

---

## MANIPULATION

```typescript
import { createTime } from '@oxog/timekit'

const t = createTime('2025-12-30T14:30:00')


// ============ ADD ============

t.add(1, 'second')       // 2025-12-30 14:30:01
t.add(30, 'minutes')     // 2025-12-30 15:00:00
t.add(2, 'hours')        // 2025-12-30 16:30:00
t.add(1, 'day')          // 2025-12-31 14:30:00
t.add(1, 'week')         // 2026-01-06 14:30:00
t.add(1, 'month')        // 2026-01-30 14:30:00
t.add(1, 'year')         // 2026-12-30 14:30:00

// Short aliases
t.add(1, 's')            // second
t.add(1, 'm')            // minute
t.add(1, 'h')            // hour
t.add(1, 'd')            // day
t.add(1, 'w')            // week
t.add(1, 'M')            // month
t.add(1, 'y')            // year


// ============ SUBTRACT ============

t.subtract(1, 'day')     // 2025-12-29 14:30:00
t.subtract(1, 'week')    // 2025-12-23 14:30:00
t.subtract(1, 'month')   // 2025-11-30 14:30:00
t.subtract(1, 'year')    // 2024-12-30 14:30:00


// ============ START OF ============

t.startOf('year')        // 2025-01-01 00:00:00.000
t.startOf('month')       // 2025-12-01 00:00:00.000
t.startOf('week')        // 2025-12-29 00:00:00.000 (Monday)
t.startOf('day')         // 2025-12-30 00:00:00.000
t.startOf('hour')        // 2025-12-30 14:00:00.000
t.startOf('minute')      // 2025-12-30 14:30:00.000
t.startOf('second')      // 2025-12-30 14:30:00.000


// ============ END OF ============

t.endOf('year')          // 2025-12-31 23:59:59.999
t.endOf('month')         // 2025-12-31 23:59:59.999
t.endOf('week')          // 2026-01-04 23:59:59.999 (Sunday)
t.endOf('day')           // 2025-12-30 23:59:59.999
t.endOf('hour')          // 2025-12-30 14:59:59.999
t.endOf('minute')        // 2025-12-30 14:30:59.999


// ============ SETTERS ============

t.setYear(2026)          // 2026-12-30 14:30:00
t.setMonth(6)            // 2025-06-30 14:30:00
t.setDate(15)            // 2025-12-15 14:30:00
t.setHour(9)             // 2025-12-30 09:30:00
t.setMinute(0)           // 2025-12-30 14:00:00
t.setSecond(30)          // 2025-12-30 14:30:30

// Set multiple
t.set({ year: 2026, month: 1, date: 1 })  // 2026-01-01 14:30:00

// Generic setter
t.set('year', 2026)      // 2026-12-30 14:30:00


// ============ CHAINING ============

t.add(1, 'month')
 .subtract(5, 'days')
 .startOf('day')
 .format('YYYY-MM-DD')   // '2026-01-25'

createTime()
 .startOf('month')
 .add(1, 'week')
 .endOf('day')
 .format('YYYY-MM-DD HH:mm:ss')


// ============ IMMUTABILITY ============

const original = createTime('2025-12-30')
const modified = original.add(1, 'day')

original.format('D')     // '30' (unchanged)
modified.format('D')     // '31' (new instance)
```

---

## COMPARISON

```typescript
import { createTime } from '@oxog/timekit'

const t1 = createTime('2025-12-30T10:00:00')
const t2 = createTime('2025-12-30T14:00:00')
const t3 = createTime('2025-12-31T10:00:00')


// ============ IS BEFORE ============

t1.isBefore(t2)                  // true
t1.isBefore(t3)                  // true
t2.isBefore(t1)                  // false

// With unit precision
t1.isBefore(t2, 'day')           // false (same day)
t1.isBefore(t3, 'day')           // true
t1.isBefore(t2, 'hour')          // true


// ============ IS AFTER ============

t2.isAfter(t1)                   // true
t3.isAfter(t1)                   // true
t1.isAfter(t2)                   // false

t2.isAfter(t1, 'day')            // false (same day)
t3.isAfter(t1, 'day')            // true


// ============ IS SAME ============

t1.isSame(t2)                    // false
t1.isSame(t2, 'day')             // true (same day)
t1.isSame(t2, 'month')           // true
t1.isSame(t3, 'month')           // true
t1.isSame(t3, 'day')             // false


// ============ IS SAME OR BEFORE / AFTER ============

t1.isSameOrBefore(t1)            // true
t1.isSameOrBefore(t2)            // true
t2.isSameOrBefore(t1)            // false

t1.isSameOrAfter(t1)             // true
t2.isSameOrAfter(t1)             // true
t1.isSameOrAfter(t2)             // false


// ============ IS BETWEEN ============

const start = createTime('2025-12-01')
const end = createTime('2025-12-31')
const middle = createTime('2025-12-15')

middle.isBetween(start, end)                // true
start.isBetween(start, end)                 // false (exclusive by default)
end.isBetween(start, end)                   // false

// Inclusivity
start.isBetween(start, end, undefined, '[]')  // true (both inclusive)
start.isBetween(start, end, undefined, '[)')  // true (start inclusive)
end.isBetween(start, end, undefined, '(]')    // true (end inclusive)
start.isBetween(start, end, undefined, '()')  // false (both exclusive)

// With unit
middle.isBetween(start, end, 'month')       // true


// ============ QUERIES ============

const today = createTime()

today.isToday()          // true
today.isTomorrow()       // false
today.isYesterday()      // false
today.isThisWeek()       // true
today.isThisMonth()      // true
today.isThisYear()       // true
today.isWeekend()        // depends on day
today.isWeekday()        // depends on day
today.isLeapYear()       // false (2025)
today.isValid()          // true
today.isDST()            // depends on timezone

createTime('2024-02-29').isLeapYear()  // true


// ============ DIFFERENCE ============

const a = createTime('2025-12-01T10:00:00')
const b = createTime('2025-12-30T14:30:00')

b.diff(a, 'days')        // 29
b.diff(a, 'weeks')       // 4
b.diff(a, 'months')      // 0
b.diff(a, 'hours')       // 700
b.diff(a, 'minutes')     // 42030

// Precise (with decimals)
b.diff(a, 'days', true)  // 29.1875
b.diff(a, 'weeks', true) // 4.169642857...

// Order matters (can be negative)
a.diff(b, 'days')        // -29
```

---

## DURATION

```typescript
import { createDuration, formatDuration, humanizeDuration } from '@oxog/timekit'


// ============ CREATE DURATION ============

// From milliseconds
const d1 = createDuration(90000)                // 90 seconds

// From object
const d2 = createDuration({ hours: 1, minutes: 30 })
const d3 = createDuration({ days: 2, hours: 5, minutes: 30 })

// From ISO 8601 duration string
const d4 = createDuration('PT1H30M')            // 1 hour 30 minutes
const d5 = createDuration('P1DT2H30M')          // 1 day 2 hours 30 minutes
const d6 = createDuration('P1Y2M3D')            // 1 year 2 months 3 days


// ============ COMPONENT VALUES ============

const dur = createDuration({ days: 1, hours: 2, minutes: 30, seconds: 45 })

dur.years()          // 0
dur.months()         // 0
dur.weeks()          // 0
dur.days()           // 1
dur.hours()          // 2
dur.minutes()        // 30
dur.seconds()        // 45
dur.milliseconds()   // 0


// ============ TOTAL IN SPECIFIC UNIT ============

dur.asYears()        // 0.00289...
dur.asMonths()       // 0.0347...
dur.asWeeks()        // 0.155...
dur.asDays()         // 1.104...
dur.asHours()        // 26.5125
dur.asMinutes()      // 1590.75
dur.asSeconds()      // 95445
dur.asMilliseconds() // 95445000


// ============ FORMAT DURATION ============

formatDuration(95445000)
// '1 day, 2 hours, 30 minutes, 45 seconds'

formatDuration(95445000, { format: 'short' })
// '1d 2h 30m 45s'

formatDuration(95445000, { format: 'narrow' })
// '1d 2h 30m 45s'

formatDuration(95445000, { format: 'digital' })
// '26:30:45'

// Limit units shown
formatDuration(95445000, { units: ['hours', 'minutes'] })
// '26 hours, 30 minutes'

formatDuration(95445000, { largest: 2 })
// '1 day, 2 hours'

// Custom template
formatDuration(95445000, { template: 'HH:mm:ss' })
// '26:30:45'

formatDuration(95445000, { template: 'D [days] H [hours]' })
// '1 days 2 hours'


// ============ HUMANIZE ============

humanizeDuration(45000)           // 'a few seconds'
humanizeDuration(60000)           // 'a minute'
humanizeDuration(3600000)         // 'an hour'
humanizeDuration(86400000)        // 'a day'
humanizeDuration(604800000)       // 'a week'

createDuration({ minutes: 45 }).humanize()      // 'an hour'
createDuration({ hours: 22 }).humanize()        // 'a day'
createDuration({ days: 26 }).humanize()         // 'a month'
createDuration({ months: 11 }).humanize()       // 'a year'

// With suffix
createDuration({ hours: 2 }).humanize(true)     // 'in 2 hours'


// ============ MANIPULATION ============

const duration = createDuration({ hours: 1 })

duration.add(30, 'minutes')              // 1h 30m
duration.add({ minutes: 30 })            // 1h 30m
duration.subtract(15, 'minutes')         // 45m

// Chaining
createDuration({ hours: 1 })
  .add(30, 'minutes')
  .subtract(15, 'seconds')
  .format()


// ============ TO ISO STRING ============

createDuration({ hours: 1, minutes: 30 }).toISOString()
// 'PT1H30M'

createDuration({ days: 1, hours: 2 }).toISOString()
// 'P1DT2H'
```

---

## TIMEZONE

```typescript
import {
  createTime,
  createTimeInZone,
  setDefaultTimezone,
  getTimezones,
  getTimezoneOffset,
} from '@oxog/timekit'


// ============ CREATE IN TIMEZONE ============

// Local time (system timezone)
const local = createTime('2025-12-30T12:00:00')

// Create specifically in a timezone
const tokyo = createTimeInZone('2025-12-30T12:00:00', 'Asia/Tokyo')
const nyc = createTimeInZone('2025-12-30T12:00:00', 'America/New_York')


// ============ CONVERT TO UTC ============

const t = createTime('2025-12-30T12:00:00')  // Local (e.g., +03:00)

t.utc().format('HH:mm Z')           // '09:00 +00:00'
t.utc().format('YYYY-MM-DDTHH:mm:ssZ')  // '2025-12-30T09:00:00+00:00'


// ============ CONVERT TO LOCAL ============

const utcTime = createTime('2025-12-30T09:00:00Z')
utcTime.local().format('HH:mm Z')   // '12:00 +03:00'


// ============ CONVERT TO SPECIFIC TIMEZONE ============

const t2 = createTime('2025-12-30T12:00:00')

t2.tz('America/New_York').format('HH:mm z')   // '04:00 EST'
t2.tz('Asia/Tokyo').format('HH:mm z')         // '18:00 JST'
t2.tz('Europe/London').format('HH:mm z')      // '09:00 GMT'
t2.tz('Australia/Sydney').format('HH:mm z')   // '20:00 AEDT'


// ============ GET TIMEZONE INFO ============

const t3 = createTime()

t3.timezone()        // 'Europe/Istanbul'
t3.utcOffset()       // 180 (minutes from UTC)

// After conversion
t3.tz('America/New_York').timezone()   // 'America/New_York'
t3.tz('America/New_York').utcOffset()  // -300


// ============ SET UTC OFFSET ============

const t4 = createTime('2025-12-30T12:00:00')

t4.utcOffset(0).format('HH:mm Z')        // '12:00 +00:00'
t4.utcOffset('+05:30').format('HH:mm Z') // '12:00 +05:30'
t4.utcOffset(-300).format('HH:mm Z')     // '12:00 -05:00'


// ============ DEFAULT TIMEZONE ============

setDefaultTimezone('America/New_York')

const newYorkTime = createTime()
newYorkTime.timezone()   // 'America/New_York'


// ============ LIST TIMEZONES ============

const timezones = getTimezones()
// [
//   'Africa/Abidjan',
//   'Africa/Accra',
//   ...
//   'Pacific/Wallis',
// ]

// Get offset for a timezone
getTimezoneOffset('America/New_York')  // -300 (in winter)
getTimezoneOffset('Asia/Tokyo')        // 540


// ============ DST HANDLING ============

const summer = createTime('2025-07-15T12:00:00')
const winter = createTime('2025-12-15T12:00:00')

summer.tz('America/New_York').isDST()  // true
winter.tz('America/New_York').isDST()  // false

summer.tz('America/New_York').utcOffset()  // -240 (EDT)
winter.tz('America/New_York').utcOffset()  // -300 (EST)
```

---

## CALENDAR UTILITIES

```typescript
import {
  createTime,
  getCalendar,
  getMonthCalendar,
  getWeekCalendar,
  getDaysInMonth,
  getDaysInYear,
  getWeeksInYear,
  isLeapYear,
} from '@oxog/timekit'


// ============ CALENDAR GRID ============

const calendar = getCalendar(2025, 12)  // December 2025

// Returns array of weeks, each week is array of day numbers
// null for days outside the month
/*
[
  [1, 2, 3, 4, 5, 6, 7],         // Week 1 (Mon-Sun)
  [8, 9, 10, 11, 12, 13, 14],    // Week 2
  [15, 16, 17, 18, 19, 20, 21],  // Week 3
  [22, 23, 24, 25, 26, 27, 28],  // Week 4
  [29, 30, 31, null, null, null, null], // Week 5
]
*/


// ============ CALENDAR WITH OPTIONS ============

const calendarFull = getMonthCalendar(2025, 12, {
  weekStartsOn: 0,       // Sunday
  showWeekNumbers: true,
  minDate: '2025-12-10',
  maxDate: '2025-12-25',
  selectedDate: '2025-12-15',
})

// Returns CalendarMonth object with full details
/*
{
  year: 2025,
  month: 12,
  weeks: [
    {
      weekNumber: 49,
      days: [
        { date: 30, time: Time, isCurrentMonth: false, isToday: false, isWeekend: false, isDisabled: true },
        { date: 1, time: Time, isCurrentMonth: true, isToday: false, isWeekend: false, isDisabled: true },
        ...
      ]
    },
    ...
  ]
}
*/


// ============ WEEK CALENDAR ============

const week = getWeekCalendar(createTime('2025-12-15'))

// Returns 7 days starting from the week start
/*
[
  { date: 15, time: Time, dayOfWeek: 1, isToday: false, isWeekend: false },
  { date: 16, time: Time, dayOfWeek: 2, isToday: false, isWeekend: false },
  ...
  { date: 21, time: Time, dayOfWeek: 0, isToday: false, isWeekend: true },
]
*/


// ============ MONTH INFO ============

const t = createTime('2025-12-15')

t.daysInMonth()      // 31
t.weeksInYear()      // 52
t.weekOfYear()       // 51
t.dayOfYear()        // 349
t.quarter()          // 4


// ============ UTILITY FUNCTIONS ============

getDaysInMonth(2025, 12)   // 31
getDaysInMonth(2025, 2)    // 28
getDaysInMonth(2024, 2)    // 29 (leap year)

getDaysInYear(2025)        // 365
getDaysInYear(2024)        // 366 (leap year)

getWeeksInYear(2025)       // 52
getWeeksInYear(2020)       // 53

isLeapYear(2024)           // true
isLeapYear(2025)           // false
isLeapYear(2000)           // true
isLeapYear(1900)           // false


// ============ FIRST/LAST DAY ============

import { getFirstDayOfMonth, getLastDayOfMonth, getFirstDayOfWeek } from '@oxog/timekit'

getFirstDayOfMonth(2025, 12)  // Time for 2025-12-01
getLastDayOfMonth(2025, 12)   // Time for 2025-12-31

getFirstDayOfWeek(createTime('2025-12-15'))  // Time for 2025-12-15 (Monday)
```

---

## REACT INTEGRATION

```tsx
import {
  TimeProvider,
  useTime,
  useNow,
  useCountdown,
  useStopwatch,
  useRelativeTime,
  useCalendar,
  TimeAgo,
  Countdown,
  Clock,
  Calendar,
  DatePicker,
} from '@oxog/timekit/react'


// ============ PROVIDER ============

function App() {
  return (
    <TimeProvider
      config={{
        locale: 'tr',
        timezone: 'Europe/Istanbul',
        weekStartsOn: 1,
      }}
    >
      <MyApp />
    </TimeProvider>
  )
}


// ============ useTime HOOK ============

function DateDisplay() {
  const {
    now,
    today,
    createTime,
    format,
    parse,
    diff,
    isValid,
  } = useTime()
  
  const currentTime = now()
  const formatted = format(currentTime, 'MMMM D, YYYY HH:mm')
  
  const eventDate = createTime('2026-01-01')
  const daysUntil = diff(eventDate, now(), 'days')
  
  return (
    <div>
      <p>Current: {formatted}</p>
      <p>Days until New Year: {daysUntil}</p>
    </div>
  )
}


// ============ useNow HOOK ============

function LiveClock() {
  const now = useNow({
    interval: 1000,  // Update every second
  })
  
  return (
    <div className="clock">
      <span>{now.format('HH:mm:ss')}</span>
    </div>
  )
}

// With formatting
function FormattedClock() {
  const formatted = useNow({
    interval: 1000,
    format: 'h:mm:ss A',
  })
  
  return <span>{formatted}</span>  // Returns string directly
}


// ============ useCountdown HOOK ============

function NewYearCountdown() {
  const {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isComplete,
    isPaused,
    pause,
    resume,
    restart,
  } = useCountdown('2026-01-01T00:00:00', {
    interval: 1000,
    onComplete: () => {
      playFireworks()
    },
  })
  
  if (isComplete) {
    return <h1>🎉 Happy New Year! 🎉</h1>
  }
  
  return (
    <div className="countdown">
      <div className="segment">
        <span className="value">{days}</span>
        <span className="label">Days</span>
      </div>
      <div className="segment">
        <span className="value">{hours}</span>
        <span className="label">Hours</span>
      </div>
      <div className="segment">
        <span className="value">{minutes}</span>
        <span className="label">Minutes</span>
      </div>
      <div className="segment">
        <span className="value">{seconds}</span>
        <span className="label">Seconds</span>
      </div>
      
      <button onClick={isPaused ? resume : pause}>
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  )
}


// ============ useStopwatch HOOK ============

function Stopwatch() {
  const {
    time,           // Time in milliseconds
    isRunning,
    start,
    stop,
    reset,
    lap,
    laps,
    formatted,      // 'HH:mm:ss.SSS'
  } = useStopwatch({
    format: 'mm:ss.SS',
  })
  
  return (
    <div className="stopwatch">
      <div className="display">{formatted}</div>
      
      <div className="controls">
        {isRunning ? (
          <button onClick={stop}>Stop</button>
        ) : (
          <button onClick={start}>Start</button>
        )}
        <button onClick={reset}>Reset</button>
        <button onClick={lap} disabled={!isRunning}>
          Lap
        </button>
      </div>
      
      {laps.length > 0 && (
        <ul className="laps">
          {laps.map((lapTime, index) => (
            <li key={index}>
              <span>Lap {index + 1}</span>
              <span>{lapTime}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


// ============ useRelativeTime HOOK ============

function PostTimestamp({ date }: { date: string }) {
  const relativeTime = useRelativeTime(date, {
    updateInterval: 60000,  // Update every minute
  })
  
  return <time dateTime={date}>{relativeTime}</time>
}

// With threshold (show absolute after certain time)
function SmartTimestamp({ date }: { date: string }) {
  const { relative, absolute, useRelative } = useRelativeTime(date, {
    updateInterval: 60000,
    threshold: 7 * 24 * 60 * 60 * 1000, // 7 days
    absoluteFormat: 'MMM D, YYYY',
  })
  
  return <time>{useRelative ? relative : absolute}</time>
}


// ============ useCalendar HOOK ============

function CalendarWidget() {
  const {
    calendar,
    currentMonth,
    currentYear,
    selectedDate,
    setSelectedDate,
    goToNextMonth,
    goToPrevMonth,
    goToMonth,
    goToToday,
  } = useCalendar({
    weekStartsOn: 1,
    minDate: '2025-01-01',
    maxDate: '2025-12-31',
  })
  
  return (
    <div className="calendar">
      <div className="header">
        <button onClick={goToPrevMonth}>←</button>
        <span>{currentMonth} {currentYear}</span>
        <button onClick={goToNextMonth}>→</button>
      </div>
      
      <div className="weekdays">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      <div className="days">
        {calendar.weeks.flatMap(week =>
          week.days.map((day, i) => (
            <button
              key={`${week.weekNumber}-${i}`}
              onClick={() => !day.isDisabled && setSelectedDate(day.time)}
              disabled={day.isDisabled}
              className={`
                ${day.isCurrentMonth ? '' : 'outside'}
                ${day.isToday ? 'today' : ''}
                ${day.isSelected ? 'selected' : ''}
                ${day.isWeekend ? 'weekend' : ''}
              `}
            >
              {day.date}
            </button>
          ))
        )}
      </div>
      
      <button onClick={goToToday}>Today</button>
    </div>
  )
}
```

---

## REACT COMPONENTS

```tsx
// ============ TimeAgo COMPONENT ============

// Basic usage
<TimeAgo date="2025-12-28T12:00:00" />
// '2 days ago'

// With automatic updates
<TimeAgo
  date={post.createdAt}
  updateInterval={60000}  // Update every minute
/>

// With title tooltip
<TimeAgo
  date={date}
  title={true}  // Shows full date on hover
/>

// Custom formatter
<TimeAgo
  date={date}
  formatter={(value, unit, suffix) =>
    suffix === 'ago'
      ? `${value}${unit[0]} ago`
      : `in ${value}${unit[0]}`
  }
/>

// Live updates toggle
<TimeAgo date={date} live={false} />


// ============ Countdown COMPONENT ============

// Basic usage
<Countdown to="2026-01-01T00:00:00" />
// '1d 9h 30m 15s'

// With render prop
<Countdown to={eventDate}>
  {({ days, hours, minutes, seconds, isComplete }) =>
    isComplete ? (
      <span>Event started!</span>
    ) : (
      <div className="countdown">
        <span>{days}d</span>
        <span>{hours}h</span>
        <span>{minutes}m</span>
        <span>{seconds}s</span>
      </div>
    )
  }
</Countdown>

// With callbacks
<Countdown
  to={deadline}
  onComplete={() => showNotification('Time is up!')}
  onTick={({ totalSeconds }) => {
    if (totalSeconds === 60) {
      showWarning('1 minute left!')
    }
  }}
/>

// With format
<Countdown to={date} format="DD:HH:mm:ss" />


// ============ Clock COMPONENT ============

// Basic usage
<Clock />
// '14:30:45'

// With format
<Clock format="h:mm:ss A" />
// '2:30:45 PM'

// With timezone
<Clock timezone="America/New_York" />

// With timezone label
<Clock
  timezone="Asia/Tokyo"
  format="HH:mm"
  showTimezone={true}
/>
// '21:30 JST'

// Multiple clocks
<div className="world-clocks">
  <Clock timezone="America/New_York" label="New York" />
  <Clock timezone="Europe/London" label="London" />
  <Clock timezone="Asia/Tokyo" label="Tokyo" />
</div>


// ============ Calendar COMPONENT ============

// Basic usage
<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
/>

// With constraints
<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
  minDate="2025-01-01"
  maxDate="2025-12-31"
  disabledDates={holidays}
/>

// Custom day rendering
<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
  renderDay={(day) => (
    <div
      className={`
        day
        ${day.isToday ? 'today' : ''}
        ${day.isSelected ? 'selected' : ''}
        ${day.isWeekend ? 'weekend' : ''}
        ${events[day.time.format('YYYY-MM-DD')] ? 'has-event' : ''}
      `}
    >
      {day.date}
      {events[day.time.format('YYYY-MM-DD')] && <span className="dot" />}
    </div>
  )}
/>

// With week numbers
<Calendar showWeekNumbers />

// Week starts on Sunday
<Calendar weekStartsOn={0} />


// ============ DatePicker COMPONENT ============

<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
/>

<DatePicker
  value={date}
  onChange={setDate}
  format="DD/MM/YYYY"
  minDate={today}
  clearable
/>

// With time
<DatePicker
  value={datetime}
  onChange={setDatetime}
  showTime
  format="YYYY-MM-DD HH:mm"
/>

// Range picker
<DatePicker.Range
  value={[startDate, endDate]}
  onChange={([start, end]) => {
    setStartDate(start)
    setEndDate(end)
  }}
/>
```

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Browser + Node.js |
| Module | ESM + CJS |
| TypeScript | Strict mode |
| Dependencies | ZERO |
| Test Coverage | 100% |
| Bundle Size | < 3KB core |

---

## PROJECT STRUCTURE

```
timekit/
├── src/
│   ├── index.ts                    # Main exports
│   ├── types.ts                    # Type definitions
│   │
│   ├── core/
│   │   ├── time.ts                 # Main Time class
│   │   ├── create.ts               # Factory functions
│   │   ├── parse.ts                # Parsing logic
│   │   ├── format.ts               # Formatting logic
│   │   └── config.ts               # Global configuration
│   │
│   ├── manipulation/
│   │   ├── add.ts                  # Add/subtract
│   │   ├── set.ts                  # Setters
│   │   └── startend.ts             # Start/end of period
│   │
│   ├── comparison/
│   │   ├── compare.ts              # Comparison methods
│   │   ├── diff.ts                 # Difference calculations
│   │   └── queries.ts              # Query methods (isToday, etc.)
│   │
│   ├── relative/
│   │   ├── relative.ts             # Relative time formatting
│   │   └── labels.ts               # Relative time labels
│   │
│   ├── duration/
│   │   ├── duration.ts             # Duration class
│   │   ├── format.ts               # Duration formatting
│   │   └── humanize.ts             # Humanize duration
│   │
│   ├── timezone/
│   │   ├── timezone.ts             # Timezone handling
│   │   ├── utc.ts                  # UTC operations
│   │   └── data.ts                 # Timezone data
│   │
│   ├── calendar/
│   │   ├── calendar.ts             # Calendar generation
│   │   ├── month.ts                # Month utilities
│   │   └── week.ts                 # Week utilities
│   │
│   ├── utils/
│   │   ├── constants.ts            # Constants
│   │   ├── helpers.ts              # Helper functions
│   │   └── validate.ts             # Validation
│   │
│   ├── locales/
│   │   ├── en.ts                   # English
│   │   ├── tr.ts                   # Turkish
│   │   └── index.ts                # Locale registry
│   │
│   └── adapters/
│       └── react/
│           ├── index.ts
│           ├── context.ts
│           ├── TimeProvider.tsx
│           ├── hooks/
│           │   ├── useTime.ts
│           │   ├── useNow.ts
│           │   ├── useCountdown.ts
│           │   ├── useStopwatch.ts
│           │   ├── useRelativeTime.ts
│           │   └── useCalendar.ts
│           └── components/
│               ├── TimeAgo.tsx
│               ├── Countdown.tsx
│               ├── Clock.tsx
│               ├── Calendar.tsx
│               └── DatePicker.tsx
│
├── tests/
│   ├── unit/
│   │   ├── core/
│   │   ├── manipulation/
│   │   ├── comparison/
│   │   ├── relative/
│   │   ├── duration/
│   │   ├── timezone/
│   │   └── calendar/
│   ├── integration/
│   │   ├── time.test.ts
│   │   ├── duration.test.ts
│   │   ├── timezone.test.ts
│   │   └── react.test.tsx
│   └── fixtures/
│
├── examples/
│   ├── basic/
│   ├── formatting/
│   ├── manipulation/
│   ├── relative-time/
│   ├── timezone/
│   ├── calendar/
│   └── react/
│
├── website/
│   └── [See WEBSITE section]
│
├── .github/
│   └── workflows/
│       └── deploy-website.yml
│
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts
```

---

## DOCUMENTATION WEBSITE

Build a modern documentation site using React + Vite.

### Technology Stack (MANDATORY)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18+ | UI framework |
| **Vite** | 5+ | Build tool |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling (npm, NOT CDN) |
| **shadcn/ui** | Latest | UI components |
| **React Router** | 6+ | Routing |
| **Lucide React** | Latest | Icons |
| **Framer Motion** | Latest | Animations |
| **Prism.js** | Latest | Syntax highlighting |

### Fonts (MANDATORY)

- **JetBrains Mono** - ALL code
- **Inter** - Body text

### Required Pages

1. **Home** (`/`)
   - Hero with live clock demo
   - Feature highlights
   - Install command
   - Quick examples

2. **Getting Started** (`/docs/getting-started`)
   - Installation
   - Quick start
   - Configuration

3. **Formatting** (`/docs/formatting`)
   - Format tokens
   - Common patterns
   - Locale-aware

4. **Parsing** (`/docs/parsing`)
   - Auto-detection
   - Explicit formats
   - Validation

5. **Manipulation** (`/docs/manipulation`)
   - Add/subtract
   - Start/end of
   - Chaining

6. **Comparison** (`/docs/comparison`)
   - Before/after
   - Between
   - Queries

7. **Relative Time** (`/docs/relative-time`)
   - From now
   - Thresholds
   - Labels

8. **Duration** (`/docs/duration`)
   - Create
   - Format
   - Humanize

9. **Timezone** (`/docs/timezone`)
   - Convert
   - UTC
   - DST

10. **API Reference** (`/docs/api/*`)
    - createTime
    - Time instance
    - Duration
    - Utilities

11. **React Guide** (`/docs/react/*`)
    - Hooks
    - Components

12. **Examples** (`/examples`)
    - World clocks
    - Countdown timer
    - Stopwatch
    - Calendar

### Design Theme

- Orange/amber accent (#f59e0b) - Time/clock theme
- Dark mode default
- Light mode support

### GitHub Actions

```yaml
# .github/workflows/deploy-website.yml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: website/package-lock.json
      - run: cd website && npm ci
      - run: cd website && npm run build
      - run: echo "timekit.oxog.dev" > website/dist/CNAME
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## README.md

````markdown
# TimeKit

<div align="center">
  <img src="website/public/logo.svg" alt="TimeKit" width="120" />
  <h3>Lightweight date/time formatting and manipulation</h3>
  <p>
    <a href="https://timekit.oxog.dev">Documentation</a> •
    <a href="https://timekit.oxog.dev/docs/getting-started">Getting Started</a> •
    <a href="https://timekit.oxog.dev/examples">Examples</a>
  </p>
</div>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@oxog/timekit.svg)](https://www.npmjs.com/package/@oxog/timekit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@oxog/timekit)](https://bundlephobia.com/package/@oxog/timekit)
[![license](https://img.shields.io/npm/l/@oxog/timekit.svg)](LICENSE)

</div>

---

## Features

- 📅 **Formatting** - Flexible date/time patterns
- 📖 **Parsing** - Multiple input formats
- ⏱️ **Relative Time** - "2 hours ago"
- ➕ **Manipulation** - Add, subtract, chainable
- ⚖️ **Comparison** - Before, after, between
- ⏳ **Duration** - Format and humanize
- 🌍 **Timezone** - Convert and handle DST
- 📆 **Calendar** - Grid generation
- 🔒 **Immutable** - Predictable operations
- ⚛️ **React** - Hooks & components
- 📦 **Zero Dependencies**
- ⚡ **< 3KB** - Tiny bundle

## Installation

```bash
npm install @oxog/timekit
```

## Quick Start

```typescript
import { createTime, now } from '@oxog/timekit'

// Format
now().format('MMMM D, YYYY')  // 'December 30, 2025'

// Relative
createTime('2025-12-28').fromNow()  // '2 days ago'

// Manipulate
now().add(1, 'week').startOf('day')

// Compare
now().isBefore('2026-01-01')  // true
```

## React

```tsx
import { useNow, useCountdown, TimeAgo } from '@oxog/timekit/react'

// Live clock
const now = useNow({ interval: 1000, format: 'HH:mm:ss' })

// Countdown
const { days, hours, minutes, seconds } = useCountdown('2026-01-01')

// Relative time component
<TimeAgo date={post.createdAt} />
```

## Documentation

Visit [timekit.oxog.dev](https://timekit.oxog.dev) for full documentation.

## License

MIT © [Ersin KOÇ](https://github.com/ersinkoc)
````

---

## IMPLEMENTATION CHECKLIST

### Before Implementation
- [ ] Create SPECIFICATION.md
- [ ] Create IMPLEMENTATION.md
- [ ] Create TASKS.md

### Core
- [ ] Time class
- [ ] Factory functions
- [ ] Parsing
- [ ] Formatting
- [ ] Configuration

### Manipulation
- [ ] Add/subtract
- [ ] Setters
- [ ] Start/end of period

### Comparison
- [ ] Before/after/same
- [ ] Between
- [ ] Difference
- [ ] Query methods

### Relative Time
- [ ] From now / to now
- [ ] From / to
- [ ] Labels and thresholds

### Duration
- [ ] Duration class
- [ ] Format
- [ ] Humanize
- [ ] Manipulation

### Timezone
- [ ] UTC conversion
- [ ] Timezone conversion
- [ ] DST handling

### Calendar
- [ ] Calendar grid
- [ ] Month utilities
- [ ] Week utilities

### React Adapter
- [ ] TimeProvider
- [ ] useTime
- [ ] useNow
- [ ] useCountdown
- [ ] useStopwatch
- [ ] useRelativeTime
- [ ] useCalendar
- [ ] TimeAgo component
- [ ] Countdown component
- [ ] Clock component
- [ ] Calendar component

### Testing
- [ ] 100% coverage
- [ ] All tests passing

### Website
- [ ] React + Vite setup
- [ ] All pages
- [ ] Interactive examples
- [ ] GitHub Actions

---

## BEGIN IMPLEMENTATION

Start by creating SPECIFICATION.md with the complete package specification. Then proceed with IMPLEMENTATION.md and TASKS.md before writing any actual code.

Remember: This package will be published to NPM. It must be production-ready, zero-dependency, fully tested, and professionally documented.

**Date: 2025-12-30**
**Author: Ersin KOÇ**
**Repository: github.com/ersinkoc/timekit**
**Website: timekit.oxog.dev**
