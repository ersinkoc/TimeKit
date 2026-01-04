import type { TimeInput, TimeUnitNormalized, TimeObject } from '../types.js'
import { MS_PER_UNIT, ORDINAL_SUFFIXES } from './constants.js'
export { normalizeTimeUnit } from './constants.js'

// ============ PAD NUMBERS ============

export function pad(n: number, size = 2): string {
  return n.toString().padStart(size, '0')
}

// ============ ORDINAL SUFFIX ============

export function getOrdinal(n: number): string {
  const v = n % 100
  const s = ORDINAL_SUFFIXES[(v - 20) % 10] || ORDINAL_SUFFIXES[v] || ORDINAL_SUFFIXES[0]
  return `${n}${s}`
}

// ============ IS LEAP YEAR ============

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

// ============ DAYS IN MONTH ============

export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = isLeapYear(year) ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const index = month - 1
  return daysInMonth[index] ?? 31
}

// ============ PARSE RESULT ============

export interface ParseResult {
  timestamp: number
  offset: number // UTC offset in minutes
}

// ============ GET TIMESTAMP ============

export function getTimestamp(input: TimeInput): number {
  if (input === null || input === undefined) {
    return Date.now()
  }

  if (typeof input === 'number') {
    return input
  }

  if (input instanceof Date) {
    return input.getTime()
  }

  if (typeof input === 'string') {
    const timestamp = parseStringToTimestamp(input)
    if (timestamp !== null) {
      return timestamp
    }
  }

  // Assume Time object with toTimestamp method
  if (typeof input === 'object' && 'toTimestamp' in input && typeof input.toTimestamp === 'function') {
    return input.toTimestamp()
  }

  return NaN
}

// ============ PARSE STRING TO TIMESTAMP ============

function parseStringToTimestamp(str: string): number | null {
  // Try ISO 8601 first
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-]\d{2}):?(\d{2}))?)?$/i)
  if (isoMatch) {
    const yearStr = isoMatch[1]
    const monthStr = isoMatch[2]
    const dayStr = isoMatch[3]
    const hourStr = isoMatch[4]
    const minuteStr = isoMatch[5]
    const secondStr = isoMatch[6]
    const msStr = isoMatch[7]
    const tz = isoMatch[8]
    const tzSign = isoMatch[9]
    const tzOffset = isoMatch[10]

    if (!yearStr || !monthStr || !dayStr) return null

    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1
    const day = parseInt(dayStr, 10)
    const hour = hourStr ? parseInt(hourStr, 10) : 0
    const minute = minuteStr ? parseInt(minuteStr, 10) : 0
    const second = secondStr ? parseInt(secondStr, 10) : 0
    const ms = msStr ? parseInt(msStr.padEnd(3, '0'), 10) : 0

    // Handle timezone
    if (tz === 'Z') {
      // UTC time - use Date.UTC()
      return Date.UTC(year, month, day, hour, minute, second, ms)
    } else if (tzSign && tzOffset) {
      // Offset timezone
      const offsetHours = parseInt(tzSign, 10)
      const offsetMinutes = parseInt(tzOffset, 10)
      const offsetMs = (offsetHours * 60 + offsetMinutes) * 60000 * (tzSign.startsWith('-') ? -1 : 1)
      // Create date as if it were UTC, then subtract offset
      const utcTime = Date.UTC(year, month, day, hour, minute, second, ms)
      return utcTime - offsetMs
    }

    // No timezone - treat as local time
    return new Date(year, month, day, hour, minute, second, ms).getTime()
  }

  // Try DD/MM/YYYY or MM/DD/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/)
  if (dmyMatch) {
    const a = dmyMatch[1]
    const b = dmyMatch[2]
    const yearStr = dmyMatch[3]
    if (!a || !b || !yearStr) return null

    const first = parseInt(a, 10)
    const second = parseInt(b, 10)

    // Assume DD/MM/YYYY if first > 12, otherwise MM/DD/YYYY (US)
    const isDayFirst = first > 12
    const day = isDayFirst ? first : second
    const month = isDayFirst ? second : first

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return new Date(parseInt(yearStr, 10), month - 1, day).getTime()
    }
  }

  // Try "Month DD, YYYY" or "DD Month YYYY"
  const monthNameMatch = str.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (monthNameMatch) {
    const monthName = monthNameMatch[1]
    const dayStr = monthNameMatch[2]
    const yearStr = monthNameMatch[3]
    if (!monthName || !dayStr || !yearStr) return null

    const month = MONTH_NAME_TO_NUMBER[monthName.toLowerCase()]
    if (month !== undefined) {
      return new Date(parseInt(yearStr, 10), month - 1, parseInt(dayStr, 10)).getTime()
    }
  }

  return null
}

