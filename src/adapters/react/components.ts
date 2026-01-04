// React Components for TimeKit
// Zero-dependency React components for time display and input

import React, { useState, useCallback, useEffect } from 'react'
import type { TimeInput, CalendarDay as CalendarDayType, CalendarOptions } from '../../types.js'
import { createTime } from '../../core/create.js'
import { getMonthCalendar } from '../../calendar/calendar.js'
import { createDuration } from '../../duration/duration.js'

// ============ TIME PICKER ============

export interface TimePickerProps {
  value?: TimeInput
  onChange?: (time: ReturnType<typeof createTime>) => void
  hour24?: boolean
  showSeconds?: boolean
  disabled?: boolean
  className?: string
}

export function TimePicker({
  value,
  onChange,
  hour24 = true,
  showSeconds = false,
  disabled = false,
  className = '',
}: TimePickerProps) {
  const time = value !== undefined ? createTime(value) : createTime()

  const handleHourChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const hour = parseInt(e.target.value) || 0
      const newTime = time.set('hour', hour)
      onChange?.(newTime)
    },
    [time, onChange]
  )

  const handleMinuteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const minute = parseInt(e.target.value) || 0
      const newTime = time.set('minute', minute)
      onChange?.(newTime)
    },
    [time, onChange]
  )

  const handleSecondChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const second = parseInt(e.target.value) || 0
      const newTime = time.set('second', second)
      onChange?.(newTime)
    },
    [time, onChange]
  )

  return React.createElement(
    'div',
    { className: `timekit-time-picker ${className}` },
    React.createElement('input', {
      type: 'number',
      min: hour24 ? 0 : 1,
      max: hour24 ? 23 : 12,
      value: time.hour(),
      onChange: handleHourChange,
      disabled: disabled,
      className: 'timekit-hour-input',
    }),
    React.createElement('span', { className: 'timekit-separator' }, ':'),
    React.createElement('input', {
      type: 'number',
      min: 0,
      max: 59,
      value: time.minute(),
      onChange: handleMinuteChange,
      disabled: disabled,
      className: 'timekit-minute-input',
    }),
    showSeconds
      ? [
          React.createElement('span', { key: 'sep2', className: 'timekit-separator' }, ':'),
          React.createElement('input', {
            key: 'sec',
            type: 'number',
            min: 0,
            max: 59,
            value: time.second(),
            onChange: handleSecondChange,
            disabled: disabled,
            className: 'timekit-second-input',
          }),
        ]
      : null
  )
}

// ============ DATE PICKER ============

export interface DatePickerProps {
  value?: TimeInput
  onChange?: (time: ReturnType<typeof createTime>) => void
  minDate?: TimeInput
  maxDate?: TimeInput
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  className = '',
}: DatePickerProps) {
  const time = value !== undefined ? createTime(value) : createTime()
  const [viewDate, setViewDate] = useState(time)

  const options: CalendarOptions = {
    selectedDate: value,
    minDate,
    maxDate,
  }

  const calendar = getMonthCalendar(viewDate.year(), viewDate.month() + 1, options)

  const handlePrevMonth = useCallback(() => {
    setViewDate((d) => d.subtract(1, 'month'))
  }, [])

  const handleNextMonth = useCallback(() => {
    setViewDate((d) => d.add(1, 'month'))
  }, [])

  const handleDateClick = useCallback(
    (day: CalendarDayType) => {
      if (day.isDisabled || disabled) return
      onChange?.(day.time)
    },
    [onChange, disabled]
  )

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return React.createElement(
    'div',
    { className: `timekit-date-picker ${className}` },
    React.createElement(
      'div',
      { className: 'timekit-header' },
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: handlePrevMonth,
          disabled: disabled,
          className: 'timekit-prev-month',
        },
        '\u2039'
      ),
      React.createElement('span', { className: 'timekit-current-month' }, time.format('MMMM YYYY')),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: handleNextMonth,
          disabled: disabled,
          className: 'timekit-next-month',
        },
        '\u203A'
      )
    ),
    React.createElement(
      'div',
      { className: 'timekit-weekdays' },
      ...weekDays.map((day) =>
        React.createElement('div', { key: day, className: 'timekit-weekday' }, day)
      )
    ),
    React.createElement(
      'div',
      { className: 'timekit-days' },
      ...calendar.weeks.map((week, weekIndex) =>
        React.createElement(
          'div',
          { key: weekIndex, className: 'timekit-week' },
          ...week.days.map((day, dayIndex) =>
            React.createElement(
              'button',
              {
                key: dayIndex,
                type: 'button',
                onClick: () => handleDateClick(day),
                disabled: day.isDisabled || disabled,
                className: `timekit-day ${day.isToday ? 'timekit-today' : ''} ${
                  day.isSelected ? 'timekit-selected' : ''
                } ${day.isCurrentMonth ? '' : 'timekit-other-month'}`,
              },
              day.date
            )
          )
        )
      )
    )
  )
}

