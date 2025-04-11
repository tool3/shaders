/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { createRef, Suspense, useEffect, useRef } from 'react'
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
import fragmentShader from './glsl/image-particles/fragment.glsl'
import vertexShader from './glsl/image-particles/vertex.glsl'

export default function ImageParticles() {
  const shader = useRef() as any
  const planeRef = useRef() as any
  const { camera } = useThree()
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  const displacement = {
    canvas: document.createElement('canvas')
  } as any

  const canvasRef = useRef(displacement.canvas) as any

  function removeCanvas() {
    const previousCanvas = document.querySelector('#displacement')
    if (previousCanvas) {
      document.body.removeChild(previousCanvas)
    }
  }
  function initCanvas() {
    removeCanvas()

    // 2d canvas style
    displacement.canvas.width = 128
    displacement.canvas.height = 128
    displacement.canvas.ref = canvasRef
    displacement.canvas.id = 'displacement'
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
    displacement.plane = createRef()

    // raycaster
    displacement.raycaster = new Raycaster()

    // coordinates
    displacement.screenCursor = new Vector2(9999, 9999)
    displacement.canvasCursor = new Vector2(9999, 9999)
    displacement.canvasCursorPrevious = new Vector2(9999, 9999)

    displacement.texture = new CanvasTexture(displacement.canvas)
  }

  initCanvas()

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
    uPictureTexture: {
      value: useLoader(TextureLoader, '/images/image-particles/e.JPG')
    },
    uDisplacementTexture: { value: displacement.texture },
    uSize: { value: 0.8 },
    uResolution: {
      max: sizes.width * sizes.pixelRatio,
      value: new Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    }
  }

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('ParticleImage', controls)
  useControls('ParticleImage', {
    image: {
      value: '/images/image-particles/h.JPG',
      options: {
        a: '/images/image-particles/a.JPG',
        b: '/images/image-particles/b.JPG',
        c: '/images/image-particles/c.JPG',
        d: '/images/image-particles/d.JPG',
        e: '/images/image-particles/e.JPG',
        f: '/images/image-particles/f.JPG',
        g: '/images/image-particles/g.JPG',
        h: '/images/image-particles/h.JPG'
      },
      onChange: (val) => {
        shader.current.uniforms.uPictureTexture.value =
          new TextureLoader().load(val)
        shader.current.uniforms.uPictureTexture.value.needsUpdate = true
      }
    },
    overlay: {
      value: true,
      onChange: (val) => {
        if (canvasRef.current) {
          canvasRef.current.style.display = val ? 'block' : 'none'
        }
      }
    }
  })
  useControls('ParticleImage', {
    zoom: {
      value: 80,
      min: 10,
      max: 100,
      step: 0.01,
      onChange: (val) => {
        camera.zoom = val
        camera.updateProjectionMatrix()
      }
    }
  })

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
      // planeRef.current.deleteAttribute('normal')
    }

    return () => removeCanvas()
  }, [planeRef])

  return (
    <Suspense fallback={null}>
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
          depthWrite={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
      <mesh visible={false} ref={displacement.plane}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial side={DoubleSide} depthWrite={false} />
      </mesh>
    </Suspense>
  )
}
