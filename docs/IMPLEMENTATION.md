# TimeKit - Implementation Design

## 1. Architecture Overview

TimeKit is organized into modular components with clear responsibilities:

```
src/
├── types.ts              # All TypeScript type definitions
├── index.ts              # Main exports
│
├── core/                 # Core Time functionality
│   ├── time.ts           # Time class implementation
│   ├── create.ts         # Factory functions
│   ├── parse.ts          # Parsing logic
│   ├── format.ts         # Formatting logic
│   └── config.ts         # Global configuration
│
├── manipulation/         # Date manipulation
│   ├── add.ts            # Add/subtract operations
│   ├── set.ts            # Setter operations
│   └── startend.ts       # Start/end of period
│
├── comparison/           # Comparison operations
│   ├── compare.ts        # isBefore, isAfter, isSame
│   ├── diff.ts           # Difference calculations
│   └── queries.ts        # isToday, isLeapYear, etc.
│
├── relative/             # Relative time
│   ├── relative.ts       # fromNow, toNow logic
│   └── labels.ts         # Default labels
│
├── duration/             # Duration handling
│   ├── duration.ts       # Duration class
│   ├── format.ts         # Duration formatting
│   └── humanize.ts       # Human-readable strings
│
├── timezone/             # Timezone support
│   ├── timezone.ts       # Timezone conversion
│   ├── utc.ts            # UTC operations
│   └── data.ts           # Timezone utilities
│
├── calendar/             # Calendar utilities
│   ├── calendar.ts       # Calendar grid generation
│   ├── month.ts          # Month utilities
│   └── week.ts           # Week utilities
│
├── utils/                # Shared utilities
│   ├── constants.ts      # Constants (days in months, etc.)
│   ├── helpers.ts        # Helper functions
│   └── validate.ts       # Validation functions
│
├── locales/              # Locale data
│   ├── en.ts             # English
│   ├── tr.ts             # Turkish
│   └── index.ts          # Locale registry
│
└── adapters/
    └── react/            # React integration
        ├── context.ts
        ├── TimeProvider.tsx
        ├── hooks/
        └── components/
```

## 2. Core Implementation Decisions

### 2.1 Internal Date Storage
- Store timestamp (milliseconds since epoch) as number
- Store timezone offset separately
- No wrapping of native Date objects
- Immutable: new instance on every operation

### 2.2 Time Class Structure
```typescript
class Time {
  private _ts: number      // Timestamp in milliseconds
  private _offset: number  // UTC offset in minutes
  private _tz?: string     // IANA timezone (if set)

  constructor(ts: number, offset?: number, tz?: string)
}
```

### 2.3 Parsing Strategy
1. Check for null/undefined → current time
2. Check for Time instance → clone
3. Check for Date object → get timestamp
4. Check for number → assume milliseconds
5. Check for string → parse using regex patterns
6. Check for object/array → parse components
7. Invalid input → invalid Time (isValid() returns false)

### 2.4 Formatting Strategy
- Regex-based token replacement
- Build format string with placeholders
- Replace each token with actual value
- Handle escaped text in square brackets

### 2.5 Immutability Pattern
```typescript
add(amount: number, unit: TimeUnit): Time {
  const newTs = calculateNewTimestamp(this._ts, amount, unit)
  return new Time(newTs, this._offset, this._tz)
}
```

## 3. Module Implementation Details

### 3.1 Core/Time Class

#### Constructor
```typescript
constructor(ts: number, offset?: number, tz?: string) {
  this._ts = ts
  this._offset = offset ?? getCurrentOffset()
  this._tz = tz
}
```

#### Getters
Use native Date methods with timestamp:
```typescript
year(): number {
  return new Date(this._ts).getFullYear()
}

month(): number {
  return new Date(this._ts).getMonth() + 1 // 1-12
}
```

#### Setters
Create new instance with modified timestamp:
```typescript
setYear(year: number): Time {
  const d = new Date(this._ts)
  d.setFullYear(year)
  return new Time(d.getTime(), this._offset, this._tz)
}
```

### 3.2 Core/Parse

#### ISO 8601 Pattern
```typescript
const ISO_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|([+-]\d{2}):?(\d{2}))?)?$/
```

