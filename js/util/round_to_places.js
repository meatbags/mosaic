/** Round to decimal places */

const RoundToPlaces = (x, n) => {
  let mul = Math.pow(10, n);
  return Math.round(x * mul) / mul;
};

export default RoundToPlaces;
