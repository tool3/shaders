'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import IntroPage from '../components/intro/intro'
import styles from './page.module.scss'

export const Navbar: React.FC = () => {
  const path = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'threejs', path: '/shaders' },
    { name: 'glsl', path: '/glsl' }
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <nav
      className={clsx(
        styles.navbar,
        scrolled && styles.scrolled,
        isMenuOpen && styles.menuOpen
      )}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logo}>
            SD3
          </Link>
        </div>

        <div
          className={clsx(styles.menuToggle, isMenuOpen && styles.active)}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={clsx(styles.navItems, isMenuOpen && styles.visible)}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={clsx(
                styles.navItem,
                path === item.path ? styles.active : ''
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

const Home: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <h1 className={styles.heading}>
          <svg viewBox="0 0 300 .1" className={styles.svg}>
            <text x="12" className={styles.text}>
              SHAD3RS
            </text>
          </svg>
          <svg viewBox="0 0 300 .1">
            <filter id="noise-filter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="5.5"
                numOctaves="3"
                stitchTiles="stitch"
                result="noise"
              />
              <feComposite operator="out" in="SourceGraphic" />
            </filter>
          </svg>
        </h1>
        {/* <h6 className={styles.subheading}>by Tal Hayut</h6> */}
      </main>
      <IntroPage />
    </div>
  )
}

export default Home
