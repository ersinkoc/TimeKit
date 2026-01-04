import type { TimeUnit, TimeUnitNormalized } from '../types.js'

// ============ MONTH NAMES ============

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

// ============ DAY NAMES ============

export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export const DAY_NAMES_MIN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const

// ============ DAYS IN MONTH ============

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

export const DAYS_IN_MONTH_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

// ============ TIME UNIT NORMALIZATION ============

export function normalizeTimeUnit(unit: TimeUnit): TimeUnitNormalized {
  const map: Record<TimeUnit, TimeUnitNormalized> = {
    year: 'year',
    years: 'year',
    y: 'year',
    month: 'month',
    months: 'month',
    M: 'month',
    week: 'week',
    weeks: 'week',
    w: 'week',
    day: 'day',
    days: 'day',
    d: 'day',
    date: 'day',
    hour: 'hour',
    hours: 'hour',
    h: 'hour',
    minute: 'minute',
    minutes: 'minute',
    m: 'minute',
    second: 'second',
    seconds: 'second',
    s: 'second',
    millisecond: 'millisecond',
    milliseconds: 'millisecond',
    ms: 'millisecond',
  }
  return map[unit]
}

// ============ MILLISECONDS PER UNIT ============

export const MS_PER_UNIT = {
  year: 31557600000, // 365.25 days
  month: 2629800000, // 30.44 days
  week: 604800000, // 7 days
  day: 86400000, // 24 hours
  hour: 3600000, // 60 minutes
  minute: 60000, // 60 seconds
  second: 1000,
  millisecond: 1,
} as const

// ============ DEFAULT FORMATS ============

export const DEFAULT_FORMATS = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm:ss',
  datetime: 'YYYY-MM-DD HH:mm:ss',
} as const

// ============ DEFAULT THRESHOLDS ============

export const DEFAULT_THRESHOLDS = {
  second: 45,
  minute: 45,
  hour: 22,
  day: 26,
  month: 11,
} as const

// ============ DEFAULT RELATIVE TIME LABELS ============

export const DEFAULT_RELATIVE_LABELS = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  w: 'a week',
  ww: '%d weeks',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years',
} as const

// ============ WEEK CONFIGURATION ============

export const DEFAULT_WEEK_STARTS_ON = 1 as const // Monday

export const DEFAULT_FIRST_WEEK_CONTAINS_DATE = 4 as const

// ============ ISO 8601 REGEX ============

export const ISO_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-]\d{2}):?(\d{2}))?)?$/i

// ============ COMMON FORMAT REGEX ============

export const DD_MM_YYYY_REGEX = /^(\d{1,2})[-./](\d{1,2})[-./](\d{4})/

export const MM_DD_YYYY_REGEX = /^(\d{1,2})[-./](\d{1,2})[-./](\d{4})/

export const MONTH_NAME_REGEX = /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/

export const SHORT_MONTH_NAME_REGEX = /^([A-Za-z]{3})\s+(\d{1,2}),?\s+(\d{4})/

// ============ ORDINAL SUFFIXES ============

export const ORDINAL_SUFFIXES = ['th', 'st', 'nd', 'rd'] as const

// ============ UTC OFFSET LIMITS ============

export const MAX_OFFSET_MINUTES = 12 * 60 // UTC+12
export const MIN_OFFSET_MINUTES = -12 * 60 // UTC-12
