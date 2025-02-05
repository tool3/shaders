'use client'

import { useProgress } from '@react-three/drei'
import gsap from 'gsap'
import { useLayoutEffect } from 'react'

import s from './loader.module.scss'

export default function Loader() {
  const { progress } = useProgress()

  useLayoutEffect(() => {
    gsap.from(`.${s.bar}`, {
      yPercent: 100,
      transformOrigin: 'top',
      ease: 'expo.inOut',
      duration: 1.3,
      stagger: { amount: 0.8 }
    })
    gsap.to(`.${s.bar}`, {
      yPercent: 0,
      height: 0,
      transformOrigin: 'bottom',
      delay: 1.3,
      ease: 'expo.inOut',
      duration: 1.3,
      stagger: { amount: 0.8 }
    })
  }, [progress])

  const letters = ['T', 'H', 'E', 'L', 'A', 'B']
  const bars = Array.from({ length: 6 }, (_, i) => {
    return (
      <div key={i} className={s.bar}>
        <svg viewBox="0 0 50 100" preserveAspectRatio="none">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            {letters[i]}
          </text>
        </svg>
      </div>
    )
  })

  return <div className={s.loader}>{bars}</div>
}
