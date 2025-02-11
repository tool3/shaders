'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Intro from '~/components/shaders/intro'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      className={s.canvas}
      orbitEnabled={false}
      initZoom={5}
      useCameraProps={false}
    >
      <Intro />
    </CanvasWithModel>
  )
}
