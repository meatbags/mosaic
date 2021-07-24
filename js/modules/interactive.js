/** Interactive 3D/UI Object */

import * as THREE from 'three';
import CreateElement from '../util/create_element';
import Animation from './animation';
import ScreenSpace from '../ui/screen_space';
import Config from './config';

class Interactive {
  constructor(params) {
    this.active = false;
    this.root = params.root;
    this.page = params.page;
    this.index = params.index === undefined ? -1 : params.index;
    this.state = {
      colour: {
        default: 0xffffff,
        hover: 0xff0000,
      }
    };

    // create text meshes
    this.meshes = [];
    if (params.text) {
      params.text.split('').forEach(chr => {
        let geo = new THREE.TextGeometry(chr, {font: this.root.font, size: params.textSize || 1, height: 0.125, bevelEnabled: false});
        let mat = new THREE.MeshStandardMaterial({color: this.state.colour.default});
        let mesh = new THREE.Mesh(geo, mat);
        let box = new THREE.Box3().setFromObject(mesh);
        let size = new THREE.Vector3();
        box.getSize(size);
        mesh.geometry.translate(-size.x/2, 0, -size.z/2);
        mesh.rotation.y = (Math.random() * 2 - 1) * Math.PI/4 + Math.PI/4;
        mesh.visible = false;
        this.meshes.push(mesh);
        this.root.scene.add(mesh);
      });
    }

    // add custom mesh
    if (params.mesh) {
      this.meshes.push(params.mesh);
      this.root.scene.add(params.mesh);
    }

    // create DOM element
    if (params.el) {
      this.el = CreateElement(params.el);
      if (this.onClick) {
        this.el.addEventListener('click', () => { this.onClick(); });
      }
      this.el.addEventListener('mouseenter', () => { this._onMouseEnter(); });
      this.el.addEventListener('mouseleave', () => { this._onMouseLeave(); });
      document.querySelector('#overlay').appendChild(this.el);
      let content = this.el.querySelector('.content');
      if (content) {
        this.el.addEventListener('click', () => {
          if (!this.el.classList.contains('active')) {
            this.openContent();
          }
        });
        let close = CreateElement({
          class: 'overlay__hotspot-close',
          innerHTML: 'x',
          addEventListener: {
            click: evt => {
              evt.preventDefault();
              evt.stopPropagation();
              this.closeContent();
            }
          }
        });
        let controls = CreateElement({
          class: 'overlay__controls',
          childNodes: [{
            class: 'overlay__controls-previous',
            innerHTML: '<',
            addEventListener: {
              click: evt => {
                evt.preventDefault();
                evt.stopPropagation();
                this.root.onProjectItemPreviousClicked(this);
              },
            }
          }, {
            class: 'overlay__controls-index',
            innerHTML: `${this.index}`,
          }, {
            class: 'overlay__controls-next',
            innerHTML: '>',
            addEventListener: {
              click: evt => {
                evt.preventDefault();
                evt.stopPropagation();
                this.root.onProjectItemNextClicked(this);
              },
            }
          }],
        });
        content.appendChild(close);
        content.appendChild(controls);
      }
    } else {
      this.el = null;
    }

    // create screen-space tracker
    let index = Math.floor(this.meshes.length / 2);
    this.screenSpace = new ScreenSpace({
      camera: this.root.ref.camera.camera,
      position: this.meshes[index].position,
    });

    // initial state hidden
    this.hide(0);
  }

  hide(cascade=Config.Scene.cascade) {
    this.active = false;
    this.hover = false;
    this.meshes.forEach((mesh, i) => {
      setTimeout(() => {
        mesh.visible = false;
      }, i * cascade);
    });
    if (this.el) {
      this.closeContent();
      this.el.classList.add('hidden');
    }
  }

  show(cascade=Config.Scene.cascade) {
    this.active = true;
    this.meshes.forEach((mesh, i) => {
      setTimeout(() => {
        mesh.visible = true;
      }, i * cascade);
    });
    if (this.el) {
      let lazy = this.el.querySelector('[data-src]');
      if (lazy) {
        lazy.src = lazy.dataset.src;
        lazy.removeAttribute('data-src');
      }
      this.el.classList.remove('hidden');
    }
  }

  setHeight() {
    if (this.state.fold && this.state.fold.isFolded === false) {
      return;
    }
    this.meshes.forEach(mesh => {
      mesh.position.y = this.root.getHeight(mesh.position.x, mesh.position.z);
    });
  }

  _onMouseEnter() {
    this.hover = true;
    this.meshes.forEach(mesh => {
      if (mesh.type == 'Group') {
        mesh.children.forEach(child => {
          child.material.color.setHex(this.state.colour.hover);
        });
      } else {
        mesh.material.color.setHex(this.state.colour.hover);
      }
    });
  }

  _onMouseLeave() {
    this.hover = false;
    this.meshes.forEach(mesh => {
      if (mesh.type == 'Group') {
        mesh.children.forEach(child => {
          child.material.color.setHex(this.state.colour.default);
        });
      } else {
        mesh.material.color.setHex(this.state.colour.default);
      }
    });
  }

  openContent() {
    this.el.classList.add('active');
  }

  closeContent() {
    this.el.classList.remove('active');
  }

  update(delta) {
    if (!this.active) { return; }

    // update screen space position
    if (this.el) {
      this.screenSpace.update();
      let s = this.screenSpace.getScreenPosition();
      this.el.style.left = `${s.x * window.innerWidth}px`;
      this.el.style.top = `${s.y * window.innerHeight - 10}px`;
    }

    // hover
    if (this.hover && this.meshes.length == 1) {
      // this.meshes[0].rotation.y += delta * Math.PI;
    }

    // animate
    if (this.state.animation) {
      this.state.animation.update(delta);
    }
  }
}

export default Interactive;
