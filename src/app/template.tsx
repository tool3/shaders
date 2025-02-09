'use client'

import { useLayoutEffect } from 'react'

import { animateIn } from '~/components/util/animate'

import s from '../components/loader/loader.module.scss'

export default function Template({ children }) {
  useLayoutEffect(() => {
    animateIn()
  }, [])

  const letters = ['S', 'H', 'A', 'D', '3', 'R', 'S']
  const bars = Array.from({ length: 7 }, (_, i) => {
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

  return (
    <div className={s.loader}>
      <div className={s.bars}>{bars}</div>
      {children}
    </div>
  )
}
