import styles from '../styles/HomePage.module.css'

type Page = 'home' | 'api' | 'examples'

interface HomePageProps {
  onPageChange: (page: Page) => void
}

export default function HomePage({ onPageChange }: HomePageProps) {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Modern Date & Time Library</h1>
        <p className={styles.tagline}>
          Lightweight, zero-dependency JavaScript library for date/time formatting, manipulation, and timezone support
        </p>
        <div className={styles.badges}>
          <span className={styles.badge}>Zero Dependencies</span>
          <span className={styles.badge}>TypeScript</span>
          <span className={styles.badge}>&lt; 3KB</span>
        </div>
        <div className={styles.install}>
          <code>npm install @oxog/timekit</code>
        </div>
      </section>

      <section className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h3>🚀 Lightweight</h3>
            <p>Zero dependencies, tree-shakeable, and optimized for performance</p>
          </div>
          <div className={styles.feature}>
            <h3>🌍 Timezone Support</h3>
            <p>Built-in IANA timezone database with automatic DST handling</p>
          </div>
          <div className={styles.feature}>
            <h3>📦 TypeScript</h3>
            <p>Fully typed with excellent IDE support and type safety</p>
          </div>
          <div className={styles.feature}>
            <h3>🔧 Modular</h3>
            <p>Import only what you need with ES module support</p>
          </div>
          <div className={styles.feature}>
            <h3>🌐 Internationalization</h3>
            <p>Multi-language support with customizable locales</p>
          </div>
          <div className={styles.feature}>
            <h3>⚡ Fast</h3>
            <p>Optimized operations for high-performance applications</p>
          </div>
        </div>
      </section>

      <section className={styles.quickStart}>
        <h2>Quick Start</h2>
        <pre><code>{`import { createTime, now } from '@oxog/timekit'

// Format dates
now().format('MMMM D, YYYY')  // 'January 4, 2026'

// Relative time
createTime('2026-01-02').fromNow()  // '2 days ago'

// Manipulate dates
now().add(1, 'week').startOf('day')

// Timezone conversion
createTime().tz('Asia/Tokyo').format('HH:mm')`}</code></pre>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => onPageChange('api')}>
            View API
          </button>
          <button className={styles.secondary} onClick={() => onPageChange('examples')}>
            See Examples
          </button>
        </div>
      </section>

      <section className={Styles.testing}>
        <h2>Comprehensive Testing</h2>
        <p>TimeKit comes with extensive test coverage ensuring reliability and correctness</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.value}>511</div>
            <div className={styles.label}>Tests</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>71.84%</div>
            <div className={styles.label}>Coverage</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>100%</div>
            <div className={styles.label}>Pass Rate</div>
          </div>
        </div>
      </section>
    </div>
  )
}
