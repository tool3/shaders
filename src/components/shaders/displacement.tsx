/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/displacement/fragment.glsl'
import vertexShader from './glsl/displacement/vertex.glsl'

export default function Displacement() {
  const shader = useRef() as any

  const uniforms = {
    uTime: { value: 0 },
    uDepthColor: { value: new Color('#186691') },
    uSurfaceColor: { value: new Color('#9bd8ff') },
    uColorOffset: { value: 0.2 },
    uColorMultiplier: { value: 5.0 },
    uBigWavesSpeed: { value: 0.75 },
    uBigWavesElevation: { value: 0.15 },
    uBigWavesFrequency: { value: new Vector2(0.5, 1.5) },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3.0 },
    uSmallWavesIterations: { value: 4.0 }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  console.log({ controls })
  useControls('Displacement', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  return (
    <shaderMaterial
      ref={shader}
      side={DoubleSide}
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  )
}
