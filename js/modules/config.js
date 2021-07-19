/** Config */

import * as THREE from 'three';

const Config = {
  Scene: {
    cascade: 70,
    slots: [
      [-5, 5], [-4, 3], [-2, 3], [-2, 0],
      [3, 6], [5, 5], [1, 5], [5, 0],
      [-4, -4], [-3, -4.5],
      [4, -6], [2, -4], [0.5, -5.5], [0, -0.5]
    ],
    projectSlots: [
      [-3.5, -3.5], [0, -3.5], [4, -3.5],
      [-4.5,  0], [0, 0.5], [4.5,  0],
      [-4,  3.5], [0,  5], [4,  4.5],
    ],
    projects: [{
        name: 'preppers',
        date: '2020',
        character: 'P',
        url: 'https://preppers.gallery/',
        images: [ 'img/example.jpg', 'img/example.jpg', 'img/example.jpg' ],
        videos: [ 'https://www.youtube.com/watch?v=-SLgXBLQA2M', ],
        description: 'PRP',
      }, {
        name: 'epoch_wars',
        character: '!',
        date: '2021',
        url: 'https://epoch-wars.com/',
        description: 'website for arts org. Pony Express',
      }, {
        name: 'panic_buy',
        character: '$',
        date: '2020',
        url: 'https://panic-buy-online.com/'
      }, {
        name: 'closed_on_monday',
        date: '2020',
        url: 'https://closedonmondaygallery.com/',
        description: 'virtual gallery',
        getMesh: () => {
          // create mesh -- com
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let com = new THREE.Group();
          let r = 0.15;
          let com_t = new THREE.Mesh(new THREE.BoxBufferGeometry(r, r, 1), mat.clone());
          let com_b = new THREE.Mesh(new THREE.BoxBufferGeometry(r, r, 1), mat.clone());
          let com_l = new THREE.Mesh(new THREE.BoxBufferGeometry(r, 1.5, r), mat.clone());
          let com_r = new THREE.Mesh(new THREE.BoxBufferGeometry(r, 1.5, r), mat.clone());
          com_t.position.set(0, 1.5, 0);
          com_b.position.set(0, 0, 0);
          com_l.position.set(0, 0.75, -0.5 + r/2);
          com_r.position.set(0, 0.75, 0.5 - r/2);
          com.add(com_t, com_b, com_l, com_r);
          com.rotation.y = Math.PI * 0;
          return com;
        }
      }, {
        name: 'toxotes',
        character: 'X',
        date: '2020',
        videos: [
          'https://www.youtube.com/watch?v=7Rc7XGBK6sg',
        ]
      }, {
        name:'mcncs', date: '2018', url:'http://www.mcncs.io/',
        getMesh: () => {
          // create mesh -- com
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let mcncs = new THREE.Group();
          let r = 0.2;
          mcncs.add(new THREE.Mesh(new THREE.BoxBufferGeometry(r, 1, r), mat.clone()));
          mcncs.add(new THREE.Mesh(new THREE.BoxBufferGeometry(r, 1, r), mat.clone()));
          mcncs.add(new THREE.Mesh(new THREE.BoxBufferGeometry(r, 1, r), mat.clone()));
          mcncs.children.forEach((child, i) => {
            child.position.x = -0.5 + i * 0.5;
            child.position.y = 0.5;
          });
          mcncs.rotation.y = Math.PI * 0.25 + (Math.random() * 2 - 1) * Math.PI * 0.125;
          return mcncs;
        }
      }, {
        name:'we_are_city_plaza', date: '2020', url: 'https://wearecityplaza.net/',
        getMesh: () => {
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let wacp = new THREE.Group();
          let wacp_size = 0.8;
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.children.forEach((child, i) => { child.position.y = 0.1 + i * 0.35; });
          return wacp;
        }
      }, {
        name:'the_pixies', character: '?', date: '2020', videos: ['https://www.youtube.com/watch?v=-SLgXBLQA2M']
      }, {
        name:'dongles', character: 'D', date: '2020', videos: ['https://www.youtube.com/watch?v=CQv_DFBlqEU']
      }, {
        name: 'pencil_mmo',
        date: '2020',
        getMesh: () => {
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let pencil = new THREE.Group();
          let shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16), mat.clone());
          let tip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.02, 0.25, 16), mat.clone());
          shaft.geometry.translate(0, 1, 0);
          tip.geometry.translate(0, 0.125, 0);
          pencil.add(shaft, tip);
          pencil.rotation.set(-Math.PI * 0.1, 0, -Math.PI * 0.1);
          return pencil;
        }
      }
      //{ name:'delaval_film', icon:'DLV', date: '2020', url: 'https://www.delavalfilm.com/' },
      //{ name:'pixelsort', icon:'SRT', date: '2020', },

    ]
  },
  Renderer: {
    lowQuality: false,
    devicePixelRatioMin: 1,
  },
  Camera: {
    fov: 70,
    height: 2,
    position: {x: 10, y: 5, z: 15},
  },
  Controls: {
    speed: 5,
    speedNoclip: 15,
    maxPitch: Math.PI * 0.45,
    minPitch: -Math.PI * 0.45,
    blendPosition: 0.25,
    blendRotation: 0.25,
    rotation: {
      yaw: -Math.PI,
      pitch: 0,
    },
  },
  Navigation: {
    view: {
      displayNoneAnimationDelay: 50,
      displayNoneTimeout: 750,
    },
  },
  HotSpot: {
    threshold: {
      active: 17,
      enlarge: 10,
    },
    lineOfSightObjects: []
  },
};

export default Config;
