/** Simplified bounding box */

import * as THREE from 'three';
import { subtractVector, isVectorEqual } from '../maths';

class Box extends THREE.Box3 {
  constructor(object) {
    super();
    this.setFromBufferAttribute(object.geometry.attributes.position);
    this.position = new THREE.Vector3();
  }

  /**
   * Set position.
   *
   * @param p Object
   */
  setPosition(p) {
    if (!isVectorEqual(this.position, p)) {
      this.translate(subtractVector(p, this.position));
      this.position = p.clone();
    }
  }

  /**
   * Get 2D collision with point.xz.
   *
   * @param point Object
   * @return Boolean
   */
  containsPointXZ(point) {
    return (
      point.x >= this.min.x &&
      point.x <= this.max.x &&
      point.z >= this.min.z &&
      point.z <= this.max.z
    );
  }

  /**
   * Check if box ceiling is above y.
   *
   * @param y
   * @return Boolean
   */
  isCeilingAbove(y) {
    return y <= this.max.y;
  }

  /**
   * Get distance to centre.
   *
   * @param p Object
   * @return Number
   */
  distanceTo(p) {
    return this.position.distanceTo(p);
  }
}

export default Box;
