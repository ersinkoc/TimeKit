import type { TimeConfig } from '../types.js'
import { DEFAULT_FORMATS, DEFAULT_THRESHOLDS, DEFAULT_RELATIVE_LABELS, DEFAULT_WEEK_STARTS_ON, DEFAULT_FIRST_WEEK_CONTAINS_DATE } from '../utils/constants.js'

// ============ GLOBAL CONFIG ============

let globalConfig: TimeConfig = {
  locale: 'en',
  weekStartsOn: DEFAULT_WEEK_STARTS_ON,
  firstWeekContainsDate: DEFAULT_FIRST_WEEK_CONTAINS_DATE,
  formats: { ...DEFAULT_FORMATS },
  relativeTimeThresholds: { ...DEFAULT_THRESHOLDS },
  relativeTimeLabels: { ...DEFAULT_RELATIVE_LABELS },
}

// ============ CONFIGURE ============

export function configure(config: TimeConfig): void {
  globalConfig = {
    ...globalConfig,
    ...config,
    formats: {
      ...globalConfig.formats,
      ...config.formats,
    },
    relativeTimeThresholds: {
      ...globalConfig.relativeTimeThresholds,
      ...config.relativeTimeThresholds,
    },
    relativeTimeLabels: config.relativeTimeLabels
      ? { ...config.relativeTimeLabels }
      : globalConfig.relativeTimeLabels,
  }
}

// ============ GET CONFIG ============

export function getConfig(): TimeConfig {
  return { ...globalConfig }
}

// ============ SET DEFAULT TIMEZONE ============

export function setDefaultTimezone(timezone: string): void {
  globalConfig.timezone = timezone
}

// ============ GET DEFAULT TIMEZONE ============

export function getDefaultTimezone(): string | undefined {
  return globalConfig.timezone
}

// ============ SET DEFAULT LOCALE ============

export function setDefaultLocale(locale: string): void {
  globalConfig.locale = locale
}

// ============ GET DEFAULT LOCALE ============

export function getDefaultLocale(): string {
  return globalConfig.locale || 'en'
}

// ============ SET WEEK STARTS ON ============

export function setWeekStartsOn(weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6): void {
  globalConfig.weekStartsOn = weekStartsOn
}

// ============ GET WEEK STARTS ON ============

export function getWeekStartsOn(): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return globalConfig.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON
}

// ============ RESET CONFIG ============

export function resetConfig(): void {
  globalConfig = {
    locale: 'en',
    weekStartsOn: DEFAULT_WEEK_STARTS_ON,
    firstWeekContainsDate: DEFAULT_FIRST_WEEK_CONTAINS_DATE,
    formats: { ...DEFAULT_FORMATS },
    relativeTimeThresholds: { ...DEFAULT_THRESHOLDS },
    relativeTimeLabels: { ...DEFAULT_RELATIVE_LABELS },
  }
}

// ============ GET DEFAULT FORMAT ============

export function getDefaultFormat(type: 'date' | 'time' | 'datetime' = 'datetime'): string {
  return globalConfig.formats?.[type] ?? DEFAULT_FORMATS[type]
}

// ============ GET RELATIVE TIME THRESHOLDS ============

export function getRelativeTimeThresholds() {
  return { ...DEFAULT_THRESHOLDS, ...globalConfig.relativeTimeThresholds }
}

// ============ GET RELATIVE TIME LABELS ============

export function getRelativeTimeLabels() {
  return {
    future: (globalConfig.relativeTimeLabels?.future ?? DEFAULT_RELATIVE_LABELS.future) as string,
    past: (globalConfig.relativeTimeLabels?.past ?? DEFAULT_RELATIVE_LABELS.past) as string,
    s: globalConfig.relativeTimeLabels?.s ?? DEFAULT_RELATIVE_LABELS.s,
    ss: globalConfig.relativeTimeLabels?.ss ?? DEFAULT_RELATIVE_LABELS.ss,
    m: globalConfig.relativeTimeLabels?.m ?? DEFAULT_RELATIVE_LABELS.m,
    mm: globalConfig.relativeTimeLabels?.mm ?? DEFAULT_RELATIVE_LABELS.mm,
    h: globalConfig.relativeTimeLabels?.h ?? DEFAULT_RELATIVE_LABELS.h,
    hh: globalConfig.relativeTimeLabels?.hh ?? DEFAULT_RELATIVE_LABELS.hh,
    d: globalConfig.relativeTimeLabels?.d ?? DEFAULT_RELATIVE_LABELS.d,
    dd: globalConfig.relativeTimeLabels?.dd ?? DEFAULT_RELATIVE_LABELS.dd,
    w: globalConfig.relativeTimeLabels?.w ?? DEFAULT_RELATIVE_LABELS.w,
    ww: globalConfig.relativeTimeLabels?.ww ?? DEFAULT_RELATIVE_LABELS.ww,
    M: globalConfig.relativeTimeLabels?.M ?? DEFAULT_RELATIVE_LABELS.M,
    MM: globalConfig.relativeTimeLabels?.MM ?? DEFAULT_RELATIVE_LABELS.MM,
    y: globalConfig.relativeTimeLabels?.y ?? DEFAULT_RELATIVE_LABELS.y,
    yy: globalConfig.relativeTimeLabels?.yy ?? DEFAULT_RELATIVE_LABELS.yy,
  }
}
