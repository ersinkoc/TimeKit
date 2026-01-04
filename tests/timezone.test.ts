import { describe, it, expect } from 'vitest'
import {
  getTimezones,
  getTimezoneOffset,
  createTimeInZone
} from '../src/timezone/timezone.js'
import { createTime } from '../src/index.js'

describe('timezone - getTimezones', () => {
  it('should return an array of timezones', () => {
    const timezones = getTimezones()
    expect(Array.isArray(timezones)).toBe(true)
  })

  it('should include UTC', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('UTC')
  })

  it('should include America/New_York', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('America/New_York')
  })

  it('should include America/Los_Angeles', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('America/Los_Angeles')
  })

  it('should include Europe/London', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Europe/London')
  })

  it('should include Asia/Tokyo', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Asia/Tokyo')
  })

  it('should include Australia/Sydney', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Australia/Sydney')
  })

  it('should include Africa timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Africa/Cairo')
    expect(timezones).toContain('Africa/Johannesburg')
    expect(timezones).toContain('Africa/Lagos')
    expect(timezones).toContain('Africa/Nairobi')
  })

  it('should include America timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('America/Chicago')
    expect(timezones).toContain('America/Denver')
    expect(timezones).toContain('America/Mexico_City')
    expect(timezones).toContain('America/Phoenix')
    expect(timezones).toContain('America/Sao_Paulo')
    expect(timezones).toContain('America/Toronto')
    expect(timezones).toContain('America/Vancouver')
    expect(timezones).toContain('America/Argentina/Buenos_Aires')
    expect(timezones).toContain('America/Bogota')
  })

  it('should include Asia timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Asia/Bangkok')
    expect(timezones).toContain('Asia/Dubai')
    expect(timezones).toContain('Asia/Hong_Kong')
    expect(timezones).toContain('Asia/Jakarta')
    expect(timezones).toContain('Asia/Kolkata')
    expect(timezones).toContain('Asia/Seoul')
    expect(timezones).toContain('Asia/Shanghai')
    expect(timezones).toContain('Asia/Singapore')
    expect(timezones).toContain('Asia/Taipei')
  })

  it('should include Europe timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Europe/Amsterdam')
    expect(timezones).toContain('Europe/Berlin')
    expect(timezones).toContain('Europe/Istanbul')
    expect(timezones).toContain('Europe/Madrid')
    expect(timezones).toContain('Europe/Paris')
    expect(timezones).toContain('Europe/Rome')
    expect(timezones).toContain('Europe/Zurich')
  })

  it('should include Pacific timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Pacific/Auckland')
    expect(timezones).toContain('Pacific/Honolulu')
  })

  it('should include Atlantic timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Atlantic/Reykjavik')
  })

  it('should include Australia timezones', () => {
    const timezones = getTimezones()
    expect(timezones).toContain('Australia/Brisbane')
    expect(timezones).toContain('Australia/Melbourne')
    expect(timezones).toContain('Australia/Perth')
  })

  it('should return consistent results on multiple calls', () => {
    const timezones1 = getTimezones()
    const timezones2 = getTimezones()
    expect(timezones1).toEqual(timezones2)
  })
})

