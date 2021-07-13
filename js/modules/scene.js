/** Scene */

import * as THREE from 'three';
import Config from './config';
import ColliderSystem from '../collider/collider_system';
import ColliderObject from '../collider/collider_object';
import Clamp from '../util/clamp';
import Loader from '../loader/loader';
import PerlinNoise from '../util/perlin_noise';
import RandRange from '../util/rand_range';

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.loader = new Loader('assets/');
    this.colliderSystem = new ColliderSystem();
    this.objects = [];
  }

  bind(root) {
    this.ref = {};
    this.ref.camera = root.modules.camera;
    this.initHeightMap();
    this.initText();
    this.initLighting();
  }

  initText() {
    let mat = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0.65, roughness: 0.5});

    let callback = () => {
      let text = 'XAVIERBURROW';
      for (let i=0; i<text.length; i++) {
        let index = Math.floor(Math.random() * text.length);
        let chr = text[i];
        let geo = new THREE.TextGeometry(chr, {
          font: this.font,
          size: 1,
          height: 0.125,
      		bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(geo, mat);
        let box = new THREE.Box3().setFromObject( mesh );
        let size = new THREE.Vector3();
        box.getSize(size);
        geo.translate(-size.x/2, 0, -size.z/2);
        let x = -7.5 + (i / text.length) * 15;
        let z = Math.random() * 7.5 - 3.75;
        mesh.position.set(x, 0, z);
        mesh.position.y = this.colliderSystem.getMinimum(mesh.position);
        mesh.rotation.y = RandRange(0, 8) * Math.PI / 8;
        this.scene.add(mesh);

        // object refs
        let obj = {};
        obj.mesh = mesh;
        obj.position = mesh.position;
        let d = Math.random() * Math.PI * 2;
        obj.motion = new THREE.Vector3(Math.cos(d), 0, Math.sin(d));
        obj.speed = 0;// Math.random() > 0.5 ? 0 : Math.random() * 3;
        this.objects.push(obj);
      }
    };

    // load font
    let fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/Karla_Bold.json', font => {
      this.font = font;
      callback();
    });
  }

  initHeightMap() {
    const getHeight = (x, z) => {
      let y = PerlinNoise(x/200, z/200, 1, 8) * 20 - 10;
      y += PerlinNoise(x, z, 1, 8) * 0.5;
      return y;
    };

    // create height map
    let geo = new THREE.PlaneBufferGeometry(15, 15, 50, 50);
    let mat = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      metalness: 0.5,
      roughness: 0.35,
      wireframe: true
    });
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
      let y = getHeight(x, z) - 0.05;
      geo.attributes.position.array[i+1] = y;
    }
    geo.computeFaceNormals();
    //geo.computeVertexNormals();
    console.log(geo);

    this.scene.add(mesh);

    // create collision map
    let geo2 = new THREE.PlaneBufferGeometry(15, 15, 14, 14);
    let mesh2 = new THREE.Mesh(geo2, mat);
    mesh2.rotation.set(-Math.PI/2, 0, 0);
    mesh2.updateMatrix();
    mesh2.geometry.applyMatrix(mesh2.matrix);
    mesh2.rotation.set(0, 0, 0);
    mesh2.updateMatrix();

    // make height map
    for (let i=0; i<geo2.attributes.position.array.length; i+=3) {
      let x = geo2.attributes.position.array[i];
      let z = geo2.attributes.position.array[i+2];
      let y = getHeight(x, z);
      geo2.attributes.position.array[i+1] = y;
    }
    geo2.computeVertexNormals();

    this.colliderSystem.addFloor(mesh2);
  }

  initLighting() {
    const model = Config.Renderer.lowQuality ? 1 : 2;
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

  getColliderSystem() {
    return this.colliderSystem;
  }

  getScene() {
    return this.scene;
  }

  update(delta) {
    let bound = 7;
    this.objects.forEach(obj => {
      if (Math.random() > 0.995) {
        obj.position.x += RandRange(-1, 1) * 0.5;
        obj.position.z += RandRange(-1, 1) * 0.5;
        obj.position.x = Clamp(obj.position.x, -bound, bound);
        obj.position.z = Clamp(obj.position.z, -bound, bound);
        obj.position.y = this.colliderSystem.getMinimum(obj.position);
        obj.mesh.rotation.y += RandRange(-1, 1) * Math.PI / 8;
      }
    });
  }
}

export default Scene;
