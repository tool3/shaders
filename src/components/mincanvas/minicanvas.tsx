/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useEffect, useRef, useState } from 'react'

import { useDeviceDetect } from '~/hooks/use-device-detect'

import Debug from '../debug/debug'

export default function CanvasWithModel({
  style,
  children
}: {
  style?: any
  children: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef() as any
  const [active, setActive] = useState(false)
  const { isMobile, isTablet } = useDeviceDetect()
  const zoom = isMobile && !isTablet ? 13 : 30

  const { fps } = useControls({
    fps: false
  })

  useEffect(() => {
    if (target.current) {
      gsap.from(target.current, { zoom: 0, delay: 10 })
    }
  }, [target])

  return (
    <>
      <Leva collapsed hidden={!active} />
      {fps ? <Stats /> : null}
      <Debug set={setActive} />
      <Canvas
        ref={canvasRef}
        dpr={[1, 2]}
        orthographic
        camera={{
          frustumCulled: true,
          fov: 70,
          position: [0, 0, 50],
          zoom
        }}
        gl={{ premultipliedAlpha: false, powerPreference: 'high-performance' }}
        style={style}
      >
        {fps ? <Perf position="bottom-left" logsPerSecond={1} /> : null}
        <color attach={'background'} args={['#000']} />
        <Suspense fallback={null}>{children}</Suspense>

        <OrbitControls ref={target} makeDefault minZoom={10} maxZoom={300} />
      </Canvas>
    </>
  )
}
