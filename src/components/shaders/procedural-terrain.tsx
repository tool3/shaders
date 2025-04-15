/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import {
  BoxGeometry,
  Color,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  RGBADepthPacking
} from 'three'
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg'
import CustomShaderMaterial from 'three-custom-shader-material'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/procedural-terrain/fragment.glsl'
import vertexShader from './glsl/procedural-terrain/vertex.glsl'

export default function ProceduralTerrain() {
  const shader = useRef() as any

  const materialProps = {
    metalness: 0,
    roughness: 0.5,
    color: new Color('#85d354')
  }

  const uniforms = {
    uTime: { value: 0 },
    uPositionFrequency: { value: 0.2, min: 0.0, max: 1.0, step: 0.00001 },
    uStrength: { value: 2.0, min: 0.0, max: 5.0, step: 0.001 },
    uWarpFrequency: { value: 5.0, min: 0.0, max: 10.0, step: 0.001 },
    uWarpStrength: { value: 0.5, min: 0.0, max: 1.0, step: 0.001 },

    uColorWaterDeep: { value: new Color('#002b3d') },
    uColorWaterSurface: { value: new Color('#66a8ff') },
    uColorSand: { value: new Color('#ffe894') },
    uColorGrass: { value: new Color('#85d534') },
    uColorSnow: { value: new Color('#ffffff') },
    uColorRock: { value: new Color('#bfbd8d') }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('ProceduralTerrain', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  const boardFill = new Brush(new BoxGeometry(11, 2, 11))
  const boardHole = new Brush(new BoxGeometry(10, 2.1, 10))

  const evaluator = new Evaluator()
  const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION)
  board.geometry.clearGroups()

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        metalness: 0,
        roughness: 0.3,
        color: '#ffffff'
      }),
    []
  )

  const geometry = new PlaneGeometry(10, 10, 256, 256)
  geometry.rotateX(-Math.PI * 0.5)
  geometry.deleteAttribute('uv')
  geometry.deleteAttribute('normal')
  geometry.computeVertexNormals()

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={board.geometry}
        material={material}
      />
      <mesh geometry={geometry} receiveShadow castShadow>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={MeshDepthMaterial}
          vertexShader={vertexShader}
          depthPacking={RGBADepthPacking}
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
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10, 1, 1]} />
        <meshPhysicalMaterial transmission={1} roughness={0.3} />
      </mesh>
    </group>
  )
}
