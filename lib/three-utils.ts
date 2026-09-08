import * as THREE from 'three';

/**
 * Free the GPU memory held by everything under an object.
 *
 * Photogrammetry models carry large textures. Dropping the JS references is
 * not enough — geometries, materials and textures each hold GPU allocations
 * that only dispose() releases, so an undisposed model stays resident for the
 * lifetime of the tab.
 */
export function disposeScene(root: THREE.Object3D): void {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry?.dispose();

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      material.dispose();
    }
  });
}
