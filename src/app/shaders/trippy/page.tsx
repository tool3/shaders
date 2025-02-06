'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Trippy from '~/components/shaders/trippy'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={200}
      orbitEnabled={false}
      className={s.page}
    >
      <Trippy />
    </CanvasWithModel>
  )
}
