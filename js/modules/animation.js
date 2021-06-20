/** Animation */

class Animation {
  constructor(params) {
    this.active = true;
    this.callback = params.callback;
    this.time = {
      age: 0,
      t: 0,
      duration: params.duration,
    };
  }

  isComplete() {
    return this.active == false;
  }

  update(delta) {
    if (!this.active) {
      return;
    }

    // update timer
    this.time.age += delta;
    if (this.time.age >= this.time.duration) {
      this.active = false;
      this.time.age = this.time.duration;
    }

    // run callback
    this.time.t = this.time.age / this.time.duration;
    this.callback(this.time.t);
  }
}

export default Animation;
