import { CodeBlock } from '@/components/code/CodeBlock'

interface Example {
  title: string
  description: string
  code: string
  result: string
}

const examples: Example[] = [
  {
    title: 'Basic Formatting',
    description: 'Format dates with custom patterns using format tokens',
    code: `import { createTime } from '@oxog/timekit'

const date = createTime('2024-01-15 14:30:45')

// Various formats
date.format('YYYY-MM-DD')           // '2024-01-15'
date.format('MMMM D, YYYY')         // 'January 15, 2024'
date.format('HH:mm:ss')             // '14:30:45'
date.format('dddd, MMMM Do YYYY')   // 'Monday, January 15th 2024'
date.format('YYYY-MM-DD HH:mm:ss Z') // '2024-01-15 14:30:45 +03:00'

// Quarter and week
date.format('Qo')                   // '1st' (first quarter)
date.format('W')                    // '3' (week of year)`,
    result: 'January 15, 2024'
  },
  {
    title: 'Date Manipulation',
    description: 'Add and subtract time units with chainable API',
    code: `import { now } from '@oxog/timekit'

// Add time
const nextWeek = now().add(7, 'days')
const nextMonth = now().add(1, 'month')
const future = now().add(2, 'years').add(3, 'months')

// Subtract time
const yesterday = now().subtract(1, 'day')
const lastHour = now().subtract(60, 'minutes')

// Start and end of units
const startOfDay = now().startOf('day')
const endOfMonth = now().endOf('month')
const startOfYear = now().startOf('year')

// All operations return new instances (immutable)
console.log(now().format('YYYY-MM-DD'))  // Original unchanged
console.log(nextWeek.format('YYYY-MM-DD')) // New date`,
    result: '2024-01-22'
  },
  {
    title: 'Relative Time',
    description: 'Display human-readable relative time strings',
    code: `import { createTime, now } from '@oxog/timekit'

// From now
createTime('2024-01-01').fromNow()  // '2 weeks ago'
createTime('2025-01-01').fromNow()  // 'in 1 year'
createTime('2024-12-25').fromNow()  // 'in 11 months'

// From specific date
now().from('2024-01-01')            // 'in 2 weeks'
createTime('2024-01-01').toNow()    // '2 weeks ago'

// Relative to another date
const date1 = createTime('2024-01-01')
const date2 = createTime('2024-01-15')
date2.from(date1)                   // '2 weeks ago'`,
    result: '2 weeks ago'
  },
  {
    title: 'Timezone Conversion',
    description: 'Convert between IANA timezones with automatic DST handling',
    code: `import { createTime } from '@oxog/timekit'

// Create time in local timezone
const now = createTime()

// Convert to different timezones
const tokyo = now.tz('Asia/Tokyo')
const ny = now.tz('America/New_York')
const london = now.tz('Europe/London')

// Format with timezone info
tokyo.format('YYYY-MM-DD HH:mm:ss Z')
// '2024-01-15 22:30:45 +09:00'

ny.format('YYYY-MM-DD HH:mm:ss Z')
// '2024-01-15 08:30:45 -05:00'

// UTC conversion
const utc = createTime().utc()
utc.format('HH:mm')                 // '14:30'

// Convert back to local
const local = utc.local()
local.format('HH:mm')               // '16:30' (if UTC+3)`,
    result: 'Asia/Tokyo: 22:30'
  },
  {
    title: 'Date Comparison',
    description: 'Compare dates with various helper methods',
    code: `import { createTime, now } from '@oxog/timekit'

const date = createTime('2024-01-15')

// Basic comparison
date.isBefore('2024-02-01')         // true
date.isAfter('2024-01-01')          // true
date.isSame('2024-01-15')           // true

// Same unit comparison
date.isSame(createTime('2024-01-15 10:00'), 'day')   // true
date.isSame(now(), 'month')         // true if same month
date.isSame(now(), 'year')          // true if same year

// Between check
const isBetween = now().isBetween(
  '2024-01-01',
  '2024-12-31'
)                                   // true

// Query methods
now().isToday()                     // true
now().isWeekend()                   // depends on day
now().isThisMonth()                 // true
now().isThisYear()                  // true
now().isWeekday()                   // true if Mon-Fri
now().isLeapYear()                  // true for 2024`,
    result: 'true'
  },
  {
    title: 'Duration',
    description: 'Work with time durations for calculations and humanization',
    code: `import { createDuration, humanizeDuration } from '@oxog/timekit'

// Create duration from object
const duration1 = createDuration({
  days: 2,
  hours: 3,
  minutes: 30
})

// Create from ISO 8601 string
const duration2 = createDuration('PT1H30M')
const duration3 = createDuration('P1DT2H30M')

// Get total values
duration1.asDays()                  // 2.1458...
duration1.asHours()                 // 51.5
duration1.asMinutes()               // 3090
duration1.asSeconds()               // 185400
duration1.asMilliseconds()          // 185400000

// Humanize for display
humanizeDuration({ seconds: 45 })   // 'a few seconds'
humanizeDuration({ minutes: 5 })    // '5 minutes'
humanizeDuration({ hours: 2 })      // '2 hours'
humanizeDuration({ days: 14 })      // '14 days'
humanizeDuration({ months: 3 })     // '3 months'
humanizeDuration({ years: 1 })      // '1 year'`,
    result: '2 days 3 hours'
  },
  {
    title: 'Calendar Generation',
    description: 'Generate calendar grids for building date pickers',
    code: `import { getCalendar, getDaysInMonth } from '@oxog/timekit'

// Get calendar for a month
const calendar = getCalendar(2024, 1)
// Returns array of weeks, each week is array of days:
// [
//   [
//     { date: 31, month: 12, year: 2023, isCurrentMonth: false },
//     { date: 1, month: 1, year: 2024, isCurrentMonth: true },
//     ...
//   ],
//   ...
// ]

// Check leap year
const daysInFeb = getDaysInMonth(2024, 2)
// 29 (2024 is a leap year)

const daysInFebNormal = getDaysInMonth(2023, 2)
// 28 (2023 is not a leap year)

// Week information from Time instance
const date = createTime('2024-01-15')
date.weekOfYear()                   // 3
date.dayOfYear()                    // 15
date.quarter()                      // 1

// Week day info
date.day()                          // 0 (Sunday, if that's the day)
date.weekday()                      // 1 (Monday, ISO weekday)`,
    result: 'Calendar grid for January 2024'
  },
  {
    title: 'Configuration',
    description: 'Configure global settings for locale, timezone, and week start',
    code: `import { configure, setDefaultLocale, resetConfig } from '@oxog/timekit'

// Set locale for all operations
configure({ locale: 'tr' })
createTime().format('MMMM')         // 'Ocak'

// Set default timezone
configure({ timezone: 'Europe/Istanbul' })
const time = createTime()           // in Istanbul timezone

// Set week start day
configure({ weekStartsOn: 1 })      // Monday (0-6, Sun-Sat)
const startOfWeek = createTime().startOf('week')

// Multiple configs at once
configure({
  locale: 'tr',
  timezone: 'Europe/Istanbul',
  weekStartsOn: 1
})

// Individual setters
setDefaultLocale('en')
setDefaultTimezone('UTC')

// Reset to defaults
resetConfig()`,
    result: 'Configuration applied globally'
  }
]

