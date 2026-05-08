import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const _target = new THREE.Vector3()
const _dir = new THREE.Vector3()

export default function CameraRig({
  center = [0, 0, 0],
  initialYaw = 0,
  initialPitch = -0.02,
  initialFov = 72,
}) {
  const { camera, gl } = useThree()
  const yaw = useRef(initialYaw)
  const pitch = useRef(initialPitch)
  const dragging = useRef(false)
  const prev = useRef({ x: 0, y: 0 })

  useEffect(() => {
    camera.position.set(...center)
    camera.fov = initialFov
    camera.updateProjectionMatrix()

    const el = gl.domElement
    el.style.cursor = 'grab'

    const onDown = (e) => {
      dragging.current = true
      prev.current = { x: e.clientX, y: e.clientY }
      el.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!dragging.current) return
      const dx = e.clientX - prev.current.x
      const dy = e.clientY - prev.current.y
      prev.current = { x: e.clientX, y: e.clientY }
      yaw.current -= dx * 0.0048
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.0036, -1.15, 1.15)
    }
    const onUp = () => { dragging.current = false; el.style.cursor = 'grab' }
    const onWheel = (e) => {
      e.preventDefault()
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.02, 42, 90)
      camera.updateProjectionMatrix()
    }

    // Touch support
    let lastTouch = null
    const onTouchStart = (e) => { lastTouch = e.touches[0]; dragging.current = true }
    const onTouchMove = (e) => {
      if (!dragging.current || !lastTouch) return
      const t = e.touches[0]
      const dx = t.clientX - lastTouch.clientX
      const dy = t.clientY - lastTouch.clientY
      lastTouch = t
      yaw.current -= dx * 0.004
      pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.003, -1.15, 1.15)
    }
    const onTouchEnd = () => { dragging.current = false; lastTouch = null }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart)
    el.addEventListener('touchmove', onTouchMove)
    el.addEventListener('touchend', onTouchEnd)

    return () => {
      el.style.cursor = 'default'
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [camera, center, gl, initialFov])

  useFrame(() => {
    camera.position.set(...center)
    _dir.set(
      Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      Math.cos(yaw.current) * Math.cos(pitch.current)
    )
    _target.set(...center).add(_dir)
    camera.lookAt(_target)
  })

  return null
}
