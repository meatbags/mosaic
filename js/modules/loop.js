/** the main loop */

import * as THREE from 'three';

class Loop {
  constructor() {
    this.active = false;
    this.deltaMax = 0.1;
  }

  bind(root) {
    this.ref = {};
    this.ref.update = [];
    this.ref.render = [];

    // modules for update & render
    Object.keys(root.modules).forEach(key => {
      if (typeof root.modules[key].update === 'function') {
        this.ref.update.push(root.modules[key]);
      }
      if (typeof root.modules[key].render === 'function') {
        this.ref.render.push(root.modules[key]);
      }
    });

    // doc targets
    this.el = {};
    this.el.wrapper = document.querySelector('.wrapper');
    this.el.canvasWrapper = document.querySelector('.canvas-wrapper');
    this.now = performance.now();

    // go!
    this._loop();
  }

  start() {
    if (!this.active) {
      this.el.canvasWrapper.classList.remove('paused');
      this.now = performance.now();
      this.active = true;
      console.log('[Loop] resuming');
    }
  }

  stop() {
    if (this.active) {
      this.active = false;
      this.el.canvasWrapper.classList.add('paused');
      console.log('[Loop] pausing');
    }
  }

  _loop() {
    requestAnimationFrame(() => { this._loop(); });

    if (this.active) {
      const now = performance.now();
      const delta = Math.min(this.deltaMax, (now - this.now) / 1000);
      this.now = now;
      this.ref.update.forEach(obj => { obj.update(delta); });
      this.ref.render.forEach(obj => { obj.render(delta); });
    }
  }
}

export default Loop;
