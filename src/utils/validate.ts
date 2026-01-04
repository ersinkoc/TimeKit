import type { TimeInput, TimeObject } from '../types.js'
import { getTimestamp, isValidTimestamp, isValidTimeObject } from './helpers.js'

// ============ IS VALID TIME INPUT ============

export function isValidTimeInput(input: TimeInput): boolean {
  if (input === null || input === undefined) {
    return true // Treated as current time
  }

  if (typeof input === 'number') {
    return isValidTimestamp(input)
  }

  if (input instanceof Date) {
    return isValidTimestamp(input.getTime())
  }

  if (typeof input === 'string') {
    const ts = getTimestamp(input)
    return isValidTimestamp(ts)
  }

  if (typeof input === 'object') {
    // Time object with isValid method
    if ('isValid' in input && typeof input.isValid === 'function') {
      return input.isValid()
    }

    // Plain TimeObject
    if (
      'year' in input ||
      'month' in input ||
      'date' in input ||
      'hour' in input ||
      'minute' in input ||
      'second' in input ||
      'millisecond' in input
    ) {
      return isValidTimeObject(input as TimeObject)
    }
  }

  return false
}

// ============ IS VALID DATE ============

export function isValidDate(year: number, month: number, date: number): boolean {
  if (month < 1 || month > 12) return false
  if (date < 1 || date > 31) return false

  // Check for specific month limits
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  const maxDays = month === 2 && isLeap ? 29 : (daysInMonth[month - 1] ?? 31)

  return date <= maxDays
}

// ============ IS VALID TIME ============

export function isValidTime(hour: number, minute: number, second: number, millisecond: number): boolean {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59 && millisecond >= 0 && millisecond <= 999
}

// ============ IS VALID TIMEZONE OFFSET ============

export function isValidTimezoneOffset(offset: number): boolean {
  return offset >= -720 && offset <= 840 // -12h to +14h in minutes
}

// ============ IS VALID WEEK START ============

export function isValidWeekStart(weekStartsOn: number): weekStartsOn is 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return weekStartsOn >= 0 && weekStartsOn <= 6
}
