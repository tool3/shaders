'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingScene from '~/components/shaders/raymarching-scene'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={100} useCameraProps={false}>
      <RayMarchingScene />
    </CanvasWithModel>
  )
}
