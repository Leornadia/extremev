import { useCallback, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  quality?: number; // 0-1 for JPEG quality
  format?: 'image/png' | 'image/jpeg';
}

export interface ScreenshotResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Hook for capturing screenshots from the 3D scene
 * Useful for generating thumbnails for saved designs
 */
export function useScreenshot() {
  const { gl, scene, camera } = useThree();
  const isCapturing = useRef(false);

  /**
   * Capture a screenshot of the current 3D scene
   * @param options - Screenshot configuration options
   * @returns Promise with screenshot data
   */
  const captureScreenshot = useCallback(
    async (
      options: ScreenshotOptions = {}
    ): Promise<ScreenshotResult | null> => {
      if (isCapturing.current) {
        console.warn('Screenshot capture already in progress');
        return null;
      }

      isCapturing.current = true;

      try {
        const {
          width = 800,
          height = 600,
          quality = 0.92,
          format = 'image/jpeg',
        } = options;

        // Store original size
        const originalSize = gl.getSize(new THREE.Vector2());
        const originalPixelRatio = gl.getPixelRatio();

        // Set desired size for screenshot
        gl.setSize(width, height);
        gl.setPixelRatio(1); // Use 1:1 pixel ratio for consistent output

        // Render the scene
        gl.render(scene, camera);

        // Get the canvas and convert to data URL
        const canvas = gl.domElement;
        const dataUrl = canvas.toDataURL(format, quality);

        // Convert data URL to blob
        const blob = await (await fetch(dataUrl)).blob();

        // Restore original size
        gl.setSize(originalSize.x, originalSize.y);
        gl.setPixelRatio(originalPixelRatio);

        // Re-render at original size
        gl.render(scene, camera);

        isCapturing.current = false;

        return {
          dataUrl,
          blob,
          width,
          height,
        };
      } catch (error) {
        console.error('Error capturing screenshot:', error);
        isCapturing.current = false;
        return null;
      }
    },
    [gl, scene, camera]
  );

  /**
   * Capture a thumbnail (smaller screenshot)
   * @returns Promise with thumbnail data
   */
  const captureThumbnail =
    useCallback(async (): Promise<ScreenshotResult | null> => {
      return captureScreenshot({
        width: 400,
        height: 300,
        quality: 0.85,
        format: 'image/jpeg',
      });
    }, [captureScreenshot]);

  /**
   * Download a screenshot as a file
   * @param filename - Name of the file to download
   * @param options - Screenshot configuration options
   */
  const downloadScreenshot = useCallback(
    async (
      filename: string = 'design-screenshot.jpg',
      options?: ScreenshotOptions
    ) => {
      const result = await captureScreenshot(options);
      if (!result) return;

      // Create download link
      const link = document.createElement('a');
      link.href = result.dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [captureScreenshot]
  );

  return {
    captureScreenshot,
    captureThumbnail,
    downloadScreenshot,
    isCapturing: isCapturing.current,
  };
}
