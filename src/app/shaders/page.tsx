import Image from 'next/image'
import Link from 'next/link'

import s from './page.module.scss'

export default function Page() {
  const shaders = [
    'displacement',
    'displacement-shading',
    'holographic',
    'image-particles',
    'wobbly-sphere',
    'halftone',
    'tet',
    'grid',
    'intro',
    'trippy',
    'raymarching',
    'raymarching-orbit',
    'raymarching-scene'
  ]

  return (
    <div className={s.grid}>
      {shaders.map((name, i) => {
        const path = `/shaders/${name}`
        return (
          <Link href={path} key={i} className={s.link}>
            <div className={s.label}>{name}</div>
            <Image
              priority
              alt={name}
              className={s.image}
              src={`/images/shaders/${name}.png`}
              width={1024}
              height={500}
              sizes="100vw"
            />
          </Link>
        )
      })}
    </div>
  )
}
