// ============ TIME INPUT ============

export type TimeInput = Time | Date | string | number | TimeObject | null | undefined

export interface TimeObject {
  year?: number
  month?: number // 1-12
  date?: number // 1-31
  hour?: number // 0-23
  minute?: number // 0-59
  second?: number // 0-59
  millisecond?: number // 0-999
}

// ============ TIME UNIT ============

export type TimeUnit =
  | 'year'
  | 'years'
  | 'y'
  | 'month'
  | 'months'
  | 'M'
  | 'week'
  | 'weeks'
  | 'w'
  | 'day'
  | 'days'
  | 'd'
  | 'date'
  | 'hour'
  | 'hours'
  | 'h'
  | 'minute'
  | 'minutes'
  | 'm'
  | 'second'
  | 'seconds'
  | 's'
  | 'millisecond'
  | 'milliseconds'
  | 'ms'

export type TimeUnitNormalized =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'

// ============ CONFIG ============

export interface TimeConfig {
  // Default locale for formatting
  locale?: string
  // Default timezone
  timezone?: string
  // Week configuration
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday, 1 = Monday
  firstWeekContainsDate?: 1 | 4
  // Default formats
  formats?: {
    date?: string // Default: 'YYYY-MM-DD'
    time?: string // Default: 'HH:mm:ss'
    datetime?: string // Default: 'YYYY-MM-DD HH:mm:ss'
  }
  // Relative time thresholds (in the respective unit)
  relativeTimeThresholds?: {
    second?: number // Default: 45
    minute?: number // Default: 45
    hour?: number // Default: 22
    day?: number // Default: 26
    month?: number // Default: 11
  }
  // Relative time labels
  relativeTimeLabels?: RelativeTimeLabels
}

export interface RelativeTimeLabels {
  future: string // 'in %s'
  past: string // '%s ago'
  s: string | RelativeTimeFn
  ss: string | RelativeTimeFn
  m: string | RelativeTimeFn
  mm: string | RelativeTimeFn
  h: string | RelativeTimeFn
  hh: string | RelativeTimeFn
  d: string | RelativeTimeFn
  dd: string | RelativeTimeFn
  w: string | RelativeTimeFn
  ww: string | RelativeTimeFn
  M: string | RelativeTimeFn
  MM: string | RelativeTimeFn
  y: string | RelativeTimeFn
  yy: string | RelativeTimeFn
}

export type RelativeTimeFn = (
  value: number,
  withoutSuffix: boolean,
  key: string,
  isFuture: boolean
) => string

// ============ TIME INSTANCE ============

export interface Time {
  // ========== GETTERS ==========
  year(): number
  month(): number // 1-12
  date(): number // 1-31 (day of month)
  day(): number // 0-6 (day of week, 0 = Sunday)
  hour(): number // 0-23
  minute(): number // 0-59
  second(): number // 0-59
  millisecond(): number // 0-999
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
  // Set specific unit (overloads)
  set(unit: TimeUnit, value: number): Time
  set(values: Partial<TimeObject>): Time
  set(unitOrValues: TimeUnit | Partial<TimeObject>, value?: number): Time
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

export interface Duration {
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

export interface DurationObject {
  years?: number
  months?: number
  weeks?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export type DurationInput = Duration | DurationObject | string | number

// ============ CALENDAR ============

export interface CalendarDay {
  date: number
  time: Time
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  isSelected?: boolean
  isDisabled?: boolean
}

export interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
}

export interface CalendarMonth {
  year: number
  month: number
  weeks: CalendarWeek[]
}

export interface CalendarOptions {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  showWeekNumbers?: boolean
  minDate?: TimeInput
  maxDate?: TimeInput
  disabledDates?: TimeInput[]
  selectedDate?: TimeInput
}

// ============ DURATION FORMAT OPTIONS ============

export interface DurationFormatOptions {
  format?: 'long' | 'short' | 'narrow' | 'digital'
  units?: TimeUnitNormalized[]
  largest?: number
  template?: string
}

// ============ PARSE OPTIONS ============

export interface ParseOptions {
  strict?: boolean
}
