'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import ParticleImage from '~/components/shaders/particle-image'

import s from './page.module.scss';

export default function Page() {
  return (
    <CanvasWithModel className={s.page}>
      <ParticleImage />
    </CanvasWithModel>
  )
}
