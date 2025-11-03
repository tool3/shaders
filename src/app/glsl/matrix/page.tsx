/* eslint-disable react/no-unknown-property */
'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Matrix from '~/components/shaders/matrix'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={40}
      panel
      className={s.page}
      orbitEnabled={false}
    >
      <mesh>
        <planeGeometry args={[10, 10, 32, 32]} />
        <Matrix />
      </mesh>
    </CanvasWithModel>
  )
}
