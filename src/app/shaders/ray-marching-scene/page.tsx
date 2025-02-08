'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingScene from '~/components/shaders/ray-marching-scene'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={3} useCameraProps={false}>
      <RayMarchingScene />
    </CanvasWithModel>
  )
}
