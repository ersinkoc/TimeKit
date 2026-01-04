import type { Time } from '../types.js'
import { TimeImpl } from './time.js'
import { pad, formatUtcOffset } from '../utils/helpers.js'
import { getDefaultLocale, getDefaultFormat } from './config.js'
import { getMonthName, getMonthNameShort, getWeekdayName, getWeekdayNameShort, getWeekdayNameMin, getOrdinal as getLocaleOrdinal } from '../locales/index.js'

// ============ FORMAT TOKENS ============

type FormatToken = (t: Time) => string | number

const TOKENS: Record<string, FormatToken> = {
  // Year
  YYYY: (t) => t.year(),
  YY: (t) => String(t.year()).slice(-2),

  // Month
  MMMM: (t) => getMonthName(getDefaultLocale(), t.month() - 1),
  MMM: (t) => getMonthNameShort(getDefaultLocale(), t.month() - 1),
  MM: (t) => pad(t.month()),
  M: (t) => t.month(),

  // Day of month
  DD: (t) => pad(t.date()),
  D: (t) => t.date(),
  Do: (t) => getLocaleOrdinal(getDefaultLocale(), t.date()),

  // Day of week
  dddd: (t) => getWeekdayName(getDefaultLocale(), t.day()),
  ddd: (t) => getWeekdayNameShort(getDefaultLocale(), t.day()),
  dd: (t) => getWeekdayNameMin(getDefaultLocale(), t.day()),
  d: (t) => t.day(),
  E: (t) => (t.day() === 0 ? 7 : t.day()), // ISO: Monday = 1, Sunday = 7

  // Hour
  HH: (t) => pad(t.hour()),
  H: (t) => t.hour(),
  hh: (t) => {
    const h = t.hour() % 12
    return pad(h === 0 ? 12 : h)
  },
  h: (t) => {
    const h = t.hour() % 12
    return h === 0 ? 12 : h
  },

  // Minute
  mm: (t) => pad(t.minute()),
  m: (t) => t.minute(),

  // Second
  ss: (t) => pad(t.second()),
  s: (t) => t.second(),

  // Millisecond
  SSS: (t) => pad(t.millisecond(), 3),
  SS: (t) => pad(Math.floor(t.millisecond() / 10)),
  S: (t) => Math.floor(t.millisecond() / 100),

  // AM/PM
  A: (t) => (t.hour() < 12 ? 'AM' : 'PM'),
  a: (t) => (t.hour() < 12 ? 'am' : 'pm'),

  // Timezone
  Z: (t) => formatUtcOffset((t as TimeImpl).utcOffset() ?? 0, true),
  ZZ: (t) => formatUtcOffset((t as TimeImpl).utcOffset() ?? 0, false),
  z: (t) => (t as TimeImpl).timezone(),
  zzz: (t) => (t as TimeImpl).timezone(),

  // Timestamp
  X: (t) => t.toUnix(),
  x: (t) => t.toTimestamp(),

  // Quarter
  Q: (t) => t.quarter(),
  Qo: (t) => getLocaleOrdinal(getDefaultLocale(), t.quarter()),

  // Week of year
  W: (t) => t.weekOfYear(),
  WW: (t) => pad(t.weekOfYear()),
  Wo: (t) => getLocaleOrdinal(getDefaultLocale(), t.weekOfYear()),

  // Day of year
  DDD: (t) => t.dayOfYear(),
  DDDD: (t) => pad(t.dayOfYear(), 3),
}

// ============ MAIN FORMAT FUNCTION ============

export function formatTime(time: Time, pattern?: string): string {
  if (!time.isValid()) return 'Invalid Date'

  const fmt = pattern ?? getDefaultFormat('datetime')

  // Tokenize the format string
  const result = fmt.replace(/\[([^\]]+)\]|([a-zA-Z]+)/g, (_, escaped, token) => {
    // Escaped text
    if (escaped) return escaped

    // Format token
    const fn = TOKENS[token]
    if (fn) {
      return String(fn(time))
    }

    // Unknown token, return as-is
    return token
  })

  return result
}

// ============ FORMAT WITH LOCALE ============

export function formatWithLocale(time: Time, pattern: string, _locale: string): string {
  // Note: This would require modifying the config system to support per-operation locale
  // For now, use the default locale
  return formatTime(time, pattern)
}
