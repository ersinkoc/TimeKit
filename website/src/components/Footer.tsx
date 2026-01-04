import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2024 TimeKit. Released under the MIT License.</p>
        <div className={styles.links}>
          <a href="https://github.com/ersinkoc/timekit" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@oxog/timekit" target="_blank" rel="noopener noreferrer">
            npm
          </a>
        </div>
      </div>
    </footer>
  )
}
