import { useMemo, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/store_scan.glb'

function rebuildMaterial(mat) {
  if (Array.isArray(mat)) return mat.map(rebuildMaterial)
  const m = new THREE.MeshBasicMaterial({
    map: mat?.map ?? null,
    color: mat?.color ?? '#ffffff',
    transparent: mat?.transparent ?? false,
    opacity: mat?.opacity ?? 1,
    side: THREE.DoubleSide,
    alphaTest: mat?.alphaTest ?? 0,
    fog: false,
    toneMapped: false,
  })
  if (m.map) { m.map.colorSpace = THREE.SRGBColorSpace; m.map.needsUpdate = true }
  return m
}

export default function StoreModel({ onDebugPoint, debugCoordinates, modelRigRef, onModelReady, children }) {
  const { scene: raw } = useGLTF(MODEL_URL)

  const { scene, modelOffset } = useMemo(() => {
    const cloned = raw.clone(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false
        node.receiveShadow = false
        node.material = rebuildMaterial(node.material)
      }
    })
    return { scene: cloned, modelOffset: [-center.x, -center.y, -center.z] }
  }, [raw])

  useEffect(() => { onModelReady?.({ scene, modelOffset }) }, [scene, modelOffset, onModelReady])

  return (
    <group ref={modelRigRef} position={modelOffset}>
      <primitive
        object={scene}
        onClick={(e) => {
          if (!debugCoordinates) return
          e.stopPropagation()
          const pt = modelRigRef?.current
            ? modelRigRef.current.worldToLocal(e.point.clone())
            : e.point.clone()
          const coords = pt.toArray().map((v) => Number(v.toFixed(3)))
          console.log('[Souk 3D] Coordonnées hotspot :', coords)
          onDebugPoint?.(coords)
        }}
        dispose={null}
      />
      {children}
    </group>
  )
}

useGLTF.preload(MODEL_URL)
