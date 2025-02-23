/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { DoubleSide, Vector2 } from 'three'

import fragmentShader from './glsl/grid/fragment.glsl'
import vertexShader from './glsl/grid/vertex.glsl'

export default function Grid() {
  const shader = useRef() as any
  const planeRef = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  const resolution = new Vector2(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  )

  const uniforms = {
    uTime: { value: 0 },
    uResolution: {
      max: resolution,
      value: resolution
    }
  }

  return (
    <Suspense fallback={null}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry ref={planeRef} args={[10, 10, 1, 1]} />
        <shaderMaterial
          attach="material"
          ref={shader}
          side={DoubleSide}
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>
    </Suspense>
  )
}
