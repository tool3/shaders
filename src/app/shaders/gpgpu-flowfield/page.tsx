'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import GPGPUFlowField from '~/components/shaders/gpgpu-flowfield'

import s from './page.module.scss'

export default function Page() {
  return (
    <CanvasWithModel
      panel
      initZoom={3}
      useCameraProps={false}
      className={s.page}
    >
      <GPGPUFlowField />
    </CanvasWithModel>
  )
}
