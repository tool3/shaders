import { useLayoutEffect } from 'react'

export default function useMouse(
  ref: React.MutableRefObject<any>,
  useClick: boolean = false
) {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  }

  function handleMouse(e: MouseEvent) {
    const x = e.offsetX / sizes.width
    const y = 1 - e.offsetY / sizes.height
    const z = useClick ? (e.buttons === 1 ? 1 : 0) : true

    if (ref?.current?.uniforms && z) {
      ref.current.uniforms.uMouse.value.x = x
      ref.current.uniforms.uMouse.value.y = y
      ref.current.uniforms.uMouse.value.z = z
    }
  }

  useLayoutEffect(() => {
    addEventListener('pointermove', handleMouse)
  }, [])
}
