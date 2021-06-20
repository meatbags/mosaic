/** Config */

const Config = {
  Renderer: {
    lowQuality: false,
  },
  Camera: {
    fov: 65,
    height: 2.5,
  },
  Controls: {
    speed: 5,
    speedNoclip: 15,
    maxPitch: Math.PI / 8,
    minPitch: -Math.PI / 8,
    blendPosition: 0.25,
    blendRotation: 0.25,
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
