'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

import s from './page.module.scss'

const shaders = [
  'refract',
  'trippy',
  'raymarching',
  'raymarching-orbit',
  'raymarching-scene'
]

export default function Page() {
  return (
    <div className={s.grid}>
      {shaders.map((name, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className={s.card}
        >
          <Link href={`/glsl/${name}`} className={s.link}>
            <div className={s.overlay} />
            <Image
              priority
              alt={name}
              className={s.image}
              src={`/images/shaders/${name}.png`}
              width={1024}
              height={500}
              sizes="100vw"
            />
            <div className={s.label}>{name.replace(/-/g, ' ')}</div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
