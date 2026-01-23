import { useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { loadModel, isModelCached } from '@/lib/3d/modelLoader';

interface UseModelLoaderResult {
  model: THREE.Group | null;
  loading: boolean;
  progress: number;
  error: Error | null;
  reload: () => void;
}

/**
 * React hook for loading 3D models with loading states
 * @param url - URL to the GLB/GLTF file
 * @param enabled - Whether to load the model (default: true)
 * @returns Object with model, loading state, progress, error, and reload function
 */
export function useModelLoader(
  url: string | null,
  enabled: boolean = true
): UseModelLoaderResult {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  const reload = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!url || !enabled) {
      setModel(null);
      setLoading(false);
      setProgress(0);
      setError(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      // If model is cached, load instantly
      if (isModelCached(url)) {
        setLoading(true);
        setProgress(100);
        try {
          const loadedModel = await loadModel(url);
          if (!cancelled) {
            setModel(loadedModel);
            setLoading(false);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) {
            setError(
              err instanceof Error ? err : new Error('Failed to load model')
            );
            setLoading(false);
          }
        }
        return;
      }

      // Load with progress tracking
      setLoading(true);
      setProgress(0);
      setError(null);

      try {
        const loadedModel = await loadModel(
          url,
          (progressValue) => {
            if (!cancelled) {
              setProgress(progressValue);
            }
          },
          (err) => {
            if (!cancelled) {
              setError(err);
            }
          }
        );

        if (!cancelled) {
          setModel(loadedModel);
          setLoading(false);
          setProgress(100);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error('Failed to load model')
          );
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [url, enabled, reloadTrigger]);

  return { model, loading, progress, error, reload };
}
