import styles from '../styles/Header.module.css'

type Page = 'home' | 'api' | 'examples'

interface HeaderProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.icon}>⏰</span>
          <h1>TimeKit</h1>
        </div>
        <nav className={styles.nav}>
          <button
            className={currentPage === 'home' ? styles.active : ''}
            onClick={() => onPageChange('home')}
          >
            Home
          </button>
          <button
            className={currentPage === 'api' ? styles.active : ''}
            onClick={() => onPageChange('api')}
          >
            API
          </button>
          <button
            className={currentPage === 'examples' ? styles.active : ''}
            onClick={() => onPageChange('examples')}
          >
            Examples
          </button>
        </nav>
      </div>
    </header>
  )
}
