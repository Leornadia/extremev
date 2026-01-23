import * as THREE from 'three';

/**
 * Place a 3D model on the ground (y=0) by calculating its bounding box
 * and adjusting its position so the bottom touches the floor
 * @param model - The THREE.Group or THREE.Object3D to place
 * @param floorY - The y-coordinate of the floor (default: 0)
 */
export function placeOnGround(
  model: THREE.Object3D,
  floorY: number = 0
): void {
  // Hide any exported ground/floor/shadow helpers
  model.traverse((obj) => {
    if (!obj.isMesh) return;
    const name = (obj.name || '').toLowerCase();
    if (
      name.includes('ground') ||
      name.includes('floor') ||
      name.includes('shadow') ||
      name.includes('helper')
    ) {
      obj.visible = false;
    }
  });

  // Update world matrices
  model.updateWorldMatrix(true, true);

  // Calculate bounding box from visible meshes only
  const box = new THREE.Box3();
  model.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.visible && obj.geometry) {
      obj.geometry.computeBoundingBox();
      if (obj.geometry.boundingBox) {
        const bb = obj.geometry.boundingBox.clone();
        bb.applyMatrix4(obj.matrixWorld);
        box.union(bb);
      }
    }
  });

  // If box is empty, nothing to do
  if (box.isEmpty()) return;

  // Calculate offset to place bottom at floorY
  const offset = floorY - box.min.y;
  model.position.y += offset;
}
