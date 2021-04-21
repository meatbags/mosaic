/** App */

import Scene from './modules/scene';
import Navigation from './modules/navigation';

class App {
  constructor() {
    this.modules = {
      navigation: new Navigation(),
      scene: new Scene(),
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
