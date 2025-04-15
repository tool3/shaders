/* eslint-disable react/no-unknown-property */
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'
import { BackSide, Color, Spherical, SRGBColorSpace, Vector3 } from 'three'

import { getControlsFromUniforms } from '../util'
import atmosphereFragmentShader from './glsl/earth/atmosphere/fragment.glsl'
import atmosphereVertexShader from './glsl/earth/atmosphere/vertex.glsl'
import fragmentShader from './glsl/earth/fragment.glsl'
import vertexShader from './glsl/earth/vertex.glsl'

export default function Earth() {
  const shader = useRef() as any
  const atmosphere = useRef() as any
  const sphere = useRef() as any
  const icohedron = useRef() as any

  const day = useTexture('/textures/earth/day.jpg')
  day.colorSpace = SRGBColorSpace
  const night = useTexture('/textures/earth/night.jpg')
  night.colorSpace = SRGBColorSpace
  const specularClouds = useTexture('/textures/earth/specularClouds.jpg')

  const sunSpherical = new Spherical(1, Math.PI * 0.5, 0.5)
  const sunDirection = new Vector3(0.0, 0.0, 1.0)

  const sharedUniforms = {
    uSunDirection: { value: sunDirection },
    uAtmosphereDayColor: { value: new Color('#00aaff') },
    uAtmosphereTwilightColor: { value: new Color('#ff6600') }
  }

  const uniforms = {
    uTime: { value: 0 },
    uDayTexture: { value: day },
    uNightTexture: { value: night },
    uSpecularCloudTexture: { value: specularClouds },
    ...sharedUniforms
  }

  const updateSun = () => {
    sunDirection.setFromSpherical(sunSpherical)
    if (shader.current && atmosphere.current) {
      shader.current.uniforms.uSunDirection.value.copy(sunDirection)
      atmosphere.current.uniforms.uSunDirection.value.copy(sunDirection)
    }

    if (icohedron.current) {
      icohedron.current.position.copy(sunDirection).multiplyScalar(15)
    }
  }

  updateSun()

  const controls = getControlsFromUniforms(uniforms, shader)
  useControls('Earth', controls)
  useControls('Earth', {
    theta: {
      value: Math.PI * 0.5,
      min: -Math.PI,
      max: Math.PI,
      onChange: (val) => {
        sunSpherical.theta = val
        updateSun()
      }
    },
    phi: {
      value: 1.5,
      min: 0,
      max: Math.PI,
      onChange: (val) => {
        sunSpherical.phi = val
        updateSun()
      }
    }
  })

  useFrame(({ clock }) => {
    if (sphere.current) {
      sphere.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <>
      {/* <mesh ref={icohedron} castShadow receiveShadow>
        <icosahedronGeometry args={[0.1, 10]} />
        <meshBasicMaterial />
      </mesh> */}
      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <shaderMaterial
          attach="material"
          side={BackSide}
          transparent
          ref={atmosphere}
          uniforms={sharedUniforms}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
        />
      </mesh>
      <mesh ref={sphere} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <shaderMaterial
          attach="material"
          ref={shader}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  )
}
