/* eslint-disable react/no-unknown-property */
'use client'

import { Environment } from '@react-three/drei'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import WobblySphere from '~/components/shaders/wobbly'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      initZoom={200}
      panel
      className={s.page}
      minDistance={5}
      useCameraProps={false}
    >
      <WobblySphere />
      <Environment files="/textures/environments/autumn_field_1k.hdr" />
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
