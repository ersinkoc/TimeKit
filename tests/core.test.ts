// TimeKit Core Tests
import { describe, it, expect } from 'vitest'
import { createTime, now, today, isValid, parse } from '../src/index.js'

describe('createTime', () => {
  it('should create time from current timestamp', () => {
    const time = createTime()
    expect(time.isValid()).toBe(true)
  })

  it('should create time from number timestamp', () => {
    const time = createTime(1609459200000) // 2021-01-01 00:00:00 UTC
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
    expect(time.month()).toBe(1)
    expect(time.date()).toBe(1)
  })

  it('should create time from Date object', () => {
    const date = new Date('2021-01-01T00:00:00Z')
    const time = createTime(date)
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
  })

  it('should create time from ISO string', () => {
    const time = createTime('2021-01-01T00:00:00Z')
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
  })

  it('should create time from object', () => {
    const time = createTime({ year: 2021, month: 1, date: 1 })
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
    expect(time.month()).toBe(1)
    expect(time.date()).toBe(1)
  })

  it('should create time from array', () => {
    const time = createTime([2021, 1, 1])
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
    expect(time.month()).toBe(1)
    expect(time.date()).toBe(1)
  })

  it('should handle null/undefined as current time', () => {
    const time1 = createTime(null)
    const time2 = createTime(undefined)
    expect(time1.isValid()).toBe(true)
    expect(time2.isValid()).toBe(true)
  })

  it('should handle invalid input', () => {
    const time = createTime('invalid')
    expect(time.isValid()).toBe(false)
  })
})

describe('now', () => {
  it('should return current time', () => {
    const time = now()
    expect(time.isValid()).toBe(true)
    const diff = Math.abs(Date.now() - time.toTimestamp())
    expect(diff).toBeLessThan(1000) // Less than 1 second difference
  })
})

describe('today', () => {
  it('should return today at midnight', () => {
    const time = today()
    expect(time.isValid()).toBe(true)
    expect(time.hour()).toBe(0)
    expect(time.minute()).toBe(0)
    expect(time.second()).toBe(0)
  })
})

describe('isValid', () => {
  it('should return true for valid time', () => {
    const time = createTime('2021-01-01')
    expect(isValid(time)).toBe(true)
  })

  it('should return true for valid timestamp', () => {
    expect(isValid(1609459200000)).toBe(true)
  })

  it('should return true for valid Date', () => {
    expect(isValid(new Date())).toBe(true)
  })

  it('should return true for valid string', () => {
    expect(isValid('2021-01-01')).toBe(true)
  })

  it('should return false for invalid time', () => {
    const time = createTime('invalid')
    expect(isValid(time)).toBe(false)
  })

  it('should return false for invalid timestamp', () => {
    expect(isValid(NaN)).toBe(false)
  })
})

describe('parse', () => {
  it('should parse ISO 8601 string', () => {
    const time = parse('2021-01-01T12:30:45Z')
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
    expect(time.month()).toBe(1)
    expect(time.date()).toBe(1)
  })

  it('should parse DD/MM/YYYY format', () => {
    const time = parse('01/01/2021')
    expect(time.isValid()).toBe(true)
  })

  it('should parse MM/DD/YYYY format', () => {
    const time = parse('01/31/2021')
    expect(time.isValid()).toBe(true)
    expect(time.month()).toBe(1)
    expect(time.date()).toBe(31)
  })

  it('should parse month name format', () => {
    const time = parse('January 1, 2021')
    expect(time.isValid()).toBe(true)
    expect(time.year()).toBe(2021)
    expect(time.month()).toBe(1)
  })
})

describe('Time getters', () => {
  const time = createTime('2021-06-15T14:30:45.123Z')

  it('should get year', () => {
    expect(time.year()).toBe(2021)
  })

  it('should get month', () => {
    expect(time.month()).toBe(6)
  })

  it('should get date', () => {
    expect(time.date()).toBe(15)
  })

  it('should get hour', () => {
    expect(time.hour()).toBe(14)
  })

  it('should get minute', () => {
    expect(time.minute()).toBe(30)
  })

  it('should get second', () => {
    expect(time.second()).toBe(45)
  })

  it('should get millisecond', () => {
    expect(time.millisecond()).toBe(123)
  })

  it('should get day of week', () => {
    expect(time.day()).toBe(2) // Tuesday
  })
})

describe('Time setters', () => {
  const time = createTime('2021-06-15T12:00:00Z')

  it('should set year', () => {
    const newTime = time.set('year', 2022)
    expect(newTime.year()).toBe(2022)
    expect(time.year()).toBe(2021) // Original unchanged
  })

  it('should set month', () => {
    const newTime = time.set('month', 12)
    expect(newTime.month()).toBe(12)
  })

  it('should set date', () => {
    const newTime = time.set('date', 20)
    expect(newTime.date()).toBe(20)
  })

  it('should set multiple values', () => {
    const newTime = time.set({ year: 2022, month: 12, date: 25 })
    expect(newTime.year()).toBe(2022)
    expect(newTime.month()).toBe(12)
    expect(newTime.date()).toBe(25)
  })
})

describe('Time manipulation', () => {
  const time = createTime('2021-06-15T12:00:00Z')

  it('should add days', () => {
    const newTime = time.add(1, 'day')
    expect(newTime.date()).toBe(16)
  })

  it('should subtract days', () => {
    const newTime = time.subtract(1, 'day')
    expect(newTime.date()).toBe(14)
  })

  it('should add months', () => {
    const newTime = time.add(1, 'month')
    expect(newTime.month()).toBe(7)
  })

  it('should add years', () => {
    const newTime = time.add(1, 'year')
    expect(newTime.year()).toBe(2022)
  })

  it('should start of unit', () => {
    const newTime = time.startOf('month')
    expect(newTime.date()).toBe(1)
    expect(newTime.hour()).toBe(0)
  })

  it('should end of unit', () => {
    const newTime = time.endOf('month')
    expect(newTime.date()).toBe(30)
    expect(newTime.hour()).toBe(23)
    expect(newTime.minute()).toBe(59)
    expect(newTime.second()).toBe(59)
  })
})

