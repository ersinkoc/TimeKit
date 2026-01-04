import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import {
  configure,
  getConfig,
  setDefaultTimezone,
  getDefaultTimezone,
  setDefaultLocale,
  getDefaultLocale,
  setWeekStartsOn,
  getWeekStartsOn,
  resetConfig,
  getDefaultFormat,
  getRelativeTimeThresholds,
  getRelativeTimeLabels
} from '../src/core/config.js'

describe('config - configure', () => {
  beforeEach(() => {
    resetConfig()
  })

  afterEach(() => {
    resetConfig()
  })

  it('should configure locale', () => {
    configure({ locale: 'tr' })
    const config = getConfig()
    expect(config.locale).toBe('tr')
  })

  it('should configure weekStartsOn', () => {
    configure({ weekStartsOn: 1 })
    const config = getConfig()
    expect(config.weekStartsOn).toBe(1)
  })

  it('should configure timezone', () => {
    configure({ timezone: 'America/New_York' })
    const config = getConfig()
    expect(config.timezone).toBe('America/New_York')
  })

  it('should configure formats', () => {
    configure({
      formats: {
        date: 'DD/MM/YYYY',
        time: 'HH:mm',
        datetime: 'DD/MM/YYYY HH:mm'
      }
    })
    const config = getConfig()
    expect(config.formats?.date).toBe('DD/MM/YYYY')
    expect(config.formats?.time).toBe('HH:mm')
    expect(config.formats?.datetime).toBe('DD/MM/YYYY HH:mm')
  })

  it('should configure relativeTimeThresholds', () => {
    configure({
      relativeTimeThresholds: {
        second: 45,
        minute: 45
      }
    })
    const config = getConfig()
    expect(config.relativeTimeThresholds?.second).toBe(45)
    expect(config.relativeTimeThresholds?.minute).toBe(45)
  })

  it('should configure relativeTimeLabels', () => {
    configure({
      relativeTimeLabels: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes'
      }
    })
    const config = getConfig()
    expect(config.relativeTimeLabels?.future).toBe('in %s')
    expect(config.relativeTimeLabels?.s).toBe('a few seconds')
  })

  it('should merge with existing config', () => {
    configure({ locale: 'tr' })
    configure({ weekStartsOn: 1 })
    const config = getConfig()
    expect(config.locale).toBe('tr')
    expect(config.weekStartsOn).toBe(1)
  })

  it('should merge formats with existing formats', () => {
    configure({
      formats: { date: 'DD/MM/YYYY' }
    })
    configure({
      formats: { time: 'HH:mm' }
    })
    const config = getConfig()
    expect(config.formats?.date).toBe('DD/MM/YYYY')
    expect(config.formats?.time).toBe('HH:mm')
  })

  it('should merge relativeTimeThresholds with existing', () => {
    configure({
      relativeTimeThresholds: { second: 45 }
    })
    configure({
      relativeTimeThresholds: { minute: 45 }
    })
    const config = getConfig()
    expect(config.relativeTimeThresholds?.second).toBe(45)
    expect(config.relativeTimeThresholds?.minute).toBe(45)
  })

  it('should replace relativeTimeLabels', () => {
    configure({
      relativeTimeLabels: {
        future: 'in %s',
        past: '%s ago'
      }
    })
    configure({
      relativeTimeLabels: {
        future: 'yakında %s',
        past: '%s önce'
      }
    })
    const config = getConfig()
    expect(config.relativeTimeLabels?.future).toBe('yakında %s')
    expect(config.relativeTimeLabels?.past).toBe('%s önce')
  })
})

describe('config - getConfig', () => {
  beforeEach(() => {
    resetConfig()
  })

  afterEach(() => {
    resetConfig()
  })

  it('should return default config', () => {
    const config = getConfig()
    expect(config.locale).toBe('en')
    expect(config.weekStartsOn).toBe(1) // Default is Monday (1)
    expect(config.formats).toBeDefined()
    expect(config.relativeTimeThresholds).toBeDefined()
  })

  it('should return copy of config (not reference)', () => {
    const config1 = getConfig()
    const config2 = getConfig()
    expect(config1).not.toBe(config2)
  })

  it('should reflect changes made by configure', () => {
    configure({ locale: 'tr' })
    const config = getConfig()
    expect(config.locale).toBe('tr')
  })
})

describe('config - setDefaultTimezone & getDefaultTimezone', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should set and get default timezone', () => {
    setDefaultTimezone('America/New_York')
    expect(getDefaultTimezone()).toBe('America/New_York')
  })

  it('should set and get UTC timezone', () => {
    setDefaultTimezone('UTC')
    expect(getDefaultTimezone()).toBe('UTC')
  })

  it('should set and get Europe timezone', () => {
    setDefaultTimezone('Europe/London')
    expect(getDefaultTimezone()).toBe('Europe/London')
  })

  it('should return undefined when not set', () => {
    resetConfig()
    expect(getDefaultTimezone()).toBeUndefined()
  })

  it('should update timezone when set multiple times', () => {
    setDefaultTimezone('America/New_York')
    expect(getDefaultTimezone()).toBe('America/New_York')
    setDefaultTimezone('Asia/Tokyo')
    expect(getDefaultTimezone()).toBe('Asia/Tokyo')
  })
})

