'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarchingFractal from '~/components/shaders/raymarching-fractal'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={3} useCameraProps={false}>
      <RayMarchingFractal />
    </CanvasWithModel>
  )
}
