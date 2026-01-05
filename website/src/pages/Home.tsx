import { Link } from 'react-router-dom'
import { ArrowRight, Check, Zap, Globe, Code, Shield } from 'lucide-react'
import { CodeBlock } from '@/components/code/CodeBlock'
import { NPM_PACKAGE } from '@/lib/constants'

const features = [
  {
    icon: Zap,
    title: 'Lightweight',
    description: 'Zero dependencies, tree-shakeable, and optimized for performance. Bundle size under 3KB.'
  },
  {
    icon: Globe,
    title: 'Timezone Support',
    description: 'Built-in IANA timezone database with automatic DST handling for accurate time conversions.'
  },
  {
    icon: Code,
    title: 'TypeScript',
    description: 'Fully typed with excellent IDE support and type safety for a better development experience.'
  },
  {
    icon: Shield,
    title: 'Immutable',
    description: 'All operations return new instances, ensuring predictable behavior and easy debugging.'
  },
]

const stats = [
  { label: 'Zero Dependencies', value: '0' },
  { label: 'Bundle Size', value: '<3KB' },
  { label: 'Test Coverage', value: '71.84%' },
  { label: 'Tests Passing', value: '511' },
]

export function Home() {
  const installCode = `npm install ${NPM_PACKAGE}`

  const quickStartCode = `import { createTime, now } from '@oxog/timekit'

// Format dates
now().format('MMMM D, YYYY')  // 'January 5, 2026'

// Relative time
createTime('2026-01-02').fromNow()  // '3 days ago'

// Manipulate dates
now().add(1, 'week').startOf('day')

// Timezone conversion
createTime().tz('Asia/Tokyo').format('HH:mm')`

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 -z-10" />

        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              v0.0.1 - Now Available
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Modern Date & Time
              <br />
              Library for JavaScript
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              Lightweight, zero-dependency JavaScript library for date/time formatting,
              manipulation, and timezone support with TypeScript support.
            </p>

            {/* Install Command */}
            <div className="w-full max-w-lg mb-10">
              <CodeBlock
                code={installCode}
                language="bash"
                filename="Terminal"
                showLineNumbers={false}
                className="shadow-lg"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link
                to="/api"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/ersinkoc/timekit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
              >
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-3xl">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features with a simple, chainable API
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quick Start
            </h2>
            <p className="text-xl text-muted-foreground">
              Get up and running in seconds
            </p>
          </div>

          <CodeBlock
            code={quickStartCode}
            language="typescript"
            filename="index.ts"
            highlightLines={[2, 5, 8, 11]}
          />

          {/* Checklist */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {[
              'Chainable API for fluent code',
              'Immutable operations',
              'TypeScript support out of the box',
              'Tree-shakeable for optimal bundle size'
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              to="/api"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Explore API
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
