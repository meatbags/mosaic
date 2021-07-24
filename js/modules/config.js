/** Config */

import * as THREE from 'three';

const Config = {
  Scene: {
    cascade: 70,
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
        name: 'preppers',
        date: '2020',
        character: 'P',
        url: 'https://preppers.gallery/',
        description: `
          <strong>PREPPERS</strong> WEB DESIGNER/DEVELOPER<br />
          website / 2020<br /><br />
          An art project / installation by ART ON THE MOVE<br /><br />
          <a href='https://preppers.gallery/' target='_blank'>visit PREPPERS</a>
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
          <strong>EPOCH WARS</strong> WEB DESIGNER/DEVELOPER<br />
          website / 2021<br /><br />
          EPOCH WARS is an art project by PONY EXPRESS<br /><br />
          <a href='https://epoch-wars.com/' target='_blank'>visit EPOCH WARS</a>
        `,
      }, {
        name: 'panic_buy',
        character: '$',
        date: '2020',
        url: 'https://panic-buy-online.com/',
        description: `
          <strong>PANIC BUY</strong> DEVELOPER<br />
          website / 2020<br /><br />
          PANIC BUY is an art project / installation by TIYAN BAKER and GUY LOUDEN<br /><br />
          <a href='https://panic-buy-online.com/' target='_blank'>visit PANIC BUY</a>
        `,
      }, {
        name: 'closed_on_monday',
        url: 'https://closedonmondaygallery.com/',
        description: `
          <strong>CLOSED ON MONDAY</strong> CO-FOUNDER<br />
          virtual gallery / 2019-present<br /><br />
          CLOSED ON MONDAY is a virtual gallery featuring audio-visual works by Sydney-based artists<br /><br />
          <a href='https://closedonmondaygallery.com/' target='_blank'>visit gallery</a>
        `,
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
        }
      }, {
        name: 'toxotes',
        character: 'X',
        desciption: `
          <strong>TOXOTES</strong> ANIMATOR<br />
          music video / 2019<br /><br />
          music video for TOXOTES by ZHE NHIR
        `,
        videos: [
          'https://www.youtube.com/embed/7Rc7XGBK6sg',
        ]
      }, {
        name: 'mcncs',
        url: 'http://www.mcncs.io/',
        description: `
          <strong>MCNCS</strong> DEVELOPER<br />
          website / 2018<br /><br />
          pre-launch branding and microsite for MECHANICS festival<br /><br />
          <a href='http://www.mcncs.io/' target='_blank'>visit MCNCS</a>
        `,
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
        name: 'we_are_city_plaza',
        url: 'https://wearecityplaza.net/',
        description: `
          <strong>WE ARE CITY PLAZA</strong> DEVELOPER<br />
          exhibition website / 2018<br /><br />
          WE ARE CITY PLAZA is a photographic exhibition centred around the CITY PLAZA refugee housing project in ATHENS, GREECE<br /><br />
          <a href='https://wearecityplaza.net/' target='_blank'>visit site</a>
        `,
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
        name:'the_pixies',
        character: '?',
        description: `
          <strong>TENEMENT SONG</strong> ANIMATOR<br />
          music video / 2016<br /><br />
          music video for TENEMENT SONG by THE PIXIES<br /><br />
          <a href='https://www.youtube.com/watch?v=-SLgXBLQA2M' target='_blank'>on youtube</a>
        `,
        videos: ['https://www.youtube.com/watch?v=-SLgXBLQA2M']
      }, {
        name:'dongles',
        character: 'D',
        description: `
          <strong>DONGLES</strong> ANIMATOR<br />
          animation / 2019<br /><br />
          self portrait and proof-of-concept looping video animation<br /><br />
          <a href='https://www.youtube.com/watch?v=CQv_DFBlqEU' target='_blank'>on youtube</a>
        `,
        videos: [
          'https://www.youtube.com/embed/CQv_DFBlqEU'
        ]
      }, {
        name: 'pencil_mmo',
        description: `
          <strong>PENCIL MMO</strong> DEVELOPER<br />
          MMO art game / 2020<br /><br />
          massively multiplayer drawing game / proof-of-concept<br />
        `,
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
      }, {
        name: 'misc.',
        character: '*',
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
