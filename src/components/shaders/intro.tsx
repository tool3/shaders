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

  const palettes = {
    default: ['#b6ceb2', '#f1c88b', '#000000'],
    blue: ['#a8dadc', '#457b9d', '#8ba3a3'],
    blueish: ['#b19cd9', '#87ceeb', '#000000'],
    green: ['#556b2f', '#8cbe29', '#000000'],
    lavender: ['#483d8b', '#8d72c4', '#d8bfd8'],
    pastel: ['#ffc2cc', '#e3b3eb', '#585b89']
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
    uColorA: { value: new Color('#b6ceb2') },
    uColorB: { value: new Color('#f1c88b') },
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
