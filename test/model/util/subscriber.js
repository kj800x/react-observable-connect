export default class Subscriber {
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
