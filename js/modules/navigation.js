/** Navigation */

class Navigation {
  constructor() {}

  bind(root) {
    this.removeLoadingScreen();
  }

  removeLoadingScreen() {
    let target = document.querySelector('#loading-screen');
    if (target) {
      target.remove();
    }
  }
}

export default Navigation;
