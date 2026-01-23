'use client';

import { Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  ContactShadows,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';
import { placeOnGround } from '@/lib/3d/modelPlacement';
import GlobalLoader from '@/components/configurator/GlobalLoader';

type Vec3 = [number, number, number];

type EnvironmentConfig = {
  file: string;
  background?: boolean;
  ground?: {
    height: number;
    radius: number;
    scale: number;
  };
  environmentIntensity?: number;
  backgroundIntensity?: number;
};

type ContactShadowConfig = {
  position: Vec3;
  opacity: number;
  scale: number;
  blur: number;
  far: number;
  resolution: number;
  color: string;
};

export interface Simple3DViewerConfig {
  modelTargetSize: number;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
  cameraFov: number;
  minDistance: number;
  maxDistance: number;
  autoRotateSpeed: number;
  environment: EnvironmentConfig;
  contactShadows: ContactShadowConfig;
}

const DEFAULT_VIEWER_CONFIG: Simple3DViewerConfig = {
  modelTargetSize: 12,
  cameraPosition: [12, 6, 12],
  cameraTarget: [0, 2.5, 0],
  cameraFov: 50,
  minDistance: 5,
  maxDistance: 50,
  autoRotateSpeed: 0.5,
  environment: {
    file: '/environments/charolettenbrunn_park_4k.exr',
    background: true,
    ground: { height: 3, radius: 60, scale: 40 },
    environmentIntensity: 0.8,
    backgroundIntensity: 2.0,
  },
  contactShadows: {
    position: [0, -0.001, 0],
    opacity: 0.5,
    scale: 40,
    blur: 2,
    far: 25,
    resolution: 512,
    color: '#1f1f1f',
  },
};

function EnvironmentBackground() {
  const { scene } = useThree();

  useEffect(() => {
    const color = new THREE.Color('#bfe3ff');
    scene.background = color;
    scene.fog = new THREE.Fog(color, 80, 200);

    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene]);

  return null;
}



function ShadowSettings() {
  const { gl } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return null;
}

interface Simple3DViewerProps {
  modelPath?: string;
  productName: string;
  resetSignal?: number;
  viewerConfig?: Partial<Simple3DViewerConfig>;
}

function LoadedModel({
  modelPath,
  targetSize,
}: {
  modelPath: string;
  targetSize: number;
}) {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    if (!scene) return;

    // Calculate scale to fit in view
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = targetSize / maxDim;
    scene.scale.setScalar(scale);

    // Place on ground and center
    placeOnGround(scene, 0);

    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    scene.position.x = -scaledCenter.x;
    scene.position.z = -scaledCenter.z;

    // Enable shadows and fix materials
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;

          // Reduce environment map intensity to prevent washing out
          mat.envMapIntensity = 0.3;

          // Fix specular intensity if too high (KHR_materials_specular extension)
          if (mat.specularIntensity !== undefined && mat.specularIntensity > 1) {
            mat.specularIntensity = 0.5;
          }
          if (mat.specularColor) {
            // Clamp specular color to prevent extreme brightness
            mat.specularColor.setRGB(
              Math.min(mat.specularColor.r, 1),
              Math.min(mat.specularColor.g, 1),
              Math.min(mat.specularColor.b, 1)
            );
          }

          // Ensure metalness and roughness are reasonable
          if (mat.metalness !== undefined && mat.metalness > 0.9) {
            mat.metalness = 0.3;
          }
          if (mat.roughness !== undefined && mat.roughness < 0.1) {
            mat.roughness = 0.4;
          }

          // Fix for models that might have vertex colors but no textures
          if (child.geometry.attributes.color && !mat.vertexColors) {
            mat.vertexColors = true;
          }

          // Ensure all textures use correct color space
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.needsUpdate = true;
          }
          // Normal and metallic-roughness maps should be Linear
          if (mat.normalMap) {
            mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
          }
          if (mat.metalnessMap) {
            mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
          }
          if (mat.roughnessMap) {
            mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
          }

          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, targetSize]);

  return <primitive object={scene} />;
}

