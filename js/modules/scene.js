/** Scene */

import * as THREE from 'three';
import Config from './config';
import Clamp from '../util/clamp';
import Loader from '../loader/loader';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.loader = new Loader('assets/');
  }

  bind(root) {
    this.ref = {};
    this.ref.camera = root.modules.camera;
    this.ref.controls = root.modules.controls;
    //this.ref.objectHandler = root.modules.objectHandler;
    //this.ref.materialHandler = root.modules.materialHandler;

    // lighting
    const model = Config.Renderer.lowQuality ? 1 : 2;
    this.light = {};
    this.light.a1 = new THREE.AmbientLight(0xffffff, 0.4);
    this.light.d1 = new THREE.DirectionalLight(0xffffff, 0.45);
    this.light.d2 = new THREE.DirectionalLight(0xffffff, 0.35);

    // set light positions
    this.light.d1.position.set(-1, -0.35, 0.9);
    this.light.d2.position.set(1, -0.25, -0.8);

    for (const key in this.light) {
      this.scene.add(this.light[key]);
    }
  }

  getScene() {
    return this.scene;
  }
}

export default Scene;
