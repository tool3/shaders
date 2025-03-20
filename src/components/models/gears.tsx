/* eslint-disable react/no-unknown-property */
import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'

export default function GearsModel(props) {
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
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.outerHull.geometry}
        scale={3.714}
      />
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
    </group>
  )
}

useGLTF.preload('/models/gears.glb')
