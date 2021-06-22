/** Camera controls */

import * as THREE from 'three';
import Config from '../modules/config';
import Blend from '../util/blend';
import Clamp from '../util/clamp';
import IsMobileDevice from '../util/is_mobile_device';
import MinAngleBetween from '../util/min_angle_between';
import CreateElement from '../util/create_element';
import Mouse from '../ui/mouse';
import Keyboard from '../ui/keyboard';
import Animation from './animation';
import RoundToPlaces from '../util/round_to_places';

class Controls {
  constructor() {
    // settings
    this.blendPosition = Config.Controls.blendPosition;
    this.blendRotation = Config.Controls.blendRotation;
    this.height = Config.Camera.height;
    this.speed = Config.Controls.speed;
    this.speedNoclip = Config.Controls.speedNoclip;
    this.maxPitch = Config.Controls.maxPitch;
    this.minPitch = Config.Controls.minPitch;
    this.isMobile = IsMobileDevice();

    // containers
    this.keys = {up: false, down: false, left: false, right: false, jump: false, noclip: false};
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      target: new THREE.Vector3(),
      motion: new THREE.Vector3(),
      previous: new THREE.Vector3(),
      changed: true,
    };
    let pitch = Config.Controls.rotation.pitch;
    let yaw = Config.Controls.rotation.yaw;
    this.rotation = {
      pitch: pitch,
      yaw: yaw,
      origin: {pitch: pitch, yaw: yaw},
      target: {pitch: pitch, yaw: yaw},
      cache: {pitch: pitch, yaw: yaw},
      scale: {pitch: pitch, yaw: yaw},
      previous: {pitch: -1, yaw: -1},
      changed: true,
    };
    this.animation = null;

    // log
    console.log('[Controls] initialised');
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene;
    this.ref.camera = root.modules.camera.getCamera();
    this.ref.renderer = root.modules.renderer;
    this.ref.domTarget = this.ref.renderer.renderer.domElement;

    // set initial position
    const x = this.ref.camera.position.x;
    const y = this.ref.camera.position.y;
    const z = this.ref.camera.position.z;
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.position.target.set(x, y, z);

    // set initial rotation
    /*
    const pitch = this.ref.camera.rotation.x;
    const yaw = this.ref.camera.rotation.y;
    this.rotation.pitch = pitch;
    this.rotation.yaw = yaw;
    this.rotation.target.pitch = pitch;
    this.rotation.target.yaw = yaw;
    */

    // init mouse/ keyboard
    this.mouse = new Mouse({
      domTarget: this.ref.domTarget,
      onMouseDown: evt => { this.onMouseDown(evt); },
      onMouseMove: evt => { this.onMouseMove(evt); },
      onMouseUp: evt => { this.onMouseUp(evt); },
      onMouseLeave: evt => { this.onMouseLeave(evt); },
    });
    this.keyboard = new Keyboard((key) => {
      this.onKeyboard(key);
    });

