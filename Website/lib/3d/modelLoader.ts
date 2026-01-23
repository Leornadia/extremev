import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Model cache to avoid reloading the same models
const modelCache = new Map<string, THREE.Group>();

// Loading progress callbacks
type ProgressCallback = (progress: number) => void;
type ErrorCallback = (error: Error) => void;

// Loader instances (singleton pattern)
let gltfLoader: GLTFLoader | null = null;
let dracoLoader: DRACOLoader | null = null;

/**
 * Initialize the GLTF loader with Draco compression support
 */
function initializeLoaders() {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();

    // Set up Draco loader for compressed models
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/'); // Path to Draco decoder files
    gltfLoader.setDRACOLoader(dracoLoader);
  }

  return gltfLoader;
}

/**
 * Load a 3D model from a URL with caching and progress tracking
 * @param url - URL to the GLB/GLTF file
 * @param onProgress - Optional callback for loading progress (0-100)
 * @param onError - Optional callback for errors
 * @returns Promise that resolves to a cloned THREE.Group
 */
export async function loadModel(
  url: string,
  onProgress?: ProgressCallback,
  onError?: ErrorCallback
): Promise<THREE.Group> {
  // Check cache first
  if (modelCache.has(url)) {
    const cachedModel = modelCache.get(url)!;
    // Return a clone to avoid sharing the same instance
    return cachedModel.clone();
  }

  const loader = initializeLoaders();

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      // onLoad
      (gltf) => {
        // Enable shadows for all meshes
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Store the original in cache
        modelCache.set(url, gltf.scene);

        // Return a clone
        resolve(gltf.scene.clone());
      },
      // onProgress
      (progressEvent) => {
        if (onProgress && progressEvent.lengthComputable) {
          const percentComplete =
            (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(percentComplete);
        }
      },
      // onError
      (error: unknown) => {
        const errorMessage = `Failed to load model from ${url}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        const loadError = new Error(errorMessage);

        if (onError) {
          onError(loadError);
        }

        reject(loadError);
      }
    );
  });
}

/**
 * Preload multiple models in parallel
 * @param urls - Array of model URLs to preload
 * @param onProgress - Optional callback for overall progress
 * @returns Promise that resolves when all models are loaded
 */
export async function preloadModels(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  let loadedCount = 0;
  const total = urls.length;

  const loadPromises = urls.map(async (url) => {
    try {
      await loadModel(url);
      loadedCount++;
      if (onProgress) {
        onProgress(loadedCount, total);
      }
    } catch (error) {
      console.error(`Failed to preload model: ${url}`, error);
      // Continue loading other models even if one fails
      loadedCount++;
      if (onProgress) {
        onProgress(loadedCount, total);
      }
    }
  });

  await Promise.all(loadPromises);
}

/**
 * Clear the model cache
 * @param url - Optional specific URL to clear, or clear all if not provided
 */
export function clearModelCache(url?: string): void {
  if (url) {
    const model = modelCache.get(url);
    if (model) {
      // Dispose of geometries and materials
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      modelCache.delete(url);
    }
  } else {
    // Clear all cached models
    modelCache.forEach((model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
    });
    modelCache.clear();
  }
}

/**
 * Get the number of cached models
 */
export function getCacheSize(): number {
  return modelCache.size;
}

/**
 * Check if a model is cached
 */
export function isModelCached(url: string): boolean {
  return modelCache.has(url);
}

/**
 * Dispose of the loaders (cleanup)
 */
export function disposeLoaders(): void {
  if (dracoLoader) {
    dracoLoader.dispose();
    dracoLoader = null;
  }
  gltfLoader = null;
}