describe('timezone - getTimezoneOffset', () => {
  describe('UTC', () => {
    it('should return 0 for UTC', () => {
      const offset = getTimezoneOffset('UTC')
      expect(offset).toBe(0)
    })

    it('should return 0 for UTC with specific date', () => {
      const offset = getTimezoneOffset('UTC', '2024-01-15')
      expect(offset).toBe(0)
    })
  })

  describe('American timezones', () => {
    it('should return offset for America/New_York (EST/EDT)', () => {
      const offset = getTimezoneOffset('America/New_York', '2024-01-15') // January (EST)
      expect(offset).toBe(-300) // UTC-5
    })

    it('should return offset for America/Los_Angeles (PST/PDT)', () => {
      const offset = getTimezoneOffset('America/Los_Angeles', '2024-01-15') // January (PST)
      expect(offset).toBe(-480) // UTC-8
    })

    it('should return offset for America/Chicago (CST/CDT)', () => {
      const offset = getTimezoneOffset('America/Chicago', '2024-01-15') // January (CST)
      expect(offset).toBe(-360) // UTC-6
    })

    it('should return offset for America/Denver (MST/MDT)', () => {
      const offset = getTimezoneOffset('America/Denver', '2024-01-15') // January (MST)
      expect(offset).toBe(-420) // UTC-7
    })

    it('should return offset for America/Phoenix (MST - no DST)', () => {
      const offset = getTimezoneOffset('America/Phoenix', '2024-01-15')
      expect(offset).toBe(-420) // UTC-7
    })
  })

  describe('European timezones', () => {
    it('should return offset for Europe/London (GMT/BST)', () => {
      const offset = getTimezoneOffset('Europe/London', '2024-01-15') // January (GMT)
      expect(offset).toBe(0) // UTC+0
    })

    it('should return offset for Europe/Berlin (CET/CEST)', () => {
      const offset = getTimezoneOffset('Europe/Berlin', '2024-01-15') // January (CET)
      expect(offset).toBe(60) // UTC+1
    })

    it('should return offset for Europe/Paris (CET/CEST)', () => {
      const offset = getTimezoneOffset('Europe/Paris', '2024-01-15') // January (CET)
      expect(offset).toBe(60) // UTC+1
    })

    it('should return offset for Europe/Istanbul', () => {
      const offset = getTimezoneOffset('Europe/Istanbul', '2024-01-15')
      expect(offset).toBe(180) // UTC+3
    })
  })

  describe('Asian timezones', () => {
    it('should return offset for Asia/Tokyo (JST)', () => {
      const offset = getTimezoneOffset('Asia/Tokyo', '2024-01-15')
      expect(offset).toBe(540) // UTC+9
    })

    it('should return offset for Asia/Shanghai (CST)', () => {
      const offset = getTimezoneOffset('Asia/Shanghai', '2024-01-15')
      expect(offset).toBe(480) // UTC+8
    })

    it('should return offset for Asia/Kolkata (IST)', () => {
      const offset = getTimezoneOffset('Asia/Kolkata', '2024-01-15')
      expect(offset).toBe(330) // UTC+5:30
    })

    it('should return offset for Asia/Dubai (GST)', () => {
      const offset = getTimezoneOffset('Asia/Dubai', '2024-01-15')
      expect(offset).toBe(240) // UTC+4
    })

    it('should return offset for Asia/Singapore', () => {
      const offset = getTimezoneOffset('Asia/Singapore', '2024-01-15')
      expect(offset).toBe(480) // UTC+8
    })

    it('should return offset for Asia/Seoul (KST)', () => {
      const offset = getTimezoneOffset('Asia/Seoul', '2024-01-15')
      expect(offset).toBe(540) // UTC+9
    })

    it('should return offset for Asia/Bangkok (ICT)', () => {
      const offset = getTimezoneOffset('Asia/Bangkok', '2024-01-15')
      expect(offset).toBe(420) // UTC+7
    })
  })

  describe('Australian timezones', () => {
    it('should return offset for Australia/Sydney (AEST/AEDT)', () => {
      const offset = getTimezoneOffset('Australia/Sydney', '2024-01-15') // January (AEDT)
      expect(offset).toBe(660) // UTC+11
    })

    it('should return offset for Australia/Melbourne', () => {
      const offset = getTimezoneOffset('Australia/Melbourne', '2024-01-15')
      expect(offset).toBe(660) // UTC+11
    })

    it('should return offset for Australia/Perth (AWST)', () => {
      const offset = getTimezoneOffset('Australia/Perth', '2024-01-15')
      expect(offset).toBe(480) // UTC+8
    })
  })

  describe('Pacific timezones', () => {
    it('should return offset for Pacific/Auckland (NZST/NZDT)', () => {
      const offset = getTimezoneOffset('Pacific/Auckland', '2024-01-15') // January (NZDT)
      expect(offset).toBe(780) // UTC+13
    })

    it('should return offset for Pacific/Honolulu (HST)', () => {
      const offset = getTimezoneOffset('Pacific/Honolulu', '2024-01-15')
      expect(offset).toBe(-600) // UTC-10
    })
  })

  describe('African timezones', () => {
    it('should return offset for Africa/Johannesburg (SAST)', () => {
      const offset = getTimezoneOffset('Africa/Johannesburg', '2024-01-15')
      expect(offset).toBe(120) // UTC+2
    })

    it('should return offset for Africa/Cairo (EET)', () => {
      const offset = getTimezoneOffset('Africa/Cairo', '2024-01-15')
      expect(offset).toBe(120) // UTC+2
    })

    it('should return offset for Africa/Lagos (WAT)', () => {
      const offset = getTimezoneOffset('Africa/Lagos', '2024-01-15')
      expect(offset).toBe(60) // UTC+1
    })

    it('should return offset for Africa/Nairobi (EAT)', () => {
      const offset = getTimezoneOffset('Africa/Nairobi', '2024-01-15')
      expect(offset).toBe(180) // UTC+3
    })
  })

  describe('South American timezones', () => {
    it('should return offset for America/Sao_Paulo (BRT/BRST)', () => {
      const offset = getTimezoneOffset('America/Sao_Paulo', '2024-01-15') // January (BRT)
      expect(offset).toBe(-180) // UTC-3
    })

    it('should return offset for America/Argentina/Buenos_Aires (ART)', () => {
      const offset = getTimezoneOffset('America/Argentina/Buenos_Aires', '2024-01-15')
      expect(offset).toBe(-180) // UTC-3
    })

    it('should return offset for America/Bogota (COT)', () => {
      const offset = getTimezoneOffset('America/Bogota', '2024-01-15')
      expect(offset).toBe(-300) // UTC-5
    })
  })

  describe('Other timezones', () => {
    it('should return offset for Atlantic/Reykjavik (GMT)', () => {
      const offset = getTimezoneOffset('Atlantic/Reykjavik', '2024-01-15')
      expect(offset).toBe(0) // UTC+0
    })
  })

  describe('with default date parameter', () => {
    it('should work without date parameter', () => {
      const offset = getTimezoneOffset('UTC')
      expect(typeof offset).toBe('number')
    })

    it('should work with Date object', () => {
      const offset = getTimezoneOffset('America/New_York', new Date('2024-01-15'))
      expect(typeof offset).toBe('number')
    })

    it('should work with timestamp', () => {
      const offset = getTimezoneOffset('America/New_York', 1705276800000)
      expect(typeof offset).toBe('number')
    })
  })

  describe('invalid timezone handling', () => {
    it('should return 0 for invalid timezone', () => {
      const offset = getTimezoneOffset('Invalid/Timezone')
      expect(offset).toBe(0)
    })

    it('should return 0 for empty string', () => {
      const offset = getTimezoneOffset('')
      expect(offset).toBe(0)
    })
  })
})

