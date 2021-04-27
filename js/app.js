/** App */

import Scene from './modules/scene';
import Navigation from './modules/navigation';
import Audio from './modules/audio';

class App {
  constructor() {
    this.modules = {
      navigation: new Navigation(),
      scene: new Scene(),
      audio: new Audio(),
    };

    for (const key in this.modules) {
      if (typeof this.modules[key].bind === 'function') {
        this.modules[key].bind(this);
      }
    }
  }
}

window.addEventListener('load', () => {
  let app = new App();
});
