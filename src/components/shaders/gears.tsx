/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import { Color, DoubleSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/gears/fragment.glsl'
import vertexShader from './glsl/gears/vertex.glsl'

export default function Gears() {
  const shader = useRef() as any
  const { nodes } = useGLTF('/models/gears.glb') as any
  const defaultMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        roughness: 0.25,
        metalness: 0.5,
        envMapIntensity: 0.5,
        color: '#858080'
      }),
    []
  )
  const materialProps = {
    metalness: 0.5,
    roughness: 0.25,
    envMapIntensity: 0.5,
    color: new Color('#858080')
  }

  const patchMap = {
    csm_Slice: {
      '#include <colorspace_fragment>': `
      
      #include <colorspace_fragment>;

      if (!gl_FrontFacing)
          gl_FragColor = vec4(0.75, 0.15, 0.3, 1.0);
      `
    }
  }

  const uniforms = {
    uTime: { value: 0 },
    uSliceStart: { value: 1.0, min: -Math.PI, max: Math.PI, step: 0.001 },
    uSliceArc: { value: 1.5, min: 0, max: Math.PI * 2, step: 0.001 }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Gears', controls)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  })

  return (
    <mesh castShadow receiveShadow>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.outerHull.geometry}
        scale={3.714}
      >
        <CustomShaderMaterial
          ref={shader}
          side={DoubleSide}
          uniforms={uniforms}
          patchMap={patchMap}
          baseMaterial={MeshPhysicalMaterial}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          {...materialProps}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.axle.geometry}
        material={defaultMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.gears.geometry}
        material={defaultMaterial}
        position={[0, 1.595, -0.691]}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={[1, 1, 1.016]}
      />
    </mesh>
  )
}

useGLTF.preload('/models/gears.glb')
