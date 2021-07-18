/** Config */

const Config = {
  Scene: {
    cascade: 70,
    projects: [
      {
        name: 'preppers',
        icon: 'PPP',
        date: '2020',
        url: 'https://preppers.gallery/',
        images: [
          'img/example.jpg',
          'img/example.jpg',
          'img/example.jpg',
        ],
        videos: [
          'https://www.youtube.com/watch?v=-SLgXBLQA2M',
        ],
        description: 'PRP',
      }, {
        name: 'epoch_wars',
        icon: 'WAR',
        date: '2021',
        url: 'https://epoch-wars.com/',
        description: 'website for arts org. Pony Express',
      }, {
        name: 'panic_buy',
        icon: 'PNC',
        date: '2020',
        url: 'https://panic-buy-online.com/'
      }, {
        name: 'closed_on_monday',
        icon: 'COM',
        date: '2020',
        url: 'https://closedonmondaygallery.com/',
        description: 'virtual gallery',
      }, {
        name: 'toxotes',
        icon: 'TOX',
        date: '2020',
        videos: [
          'https://www.youtube.com/watch?v=7Rc7XGBK6sg',
        ]
      },
      {name:'mcncs', icon: 'MCN', date: '2018', url:'http://www.mcncs.io/'},
      {name:'we_are_city_plaza', icon:'ZAA', date: '2020', url: 'https://wearecityplaza.net/'},
      {name:'the_pixies', icon:'PIX', date: '2020', videos: ['https://www.youtube.com/watch?v=-SLgXBLQA2M']},
      {name:'dongles', icon:'DOG', date: '2020', videos: ['https://www.youtube.com/watch?v=CQv_DFBlqEU']},
      {name:'delaval_film', icon:'DLV', date: '2020', url: 'https://www.delavalfilm.com/'},
      {name:'pixelsort', icon:'SRT', date: '2020',},
      {name:'pencil_mmo', icon:'MMO', date: '2020',}
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
    lineOfSightObjects: [
      // { position: [0, 3.125, -1], dimensions: [1, 6.25, 14.5], }
    ]
  },
};

export default Config;
