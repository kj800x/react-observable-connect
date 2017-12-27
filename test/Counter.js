export default class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
  }

  getValue() {
    return this.count;
  }
}