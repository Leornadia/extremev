'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PlacedComponent, ModularComponent } from '@/lib/types/configurator';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { useModelLoader } from '@/lib/hooks/useModelLoader';
import ModelLoadingIndicator from './ModelLoadingIndicator';
import { enableFrustumCulling } from '@/lib/3d/optimizations';
import { placeOnGround } from '@/lib/3d/modelPlacement';

interface PlacedComponent3DProps {
  placedComponent: PlacedComponent;
}

export default function PlacedComponent3D({
  placedComponent,
}: PlacedComponent3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { ui, design } = useConfiguratorStore();

  // Get the latest component data from store for real-time updates
  const latestComponent =
    design.components.find(
      (c) => c.instanceId === placedComponent.instanceId
    ) || placedComponent;

  // Get component data
  const componentData = latestComponent.customizations?.options
    ?._componentData as ModularComponent | undefined;

  // Check if component is selected or highlighted
  const isSelected = ui.selectedComponentIds.includes(
    latestComponent.instanceId
  );
  const isHighlighted = ui.highlightedComponentIds.includes(
    latestComponent.instanceId
  );

  // Load 3D model (always call hooks, even if componentData is null)
  const { model, loading, progress, error } = useModelLoader(
    componentData?.model3D || null
  );

  // Always drop the loaded mesh back onto y=0 after any transforms
  useEffect(() => {
    if (model) {
      placeOnGround(model, 0);
    }
  }, [model]);

  // Enable frustum culling for performance
  useEffect(() => {
    if (model) {
      enableFrustumCulling(model);
    }
  }, [model]);

  // Apply selection/highlight effects and ensure materials are PBR
  useEffect(() => {
    if (!model || !groupRef.current) return;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material;

        // Ensure material is MeshStandardMaterial for PBR rendering
        const processMaterial = (mat: THREE.Material) => {
          if (!(mat instanceof THREE.MeshStandardMaterial)) {
            // Convert to MeshStandardMaterial if it's not already
            const standardMat = new THREE.MeshStandardMaterial();
            const matWithColor = mat as THREE.MeshBasicMaterial;
            if (matWithColor.color) {
              standardMat.color = matWithColor.color;
            }
            if (matWithColor.map) {
              standardMat.map = matWithColor.map;
            }
            return standardMat;
          }
          return mat;
        };

        if (Array.isArray(material)) {
          material.forEach((mat, index) => {
            const standardMat = processMaterial(
              mat
            ) as THREE.MeshStandardMaterial;

            if (isHighlighted) {
              standardMat.emissive = new THREE.Color(0xdc2626); // Red highlight
              standardMat.emissiveIntensity = 0.3;
              standardMat.opacity = 0.8;
              standardMat.transparent = true;
            } else if (isSelected) {
              standardMat.emissive = new THREE.Color(0x059669); // Green selection
              standardMat.emissiveIntensity = 0.2;
              standardMat.opacity = 1;
              standardMat.transparent = false;
            } else {
              standardMat.emissive = new THREE.Color(0x000000);
              standardMat.emissiveIntensity = 0;
              standardMat.opacity = 1;
              standardMat.transparent = false;
            }

            // Ensure PBR properties are set
            if (standardMat.roughness === undefined)
              standardMat.roughness = 0.5;
            if (standardMat.metalness === undefined)
              standardMat.metalness = 0.1;

            (child.material as THREE.Material[])[index] = standardMat;
          });
        } else if (material) {
          const standardMat = processMaterial(
            material
          ) as THREE.MeshStandardMaterial;

          if (isHighlighted) {
            standardMat.emissive = new THREE.Color(0xdc2626);
            standardMat.emissiveIntensity = 0.3;
            standardMat.opacity = 0.8;
            standardMat.transparent = true;
          } else if (isSelected) {
            standardMat.emissive = new THREE.Color(0x059669);
            standardMat.emissiveIntensity = 0.2;
            standardMat.opacity = 1;
            standardMat.transparent = false;
          } else {
            standardMat.emissive = new THREE.Color(0x000000);
            standardMat.emissiveIntensity = 0;
            standardMat.opacity = 1;
            standardMat.transparent = false;
          }

          // Ensure PBR properties are set
          if (standardMat.roughness === undefined) standardMat.roughness = 0.5;
          if (standardMat.metalness === undefined) standardMat.metalness = 0.1;

          child.material = standardMat;
        }
      }
    });
  }, [model, isSelected, isHighlighted]);

  // Early return after all hooks are called
  if (!componentData) return null;

  // Convert dimensions to 3D scale
  const width = componentData.dimensions.width;
  const depth = componentData.dimensions.depth;
  const height = componentData.dimensions.height;

  // Position (convert from 2D grid to 3D coordinates)
  // Use latestComponent for real-time position updates
  // Models are already placed on ground (y=0) by placeOnGround function
  const position: [number, number, number] = [
    latestComponent.position.x,
    0, // Ground level - placeOnGround handles proper placement
    latestComponent.position.y,
  ];

  // Rotation (convert degrees to radians)
  // Use latestComponent for real-time rotation updates
  const rotation: [number, number, number] = [
    (latestComponent.rotation.x * Math.PI) / 180,
    (latestComponent.rotation.y * Math.PI) / 180,
    (latestComponent.rotation.z * Math.PI) / 180,
  ];

  // Fallback color for placeholder box
  let fallbackColor = '#10b981'; // Default green
  if (isHighlighted) {
    fallbackColor = '#dc2626'; // Red for validation errors
  } else if (isSelected) {
    fallbackColor = '#059669'; // Darker green for selected
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {loading && <ModelLoadingIndicator progress={progress} error={error} />}

      {error && !model && (
        <>
          {/* Fallback to simple box on error */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={fallbackColor}
              roughness={0.5}
              metalness={0.1}
              transparent={isHighlighted}
              opacity={isHighlighted ? 0.8 : 1}
            />
          </mesh>

          {/* Wireframe outline for selected components */}
          {isSelected && (
            <lineSegments>
              <edgesGeometry
                attach="geometry"
                args={[new THREE.BoxGeometry(width, height, depth)]}
              />
              <lineBasicMaterial
                attach="material"
                color="#047857"
                linewidth={2}
              />
            </lineSegments>
          )}
        </>
      )}

      {model && !loading && (
        <>
          {/* Render the actual 3D model */}
          <primitive object={model} />

          {/* Wireframe outline for selected components */}
          {isSelected && (
            <lineSegments>
              <edgesGeometry
                attach="geometry"
                args={[new THREE.BoxGeometry(width, height, depth)]}
              />
              <lineBasicMaterial
                attach="material"
                color="#047857"
                linewidth={2}
              />
            </lineSegments>
          )}
        </>
      )}

      {!model && !loading && !error && (
        <>
          {/* Fallback to simple box if no model URL provided */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={fallbackColor}
              roughness={0.5}
              metalness={0.1}
              transparent={isHighlighted}
              opacity={isHighlighted ? 0.8 : 1}
            />
          </mesh>

          {/* Wireframe outline for selected components */}
          {isSelected && (
            <lineSegments>
              <edgesGeometry
                attach="geometry"
                args={[new THREE.BoxGeometry(width, height, depth)]}
              />
              <lineBasicMaterial
                attach="material"
                color="#047857"
                linewidth={2}
              />
            </lineSegments>
          )}
        </>
      )}
    </group>
  );
}
