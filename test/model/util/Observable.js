// Implement a minimalist observable object, which has only what we need to test our method
export default class Observable {
  constructor() {
    this.subscriptions = [];
  }

  trigger() {
    this.subscriptions.forEach(e => e());
  }

  subscribe(func) {
    this.subscriptions.push(func);
    return () => {
      this.subscriptions.indexOf(func) !== -1 &&
      this.subscriptions.splice(this.subscriptions.indexOf(func), 1)
    }
  }
}
