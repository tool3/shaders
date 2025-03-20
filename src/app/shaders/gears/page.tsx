/* eslint-disable react/no-unknown-property */
'use client'

import { Environment } from '@react-three/drei'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Gears from '~/components/shaders/gears'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={0.5}
      panel
      className={s.page}
      minDistance={3}
      useCameraProps={false}
    >
      <Gears />
      <Environment files="/textures/environments/aerodynamics_workshop.hdr" />
      <directionalLight
        position={[0, 5, 10]}
        castShadow
        receiveShadow
        color="#ffffff"
        intensity={3}
      />
    </CanvasWithModel>
  )
}
