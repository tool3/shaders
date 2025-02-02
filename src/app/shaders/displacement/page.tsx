/* eslint-disable react/no-unknown-property */
'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Displacement from '~/components/shaders/displacement'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={200}
      panel
      className={s.page}
      cameraPosition={[0, 100, 100]}
    >
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10, 512, 512]} />
        <Displacement />
      </mesh>
    </CanvasWithModel>
  )
}
