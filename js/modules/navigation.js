/** Navigation */

class Navigation {
  constructor() {}

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene;

    // open page
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', () => {
        this.ref.scene.goToPage(el.dataset.page);
      });
    });
  }

  removeLoadingScreen() {
    let target = document.querySelector('#loading-screen');
    if (target) {
      target.remove();
    }
  }
}

export default Navigation;
