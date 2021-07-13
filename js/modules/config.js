/** Config */

const Config = {
  Renderer: {
    lowQuality: false,
    devicePixelRatioMin: 2,
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
    lineOfSightObjects: [{
      position: [0, 3.125, -1],
      dimensions: [1, 6.25, 14.5],
    }]
  },
};

export default Config;
