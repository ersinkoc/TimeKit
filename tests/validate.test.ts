import { describe, it, expect } from 'vitest'
import {
  isValidTimeInput,
  isValidDate,
  isValidTime,
  isValidTimezoneOffset,
  isValidWeekStart
} from '../src/utils/validate.js'
import { createTime } from '../src/index.js'

describe('validate - isValidTimeInput', () => {
  describe('null and undefined', () => {
    it('should return true for null', () => {
      expect(isValidTimeInput(null)).toBe(true)
    })

    it('should return true for undefined', () => {
      expect(isValidTimeInput(undefined)).toBe(true)
    })
  })

  describe('number inputs', () => {
    it('should return true for valid timestamp', () => {
      expect(isValidTimeInput(Date.now())).toBe(true)
    })

    it('should return true for zero timestamp', () => {
      expect(isValidTimeInput(0)).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isValidTimeInput(NaN)).toBe(false)
    })

    it('should return false for Infinity', () => {
      expect(isValidTimeInput(Infinity)).toBe(false)
    })

    it('should return false for negative Infinity', () => {
      expect(isValidTimeInput(-Infinity)).toBe(false)
    })
  })

  describe('Date inputs', () => {
    it('should return true for valid Date', () => {
      expect(isValidTimeInput(new Date())).toBe(true)
    })

    it('should return true for Date at epoch', () => {
      expect(isValidTimeInput(new Date(0))).toBe(true)
    })

    it('should return false for invalid Date', () => {
      expect(isValidTimeInput(new Date('invalid'))).toBe(false)
    })
  })

  describe('string inputs', () => {
    it('should return true for ISO 8601 string', () => {
      expect(isValidTimeInput('2024-01-15')).toBe(true)
    })

    it('should return true for ISO 8601 datetime', () => {
      expect(isValidTimeInput('2024-01-15T10:30:00')).toBe(true)
    })

    it('should return true for ISO 8601 with timezone', () => {
      expect(isValidTimeInput('2024-01-15T10:30:00Z')).toBe(true)
    })

    it('should return false for RFC 2822 string (not supported by getTimestamp)', () => {
      expect(isValidTimeInput('Mon, 15 Jan 2024 10:30:00 GMT')).toBe(false)
    })

    it('should return false for invalid string', () => {
      expect(isValidTimeInput('not a date')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidTimeInput('')).toBe(false)
    })
  })

  describe('object inputs with isValid method', () => {
    it('should return true for valid Time object', () => {
      const time = createTime('2024-01-15')
      expect(isValidTimeInput(time)).toBe(true)
    })

    it('should return false for invalid Time object', () => {
      const time = createTime('invalid')
      expect(isValidTimeInput(time)).toBe(false)
    })

    it('should handle custom object with isValid method', () => {
      const customObj = { isValid: () => true }
      expect(isValidTimeInput(customObj)).toBe(true)
    })

    it('should handle custom object with isValid returning false', () => {
      const customObj = { isValid: () => false }
      expect(isValidTimeInput(customObj)).toBe(false)
    })
  })

  describe('plain TimeObject inputs', () => {
    it('should return true for valid time object with year', () => {
      expect(isValidTimeInput({ year: 2024 })).toBe(true)
    })

    it('should return true for valid time object with month', () => {
      expect(isValidTimeInput({ month: 1 })).toBe(true)
    })

    it('should return true for valid time object with date', () => {
      expect(isValidTimeInput({ date: 15 })).toBe(true)
    })

    it('should return true for valid time object with hour', () => {
      expect(isValidTimeInput({ hour: 10 })).toBe(true)
    })

    it('should return true for valid time object with minute', () => {
      expect(isValidTimeInput({ minute: 30 })).toBe(true)
    })

    it('should return true for valid time object with second', () => {
      expect(isValidTimeInput({ second: 45 })).toBe(true)
    })

    it('should return true for valid time object with millisecond', () => {
      expect(isValidTimeInput({ millisecond: 123 })).toBe(true)
    })

    it('should return true for complete time object', () => {
      expect(isValidTimeInput({
        year: 2024,
        month: 1,
        date: 15,
        hour: 10,
        minute: 30,
        second: 45,
        millisecond: 123
      })).toBe(true)
    })

    it('should return true for invalid time object - month validation not performed by isValidTimeObject', () => {
      // isValidTimeObject only checks if properties are numbers, not their valid ranges
      expect(isValidTimeInput({ month: 13 })).toBe(true)
    })

    it('should return true for invalid time object - date validation not performed by isValidTimeObject', () => {
      // isValidTimeObject only checks if properties are numbers, not their valid ranges
      expect(isValidTimeInput({ date: 32 })).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('should return false for boolean', () => {
      expect(isValidTimeInput(true)).toBe(false)
    })

    it('should return false for plain object without time properties', () => {
      expect(isValidTimeInput({ foo: 'bar' })).toBe(false)
    })

    it('should return false for array', () => {
      expect(isValidTimeInput([1, 2, 3])).toBe(false)
    })

    it('should return false for function', () => {
      expect(isValidTimeInput(() => {})).toBe(false)
    })

    it('should return false for symbol', () => {
      expect(isValidTimeInput(Symbol('test'))).toBe(false)
    })
  })
})

describe('validate - isValidDate', () => {
  describe('valid dates', () => {
    it('should return true for January 1st', () => {
      expect(isValidDate(2024, 1, 1)).toBe(true)
    })

    it('should return true for December 31st', () => {
      expect(isValidDate(2024, 12, 31)).toBe(true)
    })

    it('should return true for February 28th in non-leap year', () => {
      expect(isValidDate(2023, 2, 28)).toBe(true)
    })

    it('should return true for February 29th in leap year', () => {
      expect(isValidDate(2024, 2, 29)).toBe(true)
    })

    it('should return true for February 29th in century leap year', () => {
      expect(isValidDate(2000, 2, 29)).toBe(true)
    })

    it('should return true for April 30th', () => {
      expect(isValidDate(2024, 4, 30)).toBe(true)
    })

    it('should return true for June 30th', () => {
      expect(isValidDate(2024, 6, 30)).toBe(true)
    })

    it('should return true for September 30th', () => {
      expect(isValidDate(2024, 9, 30)).toBe(true)
    })

    it('should return true for November 30th', () => {
      expect(isValidDate(2024, 11, 30)).toBe(true)
    })
  })

  describe('invalid month', () => {
    it('should return false for month 0', () => {
      expect(isValidDate(2024, 0, 1)).toBe(false)
    })

    it('should return false for month 13', () => {
      expect(isValidDate(2024, 13, 1)).toBe(false)
    })

    it('should return false for negative month', () => {
      expect(isValidDate(2024, -1, 1)).toBe(false)
    })
  })

  describe('invalid day', () => {
    it('should return false for day 0', () => {
      expect(isValidDate(2024, 1, 0)).toBe(false)
    })

    it('should return false for day 32', () => {
      expect(isValidDate(2024, 1, 32)).toBe(false)
    })

    it('should return false for day 31 in April', () => {
      expect(isValidDate(2024, 4, 31)).toBe(false)
    })

    it('should return false for day 31 in June', () => {
      expect(isValidDate(2024, 6, 31)).toBe(false)
    })

    it('should return false for day 31 in September', () => {
      expect(isValidDate(2024, 9, 31)).toBe(false)
    })

    it('should return false for day 31 in November', () => {
      expect(isValidDate(2024, 11, 31)).toBe(false)
    })

    it('should return false for February 29th in non-leap year', () => {
      expect(isValidDate(2023, 2, 29)).toBe(false)
    })

    it('should return false for February 29th in century non-leap year', () => {
      expect(isValidDate(1900, 2, 29)).toBe(false)
    })

    it('should return false for February 30th', () => {
      expect(isValidDate(2024, 2, 30)).toBe(false)
    })

    it('should return false for February 31st', () => {
      expect(isValidDate(2024, 2, 31)).toBe(false)
    })

    it('should return false for negative day', () => {
      expect(isValidDate(2024, 1, -1)).toBe(false)
    })
  })

  describe('leap year handling', () => {
    it('should return true for leap year divisible by 4', () => {
      expect(isValidDate(2024, 2, 29)).toBe(true)
    })

    it('should return false for century year not divisible by 400', () => {
      expect(isValidDate(1900, 2, 29)).toBe(false)
    })

    it('should return true for century year divisible by 400', () => {
      expect(isValidDate(2000, 2, 29)).toBe(true)
    })

    it('should return false for non-leap year', () => {
      expect(isValidDate(2023, 2, 29)).toBe(false)
    })
  })
})

describe('validate - isValidTime', () => {
  describe('valid times', () => {
    it('should return true for midnight', () => {
      expect(isValidTime(0, 0, 0, 0)).toBe(true)
    })

    it('should return true for noon', () => {
      expect(isValidTime(12, 0, 0, 0)).toBe(true)
    })

    it('should return true for 23:59:59.999', () => {
      expect(isValidTime(23, 59, 59, 999)).toBe(true)
    })

    it('should return true for valid time', () => {
      expect(isValidTime(10, 30, 45, 123)).toBe(true)
    })
  })

  describe('invalid hour', () => {
    it('should return false for hour -1', () => {
      expect(isValidTime(-1, 0, 0, 0)).toBe(false)
    })

    it('should return false for hour 24', () => {
      expect(isValidTime(24, 0, 0, 0)).toBe(false)
    })

    it('should return false for hour greater than 24', () => {
      expect(isValidTime(25, 0, 0, 0)).toBe(false)
    })
  })

  describe('invalid minute', () => {
    it('should return false for minute -1', () => {
      expect(isValidTime(0, -1, 0, 0)).toBe(false)
    })

    it('should return false for minute 60', () => {
      expect(isValidTime(0, 60, 0, 0)).toBe(false)
    })

    it('should return false for minute greater than 60', () => {
      expect(isValidTime(0, 61, 0, 0)).toBe(false)
    })
  })

  describe('invalid second', () => {
    it('should return false for second -1', () => {
      expect(isValidTime(0, 0, -1, 0)).toBe(false)
    })

    it('should return false for second 60', () => {
      expect(isValidTime(0, 0, 60, 0)).toBe(false)
    })

    it('should return false for second greater than 60', () => {
      expect(isValidTime(0, 0, 61, 0)).toBe(false)
    })
  })

  describe('invalid millisecond', () => {
    it('should return false for millisecond -1', () => {
      expect(isValidTime(0, 0, 0, -1)).toBe(false)
    })

    it('should return false for millisecond 1000', () => {
      expect(isValidTime(0, 0, 0, 1000)).toBe(false)
    })

    it('should return false for millisecond greater than 1000', () => {
      expect(isValidTime(0, 0, 0, 1001)).toBe(false)
    })
  })
})

describe('validate - isValidTimezoneOffset', () => {
  describe('valid offsets', () => {
    it('should return true for UTC (0)', () => {
      expect(isValidTimezoneOffset(0)).toBe(true)
    })

    it('should return true for positive offset', () => {
      expect(isValidTimezoneOffset(60)).toBe(true) // UTC+1
    })

    it('should return true for negative offset', () => {
      expect(isValidTimezoneOffset(-300)).toBe(true) // UTC-5
    })

    it('should return true for minimum offset (-12 hours)', () => {
      expect(isValidTimezoneOffset(-720)).toBe(true)
    })

    it('should return true for maximum offset (+14 hours)', () => {
      expect(isValidTimezoneOffset(840)).toBe(true)
    })
  })

  describe('invalid offsets', () => {
    it('should return false for offset less than -720', () => {
      expect(isValidTimezoneOffset(-721)).toBe(false)
    })

    it('should return false for offset greater than 840', () => {
      expect(isValidTimezoneOffset(841)).toBe(false)
    })

    it('should return false for very negative offset', () => {
      expect(isValidTimezoneOffset(-1000)).toBe(false)
    })

    it('should return false for very positive offset', () => {
      expect(isValidTimezoneOffset(1000)).toBe(false)
    })
  })
})

describe('validate - isValidWeekStart', () => {
  describe('valid week starts', () => {
    it('should return true for Sunday (0)', () => {
      expect(isValidWeekStart(0)).toBe(true)
    })

    it('should return true for Monday (1)', () => {
      expect(isValidWeekStart(1)).toBe(true)
    })

    it('should return true for Tuesday (2)', () => {
      expect(isValidWeekStart(2)).toBe(true)
    })

    it('should return true for Wednesday (3)', () => {
      expect(isValidWeekStart(3)).toBe(true)
    })

    it('should return true for Thursday (4)', () => {
      expect(isValidWeekStart(4)).toBe(true)
    })

    it('should return true for Friday (5)', () => {
      expect(isValidWeekStart(5)).toBe(true)
    })

    it('should return true for Saturday (6)', () => {
      expect(isValidWeekStart(6)).toBe(true)
    })
  })

  describe('invalid week starts', () => {
    it('should return false for negative value', () => {
      expect(isValidWeekStart(-1)).toBe(false)
    })

    it('should return false for value greater than 6', () => {
      expect(isValidWeekStart(7)).toBe(false)
    })

    it('should return false for large value', () => {
      expect(isValidWeekStart(100)).toBe(false)
    })
  })
})
