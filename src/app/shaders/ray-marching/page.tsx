'use client'

import { Canvas } from '@react-three/fiber'

import RayMarching from '~/components/shaders/ray-marching'

export default function Page() {
  return (
    <Canvas camera={{ fov: 70 }} gl={{ autoClear: false, alpha: true }}>
      <RayMarching />
    </Canvas>
  )
}
