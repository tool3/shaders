'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingOrbit from '~/components/shaders/raymarching-orbit'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={3} useCameraProps={false}>
      <RayMarchingOrbit />
    </CanvasWithModel>
  )
}
