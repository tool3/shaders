'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import ImageParticles from '~/components/shaders/image-particles'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={80}
      orbitEnabled={false}
      className={s.page}
    >
      <ImageParticles />
    </CanvasWithModel>
  )
}
