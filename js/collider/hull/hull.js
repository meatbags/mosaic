/** Convex Hull */

import * as THREE from 'three';
import { ConvexHull } from 'three/examples/jsm/math/ConvexHull';

class Hull extends ConvexHull {
  constructor() {
    super();
    this.helperMesh = null;
  }

  setFromBufferAttribute(buffer) {
    const points = [];
    for (let i=0, len=buffer.length; i<len; i+=3) {
      points.push([buffer[i], buffer[i+1], buffer[i+2]]);
    }
    this.setFromPoints(points);
  }

  getHelperMesh() {
    if (this.helperMesh) {
      return this.helperMesh;
    }

    // get vertices and normals
    const vertices = [];
    const normals = [];

    for (var i=0, len=this.faces.length; i<len; i++) {
      const face = this.faces[i];
  		let edge = face.edge;
  		do {
  			const point = edge.head().point;
  			vertices.push(point.x, point.y, point.z);
  			normals.push(face.normal.x, face.normal.y, face.normal.z);
  			edge = edge.next;
  		} while (edge !== face.edge);
    }
    
    // create mesh
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    geo.setAttribute('normal',  new Float32BufferAttribute(normals, 3));
    const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.helperMesh = new THREE.Mesh(geo, wireMat);

    return this.helperMesh;
  }
}

export default ConvexHull;
