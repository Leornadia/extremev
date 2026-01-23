import { useEffect } from 'react';
import * as THREE from 'three';
import {
  MaterialType,
  MaterialColor,
  applyMaterialToModel,
  applyMaterialsByName,
} from '@/lib/3d/materials';

interface UseMaterialSystemOptions {
  model: THREE.Group | null;
  materialType?: MaterialType;
  materialColor?: MaterialColor;
  customColor?: string;
  materialMap?: Record<string, { type: MaterialType; color?: MaterialColor }>;
}

/**
 * Hook to apply material system to a 3D model
 */
export function useMaterialSystem({
  model,
  materialType,
  materialColor,
  customColor,
  materialMap,
}: UseMaterialSystemOptions): void {
  useEffect(() => {
    if (!model) return;

    // Apply materials based on configuration
    if (materialMap) {
      // Apply different materials to different parts
      applyMaterialsByName(model, materialMap);
    } else if (materialType) {
      // Apply single material to entire model
      applyMaterialToModel(model, {
        type: materialType,
        color: materialColor,
        customColor,
      });
    } else {
      // Ensure all materials are PBR-compatible
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const material = child.material;

          const ensurePBR = (mat: THREE.Material) => {
            if (!(mat instanceof THREE.MeshStandardMaterial)) {
              const matWithProps = mat as THREE.MeshBasicMaterial;
              const standardMat = new THREE.MeshStandardMaterial({
                color: matWithProps.color || 0x10b981,
                roughness: 0.5,
                metalness: 0.1,
              });

              if (matWithProps.map) {
                standardMat.map = matWithProps.map;
              }
              if ('normalMap' in mat) {
                const matWithNormal = mat as THREE.MeshPhongMaterial;
                standardMat.normalMap = matWithNormal.normalMap;
              }

              return standardMat;
            }
            return mat;
          };

          if (Array.isArray(material)) {
            child.material = material.map(ensurePBR);
          } else {
            child.material = ensurePBR(material);
          }
        }
      });
    }
  }, [model, materialType, materialColor, customColor, materialMap]);
}
