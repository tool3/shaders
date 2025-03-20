/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useRef } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/intro/fragment.glsl'
import vertexShader from './glsl/intro/vertex.glsl'

export default function Intro() {
  const shader = useRef() as any
  const planeRef = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) {
      shader.current.uniforms.uTime.value = elapsedTime
    }
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
    },
    uMouse: {
      value: new Vector2(0.0, 0.0)
    },
    uColorA: { value: new Color(120.0 / 255.0, 158.0 / 255.0, 113.0 / 255.0) },
    uColorB: { value: new Color(224.0 / 255.0, 148.0 / 255.0, 66.0 / 255.0) },
    uAccent: { value: new Color(0, 0, 0) }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Intro', controls)

  // cursor && useMouse(shader, true)

  return (
    <Suspense fallback={null}>
      <mesh>
        <planeGeometry ref={planeRef} args={[5, 5, 1, 1]} />
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
