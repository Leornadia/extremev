import * as THREE from 'three';

/**
 * Material types for playground components
 */
export enum MaterialType {
  WOOD_CEDAR = 'wood_cedar',
  WOOD_PINE = 'wood_pine',
  WOOD_REDWOOD = 'wood_redwood',
  METAL_STEEL = 'metal_steel',
  METAL_ALUMINUM = 'metal_aluminum',
  PLASTIC_HDPE = 'plastic_hdpe',
  PLASTIC_COLORED = 'plastic_colored',
  ROPE = 'rope',
  RUBBER = 'rubber',
}

/**
 * Color variations for materials
 */
export enum MaterialColor {
  NATURAL = 'natural',
  STAINED_BROWN = 'stained_brown',
  STAINED_GRAY = 'stained_gray',
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  PURPLE = 'purple',
  BLACK = 'black',
  WHITE = 'white',
}

/**
 * Material configuration interface
 */
interface MaterialConfig {
  type: MaterialType;
  color?: MaterialColor;
  customColor?: string;
}

/**
 * Create a PBR material for wood
 */
function createWoodMaterial(
  color: MaterialColor = MaterialColor.NATURAL
): THREE.MeshStandardMaterial {
  const baseColors: Record<string, number> = {
    [MaterialColor.NATURAL]: 0xd4a574, // Natural cedar/pine color
    [MaterialColor.STAINED_BROWN]: 0x8b4513, // Saddle brown
    [MaterialColor.STAINED_GRAY]: 0x808080, // Gray stain
  };

  const colorValue = baseColors[color] || baseColors[MaterialColor.NATURAL];

  return new THREE.MeshStandardMaterial({
    color: colorValue,
    roughness: 0.8, // Wood is quite rough
    metalness: 0.0, // Wood is not metallic
    envMapIntensity: 0.3,
    // In production, you would load actual wood textures here:
    // map: textureLoader.load('/textures/wood_diffuse.jpg'),
    // normalMap: textureLoader.load('/textures/wood_normal.jpg'),
    // roughnessMap: textureLoader.load('/textures/wood_roughness.jpg'),
  });
}

/**
 * Create a PBR material for metal
 */
function createMetalMaterial(
  type: MaterialType,
  color: MaterialColor = MaterialColor.NATURAL
): THREE.MeshStandardMaterial {
  const isSteel = type === MaterialType.METAL_STEEL;

  const baseColors: Record<string, number> = {
    [MaterialColor.NATURAL]: isSteel ? 0x8c8c8c : 0xd3d3d3, // Steel gray or aluminum silver
    [MaterialColor.BLACK]: 0x2c2c2c,
    [MaterialColor.WHITE]: 0xf0f0f0,
  };

  const colorValue = baseColors[color] || baseColors[MaterialColor.NATURAL];

  return new THREE.MeshStandardMaterial({
    color: colorValue,
    roughness: isSteel ? 0.4 : 0.3, // Steel is slightly rougher than aluminum
    metalness: 0.9, // Highly metallic
    envMapIntensity: 1.0,
  });
}

/**
 * Create a PBR material for plastic
 */
function createPlasticMaterial(
  color: MaterialColor = MaterialColor.BLUE
): THREE.MeshStandardMaterial {
  const baseColors: Record<string, number> = {
    [MaterialColor.RED]: 0xe74c3c,
    [MaterialColor.BLUE]: 0x3498db,
    [MaterialColor.GREEN]: 0x2ecc71,
    [MaterialColor.YELLOW]: 0xf1c40f,
    [MaterialColor.ORANGE]: 0xe67e22,
    [MaterialColor.PURPLE]: 0x9b59b6,
    [MaterialColor.BLACK]: 0x34495e,
    [MaterialColor.WHITE]: 0xecf0f1,
  };

  const colorValue = baseColors[color] || baseColors[MaterialColor.BLUE];

  return new THREE.MeshStandardMaterial({
    color: colorValue,
    roughness: 0.3, // Plastic is fairly smooth
    metalness: 0.0, // Plastic is not metallic
    envMapIntensity: 0.5,
  });
}

/**
 * Create a PBR material for rope
 */
function createRopeMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: 0xd4a574, // Tan/beige rope color
    roughness: 0.9, // Very rough surface
    metalness: 0.0,
    envMapIntensity: 0.2,
  });
}

/**
 * Create a PBR material for rubber
 */
