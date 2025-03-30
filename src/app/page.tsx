'use client'

import clsx from 'clsx'
import gsap from 'gsap'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import SplitType from 'split-type'

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

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(max-width: 800px)', () => {
      if (isMenuOpen) {
        gsap.to(`.${styles.navItems}`, {
          opacity: 1,
          duration: 0.3,
          display: 'flex',
        })
      } else {
        gsap.to(`.${styles.navItems}`, { opacity: 0, duration: 0.3, })
        gsap.to(`.${styles.navItems}`, { display: 'none', delay: 0.3 })
      }
    })
  }, [isMenuOpen])

  return (
    <nav className={clsx(styles.navbar, scrolled && styles.scrolled)}>
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

        <div className={clsx(styles.navItems)}>
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

function animate() {
  const tl = gsap.timeline()
  const titles = gsap.utils.toArray(`.${styles.paragraph}`) as any[]

  titles.forEach((title) => {
    const splitted = new SplitType(title, {
      types: 'chars',
      wordClass: `.${styles.paragraph}`
    })
    tl.from(
      splitted.chars,
      { opacity: 0, y: 80, rotateX: -90, stagger: 0.08 },
      '<0.1'
    ).to(
      splitted.chars,
      { opacity: 0, y: -80, rotateX: 90, stagger: 0.08 },
      '<1'
    )
    tl.repeat(-1)
  })
}

const Home: React.FC = () => {
  useLayoutEffect(() => {
    animate()
  }, [])

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <h1 className={styles.heading}>
          <div className={styles.lettersContainer}>
            <p className={styles.paragraph}>SHAD3RS</p>
            <p className={styles.paragraph}>THR33JS</p>
            <p className={styles.paragraph}>GLSL</p>
          </div>
        </h1>
      </main>
      <IntroPage />
    </div>
  )
}

export default Home
