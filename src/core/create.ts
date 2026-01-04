import type { Time, TimeInput, TimeObject } from '../types.js'
import { TimeImpl } from './time.js'
import { getTimestamp, parseStringWithOffset, timeObjectToTimestamp, arrayToTimestamp } from '../utils/helpers.js'

// ============ MAIN FACTORY FUNCTION ============

export function createTime(input?: TimeInput): Time
export function createTime(input: string | number, format?: string): Time
export function createTime(input?: TimeInput, _format?: string): Time {
  // Handle null/undefined as current time
  if (input === null || input === undefined) {
    return new TimeImpl(Date.now())
  }

  // Already a Time instance
  if (input instanceof TimeImpl) {
    return input.clone()
  }

  // Date object
  if (input instanceof Date) {
    return new TimeImpl(input.getTime())
  }

  // Number (timestamp in milliseconds)
  if (typeof input === 'number') {
    return new TimeImpl(input)
  }

  // String - parse with offset for proper timezone handling
  if (typeof input === 'string') {
    const parsed = parseStringWithOffset(input)
    if (parsed) {
      return new TimeImpl(parsed.timestamp, parsed.offset)
    }
    // Fallback to old method for compatibility
    const ts = getTimestamp(input)
    return new TimeImpl(ts)
  }

  // Array [year, month, date, hour, minute, second, ms]
  if (Array.isArray(input)) {
    const ts = arrayToTimestamp(input as [number, number, number, number?, number?, number?, number?])
    return new TimeImpl(ts)
  }

  // Object with time components
  if (typeof input === 'object') {
    // Check if it's a Time object with toTimestamp
    if ('toTimestamp' in input && typeof input.toTimestamp === 'function') {
      return new TimeImpl(input.toTimestamp())
    }

    // TimeObject
    const ts = timeObjectToTimestamp(input as TimeObject)
    return new TimeImpl(ts)
  }

  // Invalid input
  return new TimeImpl(NaN)
}

// ============ FROM UNIX TIMESTAMP ============

createTime.unix = function unix(unix: number): Time {
  return new TimeImpl(unix * 1000)
}

// ============ CURRENT TIME ============

export function now(): Time {
  return new TimeImpl(Date.now())
}

// ============ TODAY AT MIDNIGHT ============

export function today(): Time {
  return now().startOf('day')
}

// ============ VALIDATE ============

export function isValid(input: TimeInput): boolean {
  try {
    const t = createTime(input)
    return t.isValid()
  } catch {
    return false
  }
}

// ============ PARSE ============

export function parse(input: string, _format: string): Time {
  // For now, use the createTime function
  // TODO: Implement format-based parsing
  return createTime(input)
}

// ============ EXPORTS ============

export default createTime
