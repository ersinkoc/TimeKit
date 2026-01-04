import type { TimeInput, CalendarMonth, CalendarWeek, CalendarDay, CalendarOptions } from '../types.js'
import { createTime } from '../core/create.js'
import { getDaysInMonth as getDaysInMonthUtil, isLeapYear, getWeeksInYear as getWeeksInYearUtil, getWeekOfYear } from '../utils/helpers.js'
import { getWeekStartsOn } from '../core/config.js'

// ============ GET CALENDAR (2D GRID) ============

export function getCalendar(year: number, month: number, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): (number | null)[][] {
  const start = weekStartsOn ?? getWeekStartsOn()

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  // Get the day of week for the first day (0-6, Sunday-Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate padding days needed
  const startPad = (firstDayOfWeek - start + 7) % 7

  // Calculate total cells needed
  const totalCells = startPad + daysInMonth
  const weeks = Math.ceil(totalCells / 7)

  // Build calendar grid
  const calendar: (number | null)[][] = []
  let day = 1

  for (let week = 0; week < weeks; week++) {
    const weekRow: (number | null)[] = []

    for (let d = 0; d < 7; d++) {
      if (week === 0 && d < startPad) {
        weekRow.push(null) // Padding day
      } else if (day > daysInMonth) {
        weekRow.push(null) // Padding day
      } else {
        weekRow.push(day)
        day++
      }
    }

    calendar.push(weekRow)
  }

  return calendar
}

// ============ GET MONTH CALENDAR (FULL) ============

export function getMonthCalendar(year: number, month: number, options: CalendarOptions = {}): CalendarMonth {
  const weekStartsOn = options.weekStartsOn ?? getWeekStartsOn()
  const grid = getCalendar(year, month, weekStartsOn)

  const selectedDate = options.selectedDate ? createTime(options.selectedDate) : undefined
  const minDate = options.minDate ? createTime(options.minDate) : undefined
  const maxDate = options.maxDate ? createTime(options.maxDate) : undefined
  const disabledDates = options.disabledDates?.map((d) => createTime(d))

  const weeks: CalendarWeek[] = []

  let weekNumber = getWeekOfYear(new Date(year, month - 1, 1))

  grid.forEach((weekRow) => {
    const days: CalendarDay[] = []

    weekRow.forEach((dayNum) => {
      if (dayNum === null) {
        days.push({
          date: 0,
          time: createTime(),
          isCurrentMonth: false,
          isToday: false,
          isWeekend: false,
          isDisabled: true,
        })
        return
      }

      const dayTime = createTime({ year, month, date: dayNum })
      const isCurrentMonth = true
      const isToday = dayTime.isToday()
      const isWeekend = dayTime.isWeekend()
      const isSelected = selectedDate ? dayTime.isSame(selectedDate, 'day') : false

      let isDisabled = false
      if (minDate && dayTime.isBefore(minDate, 'day')) isDisabled = true
      if (maxDate && dayTime.isAfter(maxDate, 'day')) isDisabled = true
      if (disabledDates?.some((d) => dayTime.isSame(d, 'day'))) isDisabled = true

      days.push({
        date: dayNum,
        time: dayTime,
        isCurrentMonth,
        isToday,
        isWeekend,
        isSelected,
        isDisabled,
      })
    })

    weeks.push({
      weekNumber: weekNumber++,
      days,
    })
  })

  return {
    year,
    month,
    weeks,
  }
}

// ============ GET WEEK CALENDAR ============

export function getWeekCalendar(date: TimeInput, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): CalendarDay[] {
  const start = weekStartsOn ?? getWeekStartsOn()
  const baseDate = createTime(date)
  const dayOfWeek = baseDate.day()

  // Adjust to the correct week start
  const diff = (dayOfWeek - start + 7) % 7
  const weekStart = baseDate.subtract(diff, 'day')

  const days: CalendarDay[] = []

  for (let i = 0; i < 7; i++) {
    const dayTime = weekStart.add(i, 'day')
    days.push({
      date: dayTime.date(),
      time: dayTime,
      isCurrentMonth: true,
      isToday: dayTime.isToday(),
      isWeekend: dayTime.isWeekend(),
    })
  }

  return days
}

// ============ GET DAYS IN MONTH ============

export function getDaysInMonth(year: number, month: number): number {
  return getDaysInMonthUtil(year, month)
}

// ============ GET FIRST DAY OF MONTH ============

export function getFirstDayOfMonth(year: number, month: number): ReturnType<typeof createTime> {
  return createTime({ year, month, date: 1 })
}

// ============ GET LAST DAY OF MONTH ============

export function getLastDayOfMonth(year: number, month: number): ReturnType<typeof createTime> {
  const days = getDaysInMonth(year, month)
  return createTime({ year, month, date: days })
}

// ============ GET FIRST DAY OF WEEK ============

export function getFirstDayOfWeek(date: TimeInput, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): ReturnType<typeof createTime> {
  const start = weekStartsOn ?? getWeekStartsOn()
  const baseDate = createTime(date)
  const dayOfWeek = baseDate.day()
  const diff = (dayOfWeek - start + 7) % 7
  return baseDate.subtract(diff, 'day')
}

// ============ GET DAYS IN YEAR ============

export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365
}

// ============ GET WEEKS IN YEAR ============

export function getWeeksInYear(year: number): number {
  return getWeeksInYearUtil(year)
}

// ============ IS LEAP YEAR ============

export { isLeapYear }
