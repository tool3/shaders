'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'

import Refract from '../shaders/refract'
import s from './refract.module.scss'

export default function IntroPage() {
  return (
    <CanvasWithModel
      className={s.canvas}
      orbitEnabled={false}
      initZoom={3}
      useCameraProps={false}
      panel
    >
      <Refract />
    </CanvasWithModel>
  )
}
