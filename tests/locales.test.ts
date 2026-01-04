import { describe, it, expect } from 'vitest'
import {
  getLocale,
  registerLocale,
  getMonthName,
  getMonthNameShort,
  getWeekdayName,
  getWeekdayNameShort,
  getWeekdayNameMin,
  getOrdinal,
  getRelativeLabels,
  localeEn,
  localeTr
} from '../src/locales/index.js'

describe('locales - getLocale', () => {
  it('should return English locale', () => {
    const locale = getLocale('en')
    expect(locale).toBeDefined()
    expect(locale?.name).toBe('en')
  })

  it('should return Turkish locale', () => {
    const locale = getLocale('tr')
    expect(locale).toBeDefined()
    expect(locale?.name).toBe('tr')
  })

  it('should return undefined for unknown locale', () => {
    const locale = getLocale('unknown')
    expect(locale).toBeUndefined()
  })

  it('should return locale with months array', () => {
    const locale = getLocale('en')
    expect(locale?.months).toBeDefined()
    expect(locale?.months.length).toBe(12)
  })

  it('should return locale with monthsShort array', () => {
    const locale = getLocale('en')
    expect(locale?.monthsShort).toBeDefined()
    expect(locale?.monthsShort.length).toBe(12)
  })

  it('should return locale with weekdays array', () => {
    const locale = getLocale('en')
    expect(locale?.weekdays).toBeDefined()
    expect(locale?.weekdays.length).toBe(7)
  })

  it('should return locale with weekdaysShort array', () => {
    const locale = getLocale('en')
    expect(locale?.weekdaysShort).toBeDefined()
    expect(locale?.weekdaysShort.length).toBe(7)
  })

  it('should return locale with weekdaysMin array', () => {
    const locale = getLocale('en')
    expect(locale?.weekdaysMin).toBeDefined()
    expect(locale?.weekdaysMin.length).toBe(7)
  })

  it('should return locale with relativeTime object', () => {
    const locale = getLocale('en')
    expect(locale?.relativeTime).toBeDefined()
  })

  it('should return locale with ordinal function', () => {
    const locale = getLocale('en')
    expect(typeof locale?.ordinal).toBe('function')
  })

  it('should return locale with formats object', () => {
    const locale = getLocale('en')
    expect(locale?.formats).toBeDefined()
  })
})

describe('locales - registerLocale', () => {
  it('should register custom locale', () => {
    const customLocale = {
      name: 'fr',
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] as const,
      monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'] as const,
      weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const,
      weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'] as const,
      weekdaysMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'] as const,
      relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        ss: '%d secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
      },
      ordinal: (n: number) => n + (n === 1 ? 'er' : 'e'),
      formats: {
        date: 'DD/MM/YYYY',
        time: 'HH:mm',
        datetime: 'DD/MM/YYYY HH:mm'
      }
    }

    registerLocale(customLocale)
    const locale = getLocale('fr')
    expect(locale).toBeDefined()
    expect(locale?.name).toBe('fr')
  })
})

describe('locales - getMonthName', () => {
  it('should return English month names', () => {
    expect(getMonthName('en', 0)).toBe('January')
    expect(getMonthName('en', 5)).toBe('June')
    expect(getMonthName('en', 11)).toBe('December')
  })

  it('should return Turkish month names', () => {
    expect(getMonthName('tr', 0)).toBe('Ocak')
    expect(getMonthName('tr', 5)).toBe('Haziran')
    expect(getMonthName('tr', 11)).toBe('Aralık')
  })

  it('should return empty string for invalid month index', () => {
    expect(getMonthName('en', -1)).toBe('')
    expect(getMonthName('en', 12)).toBe('')
    expect(getMonthName('en', 100)).toBe('')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getMonthName('unknown', 0)).toBe('January')
  })

  it('should return empty string for out of bounds month', () => {
    expect(getMonthName('en', 13)).toBe('')
  })
})

describe('locales - getMonthNameShort', () => {
  it('should return English short month names', () => {
    expect(getMonthNameShort('en', 0)).toBe('Jan')
    expect(getMonthNameShort('en', 5)).toBe('Jun')
    expect(getMonthNameShort('en', 11)).toBe('Dec')
  })

  it('should return Turkish short month names', () => {
    expect(getMonthNameShort('tr', 0)).toBe('Oca')
    expect(getMonthNameShort('tr', 5)).toBe('Haz')
    expect(getMonthNameShort('tr', 11)).toBe('Ara')
  })

  it('should return empty string for invalid month index', () => {
    expect(getMonthNameShort('en', -1)).toBe('')
    expect(getMonthNameShort('en', 12)).toBe('')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getMonthNameShort('unknown', 0)).toBe('Jan')
  })
})

describe('locales - getWeekdayName', () => {
  it('should return English weekday names', () => {
    expect(getWeekdayName('en', 0)).toBe('Sunday')
    expect(getWeekdayName('en', 1)).toBe('Monday')
    expect(getWeekdayName('en', 6)).toBe('Saturday')
  })

  it('should return Turkish weekday names', () => {
    expect(getWeekdayName('tr', 0)).toBe('Pazar')
    expect(getWeekdayName('tr', 1)).toBe('Pazartesi')
    expect(getWeekdayName('tr', 6)).toBe('Cumartesi')
  })

  it('should return empty string for invalid day index', () => {
    expect(getWeekdayName('en', -1)).toBe('')
    expect(getWeekdayName('en', 7)).toBe('')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getWeekdayName('unknown', 0)).toBe('Sunday')
  })
})

