/** World */

import * as THREE from 'three';
import Loader from '../loader/loader';
import RandRange from '../util/rand_range';

class World {
  constructor() {
    this.loader = new Loader('assets/');
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene.getScene();
    this.mat = {};
    this.mat.default = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
    this._init();
  }

  getRepeatTexture(tex, rx, ry) {
    if (typeof tex == 'string') {
      tex = new THREE.TextureLoader().load(tex);
    }
    tex.wrapS = rx == 1 ? tex.wrapS : THREE.MirroredRepeatWrapping;
    tex.wrapT = ry == 1 ? tex.wrapT : THREE.MirroredRepeatWrapping;
    tex.repeat.set(rx, ry);
    return tex;
  }

  createTiledPlane(tex, x, y, z, rx, ry, rz, width, height, tilex, tiley) {
    let geo = new THREE.PlaneBufferGeometry(width, height);
    let mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
    let plane = new THREE.Mesh(geo, mat);
    plane.material.map =  this.getRepeatTexture(tex, tilex, tiley);
    plane.position.set(x, y, z);
    plane.rotation.set(rx, ry, rz);
    this.ref.scene.add(plane);
  }

  getRandomTexture(rx, ry) {
    let n = Math.floor(1 + Math.random() * 20).toString().padStart(2, '0');
    let src = `img/tile_${n}.jpg`;
    return this.getRepeatTexture(src, rx, ry);
  }

  _initText() {
    let text = 'abcdefghijklmnopqrstuvwxyz';
    for (let i=0; i<text.length; i++) {
      let chr = text[i];
      let mat = new THREE.MeshStandardMaterial({color: 0xffffff, metalness: 0, roughness: 0.75});
      mat.color.setRGB(Math.random(), Math.random(), Math.random());
      let geo = new THREE.TextGeometry(chr, {
        font: this.font,
        size: 2,
        height: 1,
    		bevelEnabled: false,
      });
      let mesh = new THREE.Mesh(geo, mat);
      let x = RandRange(-9, 9) / 2;
      let y = RandRange(0, 9) / 2;
      let z = 10 + RandRange(0, 100);
      let rx = 0;//RandRange(0, 3) * Math.PI/2;
      let ry = Math.PI;//RandRange(0, 3) * Math.PI/2;
      let rz = 0;//RandRange(0, 3) * Math.PI/2;
      mesh.position.set(x, y, z);
      mesh.rotation.set(rx, ry, rz);
      this.ref.scene.add(mesh);
    }
  }

  _createRoom() {
    let rx = 1;
    let ry = 1;
    let tiles = [
      this.getRepeatTexture('img/tile_01.jpg', rx, ry),
      this.getRepeatTexture('img/tile_02.jpg', rx, ry),
      this.getRepeatTexture('img/tile_03.jpg', rx, ry),
      this.getRepeatTexture('img/tile_04.jpg', rx, ry),
      this.getRepeatTexture('img/tile_05.jpg', rx, ry),
      this.getRepeatTexture('img/tile_06.jpg', rx, ry),
      this.getRepeatTexture('img/tile_07.jpg', rx, ry),
      this.getRepeatTexture('img/tile_08.jpg', rx, ry),
      this.getRepeatTexture('img/tile_09.jpg', rx, ry),
      this.getRepeatTexture('img/tile_10.jpg', rx, ry),
      this.getRepeatTexture('img/tile_11.jpg', rx, ry),
      this.getRepeatTexture('img/tile_12.jpg', rx, ry),
      this.getRepeatTexture('img/tile_13.jpg', rx, ry),
      this.getRepeatTexture('img/tile_14.jpg', rx, ry),
      this.getRepeatTexture('img/tile_15.jpg', rx, ry),
      this.getRepeatTexture('img/tile_16.jpg', rx, ry),
      this.getRepeatTexture('img/tile_17.jpg', rx, ry),
      this.getRepeatTexture('img/tile_18.jpg', rx, ry),
      this.getRepeatTexture('img/tile_19.jpg', rx, ry),
      this.getRepeatTexture('img/tile_20.jpg', rx, ry),
      this.getRepeatTexture('img/tile_21.jpg', rx, ry),
    ];
    let randTile = () => {
      let index = Math.floor(Math.random() * tiles.length);
      return tiles[index];
    };
    let limX = 10;
    for (let x=0; x<limX; x++) {
      let width = 0.5;
      let depth = 2000;
      let tx = 1;
      let ty = depth/width;
      let startX = (x-limX/2) * 6 * width;
      let rot = Math.PI/2;
      this.createTiledPlane(randTile(), startX+width*0, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*1, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*2, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*3, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*4, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*5, 0, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*0, 10, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*1, 10, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*2, 10, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*3, 10, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*4, 10, 0, rot, 0, 0, width, depth, tx, ty);
      this.createTiledPlane(randTile(), startX+width*5, 10, 0, rot, 0, 0, width, depth, tx, ty);
    }
    let limY = 4;
    for (let y=0; y<limY; y++) {
      let width = 0.5;
      let depth = 1000;
      let tx = 1;
      let ty = depth / width;
      let startY = y * 6 * width + width/2;
      let rot = Math.PI/2;
      this.createTiledPlane(randTile(), -5.25, startY+width*0, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), -5.25, startY+width*1, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), -5.25, startY+width*2, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), -5.25, startY+width*3, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), -5.25, startY+width*4, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), -5.25, startY+width*5, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*0, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*1, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*2, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*3, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*4, 0, 0, rot, rot, width, depth, tx, ty);
      this.createTiledPlane(randTile(), 5.25, startY+width*5, 0, 0, rot, rot, width, depth, tx, ty);
    }
  }

  _createCubes() {
    // cube
    let tex = this.getRepeatTexture('img/qr.png', 1, 1);
    let geo = new THREE.BoxBufferGeometry(2, 2, 2);
    let mat = this.mat.default.clone();
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(4, 1, 15);
    mat.map = tex;
    this.ref.scene.add(mesh);
  }

  _init() {
    this._createCubes();

    // text
    let fontLoader = new THREE.FontLoader();
    fontLoader.load('fonts/Karla_Bold.json', font => {
      this.font = font;
      this._initText();
    });

    // ball
    let red = new THREE.MeshStandardMaterial({color:0xff0000, metalness: 0.5, roughness: 0.5,});
    for (let z=0; z<1000; z+=5) {
      let rad = 0.3;
      let mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(rad, 32, 32), red);
      let x = -4;
      let y = Math.abs(Math.sin(z/10 * Math.PI/8)) * 2 + rad;
      mesh.position.set(x, y, z);
      this.ref.scene.add(mesh);
    }

    this.loader.loadFBX('hand_01').then(obj => {
      let s = 0.075;
      obj.scale.set(s, s, s);
      obj.rotation.set(0, 0, Math.PI/2);
      let rotStep = Math.PI / 4;

      for (let i=0.5; i<9.5; i+=0.5) {
        let y = 0.25 + i;
        let z = 6 + i;
        let clone = obj.clone();
        let rot = i * rotStep + z * Math.PI/4;
        let r = Math.random();
        let b = Math.random();
        let g = Math.random();
        clone.rotation.x = rot;
        clone.position.set(5.5, y, z);
        let mat = obj.children[0].material.clone();
        mat.color.setRGB(r, g, b);
        //mat.map = this.getRandomTexture(20, 20);
        clone.children[0].material = mat;
        this.ref.scene.add(clone);
      }
    });

    this._createRoom();
  }
}

export default World;
