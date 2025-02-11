'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import IntroPage from '../components/intro/intro'
import styles from './page.module.scss'

export const Navbar: React.FC = () => {
  const path = usePathname()

  const navItems = [
    { name: '/', path: '/' },
    { name: 'Shaders', path: '/shaders' }
  ]

  const currentPage = path.split('/')[2]

  const exists = navItems.some((item) => item.name === currentPage)
  if (currentPage && !exists) {
    navItems.push({ name: `- ${currentPage}`, path: '/shaders/' })
  }

  return (
    <div className={styles.navbar}>
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
    </div>
  )
}

const Home: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <h1 className={styles.heading}>SHAD3RS</h1>
      </main>
      <IntroPage />
    </div>
  )
}

export default Home
