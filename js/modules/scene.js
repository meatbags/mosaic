/** Scene */

import * as THREE from 'three';

class Scene {
  constructor() {
    this.domTarget = document.querySelector('#canvas-target');

    // init threejs
    this.renderer = new THREE.WebGLRenderer({antialias: false});
    this.renderer.setClearColor(0x0000ff, 1);
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
