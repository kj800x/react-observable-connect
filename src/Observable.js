/**
 * This is a bare-bones implementation of the Observable interface,
 * but it implements enough of it to make react-observable-connect work.
 *
 * I created this because there wasn't an obvious way to make objects
 * observable with respect to their state changes with any of the current observable
 * libraries (at least as far as I could tell). If anyone reading this knows how
 * to do something like this using those libraries (refer to the example I mention
 * below), please leave a comment in GitHub issue #5 or otherwise drop me a line.
 *
 * If you have no need for a more complete Observable implementation, you can
 * make your models observable by giving them an instance of this class, proxying
 * the subscribe method, and calling trigger whenever your model's state changes.
 *
 * For a complete example of how you can use this, take a look at /test/model/model.js
 * at https://github.com/kj800x/react-observable-connect.
 *
 * Note that this code is licensed under the MIT License so you are free to copy
 * and create a more complete implementation of an Observable if you would like.
 */
export default class Observable {
  constructor() {
    this.subscriptions = [];
  }

  trigger() {
    this.subscriptions.forEach(e => e());
  }

  subscribe(func) {
    this.subscriptions.push(func);
    return {
      "unsubscribe":
        () => {
          this.subscriptions.indexOf(func) !== -1 &&
          this.subscriptions.splice(this.subscriptions.indexOf(func), 1)
        }
    }
  }
}
