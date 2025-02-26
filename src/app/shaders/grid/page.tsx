'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Grid from '~/components/shaders/grid'

export default function Page() {
  return (
    <CanvasWithModel initZoom={15} panel cameraPosition={[0, 50, 0]}>
      <Grid />
    </CanvasWithModel>
  )
}
