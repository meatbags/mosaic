/** Perlin noise custom function */

const PERLIN_PERSISTENCE = 0.75;

const mod289 = arr => {
  return arr.map(x => x - Math.floor(x * (1.0 / 289.0)) * 289.0);
};

const permute = arr => {
  const res = arr.map(x => ((x * 34.0) + 1.0) * x);
  return mod289(res);
};

const taylorInvSqrt = arr => {
  return arr.map(x => 1.79284291400159 - 0.85373472095314 * x);
};

// GLSL analogues
const dot = (a, b) => {
  let res = 0;
  for (let i=0; i<a.length; i++) {
    res += a[i] * b[i];
  }
  return res;
};
const mult = (arr, v) => {
  if (!Array.isArray(v)) {
    return arr.map(x => x * v);
  } else {
    return arr.map((x, i) => x * v[i]);
  }
};
const floor = (arr) => { return arr.map(x => Math.floor(x)); };
const abs = (arr) => { return arr.map(x => Math.abs(x)); };
const add = (a, b) => { return a.map((x, i) => x + b[i]); };
const sub = (a, b) => { return a.map((x, i) => x - b[i]); };
// 0.0 is returned if x[i] < edge[i], and 1.0 is returned otherwise.
const step = (edge, x) => { return x.map((v, i) => v < edge[i] ? 0 : 1); }
const min = (a, b) => { return a.map((x, i) => Math.min(x, b[i])); };
const max = (a, b) => { return a.map((x, i) => Math.max(x, b[i])); };
const vec3 = v => { return [v,v,v]; };
const vec4 = v => { return [v,v,v,v]; };

const C = [1/6, 1/3]; //const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
const D = [0, 0.5, 1, 2]; //const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
const n_ = 1/7; //const float n_ = 1.0 / 7.0;
const Cyyy = vec3(C[1]);
const Cxxx = vec3(C[0]);
const Dyyy = vec3(D[1]);
const Dwyz = [D[3], D[1], D[2]];
const Dxzx = [D[0], D[2], D[0]];

