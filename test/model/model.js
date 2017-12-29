import {Observable} from '../../index';

// This model is an (minimal) observable because it:
// - Contains an observable as a field
// - Delegates its subscribe method to the subscribe method of the observable.
// - Calls this.observable.trigger() anytime the state changes.
// Although this doesn't match the complete observable spec, it matches the requirements of react-observable-connect
class Model {

  constructor() {
    this.observable = new Observable();
    this.foo = "";
    this.bar = "fizzbuzz";
    this.n = 3;
    this.data = [2,3,5,7,11];
    this.unrenderedValue = 10;
  }

  // I believe I could have also written:
  //   this.subscribe = this.observable.subscribe.bind(this.observable)
  // in the constructor instead of including this method.
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

export default function generateSampleModel() {
  return new Model();
}
