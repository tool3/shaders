'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import GPGPUFlowField from '~/components/shaders/gpgpu-flowfield'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={2}
      useCameraProps={false}
      cameraPosition={[10, 5, 10]}
      className={s.page}
    >
      <GPGPUFlowField />
    </CanvasWithModel>
  )
}
