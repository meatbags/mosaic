/** Camera */

import * as THREE from 'three';
import Config from './config';
import IsMobileDevice from '../util/is_mobile_device';

class Camera {
  constructor(root) {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 1000);
    this.camera.position.set(0, 0, 0);
    this.origin = new THREE.Vector3(0, 0, 0);
    this.rotation = Math.PI * 0.25;
    this.break = false;

    if (!IsMobileDevice()) {
      window.addEventListener('mousedown', evt => { this.onMouseDown(evt); });
      window.addEventListener('mousemove', evt => { this.onMouseMove(evt); });
      window.addEventListener('mouseup', evt => { this.onMouseUp(evt); });
      window.addEventListener('mouseleave', evt => { this.onMouseUp(evt); });
    } else {
      window.addEventListener('touchstart', evt => { this.onMouseDown(evt.touches[0]); });
      window.addEventListener('touchmove', evt => { this.onMouseMove(evt.touches[0]); });
      window.addEventListener('touchend', evt => { this.onMouseUp(null); });
    }
  }

  bind(root) {
    this.ref = {};
    this.ref.renderer = root.modules.renderer;
    this.resize();
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
    let portrait = window.innerWidth < window.innerHeight;
    let dpr = Math.max(Config.Renderer.devicePixelRatioMin, window.devicePixelRatio);
    this.size = {x: window.innerWidth*dpr, y: window.innerHeight*dpr};
    let scale = (portrait ? 10.25 : 15) / this.size.x;
    this.camera.left = -this.size.x * scale;
    this.camera.right = this.size.x * scale;
    this.camera.top = this.size.y * scale;
    this.camera.bottom = -this.size.y * scale;
    this.camera.updateProjectionMatrix();
  }

  onMouseDown(evt) {
    this.break = window.innerWidth <= Config.MOBILE_BREAKPOINT;
    this.ref.event = {};
    this.ref.event.clientX = this.break ? evt.clientY : evt.clientX;
    this.ref.event.active = true;
    this.ref.event.rotation = this.rotation;
  }

  onMouseMove(evt) {
    if (this.ref.event && this.ref.event.active) {
      let x = this.break ? evt.clientY : evt.clientX;
      let dx = this.break ? this.ref.event.clientX - x : x - this.ref.event.clientX;
      this.rotation = this.ref.event.rotation + dx / (window.innerWidth / 2) * Math.PI;
    }
  }

  onMouseUp() {
    if (this.ref.event && this.ref.event.active) {
      this.ref.event.active = false;
    }
  }

  update(delta) {
    let x = Math.cos(this.rotation) * 10;
    let z = Math.sin(this.rotation) * 10;
    this.camera.position.set(x, 5, z);
    this.camera.lookAt(this.origin);
  }
}

export default Camera;