function createRubberMaterial(
  color: MaterialColor = MaterialColor.BLACK
): THREE.MeshStandardMaterial {
  const baseColors: Record<string, number> = {
    [MaterialColor.BLACK]: 0x2c2c2c,
    [MaterialColor.RED]: 0xc0392b,
    [MaterialColor.BLUE]: 0x2980b9,
  };

  const colorValue = baseColors[color] || baseColors[MaterialColor.BLACK];

  return new THREE.MeshStandardMaterial({
    color: colorValue,
    roughness: 0.7, // Rubber has moderate roughness
    metalness: 0.0,
    envMapIntensity: 0.3,
  });
}

/**
 * Create a material based on configuration
 */
export function createMaterial(
  config: MaterialConfig
): THREE.MeshStandardMaterial {
  const { type, color, customColor } = config;

  let material: THREE.MeshStandardMaterial;

  switch (type) {
    case MaterialType.WOOD_CEDAR:
    case MaterialType.WOOD_PINE:
    case MaterialType.WOOD_REDWOOD:
      material = createWoodMaterial(color);
      break;

    case MaterialType.METAL_STEEL:
    case MaterialType.METAL_ALUMINUM:
      material = createMetalMaterial(type, color);
      break;

    case MaterialType.PLASTIC_HDPE:
    case MaterialType.PLASTIC_COLORED:
      material = createPlasticMaterial(color);
      break;

    case MaterialType.ROPE:
      material = createRopeMaterial();
      break;

    case MaterialType.RUBBER:
      material = createRubberMaterial(color);
      break;

    default:
      // Default fallback material
      material = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.5,
        metalness: 0.1,
      });
  }

  // Apply custom color if provided
  if (customColor) {
    material.color = new THREE.Color(customColor);
  }

  return material;
}

/**
 * Apply material to a 3D model
 */
export function applyMaterialToModel(
  model: THREE.Group,
  config: MaterialConfig
): void {
  const material = createMaterial(config);

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Clone the material for each mesh to avoid sharing
      child.material = material.clone();
    }
  });
}

/**
 * Apply different materials to different parts of a model
 * based on mesh names or material names
 */
export function applyMaterialsByName(
  model: THREE.Group,
  materialMap: Record<string, MaterialConfig>
): void {
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Check mesh name
      const meshName = child.name.toLowerCase();

      // Find matching material config
      for (const [key, config] of Object.entries(materialMap)) {
        if (meshName.includes(key.toLowerCase())) {
          child.material = createMaterial(config);
          break;
        }
      }

      // If no match found, check material name
      if (child.material && 'name' in child.material) {
        const materialName = (
          child.material as THREE.Material
        ).name.toLowerCase();

        for (const [key, config] of Object.entries(materialMap)) {
          if (materialName.includes(key.toLowerCase())) {
            child.material = createMaterial(config);
            break;
          }
        }
      }
    }
  });
}

/**
 * Update material color dynamically
 */
export function updateMaterialColor(
  material: THREE.MeshStandardMaterial,
  color: string | number
): void {
  material.color = new THREE.Color(color);
}

/**
 * Create a material variant with adjusted properties
 */
export function createMaterialVariant(
  baseMaterial: THREE.MeshStandardMaterial,
  adjustments: {
    color?: string | number;
    roughness?: number;
    metalness?: number;
    opacity?: number;
    emissive?: string | number;
    emissiveIntensity?: number;
  }
): THREE.MeshStandardMaterial {
  const variant = baseMaterial.clone();

  if (adjustments.color !== undefined) {
    variant.color = new THREE.Color(adjustments.color);
  }
  if (adjustments.roughness !== undefined) {
    variant.roughness = adjustments.roughness;
  }
  if (adjustments.metalness !== undefined) {
    variant.metalness = adjustments.metalness;
  }
  if (adjustments.opacity !== undefined) {
    variant.opacity = adjustments.opacity;
    variant.transparent = adjustments.opacity < 1;
  }
  if (adjustments.emissive !== undefined) {
    variant.emissive = new THREE.Color(adjustments.emissive);
  }
  if (adjustments.emissiveIntensity !== undefined) {
    variant.emissiveIntensity = adjustments.emissiveIntensity;
  }

  return variant;
}

/**
 * Dispose of a material and its textures
 */
export function disposeMaterial(material: THREE.Material): void {
  if (material instanceof THREE.MeshStandardMaterial) {
    material.map?.dispose();
    material.normalMap?.dispose();
    material.roughnessMap?.dispose();
    material.metalnessMap?.dispose();
    material.aoMap?.dispose();
    material.emissiveMap?.dispose();
  }
  material.dispose();
}
