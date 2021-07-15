/** Scene */

import * as THREE from 'three';
import Config from './config';
import Animation from './animation';
import Clamp from '../util/clamp';
import CreateElement from '../util/create_element';
import Loader from '../loader/loader';
import HotSpot from './hot_spot';
import ScreenSpace from '../ui/screen_space';
import RandRange from '../util/rand_range';
import Interactive from './interactive';
import PerlinNoise2D from '../util/perlin_noise_2d';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.loader = new Loader('assets/');
    this.objects = [];
    this.animations = [];
    this.perlin = {offsetX: 0, offsetZ: 0, scale: 5};
    this.active = false;
  }

  bind(root) {
    this.ref = {};
    this.ref.camera = root.modules.camera;

    // height map & lighting
    this.initHeightMap();
    this.initLighting();

    // load font & pages
    let fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/Karla_Bold.json', font => {
      this.font = font;
      this.initPages();
      this.scene.add(this.heightMap);
      this.active = true;
    });
  }

  getHeight(x, z) {
    x += this.perlin.offsetX;
    z += this.perlin.offsetZ;
    let y = PerlinNoise2D(x / this.perlin.scale, z / this.perlin.scale) * 2.125;
    y += PerlinNoise2D(x, z) * 0.35;
    return y;
  }

  setObjectHeights() {
    this.objects.forEach(obj => {
      obj.meshes.forEach(mesh => {
        mesh.position.y = this.getHeight(mesh.position.x, mesh.position.z);
      });
    });
  }

  initHeightMap() {
    // create height map
    let geo = new THREE.PlaneBufferGeometry(15, 15, 50, 50);
    let mat = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.25,
      roughness: 0.75,
      wireframe: true
    });
    //mat = new THREE.MeshBasicMaterial({color: 0xff00, wireframe: true});
    let mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(-Math.PI/2, 0, 0);
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();

    // make height map
    for (let i=0; i<geo.attributes.position.array.length; i+=3) {
      let x = geo.attributes.position.array[i];
      let z = geo.attributes.position.array[i+2];
      let y = this.getHeight(x, z);
      geo.attributes.position.array[i+1] = y;
    }
    geo.computeFaceNormals();
    this.heightMap = mesh;
  }

  initLighting() {
    this.light = {};
    this.light.a1 = new THREE.AmbientLight(0xffffff, 0.75);
    this.light.d1 = new THREE.DirectionalLight(0xffffff, 0.25);
    this.light.d2 = new THREE.DirectionalLight(0xffffff, 0.25);
    this.light.p1 = new THREE.PointLight(0xffffff, 0.25, 30, 2);
    this.light.d1.position.set(0, 0, -1);
    this.light.d2.position.set(1, 0, 1);
    this.light.p1.position.set(0, 10, 0);
    for (const key in this.light) {
      this.scene.add(this.light[key]);
    }
  }

  initPages() {
    // page -- index
    let text = 'xavierburrow';
    let p = [[-6, 6], [-5, 5], [-5, 2], [-4, 2], [-2, 4], [-2, 2], [-2, -2], [-2, -4], [0, -4], [-1, -6], [5, -7], [7, -7]];
    text.split('').forEach((chr, i) => {
      let obj = new Interactive({
        root: this,
        page: 'index',
        text: chr,
        el: {class: 'overlay__hotspot'},
      });
      obj.meshes[0].position.set(p[i][0], this.getHeight(p[i][0], p[i][1]), p[i][1]);
      obj.el.addEventListener('click', () => {
        this.onIndexLetterClicked(obj);
      });
      this.objects.push(obj);
    });

    // page -- contact
    let email = new Interactive({
      root: this,
      page: 'contact',
      text: 'email',
      el: {
        type: 'a',
        class: 'overlay__hotspot overlay__hotspot--contact',
        attributes: {
          href: 'mailto:jxburrow@gmail.com',
          target: '_blank',
        },
      }
    });
    email.meshes.forEach((mesh, i) => {
      let x = -7 + i * 1;
      let z = -7;
      mesh.position.set(x, this.getHeight(x, z), z);
    });
    this.objects.push(email);
    let instagram = new Interactive({
      root: this,
      page: 'contact',
      text: 'instagram',
      el: {
        type: 'a',
        class: 'overlay__hotspot overlay__hotspot--contact',
        attributes: {
          href: 'https://www.instagram.com/xavebabes/',
          target: '_blank',
        },
      }
    });
    instagram.meshes.forEach((mesh, i) => {
      let t = i / 9;
      let x = -6 + i * 0.5 + Math.cos(t * Math.PI / 2);
      let z = 6 - i * 0.75;
      mesh.position.set(x, this.getHeight(x, z), z);
    });
    this.objects.push(instagram);

    // projects
    let projects = [
      {name:'preppers', date: '2020', url: ''},
      {name:'epoch_wars', date: '2021', url: ''},
      {name:'panic_buy', date: '2020', url: ''},
      {name:'closed_on_monday', date: '2020', url: ''},
      {name:'toxotes', date: '2020', url: ''},
      {name:'mcncs', date: '2018', url:''},
      {name:'the_pixies', date: '2020', url: ''},
      {name:'dongles', date: '2020', url: ''},
      {name:'pixelsort', date: '2020', url: ''},
      {name:'we_are_city_plaza', date: '2020', url: ''},
      {name:'delaval_film', date: '2020', url: ''},
      {name:'pencil_mmo', date: '2020', url: ''}
    ];
    projects.forEach(p => {
      // page -- work
      let geo = new THREE.SphereBufferGeometry(0.2, 12, 12);
      let mat = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.35, roughness: 0.65});
      let menuItem = new Interactive({
        root: this,
        page: 'work',
        mesh: new THREE.Mesh(geo, mat),
        el: {
          class: 'overlay__hotspot overlay__hotspot--project',
          childNodes: [{
            class: 'project-title',
            innerHTML: p.name,
          }]
        },
      });
      menuItem.el.addEventListener('click', () => {
        this.goToPage(p.name);
      })
      let x = (Math.random() * 2 - 1) * 7;
      let z = (Math.random() * 2 - 1) * 7;
      menuItem.meshes[0].position.set(x, this.getHeight(x, z), z);
      this.objects.push(menuItem);

      // page -- project
      let backButton = new Interactive({
        root: this,
        page: p.name,
        text: '<',
        textSize: 0.75,
        el: {
          class: 'overlay__hotspot overlay__hotspot--back',
          childNodes: [{
            class: 'label',
            innerHTML: '&larr; back',
          }]
        },
      });
      backButton.meshes[0].position.set(-7, this.getHeight(-7, 7), 7);
      backButton.el.addEventListener('click', () => { this.goToPage('work'); });
      this.objects.push(backButton);

      let titleSize = 0.75;
      let title = new Interactive({
        root: this, page: p.name, text: p.name, textSize: titleSize,
        el: {
          class: 'overlay__hotspot overlay__hotspot--wide',
        }
      });
      title.el.addEventListener('click', () => { this.goToPage(p.name); });
      let midpoint = Math.floor(title.meshes.length / 2);
      title.meshes.forEach((mesh, i) => {
        let x, z;
        if (i < midpoint) {
          x = -7;
          z = -7 + (midpoint - i - 1) * titleSize;
        } else {
          x = -7 + (i - midpoint + 1) * titleSize;
          z = -7;
        }
        mesh.position.set(x, this.getHeight(x, z), z);
      });
      this.objects.push(title);

      let date = new Interactive({root: this, page: p.name, text: p.date, textSize: 0.5});
      date.meshes.forEach((mesh, i) => {
        let x = 6.5 + (-date.meshes.length + i + 1) * 0.5;
        let z = -7;
        mesh.position.set(x, this.getHeight(x, z), z);
      });
      this.objects.push(date);
    });

    // go to index
    let i = 0;
    let cascade = 80;
    this.objects.forEach(obj => {
      if (obj.page === 'index') {
        obj.show(0);
      }
    });
  }

  onIndexLetterClicked(obj) {
    if (obj.locked) { return; }
    obj.locked = true;

    // get new position
    let mesh = obj.meshes[0];
    let angle = Math.PI * Math.random() * 2;
    let dist = 1 + Math.random() * 2;
    let p1 = (new THREE.Vector3()).copy(mesh.position);
    let p2 = (new THREE.Vector3()).copy(mesh.position);
    let xOff = Math.cos(angle) * dist;
    let zOff = Math.sin(angle) * dist;
    p2.x += xOff * (Math.abs(p2.x + xOff) > 7 ? -1 : 1);
    p2.z += zOff * (Math.abs(p2.z + zOff) > 7 ? -1 : 1);
    dist = p2.distanceTo(p1);
    let dur = dist / 4;
    let r1 = mesh.rotation.y;
    let r2 = mesh.rotation.y + (Math.random() > 0.5 ? 1 : -1) * Math.PI * dist;

    // animate
    let a = new Animation({
      duration: dur,
      callback: t => {
        mesh.position.x = p1.x + (p2.x - p1.x) * t;
        mesh.position.z = p1.z + (p2.z - p1.z) * t;
        mesh.position.y = this.getHeight(mesh.position.x, mesh.position.z);
        mesh.rotation.y = r1 + (r2 - r1) * t;
        if (t == 1) {
          obj.locked = false;
        }
      },
    });
    this.animations.push(a);
  }

  getScene() {
    return this.scene;
  }

  goToPage(page) {
    if (this.pageTransitionLock) { return; }
    this.pageTransitionLock = true;

    let i = 0;
    let cascade = 80;

    // close current page
    this.objects.forEach(obj => {
      if (obj.page !== page && obj.active) {
        setTimeout(() => {  obj.hide(); }, i * cascade);
        i += obj.meshes.length;
      }
    });

    // open next page
    this.objects.forEach(obj => {
      if (obj.page == page) {
        setTimeout(() => { obj.show(); }, i * cascade);
        i += obj.meshes.length;
      }
    });

    // animate map
    let dur = (i * cascade) / 1000 + 0.5;
    let dist = dur * 4;
    let fromX = this.perlin.offsetX;
    let toX = fromX + dist;
    const anim = new Animation({
      duration: dur,
      callback: t => {
        this.perlin.offsetX = fromX + (toX - fromX) * t;
        let geo = this.heightMap.geometry;
        for (let i=0; i<geo.attributes.position.array.length; i+=3) {
          let x = geo.attributes.position.array[i];
          let z = geo.attributes.position.array[i+2];
          let y = this.getHeight(x, z);
          geo.attributes.position.array[i+1] = y;
        }
        geo.computeFaceNormals();
        geo.attributes.position.needsUpdate = true;
        geo.attributes.normal.needsUpdate = true;
        this.setObjectHeights();
      },
    });
    this.animations.push(anim);

    // remove lock
    setTimeout(() => {
      this.pageTransitionLock = false;
    }, i * cascade);
  }

  update(delta) {
    this.objects.forEach(obj => { obj.update(delta); });

    for (let i=this.animations.length-1; i>=0; i--) {
      this.animations[i].update(delta);
      if (!this.animations[i].active) {
        this.animations.splice(i, 1);
      }
    }
  }
}

export default Scene;
