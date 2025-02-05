/* eslint-disable react/no-unknown-property */
import { useRef } from 'react'

export default function WobblySphere() {
  //   const shader = useRef() as any

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
