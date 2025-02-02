'use client'

import CanvasWithModel from '~/components/mincanvas/minicanvas'

import Shaders from './shaders'

const HomePage = () => {
  return (
    <CanvasWithModel style={{ width: '100vw', height: '100svh' }}>
      <Shaders />
    </CanvasWithModel>
  )
}

export default HomePage
