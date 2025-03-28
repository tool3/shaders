/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useRef } from 'react'
import { AdditiveBlending, DoubleSide, SphereGeometry, Vector2 } from 'three'
import { GPUComputationRenderer } from 'three-stdlib'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/gpgpu-flowfield/fragment.glsl'
import particlesFragmentShader from './glsl/gpgpu-flowfield/gpgpu/particles.glsl'
import vertexShader from './glsl/gpgpu-flowfield/vertex.glsl'

export default function GPGPUFlowField() {
  const shader = useRef() as any
  const { gl } = useThree()

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 0.4 },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('GPGPUFlowfield', controls)

  const baseGeometry = {} as any
  baseGeometry.instance = new SphereGeometry(3)
  baseGeometry.count = baseGeometry.instance.attributes.position.count

  const gpgpu = {} as any
  gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
  gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, gl)

  const baseParticles = gpgpu.computation.createTexture()

  for (let i = 0; i < baseGeometry.count; i++) {
    const i3 = i * 3
    const i4 = i * 4

    baseParticles.image.data[i4 + 0] =
      baseGeometry.instance.attributes.position.array[i3 + 0]
    baseParticles.image.data[i4 + 1] =
      baseGeometry.instance.attributes.position.array[i3 + 1]
    baseParticles.image.data[i4 + 2] =
      baseGeometry.instance.attributes.position.array[i3 + 2]
    baseParticles.image.data[i4 + 3] = 0
  }

  gpgpu.particlesVariable = gpgpu.computation.addVariable(
    'uParticles',
    particlesFragmentShader,
    baseParticles
  )
  gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
    gpgpu.particlesVariable
  ])

  gpgpu.computation.init()

  useFrame(() => gpgpu.computation.compute())

  return (
    <Suspense fallback={null}>
      <mesh position={[3, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial
          map={
            gpgpu.computation.getCurrentRenderTarget(gpgpu.particlesVariable)
              .texture
          }
        />
      </mesh>
      <points>
        <sphereGeometry args={[3, 32, 32]} />
        <shaderMaterial
          blending={AdditiveBlending}
          attach="material"
          ref={shader}
          side={DoubleSide}
          uniforms={uniforms}
          depthWrite={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
    </Suspense>
  )
}