const sNoise = v => {
  // vec3
  let i = floor(add(v, vec3(dot(v, Cyyy)))); //vec3 i = floor(v + dot(v, C.yyy));
  const x0 = add(sub(v, i), vec3(dot(i, Cxxx))); //vec3 x0 = v - i + dot(i, C.xxx);
  const x0yzx = [x0[1], x0[2], x0[0]];
  const x0xyz = [x0[0], x0[1], x0[2]];
  const g = step(x0yzx, x0xyz); //vec3 g = step(x0.yzx, x0.xyz);
  const l = [1-g[0], 1-g[1], 1-g[2]]; //vec3 l = 1.0 - g;
  const lzxy = [l[2], l[0], l[1]];
  const i1 = min(g, lzxy); //vec3 i1 = min(g.xyz, l.zxy);
  const i2 = max(g, lzxy); //vec3 i2 = max(g.xyz, l.zxy);
  const x1 = add(sub(x0, i1), Cxxx); //vec3 x1 = x0 - i1 + C.xxx;
  const x2 = add(sub(x0, i2), Cyyy); //vec3 x2 = x0 - i2 + C.yyy;
  const x3 = sub(x0, Dyyy); //vec3 x3 = x0 - D.yyy;
  i = mod289(i); //i = mod289(i);

  // vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  const ix = i[0];
  const iy = i[1];
  const iz = i[2];
  const perm1 = permute(           [0+iz, i1[2]+iz, i2[2]+iz, 1+iz]);
  const perm2 = permute(add(perm1, [0+iy, i1[1]+iy, i2[1]+iy, 1+iy]));
  const p =     permute(add(perm2, [0+ix, i1[0]+ix, i2[0]+ix, 1+ix]));

  //vec3 ns = n_ * D.wyz - D.xzx;
  const ns = sub(mult(Dwyz, n_), Dxzx);

  // vec4
  const nsx = ns[0];
  const nsy = ns[1];
  const nsz = ns[2];
  const nsz2 = nsz * nsz;
  const pnsz = [p[0] * nsz2, p[1] * nsz2, p[2] * nsz2, p[3] * nsz2];
  const j = sub(p, mult(floor(pnsz), 49)); //vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  const x_ = floor(mult(j, nsz)); //vec4 x_ = floor(j * ns.z);
  const y_ = floor(sub(j, mult(x_, 7))); //vec4 y_ = floor(j - 7.0 * x_);
  const nsyyyy = vec4(nsy);
  const x = add(mult(x_, nsx), nsyyyy); //vec4 x = x_ * ns.x + ns.yyyy;
  const y = add(mult(y_, nsx), nsyyyy); //vec4 y = y_ * ns.x + ns.yyyy;
  const h = [
    1.0 - Math.abs(x[0]) - Math.abs(y[0]),
    1.0 - Math.abs(x[1]) - Math.abs(y[1]),
    1.0 - Math.abs(x[2]) - Math.abs(y[2]),
    1.0 - Math.abs(x[3]) - Math.abs(y[3])
  ]; //vec4 h = 1.0 - abs(x) - abs(y);
  const b0 = [x[0], x[1], y[0], y[1]]; //vec4 b0 = vec4(x.xy, y.xy);
  const b1 = [x[2], x[3], y[2], y[3]]; //vec4 b1 = vec4(x.zw, y.zw);
  const s0 = add(mult(floor(b0), 2), vec4(1)); //vec4 s0 = floor(b0) * 2.0 + 1.0;
  const s1 = add(mult(floor(b1), 2), vec4(1)); //vec4 s1 = floor(b1) * 2.0 + 1.0;
  const sh = mult(step(h, [0,0,0,0]), -1); //vec4 sh = -step(h, vec4(0.0));
  const b0xzyw = [b0[0], b0[2], b0[1], b0[3]];
  const b1xzyw = [b1[0], b1[2], b1[1], b1[3]];
  const s0xzyw = [s0[0], s0[2], s0[1], s0[3]];
  const s1xzyw = [s1[0], s1[2], s1[1], s1[3]];
  const shxxyy = [sh[0], sh[0], sh[1], sh[1]];
  const shzzww = [sh[2], sh[2], sh[3], sh[3]];
  const a0 = add(b0xzyw, mult(s0xzyw, shxxyy)); //vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  const a1 = add(b1xzyw, mult(s1xzyw, shzzww)); //vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  // vec3
  let p0 = [a0[0], a0[1], h[0]]; //vec3 p0 = vec3(a0.xy,h.x);
  let p1 = [a0[2], a0[3], h[1]]; //vec3 p1 = vec3(a0.zw,h.y);
  let p2 = [a1[0], a1[1], h[2]]; //vec3 p2 = vec3(a1.xy,h.z);
  let p3 = [a1[2], a1[3], h[3]]; //vec3 p3 = vec3(a1.zw,h.w);

  // vec4
  // vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  const norm = taylorInvSqrt([dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)]);
  p0 = mult(p0, norm[0]); //p0 *= norm.x;
  p1 = mult(p1, norm[1]); //p1 *= norm.y;
  p2 = mult(p2, norm[2]); //p2 *= norm.z;
  p3 = mult(p3, norm[3]); //p3 *= norm.w;
  //vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  let m = max(sub(vec4(0.6), [dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)]), vec4(0));
  m = mult(m, m); //m = m * m;

  //return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  const res = 42 * dot(mult(m, m), [dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)]);
  return res;
};

const PerlinNoise = (x, y, z, octaves) => {
  let total = 0.0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxValue = 0.0;
  for (let i=0; i<octaves; i++) {
    total += sNoise(mult([x, y, z], frequency)) * amplitude;
    maxValue += amplitude;
    amplitude *= PERLIN_PERSISTENCE;
    frequency *= 2.0;
  }
  return ((total / maxValue) + 1) / 2;
};

export default PerlinNoise;