// ============ PARSE STRING TO TIMESTAMP WITH OFFSET ============

export function parseStringWithOffset(str: string): ParseResult | null {
  // Try ISO 8601 first
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-]\d{2}):?(\d{2}))?)?$/i)
  if (isoMatch) {
    const yearStr = isoMatch[1]
    const monthStr = isoMatch[2]
    const dayStr = isoMatch[3]
    const hourStr = isoMatch[4]
    const minuteStr = isoMatch[5]
    const secondStr = isoMatch[6]
    const msStr = isoMatch[7]
    const tz = isoMatch[8]
    const tzSign = isoMatch[9]
    const tzOffset = isoMatch[10]

    if (!yearStr || !monthStr || !dayStr) return null

    const year = parseInt(yearStr, 10)
    const month = parseInt(monthStr, 10) - 1
    const day = parseInt(dayStr, 10)
    const hour = hourStr ? parseInt(hourStr, 10) : 0
    const minute = minuteStr ? parseInt(minuteStr, 10) : 0
    const second = secondStr ? parseInt(secondStr, 10) : 0
    const ms = msStr ? parseInt(msStr.padEnd(3, '0'), 10) : 0

    // Handle timezone
    if (tz === 'Z') {
      // UTC time - use Date.UTC()
      const timestamp = Date.UTC(year, month, day, hour, minute, second, ms)
      return { timestamp, offset: 0 }
    } else if (tzSign && tzOffset) {
      // Offset timezone
      const offsetHours = parseInt(tzSign, 10)
      const offsetMinutes = parseInt(tzOffset, 10)
      const offset = (offsetHours * 60 + offsetMinutes) * (tzSign.startsWith('-') ? -1 : 1)
      // Create date as if it were UTC, then subtract offset
      const utcTime = Date.UTC(year, month, day, hour, minute, second, ms)
      const timestamp = utcTime - offset * 60000
      return { timestamp, offset }
    }

    // No timezone - treat as local time
    const date = new Date(year, month, day, hour, minute, second, ms)
    // Use the timezone offset for the specific date (handles DST correctly)
    const offset = -date.getTimezoneOffset()
    return { timestamp: date.getTime(), offset }
  }

  // Try DD/MM/YYYY or MM/DD/YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/)
  if (dmyMatch) {
    const a = dmyMatch[1]
    const b = dmyMatch[2]
    const yearStr = dmyMatch[3]
    if (!a || !b || !yearStr) return null

    const first = parseInt(a, 10)
    const second = parseInt(b, 10)

    // Assume DD/MM/YYYY if first > 12, otherwise MM/DD/YYYY (US)
    const isDayFirst = first > 12
    const day = isDayFirst ? first : second
    const month = isDayFirst ? second : first

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const date = new Date(parseInt(yearStr, 10), month - 1, day)
      // Use the timezone offset for the specific date (handles DST correctly)
      const offset = -date.getTimezoneOffset()
      return { timestamp: date.getTime(), offset }
    }
  }

  // Try "Month DD, YYYY" or "DD Month YYYY"
  const monthNameMatch = str.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
  if (monthNameMatch) {
    const monthName = monthNameMatch[1]
    const dayStr = monthNameMatch[2]
    const yearStr = monthNameMatch[3]
    if (!monthName || !dayStr || !yearStr) return null

    const month = MONTH_NAME_TO_NUMBER[monthName.toLowerCase()]
    if (month !== undefined) {
      const date = new Date(parseInt(yearStr, 10), month - 1, parseInt(dayStr, 10))
      // Use the timezone offset for the specific date (handles DST correctly)
      const offset = -date.getTimezoneOffset()
      return { timestamp: date.getTime(), offset }
    }
  }

  return null
}

const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

// ============ TIME OBJECT TO TIMESTAMP ============

export function timeObjectToTimestamp(obj: TimeObject): number {
  const now = new Date()
  const year = obj.year ?? now.getFullYear()
  const month = (obj.month ?? now.getMonth() + 1) - 1
  const date = obj.date ?? now.getDate()
  const hour = obj.hour ?? 0
  const minute = obj.minute ?? 0
  const second = obj.second ?? 0
  const millisecond = obj.millisecond ?? 0

  return new Date(year, month, date, hour, minute, second, millisecond).getTime()
}

// ============ ARRAY TO TIMESTAMP ============

