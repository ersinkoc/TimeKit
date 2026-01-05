import { CodeBlock } from '@/components/code/CodeBlock'

interface ApiMethod {
  name: string
  signature: string
  description: string
  example: string
}

interface ApiSection {
  title: string
  description: string
  methods: ApiMethod[]
}

const apiSections: ApiSection[] = [
  {
    title: 'Creation',
    description: 'Create Time objects from various inputs',
    methods: [
      {
        name: 'createTime',
        signature: 'createTime(input?: TimeInput): Time',
        description: 'Create a Time object from various input types including strings, Date objects, timestamps, or TimeObject.',
        example: `import { createTime } from '@oxog/timekit'

// From ISO string
createTime('2024-01-15')
createTime('2024-01-15T14:30:45')

// From object
createTime({ year: 2024, month: 1, date: 15 })

// From timestamp
createTime(1705334400000)

// From Date object
createTime(new Date())

// Current time (no arguments)
createTime()`
      },
      {
        name: 'now',
        signature: 'now(): Time',
        description: 'Create a Time object with the current date and time.',
        example: `import { now } from '@oxog/timekit'

const current = now()
console.log(current.format('YYYY-MM-DD HH:mm:ss'))
// '2024-01-15 14:30:45'`
      },
      {
        name: 'today',
        signature: 'today(): Time',
        description: 'Create a Time object with the current date at midnight (00:00:00).',
        example: `import { today } from '@oxog/timekit'

const startOfToday = today()
console.log(startOfToday.format('HH:mm:ss'))
// '00:00:00'`
      }
    ]
  },
  {
    title: 'Formatting',
    description: 'Format dates and times with custom patterns',
    methods: [
      {
        name: 'format',
        signature: 'format(pattern: string): string',
        description: 'Format the time using a pattern string with format tokens like YYYY, MM, DD, HH, mm, ss.',
        example: `import { createTime } from '@oxog/timekit'

const date = createTime('2024-01-15 14:30:45')

// Various formats
date.format('YYYY-MM-DD')           // '2024-01-15'
date.format('MMMM D, YYYY')         // 'January 15, 2024'
date.format('HH:mm:ss')             // '14:30:45'
date.format('dddd, MMMM Do YYYY')   // 'Monday, January 15th 2024'
date.format('YYYY-MM-DD HH:mm:ss Z') // '2024-01-15 14:30:45 +03:00'`
      },
      {
        name: 'toISOString',
        signature: 'toISOString(): string',
        description: 'Get ISO 8601 formatted string.',
        example: `import { createTime } from '@oxog/timekit'

const time = createTime('2024-01-15 14:30:45')
console.log(time.toISOString())
// '2024-01-15T14:30:45.000Z'`
      }
    ]
  },
  {
    title: 'Manipulation',
    description: 'Add and subtract time units with chainable API',
    methods: [
      {
        name: 'add',
        signature: 'add(amount: number, unit: TimeUnit): Time',
        description: 'Add time to the current Time object. Returns a new Time instance (immutable).',
        example: `import { now } from '@oxog/timekit'

// Add various units
now().add(7, 'days')       // Next week
now().add(1, 'month')      // Next month
now().add(2, 'years')      // Two years from now
now().add(3, 'hours')      // Three hours later

// Chainable
now().add(1, 'week').add(2, 'days')`
      },
      {
        name: 'subtract',
        signature: 'subtract(amount: number, unit: TimeUnit): Time',
        description: 'Subtract time from the current Time object. Returns a new Time instance (immutable).',
        example: `import { now } from '@oxog/timekit'

now().subtract(1, 'day')         // Yesterday
now().subtract(30, 'minutes')    // 30 minutes ago
now().subtract(1, 'year')        // Last year`
      },
      {
        name: 'startOf',
        signature: 'startOf(unit: TimeUnit): Time',
        description: 'Get the start of a time unit (day, week, month, year, etc.).',
        example: `import { now } from '@oxog/timekit'

now().startOf('day')      // Beginning of today (00:00:00)
now().startOf('week')     // Start of the week
now().startOf('month')    // First day of month
now().startOf('year')     // January 1st of the year`
      },
      {
        name: 'endOf',
        signature: 'endOf(unit: TimeUnit): Time',
        description: 'Get the end of a time unit (day, week, month, year, etc.).',
        example: `import { now } from '@oxog/timekit'

now().endOf('day')        // End of today (23:59:59)
now().endOf('week')       // End of the week
now().endOf('month')      // Last day of month
now().endOf('year')       // December 31st of the year`
      }
    ]
  },
  {
    title: 'Relative Time',
    description: 'Get human-readable relative time strings',
    methods: [
      {
        name: 'fromNow',
        signature: 'fromNow(): string',
        description: 'Get relative time from now (e.g., "2 days ago", "in 3 months").',
        example: `import { createTime } from '@oxog/timekit'

createTime('2024-01-01').fromNow()  // '2 weeks ago'
createTime('2025-01-01').fromNow()  // 'in 1 year'
createTime('2024-12-25').fromNow()  // 'in 11 months'`
      },
      {
        name: 'from',
        signature: 'from(input: TimeInput): string',
        description: 'Get relative time from a specific date.',
        example: `import { now, createTime } from '@oxog/timekit'

const reference = createTime('2024-01-01')
now().from(reference)          // 'in 2 weeks'
createTime('2023-12-01').from(reference) // '1 month ago'`
      },
      {
        name: 'toNow',
        signature: 'toNow(): string',
        description: 'Get relative time to now.',
        example: `import { createTime } from '@oxog/timekit'

createTime('2025-01-01').toNow()    // 'in 1 year'
createTime('2024-01-01').toNow()    // '2 weeks ago'`
      }
    ]
  },
  {
    title: 'Comparison',
    description: 'Compare Time objects',
    methods: [
      {
        name: 'isBefore',
        signature: 'isBefore(input: TimeInput): boolean',
        description: 'Check if the time is before another time.',
        example: `import { createTime } from '@oxog/timekit'

createTime('2024-01-01').isBefore('2024-02-01')  // true
createTime('2024-03-01').isBefore('2024-02-01')  // false`
      },
      {
        name: 'isAfter',
        signature: 'isAfter(input: TimeInput): boolean',
        description: 'Check if the time is after another time.',
        example: `import { createTime } from '@oxog/timekit'

createTime('2024-03-01').isAfter('2024-02-01')   // true
createTime('2024-01-01').isAfter('2024-02-01')   // false`
      },
      {
        name: 'isSame',
        signature: 'isSame(input: TimeInput, unit?: TimeUnit): boolean',
        description: 'Check if the time is the same as another time. Optionally compare only specific unit.',
        example: `import { createTime, now } from '@oxog/timekit'

// Exact match
createTime('2024-01-15').isSame('2024-01-15')    // true

// Same unit comparison
createTime('2024-01-15 10:00').isSame('2024-01-15 14:00', 'day')  // true
createTime('2024-01-15').isSame(now(), 'month')  // true if same month
createTime('2024-01-15').isSame(now(), 'year')   // true if same year`
      },
      {
        name: 'isBetween',
        signature: 'isBetween(start: TimeInput, end: TimeInput): boolean',
        description: 'Check if the time is between two times (inclusive).',
        example: `import { createTime, now } from '@oxog/timekit'

const date = createTime('2024-06-15')

date.isBetween('2024-01-01', '2024-12-31')  // true
date.isBetween('2024-07-01', '2024-12-31')  // false`
      }
    ]
  },
  {
    title: 'Timezone',
    description: 'Work with timezones and UTC',
    methods: [
      {
        name: 'tz',
        signature: 'tz(timezone: string): Time',
        description: 'Convert to a specific IANA timezone.',
        example: `import { createTime } from '@oxog/timekit'

const now = createTime()

// Convert to different timezones
const tokyo = now.tz('Asia/Tokyo')
const ny = now.tz('America/New_York')
const london = now.tz('Europe/London')

// Format with timezone
tokyo.format('YYYY-MM-DD HH:mm:ss Z')
// '2024-01-15 22:30:45 +09:00'

ny.format('YYYY-MM-DD HH:mm:ss Z')
// '2024-01-15 08:30:45 -05:00'`
      },
      {
        name: 'utc',
        signature: 'utc(): Time',
        description: 'Convert to UTC.',
        example: `import { createTime } from '@oxog/timekit'

const local = createTime()
const utc = local.utc()

console.log(local.format('HH:mm'))
console.log(utc.format('HH:mm'))`
      },
      {
        name: 'local',
        signature: 'local(): Time',
        description: 'Convert to local timezone.',
        example: `import { createTime } from '@oxog/timekit'

// Convert UTC time back to local
const local = createTime().utc().local()`
      }
    ]
  },
  {
    title: 'Duration',
    description: 'Work with time durations',
    methods: [
      {
        name: 'createDuration',
        signature: 'createDuration(input: DurationInput): Duration',
        description: 'Create a Duration object from an object or ISO 8601 string.',
        example: `import { createDuration } from '@oxog/timekit'

// Create from object
const duration1 = createDuration({
  days: 2,
  hours: 3,
  minutes: 30
})

// Create from ISO 8601 string
const duration2 = createDuration('PT1H30M')
const duration3 = createDuration('P1DT2H30M')`
      },
      {
        name: 'formatDuration',
        signature: 'formatDuration(duration: DurationInput, pattern?: string): string',
        description: 'Format a duration with a custom pattern.',
        example: `import { formatDuration } from '@oxog/timekit'

formatDuration({ days: 2, hours: 3 })
// '2 days 3 hours'

formatDuration({ hours: 1, minutes: 30 })
// '1 hour 30 minutes'

formatDuration({ seconds: 45 })
// '45 seconds'`
      },
      {
        name: 'humanizeDuration',
        signature: 'humanizeDuration(duration: DurationInput): string',
        description: 'Get human-readable duration string.',
        example: `import { humanizeDuration } from '@oxog/timekit'

humanizeDuration({ seconds: 45 })   // 'a few seconds'
humanizeDuration({ minutes: 5 })    // '5 minutes'
humanizeDuration({ hours: 2 })      // '2 hours'
humanizeDuration({ days: 14 })      // '14 days'
humanizeDuration({ months: 3 })     // '3 months'
humanizeDuration({ years: 1 })      // '1 year'`
      }
    ]
  },
  {
    title: 'Calendar',
    description: 'Calendar utilities and helpers',
    methods: [
      {
        name: 'getCalendar',
        signature: 'getCalendar(year: number, month: number): CalendarMonth',
        description: 'Get a calendar grid for a month. Returns array of weeks, each containing days.',
        example: `import { getCalendar } from '@oxog/timekit'

const calendar = getCalendar(2024, 1)
// Returns:
// [
//   [ { date: 1, month: 12, year: 2023, isCurrentMonth: false }, ... ],
//   [ { date: 1, month: 1, year: 2024, isCurrentMonth: true }, ... ],
//   ...
// ]`
      },
      {
        name: 'getDaysInMonth',
        signature: 'getDaysInMonth(year: number, month: number): number',
        description: 'Get the number of days in a month.',
        example: `import { getDaysInMonth } from '@oxog/timekit'

getDaysInMonth(2024, 2)  // 29 (leap year)
getDaysInMonth(2023, 2)  // 28
getDaysInMonth(2024, 1)  // 31
getDaysInMonth(2024, 4)  // 30`
      },
      {
        name: 'isLeapYear',
        signature: 'isLeapYear(year: number): boolean',
        description: 'Check if a year is a leap year.',
        example: `import { isLeapYear } from '@oxog/timekit'

isLeapYear(2024)  // true
isLeapYear(2023)  // false
isLeapYear(2000)  // true (divisible by 400)
isLeapYear(1900)  // false (divisible by 100 but not 400)`
      }
    ]
  },
  {
    title: 'Configuration',
    description: 'Configure global TimeKit settings',
    methods: [
      {
        name: 'configure',
        signature: 'configure(config: TimeConfig): void',
        description: 'Set global configuration options for locale, timezone, and week start day.',
        example: `import { configure } from '@oxog/timekit'

configure({
  locale: 'tr',              // Set Turkish locale
  timezone: 'Europe/Istanbul', // Set default timezone
  weekStartsOn: 1            // Week starts on Monday (0-6)
})

// All subsequent operations use these defaults
createTime().format('MMMM')  // 'Ocak' (Turkish)`
      },
      {
        name: 'setDefaultLocale',
        signature: 'setDefaultLocale(locale: string): void',
        description: 'Set the default locale for all operations.',
        example: `import { setDefaultLocale } from '@oxog/timekit'

setDefaultLocale('tr')
createTime().format('MMMM')  // 'Ocak'`
      },
      {
        name: 'setDefaultTimezone',
        signature: 'setDefaultTimezone(timezone: string): void',
        description: 'Set the default timezone for all operations.',
        example: `import { setDefaultTimezone } from '@oxog/timekit'

setDefaultTimezone('America/New_York')
const time = createTime()  // Time in NY timezone`
      },
      {
        name: 'resetConfig',
        signature: 'resetConfig(): void',
        description: 'Reset all configuration to defaults.',
        example: `import { configure, resetConfig } from '@oxog/timekit'

configure({ locale: 'tr' })
// ... use Turkish locale

resetConfig()  // Back to English defaults`
      }
    ]
  }
]

export function API() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-xl text-muted-foreground">
          Complete API documentation for TimeKit. All methods return new instances, ensuring immutability.
        </p>
      </div>

      {apiSections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="mb-16 scroll-mt-20" id={section.title.toLowerCase()}>
          <h2 className="text-2xl font-bold mb-2 text-primary">{section.title}</h2>
          <p className="text-muted-foreground mb-6">{section.description}</p>

          <div className="space-y-8">
            {section.methods.map((method, methodIndex) => (
              <div key={methodIndex} className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-semibold mb-2">{method.name}</h3>
                <code className="text-sm bg-muted px-2 py-1 rounded text-foreground/90">
                  {method.signature}
                </code>
                <p className="text-muted-foreground mt-3 mb-4">{method.description}</p>
                <CodeBlock
                  code={method.example}
                  language="typescript"
                  filename={`example-${method.name.toLowerCase()}.ts`}
                  showCopyButton={true}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
