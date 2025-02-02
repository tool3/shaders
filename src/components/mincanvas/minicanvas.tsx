/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useLayoutEffect, useRef, useState } from 'react'

import { useDeviceDetect } from '~/hooks/use-device-detect'

import Debug from '../debug/debug'

export default function CanvasWithModel({
  className,
  maxZoom = 300,
  minZoom = 10,
  children
}: {
  className?: string
  maxZoom?: number
  minZoom?: number
  children: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef([0, 0, 0]) as any
  const [active, setActive] = useState(false)
  const { isMobile, isTablet } = useDeviceDetect()
  const zoom = isMobile && !isTablet ? 13 : 30

  const { fps } = useControls({
    fps: false
  })

  useLayoutEffect(() => {
    if (target.current) {
      gsap.to(target.current.position, {
        z: 0,
        delay: 1
      })
    }
  }, [target])

  return (
    <>
      <Leva collapsed hidden={!active} />
      {fps ? <Stats /> : null}
      <Debug set={setActive} />
      <Canvas
        className={className}
        ref={canvasRef}
        dpr={[1, 2]}
        orthographic
        camera={{
          frustumCulled: true,
          fov: 50,
          position: [0, 0, 50],
          zoom
        }}
        gl={{
          antialias: true,
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: 'high-performance'
        }}
      >
        {fps ? <Perf position="bottom-left" logsPerSecond={1} /> : null}
        <color attach={'background'} args={['#000']} />
        <Suspense fallback={null}>{children}</Suspense>

        <OrbitControls
          ref={target}
          makeDefault
          minZoom={minZoom}
          maxZoom={maxZoom}
          maxDistance={100}
          minDistance={10}
        />
      </Canvas>
    </>
  )
}
