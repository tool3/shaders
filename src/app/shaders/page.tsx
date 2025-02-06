import Image from 'next/image'
import Link from 'next/link'

import s from './page.module.scss'

export default function Page() {
  const shaders = [
    {
      name: 'displacement',
      path: '/shaders/displacement'
    },
    {
      name: 'displacement-shading',
      path: '/shaders/displacement-shading'
    },
    {
      name: 'holographic',
      path: '/shaders/holographic'
    },
    {
      name: 'image-particles',
      path: '/shaders/image-particles'
    },
    {
      name: 'wobbly-sphere',
      path: '/shaders/wobbly-sphere'
    }
  ]

  return (
    <div className={s.grid}>
      {shaders.map(({ name, path }, i) => {
        return (
          <Link href={path} key={i}>
            <Image
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
