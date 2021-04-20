/** Scene */

import * as THREE from 'three';

class Scene {
  constructor() {
    this.domTarget = document.querySelector('#canvas-target');

    // init threejs
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor(0x0000ff, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);

    // add to doc
    this.domTarget.appendChild(this.renderer.domElement);
  }

  bind(root) {
    this.ref = {};

    // events
    window.addEventListener('resize', () => { this._resize(); });
    this._resize();

    // set up scene
    this.camera.position.set(0, 5, 0);
    //this.camera.lookAt(new THREE.Vector3());
    //let mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshStandardMaterial({}));
    let light = new THREE.PointLight(0xffffff, 1, 100, 2);
    let grid = new THREE.GridHelper(100, 50, 0xffffff, 0xffffff);
    light.position.set(7, 10, 5);
    this.scene.add(grid);

    // start scene loop
    this.time = {};
    this.time.now = Date.now();
    this.time.deltaMax = 0.1;
    this.time.paused = false;
    this._loop();
  }

  pause() {
    this.time.paused = true;
  }

  resume() {
    if (this.time.paused) {
      this.time.now = Date.now();
      this.time.paused = false;
    }
  }

  _resize() {
    let dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth * dpr;
    let h = window.innerHeight * dpr;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _update(delta) {
    let speed = -1;
    this.camera.position.x = (this.camera.position.x + speed * delta) % 2;
  }

  _render(delta) {
    this.renderer.render(this.scene, this.camera);
  }

  _loop() {
    // queue next frame
    requestAnimationFrame(() => { this._loop(); });

    // update scene
    if (!this.time.paused) {
      let now = Date.now();
      let delta = Math.min((now - this.time.now) / 1000, this.time.deltaMax);
      this.time.now = now;
      this._update(delta);
      this._render(delta);
    }
  }
}

export default Scene;
