'use client';

import { Html, useProgress } from '@react-three/drei';

export default function GlobalLoader() {
    const { active, progress } = useProgress();

    if (!active) return null;

    return (
        <Html center>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-xl min-w-[200px]">
                <div className="flex flex-col items-center gap-4">
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
                            Loading 3D Scene...
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                            {Math.round(progress)}%
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
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
