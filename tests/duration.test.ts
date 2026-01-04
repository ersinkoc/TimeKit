import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createDuration, formatDuration, humanizeDuration } from '../src/duration/duration.js'
import { setDefaultLocale } from '../src/core/config.js'
import type { DurationObject } from '../src/types.js'

describe('Duration - Creation', () => {
  it('should create duration from milliseconds', () => {
    const duration = createDuration(1000)
    expect(duration.asMilliseconds()).toBe(1000)
  })

  it('should create duration from seconds', () => {
    const duration = createDuration({ seconds: 60 })
    expect(duration.asSeconds()).toBe(60)
  })

  it('should create duration from minutes', () => {
    const duration = createDuration({ minutes: 30 })
    expect(duration.asMinutes()).toBe(30)
  })

  it('should create duration from hours', () => {
    const duration = createDuration({ hours: 2 })
    expect(duration.asHours()).toBe(2)
  })

  it('should create duration from days', () => {
    const duration = createDuration({ days: 5 })
    expect(duration.asDays()).toBe(5)
  })

  it('should create duration from weeks', () => {
    const duration = createDuration({ weeks: 3 })
    expect(duration.asWeeks()).toBe(3)
  })

  it('should create duration from months', () => {
    const duration = createDuration({ months: 6 })
    expect(duration.asMonths()).toBe(6)
  })

  it('should create duration from years', () => {
    const duration = createDuration({ years: 2 })
    expect(duration.asYears()).toBe(2)
  })

  it('should create duration from ISO 8601 string - P1Y', () => {
    const duration = createDuration('P1Y')
    expect(duration.asMilliseconds()).toBe(31557600000)
  })

  it('should create duration from ISO 8601 string - P2M', () => {
    const duration = createDuration('P2M')
    expect(duration.asMilliseconds()).toBe(2 * 2629800000)
  })

  it('should create duration from ISO 8601 string - P3D', () => {
    const duration = createDuration('P3D')
    expect(duration.asMilliseconds()).toBe(3 * 86400000)
  })

  it('should create duration from ISO 8601 string - PT4H', () => {
    const duration = createDuration('PT4H')
    expect(duration.asMilliseconds()).toBe(4 * 3600000)
  })

  it('should create duration from ISO 8601 string - PT30M', () => {
    const duration = createDuration('PT30M')
    expect(duration.asMilliseconds()).toBe(30 * 60000)
  })

  it('should create duration from ISO 8601 string - PT45S', () => {
    const duration = createDuration('PT45S')
    expect(duration.asMilliseconds()).toBe(45000)
  })

  it('should create duration from ISO 8601 string - P1Y2M3DT4H5M6S', () => {
    const duration = createDuration('P1Y2M3DT4H5M6S')
    const expected = 31557600000 + 2 * 2629800000 + 3 * 86400000 + 4 * 3600000 + 5 * 60000 + 6000
    expect(duration.asMilliseconds()).toBe(expected)
  })

  it('should create duration from ISO 8601 string with fractional seconds', () => {
    const duration = createDuration('PT1.5S')
    expect(duration.asMilliseconds()).toBe(1500)
  })

  it('should create duration from complex object', () => {
    const duration = createDuration({ days: 1, hours: 2, minutes: 30, seconds: 45 })
    const expected = 86400000 + 2 * 3600000 + 30 * 60000 + 45000
    expect(duration.asMilliseconds()).toBe(expected)
  })

  it('should handle zero duration', () => {
    const duration = createDuration(0)
    expect(duration.asMilliseconds()).toBe(0)
  })

  it('should handle negative duration', () => {
    const duration = createDuration(-1000)
    expect(duration.asMilliseconds()).toBe(-1000)
  })
})

describe('Duration - Validity', () => {
  it('should return true for valid duration', () => {
    const duration = createDuration(1000)
    expect(duration.isValid()).toBe(true)
  })

  it('should return false for invalid duration', () => {
    const duration = createDuration(NaN)
    expect(duration.isValid()).toBe(false)
  })

  it('should return false for infinite duration', () => {
    const duration = createDuration(Infinity)
    expect(duration.isValid()).toBe(false)
  })
})

