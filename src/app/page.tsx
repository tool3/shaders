'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import styles from './page.module.scss'

const Navbar: React.FC = () => {
  const path = usePathname()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shaders', path: '/shaders' }
  ]

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.navItem} ${
              path === item.path ? styles.active : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}

const Home: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.heading}>SHAD3RS</h1>
      </main>
    </div>
  )
}

export default Home
