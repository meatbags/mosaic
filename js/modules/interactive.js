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
        let mat = new THREE.MeshStandardMaterial({color: this.state.colour.default, metalness: 0.35, roughness: 0.65});
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

    // create totem pole
    if (params.totem) {
      let group = new THREE.Group();
      params.totem.split('').forEach((chr, i) => {
        let geo = new THREE.TextGeometry(chr, {font: this.root.font, size: params.textSize || 0.75, height: 0.25, bevelEnabled: false});
        let mat = new THREE.MeshStandardMaterial({color: this.state.colour.default, metalness: 0.35, roughness: 0.65});
        let mesh = new THREE.Mesh(geo, mat);
        let box = new THREE.Box3().setFromObject(mesh);
        let size = new THREE.Vector3();
        box.getSize(size);
        mesh.geometry.translate(-size.x/2, (params.totem.length - i - 1) * 0.75, -size.z/2);
        group.add(mesh);
      });
      group.visible = false;
      group.rotation.y = (Math.random() * 2 - 1) * Math.PI/4 + Math.PI/4;
      this.meshes.push(group);
      this.root.scene.add(group);
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
        this.el.addEventListener('click', () => { this._openContent(); });
        let close = CreateElement({
          class: 'overlay__hotspot-close',
          innerHTML: 'x',
          addEventListener: {
            click: evt => {
              evt.preventDefault();
              evt.stopPropagation();
              this._closeContent();
            }
          }
        });
        content.appendChild(close);
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
      this._closeContent();
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

  _openContent() {
    this.el.classList.add('transition');
    setTimeout(() => {
      this.el.classList.add('active');
    }, 25);
  }

  _closeContent() {
    this.el.classList.remove('active');
    setTimeout(() => {
      this.el.classList.remove('transition');
    }, 350);
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

    // animate
    if (this.state.animation) {
      this.state.animation.update(delta);
    }
  }

  unfold() {
    if (this.state.fold.locked) { return; }
    this.state.fold.locked = true;

    let from = this.meshes[0].userData.folded;
    let fromPosition = this.meshes[0].position.clone();
    let to = this.meshes[0].userData.unfolded;
    let x = (Math.random() * 2 - 1) * 5;
    let y = 5;
    let z = (Math.random() * 2 - 1) * 5;
    let toPosition = new THREE.Vector3(x, y, z);
    let geo = this.meshes[0].geometry.attributes.position.array;
    this.state.fold.fromPosition = fromPosition;
    this.state.fold.toPosition = toPosition;
    this.state.fold.fromRotation = this.meshes[0].rotation.y;
    this.state.fold.toRotation = this.root.ref.camera.camera.rotation.y;
    this.state.fold.isFolded = false;

    this.state.foldAnimation = new Animation({
      duration: 0.35,
      callback: t => {
        for (let i=0; i<geo.length; i++) {
          geo[i] = from[i] + (to[i] - from[i]) * t;
        }
        this.meshes[0].position.set(
          this.state.fold.fromPosition.x + (this.state.fold.toPosition.x - this.state.fold.fromPosition.x) * t,
          this.state.fold.fromPosition.y + (this.state.fold.toPosition.y - this.state.fold.fromPosition.y) * t,
          this.state.fold.fromPosition.z + (this.state.fold.toPosition.z - this.state.fold.fromPosition.z) * t
        );
        this.meshes[0].rotation.y = this.state.fold.fromRotation + (this.state.fold.toRotation - this.state.fold.fromRotation) * t;
        this.meshes[0].geometry.attributes.position.needsUpdate = true;
        if (t == 1) {
          this.state.foldAnimation = null;
          this.state.fold.locked = false;
        }
      },
    });
  }

  fold() {
    if (this.state.fold.locked) { return; }
    this.state.fold.locked = true;

    let to = this.meshes[0].userData.folded;
    let toPosition = this.state.fold.fromPosition;
    let from = this.meshes[0].userData.unfolded;
    let fromPosition = this.state.fold.toPosition;
    let geo = this.meshes[0].geometry.attributes.position.array;
    this.state.fold.toPosition = toPosition;
    this.state.fold.fromPosition = fromPosition;

    this.state.foldAnimation = new Animation({
      duration: 0.35,
      callback: t => {
        for (let i=0; i<geo.length; i++) {
          geo[i] = from[i] + (to[i] - from[i]) * t;
        }
        this.meshes[0].position.set(
          this.state.fold.fromPosition.x + (this.state.fold.toPosition.x - this.state.fold.fromPosition.x) * t,
          this.state.fold.fromPosition.y + (this.state.fold.toPosition.y - this.state.fold.fromPosition.y) * t,
          this.state.fold.fromPosition.z + (this.state.fold.toPosition.z - this.state.fold.fromPosition.z) * t
        );
        this.meshes[0].geometry.attributes.position.needsUpdate = true;
        if (t == 1) {
          this.state.foldAnimation = null;
          this.state.fold.locked = false;
          this.state.fold.isFolded = true;
        }
      },
    });
  }
}

export default Interactive;
