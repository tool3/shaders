'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Grid from '~/components/shaders/grid'

export default function Page() {
  return (
    <CanvasWithModel initZoom={5} useCameraProps={false}>
      <Grid />
    </CanvasWithModel>
  )
}
