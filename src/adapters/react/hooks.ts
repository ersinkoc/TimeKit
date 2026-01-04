// React Hooks for TimeKit
// Zero-dependency React hooks for time management

import { useEffect, useState, useCallback, useRef } from 'react'
import type { TimeInput } from '../../types.js'
import { createTime } from '../../core/create.js'
import { createDuration } from '../../duration/duration.js'

// ============ USE TIME ============

export function useTime(input?: TimeInput, intervalMs = 1000) {
  const [time, setTime] = useState(() => createTime(input ?? new Date()))

  useEffect(() => {
    if (intervalMs <= 0) return

    const timer = setInterval(() => {
      setTime(createTime(new Date()))
    }, intervalMs)

    return () => clearInterval(timer)
  }, [intervalMs])

  return time
}

// ============ USE NOW ============

export function useNow(intervalMs = 1000) {
  return useTime(undefined, intervalMs)
}

// ============ USE INTERVAL ============

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return

    const tick = () => savedCallback.current()
    const timer = setInterval(tick, delay)

    return () => clearInterval(timer)
  }, [delay])
}

// ============ USE TIMER ============

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  const tick = useCallback(() => {
    setSeconds((s) => s + 1)
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const reset = useCallback(() => {
    setSeconds(initialSeconds)
    setIsRunning(false)
  }, [initialSeconds])

  useInterval(tick, isRunning ? 1000 : null)

  return { seconds, isRunning, start, pause, reset }
}

// ============ USE COUNTDOWN ============

export function useCountdown(targetDate: TimeInput) {
  const target = createTime(targetDate)
  const [remaining, setRemaining] = useState(() => {
    const now = createTime()
    const diff = target.toTimestamp() - now.toTimestamp()
    return Math.max(0, diff)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = createTime()
      const diff = target.toTimestamp() - now.toTimestamp()
      setRemaining(Math.max(0, diff))
    }, 1000)

    return () => clearInterval(timer)
  }, [target])

  const duration = createDuration(remaining)

  const isExpired = remaining <= 0

  return {
    remaining,
    duration,
    isExpired,
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds(),
  }
}

// ============ USE TIMEZONE ============

export function useTimezone(timezone?: string) {
  const [currentTime, setCurrentTime] = useState(() => {
    const time = createTime(new Date())
    return timezone ? time.tz(timezone) : time
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const time = createTime(new Date())
      setCurrentTime(timezone ? time.tz(timezone) : time)
    }, 1000)

    return () => clearInterval(timer)
  }, [timezone])

  return currentTime
}
