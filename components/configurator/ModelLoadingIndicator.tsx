'use client';

import { Html } from '@react-three/drei';

interface ModelLoadingIndicatorProps {
  progress: number;
  error?: Error | null;
}

export default function ModelLoadingIndicator({
  progress,
  error,
}: ModelLoadingIndicatorProps) {
  if (error) {
    return (
      <Html center>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Failed to load model</span>
          </div>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
      </Html>
    );
  }

  return (
    <Html center>
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          {/* Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary-100 rounded-full"></div>
            <div
              className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"
              style={{
                animationDuration: '1s',
              }}
            ></div>
          </div>

          {/* Progress text */}
          <div className="text-center">
            <div className="text-sm font-medium text-neutral-700">
              Loading model...
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-48 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </Html>
  );
}
