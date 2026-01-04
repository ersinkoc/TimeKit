import type {
  Time,
  TimeInput,
  TimeUnit,
  TimeUnitNormalized,
  TimeObject,
} from '../types.js'
import {
  normalizeTimeUnit,
  getTimestamp,
  isValidTimestamp,
  pad,
  isLeapYear,
  getDaysInMonth,
  safeAdd,
  safeSubtract,
  getWeekOfYear,
  getDayOfYear,
  getQuarter,
  getWeeksInYear,
  getCurrentUtcOffset,
  formatUtcOffset,
  parseUtcOffsetString,
  isValidTimezoneOffset,
} from '../utils/helpers.js'
import { getWeekStartsOn, getDefaultLocale } from './config.js'
// Import these for use in methods - declared at top to avoid circular dependencies
import { formatTime } from './format.js'
import { formatRelative } from '../relative/relative.js'

// ============ TIME CLASS ============

class TimeImpl implements Time {
  private _ts: number // Timestamp in milliseconds
  private _offset: number // UTC offset in minutes
  private _tz: string | undefined // IANA timezone

  constructor(ts: number, offset?: number, tz?: string)
  constructor(ts: number, options?: { offset?: number; timezone?: string })
  constructor(ts: number, offsetOrOptions?: number | { offset?: number; timezone?: string }, tz?: string) {
    // Validate timestamp
    if (!isValidTimestamp(ts)) {
      this._ts = NaN
      this._offset = 0
      this._tz = undefined
      return
    }

    this._ts = ts

    // Handle parameters
    if (typeof offsetOrOptions === 'object') {
      this._offset = offsetOrOptions.offset ?? getCurrentUtcOffset()
      this._tz = offsetOrOptions.timezone
    } else {
      this._offset = offsetOrOptions ?? getCurrentUtcOffset()
      this._tz = tz
    }
  }

  // ========== VALIDITY ==========

  isValid(): boolean {
    return isValidTimestamp(this._ts)
  }

  // ========== GETTERS ==========

  private _getDate(): Date {
    // Get UTC time, then add offset to get the "local" time for the stored offset
    // This allows us to get time components in the correct timezone
    return new Date(this._ts + this._offset * 60000)
  }

  year(): number {
    return this._getDate().getUTCFullYear()
  }

  month(): number {
    return this._getDate().getUTCMonth() + 1 // 1-12
  }

  date(): number {
    return this._getDate().getUTCDate()
  }

  day(): number {
    return this._getDate().getUTCDay() // 0-6 (Sunday-Saturday)
  }

  hour(): number {
    return this._getDate().getUTCHours()
  }

  minute(): number {
    return this._getDate().getUTCMinutes()
  }

  second(): number {
    return this._getDate().getUTCSeconds()
  }

  millisecond(): number {
    return this._getDate().getUTCMilliseconds()
  }

  get(unit: TimeUnit): number {
    const normalized = normalizeTimeUnit(unit)
    switch (normalized) {
      case 'year':
        return this.year()
      case 'month':
        return this.month()
      case 'day':
        return this.date()
      case 'hour':
        return this.hour()
      case 'minute':
        return this.minute()
      case 'second':
        return this.second()
      case 'millisecond':
        return this.millisecond()
      default:
        return NaN
    }
  }

  // ========== SETTERS (immutable) ==========

  private _setModifiedDate(mutator: (d: Date) => void): TimeImpl {
    if (!this.isValid()) return this._cloneInvalid()

    // Get the date in the correct timezone
    const d = this._getDate()
    mutator(d)
    // Convert back to timestamp: subtract the offset from the adjusted local time
    const newTs = d.getTime() - this._offset * 60000
    return new TimeImpl(newTs, this._offset, this._tz)
  }

