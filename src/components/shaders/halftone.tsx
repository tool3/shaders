/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { Color, DoubleSide, Vector2 } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/halftone/fragment.glsl'
import vertexShader from './glsl/halftone/vertex.glsl'

export default function Halftone() {
  const shader = useRef() as any
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color('#ff794d') },
    uShadowColor: { value: new Color('#8e19b8') },
    uLightColor: { value: new Color('#e5ffe0') },
    uLightRepititions: { value: 250.0, min: 10.0, max: 300.0 },
    uShadowRepititions: { value: 200.0, min: 10.0, max: 300.0 },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Halftone', controls)

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