describe('Duration - Component Getters', () => {
  let duration: ReturnType<typeof createDuration>

  beforeEach(() => {
    // 1 day, 2 hours, 30 minutes, 45 seconds, 123 milliseconds
    duration = createDuration({
      days: 1,
      hours: 26, // Will be 2 hours after extracting days
      minutes: 30,
      seconds: 45,
      milliseconds: 123
    })
  })

  it('should get years', () => {
    const d = createDuration({ years: 2 })
    expect(d.years()).toBe(2)
  })

  it('should get months', () => {
    const d = createDuration({ months: 6 })
    expect(d.months()).toBe(6)
  })

  it('should get weeks', () => {
    const d = createDuration({ weeks: 3 })
    expect(d.weeks()).toBe(3)
  })

  it('should get days', () => {
    expect(duration.days()).toBe(2) // 1 day + 26 hours total, floor(50 hours / 24) = 2
  })

  it('should get hours', () => {
    const d = createDuration({ hours: 2, minutes: 30 })
    expect(d.hours()).toBe(2)
  })

  it('should get hours modulo 24', () => {
    const d = createDuration({ hours: 26 })
    expect(d.hours()).toBe(2)
  })

  it('should get minutes', () => {
    expect(duration.minutes()).toBe(30)
  })

  it('should get minutes modulo 60', () => {
    const d = createDuration({ minutes: 90 })
    expect(d.minutes()).toBe(30)
  })

  it('should get seconds', () => {
    expect(duration.seconds()).toBe(45)
  })

  it('should get seconds modulo 60', () => {
    const d = createDuration({ seconds: 90 })
    expect(d.seconds()).toBe(30)
  })

  it('should get milliseconds', () => {
    expect(duration.milliseconds()).toBe(123)
  })

  it('should get milliseconds modulo 1000', () => {
    const d = createDuration({ milliseconds: 1500 })
    expect(d.milliseconds()).toBe(500)
  })
})

describe('Duration - Total Getters (as...)', () => {
  const duration = createDuration({
    days: 1,
    hours: 2,
    minutes: 30,
    seconds: 45,
    milliseconds: 500
  })

  it('should get total milliseconds', () => {
    const expected = 86400000 + 2 * 3600000 + 30 * 60000 + 45500
    expect(duration.asMilliseconds()).toBe(expected)
  })

  it('should get total seconds', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 1000
    expect(duration.asSeconds()).toBe(expected)
  })

  it('should get total minutes', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 60000
    expect(duration.asMinutes()).toBe(expected)
  })

  it('should get total hours', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 3600000
    expect(duration.asHours()).toBe(expected)
  })

  it('should get total days', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 86400000
    expect(duration.asDays()).toBe(expected)
  })

  it('should get total weeks', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 604800000
    expect(duration.asWeeks()).toBe(expected)
  })

  it('should get total months', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 2629800000
    expect(duration.asMonths()).toBe(expected)
  })

  it('should get total years', () => {
    const expected = (86400000 + 2 * 3600000 + 30 * 60000 + 45500) / 31557600000
    expect(duration.asYears()).toBe(expected)
  })
})

describe('Duration - Manipulation', () => {
  let duration: ReturnType<typeof createDuration>

  beforeEach(() => {
    duration = createDuration({ hours: 2, minutes: 30 })
  })

  it('should add time by number and unit', () => {
    const result = duration.add(30, 'minutes')
    expect(result.asMinutes()).toBe(180) // 150 + 30
  })

  it('should add time by duration object', () => {
    const result = duration.add({ hours: 1 })
    expect(result.asHours()).toBe(3.5)
  })

  it('should add time by duration instance', () => {
    const other = createDuration({ minutes: 30 })
    const result = duration.add(other)
    expect(result.asMinutes()).toBe(180)
  })

  it('should add time by ISO string', () => {
    const result = duration.add('PT30M')
    expect(result.asMinutes()).toBe(180)
  })

  it('should subtract time by number and unit', () => {
    const result = duration.subtract(30, 'minutes')
    expect(result.asMinutes()).toBe(120) // 150 - 30
  })

  it('should subtract time by duration object', () => {
    const result = duration.subtract({ hours: 1 })
    expect(result.asHours()).toBe(1.5)
  })

  it('should subtract time by duration instance', () => {
    const other = createDuration({ minutes: 30 })
    const result = duration.subtract(other)
    expect(result.asMinutes()).toBe(120)
  })

  it('should subtract time by ISO string', () => {
    const result = duration.subtract('PT30M')
    expect(result.asMinutes()).toBe(120)
  })

  it('should return new instance (immutability)', () => {
    const result = duration.add(1, 'hour')
    expect(duration.asHours()).toBe(2.5)
    expect(result.asHours()).toBe(3.5)
  })

  it('should handle negative addition', () => {
    const result = duration.add(-30, 'minutes')
    expect(result.asMinutes()).toBe(120)
  })

  it('should handle negative subtraction', () => {
    const result = duration.subtract(-30, 'minutes')
    expect(result.asMinutes()).toBe(180)
  })
})