  setYear(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCFullYear(value))
  }

  setMonth(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCMonth(value - 1)) // Input is 1-12
  }

  setDate(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCDate(value))
  }

  setHour(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCHours(value))
  }

  setMinute(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCMinutes(value))
  }

  setSecond(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCSeconds(value))
  }

  setMillisecond(value: number): Time {
    return this._setModifiedDate((d) => d.setUTCMilliseconds(value))
  }

  set(unitOrValues: TimeUnit | Partial<TimeObject>, value?: number): Time {
    // Handle Partial<TimeObject>
    if (typeof unitOrValues === 'object') {
      let result: Time = this
      const values = unitOrValues
      if (values.year !== undefined) result = result.setYear(values.year)
      if (values.month !== undefined) result = result.setMonth(values.month)
      if (values.date !== undefined) result = result.setDate(values.date)
      if (values.hour !== undefined) result = result.setHour(values.hour)
      if (values.minute !== undefined) result = result.setMinute(values.minute)
      if (values.second !== undefined) result = result.setSecond(values.second)
      if (values.millisecond !== undefined) result = result.setMillisecond(values.millisecond)
      return result
    }

    // Handle TimeUnit, value
    if (value === undefined) {
      return this.clone()
    }

    const normalized = normalizeTimeUnit(unitOrValues)
    switch (normalized) {
      case 'year':
        return this.setYear(value)
      case 'month':
        return this.setMonth(value)
      case 'day':
        return this.setDate(value)
      case 'hour':
        return this.setHour(value)
      case 'minute':
        return this.setMinute(value)
      case 'second':
        return this.setSecond(value)
      case 'millisecond':
        return this.setMillisecond(value)
      default:
        return this.clone()
    }
  }

  // ========== MANIPULATION ==========

  add(amount: number, unit: TimeUnit): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const normalized = normalizeTimeUnit(unit)
    const newTs = safeAdd(this._ts, amount, normalized)
    return new TimeImpl(newTs, this._offset, this._tz)
  }

  subtract(amount: number, unit: TimeUnit): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const normalized = normalizeTimeUnit(unit)
    const newTs = safeSubtract(this._ts, amount, normalized)
    return new TimeImpl(newTs, this._offset, this._tz)
  }

  startOf(unit: TimeUnit): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const normalized = normalizeTimeUnit(unit)
    const d = this._getDate()

    switch (normalized) {
      case 'year':
        d.setUTCMonth(0, 1)
        break
      case 'month':
        d.setUTCDate(1)
        break
      case 'week':
        const weekStartsOn = getWeekStartsOn()
        const currentDay = d.getUTCDay()
        const diff = (currentDay - weekStartsOn + 7) % 7
        d.setUTCDate(d.getUTCDate() - diff)
        break
      case 'day':
        // Already at start of day from below
        break
      case 'hour':
        // Already at start of hour from below
        break
      case 'minute':
        // Already at start of minute from below
        break
      case 'second':
        // Already at start of second from below
        break
      case 'millisecond':
        // Already at start of millisecond
        return this.clone()
    }

    // Set lower units to 0 based on the target unit
    switch (normalized) {
      case 'year':
      case 'month':
      case 'week':
      case 'day':
        d.setUTCHours(0, 0, 0, 0)
        break
      case 'hour':
        d.setUTCMinutes(0, 0, 0)
        break
      case 'minute':
        d.setUTCSeconds(0, 0)
        break
      case 'second':
        d.setUTCMilliseconds(0)
        break
    }

    const newTs = d.getTime() - this._offset * 60000
    return new TimeImpl(newTs, this._offset, this._tz)
  }

  endOf(unit: TimeUnit): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const normalized = normalizeTimeUnit(unit)

    // Start by going to start of next unit, then subtract 1ms
    let result: Time
    switch (normalized) {
      case 'year':
        result = this.setYear(this.year() + 1).startOf('year')
        break
      case 'month':
        result = this.setMonth(this.month() + 1).startOf('month')
        break
      case 'week':
        result = this.add(1, 'week').startOf('week')
        break
      case 'day':
        result = this.add(1, 'day').startOf('day')
        break
      case 'hour':
        result = this.add(1, 'hour').startOf('hour')
        break
      case 'minute':
        result = this.add(1, 'minute').startOf('minute')
        break
      case 'second':
        result = this.add(1, 'second').startOf('second')
        break
      case 'millisecond':
        return this.clone()
      default:
        return this.clone()
    }

    return result.subtract(1, 'millisecond')
  }

  // ========== CONVERSION ==========

  toDate(): Date {
    return new Date(this._ts)
  }

  toTimestamp(): number {
    return this._ts
  }

  toUnix(): number {
    return Math.floor(this._ts / 1000)
  }

  toArray(): [number, number, number, number, number, number, number] {
    return [this.year(), this.month(), this.date(), this.hour(), this.minute(), this.second(), this.millisecond()]
  }

  toObject(): TimeObject {
    return {
      year: this.year(),
      month: this.month(),
      date: this.date(),
      hour: this.hour(),
      minute: this.minute(),
      second: this.second(),
      millisecond: this.millisecond(),
    }
  }

  valueOf(): number {
    return this._ts
  }

  clone(): Time {
    return new TimeImpl(this._ts, this._offset, this._tz)
  }

  private _cloneInvalid(): TimeImpl {
    return new TimeImpl(NaN, 0, undefined)
  }

  // ========== STRING REPRESENTATION ==========

  toISOString(): string {
    if (!this.isValid()) return 'Invalid Date'

    const d = this._getDate()
    const year = d.getUTCFullYear()
    const month = pad(d.getUTCMonth() + 1)
    const day = pad(d.getUTCDate())
    const hour = pad(d.getUTCHours())
    const minute = pad(d.getUTCMinutes())
    const second = pad(d.getUTCSeconds())
    const ms = pad(d.getUTCMilliseconds(), 3)

    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}Z`
  }

  toJSON(): string {
    return this.toISOString()
  }

  toString(): string {
    if (!this.isValid()) return 'Invalid Date'
    return this._getDate().toString()
  }

  toLocaleString(locale?: string, options?: Intl.DateTimeFormatOptions): string {
    if (!this.isValid()) return 'Invalid Date'
    return this._getDate().toLocaleString(locale ?? getDefaultLocale(), options)
  }

  format(pattern?: string): string {
    if (!this.isValid()) return 'Invalid Date'
    return formatTime(this, pattern)
  }

  // ========== TIMEZONE ==========

  utc(): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const offsetMs = this._offset * 60000
    return new TimeImpl(this._ts - offsetMs, 0, 'UTC')
  }

  local(): Time {
    if (!this.isValid()) return this._cloneInvalid()

    const localOffset = getCurrentUtcOffset()
    const offsetMs = (this._offset - localOffset) * 60000
    return new TimeImpl(this._ts + offsetMs, localOffset, undefined)
  }

  tz(timezone: string): Time {
    if (!this.isValid()) return this._cloneInvalid()

    // Convert to target timezone using Intl API
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'longOffset',
    })

    // Format the date and parse to get the target time
    const parts = formatter.formatToParts(this._getDate())
    const newDate = new Date(
      parseInt(parts.find((p) => p.type === 'year')?.value || '0'),
      parseInt(parts.find((p) => p.type === 'month')?.value || '1') - 1,
      parseInt(parts.find((p) => p.type === 'day')?.value || '1'),
      parseInt(parts.find((p) => p.type === 'hour')?.value || '0'),
      parseInt(parts.find((p) => p.type === 'minute')?.value || '0'),
      parseInt(parts.find((p) => p.type === 'second')?.value || '0')
    )

    // Get timezone offset
    const tzName = parts.find((p) => p.type === 'timeZoneName')?.value || ''
    const offsetMatch = tzName.match(/GMT([+-]\d{2}):?(\d{2})?/)
    let offset = 0
    if (offsetMatch) {
      const hoursStr = offsetMatch[1]
      const minutesStr = offsetMatch[2]
      if (hoursStr) {
        const hours = parseInt(hoursStr, 10)
        const minutes = minutesStr ? parseInt(minutesStr, 10) : 0
        offset = hours * 60 + minutes
      }
    }

    return new TimeImpl(newDate.getTime(), offset, timezone)
  }

  utcOffset(): number
  utcOffset(offset: number | string): Time
  utcOffset(offset?: number | string): number | Time {
    if (offset === undefined) {
      return this._offset
    }

    if (!this.isValid()) return this._cloneInvalid()

    let newOffset: number
    if (typeof offset === 'string') {
      newOffset = parseUtcOffsetString(offset)
    } else {
      newOffset = offset
    }

    if (!isValidTimezoneOffset(newOffset)) {
      return this._cloneInvalid()
    }

    const offsetMs = (newOffset - this._offset) * 60000
    return new TimeImpl(this._ts + offsetMs, newOffset, this._tz)
  }

  timezone(): string {
    return this._tz ?? (this._offset === 0 ? 'UTC' : `UTC${formatUtcOffset(this._offset, false)}`)
  }

  // ========== CALENDAR INFO ==========

  daysInMonth(): number {
    if (!this.isValid()) return NaN
    return getDaysInMonth(this.year(), this.month())
  }

  daysInYear(): number {
    if (!this.isValid()) return NaN
    return isLeapYear(this.year()) ? 366 : 365
  }

  weeksInYear(): number {
    if (!this.isValid()) return NaN
    return getWeeksInYear(this.year())
  }

  weekOfYear(): number {
    if (!this.isValid()) return NaN
    return getWeekOfYear(this._getDate())
  }

  dayOfYear(): number {
    if (!this.isValid()) return NaN
    return getDayOfYear(this._getDate())
  }

  quarter(): number {
    if (!this.isValid()) return NaN
    return getQuarter(this._getDate())
  }

  // ========== QUERIES ==========

  isToday(): boolean {
    if (!this.isValid()) return false
    const now = new TimeImpl(Date.now())
    return this.isSame(now, 'day')
  }

  isTomorrow(): boolean {
    if (!this.isValid()) return false
    const tomorrow = new TimeImpl(Date.now()).add(1, 'day')
    return this.isSame(tomorrow, 'day')
  }

  isYesterday(): boolean {
    if (!this.isValid()) return false
    const yesterday = new TimeImpl(Date.now()).subtract(1, 'day')
    return this.isSame(yesterday, 'day')
  }

  isThisWeek(): boolean {
    if (!this.isValid()) return false
    const now = new TimeImpl(Date.now())
    const weekStart = now.startOf('week')
    const weekEnd = now.endOf('week')
    return this.isBetween(weekStart, weekEnd, undefined, '[]')
  }

  isThisMonth(): boolean {
    if (!this.isValid()) return false
    const now = new TimeImpl(Date.now())
    return this.year() === now.year() && this.month() === now.month()
  }

  isThisYear(): boolean {
    if (!this.isValid()) return false
    return this.year() === new Date().getFullYear()
  }

  isWeekend(): boolean {
    if (!this.isValid()) return false
    const day = this.day()
    return day === 0 || day === 6 // Sunday or Saturday
  }

  isWeekday(): boolean {
    if (!this.isValid()) return false
    return !this.isWeekend()
  }

  isLeapYear(): boolean {
    if (!this.isValid()) return false
    return isLeapYear(this.year())
  }

  isDST(): boolean {
    if (!this.isValid()) return false

    // Check if current offset differs from standard offset
    // January is standard time in northern hemisphere
    const jan = new TimeImpl(new Date(this.year(), 0, 1).getTime())
    const jul = new TimeImpl(new Date(this.year(), 6, 1).getTime())

    const janOffset = jan.utcOffset()
    const julOffset = jul.utcOffset()
    const currentOffset = this.utcOffset()

    // If offsets differ, DST is observed
    if (janOffset !== julOffset) {
      // Northern hemisphere: DST in summer
      // Southern hemisphere: DST in winter
      return currentOffset === Math.max(janOffset, julOffset)
    }

    return false
  }

  // ========== COMPARISON ==========

  isBefore(time: TimeInput, unit?: TimeUnit): boolean {
    if (!this.isValid()) return false

    const other = createTime(time)
    if (!other.isValid()) return false

    if (unit === undefined) {
      return this._ts < other.toTimestamp()
    }

    const normalized = normalizeTimeUnit(unit)
    const thisStart = this.startOf(normalized)
    const otherStart = other.startOf(normalized)
    return thisStart.toTimestamp() < otherStart.toTimestamp()
  }

  isAfter(time: TimeInput, unit?: TimeUnit): boolean {
    if (!this.isValid()) return false

    const other = createTime(time)
    if (!other.isValid()) return false

    if (unit === undefined) {
      return this._ts > other.toTimestamp()
    }

    const normalized = normalizeTimeUnit(unit)
    const thisStart = this.startOf(normalized)
    const otherStart = other.startOf(normalized)
    return thisStart.toTimestamp() > otherStart.toTimestamp()
  }

  isSame(time: TimeInput, unit?: TimeUnit): boolean {
    if (!this.isValid()) return false

    const other = createTime(time)
    if (!other.isValid()) return false

    if (unit === undefined) {
      return this._ts === other.toTimestamp()
    }

    const normalized = normalizeTimeUnit(unit)
    const thisStart = this.startOf(normalized)
    const otherStart = other.startOf(normalized)
    return thisStart.toTimestamp() === otherStart.toTimestamp()
  }

  isSameOrBefore(time: TimeInput, unit?: TimeUnit): boolean {
    return this.isBefore(time, unit) || this.isSame(time, unit)
  }

  isSameOrAfter(time: TimeInput, unit?: TimeUnit): boolean {
    return this.isAfter(time, unit) || this.isSame(time, unit)
  }

  isBetween(
    start: TimeInput,
    end: TimeInput,
    unit?: TimeUnit,
    inclusivity: '()' | '[]' | '[)' | '(]' = '[]'
  ): boolean {
    if (!this.isValid()) return false

    const startDate = createTime(start)
    const endDate = createTime(end)

    if (!startDate.isValid() || !endDate.isValid()) return false

    const isBeforeEnd = inclusivity[1] === ']' ? this.isSameOrBefore(end, unit) : this.isBefore(end, unit)
    const isAfterStart = inclusivity[0] === '[' ? this.isSameOrAfter(start, unit) : this.isAfter(start, unit)

    return isBeforeEnd && isAfterStart
  }

  // ========== DIFFERENCE ==========

  diff(time: TimeInput, unit?: TimeUnit, precise = false): number {
    if (!this.isValid()) return NaN

    const other = createTime(time)
    if (!other.isValid()) return NaN

    const diffMs = this._ts - other.toTimestamp()

    if (unit === undefined || unit === 'millisecond' || unit === 'milliseconds' || unit === 'ms') {
      return precise ? diffMs : Math.trunc(diffMs)
    }

    const normalized = normalizeTimeUnit(unit)
    const msPerUnit: Record<TimeUnitNormalized, number> = {
      year: 31557600000,
      month: 2629800000,
      week: 604800000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
      millisecond: 1,
    }

    return precise ? diffMs / msPerUnit[normalized] : Math.trunc(diffMs / msPerUnit[normalized])
  }

  // ========== RELATIVE TIME ==========

  fromNow(withoutSuffix = false): string {
    const now = new TimeImpl(Date.now())
    return this.from(now, withoutSuffix)
  }

  toNow(withoutSuffix = false): string {
    const now = new TimeImpl(Date.now())
    return this.to(now, withoutSuffix)
  }

  from(time: TimeInput, withoutSuffix = false): string {
    const other = createTime(time)
    if (!this.isValid() || !other.isValid()) return 'Invalid Date'

    const diffMs = this._ts - other.toTimestamp()
    const absMs = Math.abs(diffMs)
    return formatRelative(absMs, diffMs < 0, withoutSuffix)
  }

  to(time: TimeInput, withoutSuffix = false): string {
    const other = createTime(time)
    if (!this.isValid() || !other.isValid()) return 'Invalid Date'

    const diffMs = other.toTimestamp() - this._ts
    const absMs = Math.abs(diffMs)
    return formatRelative(absMs, diffMs < 0, withoutSuffix)
  }
}

// ============ HELPER FUNCTION FOR INTERNAL USE ============

function createTime(input: TimeInput): TimeImpl {
  if (input instanceof TimeImpl) return input

  const ts = getTimestamp(input)
  return new TimeImpl(ts)
}

export { TimeImpl, createTime }

// Export the factory that will be used in create.ts
export { TimeImpl as Time }