describe('Time comparison', () => {
  const time1 = createTime('2021-06-15T12:00:00Z')
  const time2 = createTime('2021-06-16T12:00:00Z')
  const time3 = createTime('2021-06-15T12:00:00Z')

  it('should check isBefore', () => {
    expect(time1.isBefore(time2)).toBe(true)
    expect(time2.isBefore(time1)).toBe(false)
  })

  it('should check isAfter', () => {
    expect(time2.isAfter(time1)).toBe(true)
    expect(time1.isAfter(time2)).toBe(false)
  })

  it('should check isSame', () => {
    expect(time1.isSame(time3)).toBe(true)
    expect(time1.isSame(time2)).toBe(false)
    expect(time1.isSame(time2, 'month')).toBe(true)
  })

  it('should check isBetween', () => {
    expect(time1.isBetween(time1, time2)).toBe(true)
    expect(time1.isBetween(time1, time2, undefined, '()')).toBe(false)
    expect(time1.isBetween(time1, time2, undefined, '[)')).toBe(true)
  })
})

describe('Time formatting', () => {
  const time = createTime('2021-06-15T14:30:45Z')

  it('should format with default format', () => {
    const formatted = time.format()
    expect(typeof formatted).toBe('string')
    expect(formatted.length).toBeGreaterThan(0)
  })

  it('should format with custom format', () => {
    const formatted = time.format('YYYY-MM-DD')
    expect(formatted).toBe('2021-06-15')
  })

  it('should format with tokens', () => {
    expect(time.format('YYYY')).toBe('2021')
    expect(time.format('MM')).toBe('06')
    expect(time.format('DD')).toBe('15')
  })
})

describe('Time conversion', () => {
  const time = createTime('2021-06-15T14:30:45Z')

  it('should convert to Date', () => {
    const date = time.toDate()
    expect(date).toBeInstanceOf(Date)
  })

  it('should convert to timestamp', () => {
    const ts = time.toTimestamp()
    expect(typeof ts).toBe('number')
    expect(ts).toBe(1623767445000)
  })

  it('should convert to Unix timestamp', () => {
    const unix = time.toUnix()
    expect(unix).toBe(1623767445)
  })

  it('should convert to ISO string', () => {
    const iso = time.toISOString()
    expect(iso).toContain('2021-06-15')
  })

  it('should convert to object', () => {
    const obj = time.toObject()
    expect(obj).toEqual({
      year: 2021,
      month: 6,
      date: 15,
      hour: 14,
      minute: 30,
      second: 45,
      millisecond: 0,
    })
  })

  it('should convert to array', () => {
    const arr = time.toArray()
    expect(arr).toEqual([2021, 6, 15, 14, 30, 45, 0])
  })

  it('should clone', () => {
    const cloned = time.clone()
    expect(cloned.toTimestamp()).toBe(time.toTimestamp())
  })
})

describe('Time utilities', () => {
  const time = createTime('2021-06-15T14:30:45Z')

  it('should check leap year', () => {
    const leapYear = createTime('2020-01-01')
    const nonLeapYear = createTime('2021-01-01')
    expect(leapYear.isLeapYear()).toBe(true)
    expect(nonLeapYear.isLeapYear()).toBe(false)
  })

  it('should get days in month', () => {
    const feb = createTime('2021-02-01')
    expect(feb.daysInMonth()).toBe(28)
    const febLeap = createTime('2020-02-01')
    expect(febLeap.daysInMonth()).toBe(29)
  })

  it('should check weekday', () => {
    const sunday = createTime('2021-06-13') // Sunday
    expect(sunday.isWeekend()).toBe(true)
    const monday = createTime('2021-06-14') // Monday
    expect(monday.isWeekend()).toBe(false)
  })

  it('should check DST', () => {
    const time = createTime()
    expect(typeof time.isDST()).toBe('boolean')
  })
})

describe('Relative time', () => {
  const now = createTime('2021-06-15T12:00:00Z')

  it('should calculate from now', () => {
    const past = createTime('2021-06-15T11:00:00Z')
    const relative = past.from(now)
    expect(typeof relative).toBe('string')
    expect(relative.length).toBeGreaterThan(0)
  })

  it('should calculate to now', () => {
    const future = createTime('2021-06-15T13:00:00Z')
    const relative = future.to(now)
    expect(typeof relative).toBe('string')
  })

  it('should calculate from with suffix', () => {
    const past = createTime('2021-06-15T11:00:00Z')
    const relative = past.from(now, true)
    expect(typeof relative).toBe('string')
  })
})

describe('Timezone support', () => {
  const time = createTime('2021-06-15T14:30:45Z')

  it('should get UTC offset', () => {
    const offset = time.utcOffset()
    expect(typeof offset).toBe('number')
  })

  it('should set UTC offset', () => {
    const newTime = time.utcOffset(-300) // UTC-5
    expect(newTime.utcOffset()).toBe(-300)
  })

  it('should get timezone name', () => {
    const tz = time.timezone()
    expect(typeof tz).toBe('string')
  })

  it('should convert to timezone', () => {
    const newTime = time.tz('America/New_York')
    expect(newTime.isValid()).toBe(true)
  })
})
