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
    this.ref.navigation = root.modules.navigation;

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
      this.ref.navigation.removeLoadingScreen();
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
      obj.setHeight();
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
    mesh.geometry.applyMatrix4(mesh.matrix);
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
    this.initPageIndex();
    this.initPageContact();
    this.initPageWork();
    this.goToPage('index', false);
  }

  initPageIndex() {
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

    // to work button
    this.createButton({
      page: 'index',
      text: 'work',
      textSize: 0.5,
      onClick: () => { this.goToPage('work'); },
      placementCallback: (mesh, i) => {
        let x = -5.5 + i * 0.15;
        let z = -2 - i * 0.45;
        mesh.position.set(x, this.getHeight(x, z), z);
      },
    });

    // to contact button
    this.createButton({
      page: 'index',
      text: 'contact',
      textSize: 0.5,
      onClick: () => { this.goToPage('contact'); },
      placementCallback: (mesh, i) => {
        let x = 1.5 + i * 0.45;
        let z = 0.5 - i * 0.15;
        mesh.position.set(x, this.getHeight(x, z), z);
      },
    })
  }

  initPageContact() {
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

    // to index button
    this.createButton({
      page: 'contact',
      text: 'index',
      textSize: 0.5,
      onClick: () => { this.goToPage('index'); },
      placementCallback: (mesh, i) => {
        let x = -7;
        let z = 7 - i * 0.5;
        mesh.position.set(x, this.getHeight(x, z), z);
      },
    });
  }

  initPageWork() {
    // to index button
    this.createButton({
      page: 'work',
      text: 'index',
      textSize: 0.5,
      onClick: () => { this.goToPage('index'); },
      placementCallback: (mesh, i) => {
        let x = -7;
        let z = 7 - i * 0.5;
        mesh.position.set(x, this.getHeight(x, z), z);
      },
    });

    // page title
    /*
    this.createButton({
      page: 'work',
      text: 'work',
      textSize: 0.75,
      onClick: () => { this.goToPage('work'); },
      placementCallback: (mesh, i) => {
        let midpoint = 2;
        let x = i < midpoint ? -7 : -7 + (i - midpoint + 1) * 0.75;
        let z = i < midpoint ? -7 + (midpoint - i - 1) * 0.75 : -7;
        mesh.position.set(x, this.getHeight(x, z), z);
      }
    });
    */

    // project menu items & pages
    let slotIndex = Math.floor(Math.random() * Config.Scene.slots.length);
    Config.Scene.projects.forEach((p, i) => {
      // page -- work
      let menuItem = new Interactive({
        root: this,
        page: 'work',
        mesh: p.getMesh ? p.getMesh() : null,
        text: p.character || null,
        el: {
          class: 'overlay__hotspot overlay__hotspot--tall',
          childNodes: [{
            class: 'project-title',
            innerHTML: p.name,
          }],
          addEventListener: {
            click: () => { this.goToPage(p.name); },
          },
        },
      });

      // avoid a few collisions
      let slot = Config.Scene.slots[(slotIndex + i) % Config.Scene.slots.length];
      let x = slot[0];
      let z = slot[1];
      menuItem.meshes.forEach((mesh, i) => { mesh.position.set(x, this.getHeight(x, z), z); });

      // add to tree
      this.objects.push(menuItem);

      // to work button
      this.createButton({
        page: p.name,
        text: 'back',
        textSize: 0.5,
        onClick: () => { this.goToPage('work'); },
        placementCallback: (mesh, i) => {
          let x = -7;
          let z = 7 - i * 0.5;
          mesh.position.set(x, this.getHeight(x, z), z);
        },
      })

      // title
      let midpoint = Math.floor(p.name.length * Math.random());
      this.createButton({
        page: p.name,
        text: `${p.name}`,
        textSize: 0.75,
        onClick: () => { this.goToPage(p.name); },
        placementCallback: (mesh, i) => {
          let x = i < midpoint ? -7 : -7 + (i - midpoint + 1) * 0.75;
          let z = i < midpoint ? -7 + (midpoint - i - 1) * 0.75 : -7;
          mesh.position.set(x, this.getHeight(x, z), z);
        },
      });

      // init slot index
      let slots = Config.Scene.projectSlots.sort(() => Math.random() - 0.5);
      let slotIndex2 = Math.floor(Math.random() * slots.length);

      // url
      if (p.url) {
        let url= new Interactive({
          root: this,
          page: p.name,
          text: '{LINK}',
          textSize: 0.5,
          el: {
            type: 'a',
            class: 'overlay__hotspot',
            attributes: {
              href: p.url,
              target: '_blank',
            },
          },
        });
        let slot = slots[(slotIndex2++) % slots.length];
        let baseX = slot[0];
        let baseZ = slot[1];
        url.meshes.forEach((mesh, i) => {
          let x = baseX;
          let z = baseZ - i * 0.5;
          mesh.position.set(x, this.getHeight(x, z), z);
        });
        this.objects.push(url);
      }

      // project images
      if (p.images) {
        p.images.forEach(img => {
          let menuItem = new Interactive({
            root: this,
            page: p.name,
            mesh: this.getCrumpledPaperMesh(),
            el: {
              class: 'overlay__hotspot overlay__hotspot--image',
              childNodes: [{
                class: 'content',
                childNodes: [{
                  type: 'img',
                  dataset: { src: img, },
                }]
              }]
            },
          });
          let slot = slots[(slotIndex2++) % slots.length];
          let x = slot[0];
          let z = slot[1];
          menuItem.meshes[0].position.set(x, this.getHeight(x, z), z);
          let loader = new THREE.TextureLoader();
          let tex = loader.load(img, tex => {
            let sx = tex.image.naturalWidth / 1000;
            let sy = tex.image.naturalHeight / 1000;
            menuItem.meshes[0].scale.set(sx, sy, 1);
          });
          menuItem.meshes[0].material.map = tex;
          this.objects.push(menuItem);
        });
      }

      // project videos
      if (p.videos) {
        p.videos.forEach(video => {
          let v = new Interactive({
            root: this,
            page: p.name,
            text: '{VIDEO}',
            textSize: 0.5,
            el: {
              class: 'overlay__hotspot overlay__hotspot--video',
              childNodes: [{
                class: 'content',
                childNodes: [{
                  type: 'iframe',
                  dataset: { src: video },
                }]
              }]
            },
          });
          let slot = slots[(slotIndex2++) % slots.length];
          let baseX = slot[0];
          let baseZ = slot[1];
          v.meshes.forEach((mesh, i) => {
            let x = baseX + i * 0.5;
            let z = baseZ + 0;
            mesh.position.set(x, this.getHeight(x, z), z);
          });
          this.objects.push(v);
        });
      }

      // description
      if (p.description) {
        let desc = new Interactive({
          root: this,
          page: p.name,
          text: '{INFO}',
          textSize: 0.5,
          el: {
            class: 'overlay__hotspot overlay__hotspot--description',
            childNodes: [{
              class: 'content',
              childNodes: [{
                class: 'description',
                innerHTML: p.description,
              }]
            }],
          },
        });
        let slot = slots[(slotIndex2++) % slots.length];
        let baseX = slot[0];
        let baseZ = slot[1];
        desc.meshes.forEach((mesh, i) => {
          let x = baseX;
          let z = baseZ - i * 0.5;
          mesh.position.set(x, this.getHeight(x, z), z);
        });
        this.objects.push(desc);
      }
    });
  }

  createButton(params) {
    // back to index button
    let textSize = params.textSize || 0.5;
    let buttonClass = textSize == 0.5 ? 'overlay__hotspot--button' : 'overlay__hotspot--wide';
    let button = new Interactive({
      root: this,
      page: params.page || 'index',
      text: params.text,
      textSize: params.textSize || 0.5,
      el: {
        class: 'overlay__hotspot ' + buttonClass,
        addEventListener: {
          click: params.onClick,
        }
      },
    });
    button.meshes.forEach(params.placementCallback);
    this.objects.push(button);
  }

  getCrumpledPaperMesh() {
    let geo = new THREE.PlaneBufferGeometry(1, 1, 10, 10);
    let mat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    let offX = Math.random() * 100;
    let offY = Math.random() * 100;
    let scale = 1 + Math.random() * 0.125;

    // crumple geometry
    for (let i=0; i<geo.attributes.position.array.length; i+=3) {
      let x = geo.attributes.position.array[i] * 2 + offX;
      let y = geo.attributes.position.array[i+1] * 2 + offY;
      let z = this.getHeight(x, y) * 1;
      geo.attributes.position.array[i+0] = geo.attributes.position.array[i+0] * scale;
      geo.attributes.position.array[i+1] = geo.attributes.position.array[i+1] * scale;
      geo.attributes.position.array[i+2] = z * scale;
    }
    geo.computeFaceNormals();

    // centre & reposition
    let mesh = new THREE.Mesh(geo, mat);
    mesh.geometry.center();
    // mesh.geometry.translate(0, 0.5, 0);
    let rx = Math.random() * Math.PI * 2;
    let ry = Math.random() * Math.PI * 2;
    let rz = Math.random() * Math.PI * 2;
    mesh.rotation.set(rx, ry, rz);
    mesh.updateMatrix();
    mesh.geometry.applyMatrix4(mesh.matrix);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();
    let box = new THREE.Box3().setFromObject(mesh);
    let size = new THREE.Vector3();
    box.getSize(size);
    mesh.geometry.translate(0, size.y/2, 0);

    // hide
    mesh.visible = false;

    return mesh;
  }

  getScroll() {
    let geo = new THREE.PlaneBufferGeometry(1.25, 1.75, 1, 20);
    let mat = new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide});
    // crumple geometry
    for (let i=0; i<geo.attributes.position.array.length; i+=3) {
      let x = geo.attributes.position.array[i+0];
      let y = geo.attributes.position.array[i+1];
      let z = Math.cos(y / 1.75 * Math.PI * 6) * 0.25;// geo.attributes.position.array[i+2];
      geo.attributes.position.array[i+0] = x;
      geo.attributes.position.array[i+1] = y;
      geo.attributes.position.array[i+2] = z;
    }
    geo.computeFaceNormals();

    // centre & reposition
    let mesh = new THREE.Mesh(geo, mat);
    mesh.geometry.center();
    let rx = Math.random() * Math.PI * 2;
    let ry = Math.random() * Math.PI * 2;
    let rz = Math.random() * Math.PI * 2;
    mesh.rotation.set(rx, ry, rz);
    mesh.updateMatrix();
    mesh.geometry.applyMatrix4(mesh.matrix);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrix();

    //let mesh = new THREE.Mesh(geo, mat);
    let box = new THREE.Box3().setFromObject(mesh);
    let size = new THREE.Vector3();
    box.getSize(size);
    geo.translate(0, size.y/4, 0);

    // hide
    mesh.visible = false;

    return mesh;
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

  goToPage(page, ripple=true) {
    if (this.pageTransitionLock) { return; }
    this.pageTransitionLock = true;

    let i = 0;
    let cascade = Config.Scene.cascade;

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
    if (ripple) {
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
    }

    // menu item
    document.querySelectorAll('[data-page]').forEach(el => {
      if (el.dataset.page == page) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

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
