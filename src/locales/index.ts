import { localeEn } from './en.js'
import { localeTr } from './tr.js'

export interface Locale {
  name: string
  months: readonly string[]
  monthsShort: readonly string[]
  weekdays: readonly string[]
  weekdaysShort: readonly string[]
  weekdaysMin: readonly string[]
  relativeTime: Record<string, string | ((value: number, withoutSuffix: boolean, key: string, isFuture: boolean) => string)>
  ordinal: (n: number) => string
  formats: Record<string, string>
}

// ============ LOCALE REGISTRY ============

const locales: Record<string, Locale> = {
  en: localeEn,
  tr: localeTr,
}

// ============ GET LOCALE ============

export function getLocale(name: string): Locale | undefined {
  return locales[name]
}

// ============ REGISTER LOCALE ============

export function registerLocale(locale: Locale): void {
  locales[locale.name] = locale
}

// ============ GET MONTH NAME ============

export function getMonthName(locale: string, month: number): string {
  const loc = locales[locale]
  if (!loc) return localeEn.months[month] ?? ''
  return loc.months[month] ?? ''
}

export function getMonthNameShort(locale: string, month: number): string {
  const loc = locales[locale]
  if (!loc) return localeEn.monthsShort[month] ?? ''
  return loc.monthsShort[month] ?? ''
}

// ============ GET WEEKDAY NAME ============

export function getWeekdayName(locale: string, day: number): string {
  const loc = locales[locale]
  if (!loc) return localeEn.weekdays[day] ?? ''
  return loc.weekdays[day] ?? ''
}

export function getWeekdayNameShort(locale: string, day: number): string {
  const loc = locales[locale]
  if (!loc) return localeEn.weekdaysShort[day] ?? ''
  return loc.weekdaysShort[day] ?? ''
}

export function getWeekdayNameMin(locale: string, day: number): string {
  const loc = locales[locale]
  if (!loc) return localeEn.weekdaysMin[day] ?? ''
  return loc.weekdaysMin[day] ?? ''
}

// ============ GET ORDINAL ============

export function getOrdinal(locale: string, n: number): string {
  const loc = locales[locale]
  if (!loc || !loc.ordinal) return localeEn.ordinal(n)
  return loc.ordinal(n)
}

// ============ GET RELATIVE LABELS ============

export function getRelativeLabels(locale: string) {
  const loc = locales[locale]
  return loc?.relativeTime ?? localeEn.relativeTime
}

// ============ EXPORTS ============

export { localeEn, localeTr }
