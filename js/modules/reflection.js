/** Cubemap reflection */

import * as THREE from 'three';

class Reflection {
  constructor(material) {
    this.material = material;
    this.count = 0;

    // cube 1
    this.cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
			format: THREE.RGBFormat,
			generateMipmaps: true,
			minFilter: THREE.LinearMipmapLinearFilter,
			encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame
		});
    this.cubeCamera1 = new THREE.CubeCamera(1, 1000, this.cubeRenderTarget1);

    // cube 2
    this.cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(256, {
			format: THREE.RGBFormat,
			generateMipmaps: true,
			minFilter: THREE.LinearMipmapLinearFilter,
			encoding: THREE.sRGBEncoding
    });
    this.cubeCamera2 = new THREE.CubeCamera(1, 1000, this.cubeRenderTarget2);

    this.material.envMap = this.cubeRenderTarget2.texture;
    this.material.combine = THREE.MultiplyOperation;
    this.material.reflectivity = 1;
  }

  update(renderer, scene) {
    this.count++;
    // ping pong to prevent feedback loop
    if (this.count % 2 == 0) {
      this.cubeCamera1.update(renderer, scene);
      this.material.envMap = this.cubeRenderTarget1.texture;
    } else {
      this.cubeCamera2.update(renderer, scene);
      this.material.envMap = this.cubeRenderTarget2.texture;
    }
  }
}

export default Reflection;