describe('config - setDefaultLocale & getDefaultLocale', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should return default locale as en', () => {
    expect(getDefaultLocale()).toBe('en')
  })

  it('should set and get Turkish locale', () => {
    setDefaultLocale('tr')
    expect(getDefaultLocale()).toBe('tr')
  })

  it('should set and get custom locale', () => {
    setDefaultLocale('fr')
    expect(getDefaultLocale()).toBe('fr')
  })

  it('should update locale when set multiple times', () => {
    setDefaultLocale('tr')
    expect(getDefaultLocale()).toBe('tr')
    setDefaultLocale('de')
    expect(getDefaultLocale()).toBe('de')
  })

  it('should return en after reset', () => {
    setDefaultLocale('tr')
    resetConfig()
    expect(getDefaultLocale()).toBe('en')
  })
})

describe('config - setWeekStartsOn & getWeekStartsOn', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should return default as Monday (1)', () => {
    expect(getWeekStartsOn()).toBe(1)
  })

  it('should set and get Monday (1)', () => {
    setWeekStartsOn(1)
    expect(getWeekStartsOn()).toBe(1)
  })

  it('should set and get Tuesday (2)', () => {
    setWeekStartsOn(2)
    expect(getWeekStartsOn()).toBe(2)
  })

  it('should set and get Wednesday (3)', () => {
    setWeekStartsOn(3)
    expect(getWeekStartsOn()).toBe(3)
  })

  it('should set and get Thursday (4)', () => {
    setWeekStartsOn(4)
    expect(getWeekStartsOn()).toBe(4)
  })

  it('should set and get Friday (5)', () => {
    setWeekStartsOn(5)
    expect(getWeekStartsOn()).toBe(5)
  })

  it('should set and get Saturday (6)', () => {
    setWeekStartsOn(6)
    expect(getWeekStartsOn()).toBe(6)
  })

  it('should update weekStartsOn when set multiple times', () => {
    setWeekStartsOn(1)
    expect(getWeekStartsOn()).toBe(1)
    setWeekStartsOn(6)
    expect(getWeekStartsOn()).toBe(6)
  })

  it('should return Monday (1) after reset', () => {
    setWeekStartsOn(0)
    resetConfig()
    expect(getWeekStartsOn()).toBe(1)
  })
})

describe('config - resetConfig', () => {
  it('should reset locale to default', () => {
    setDefaultLocale('tr')
    resetConfig()
    expect(getDefaultLocale()).toBe('en')
  })

  it('should reset weekStartsOn to default', () => {
    setWeekStartsOn(0)
    resetConfig()
    expect(getWeekStartsOn()).toBe(1)
  })

  it('should reset timezone to undefined', () => {
    setDefaultTimezone('America/New_York')
    resetConfig()
    expect(getDefaultTimezone()).toBeUndefined()
  })

  it('should reset all config properties', () => {
    configure({
      locale: 'tr',
      weekStartsOn: 0,
      timezone: 'Europe/Istanbul'
    })
    resetConfig()
    const config = getConfig()
    expect(config.locale).toBe('en')
    expect(config.weekStartsOn).toBe(1)
    expect(config.timezone).toBeUndefined()
  })

  it('should reset formats to defaults', () => {
    configure({
      formats: { date: 'DD/MM/YYYY' }
    })
    resetConfig()
    const format = getDefaultFormat('date')
    expect(format).toBeDefined()
  })

  it('should reset thresholds to defaults', () => {
    configure({
      relativeTimeThresholds: { second: 100 }
    })
    resetConfig()
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.second).not.toBe(100)
  })
})

describe('config - getDefaultFormat', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should return default date format', () => {
    const format = getDefaultFormat('date')
    expect(typeof format).toBe('string')
    expect(format.length).toBeGreaterThan(0)
  })

  it('should return default time format', () => {
    const format = getDefaultFormat('time')
    expect(typeof format).toBe('string')
    expect(format.length).toBeGreaterThan(0)
  })

  it('should return default datetime format', () => {
    const format = getDefaultFormat('datetime')
    expect(typeof format).toBe('string')
    expect(format.length).toBeGreaterThan(0)
  })

  it('should return custom date format when configured', () => {
    configure({
      formats: { date: 'DD/MM/YYYY' }
    })
    const format = getDefaultFormat('date')
    expect(format).toBe('DD/MM/YYYY')
  })

  it('should return custom time format when configured', () => {
    configure({
      formats: { time: 'HH:mm' }
    })
    const format = getDefaultFormat('time')
    expect(format).toBe('HH:mm')
  })

  it('should return custom datetime format when configured', () => {
    configure({
      formats: { datetime: 'DD/MM/YYYY HH:mm:ss' }
    })
    const format = getDefaultFormat('datetime')
    expect(format).toBe('DD/MM/YYYY HH:mm:ss')
  })

  it('should default to datetime when type not specified', () => {
    const format = getDefaultFormat()
    expect(typeof format).toBe('string')
  })
})

