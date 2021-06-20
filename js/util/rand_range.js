/** Get random int in range */

const RandRange = (min, max) => {
  return Math.round(min + Math.random() * (max - min));
}

export default RandRange;