export function arrayToTimestamp(arr: [number, number, number, number?, number?, number?, number?]): number {
  const [year, month, date = 1, hour = 0, minute = 0, second = 0, ms = 0] = arr
  return new Date(year, month - 1, date, hour, minute, second, ms).getTime()
}

// ============ VALIDATE TIMESTAMP ============

export function isValidTimestamp(ts: number): boolean {
  return !isNaN(ts) && ts > -8640000000000000 && ts < 8640000000000000
}

// ============ CLAMP VALUE ============

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ============ MODULO (always positive) ============

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

// ============ FLOOR TO PRECISION ============

export function floorToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.floor(value * factor) / factor
}

// ============ ROUND TO PRECISION ============

export function roundToPrecision(value: number, precision: number): number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

// ============ GET UTC OFFSET ============

export function getCurrentUtcOffset(): number {
  return -new Date().getTimezoneOffset()
}

// ============ PARSE UTC OFFSET STRING ============

export function parseUtcOffsetString(offset: string): number {
  // Match formats: "+03:00", "+0300", "03:00", "0300", "+03"
  const match = offset.match(/^([+-])?(\d{1,2}):?(\d{2})?$/)
  if (!match) return 0

  const sign = match[1] ?? '+'
  const hoursStr = match[2]
  const minutesStr = match[3] ?? '0'

  if (!hoursStr) return 0

  const hours = parseInt(hoursStr, 10)
  const minutes = parseInt(minutesStr, 10)

  const totalMinutes = hours * 60 + minutes
  return sign === '-' ? -totalMinutes : totalMinutes
}

// ============ FORMAT UTC OFFSET ============

export function formatUtcOffset(offsetMinutes: number, withColon = true): string {
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absOffset = Math.abs(offsetMinutes)
  const hours = Math.floor(absOffset / 60)
  const minutes = absOffset % 60
  return withColon ? `${sign}${pad(hours)}:${pad(minutes)}` : `${sign}${pad(hours)}${pad(minutes)}`
}

// ============ GET WEEK OF YEAR ============

export function getWeekOfYear(date: Date, firstWeekContainsDate = 4): number {
  const target = new Date(date.getTime())
  const dayNr = (date.getDay() + 6) % 7 // Monday = 0
  target.setDate(target.getDate() - dayNr + 3)
  const jan4 = new Date(target.getFullYear(), 0, firstWeekContainsDate)
  const dayDiff = (target.getTime() - jan4.getTime()) / 86400000
  return 1 + Math.ceil(dayDiff / 7)
}

// ============ GET DAY OF YEAR ============

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1)
  return Math.floor((date.getTime() - start.getTime()) / 86400000) + 1
}

// ============ GET QUARTER ============

export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1
}

// ============ GET WEEKS IN YEAR ============

export function getWeeksInYear(year: number, firstWeekContainsDate = 4): number {
  const dec28 = new Date(year, 11, 28)
  return getWeekOfYear(dec28, firstWeekContainsDate)
}

// ============ IS VALID TIME OBJECT ============

export function isValidTimeObject(obj: TimeObject, strict = false): boolean {
  if (strict) {
    if (obj.month !== undefined && (obj.month < 1 || obj.month > 12)) return false
    if (obj.date !== undefined && (obj.date < 1 || obj.date > 31)) return false
    if (obj.hour !== undefined && (obj.hour < 0 || obj.hour > 23)) return false
    if (obj.minute !== undefined && (obj.minute < 0 || obj.minute > 59)) return false
    if (obj.second !== undefined && (obj.second < 0 || obj.second > 59)) return false
    if (obj.millisecond !== undefined && (obj.millisecond < 0 || obj.millisecond > 999)) return false
  }

  // Check if date is valid for given month/year
  if (obj.year !== undefined && obj.month !== undefined && obj.date !== undefined) {
    const maxDays = getDaysInMonth(obj.year, obj.month)
    if (obj.date > maxDays) return false
  }

  return true
}

// ============ SAFE MATH OPERATIONS ============

export function safeAdd(ts: number, amount: number, unit: TimeUnitNormalized): number {
  const ms = MS_PER_UNIT[unit] * amount
  return ts + ms
}

export function safeSubtract(ts: number, amount: number, unit: TimeUnitNormalized): number {
  const ms = MS_PER_UNIT[unit] * amount
  return ts - ms
}

// ============ IS VALID TIMEZONE OFFSET ============

export function isValidTimezoneOffset(offset: number): boolean {
  return offset >= -720 && offset <= 840 // -12h to +14h in minutes
}
