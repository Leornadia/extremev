import * as THREE from 'three';

/**
 * LOD (Level of Detail) configuration
 */
export interface LODConfig {
  distances: number[]; // Distance thresholds for each LOD level
  models: THREE.Object3D[]; // Models for each LOD level (high to low detail)
}

/**
 * Create an LOD object with multiple detail levels
 */
export function createLOD(config: LODConfig): THREE.LOD {
  const lod = new THREE.LOD();

  config.models.forEach((model, index) => {
    const distance = config.distances[index] || 0;
    lod.addLevel(model, distance);
  });

  return lod;
}

/**
 * Optimize a model's geometry by merging meshes where possible
 * Note: Geometry merging requires BufferGeometryUtils from three/examples
 * This is a simplified version that groups meshes by material
 */
export function optimizeGeometry(model: THREE.Group): THREE.Group {
  const materialMap = new Map<THREE.Material, THREE.Mesh[]>();

  // Collect all meshes grouped by material
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const mat = child.material as THREE.Material;
      if (!materialMap.has(mat)) {
        materialMap.set(mat, []);
      }
      materialMap.get(mat)!.push(child);
    }
  });

  // Create optimized group
  const optimizedGroup = new THREE.Group();

  materialMap.forEach((meshes) => {
    // For now, just add all meshes to the group
    // In production, you would use BufferGeometryUtils.mergeGeometries
    // from 'three/examples/jsm/utils/BufferGeometryUtils.js'
    meshes.forEach((mesh) => {
      const clonedMesh = mesh.clone();
      clonedMesh.castShadow = true;
      clonedMesh.receiveShadow = true;
      optimizedGroup.add(clonedMesh);
    });
  });

  return optimizedGroup;
}

/**
 * Create instanced mesh for repeated components
 */
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number
): THREE.InstancedMesh {
  const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
  instancedMesh.castShadow = true;
  instancedMesh.receiveShadow = true;

  return instancedMesh;
}

/**
 * Set transform for an instance in an instanced mesh
 */
export function setInstanceTransform(
  instancedMesh: THREE.InstancedMesh,
  index: number,
  position: THREE.Vector3,
  rotation: THREE.Euler,
  scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
): void {
  const matrix = new THREE.Matrix4();
  matrix.compose(
    position,
    new THREE.Quaternion().setFromEuler(rotation),
    scale
  );
  instancedMesh.setMatrixAt(index, matrix);
  instancedMesh.instanceMatrix.needsUpdate = true;
}

/**
 * Compress textures for better performance
 */
export function compressTexture(texture: THREE.Texture): THREE.Texture {
  // Set appropriate texture settings for performance
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4; // Reasonable anisotropy level

  // Use appropriate texture format
  if (texture.format === THREE.RGBAFormat) {
    // Keep RGBA for textures with transparency
  } else {
    texture.format = THREE.RGBFormat;
  }

  return texture;
}

/**
 * Simplify geometry by reducing polygon count
 */
export function simplifyGeometry(
  geometry: THREE.BufferGeometry,
  _targetRatio: number = 0.5
): THREE.BufferGeometry {
  // Note: This is a placeholder. In production, you would use a library like
  // three-mesh-bvh or SimplifyModifier for actual mesh simplification
  // For now, we'll just return the original geometry

  // Clone the geometry
  const simplified = geometry.clone();

  // In a real implementation, you would:
  // 1. Use edge collapse algorithm
  // 2. Preserve UV coordinates
  // 3. Maintain visual quality
  // 4. Update normals

  return simplified;
}

/**
 * Create multiple LOD levels from a single model
 */
