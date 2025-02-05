/* eslint-disable react/no-unknown-property */
import { Environment, useEnvironment, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { DirectionalLightHelper } from 'three'
import { RectAreaLightHelper } from 'three-stdlib'

export default function WobblySphere() {
  const shader = useRef() as any

  //   const uniforms = {
  //     uTime: { value: 0 },
  //     uColor: { value: new Color('#70c1ff') }
  //   }

  //   const controls = getControlsFromUniforms(uniforms, shader)
  //   useControls('WobblySphere', controls)

  //   useFrame(({ clock }) => {
  //     const elapsedTime = clock.getElapsedTime()
  //     if (shader.current) shader.current.uniforms.uTime.value = elapsedTime
  //   })
  const light = useRef() as any
  return (
    <>
      <mesh position={[0, 0, -5]} receiveShadow castShadow>
        <planeGeometry args={[20, 20, 100, 100]} />
        <meshStandardMaterial color={'gray'} />
      </mesh>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[2.5, 50]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <directionalLight
        ref={light}
        position={[0, 5, 10]}
        castShadow
        receiveShadow
        intensity={10}
      />
    </>
  )
}
