'use client'

import gsap from 'gsap'
import React, { useLayoutEffect } from 'react'
import SplitType from 'split-type'

import IntroPage from '../components/intro/intro'
import styles from './page.module.scss'

function animate() {
  const tl = gsap.timeline()
  const titles = gsap.utils.toArray(`.${styles.paragraph}`) as HTMLElement[]

  titles.forEach((title, index) => {
    const splitted = new SplitType(title, {
      types: 'chars',
      wordClass: `.${styles.paragraph}`
    })

    tl.from(
      splitted.chars,
      { opacity: 0, y: 80, rotateX: -90, stagger: 0.08 },
      '<'
    )

    if (index < titles.length - 1) {
      tl.to(
        splitted.chars,
        { opacity: 0, y: -80, rotateX: 90, stagger: 0.08, color: 'black' },
        '<1'
      )
    }
  })

  tl.play()
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
            <p className={styles.paragraph}>OP3NGL</p>
            <p className={styles.paragraph}>THR33JS</p>
            <p className={styles.paragraph}>W3B3D</p>
            <p className={styles.paragraph}>SHAD3RS</p>
          </div>
        </h1>
      </main>
      <IntroPage />
    </div>
  )
}

export default Home
