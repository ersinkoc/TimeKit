import type { TimeInput } from '../types.js'
import { createTime } from '../core/create.js'

// ============ GET TIMEZONES ============

export function getTimezones(): string[] {
  // Return a subset of common IANA timezones
  // Full list would be too large for zero-dependency package
  return [
    // Africa
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',
    // America
    'America/Argentina/Buenos_Aires',
    'America/Bogota',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Mexico_City',
    'America/New_York',
    'America/Phoenix',
    'America/Sao_Paulo',
    'America/Toronto',
    'America/Vancouver',
    // Asia
    'Asia/Bangkok',
    'Asia/Dubai',
    'Asia/Hong_Kong',
    'Asia/Jakarta',
    'Asia/Kolkata',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Taipei',
    'Asia/Tokyo',
    // Atlantic
    'Atlantic/Reykjavik',
    // Australia
    'Australia/Brisbane',
    'Australia/Melbourne',
    'Australia/Perth',
    'Australia/Sydney',
    // Europe
    'Europe/Amsterdam',
    'Europe/Berlin',
    'Europe/Istanbul',
    'Europe/London',
    'Europe/Madrid',
    'Europe/Paris',
    'Europe/Rome',
    'Europe/Zurich',
    // Pacific
    'Pacific/Auckland',
    'Pacific/Honolulu',
    // UTC
    'UTC',
  ]
}

// ============ GET TIMEZONE OFFSET ============

export function getTimezoneOffset(timezone: string, date?: TimeInput): number {
  const baseDate = date ? createTime(date) : createTime()

  try {
    // Use Intl API to get timezone offset
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    })

    const parts = formatter.formatToParts(baseDate.toDate())
    const tzNamePart = parts.find((p) => p.type === 'timeZoneName')
    const tzName = tzNamePart?.value ?? ''

    const offsetMatch = tzName.match(/GMT([+-]\d{2}):?(\d{2})?/)
    if (offsetMatch) {
      const hours = parseInt(offsetMatch[1] ?? '0')
      const minutes = offsetMatch[2] ? parseInt(offsetMatch[2]) : 0
      return hours * 60 + minutes
    }

    return 0
  } catch {
    // Invalid timezone
    return 0
  }
}

// ============ CREATE TIME IN ZONE ============

export function createTimeInZone(input: TimeInput, timezone: string): ReturnType<typeof createTime> {
  const time = createTime(input)

  if (!time.isValid()) {
    return time
  }

  return time.tz(timezone)
}
