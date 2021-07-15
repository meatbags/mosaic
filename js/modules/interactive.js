/** Interactive 3D/UI Object */

import * as THREE from 'three';
import CreateElement from '../util/create_element';
import ScreenSpace from '../ui/screen_space';

class Interactive {
  constructor(params) {
    this.active = false;
    this.root = params.root;
    this.page = params.page;
    this.colour = {
      default: 0xffffff,
      hover: 0xff0000,
    };

    // create meshes
    this.meshes = [];
    if (params.text) {
      params.text.split('').forEach(chr => {
        let geo = new THREE.TextGeometry(chr, {font: this.root.font, size: params.textSize || 1, height: 0.125, bevelEnabled: false});
        let mat = new THREE.MeshStandardMaterial({color: this.colour.default, metalness: 0.35, roughness: 0.65});
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
    } else {
      params.el = null;
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

  hide(cascade=80) {
    this.active = false;
    this.hover = false;
    this.meshes.forEach((mesh, i) => {
      setTimeout(() => {
        mesh.visible = false;
      }, i * cascade);
    });
    if (this.el) {
      this.el.classList.add('hidden');
    }
  }

  show(cascade=80) {
    this.active = true;
    this.meshes.forEach((mesh, i) => {
      setTimeout(() => {
        mesh.visible = true;
      }, i * cascade);
    });
    if (this.el) {
      this.el.classList.remove('hidden');
    }
  }

  _onMouseEnter() {
    this.hover = true;
    this.meshes.forEach(mesh => {
      mesh.material.color.setHex(this.colour.hover);
    });
  }

  _onMouseLeave() {
    this.hover = false;
    this.meshes.forEach(mesh => {
      mesh.material.color.setHex(this.colour.default);
    });
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

    // rotate if paper
    if (this.hover && this.meshes[0].userData.isPaper) {
      // this.meshes[0].rotation.y += delta * Math.PI;
    }
  }
}

export default Interactive;
