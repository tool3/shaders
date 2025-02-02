/* eslint-disable react/no-unknown-property */
'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

import CanvasWithModel from '~/components/mincanvas/minicanvas'
import Suzanne from '~/components/models/suzanne'
import Holographic from '~/components/shaders/holographic'

import s from './page.module.scss'

function Model() {
  const suzanne = useRef() as any
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (suzanne.current) suzanne.current.rotation.y = -time * 0.2
  })

  return (
    <mesh ref={suzanne} rotation={[0, 0, 0]}>
      <Suzanne />
      <Holographic />
    </mesh>
  )
}

export default function Page() {
  return (
    <CanvasWithModel initZoom={200} panel className={s.page}>
      <Model />
    </CanvasWithModel>
  )
}
