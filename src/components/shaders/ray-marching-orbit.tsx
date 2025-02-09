/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useLayoutEffect, useRef } from 'react'
import { DoubleSide, Vector2 } from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/raymarching-orbit/fragment.glsl'
import vertexShader from './glsl/raymarching-orbit/vertex.glsl'

export default function RayMarchingOrbit() {
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
  const texture = useTexture('/textures/texture.jpg')
  const uniforms = {
    uTime: { value: 0 },
    uResolution: {
      max: resolution,
      value: resolution
    },
    uTexture: {
      value: texture.channel
    },
    uMouse: {
      value: new Vector2(0.0, 0.0)
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('RayMarching', controls)

  function handleMouse(e: PointerEvent) {
    if (e.buttons === 1) {
      const x = e.offsetX / sizes.width
      const y = 1 - e.offsetY / sizes.height

      if (shader.current) {
        shader.current.uniforms.uMouse.value.x = x
        shader.current.uniforms.uMouse.value.y = y
      }
    }
  }

  useLayoutEffect(() => {
    addEventListener('pointermove', handleMouse)
  }, [])

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
