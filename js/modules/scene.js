/** Scene */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class Scene {
  constructor() {
    this.domTarget = document.querySelector('#canvas-target');

    // init threejs
    this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
    this.renderer.setClearColor(0x0000ff, 0);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x0, 5, 250);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);

    // composer
    this.composer = new EffectComposer(this.renderer);
    let radius = 1.5;
    let strength = 0.5;
    let threshold = 0.5;
    this.pass = {
      render: new RenderPass(this.scene, this.camera),
      bloom: new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), radius, strength, threshold)
    };
    this.composer.addPass(this.pass.render);
    this.composer.addPass(this.pass.bloom);

    // config
    this.config = {
      camera: {
        positionClamp: 25,
        speed: 5,
      },
    };

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
    this.camera.lookAt(new THREE.Vector3(0, 5, 10));

    // mesh
    // let mat = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: true});
    //let mat = new THREE.PointsMaterial({color: 0xffffff, size: 0.1});
    //let plane = new THREE.Points(new THREE.PlaneBufferGeometry(1000, 1000, 50, 50), mat);
    //let plane2 = new THREE.Points(new THREE.PlaneBufferGeometry(1000, 1000, 50, 50), mat);
    //plane.rotation.x = Math.PI * 0.5;
    //plane2.rotation.x = Math.PI * 0.5;
    //plane2.position.y = 10;
    //let grid = new THREE.GridHelper(100, 50, 0xffffff, 0xffffff);
    //this.scene.add(plane);
    //this.scene.add(plane2);
    //this.scene.add(grid);

    // shared materials
    this.material = {};
    this.material.neon = new THREE.MeshBasicMaterial({color: 0xffffff});

    // create meshes
    for (let i=0; i<10; i++) {
      let geo = new THREE.BoxBufferGeometry(6, 0.1, 0.1);
      let geo2 = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
      let mesh = new THREE.Mesh(geo, this.material.neon);
      let mesh2 = new THREE.Mesh(geo2, this.material.neon);
      let mesh3 = new THREE.Mesh(geo2, this.material.neon);
      mesh.position.set(0, 10, 25 * i);
      mesh2.position.set(-6, 0, 25 * i + 12.5);
      mesh3.position.set(6, 0, 25 * i + 12.5);
      this.scene.add(mesh);
      this.scene.add(mesh2);
      this.scene.add(mesh3);
    }

    // lighting
    this.lights = {};
    this.lights.a1 = new THREE.AmbientLight(0xffffff, 0.5);

    Object.keys(this.lights).forEach(key => {
      this.scene.add(this.lights[key]);
    });

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
    this.composer.setSize(w, h);
  }

  _update(delta) {
    this.camera.position.z = (this.camera.position.z + this.config.camera.speed * delta) % this.config.camera.positionClamp;
  }

  _render(delta) {
    //this.renderer.render(this.scene, this.camera);
    this.composer.render();
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
