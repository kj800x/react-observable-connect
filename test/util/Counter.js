/**
 * A simple counter which can count up and report it's current value.
 * Used to count the number of times render was called.
 */
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