export function Examples() {
  const reactExample = `import { useNow, useCountdown, TimeAgo } from '@oxog/timekit/react'

// Live updating current time
function Clock() {
  const time = useNow({ interval: 1000, format: 'HH:mm:ss' })
  return <div>{time}</div>
}

// Countdown timer
function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown('2025-01-01')
  return (
    <div>
      {days}d {hours}h {minutes}m {seconds}s
    </div>
  )
}

// Relative time display
function Post({ createdAt }) {
  return <TimeAgo date={createdAt} />
}`

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Examples</h1>
        <p className="text-xl text-muted-foreground">
          Practical examples demonstrating common use cases with TimeKit
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {examples.map((example, index) => (
          <div
            key={index}
            className="flex flex-col bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="p-6 flex-1">
              <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{example.description}</p>
              <CodeBlock
                code={example.code}
                language="typescript"
                filename={`${example.title.toLowerCase().replace(/\s+/g, '-')}.ts`}
                showLineNumbers={false}
                className="text-sm"
              />
            </div>
            <div className="px-6 py-4 bg-muted/50 border-t border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Result: {example.result}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="bg-card border border-border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">React Integration</h2>
        <p className="text-muted-foreground mb-6">
          TimeKit also provides React hooks and components for easy integration:
        </p>
        <CodeBlock
          code={reactExample}
          language="typescript"
          filename="ReactExample.tsx"
        />
      </section>
    </div>
  )
}
