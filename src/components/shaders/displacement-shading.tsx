/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/displacement-shading/fragment.glsl'
import vertexShader from './glsl/displacement-shading/vertex.glsl'

export default function DisplacementShading() {
  const shader = useRef() as any
  const uniforms = {
    uTime: { value: 0 },
    uDepthColor: { value: new Color('#ff4000') },
    uSurfaceColor: { value: new Color('#151c37') },
    uColorOffset: { value: 0.925 },
    uColorMultiplier: { value: 1.0 },
    uBigWavesSpeed: { value: 0.75 },
    uBigWavesElevation: { value: 0.15 },
    uBigWavesFrequency: { value: new Vector2(0.5, 1.5) },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesIterations: { value: 4 }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('DisplacementShading', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  useEffect(() => {
    if (shader.current) {
      // shader.current.deleteAttribute('normal')
      // shader.current.deleteAttribute('uv')
    }
  }, [shader])

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
