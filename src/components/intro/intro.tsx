'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Intro from '~/components/shaders/intro'

import s from './intro.module.scss'

export default function IntroPage({ cursor = true }: { cursor?: boolean }) {
  return (
    <CanvasWithModel
      className={s.canvas}
      orbitEnabled={false}
      initZoom={5}
      useCameraProps={false}
      allowControls={false}
    >
      <Intro cursor={cursor} />
    </CanvasWithModel>
  )
}
