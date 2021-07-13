/** Renderer */

import Config from './config';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class Renderer {
  constructor() {
    const aa = Config.Renderer.lowQuality ? false : true;
    this.renderer = new THREE.WebGLRenderer({antialias: aa, alpha: true});
    this.renderer.outputEncoding = THREE.GammaEncoding;
    this.renderer.gammaFactor = 2.2;
    this.renderer.setClearColor(0x0, 0);
    document.querySelector('#canvas-target').appendChild(this.renderer.domElement);
  }

  bind(root) {
    this.ref = {};
    this.ref.scene = root.modules.scene.scene;
    this.ref.camera = root.modules.camera.camera;

    // effect composer
    this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.ref.scene, this.ref.camera));
		//this.afterimagePass = new AfterimagePass();
    //this.afterimagePass.uniforms.damp.value = 1;//0.98125;
		//this.composer.addPass(this.afterimagePass);

    // enable
    this.composerEnabled = false;
  }

  resize() {
    let dpr = Math.max(Config.Renderer.devicePixelRatioMin, window.devicePixelRatio);
    this.size = {x: window.innerWidth*dpr, y: window.innerHeight*dpr};
    this.renderer.setSize(this.size.x, this.size.y);
    this.composer.setSize(this.size.x, this.size.y);
    console.log(this.size);
  }

  getRenderer() {
    return this.renderer;
  }

  render(delta) {
    if (this.composerEnabled) {
      this.composer.render(this.ref.scene, this.ref.camera);
    } else {
      this.renderer.render(this.ref.scene, this.ref.camera);
    }
  }
}

export default Renderer;