function ViewResetter({
  resetSignal,
  controlsRef,
  cameraPosition,
  cameraTarget,
}: {
  resetSignal?: number;
  controlsRef: React.RefObject<any | null>;
  cameraPosition: Vec3;
  cameraTarget: Vec3;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (resetSignal === undefined) return;
    // Force camera back to the default framing
    camera.position.set(...cameraPosition);
    camera.lookAt(...cameraTarget);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.target.set(...cameraTarget);
      controlsRef.current.update();
      // No reset() as it might conflict with manual updates
    }
  }, [camera, resetSignal, controlsRef, cameraPosition, cameraTarget]);

  return null;
}

function SimplePlayset() {
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Tower posts */}
      <mesh position={[-1, 2, -1]} castShadow>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[1, 2, -1]} castShadow>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-1, 2, 1]} castShadow>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[1, 2, 1]} castShadow>
        <boxGeometry args={[0.2, 4, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[2, 1.5, 4]} />
        <meshStandardMaterial color="#DC143C" />
      </mesh>

      {/* Slide */}
      <mesh position={[2, 1.5, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshStandardMaterial color="#4169E1" />
      </mesh>

      {/* Swing set posts */}
      <mesh position={[-3, 2, 0]} castShadow>
        <boxGeometry args={[0.15, 4, 0.15]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-5, 2, 0]} castShadow>
        <boxGeometry args={[0.15, 4, 0.15]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[-4, 3.8, 0]} castShadow>
        <boxGeometry args={[2, 0.15, 0.15]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

export default function Simple3DViewer({
  modelPath,
  productName,
  resetSignal,
  viewerConfig: viewerConfigOverride,
}: Simple3DViewerProps) {
  const controlsRef = useRef<any | null>(null);
  const viewerConfig = useMemo(() => {
    const environmentConfig = {
      ...DEFAULT_VIEWER_CONFIG.environment,
      ...(viewerConfigOverride?.environment || {}),
      ground: {
        ...DEFAULT_VIEWER_CONFIG.environment.ground,
        ...(viewerConfigOverride?.environment?.ground || {}),
      },
    };
    const contactShadowConfig = {
      ...DEFAULT_VIEWER_CONFIG.contactShadows,
      ...(viewerConfigOverride?.contactShadows || {}),
    };

    return {
      ...DEFAULT_VIEWER_CONFIG,
      ...viewerConfigOverride,
      environment: environmentConfig,
      contactShadows: contactShadowConfig,
    };
  }, [viewerConfigOverride]);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: viewerConfig.cameraPosition, fov: viewerConfig.cameraFov }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <ViewResetter
          resetSignal={resetSignal}
          controlsRef={controlsRef}
          cameraPosition={viewerConfig.cameraPosition}
          cameraTarget={viewerConfig.cameraTarget}
        />
        <ShadowSettings />

        <Suspense fallback={null}>
          <Environment
            preset="park"
            background={viewerConfig.environment.background}
            ground={viewerConfig.environment.ground}
            environmentIntensity={0.5}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping={true}
          dampingFactor={0.1}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={viewerConfig.autoRotateSpeed}
          minDistance={viewerConfig.minDistance}
          maxDistance={viewerConfig.maxDistance}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.2}
          zoomSpeed={1.2}
          rotateSpeed={0.8}
          target={viewerConfig.cameraTarget}
        />

        {/* Lighting - Balanced for color accuracy */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />

        {/* Ground Shadows */}
        <ContactShadows
          position={viewerConfig.contactShadows.position}
          opacity={viewerConfig.contactShadows.opacity}
          scale={viewerConfig.contactShadows.scale}
          blur={viewerConfig.contactShadows.blur}
          far={viewerConfig.contactShadows.far}
          resolution={viewerConfig.contactShadows.resolution}
          color={viewerConfig.contactShadows.color}
        />

        {/* 3D Model */}
        <Suspense fallback={null}>
          {modelPath ? (
            <LoadedModel
              modelPath={modelPath}
              targetSize={viewerConfig.modelTargetSize}
            />
          ) : (
            <SimplePlayset />
          )}
        </Suspense>

        <GlobalLoader />
      </Canvas>
    </div>
  );
}

