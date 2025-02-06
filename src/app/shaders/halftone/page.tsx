/* eslint-disable react/no-unknown-property */
'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Suzanne from '~/components/models/suzanne'
import Halftone from '~/components/shaders/halftone'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel initZoom={200} panel className={s.page}>
      <mesh>
        <Suzanne />
        <Halftone />
      </mesh>

      <mesh position={[5, 0, 0]}>
        <torusKnotGeometry args={[0.6, 0.25, 128, 32]} />
        <Halftone />
      </mesh>

      <mesh position={[-5, 0, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <Halftone />
      </mesh>
    </CanvasWithModel>
  )
}
