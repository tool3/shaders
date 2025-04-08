'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Intro from '~/components/shaders/intro'

import s from './intro.module.scss'

export default function IntroPage() {
  return (
    <CanvasWithModel
      className={s.canvas}
      orbitEnabled={false}
      initZoom={200}
      useCameraProps={false}
    >
      <Intro />
    </CanvasWithModel>
  )
}
