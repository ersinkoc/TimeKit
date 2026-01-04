import type { Duration, DurationInput, DurationObject, TimeUnit, TimeUnitNormalized } from '../types.js'
import { normalizeTimeUnit, MS_PER_UNIT } from '../utils/constants.js'
import { isValidTimestamp } from '../utils/helpers.js'
import { getRelativeTimeThresholds, getDefaultLocale } from '../core/config.js'
import { getRelativeLabels } from '../locales/index.js'

// ============ DURATION CLASS ============

class DurationImpl implements Duration {
  private _ms: number

  constructor(ms: number) {
    this._ms = ms
  }

  // ========== VALIDITY ==========

  isValid(): boolean {
    return isValidTimestamp(this._ms)
  }

  // ========== COMPONENT GETTERS ==========

  years(): number {
    return Math.floor(this._ms / MS_PER_UNIT.year)
  }

  months(): number {
    return Math.floor(this._ms / MS_PER_UNIT.month)
  }

  weeks(): number {
    return Math.floor(this._ms / MS_PER_UNIT.week)
  }

  days(): number {
    return Math.floor(this._ms / MS_PER_UNIT.day)
  }

  hours(): number {
    return Math.floor(this._ms / MS_PER_UNIT.hour) % 24
  }

  minutes(): number {
    return Math.floor(this._ms / MS_PER_UNIT.minute) % 60
  }

  seconds(): number {
    return Math.floor(this._ms / MS_PER_UNIT.second) % 60
  }

  milliseconds(): number {
    return Math.floor(this._ms) % 1000
  }

  // ========== TOTAL GETTERS ==========

  asYears(): number {
    return this._ms / MS_PER_UNIT.year
  }

  asMonths(): number {
    return this._ms / MS_PER_UNIT.month
  }

  asWeeks(): number {
    return this._ms / MS_PER_UNIT.week
  }

  asDays(): number {
    return this._ms / MS_PER_UNIT.day
  }

  asHours(): number {
    return this._ms / MS_PER_UNIT.hour
  }

  asMinutes(): number {
    return this._ms / MS_PER_UNIT.minute
  }

  asSeconds(): number {
    return this._ms / MS_PER_UNIT.second
  }

  asMilliseconds(): number {
    return this._ms
  }

  // ========== MANIPULATION ==========

  add(amount: number, unit: TimeUnit): Duration
  add(duration: DurationInput): Duration
  add(amount: number | DurationInput, unit?: TimeUnit): Duration {
    if (typeof amount === 'number') {
      const normalized = normalizeTimeUnit(unit!)
      const ms = MS_PER_UNIT[normalized] * amount
      return new DurationImpl(this._ms + ms)
    } else {
      const ms = durationToMs(amount)
      return new DurationImpl(this._ms + ms)
    }
  }

  subtract(amount: number, unit: TimeUnit): Duration
  subtract(duration: DurationInput): Duration
  subtract(amount: number | DurationInput, unit?: TimeUnit): Duration {
    if (typeof amount === 'number') {
      const normalized = normalizeTimeUnit(unit!)
      const ms = MS_PER_UNIT[normalized] * amount
      return new DurationImpl(this._ms - ms)
    } else {
      const ms = durationToMs(amount)
      return new DurationImpl(this._ms - ms)
    }
  }

  // ========== FORMATTING ==========

