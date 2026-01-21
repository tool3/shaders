/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { DoubleSide, Vector3 } from 'three'

import useMouse from '~/hooks/use-mouse'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/matrix/fragment.glsl'
import vertexShader from './glsl/matrix/vertex.glsl'

export default function Matrix() {
  const shader = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const resolution = new Vector3(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
    1.0
  )

  const texture = useTexture('/textures/matcaps/glass_60.png')

  const uniforms = {
    uTime: { value: 0 },
    uAbberation: { value: 0.03, min: 0.0, max: 0.08, step: 0.0001 },
    uGridSize: { value: 180.0, max: 500.0, min: 50.0 },
    uNoiseMultiplier: { value: 1.0, max: 10.0, min: 0.1 },
    uResolution: { value: resolution },
    iChannel0: { value: texture },
    uMouse: {
      value: new Vector3(0.0, 0.0, 0.0)
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Matrix', controls)
  useMouse(shader, true)

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
