'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import Scene3D from './Scene3D';
import * as THREE from 'three';
import { PerformanceMonitor } from '@/lib/3d/optimizations';
import { useScreenshot } from '@/lib/hooks/useScreenshot';
import GlobalLoader from './GlobalLoader';

// Camera preset positions
const CAMERA_PRESETS = {
  default: { position: [15, 15, 15], target: [0, 0, 0] },
  top: { position: [0, 30, 0], target: [0, 0, 0] },
  front: { position: [0, 10, 25], target: [0, 5, 0] },
  side: { position: [25, 10, 0], target: [0, 5, 0] },
  corner: { position: [20, 15, 20], target: [0, 5, 0] },
};

// Camera controller component
function CameraController({
  targetPosition,
  targetLookAt,
}: {
  targetPosition: [number, number, number] | null;
  targetLookAt: [number, number, number] | null;
}) {
  const { camera } = useThree();

  // Smooth camera transition
  if (targetPosition && targetLookAt) {
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(...targetPosition);
    const duration = 1000; // 1 second
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      camera.position.lerpVectors(startPos, endPos, eased);
      camera.lookAt(...targetLookAt);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  return null;
}

// Performance monitor component
function PerformanceMonitorComponent({
  onFPSUpdate,
}: {
  onFPSUpdate: (fps: number, level: string) => void;
}) {
  const monitor = useRef(new PerformanceMonitor());

  useFrame(() => {
    monitor.current.update();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const fps = monitor.current.getFPS();
      const level = monitor.current.getPerformanceLevel();
      onFPSUpdate(fps, level);
    }, 1000);

    return () => clearInterval(interval);
  }, [onFPSUpdate]);

  return null;
}

// Screenshot handler component (inside Canvas context)
function ScreenshotHandler({
  onScreenshotReady,
}: {
  onScreenshotReady: (handler: () => Promise<void>) => void;
}) {
  const { downloadScreenshot } = useScreenshot();

  useEffect(() => {
    const handler = async () => {
      await downloadScreenshot('playset-design.jpg', {
        width: 1920,
        height: 1080,
        quality: 0.95,
        format: 'image/jpeg',
      });
    };
    onScreenshotReady(handler);
  }, [downloadScreenshot, onScreenshotReady]);

  return null;
}

export default function Canvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { design } = useConfiguratorStore();
  const [cameraTarget, setCameraTarget] = useState<{
    position: [number, number, number] | null;
    lookAt: [number, number, number] | null;
  }>({ position: null, lookAt: null });
  const [fps, setFPS] = useState<number>(60);
  const [performanceLevel, setPerformanceLevel] = useState<string>('good');
  const [showPerformance, setShowPerformance] = useState<boolean>(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const screenshotHandlerRef = useRef<(() => Promise<void>) | null>(null);

  const handlePresetClick = (preset: keyof typeof CAMERA_PRESETS) => {
    const { position, target } = CAMERA_PRESETS[preset];
    setCameraTarget({
      position: position as [number, number, number],
      lookAt: target as [number, number, number],
    });
  };

  const handleFPSUpdate = (newFPS: number, level: string) => {
    setFPS(newFPS);
    setPerformanceLevel(level);
  };

  const handleScreenshotClick = async () => {
    if (screenshotHandlerRef.current && !isCapturingScreenshot) {
      setIsCapturingScreenshot(true);
      try {
        await screenshotHandlerRef.current();
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      } finally {
        setIsCapturingScreenshot(false);
      }
    }
  };

  const handleUserInteraction = () => {
    if (isAutoRotating) {
      setIsAutoRotating(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <Canvas
        camera={{
          position: [15, 15, 15],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        shadows="soft"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
        performance={{ min: 0.5 }} // Adaptive performance
        onPointerDown={handleUserInteraction}
        onWheel={handleUserInteraction}
      >
        {/* Scene Content */}
        <Scene3D />

        {/* Camera Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={0}
          target={[0, 0, 0]}
          enablePan
          panSpeed={0.5}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}
          makeDefault
        />

        {/* Camera Controller for smooth transitions */}
        <CameraController
          targetPosition={cameraTarget.position}
          targetLookAt={cameraTarget.lookAt}
        />

        {/* Performance Monitor */}
        <PerformanceMonitorComponent onFPSUpdate={handleFPSUpdate} />

        {/* Screenshot Handler */}
        <ScreenshotHandler
          onScreenshotReady={(handler) => {
            screenshotHandlerRef.current = handler;
          }}
        />

        <GlobalLoader />
      </Canvas>

      {/* Screenshot Button */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleScreenshotClick}
          disabled={isCapturingScreenshot || design.components.length === 0}
          className={`
            px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg
            text-sm font-medium text-neutral-700 hover:bg-white
            transition-all flex items-center gap-2
            ${isCapturingScreenshot || design.components.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Download screenshot of 3D view"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {isCapturingScreenshot ? 'Capturing...' : 'Screenshot'}
        </button>
      </div>

      {/* Camera Preset Buttons */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
        <div className="text-xs font-medium text-neutral-600 mb-2 px-2">
          Camera Views
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handlePresetClick('default')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors text-left"
          >
            Default
          </button>
          <button
            onClick={() => handlePresetClick('top')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors text-left"
          >
            Top View
          </button>
          <button
            onClick={() => handlePresetClick('front')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors text-left"
          >
            Front View
          </button>
          <button
            onClick={() => handlePresetClick('side')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors text-left"
          >
            Side View
          </button>
          <button
            onClick={() => handlePresetClick('corner')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700 rounded transition-colors text-left"
          >
            Corner View
          </button>
        </div>
      </div>

      {/* 3D View Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-1">
            <div className="text-neutral-600">
              <span className="font-medium">Controls:</span>
            </div>
            <button
              onClick={() => setShowPerformance(!showPerformance)}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              {showPerformance ? 'Hide' : 'Show'} FPS
            </button>
          </div>
          <div className="text-xs text-neutral-500">
            • Left click + drag to rotate
          </div>
          <div className="text-xs text-neutral-500">
            • Right click + drag to pan
          </div>
          <div className="text-xs text-neutral-500">• Scroll to zoom</div>
          {showPerformance && (
            <div className="mt-2 pt-2 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-600">FPS:</span>
                <span
                  className={`text-xs font-medium ${performanceLevel === 'good'
                    ? 'text-green-600'
                    : performanceLevel === 'medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                    }`}
                >
                  {fps}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-neutral-600">Performance:</span>
                <span
                  className={`text-xs font-medium capitalize ${performanceLevel === 'good'
                    ? 'text-green-600'
                    : performanceLevel === 'medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                    }`}
                >
                  {performanceLevel}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {design.components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white/40 backdrop-blur-sm rounded-lg p-8 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 text-neutral-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-neutral-800 font-medium mb-2">
              No components in 3D view
            </p>
            <p className="text-sm text-neutral-700">
              Switch to 2D view to add components
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
