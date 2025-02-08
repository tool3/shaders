'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingB from '~/components/shaders/ray-marching-b'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={3} useCameraProps={false}>
      <RayMarchingB />
    </CanvasWithModel>
  )
}