#### Common Formats
Try multiple patterns:
- `YYYY-MM-DD`
- `DD/MM/YYYY` and `MM/DD/YYYY`
- `DD-MM-YYYY`
- `MMMM D, YYYY`
- `D MMM YYYY`

### 3.3 Core/Format

#### Token Map
```typescript
const TOKENS: Record<string, (t: Time) => string | number> = {
  YYYY: (t) => t.year(),
  YY: (t) => String(t.year()).slice(-2),
  MMMM: (t) => MONTH_NAMES[t.month() - 1],
  // ... etc
}
```

#### Ordinal Suffix
```typescript
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}
```

### 3.4 Manipulation

#### Add/Subtract
```typescript
function addTimestamp(ts: number, amount: number, unit: TimeUnit): number {
  const ms = {
    year: 365.25 * 24 * 60 * 60 * 1000,
    month: 30.44 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
    second: 1000,
    millisecond: 1,
  }
  return ts + amount * ms[unit]
}
```

#### Start/End of Period
```typescript
startOf(unit: TimeUnit): Time {
  const d = new Date(this._ts)
  switch (unit) {
    case 'year':
      d.setMonth(0, 1)
      break
    case 'month':
      d.setDate(1)
      break
    case 'day':
      d.setHours(0, 0, 0, 0)
      break
    // ... etc
  }
  return new Time(d.getTime(), this._offset, this._tz)
}
```

### 3.5 Comparison

#### Diff Calculation
```typescript
diff(other: TimeInput, unit: TimeUnit = 'millisecond', precise = false): number {
  const otherTs = toTimestamp(other)
  const diffMs = this._ts - otherTs
  const divisors = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    // ... etc
  }
  return precise
    ? diffMs / divisors[unit]
    : Math.trunc(diffMs / divisors[unit])
}
```

### 3.6 Relative Time

#### Threshold-Based Selection
```typescript
function getRelativeLabel(diffMs: number, thresholds: Thresholds): string {
  const absMs = Math.abs(diffMs)

  if (absMs < thresholds.second * 1000) return 's'
  if (absMs < thresholds.minute * 60 * 1000) return 'm'
  if (absMs < thresholds.hour * 60 * 60 * 1000) return 'h'
  if (absMs < thresholds.day * 24 * 60 * 60 * 1000) return 'd'
  if (absMs < thresholds.week * 7 * 24 * 60 * 60 * 1000) return 'w'
  if (absMs < thresholds.month * 30.44 * 24 * 60 * 60 * 1000) return 'M'
  return 'y'
}
```

### 3.7 Duration

#### Duration Class
```typescript
class Duration {
  private _ms: number

  constructor(ms: number) {
    this._ms = ms
  }

  asMilliseconds(): number {
    return this._ms
  }

  asSeconds(): number {
    return this._ms / 1000
  }
  // ... etc
}
```

#### Normalization
Convert duration to milliseconds for storage:
```typescript
function durationToMs(obj: DurationObject): number {
  return (
    (obj.years || 0) * 365.25 * 24 * 60 * 60 * 1000 +
    (obj.months || 0) * 30.44 * 24 * 60 * 60 * 1000 +
    (obj.weeks || 0) * 7 * 24 * 60 * 60 * 1000 +
    (obj.days || 0) * 24 * 60 * 60 * 1000 +
    (obj.hours || 0) * 60 * 60 * 1000 +
    (obj.minutes || 0) * 60 * 1000 +
    (obj.seconds || 0) * 1000 +
    (obj.milliseconds || 0)
  )
}
```

### 3.8 Timezone

#### UTC Conversion
```typescript
utc(): Time {
  const offsetMs = this._offset * 60 * 1000
  return new Time(this._ts - offsetMs, 0, 'UTC')
}

tz(timezone: string): Time {
  // Use Intl API to get offset for specific timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'longOffset',
  })
  // Parse and apply offset
  // ... implementation
}
```

### 3.9 Calendar

#### Calendar Grid
```typescript
function getMonthCalendar(year: number, month: number, options: CalendarOptions): CalendarMonth {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startPad = (firstDay.getDay() - weekStartsOn + 7) % 7
  const endPad = (6 - lastDay.getDay() + weekStartsOn) % 7

  // Build grid with padding days
  // ... implementation
}
```

## 4. React Integration

