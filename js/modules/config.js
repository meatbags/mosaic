/** Config */

const Config = {
  Renderer: {
    lowQuality: false,
    devicePixelRatioMin: 2,
  },
  Camera: {
    fov: 65,
    height: 0, // 2.5
    position: {x: 0, y: 0, z: -10},
  },
  Controls: {
    speed: 5,
    speedNoclip: 15,
    maxPitch: Math.PI / 8,
    minPitch: -Math.PI / 8,
    blendPosition: 0.25,
    blendRotation: 0.25,
    rotation: {
      yaw: -Math.PI, //Math.PI * 0.655,
      pitch: 0,
    }
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
    lineOfSightObjects: [{
      position: [0, 3.125, -1],
      dimensions: [1, 6.25, 14.5],
    }]
  },
};

export default Config;
