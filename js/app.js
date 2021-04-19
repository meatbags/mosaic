/** App */

import Scene from './modules/scene';

class App {
  constructor() {
    this.modules = {
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
