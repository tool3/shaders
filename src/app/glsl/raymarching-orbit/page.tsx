'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingOrbit from '~/components/shaders/raymarching-orbit'

export default function Page() {
  return (
    <CanvasWithModel
      allowControls={false}
      orbitEnabled={false}
      initZoom={100}
      useCameraProps={false}
    >
      <RayMarchingOrbit />
    </CanvasWithModel>
  )
}
