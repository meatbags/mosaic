/** Config */

import * as THREE from 'three';

const Config = {
  MOBILE_BREAKPOINT: 760,
  Scene: {
    cascade: 50,
    slots: (() => {
      let res = [];
      for (let x=-5; x<=5; x+=2.5) {
        for (let z=-5; z<=5; z+=2.5) {
          res.push([x, z]);
        }
      }
      return res.sort(() => Math.random() - 0.5);
    })(),
    projectSlots: (() => {
      let res = [];
      for (let x=-4; x<=4; x+=2) {
        for (let z=-4; z<=4; z+=2) {
          res.push([x, z]);
        }
      }
      return res.sort(() => Math.random() - 0.5);
    })(),
    projects: [{
        name: 'laputa',
        date: '2022',
        character: 'L',
        url: 'https://getpixel.itch.io/laputa/',
        description: `
          <span>LAPUTA</span> (video game 2022) is a puzzle game set amongst
          the clouds. Explore a lonely castle and solve brain-bending logic
          puzzles
          <br /><br />
          <a href="https://getpixel.itch.io/laputa/" target="_blank">PLAY GAME</a>
        `,
        images: [
          'img/laputa_01.jpg',
          'img/laputa_02.jpg',
          'img/laputa_03.jpg',
        ]
      }, {
        name: 'preppers',
        date: '2020',
        character: 'P',
        url: 'https://preppers.gallery/',
        description: `
          <span>PREPPERS</span> (web installation 2020) is an art installation
          by ART ON THE MOVE exploring the freshly relevant PREPPER culture
          <br /><br />
          <a href="https://preppers.gallery/" target="_blank">VISIT SITE</a>
        `,
        images: [
          'img/preppers_01.jpg',
          'img/preppers_02.jpg',
          'img/preppers_03.jpg',
          'img/preppers_04.jpg',
        ]
      }, {
        name: 'epoch_wars',
        character: '!',
        date: '2021',
        url: 'https://epoch-wars.com/',
        description: `
          <span>EPOCH WARS</span> (web installation 2021)
          is an art project by PONY EXPRESS exploring the definition of EPOCHS
          through esoteric EPOCH commissions
          <br /><br />
          <a href="https://epoch-wars.com/" target="_blank">VISIT SITE</a>
        `,
        images: [
          'img/ew_1.jpg',
          'img/ew_2.jpg',
          'img/ew_3.jpg',
          'img/ew_4.jpg',
        ]
      }, {
        name: 'panic_buy',
        character: '$',
        date: '2020',
        url: 'https://panic-buy-online.com/',
        description: `
          <span>PANIC BUY</span> (web installation/video game 2020) is an art installation
          by TIYAN BAKER and GUY LOUDEN exploring the phenomenon of PANIC BUYING
          <br /><br />
          <a href="https://panic-buy-online.com/" target="_blank">VISIT SITE</a>
        `,
        images: [
          'img/panic_buy_01.jpg',
          'img/panic_buy_02.png',
          'img/panic_buy_03.png',
        ]
      }, {
        name: 'closed_on_monday',
        date: '2020',
        url: 'https://closedonmondaygallery.com/',
        description: `
          <span>CLOSED ON MONDAY</span> (2019 - present) is a virtual gallery
          featuring audio, visual, and sculpture works by Sydney-based artists
          <br /><br />
          <a href="https://closedonmondaygallery.com/" target="_blank">VISIT SITE</a>`,
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
          com.visible = false;
          return com;
        },
        images: [
          'img/com_01.jpg',
          'img/com_02.jpg',
          'img/com_03.jpg',
        ]
      }, {
        name: 'toxotes',
        character: 'X',
        date: '2019',
        description: `
          <span>TOXOTES</span> (music video / 2019)
          is a music video for Sydney artist ZHE NHIR featuring
          procedurally-generated graphics & loops
          <br><br>
          <a href="https://www.youtube.com/watch?v=7Rc7XGBK6sg" target="_blank">WATCH VIDEO</a>
        `,
        videos: [
          'https://www.youtube.com/embed/7Rc7XGBK6sg',
        ]
      }, {
        name: 'we_are_city_plaza',
        date: '2018',
        url: 'https://wearecityplaza.net/',
        description: `
          <span>WE ARE CITY PLAZA</span> (exhibition website 2018)
          is a photography exhibition centred around the CITY PLAZA refugee housing project in ATHENS, GREECE
          <br /><br />
          <a href="https://wearecityplaza.net/" target="_blank">VISIT SITE</a>
        `,
        images: [
          'img/cp_1.jpg',
          'img/cp_2.jpg',
          'img/cp_3.jpg',
        ],
        getMesh: () => {
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let wacp = new THREE.Group();
          let wacp_size = 0.8;
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.add(new THREE.Mesh(new THREE.BoxBufferGeometry(wacp_size, 0.2, wacp_size), mat.clone()));
          wacp.children.forEach((child, i) => { child.position.y = 0.1 + i * 0.35; });
          wacp.visible = false;
          return wacp;
        }
      }, {
        name: 'mcncs',
        date: '2018',
        url: 'http://www.mcncs.io/',
        description: `<span>MCNCS</span> (2018) pre-launch branding and microsite for MECHANICS festival`,
        images: [
          'img/mcncs_01.jpg',
        ],
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
          mcncs.visible = false;
          return mcncs;
        }
      }, {
        name:'the_pixies',
        character: '?',
        date: '2016',
        description: `
          <span>TENEMENT SONG</span> (music video 2016) for TENEMENT SONG by THE PIXIES made in AFTER EFFECTS
          <br><br>
          <a href="https://www.youtube.com/watch?v=-SLgXBLQA2M" target="_blank">WATCH VIDEO</a>
        `,
        images: [
          'img/pixies_1.jpg',
          'img/pixies_2.jpg',
          'img/pixies_3.jpg',
        ],
        videos: ['https://www.youtube.com/embed/-SLgXBLQA2M']
      }, {
        name: 'dongles',
        date: '2019',
        character: 'D',
        description: `
          <span>DONGLES</span> (animation 2019) a proof-of-concept video animation
          with looping components
          <br><br>
          <a href="https://www.youtube.com/watch?v=CQv_DFBlqEU" target="_blank">WATCH VIDEO</a>
        `,
        images: [
          'img/dongles_1.jpg',
          'img/dongles_2.jpg',
          'img/dongles_3.jpg',
        ],
        videos: [
          'https://www.youtube.com/embed/CQv_DFBlqEU'
        ]
      }, {
        name: 'pencil_mmo',
        date: '2020',
        description: `
          <span>PENCIL MMO</span> (MMO art game / 2020)
          massively multiplayer drawing game
        `,
        images: [
          'img/mmo_1.jpg',
          'img/mmo_2.jpg',
          'img/mmo_3.jpg',
          'img/mmo_4.jpg',
        ],
        getMesh: () => {
          let mat = new THREE.MeshStandardMaterial({color:0xffffff});
          let pencil = new THREE.Group();
          let shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16), mat.clone());
          let tip = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.02, 0.25, 16), mat.clone());
          shaft.geometry.translate(0, 1, 0);
          tip.geometry.translate(0, 0.125, 0);
          pencil.add(shaft, tip);
          pencil.rotation.set(-Math.PI * 0.1, 0, -Math.PI * 0.1);
          pencil.visible = false;
          return pencil;
        }
      },
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
