import Observable from './util/Observable';

class SampleModelObject {

  constructor() {
    this.observable = new Observable();
    this.foo = "";
    this.bar = "fizzbuzz";
    this.n = 3;
    this.data = [2,3,5,7,11];
    this.unrenderedValue = 10;
  }

  subscribe(fn) {
    return this.observable.subscribe(fn);
  }

  incrementN() {
    this.n += 1;
    this.observable.trigger();
  }

  setUnrenderedValue(val) {
    this.unrenderedValue = val;
    this.observable.trigger();
  }

}

export default function generateSampleModelObject() {
  return new SampleModelObject();
}
