/** World to screen space */

import * as THREE from 'three';

class ScreenSpace {
  constructor(params) {
    this.camera = params.camera;
    this.position = params.position.clone();
    this.screen = new THREE.Vector2(0, 0);
    this.temp = new THREE.Vector3();
    this.worldVector = new THREE.Vector3();
    this.onScreen = false;
    this.threshold = {min: -0.25, max: 1.25};
  }

  isOnScreen() {
    return this.onScreen;
  }

  getScreenPosition() {
    return {
      x: this.screen.x,
      y: this.screen.y
    };
  }

  update() {
    this.temp.copy(this.camera.position);
    this.temp.sub(this.position);
    this.temp.normalize();
    this.camera.getWorldDirection(this.worldVector);
    this.onScreen = this.temp.dot(this.worldVector) <= 0;

    // get screen xy in range [0, 1]
    if (this.onScreen) {
      this.temp.copy(this.position);
      this.temp.project(this.camera);
      this.screen.x = (this.temp.x + 1) * 0.5;
      this.screen.y = (1 - this.temp.y) * 0.5;
      this.onScreen =
        this.screen.x >= this.threshold.min &&
        this.screen.x <= this.threshold.max &&
        this.screen.y >= this.threshold.min &&
        this.screen.y <= this.threshold.max;
    }
  }
}

export default ScreenSpace;
