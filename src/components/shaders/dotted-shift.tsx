/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { DoubleSide } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/dotted-shift/fragment.glsl'
import vertexShader from './glsl/dotted-shift/vertex.glsl'

export default function DottedShift() {
  const shader = useRef() as any
  const uniforms = {
    uTime: { value: 0 },
    uAbberation: { value: 0.03, min: 0.0, max: 0.05, step: 0.001 },
    uGridSize: { value: 150.0, max: 200.0, min: 50.0 }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('DottedShift', controls)

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
