/** App */

import Scene from './modules/scene';
import Navigation from './modules/navigation';
import Renderer from './modules/renderer';
import Camera from './modules/camera';
import Controls from './modules/controls';
import Audio from './modules/audio';
import Loop from './modules/loop';
//import World from './modules/world';

class App {
  constructor() {
    this.modules = {
      navigation: new Navigation(),
      renderer: new Renderer(),
      //controls: new Controls(),
      camera: new Camera(),
      scene: new Scene(),
      loop: new Loop(),
      //world: new World(),
    };

    for (const key in this.modules) {
      if (typeof this.modules[key].bind === 'function') {
        this.modules[key].bind(this);
      }
    }

    window.addEventListener('resize', () => { this._resize(); });
    this._resize();
    this.modules.loop.start();
  }

  _resize() {
    for (const key in this.modules) {
      if (typeof this.modules[key].resize === 'function') {
        this.modules[key].resize();
      }
    }
  }
}

window.addEventListener('load', () => {
  let app = new App();
});
