/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AdditiveBlending, Vector2 } from 'three'
import { GPUComputationRenderer } from 'three-stdlib'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/gpgpu-flowfield/fragment.glsl'
import particlesFragmentShader from './glsl/gpgpu-flowfield/gpgpu/particles.glsl'
import vertexShader from './glsl/gpgpu-flowfield/vertex.glsl'

export default function GPGPUFlowField() {
  const shader = useRef(null) as any
  const { gl } = useThree()
  const gpu = useRef({}) as any
  const model = useGLTF('/models/ship.glb') as any

  const [gpgpuReady, setGpgpuReady] = useState(false)

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 0.07, step: 0.0001, max: 1.0 },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    },
    uParticlesTexture: { value: null }
  }

  const baseGeometry = {} as any
  baseGeometry.instance = model.scene.children[0]?.geometry
  baseGeometry.count = baseGeometry.instance.attributes.position.count

  const gpgpu = gpu.current
  gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count))
  gpgpu.computation = new GPUComputationRenderer(gpgpu.size, gpgpu.size, gl)

  const [particlesUvArray, sizesArray] = useMemo(() => {
    const array = new Float32Array(baseGeometry.count * 2)
    const sizes = new Float32Array(baseGeometry.count)

    for (let y = 0; y < gpgpu.size; y++) {
      for (let x = 0; x < gpgpu.size; x++) {
        const i = y * gpgpu.size + x
        const i2 = i * 2

        const xUv = (x + 0.5) / gpgpu.size
        const yUv = (y + 0.5) / gpgpu.size

        array[i2 + 0] = xUv
        array[i2 + 1] = yUv

        sizes[i] = Math.random()
      }
    }
    return [array, sizes]
  }, [])

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
    baseParticles.image.data[i4 + 3] = Math.random()
  }

  gpgpu.particlesVariable = gpgpu.computation.addVariable(
    'uParticles',
    particlesFragmentShader,
    baseParticles
  )

  gpgpu.computation.setVariableDependencies(gpgpu.particlesVariable, [
    gpgpu.particlesVariable
  ])

  gpgpu.particlesVariable.material.uniforms.uTime = { value: 0.0 }
  gpgpu.particlesVariable.material.uniforms.uDeltaTime = { value: 0.0 }
  gpgpu.particlesVariable.material.uniforms.uBase = { value: baseParticles }

  const error = gpgpu.computation.init()
  useEffect(() => {
    if (!error) {
      setGpgpuReady(true)
    }
  }, [error])

  let previousTime = 0

  useFrame(({ clock }) => {
    if (gpgpuReady) {
      const elapsedTime = clock.getElapsedTime()
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime

      gpgpu.particlesVariable.material.uniforms.uTime.value = elapsedTime
      gpgpu.particlesVariable.material.uniforms.uDeltaTime.value = deltaTime
      gpgpu.computation.compute()

      const particlesTexture = gpgpu.computation.getCurrentRenderTarget(
        gpgpu.particlesVariable
      ).texture

      if (shader.current) {
        shader.current.uniforms.uTime.value = elapsedTime
        shader.current.uniforms.uParticlesTexture.value = particlesTexture // Assign the texture
      }
    }
  })

  const texture = gpgpu.computation.getCurrentRenderTarget(
    gpgpu.particlesVariable
  ).texture

  const controls = gpgpuReady ? getControlsFromUniforms(uniforms, shader) : []
  useControls('GPGPUFlowfield', controls, [gpgpuReady])

  return (
    <Suspense fallback={null}>
      {/* <mesh position={[3, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={texture} />
      </mesh> */}
      {gpgpuReady && (
        <points>
          <bufferGeometry drawRange={{ start: 0, count: baseGeometry.count }}>
            <bufferAttribute
              array={particlesUvArray}
              itemSize={2}
              attach={'attributes-aParticlesUv'}
            />
            <bufferAttribute
              array={sizesArray}
              attach={'attributes-aSize'}
              itemSize={1}
            />
            <bufferAttribute
              array={baseGeometry.instance.attributes.color.array}
              itemSize={baseGeometry.instance.attributes.color.itemSize}
              attach={'attributes-aColor'}
            />
          </bufferGeometry>
          <shaderMaterial
            attach="material"
            ref={shader}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      )}
    </Suspense>
  )
}
