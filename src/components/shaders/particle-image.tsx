/* eslint-disable react/no-unknown-property */
import { useFrame, useLoader } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  DoubleSide,
  Raycaster,
  TextureLoader,
  Vector2
} from 'three'

import { getControlsFromUniforms } from '../util'
import fragmentShader from './glsl/particles_image/fragment.glsl'
import vertexShader from './glsl/particles_image/vertex.glsl'

export default function ParticleImage() {
  const shader = useRef() as any
  const planeRef = useRef() as any

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const displacement = {
    canvas: document.createElement('canvas')
  } as any

  // 2d canvas style
  displacement.canvas.width = 128
  displacement.canvas.height = 128
  displacement.canvas.style.position = 'fixed'
  displacement.canvas.style.width = '256px'
  displacement.canvas.style.height = '256px'
  displacement.canvas.style.position = 'fixed'
  displacement.canvas.style.top = 0
  displacement.canvas.style.left = 0
  displacement.canvas.style.zIndex = 10

  document.body.appendChild(displacement.canvas)

  // context
  displacement.context = displacement.canvas.getContext('2d')
  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
  )

  // draw image
  displacement.image = new Image()
  displacement.image.src = '/images/glow.png'
  displacement.image.onload = () => {
    displacement.context.drawImage(displacement.image, 20, 20, 32, 32)
  }

  // raycast plane
  displacement.plane = useRef()

  // raycaster
  displacement.raycaster = new Raycaster()

  // coordinates
  displacement.screenCursor = new Vector2(9999, 9999)
  displacement.canvasCursor = new Vector2(9999, 9999)
  displacement.canvasCursorPrevious = new Vector2(9999, 9999)

  displacement.texture = new CanvasTexture(displacement.canvas)

  useEffect(() => {
    addEventListener('pointermove', (event) => {
      displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1
      displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1
    })
  }, [])

  useFrame(({ clock, camera }) => {
    const elapsedTime = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.uTime.value = elapsedTime

    displacement.raycaster.setFromCamera(displacement.screenCursor, camera)
    const intersections = displacement.raycaster.intersectObject(
      displacement.plane.current
    )

    if (intersections.length) {
      const { uv } = intersections[0]
      displacement.canvasCursor.x = uv.x * displacement.canvas.width
      displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height
    }

    displacement.context.globalCompositeOperation = 'source-over'
    displacement.context.globalAlpha = 0.02
    displacement.context.fillRect(
      0,
      0,
      displacement.canvas.width,
      displacement.canvas.height
    )

    // speed alpha
    const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
      displacement.canvasCursor
    )
    displacement.canvasCursorPrevious.copy(displacement.canvasCursor)
    const alpha = Math.min(cursorDistance * 0.1, 1)

    // draw glo w
    const glowSize = displacement.canvas.width * 0.25
    displacement.context.globalCompositeOperation = 'lighten'
    displacement.context.globalAlpha = alpha
    displacement.context.drawImage(
      displacement.image,
      displacement.canvasCursor.x - glowSize * 0.5,
      displacement.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    )

    // displacement texture
    displacement.texture.needsUpdate = true
  })

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color('#ffffff') },
    uPictureTexture: { value: useLoader(TextureLoader, '/images/oni_2.png') },
    uDisplacementTexture: { value: displacement.texture },
    uResolution: {
      value: new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('ParticleImage', controls)

  useEffect(() => {
    if (planeRef.current) {
      const intensityCount = Array.from(
        { length: planeRef.current.attributes.position.count },
        () => Math.random()
      )
      const anglesCount = intensityCount.map((i) => i * Math.PI * 2)
      const intensityAttribute = new BufferAttribute(
        new Float32Array(intensityCount),
        1
      )
      const angleAttribute = new BufferAttribute(
        new Float32Array(anglesCount),
        1
      )
      planeRef.current?.setAttribute('aIntensity', intensityAttribute)
      planeRef.current?.setAttribute('aAngle', angleAttribute)
      planeRef.current.setIndex(null)
      planeRef.current.deleteAttribute('normal')
    }
  }, [planeRef])

  return (
    <>
      <points>
        <planeGeometry ref={planeRef} args={[10, 10, 256, 256]}>
          <bufferGeometry attach="geometry">
            <bufferAttribute attach={'attributes-aIntensity'} />
          </bufferGeometry>
        </planeGeometry>
        <shaderMaterial
          blending={AdditiveBlending}
          attach="material"
          ref={shader}
          side={DoubleSide}
          uniforms={uniforms}
          sizeAttenuation
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
      <mesh visible={false} ref={displacement.plane}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={DoubleSide} />
      </mesh>
    </>
  )
}
