/* eslint-disable react/no-unknown-property */
'use client'

import { Environment } from '@react-three/drei'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import ProceduralTerrain from '~/components/shaders/procedural-terrain'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      cameraPosition={[-10, 6, -2]}
      panel
      className={s.page}
      minDistance={3}
    >
      <ProceduralTerrain />
      <Environment
        backgroundBlurriness={0.5}
        files="/textures/environments/spruit_sunrise.hdr"
      />
      <directionalLight
        position={[6.25, 3, 4]}
        castShadow
        receiveShadow
        color="#ffffff"
        intensity={2}
      />
    </CanvasWithModel>
  )
}
