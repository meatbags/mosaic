/** ColliderPoint */

import * as THREE from 'three';
import * as Maths from './maths';
import Config from './config';

class ColliderObject {
  constructor(settings) {
    this.settings = Config.settings;
    this.position = new THREE.Vector3();
    this.motion = new THREE.Vector3();
    this.system = null;
    this.set(settings || {});
  }

  /**
   * Set parameters.
   *
   * @param params Object
   */
  set(params) {
    Object.keys(params).forEach(key => {
      if (this.settings[key] !== undefined && typeof(this.settings[key]) === typeof(params[key])) {
        this.settings[key] = params[key];
      }
    });

    // targets
    this.position = params.position || this.position;
    this.motion = params.motion || this.motion;
    this.system = params.system || this.system;
  }

  /**
   * Collide this object with Collider.System.
   *
   * @param delta Number time delta in seconds
   */
  collide(delta) {
    if (!this.system) {
      return;
    }

    // get next position & apply physics
    const p = Maths.addVector(this.position, Maths.scaleVector(this.motion, delta));
    this.falling = (this.motion.y < 0);
    this.motion.y = Math.max(
      this.motion.y - this.settings.gravity * delta,
      -this.settings.maxVelocity
    );

    // collide
    let collisions = this.system.getCollisions(p);

    // slopes/ walls
    if (collisions.length > 0) {
      if (this.stepUpSlopes(p, collisions)) {
        collisions = this.system.getCollisions(p);
      }
      if (this.extrudeFrom(p, collisions)) {
        this.stepUpSlopes(p, this.system.getCollisions(p));
      }
    } else if (this.motion.y < 0 && !this.falling) {
      this.stepDownSlope(p, this.system.getCeilingPlane(new THREE.Vector3(p.x, p.y - this.settings.snapDown, p.z)));
    }

    // floor
    let floor = this.system.getFloor(p);
    if (p.y < floor) {
      this.motion.y = 0;
      p.y = floor;
    }

    this.position.copy(p);
  }

  /**
   * Get number of collisions against meshes.
   *
   * @param point Object point
   * @param meshes Array mesh list
   * @return Number valid collisions
   */
  getValidCollisions(point, meshes) {
    // get n collisions with meshes that can't be climbed
    var hits = 0;

    for (var i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(point);
      if (ceiling != null && (ceiling.plane.normal.y < this.settings.minSlope || (ceiling.y - this.position.y) > this.settings.snapUp)) {
        hits++;
      }
    }

    return hits;
  }

  /**
   * Extrude point until outside meshes.
   *
   * @param point Object
   * @param meshes Array list of meshes
   * @return Boolean true if extruded, false if unchanged
   */
  extrudeFrom(point, meshes) {
    // extrude position from obstructions
    var isExtruded = false;
    var mesh = false;

    for (let i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(point);
      if (ceiling != null && (ceiling.plane.normal.y < this.settings.minSlope || (ceiling.y - this.position.y) > this.settings.snapUp)){
        mesh = meshes[i];
        break;
      }
    }

    // extrude from mesh
    if (mesh) {
      const intersectPlane = mesh.getIntersectPlane2D(this.position, point);

      if (intersectPlane != null) {
        const intersect = intersectPlane.intersect;
        const plane = intersectPlane.plane;

        if (plane.normal.y < -0.5) {
          // project in 3D, if other mesh collisions, try 2D
          // NOTE: needs refinement
          const proj = mesh.getProjected(point, plane);
          const hits = this.getValidCollisions(proj, this.system.getCollisions(proj));

          // stop motion if cornered
          if (hits > 1) {
            point.x = this.position.x;
            point.z = this.position.z;
          } else {
            point.x = proj.x;
            point.y = proj.y;
            point.z = proj.z;
            // reduce jump motion
            this.motion.y = (this.motion.y > 0) ? this.motion.y * 0.75 : this.motion.y;
            //this.motion.y = Math.min(-0.01, this.motion.y);
            isExtruded = true;
          }
        } else {
          point.x = intersect.x;
          point.z = intersect.z;
          const hits = this.getValidCollisions(point, this.system.getCollisions(point));

          // stop motion if cornered
          if (hits > 1) {
            point.x = this.position.x;
            point.z = this.position.z;
          } else {
            isExtruded = true;
          }
        }
      } else {
        point.x = this.position.x;
        point.z = this.position.z;
      }
    }

    return isExtruded;
  }

  /**
   * Climb up sloped mesh surfaces.
   *
   * @param point Object
   * @param meshes Array
   */
  stepUpSlopes(point, meshes) {
    let steppedUp = false;

    for (let i=0, len=meshes.length; i<len; ++i) {
      const ceiling = meshes[i].getCeilingPlane(point);
      if (ceiling != null && ceiling.plane.normal.y >= this.settings.minSlope && (ceiling.y - this.position.y) <= this.settings.snapUp) {
        if (ceiling.y >= point.y) {
          steppedUp = true;
          point.y = ceiling.y;
          this.motion.y = 0;
        }
      }
    }

    return steppedUp;
  }

  /**
   * Climb down sloped mesh surfaces.
   *
   * @param point Object
   * @param meshes Array
   */
  stepDownSlope(point, ceilingPlane) {
    let steppedDown = false;

    if (ceilingPlane != null && ceilingPlane.plane.normal.y >= this.settings.minSlope) {
      point.y = ceilingPlane.y;
      this.motion.y = 0;
      steppedDown = true;
    }

    return steppedDown;
  }
}

export default ColliderObject;
