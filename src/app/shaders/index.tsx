'use client'

/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'

// import Suzanne from '~/components/models/suzanne'
import DisplacementShading from '~/components/shaders/displacement-shading'
import ParticleImage from '~/components/shaders/particle-image'
// import Displacement from '~/components/shaders/displacement'
// import Holographic from '~/components/shaders/holographic'

export default function Shaders() {
  const suzzana = useRef() as any

  useFrame((state: any) => {
    const time = state.clock.elapsedTime
    if (suzzana.current) {
      suzzana.current.rotation.y = time * 0.2
    }

    state.controls.target.set(...target.current)
  })

  const target = useRef([0, 0, 0])
  useControls('Camera', {
    target: {
      options: {
        ParticleImage: [0, 0, 0],
        Displacement: [-20, 0, 0],
        DisplacementShading: [-10, 0, 0],
        Holographic: [10, 0, 0]
      },
      onChange: (val) => {
        target.current = val
      }
    }
  })

  const { perf } = useControls({
    perf: true
  })

  return (
    <>
      <Perf
        position="bottom-left"
        style={{ display: perf ? 'block' : 'none' }}
      />
      <ParticleImage />

      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[5, 5, 512, 512]} />
        <Displacement />
      </mesh> */}

      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[5, 5, 512, 512]} />
        <DisplacementShading />
      </mesh> */}

      {/* <mesh ref={suzzana} position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Suzanne />
        <Holographic />
      </mesh> */}
    </>
  )
}