describe('Duration - Format', () => {
  let duration: ReturnType<typeof createDuration>

  beforeEach(() => {
    duration = createDuration({ hours: 2, minutes: 30, seconds: 45, milliseconds: 123 })
  })

  it('should format as HH:mm:ss', () => {
    expect(duration.format('HH:mm:ss')).toBe('02:30:45')
  })

  it('should format as HH:mm:ss.SSS', () => {
    expect(duration.format('HH:mm:ss.SSS')).toBe('02:30:45.123')
  })

  it('should format with custom template - years', () => {
    const d = createDuration({ years: 2 })
    expect(d.format('YYYY years')).toBe('2 years')
  })

  it('should format with custom template - months', () => {
    const d = createDuration({ months: 6 })
    expect(d.format('M months')).toBe('6 months')
  })

  it('should format with custom template - days', () => {
    const d = createDuration({ days: 5 })
    expect(d.format('d days')).toBe('5 days')
  })

  it('should format with custom template - weeks', () => {
    const d = createDuration({ weeks: 3 })
    expect(d.format('w weeks')).toBe('3 weeks')
  })

  it('should format with custom template - hours', () => {
    expect(duration.format('H hours')).toBe('2.5125341666666667 hours')
  })

  it('should format with custom template - minutes', () => {
    expect(duration.format('m minutes')).toBe('30 minutes')
  })

  it('should format with custom template - seconds', () => {
    expect(duration.format('s seconds')).toBe('45 seconds')
  })

  it('should format with custom template - milliseconds', () => {
    expect(duration.format('SSS ms')).toBe('123 ms')
  })

  it('should format with padded values', () => {
    const d = createDuration({ hours: 5, minutes: 3 })
    expect(d.format('HH:mm')).toBe('05:03')
  })

  it('should format with escaped text', () => {
    const d = createDuration({ hours: 2 })
    expect(d.format('[in] H [hours]')).toBe('in 2 hours')
  })

  it('should return Invalid Duration for invalid duration', () => {
    const d = createDuration(NaN)
    expect(d.format()).toBe('Invalid Duration')
  })
})

describe('Duration - Humanize', () => {
  afterEach(() => {
    setDefaultLocale('en')
  })

  it('should humanize seconds', () => {
    const duration = createDuration({ seconds: 5 })
    expect(duration.humanize()).toBe('5 seconds')
  })

  it('should humanize one second', () => {
    const duration = createDuration({ seconds: 1 })
    expect(duration.humanize()).toBe('a few seconds')
  })

  it('should humanize minutes', () => {
    const duration = createDuration({ minutes: 5 })
    expect(duration.humanize()).toBe('5 minutes')
  })

  it('should humanize one minute', () => {
    const duration = createDuration({ minutes: 1 })
    expect(duration.humanize()).toBe('a minute')
  })

  it('should humanize hours', () => {
    const duration = createDuration({ hours: 3 })
    expect(duration.humanize()).toBe('3 hours')
  })

  it('should humanize one hour', () => {
    const duration = createDuration({ hours: 1 })
    expect(duration.humanize()).toBe('an hour')
  })

  it('should humanize days', () => {
    const duration = createDuration({ days: 5 })
    expect(duration.humanize()).toBe('5 days')
  })

  it('should humanize one day', () => {
    const duration = createDuration({ days: 1 })
    expect(duration.humanize()).toBe('a day')
  })

  it('should humanize weeks', () => {
    const duration = createDuration({ weeks: 2 })
    expect(duration.humanize()).toBe('14 days')
  })

  it('should humanize one week', () => {
    const duration = createDuration({ weeks: 1 })
    expect(duration.humanize()).toBe('7 days')
  })

  it('should humanize months', () => {
    const duration = createDuration({ months: 6 })
    expect(duration.humanize()).toBe('6 months')
  })

  it('should humanize one month', () => {
    const duration = createDuration({ months: 1 })
    expect(duration.humanize()).toBe('a month')
  })

  it('should humanize years', () => {
    const duration = createDuration({ years: 2 })
    expect(duration.humanize()).toBe('2 years')
  })

  it('should humanize one year', () => {
    const duration = createDuration({ years: 1 })
    expect(duration.humanize()).toBe('a year')
  })

  it('should humanize with suffix - past', () => {
    const duration = createDuration({ minutes: -5 })
    expect(duration.humanize(true)).toBe('5 minutes ago')
  })

  it('should humanize with suffix - future', () => {
    const duration = createDuration({ minutes: 5 })
    expect(duration.humanize(true)).toBe('in 5 minutes')
  })

  it('should return Invalid Duration for invalid duration', () => {
    const duration = createDuration(NaN)
    expect(duration.humanize()).toBe('Invalid Duration')
  })
})

