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
    metalness: { value: 0.5, min: 0, max: 1 },
    roughness: { value: 0.7, min: 0, max: 1 },
    wireframe: false
  })

  const resolution = new Vector2(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  )

  const uniforms = {
    uTime: { value: 0 },
    uColorA: { value: new Color('#fc42f0') },
    uColorB: { value: new Color('#0070ff') },
    uAccent: { value: new Color('#ff8600') },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: resolution
    }
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
      position={[0, -1, 0]}
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