    // add mobile controls
    /*
    this.el = CreateElement({
      class: 'mobile-controls',
      childNodes: [{
        class: 'mobile-controls__inner',
        childNodes: [
          { class: 'mobile-controls__control mobile-controls__control--left', },
          { class: 'mobile-controls__control mobile-controls__control--right', },
          { class: 'mobile-controls__control mobile-controls__control--up', },
          { class: 'mobile-controls__control mobile-controls__control--down', },
        ]
      }]
    });
    if (!this.isMobile) {
      this.el.classList.add('hidden');
    }
    document.querySelector('body').appendChild(this.el);
    */
  }

  onMouseDown(evt) {
    // calculate working area
    const rect = this.ref.domTarget.getBoundingClientRect();
    this.centre = {x: rect.width / 2, y: rect.height / 2,};

    // cache rotation
    this.rotation.origin.yaw = this.rotation.yaw;
    this.rotation.origin.pitch = this.rotation.pitch;

    // calculate rotation size basis
    this.rotation.scale.pitch = (this.ref.camera.fov / 2) * (Math.PI / 180);
    this.rotation.scale.yaw = this.rotation.scale.pitch * (rect.width / rect.height);

    // scale for mobile
    if (this.isMobile) {
      let portrait = window.innerWidth < window.innerHeight;
      this.rotation.scale.yaw *= portrait ? 1.5 : 1;
      this.rotation.scale.pitch *= portrait ? 1 : 1.25;
    }

    // set touchmove timeout
    this.touchMoveTimeout = false;
    setTimeout(() => {
      if (this.mouse.active) {
        this.touchMoveTimeout = true;
      }
    }, 100);
  }

  onMouseMove(evt) {
    if (this.mouse.active) {
      // update player rotation
      const dyaw = (this.mouse.delta.x / this.centre.x) * this.rotation.scale.yaw;
      const dpitch = (this.mouse.delta.y / this.centre.y) * this.rotation.scale.pitch;
      const yaw = this.rotation.origin.yaw + dyaw;
      const pitch = Clamp(this.rotation.origin.pitch + dpitch, this.minPitch, this.maxPitch);

      // reset mouse.y origin is clamped
      if (pitch === this.minPitch || pitch === this.maxPitch) {
        this.mouse.origin.y = evt.clientY - this.mouse.top;
        this.rotation.origin.pitch = pitch;
      }

      // set target
      this.rotation.target.pitch = pitch;
      this.rotation.target.yaw = yaw;
    }
  }

  onMouseUp(evt) {
    const dt = performance.now() - this.timestamp;
    const dx = Math.hypot(this.mouse.delta.x, this.mouse.delta.y);
    if (dt < this.clickThreshold && dx < window.innerWidth * this.threshold.mouseDelta) {
      if (this.isMobile) {
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  }

  onMouseLeave() {}

  onKeyboard(key) {
    switch (key) {
      case 'a': case 'A': case 'ArrowLeft':
        this.keys.left = this.keyboard.keys[key];
        break;
      case 'd': case 'D': case 'ArrowRight':
        this.keys.right = this.keyboard.keys[key];
        break;
      case 'w': case 'W': case 'ArrowUp':
        this.keys.up = this.keyboard.keys[key];
        break;
      case 's': case 'S': case 'ArrowDown':
        this.keys.down = this.keyboard.keys[key];
        break;
      case ' ':
        this.keys.jump = this.keyboard.keys[key];
        break;
      case 'x': case 'X':
        // toggle noclip on ctrl+x
        if (this.keyboard.keys['x'] || this.keyboard.keys['X']) {
          if (this.keyboard.isControl()) {
            this.keys.noclip = this.keys.noclip === false;
            console.log('[Controls] noclip:', this.keys.noclip);
          }
          this.keyboard.release('x');
          this.keyboard.release('X');
        }
        break;
      default:
        break;
    }
  }

  goToPosition(position, target) {
    if (this.animation !== null) {
      console.log('[Controls] animation already in progress');
      return;
    }

    // position
    let from = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
    let to = position.clone();
    let duration = Math.max(0.5, from.distanceTo(to) / 4);

    // calc rotation deltas
    let fromPitch = this.rotation.pitch;
    let fromYaw = this.rotation.yaw;
    let temp = to.clone();
    temp.y += this.height;
    let dist = temp.distanceTo(target);
    let toPitch = Math.atan2(target.y - this.height, dist);
    let toYaw = -Math.atan2(target.z - position.z, target.x - position.x) - Math.PI/2;
    let deltaYaw = MinAngleBetween(fromYaw, toYaw);
    toYaw = fromYaw + deltaYaw;
    duration = Math.max(duration, Math.abs(deltaYaw) / (Math.PI * 0.75));

    this.animation = new Animation({
      duration: duration,
      callback: t => {
        let ease = t < 0.5 ? 2*t*t : 1-Math.pow(-2*t+2, 2)/2;
        this.position.x = this.position.target.x = Blend(from.x, to.x, ease);
        this.position.y = this.position.target.y = Blend(from.y, to.y, ease);
        this.position.z = this.position.target.z = Blend(from.z, to.z, ease);
        this.rotation.pitch = this.rotation.target.pitch = Blend(fromPitch, toPitch, ease);
        this.rotation.yaw = this.rotation.target.yaw = Blend(fromYaw, toYaw, ease);
      }
    });
  }

  updatePosition(delta) {
    if (this.keys.up || this.keys.down || this.keys.left || this.keys.right) {
      const speed = (this.keys.noclip) ? this.speedNoclip * (1 - Math.abs(Math.sin(this.rotation.pitch))) : this.speed;
      const ws = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
      const ad = ((this.keys.left) ? 1 : 0) + ((this.keys.right) ? -1 : 0);
      const scale = ws != 0 && ad != 0 ? 0.7071 : 1;
      this.position.motion.x = (Math.sin(this.rotation.yaw) * speed * ws + Math.sin(this.rotation.yaw + Math.PI / 2) * speed * ad) * scale * -1;
      this.position.motion.z = (Math.cos(this.rotation.yaw) * speed * ws + Math.cos(this.rotation.yaw + Math.PI / 2) * speed * ad) * scale * -1;
    } else {
      this.position.motion.x = 0;
      this.position.motion.z = 0;
    }

    // noclip
    if (this.keys.noclip) {
      if (this.keys.up || this.keys.down) {
        const d = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
        this.position.motion.y = Math.sin(this.rotation.target.pitch) * d * this.speedNoclip;
      } else {
        this.position.motion.y = 0;
      }
    }

    // set position
    this.position.target.x += this.position.motion.x * delta;
    this.position.target.y += this.position.motion.y * delta;
    this.position.target.z += this.position.motion.z * delta;
    if (!this.keys.noclip) {
      this.position.target.y = 0;
    }
    this.position.x = Blend(this.position.x, this.position.target.x, this.blendPosition);
    this.position.y = Blend(this.position.y, this.position.target.y, this.blendPosition);
    this.position.z = Blend(this.position.z, this.position.target.z, this.blendPosition);
  }

  updateRotation() {
    this.rotation.yaw += MinAngleBetween(this.rotation.yaw, this.rotation.target.yaw) * this.blendRotation;
    this.rotation.pitch = Blend(this.rotation.pitch, this.rotation.target.pitch, this.blendRotation);
  }

  changed() {
    return this.position.changed || this.rotation.changed;
  }

  update(delta) {
    // apply animation
    if (this.animation) {
      this.animation.update(delta);
      if (this.animation.isComplete()) {
        console.log('[Controls] animation complete');
        this.animation = null;
      }

    // apply mkb input
    } else {
      this.updatePosition(delta);
      this.updateRotation();
    }

    // position
    this.ref.camera.position.x = this.position.x;
    this.ref.camera.position.y = this.position.y + this.height;
    this.ref.camera.position.z = this.position.z;

    // rotation
    this.ref.camera.rotation.x = this.rotation.pitch;
    this.ref.camera.rotation.y = this.rotation.yaw;

    // set changed flag
    this.position.changed = this.position.x != this.position.previous.x || this.position.y != this.position.previous.y || this.position.z != this.position.previous.z;
    this.rotation.changed = this.rotation.pitch != this.rotation.previous.pitch || this.rotation.yaw != this.rotation.previous.yaw;
    this.position.previous.set(this.position.x, this.position.y, this.position.z);
    this.rotation.previous.pitch = this.rotation.pitch;
    this.rotation.previous.yaw = this.rotation.yaw;

    // dev
    let dev = document.querySelector('#dev');
    if (dev) {
      let pitch = RoundToPlaces(this.rotation.pitch, 3);
      let yaw = RoundToPlaces(this.rotation.yaw, 3);
      let x = RoundToPlaces(this.position.x, 2);
      let y = RoundToPlaces(this.position.y, 2);
      let z = RoundToPlaces(this.position.z, 2);
      let html = `pitch ${pitch}<br />yaw ${yaw}<br />x ${x}<br /> y ${y}<br /> z ${z}`;
      dev.innerHTML = html;
    }
  }
}

export default Controls;