describe('config - getRelativeTimeThresholds', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should return default thresholds', () => {
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds).toBeDefined()
    expect(typeof thresholds.second).toBe('number')
    expect(typeof thresholds.minute).toBe('number')
    expect(typeof thresholds.hour).toBe('number')
    expect(typeof thresholds.day).toBe('number')
    expect(typeof thresholds.month).toBe('number')
  })

  it('should return custom second threshold when configured', () => {
    configure({
      relativeTimeThresholds: { second: 60 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.second).toBe(60)
  })

  it('should return custom minute threshold when configured', () => {
    configure({
      relativeTimeThresholds: { minute: 60 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.minute).toBe(60)
  })

  it('should return custom hour threshold when configured', () => {
    configure({
      relativeTimeThresholds: { hour: 30 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.hour).toBe(30)
  })

  it('should return custom day threshold when configured', () => {
    configure({
      relativeTimeThresholds: { day: 30 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.day).toBe(30)
  })

  it('should return custom month threshold when configured', () => {
    configure({
      relativeTimeThresholds: { month: 12 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.month).toBe(12)
  })

  it('should merge custom thresholds with defaults', () => {
    configure({
      relativeTimeThresholds: { second: 60 }
    })
    const thresholds = getRelativeTimeThresholds()
    expect(thresholds.second).toBe(60)
    expect(thresholds.minute).toBeDefined() // Should have default value
  })

  it('should return copy of thresholds (not reference)', () => {
    const thresholds1 = getRelativeTimeThresholds()
    const thresholds2 = getRelativeTimeThresholds()
    expect(thresholds1).not.toBe(thresholds2)
  })
})

describe('config - getRelativeTimeLabels', () => {
  afterEach(() => {
    resetConfig()
  })

  it('should return default labels', () => {
    const labels = getRelativeTimeLabels()
    expect(labels).toBeDefined()
    expect(labels.future).toBeDefined()
    expect(labels.past).toBeDefined()
    expect(labels.s).toBeDefined()
    expect(labels.ss).toBeDefined()
    expect(labels.m).toBeDefined()
    expect(labels.mm).toBeDefined()
    expect(labels.h).toBeDefined()
    expect(labels.hh).toBeDefined()
    expect(labels.d).toBeDefined()
    expect(labels.dd).toBeDefined()
    expect(labels.M).toBeDefined()
    expect(labels.MM).toBeDefined()
    expect(labels.y).toBeDefined()
    expect(labels.yy).toBeDefined()
  })

  it('should return custom future label when configured', () => {
    configure({
      relativeTimeLabels: {
        future: 'in %s',
        past: '%s ago'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.future).toBe('in %s')
  })

  it('should return custom past label when configured', () => {
    configure({
      relativeTimeLabels: {
        future: 'in %s',
        past: '%s ago'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.past).toBe('%s ago')
  })

  it('should return custom second labels when configured', () => {
    configure({
      relativeTimeLabels: {
        s: 'a second',
        ss: '%d seconds'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.s).toBe('a second')
    expect(labels.ss).toBe('%d seconds')
  })

  it('should return custom minute labels when configured', () => {
    configure({
      relativeTimeLabels: {
        m: 'a minute',
        mm: '%d minutes'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.m).toBe('a minute')
    expect(labels.mm).toBe('%d minutes')
  })

  it('should return custom hour labels when configured', () => {
    configure({
      relativeTimeLabels: {
        h: 'an hour',
        hh: '%d hours'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.h).toBe('an hour')
    expect(labels.hh).toBe('%d hours')
  })

  it('should return custom day labels when configured', () => {
    configure({
      relativeTimeLabels: {
        d: 'a day',
        dd: '%d days'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.d).toBe('a day')
    expect(labels.dd).toBe('%d days')
  })

  it('should return custom month labels when configured', () => {
    configure({
      relativeTimeLabels: {
        M: 'a month',
        MM: '%d months'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.M).toBe('a month')
    expect(labels.MM).toBe('%d months')
  })

  it('should return custom year labels when configured', () => {
    configure({
      relativeTimeLabels: {
        y: 'a year',
        yy: '%d years'
      }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.y).toBe('a year')
    expect(labels.yy).toBe('%d years')
  })

  it('should merge custom labels with defaults', () => {
    configure({
      relativeTimeLabels: { s: 'a second' }
    })
    const labels = getRelativeTimeLabels()
    expect(labels.s).toBe('a second')
    expect(labels.m).toBeDefined() // Should have default value
  })

  it('should return copy of labels (not reference)', () => {
    const labels1 = getRelativeTimeLabels()
    const labels2 = getRelativeTimeLabels()
    expect(labels1).not.toBe(labels2)
  })
})
