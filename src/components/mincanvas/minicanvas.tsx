/* eslint-disable react/no-unknown-property */
import { OrbitControls, Stats } from '@react-three/drei'
import { Canvas, Vector3 } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { ReactNode, Suspense, useRef, useState } from 'react'

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
  const zoom = isMobile && !isTablet ? initZoom || 30 : initZoom

  const { perf, background } = useControls({
    perf: false,
    zoom: {
      value: 1,
      min: 1,
      max: 500
    },
    background: '#000'
  })

  const cameraProps = useCameraProps
    ? {
        orthographic: true,
        camera: {
          fov: 50,
          position: cameraPosition,
          zoom
        }
      }
    : { camera: { zoom: zoom } }

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
      >
        <color attach="background" args={[background]} />
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
