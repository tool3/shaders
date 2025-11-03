/* eslint-disable react/no-unknown-property */
'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import DottedShift from '~/components/shaders/dotted-shift'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={280}
      panel
      className={s.page}
      orbitEnabled={false}
    >
      <mesh>
        <planeGeometry args={[5, 5, 32, 32]} />
        <DottedShift />
      </mesh>
    </CanvasWithModel>
  )
}
