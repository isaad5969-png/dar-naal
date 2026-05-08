import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

function HotspotLabel({ label }) {
  return (
    <Html
      transform
      sprite
      center
      position={[0, 0.19, 0]}
      distanceFactor={8}
      zIndexRange={[20, 0]}
      scale={0.12}
    >
      <div className="pointer-events-none max-w-[160px] truncate whitespace-nowrap rounded-full border border-white/20 bg-black/70 px-2.5 py-1.5 text-xs font-medium leading-none text-white shadow-lg backdrop-blur-md">
        {label}
      </div>
    </Html>
  )
}

function hashOffset(id) {
  return id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 0.08
}

export default function Hotspot({ hotspot, isSelected, onSelect }) {
  const sphereRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)
  const offset = useMemo(() => hashOffset(hotspot.id), [hotspot.id])

  useEffect(() => () => { document.body.style.cursor = 'default' }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset
    const scale = 1 + (Math.sin(t * 2.2) + 1) * 0.03
    if (sphereRef.current) sphereRef.current.scale.setScalar(scale)
    if (ringRef.current) {
      const r = (t / 2.4) % 1
      ringRef.current.scale.setScalar(0.85 + r * 0.75)
      ringRef.current.material.opacity = Math.max(0, 0.72 - r * 0.72)
    }
  })

  return (
    <group
      position={hotspot.position}
      onClick={(e) => { e.stopPropagation(); onSelect(hotspot.productId) }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; setHovered(true) }}
      onPointerOut={() => { document.body.style.cursor = 'default'; setHovered(false) }}
    >
      {/* Ripple ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <ringGeometry args={[0.05, 0.082, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#fffdf7' : '#f8e7b8'}
          transparent opacity={0.52} side={2} depthWrite={false} toneMapped={false}
        />
      </mesh>

      {/* Core sphere */}
      <mesh ref={sphereRef} renderOrder={4}>
        <sphereGeometry args={[0.03, 20, 20]} />
        <meshBasicMaterial color={isSelected ? '#fffdf7' : '#fff7e6'} toneMapped={false} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.075, 10]} />
        <meshBasicMaterial color="#fff9ec" toneMapped={false} />
      </mesh>

      {(hovered || isSelected) && <HotspotLabel label={hotspot.label} />}
    </group>
  )
}