describe('locales - getWeekdayNameShort', () => {
  it('should return English short weekday names', () => {
    expect(getWeekdayNameShort('en', 0)).toBe('Sun')
    expect(getWeekdayNameShort('en', 1)).toBe('Mon')
    expect(getWeekdayNameShort('en', 6)).toBe('Sat')
  })

  it('should return Turkish short weekday names', () => {
    expect(getWeekdayNameShort('tr', 0)).toBe('Paz')
    expect(getWeekdayNameShort('tr', 1)).toBe('Pzt')
    expect(getWeekdayNameShort('tr', 6)).toBe('Cmt')
  })

  it('should return empty string for invalid day index', () => {
    expect(getWeekdayNameShort('en', -1)).toBe('')
    expect(getWeekdayNameShort('en', 7)).toBe('')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getWeekdayNameShort('unknown', 0)).toBe('Sun')
  })
})

describe('locales - getWeekdayNameMin', () => {
  it('should return English min weekday names', () => {
    expect(getWeekdayNameMin('en', 0)).toBe('Su')
    expect(getWeekdayNameMin('en', 1)).toBe('Mo')
    expect(getWeekdayNameMin('en', 6)).toBe('Sa')
  })

  it('should return Turkish min weekday names', () => {
    expect(getWeekdayNameMin('tr', 0)).toBe('Pz')
    expect(getWeekdayNameMin('tr', 1)).toBe('Pt')
    expect(getWeekdayNameMin('tr', 6)).toBe('Ct')
  })

  it('should return empty string for invalid day index', () => {
    expect(getWeekdayNameMin('en', -1)).toBe('')
    expect(getWeekdayNameMin('en', 7)).toBe('')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getWeekdayNameMin('unknown', 0)).toBe('Su')
  })
})

describe('locales - getOrdinal', () => {
  it('should return English ordinals', () => {
    // The English ordinal function: `${n}${s[(v - 20) % 10] || s[v] || s[0]}`
    // where s = ['th', 'st', 'nd', 'rd']
    expect(getOrdinal('en', 1)).toBe('1st')
    expect(getOrdinal('en', 2)).toBe('2nd')
    expect(getOrdinal('en', 3)).toBe('3rd')
    expect(getOrdinal('en', 4)).toBe('4th')
    expect(getOrdinal('en', 11)).toBe('11th')
    expect(getOrdinal('en', 12)).toBe('12th')
    expect(getOrdinal('en', 13)).toBe('13th')
    expect(getOrdinal('en', 21)).toBe('21st')
    expect(getOrdinal('en', 22)).toBe('22nd')
    expect(getOrdinal('en', 23)).toBe('23rd')
    expect(getOrdinal('en', 100)).toBe('100th')
  })

  it('should return Turkish ordinals', () => {
    expect(getOrdinal('tr', 1)).toBe('1.')
    expect(getOrdinal('tr', 2)).toBe('2.')
    expect(getOrdinal('tr', 5)).toBe('5.')
  })

  it('should fallback to English for unknown locale', () => {
    expect(getOrdinal('unknown', 1)).toBe('1st')
  })

  it('should handle zero', () => {
    expect(getOrdinal('en', 0)).toBe('0th')
  })

  it('should handle large numbers', () => {
    expect(getOrdinal('en', 101)).toBe('101st')
    expect(getOrdinal('en', 111)).toBe('111th')
  })
})

describe('locales - getRelativeLabels', () => {
  it('should return English relative time labels', () => {
    const labels = getRelativeLabels('en')
    expect(labels).toBeDefined()
    expect(labels.future).toBeDefined()
    expect(labels.past).toBeDefined()
    // Check that all expected keys exist
    expect(Object.keys(labels).length).toBeGreaterThan(0)
  })

  it('should return Turkish relative time labels', () => {
    const labels = getRelativeLabels('tr')
    expect(labels).toBeDefined()
    expect(Object.keys(labels).length).toBeGreaterThan(0)
  })

  it('should fallback to English for unknown locale', () => {
    const labels = getRelativeLabels('unknown')
    expect(labels).toBeDefined()
    expect(labels.future).toBeDefined()
  })
})

describe('locales - localeEn', () => {
  it('should have correct structure', () => {
    expect(localeEn.name).toBe('en')
    expect(localeEn.months.length).toBe(12)
    expect(localeEn.monthsShort.length).toBe(12)
    expect(localeEn.weekdays.length).toBe(7)
    expect(localeEn.weekdaysShort.length).toBe(7)
    expect(localeEn.weekdaysMin.length).toBe(7)
  })

  it('should have correct month names', () => {
    expect(localeEn.months[0]).toBe('January')
    expect(localeEn.months[11]).toBe('December')
  })

  it('should have correct weekday names', () => {
    expect(localeEn.weekdays[0]).toBe('Sunday')
    expect(localeEn.weekdays[6]).toBe('Saturday')
  })
})

describe('locales - localeTr', () => {
  it('should have correct structure', () => {
    expect(localeTr.name).toBe('tr')
    expect(localeTr.months.length).toBe(12)
    expect(localeTr.monthsShort.length).toBe(12)
    expect(localeTr.weekdays.length).toBe(7)
    expect(localeTr.weekdaysShort.length).toBe(7)
    expect(localeTr.weekdaysMin.length).toBe(7)
  })

  it('should have correct month names', () => {
    expect(localeTr.months[0]).toBe('Ocak')
    expect(localeTr.months[11]).toBe('Aralık')
  })

  it('should have correct weekday names', () => {
    expect(localeTr.weekdays[0]).toBe('Pazar')
    expect(localeTr.weekdays[6]).toBe('Cumartesi')
  })
})
