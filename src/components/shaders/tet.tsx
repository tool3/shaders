/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { Color, MeshPhysicalMaterial, Vector2 } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { mergeVertices } from 'three-stdlib'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/tet/fragment.glsl'
import vertexShader from './glsl/tet/vertex.glsl'

export default function Tet() {
  const shader = useRef() as any
  const icohedron = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const materialProps = useControls({
    metalness: { value: 0, min: 0, max: 1 },
    roughness: { value: 0.5, min: 0, max: 1 },
    transmission: { value: 0, min: 0, max: 1 },
    thickness: { value: 1.5, min: 0, max: 2 },
    ior: { value: 1.5, min: 0, max: 2 },
    wireframe: false,
    transparent: true
  })

  const resolution = new Vector2(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  )

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color('#ff794d') },
    uShadowColor: { value: new Color('#8e19b8') },
    uLightColor: { value: new Color('#e5ffe0') },
    uLightRepititions: { value: 250.0, min: 10.0, max: 300.0 },
    uShadowRepititions: { value: 200.0, min: 10.0, max: 300.0 },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: resolution
    },
    uColorA: { value: new Color('#ffffff') },
    uColorB: { value: new Color('#484646') }
  }

  useEffect(() => {
    if (icohedron.current) {
      icohedron.current.geometry = mergeVertices(icohedron.current.geometry)
      icohedron.current.geometry.computeTangents()
    }
  }, [icohedron])

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Tet', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  return (
    <mesh
      ref={icohedron}
      castShadow
      receiveShadow
      rotation={[Math.PI, Math.PI, 0]}
    >
      <coneGeometry args={[5, 8, 3, 1]} />
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
