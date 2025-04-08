'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import RayMarching from '~/components/shaders/raymarching'

export default function Page() {
  return (
    <CanvasWithModel orbitEnabled={false} initZoom={80} useCameraProps={false}>
      <RayMarching />
    </CanvasWithModel>
  )
}
