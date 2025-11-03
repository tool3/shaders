import clsx from 'clsx'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import styles from './navItem.module.scss'

export default function NavItem(props) {
  const { item, setIsMenuOpen } = props
  const [tl] = useState(gsap.timeline())
  const path = usePathname()

  useEffect(() => {
    const splitted = new SplitText(`.${styles[item.name]}`)
    const splitted2 = new SplitText(`.${styles[item.name + '2']}`)

    const stagger = 0.04
    const duration = 0.6
    const ease = 'circ.in'
    const y = 10
    const rotateX = 90
    const opacity = 0

    tl.to(splitted.chars, {
      opacity,
      y: -y,
      rotateX,
      stagger,
      duration,
      ease
    })

    tl.from(
      splitted2.chars,
      {
        opacity,
        y,
        rotateX,
        stagger,
        duration,
        ease
      },
      '<'
    )
  }, [tl, item])

  const onEnter = useCallback(() => {
    tl.play(0)
  }, [tl])

  const onLeave = useCallback(() => {
    tl.reverse()
  }, [tl])

  return (
    <Link
      key={item.name}
      href={item.path}
      onMouseEnter={() => onEnter()}
      onMouseLeave={() => onLeave()}
      className={clsx(styles.navItem, path === item.path ? styles.active : '')}
      onClick={() => setIsMenuOpen(false)}
    >
      <div className={styles[item.name]}>{item.name}</div>
      <div className={styles[item.name + '2']}>{item.name}</div>
    </Link>
  )
}
