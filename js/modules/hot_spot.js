/** Hotspot */

import * as THREE from 'three';
import Config from './config';
import ScreenSpace from '../ui/screen_space';
import IsMobileDevice from '../util/is_mobile_device';
import MinAngleBetween from '../util/min_angle_between';
import CreateElement from '../util/create_element';

class HotSpot {
  constructor(params) {
    this.ref = {};
    this.ref.camera = params.camera;

    // state
    this.state = {
      position: params.position,
      onScreen: false,
      hasLineOfSight: false,
      insideActiveThreshold: false,
      insideEnlargedThreshold: false,
      distanceToCamera: -1,
      visible: false,
      screen: {
        position: null,
        x: -1,
        y: -1,
      },
    };

    // screenspace
    this.screenSpace = new ScreenSpace({
      camera: this.ref.camera,
      position: this.state.position
    });

    // raycast collisions
    this.raycaster = new THREE.Raycaster();
    this.lineOfSightObjects = Config.HotSpot.lineOfSightObjects.map(obj => {
      let geo = new THREE.BoxBufferGeometry(obj.dimensions[0], obj.dimensions[1], obj.dimensions[2]);
      let mat = new THREE.MeshBasicMaterial({});
      let mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(obj.position[0], obj.position[1], obj.position[2]);
      mesh.updateMatrix();
      geo.applyMatrix4(mesh.matrix);
      mesh.position.set(0, 0, 0);
      mesh.updateMatrix();
      return mesh;
    });
  }

  hasLineOfSight() {
    // set raycaster
    const origin = this.ref.camera.position;
    const v = new THREE.Vector3();
    v.copy(this.state.position);
    v.sub(origin);
    const distance = v.length();
    v.normalize();
    this.raycaster.set(origin, v);
    const epsilon = 0.125;

    // check raycaster
    const intersects = this.raycaster.intersectObjects(this.lineOfSightObjects);
    for (let i=0; i<intersects.length; i++) {
      if (intersects[i].distance + epsilon < distance) {
        return false;
      }
    }

    return true;
  }

  update(delta) {
    // update screenspace position
    this.screenSpace.update();

    // update state
    this.state.onScreen = this.screenSpace.isOnScreen();
    this.state.hasLineOfSight = this.state.onScreen && this.hasLineOfSight();
    this.state.distanceToCamera = this.ref.camera.position.distanceTo(this.state.position);
    this.state.insideActiveThreshold = this.state.distanceToCamera <= Config.HotSpot.threshold.active;
    this.state.insideEnlargedThreshold = this.state.distanceToCamera <= Config.HotSpot.threshold.enlarge;
    this.state.visible = this.state.onScreen && this.state.hasLineOfSight && this.state.insideActiveThreshold;
    this.state.screen.position = this.screenSpace.getScreenPosition();
    this.state.screen.x = this.state.screen.position.x * window.innerWidth;
    this.state.screen.y = this.state.screen.position.y * window.innerHeight;
  }
}

export default HotSpot;
