import type { TimeUnitNormalized } from '../types.js'
import { getRelativeTimeThresholds, getDefaultLocale } from '../core/config.js'
import { getRelativeLabels } from '../locales/index.js'

// ============ RELATIVE TIME THRESHOLDS ============

interface Thresholds {
  second: number
  minute: number
  hour: number
  day: number
  month: number
}

// ============ GET TIME UNIT FOR DIFF ============

function getTimeUnitForMs(diffMs: number, thresholds: Thresholds): TimeUnitNormalized {
  const absMs = Math.abs(diffMs)

  if (absMs < thresholds.second * 1000) return 'second'
  if (absMs < thresholds.minute * 60 * 1000) return 'minute'
  if (absMs < thresholds.hour * 60 * 60 * 1000) return 'hour'
  if (absMs < thresholds.day * 24 * 60 * 60 * 1000) return 'day'

  // For weeks, check if less than a week
  if (absMs < 7 * 24 * 60 * 60 * 1000) return 'week'

  // For months, use average days
  if (absMs < thresholds.month * 30.44 * 24 * 60 * 60 * 1000) return 'month'

  return 'year'
}

// ============ GET VALUE IN UNIT ============

function getValueInUnit(ms: number, unit: TimeUnitNormalized): number {
  const msPerUnit: Record<TimeUnitNormalized, number> = {
    year: 31557600000, // 365.25 days
    month: 2629800000, // 30.44 days
    week: 604800000, // 7 days
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000,
    millisecond: 1,
  }

  return Math.round(ms / msPerUnit[unit])
}

// ============ FORMAT RELATIVE TIME ============

export function formatRelative(diffMs: number, isPast: boolean, withoutSuffix: boolean): string {
  const thresholds = getRelativeTimeThresholds() as Thresholds
  const labels = getRelativeLabels(getDefaultLocale())

  const unit = getTimeUnitForMs(diffMs, thresholds)
  const value = getValueInUnit(Math.abs(diffMs), unit)

  // Get the label key
  let key: string
  if (unit === 'week') {
    key = value === 1 ? 'w' : 'ww'
  } else {
    key = value === 1 ? unit.charAt(0) : unit.charAt(0) + unit.charAt(0)
  }

  const label = labels[key as keyof typeof labels]

  // Format the label
  let formatted: string
  if (typeof label === 'function') {
    formatted = label(value, withoutSuffix, key, !isPast)
  } else {
    // Replace %d with value
    formatted = label.replace('%d', String(value))
  }

  // Add suffix if needed
  if (withoutSuffix) {
    return formatted
  }

  const suffix = isPast ? labels.past : labels.future
  const suffixStr = typeof suffix === 'string' ? suffix : suffix(value, withoutSuffix, key, !isPast)
  return suffixStr.replace('%s', formatted)
}
