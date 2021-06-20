/** Camera */

import * as THREE from 'three';
import Config from './config';

class Camera {
  constructor(root) {
    this.offset = 0.1;
    this.camera = new THREE.PerspectiveCamera(Config.Camera.fov, 1, 0.1, 200000);
    this.camera.up = new THREE.Vector3(0, 1, 0);
    this.camera.rotation.order = 'ZYX';//'YXZ';
    this.camera.fov = Config.Camera.fov;
    this.camera.updateProjectionMatrix();
    this.origin = new THREE.Vector3();
    // set position
    this.camera.position.set(0, 0, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, -1));
  }

  bind(root) {
    this.ref = {};
    this.ref.renderer = root.modules.renderer;
  }

  getPosition() {
    return this.camera.position;
  }

  getCamera() {
    return this.camera;
  }

  addAudioListener() {
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);
  }

  resize() {
    let dpr = Math.min(window.devicePixelRatio, 2);
    this.size = {x: window.innerWidth*dpr, y: window.innerHeight*dpr};
    this.camera.aspect = this.size.x / this.size.y;
    this.camera.updateProjectionMatrix();
  }
}

export default Camera;
