/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { AdditiveBlending, Color, DoubleSide } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/holographic/fragment.glsl'
import vertexShader from './glsl/holographic/vertex.glsl'

export default function Holographic() {
  const shader = useRef() as any

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color('#70c1ff') }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Holographic', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  return (
    <shaderMaterial
      ref={shader}
      side={DoubleSide}
      depthWrite={false}
      blending={AdditiveBlending}
      transparent
      uniforms={uniforms}
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
    />
  )
}