  format(template = 'HH:mm:ss'): string {
    if (!this.isValid()) return 'Invalid Duration'

    // Digital format: HH:mm:ss
    if (template === 'HH:mm:ss' || template === 'HH:mm:ss.SSS') {
      const totalHours = Math.floor(this._ms / MS_PER_UNIT.hour)
      const hours = Math.floor(totalHours)
      const minutes = this.minutes()
      const seconds = this.seconds()
      const ms = this.milliseconds()

      if (template === 'HH:mm:ss.SSS') {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
      }
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    // Token replacement for other formats
    const tokens: Record<string, () => string | number> = {
      YYYY: () => this.years(),
      YY: () => String(this.years()).slice(-2),
      M: () => this.months(),
      MM: () => String(this.months()).padStart(2, '0'),
      d: () => this.days(),
      dd: () => String(this.days()).padStart(2, '0'),
      w: () => this.weeks(),
      ww: () => String(this.weeks()).padStart(2, '0'),
      H: () => this.asHours(),
      HH: () => String(Math.floor(this.asHours())).padStart(2, '0'),
      h: () => Math.floor(this.asHours()) % 24,
      hh: () => String(Math.floor(this.asHours()) % 24).padStart(2, '0'),
      m: () => this.minutes(),
      mm: () => String(this.minutes()).padStart(2, '0'),
      s: () => this.seconds(),
      ss: () => String(this.seconds()).padStart(2, '0'),
      SSS: () => String(this.milliseconds()).padStart(3, '0'),
      S: () => Math.floor(this.milliseconds() / 100),
    }

    return template.replace(/\[([^\]]+)\]|([a-zA-Z]+)/g, (_, escaped, token) => {
      if (escaped) return escaped
      const fn = tokens[token]
      if (fn) return String(fn())
      return token
    })
  }

  humanize(withSuffix = false): string {
    if (!this.isValid()) return 'Invalid Duration'

    const absMs = Math.abs(this._ms)
    const thresholds = getRelativeTimeThresholds()
    const labels = getRelativeLabels(getDefaultLocale())

    // Determine the appropriate unit
    let value: number
    let key: string

    if (absMs < thresholds.second * 1000) {
      value = Math.round(absMs / 1000)
      key = value === 1 ? 's' : 'ss'
    } else if (absMs < thresholds.minute * 60 * 1000) {
      value = Math.round(absMs / 60000)
      key = value === 1 ? 'm' : 'mm'
    } else if (absMs < thresholds.hour * 3600000) {
      value = Math.round(absMs / 3600000)
      key = value === 1 ? 'h' : 'hh'
    } else if (absMs < thresholds.day * 86400000) {
      value = Math.round(absMs / 86400000)
      key = value === 1 ? 'd' : 'dd'
    } else if (absMs < 7 * 86400000) {
      value = Math.round(absMs / 604800000)
      key = value === 1 ? 'w' : 'ww'
    } else if (absMs < thresholds.month * 30.44 * 86400000) {
      value = Math.round(absMs / 2629800000)
      key = value === 1 ? 'M' : 'MM'
    } else {
      value = Math.round(absMs / 31557600000)
      key = value === 1 ? 'y' : 'yy'
    }

    const label = labels[key as keyof typeof labels]
    let formatted: string
    if (typeof label === 'function') {
      formatted = label(value, true, key, false)
    } else {
      formatted = label.replace('%d', String(value))
    }

    if (withSuffix) {
      const suffix = this._ms < 0 ? labels.past : labels.future
      const suffixStr = typeof suffix === 'string' ? suffix : suffix(value, true, key, false)
      return suffixStr.replace('%s', formatted)
    }

    return formatted
  }

  // ========== CONVERSION ==========

  toObject(): DurationObject {
    return {
      years: this.years(),
      months: this.months(),
      weeks: this.weeks(),
      days: this.days(),
      hours: this.hours(),
      minutes: this.minutes(),
      seconds: this.seconds(),
      milliseconds: this.milliseconds(),
    }
  }

  toISOString(): string {
    if (!this.isValid()) return 'Invalid Duration'

    const parts: string[] = ['P']

    if (this.years() > 0) parts.push(`${this.years()}Y`)
    if (this.months() > 0) parts.push(`${this.months()}M`)
    if (this.days() > 0) parts.push(`${this.days()}D`)

    const hasTime = this.hours() > 0 || this.minutes() > 0 || this.seconds() > 0 || this.milliseconds() > 0

    if (hasTime) {
      parts.push('T')
      if (this.hours() > 0) parts.push(`${this.hours()}H`)
      if (this.minutes() > 0) parts.push(`${this.minutes()}M`)
      if (this.seconds() > 0 || this.milliseconds() > 0) {
        const secs = this.seconds() + this.milliseconds() / 1000
        parts.push(`${secs}S`)
      }
    }

    if (parts.length === 1) {
      return 'PT0S'
    }

    return parts.join('')
  }