### 4.1 Context Pattern
```typescript
interface TimeContextValue {
  config: TimeConfig
  createTime: (input?: TimeInput) => Time
  // ... other utilities
}

const TimeContext = createContext<TimeContextValue | null>(null)
```

### 4.2 Hook Patterns

#### useNow
```typescript
function useNow(options: NowOptions = {}): string | Time {
  const [now, setNow] = useState(() => createTime())
  const { interval = 1000, format } = options

  useEffect(() => {
    const timer = setInterval(() => setNow(createTime()), interval)
    return () => clearInterval(timer)
  }, [interval])

  return format ? now.format(format) : now
}
```

#### useCountdown
```typescript
function useCountdown(to: TimeInput, options: CountdownOptions = {}) {
  const target = useMemo(() => createTime(to), [to])
  const [remaining, setRemaining] = useState(() => calculateRemaining(target))

  useEffect(() => {
    const timer = setInterval(() => {
      const newRemaining = calculateRemaining(target)
      setRemaining(newRemaining)
      if (newRemaining.totalSeconds <= 0) {
        options.onComplete?.()
      }
    }, options.interval || 1000)
    return () => clearInterval(timer)
  }, [target, options])

  return remaining
}
```

### 4.3 Component Patterns

#### TimeAgo
```typescript
function TimeAgo({ date, updateInterval = 60000, ...props }: TimeAgoProps) {
  const [text, setText] = useState(() => createTime(date).fromNow())

  useEffect(() => {
    const timer = setInterval(() => {
      setText(createTime(date).fromNow())
    }, updateInterval)
    return () => clearInterval(timer)
  }, [date, updateInterval])

  return <time {...props}>{text}</time>
}
```

## 5. Testing Strategy

### 5.1 Test Organization
```
tests/
├── unit/
│   ├── core/
│   │   ├── time.test.ts
│   │   ├── create.test.ts
│   │   ├── parse.test.ts
│   │   └── format.test.ts
│   ├── manipulation/
│   ├── comparison/
│   ├── relative/
│   ├── duration/
│   ├── timezone/
│   └── calendar/
└── integration/
    ├── time.test.ts
    ├── duration.test.ts
    └── react.test.tsx
```

### 5.2 Test Utilities
```typescript
// Test fixtures
const FIXED_DATE = '2025-12-30T14:30:45.123Z'

// Freeze time for tests
function mockTime(dateString: string) {
  vi.setSystemTime(new Date(dateString))
}

// Restore time
function restoreTime() {
  vi.useRealSystemTime()
}
```

### 5.3 Coverage Goals
- Branch coverage: handle all conditional paths
- Edge cases: leap years, month boundaries, DST transitions
- Invalid inputs: proper handling without crashes

## 6. Build Configuration

### 6.1 Tsup Configuration
- **Format**: ESM + CJS
- **DTS**: Separate declaration files
- **Splitting**: Disabled (tree-shakeable via ESM)
- **Minify**: Enabled for production
- **Source maps**: Enabled

### 6.2 TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext (for build tool handling)
- **Strict**: All strict options enabled
- **Module resolution**: bundler (for modern tooling)

## 7. Performance Considerations

### 7.1 Caching Strategies
- Format functions: Cache compiled patterns
- Locale data: Load on demand
- Timezone data: Lazy evaluation

### 7.2 Optimization Targets
- Avoid creating intermediate Date objects
- Use math operations where faster than Date methods
- Pre-calculate constants

### 7.3 Bundle Optimization
- Export individual functions (tree-shakeable)
- Avoid large locale bundles
- Keep React adapter separate

## 8. Error Handling

### 8.1 Philosophy
- Invalid input → Invalid Time (not throw)
- Use `isValid()` to check
- Provide helpful error messages in dev mode

### 8.2 Validation
```typescript
function validateTimeObject(obj: TimeObject, strict: boolean): boolean {
  if (strict) {
    if (obj.month && (obj.month < 1 || obj.month > 12)) return false
    if (obj.date && (obj.date < 1 || obj.date > 31)) return false
    // ... etc
  }
  return true
}
```

## 9. Future Extensibility

### 9.1 Plugin System (Future)
- Hook points for custom locales
- Custom format tokens
- Custom duration formatters

### 9.2 Locale Support (Phase 2)
- More built-in locales
- Locale loading strategy
- Locale fallback mechanism
