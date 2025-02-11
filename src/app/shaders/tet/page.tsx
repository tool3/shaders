/* eslint-disable react/no-unknown-property */
'use client'

import { Environment } from '@react-three/drei'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Tet from '~/components/shaders/tet'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={70}
      panel
      className={s.page}
      minDistance={5}
      cameraPosition={[0, 30, 100]}
    >
      <Tet />
      <Environment files="/textures/environments/autumn_field_1k.hdr" />
      <directionalLight
        position={[50, 5, 10]}
        castShadow
        receiveShadow
        color="#ffffff"
        intensity={3}
      />
    </CanvasWithModel>
  )
}