// ============ CALENDAR ============

export interface CalendarProps {
  year: number
  month: number
  options?: CalendarOptions
  className?: string
}

export function Calendar({ year, month, options, className = '' }: CalendarProps) {
  const calendar = getMonthCalendar(year, month, options)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return React.createElement(
    'div',
    { className: `timekit-calendar ${className}` },
    React.createElement(
      'div',
      { className: 'timekit-header' },
      React.createElement(
        'span',
        { className: 'timekit-title' },
        `${calendar.year} / ${String(calendar.month).padStart(2, '0')}`
      )
    ),
    React.createElement(
      'div',
      { className: 'timekit-weekdays' },
      ...weekDays.map((day) => React.createElement('div', { key: day, className: 'timekit-weekday' }, day))
    ),
    React.createElement(
      'div',
      { className: 'timekit-weeks' },
      ...calendar.weeks.map((week, weekIndex) =>
        React.createElement(
          'div',
          { key: weekIndex, className: 'timekit-week' },
          React.createElement(
            'span',
            { className: 'timekit-week-number' },
            `W${String(week.weekNumber).padStart(2, '0')}`
          ),
          ...week.days.map((day, dayIndex) =>
            React.createElement(
              'div',
              {
                key: dayIndex,
                className: `timekit-day ${day.isToday ? 'timekit-today' : ''} ${
                  day.isSelected ? 'timekit-selected' : ''
                } ${day.isDisabled ? 'timekit-disabled' : ''} ${
                  !day.isCurrentMonth ? 'timekit-other-month' : ''
                }`,
              },
              day.date || '\u00A0'
            )
          )
        )
      )
    )
  )
}

// ============ RELATIVE TIME ============

export interface RelativeTimeProps {
  to: TimeInput
  from?: TimeInput
  intervalMs?: number
  withoutSuffix?: boolean
  className?: string
}

export function RelativeTime({
  to,
  from = new Date(),
  intervalMs = 60000,
  withoutSuffix = false,
  className = '',
}: RelativeTimeProps) {
  const [text, setText] = useState(() => {
    const t = createTime(to)
    const f = createTime(from)
    return t.from(f, withoutSuffix)
  })

  useEffect(() => {
    if (intervalMs <= 0) return

    const timer = setInterval(() => {
      const t = createTime(to)
      const f = createTime(new Date())
      setText(t.from(f, withoutSuffix))
    }, intervalMs)

    return () => clearInterval(timer)
  }, [to, intervalMs, withoutSuffix])

  return React.createElement('span', { className: `timekit-relative-time ${className}` }, text)
}

// ============ DURATION DISPLAY ============

export interface DurationDisplayProps {
  milliseconds: number
  format?: 'long' | 'short' | 'narrow' | 'digital'
  units?: Array<'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'>
  largest?: number
  className?: string
}

export function DurationDisplay({
  milliseconds,
  format = 'long',
  className = '',
}: DurationDisplayProps) {
  const duration = createDuration(milliseconds)
  const text = duration.format(format === 'digital' ? 'HH:mm:ss' : 'HH:mm:ss')

  return React.createElement('span', { className: `timekit-duration ${className}` }, text)
}
