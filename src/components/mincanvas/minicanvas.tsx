/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stats } from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import gsap from 'gsap'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useLayoutEffect, useRef, useState } from 'react'

import { useDeviceDetect } from '~/hooks/use-device-detect'

import Debug from '../debug/debug'

export default function CanvasWithModel({
  className,
  orbitEnabled = true,
  panel = false,
  useCameraProps = true,
  minZoom = 10,
  maxZoom = 300,
  minDistance = 10,
  maxDistance = 100,
  initZoom = 50,
  cameraPosition = [0, 0, 100],
  children
}: {
  className?: string
  orbitEnabled?: boolean
  useCameraProps?: boolean
  panel?: boolean
  minZoom?: number
  maxZoom?: number
  minDistance?: number
  maxDistance?: number
  initZoom?: number
  cameraPosition?: Vector3
  children: ReactNode
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const target = useRef([0, 0, 0]) as any
  const [active, setActive] = useState(panel)
  const { isMobile, isTablet } = useDeviceDetect()
  const zoom = isMobile && !isTablet ? 50 : initZoom

  const { perf } = useControls({
    perf: false
  })

  useLayoutEffect(() => {
    if (target.current) {
      gsap.to(target.current.position, {
        z: 0,
        delay: 1
      })
    }
  }, [target])

  const cameraProps = useCameraProps
    ? {
        orthographic: true,
        camera: {
          fov: 50,
          position: cameraPosition,
          zoom
        }
      }
    : {}

  return (
    <>
      <Leva collapsed hidden={!active} />
      {perf ? <Stats /> : null}
      <Debug set={setActive} />
      <Canvas
        className={className}
        ref={canvasRef}
        dpr={[1, 2]}
        shadows
        {...cameraProps}
        style={{
          height: '100svh',
          width: '100vw'
        }}
        // gl={{ antialias: true, alpha: true }}
      >
        {perf ? <Perf position="bottom-left" logsPerSecond={1} /> : null}
        <Suspense fallback={null}>{children}</Suspense>

        <OrbitControls
          ref={target}
          makeDefault
          enabled={orbitEnabled}
          minZoom={minZoom}
          maxZoom={maxZoom}
          maxDistance={maxDistance}
          minDistance={minDistance}
        />
      </Canvas>
    </>
  )
}
