import { useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress, Html } from '@react-three/drei'
import { useLangStore } from '../../stores/langStore'
import StoreModel from './StoreModel'
import Hotspot from './Hotspot'
import CameraRig from './CameraRig'

function Loader() {
  const { progress, item } = useProgress()
  const t = useLangStore((s) => s.t)
  return (
    <Html fullscreen>
      <div className="flex h-full w-full items-center justify-center" style={{ background: 'rgba(248,241,229,0.85)', backdropFilter: 'blur(8px)' }}>
        <div className="panel-surface w-[320px] max-w-[90vw] px-6 py-7 text-center">
          <span className="pill-badge">{t('store.loading')}</span>
          <p className="mt-4 text-3xl font-semibold" style={{ color: '#1a1612' }}>{Math.round(progress)}%</p>
          <p className="mt-2 text-sm" style={{ color: '#5a4a3a' }}>{t('store.loading_msg')}</p>
          {item && <p className="mt-3 truncate text-xs" style={{ color: '#a09080' }}>{item}</p>}
        </div>
      </div>
    </Html>
  )
}

export default function StoreScene({
  hotspots = [],
  selectedProductId = null,
  onSelectProduct,
  debugCoordinates = false,
  onDebugPoint,
  modelConfig = {},
}) {
  const modelRigRef = useRef()
  const {
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    cameraCenter = [0, 0, 0],
    initialYaw = 0,
    initialPitch = -0.02,
    initialFov = 72,
  } = modelConfig

  return (
    <div className="panel-surface relative w-full overflow-hidden" style={{ height: 'clamp(400px, 74vh, 800px)' }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: initialFov, near: 0.01, far: 60 }}
        dpr={[1, 1.5]}
        flat
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#f8f1e5']} />

        <Suspense fallback={<Loader />}>
          <group position={position} rotation={rotation} scale={scale}>
            <StoreModel
              debugCoordinates={debugCoordinates}
              onDebugPoint={onDebugPoint}
              modelRigRef={modelRigRef}
            >
              {hotspots
                .filter((h) => h.active)
                .map((h) => (
                  <Hotspot
                    key={h.id}
                    hotspot={h}
                    isSelected={selectedProductId === h.productId}
                    onSelect={onSelectProduct}
                  />
                ))}
              {debugCoordinates && <axesHelper args={[1.2]} />}
            </StoreModel>
          </group>
        </Suspense>

        <CameraRig
          center={cameraCenter}
          initialYaw={initialYaw}
          initialPitch={initialPitch}
          initialFov={initialFov}
        />
      </Canvas>
    </div>
  )
}
