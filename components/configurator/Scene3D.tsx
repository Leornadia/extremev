'use client';

import { useRef, useEffect } from 'react';
import { Grid, Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import PlacedComponent3D from './PlacedComponent3D';
import { optimizeShadows, enableFrustumCulling } from '@/lib/3d/optimizations';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';

export default function Scene3D() {
  const { design } = useConfiguratorStore();
  const { scene, gl } = useThree();
  const mainLightRef = useRef<THREE.DirectionalLight>(null);

  // Debounce component updates for performance during rapid changes
  // This prevents excessive re-renders when dragging components in 2D view
  const debouncedComponents = useDebouncedValue(design.components, 100);

  // Optimize shadows when scene changes (use debounced components)
  useEffect(() => {
    if (mainLightRef.current && scene) {
      optimizeShadows(mainLightRef.current, scene);
    }
  }, [scene, debouncedComponents.length]);

  // Ensure renderer is configured for shadows (acts once per Canvas mount)
  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return (
    <>
      {/* Lighting Setup */}
      {/* Lighting Setup - Neutralized to preserve original model colors */}
      {/* Ambient light - Pure white, low intensity to avoid color shifting */}
      <ambientLight intensity={0.4} color="#ffffff" />

      {/* Hemisphere light - Pure white/gray, no green tint to avoid color bleeding */}
      <hemisphereLight args={['#ffffff', '#f0f0f0', 0.5]} />

      {/* Main directional light (sun) - Pure white */}
      <directionalLight
        ref={mainLightRef}
        position={[50, 80, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
      />

      {/* Sky/Background - High background intensity for visual punch, lower environment intensity to reduce reflection influence */}
      <Environment
        files="/environments/charolettenbrunn_park_4k.exr"
        background
        ground={{ height: 5, radius: 40, scale: 20 }}
        environmentIntensity={0.8}
        backgroundIntensity={2.0}
      />

      {/* Render all placed components with frustum culling enabled */}
      {/* Use debounced components for better performance during rapid updates */}
      {debouncedComponents.map((placedComp) => (
        <PlacedComponent3D
          key={placedComp.instanceId}
          placedComponent={placedComp}
        />
      ))}
    </>
  );
}
