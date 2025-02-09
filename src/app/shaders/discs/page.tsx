'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Discs from '~/components/shaders/discs'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={200}
      orbitEnabled={false}
      className={s.page}
    >
      <Discs />
    </CanvasWithModel>
  )
}
