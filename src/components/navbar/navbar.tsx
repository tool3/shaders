'use client'

import clsx from 'clsx'
import gsap from 'gsap'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useState } from 'react'
import SplitType from 'split-type'

import styles from './navbar.module.scss'

export const Navbar: React.FC = () => {
  const path = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'home', path: '/' },
    { name: 'threejs', path: '/shaders' },
    { name: 'opengl', path: '/glsl' }
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
          duration: 0.2,
          pointerEvents: 'all'
        })
      } else {
        gsap.to(`.${styles.navItems}`, {
          opacity: 0,
          duration: 0.2,
          pointerEvents: 'none'
        })
      }
    })
  }, [isMenuOpen])

  function onEnter(className: string, duration = 0.3) {
    const tl = gsap.timeline()
    const out = gsap.utils.toArray(className) as HTMLElement[]

    out.forEach((title) => {
      const splitted = new SplitType(title, {
        types: 'chars',
        wordClass: className
      })

      tl.to(splitted.chars, {
        opacity: 0,
        y: -10,
        rotateX: 90,
        duration,
        stagger: 0.03,
        color: '#87ceeb'
      }).from(splitted.chars, {
        opacity: 1,
        y: 10,
        rotateX: -90,
        duration,
        stagger: 0.03,
        color: 'white'
      })
    })

    tl.play()
  }
  function onLeave(className: string, duration = 0.3) {
    const tl = gsap.timeline()
    const out = gsap.utils.toArray(className) as HTMLElement[]

    out.forEach((title) => {
      const splitted = new SplitType(title, {
        types: 'chars',
        wordClass: className
      })

      tl.to(splitted.chars, {
        opacity: 1,
        y: 10,
        rotateX: -90,
        duration,
        stagger: 0.05,
        color: '#b19cd9'
      })
      tl.from(
        splitted.chars,
        {
          opacity: 0,
          y: -10,
          rotateX: 90,
          duration,
          stagger: 0.05,
          color: '#b19cd9'
        },
        '-=0.2'
      )
    })

    tl.play()
  }

  return (
    <nav className={clsx(styles.navbar, scrolled && styles.scrolled)}>
      <div className={styles.navContainer}>
        <div
          className={styles.logoContainer}
          onMouseEnter={() => onEnter(`.${styles.word}`, 0.2)}
          onMouseLeave={() => onLeave(`.${styles.word}`, 0.2)}
        >
          <Link href="/" className={styles.logo}>
            <p className={styles.word}>SHAD3RS</p>
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
              onMouseEnter={() =>
                onEnter(`.${styles.navItem}.${item.name}`, 0.2)
              }
              onMouseLeave={() =>
                onLeave(`.${styles.navItem}.${item.name}`, 0.2)
              }
              className={clsx(
                styles.navItem,
                item.name,
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
