/** ColliderSystem */

import * as THREE from 'three';
import Mesh from './mesh/mesh';
import Config from './config';

class ColliderSystem {
  constructor(params) {
    this.meshes = [];
    this.cache = [];
    this.settings = Config.system;
    this.isColliderSystem = true;
  }

  /**
   * Add object to Collider system
   *
   * @param obj Object THREE.Mesh or THREE.Group
   */
  add(obj, params) {
    if (obj.type === 'Mesh') {
      this.addMesh(obj, params);
    } else if (obj.type === 'Group') {
      this.getMeshesFromGroup(obj).forEach(obj => {
        this.addMesh(obj, params);
      });
    } else {
      console.log('Invalid object:', obj);
    }
  }

  /**
   * Add floor.
   *
   * @param obj THREE.Mesh or THREE.Group
   */
  addFloor(obj) {
    this.add(obj, {isFloor: true});
  }

  /**
   * Create Collider.Mesh from THREE.Mesh
   *
   * @param obj THREE.Mesh
   * @return Object
   */
  addMesh(obj, params) {
    if (!obj.geometry || !obj.geometry.isBufferGeometry) {
      console.log('Missing geometry:', obj);
      return;
    }

    // create mesh
    let mesh = new Mesh(obj, params);

    // check valid mesh
    if (mesh.planes.length > Config.system.maxPlanesPerMesh) {
      console.log(`Mesh contains too many planes (max=${Config.system.maxPlanesPerMesh}):`, mesh);
      return;
    }

    // add to system
    this.meshes.push(mesh);
  }

  /**
   * Get meshes from group object.
   *
   * @param group Object
   * @return Array meshes
   */
  getMeshesFromGroup(obj) {
    if (obj.type === 'Mesh') {
      return [obj];
    } else if (obj.children) {
      let meshes = [];
      obj.children.forEach(child => {
        this.getMeshesFromGroup(child).forEach(mesh => {
          meshes.push(mesh);
        });
      });
      return meshes;
    } else {
      return [];
    }
  }

  /**
   * Remove object from system.
   *
   * @param obj Object
   */
  remove(obj) {
    const index = this.meshes.findIndex(m => m.id === obj.uuid);
    if (index !== -1) {
      this.meshes.splice(index, 1);
      this.clearCache();
      console.log('[ColliderSystem] Removed object: ' + obj.uuid);
    } else {
      console.log('[ColliderSystem] Remove failed. Could not find object: ' + obj.uuid);
    }
  }

  /**
   * Clear meshes.
   */
  clear() {
    this.meshes = [];
    this.clearCache();
  }

  /**
   * Get collisions with point.
   *
   * @param point Object
   * @return Array meshes
   */
  getCollisions(point) {
    const res = [];
    const meshes = this.settings.useCache ? this.cache : this.meshes;
    for (let i=0, len=meshes.length; i<len; ++i) {
      if (meshes[i].getCollision(point)) {
        res.push(meshes[i]);
      }
    }
    return res;
  }

  /**
   * Get ceiling above point if point in meshes.
   *
   * @param point Object
   * @return Object
   */
  getCeilingPlane(point) {
    let ceiling = null;
    const meshes = this.getCollisions(point);
    for (let i=0, len=meshes.length; i<len; ++i) {
      const res = meshes[i].getCeilingPlane(point);
      if (res && (!ceiling || res.y > ceiling.y)) {
        ceiling = {y: res.y, plane: res.plane};
      }
    }
    return ceiling;
  }

  /**
   * Get floor value.
   *
   * @param point Object
   * @return Number y
   */
  getFloor(point) {
    let floor = Config.settings.floor;
    this.meshes.forEach(mesh => {
      if (mesh.isFloor && mesh.insideFloorBounds(point)) {
        let y = mesh.getBox().min.y;
        let ceiling = mesh.getCeilingPlane({x: point.x, y: y, z: point.z});
        if (ceiling && ceiling.y > floor) {
          floor = ceiling.y;
        }
      }
    });
    return floor;
  }

  /**
   * Cache meshes near point for optimised lookup.
   *
   * @param point Object
   */
  cache(point) {
    this.cache = [];
    for (let i=0, len=this.meshes.length; i<len; ++i) {
      if (this.meshes[i].distanceTo(point) < this.settings.cacheRadius) {
        this.cache.push(this.meshes[i]);
      }
    }
  }

  /**
   * Empty the cache.
   */
  clearCache() {
    this.cache = [];
  }
}

export default ColliderSystem;