describe('timezone - createTimeInZone', () => {
  it('should create time in specified timezone', () => {
    const time = createTimeInZone('2024-01-15T10:00:00', 'America/New_York')
    expect(time.isValid()).toBe(true)
  })

  it('should create time in UTC', () => {
    const time = createTimeInZone('2024-01-15T10:00:00', 'UTC')
    expect(time.isValid()).toBe(true)
  })

  it('should create time in Asia/Tokyo', () => {
    const time = createTimeInZone('2024-01-15T10:00:00', 'Asia/Tokyo')
    expect(time.isValid()).toBe(true)
  })

  it('should handle invalid date input', () => {
    const time = createTimeInZone('invalid-date', 'America/New_York')
    expect(time.isValid()).toBe(false)
  })

  it('should handle null input (current time)', () => {
    const time = createTimeInZone(null, 'America/New_York')
    expect(time.isValid()).toBe(true)
  })

  it('should handle undefined input (current time)', () => {
    const time = createTimeInZone(undefined, 'America/New_York')
    expect(time.isValid()).toBe(true)
  })

  it('should work with Date object', () => {
    const date = new Date('2024-01-15T10:00:00')
    const time = createTimeInZone(date, 'America/Los_Angeles')
    expect(time.isValid()).toBe(true)
  })

  it('should work with timestamp', () => {
    const time = createTimeInZone(1705276800000, 'Europe/London')
    expect(time.isValid()).toBe(true)
  })

  it('should throw error for invalid timezone', () => {
    expect(() => createTimeInZone('2024-01-15T10:00:00', 'Invalid/Timezone')).toThrow()
  })

  it('should convert timezone correctly', () => {
    const time = createTimeInZone('2024-01-15T10:00:00', 'America/New_York')
    const formatted = time.format('YYYY-MM-DD HH:mm:ss')
    expect(typeof formatted).toBe('string')
  })
})