export function generateLODLevels(
  model: THREE.Group,
  levels: number = 3
): THREE.Object3D[] {
  const lodModels: THREE.Object3D[] = [];

  for (let i = 0; i < levels; i++) {
    const lodModel = model.clone();
    const simplificationRatio = 1 - i * 0.3; // Reduce detail by 30% each level

    lodModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Simplify geometry for lower LOD levels
        if (i > 0) {
          child.geometry = simplifyGeometry(
            child.geometry,
            simplificationRatio
          );
        }
      }
    });

    lodModels.push(lodModel);
  }

  return lodModels;
}

/**
 * Enable frustum culling for better performance
 */
export function enableFrustumCulling(object: THREE.Object3D): void {
  object.traverse((child) => {
    child.frustumCulled = true;
  });
}

/**
 * Disable frustum culling (for objects that should always render)
 */
export function disableFrustumCulling(object: THREE.Object3D): void {
  object.traverse((child) => {
    child.frustumCulled = false;
  });
}

/**
 * Calculate bounding box for an object
 */
export function calculateBoundingBox(object: THREE.Object3D): THREE.Box3 {
  const box = new THREE.Box3();
  box.setFromObject(object);
  return box;
}

/**
 * Optimize shadow rendering
 */
export function optimizeShadows(
  light: THREE.DirectionalLight | THREE.SpotLight,
  scene: THREE.Scene
): void {
  // Calculate scene bounds
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());

  if (light instanceof THREE.DirectionalLight) {
    // Adjust shadow camera to fit scene
    const maxDim = Math.max(size.x, size.y, size.z);
    light.shadow.camera.left = -maxDim / 2;
    light.shadow.camera.right = maxDim / 2;
    light.shadow.camera.top = maxDim / 2;
    light.shadow.camera.bottom = -maxDim / 2;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = maxDim * 2;
    light.shadow.camera.updateProjectionMatrix();
  }

  // Set appropriate shadow map size
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  // Use PCF soft shadows
  light.shadow.radius = 2;
}

/**
 * Batch similar objects for better performance
 */
export function batchObjects(
  objects: THREE.Mesh[],
  maxBatchSize: number = 100
): THREE.Group[] {
  const batches: THREE.Group[] = [];
  const materialGroups = new Map<THREE.Material, THREE.Mesh[]>();

  // Group by material
  objects.forEach((obj) => {
    const material = obj.material as THREE.Material;
    if (!materialGroups.has(material)) {
      materialGroups.set(material, []);
    }
    materialGroups.get(material)!.push(obj);
  });

  // Create batches
  materialGroups.forEach((meshes) => {
    for (let i = 0; i < meshes.length; i += maxBatchSize) {
      const batch = new THREE.Group();
      const batchMeshes = meshes.slice(i, i + maxBatchSize);

      batchMeshes.forEach((mesh) => {
        batch.add(mesh.clone());
      });

      batches.push(batch);
    }
  });

  return batches;
}

/**
 * Dispose of an object and all its resources
 */
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();

      if (Array.isArray(child.material)) {
        child.material.forEach((mat) => {
          disposeMaterial(mat);
        });
      } else if (child.material) {
        disposeMaterial(child.material);
      }
    }
  });
}

/**
 * Dispose of a material and its textures
 */
function disposeMaterial(material: THREE.Material): void {
  if (material instanceof THREE.MeshStandardMaterial) {
    material.map?.dispose();
    material.normalMap?.dispose();
    material.roughnessMap?.dispose();
    material.metalnessMap?.dispose();
    material.aoMap?.dispose();
    material.emissiveMap?.dispose();
    material.lightMap?.dispose();
    material.bumpMap?.dispose();
    material.displacementMap?.dispose();
  }
  material.dispose();
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 60;

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = (this.frameCount * 1000) / deltaTime;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getFPS(): number {
    return Math.round(this.fps);
  }

  isPerformanceGood(): boolean {
    return this.fps >= 30;
  }

  getPerformanceLevel(): 'good' | 'medium' | 'poor' {
    if (this.fps >= 50) return 'good';
    if (this.fps >= 30) return 'medium';
    return 'poor';
  }
}