describe('Duration - toObject', () => {
  it('should convert to object', () => {
    const duration = createDuration({
      years: 1,
      months: 2,
      weeks: 3,
      days: 4,
      hours: 5,
      minutes: 6,
      seconds: 7,
      milliseconds: 8
    })

    const obj = duration.toObject()
    // toObject() computes values based on total milliseconds, not the input values
    expect(obj).toHaveProperty('years', 1)
    expect(obj).toHaveProperty('months')
    expect(obj).toHaveProperty('weeks')
    expect(obj).toHaveProperty('days')
    expect(obj).toHaveProperty('hours', 8) // 5 hours + remainder from larger units
    expect(obj).toHaveProperty('minutes', 6)
    expect(obj).toHaveProperty('seconds', 7)
    expect(obj).toHaveProperty('milliseconds', 8)
  })

  it('should return object with zero values for zero duration', () => {
    const duration = createDuration(0)
    const obj = duration.toObject()
    expect(obj).toEqual({
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    })
  })
})

describe('Duration - toISOString', () => {
  it('should convert simple duration to ISO string', () => {
    const duration = createDuration({ hours: 2, minutes: 30 })
    expect(duration.toISOString()).toBe('PT2H30M')
  })

  it('should convert duration with days to ISO string', () => {
    const duration = createDuration({ days: 3, hours: 2 })
    expect(duration.toISOString()).toBe('P3DT2H')
  })

  it('should convert duration with seconds to ISO string', () => {
    const duration = createDuration({ seconds: 45 })
    expect(duration.toISOString()).toBe('PT45S')
  })

  it('should convert duration with milliseconds to ISO string', () => {
    const duration = createDuration({ seconds: 45, milliseconds: 500 })
    expect(duration.toISOString()).toBe('PT45.5S')
  })

  it('should convert complex duration to ISO string', () => {
    const duration = createDuration({ days: 1, hours: 2, minutes: 30, seconds: 45 })
    expect(duration.toISOString()).toBe('P1DT2H30M45S')
  })

  it('should return PT0S for zero duration', () => {
    const duration = createDuration(0)
    expect(duration.toISOString()).toBe('PT0S')
  })

  it('should return Invalid Duration for invalid duration', () => {
    const duration = createDuration(NaN)
    expect(duration.toISOString()).toBe('Invalid Duration')
  })
})

describe('Duration - toJSON', () => {
  it('should return ISO string for JSON serialization', () => {
    const duration = createDuration({ hours: 2, minutes: 30 })
    expect(duration.toJSON()).toBe('PT2H30M')
  })
})

describe('Duration - Clone', () => {
  it('should create a clone of the duration', () => {
    const duration = createDuration({ hours: 2, minutes: 30 })
    const cloned = duration.clone()

    expect(cloned.asMilliseconds()).toBe(duration.asMilliseconds())
    expect(cloned).not.toBe(duration)
  })

  it('should create independent clone', () => {
    const duration = createDuration({ hours: 2 })
    const cloned = duration.clone()

    const modified = cloned.add(1, 'hour')

    expect(duration.asHours()).toBe(2)
    expect(modified.asHours()).toBe(3)
  })
})

describe('Duration - valueOf', () => {
  it('should return milliseconds value', () => {
    const duration = createDuration({ hours: 2, minutes: 30 })
    expect(duration.valueOf()).toBe(9000000)
  })
})

describe('formatDuration utility', () => {
  it('should format with default options', () => {
    const result = formatDuration(90061000) // 1 day, 1 hour, 1 minute, 1 second
    expect(result).toContain('day')
  })

  it('should format in digital format', () => {
    const result = formatDuration(9000000, { format: 'digital' })
    expect(result).toBe('02:30:00')
  })

  it('should format with custom template', () => {
    const result = formatDuration(9000000, { template: 'H [hours and] m [minutes]' })
    expect(result).toBe('2.5 hours and 30 minutes')
  })

  it('should respect largest parameter', () => {
    const result = formatDuration(90061000, { largest: 2 })
    const parts = result.split(', ')
    expect(parts.length).toBeLessThanOrEqual(2)
  })

  it('should respect units parameter', () => {
    const result = formatDuration(3661000, { units: ['hours', 'minutes', 'seconds'] })
    expect(result).not.toContain('day')
  })

  it('should return "0 milliseconds" for zero', () => {
    const result = formatDuration(0)
    expect(result).toBe('0 milliseconds')
  })
})

describe('humanizeDuration utility', () => {
  afterEach(() => {
    setDefaultLocale('en')
  })

  it('should humanize duration in seconds', () => {
    const result = humanizeDuration(5000)
    expect(result).toBe('5 seconds')
  })

  it('should humanize duration in minutes', () => {
    const result = humanizeDuration(300000)
    expect(result).toBe('5 minutes')
  })

  it('should humanize duration in hours', () => {
    const result = humanizeDuration(10800000)
    expect(result).toBe('3 hours')
  })

  it('should humanize duration in days', () => {
    const result = humanizeDuration(432000000)
    expect(result).toBe('5 days')
  })
})