  toJSON(): string {
    return this.toISOString()
  }

  // ========== CLONE ==========

  clone(): Duration {
    return new DurationImpl(this._ms)
  }

  valueOf(): number {
    return this._ms
  }
}

// ============ DURATION TO MS ============

function durationToMs(input: DurationInput): number {
  if (input instanceof DurationImpl) {
    return input.asMilliseconds()
  }

  if (typeof input === 'number') {
    return input
  }

  if (typeof input === 'string') {
    // Parse ISO 8601 duration
    // P[n]Y[n]M[n]DT[n]H[n]M[n]S
    const match = input.match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i)
    if (match) {
      let ms = 0
      const [, years, months, days, hours, minutes, seconds] = match

      if (years) ms += parseInt(years) * MS_PER_UNIT.year
      if (months) ms += parseInt(months) * MS_PER_UNIT.month
      if (days) ms += parseInt(days) * MS_PER_UNIT.day
      if (hours) ms += parseInt(hours) * MS_PER_UNIT.hour
      if (minutes) ms += parseInt(minutes) * MS_PER_UNIT.minute
      if (seconds) ms += parseFloat(seconds) * MS_PER_UNIT.second

      return ms
    }
  }

  if (typeof input === 'object') {
    let ms = 0
    const obj = input as DurationObject

    if (obj.years) ms += obj.years * MS_PER_UNIT.year
    if (obj.months) ms += obj.months * MS_PER_UNIT.month
    if (obj.weeks) ms += obj.weeks * MS_PER_UNIT.week
    if (obj.days) ms += obj.days * MS_PER_UNIT.day
    if (obj.hours) ms += obj.hours * MS_PER_UNIT.hour
    if (obj.minutes) ms += obj.minutes * MS_PER_UNIT.minute
    if (obj.seconds) ms += obj.seconds * MS_PER_UNIT.second
    if (obj.milliseconds) ms += obj.milliseconds

    return ms
  }

  return 0
}

// ============ CREATE DURATION ============

export function createDuration(input: DurationInput): Duration
export function createDuration(milliseconds: number): Duration
export function createDuration(obj: DurationObject): Duration
export function createDuration(isoString: string): Duration
export function createDuration(input: DurationInput): Duration {
  const ms = durationToMs(input)
  return new DurationImpl(ms)
}

// ============ FORMAT DURATION UTILITY ============

export function formatDuration(ms: number, options: { format?: 'long' | 'short' | 'narrow' | 'digital'; units?: TimeUnitNormalized[]; largest?: number; template?: string } = {}): string {
  const duration = createDuration(ms)
  if (options.template) {
    return duration.format(options.template)
  }

  if (options.format === 'digital') {
    return duration.format('HH:mm:ss')
  }

  // Format as long/short/narrow
  const obj = duration.toObject()
  const parts: string[] = []

  const units = options.units ?? ['days', 'hours', 'minutes', 'seconds']
  const largest = options.largest ?? units.length

  let count = 0
  for (const unit of units) {
    if (count >= largest) break

    const value = obj[unit as keyof DurationObject]
    if (value !== undefined && value > 0) {
      parts.push(`${value} ${unit}${value === 1 ? '' : 's'}`)
      count++
    }
  }

  if (parts.length === 0) {
    return '0 milliseconds'
  }

  return parts.join(', ')
}

// ============ HUMANIZE DURATION UTILITY ============

export function humanizeDuration(ms: number): string {
  return createDuration(ms).humanize()
}

// ============ EXPORTS ============

export { DurationImpl }
export type { DurationImpl as Duration }
