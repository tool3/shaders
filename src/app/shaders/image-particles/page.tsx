'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import ParticleImage from '~/components/shaders/particle-image'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={80}
      orbitEnabled={false}
      className={s.page}
    >
      <ParticleImage />
    </CanvasWithModel>
  )
}
