/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import {
  Color,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  RGBADepthPacking
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { mergeVertices } from 'three-stdlib'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/wobbly-sphere/fragment.glsl'
import vertexShader from './glsl/wobbly-sphere/vertex.glsl'

export default function WobblySphere() {
  const shader = useRef() as any
  const icohedron = useRef() as any

  const materialProps = useControls({
    metalness: { value: 0, min: 0, max: 1 },
    roughness: { value: 0.5, min: 0, max: 1 },
    transmission: { value: 0, min: 0, max: 1 },
    thickness: { value: 1.5, min: 0, max: 2 },
    ior: { value: 1.5, min: 0, max: 2 },
    wireframe: false,
    transparent: true
  })

  const uniforms = {
    uTime: { value: 0 },
    uTimeFrequency: { value: 0.4 },
    uPositionFrequency: { value: 0.5 },
    uStrength: { value: 0.3 },
    uWarpTimeFrequency: { value: 0.12 },
    uWarpPositionFrequency: { value: 0.38 },
    uWarpStrength: { value: 1.7 },
    uColorA: { value: new Color('#0000ff') },
    uColorB: { value: new Color('#ff0000') }
  }

  useEffect(() => {
    if (icohedron.current) {
      icohedron.current.geometry = mergeVertices(icohedron.current.geometry)
      icohedron.current.geometry.computeTangents()
    }
  }, [icohedron])

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('WobblySphere', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  return (
    <mesh ref={icohedron} castShadow receiveShadow>
      <icosahedronGeometry args={[2.5, 128]} />
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={MeshDepthMaterial}
        depthPacking={RGBADepthPacking}
        vertexShader={vertexShader}
        attach={'customDepthMaterial'}
      />
      <CustomShaderMaterial
        ref={shader}
        uniforms={uniforms}
        baseMaterial={MeshPhysicalMaterial}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        {...materialProps}
      />
    </mesh>
  )
}
