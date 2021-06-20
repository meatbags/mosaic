/** Clamp */

const Clamp = (val, min, max) => {
  return Math.max(min, Math.min(max, val));
};

export default Clamp;
