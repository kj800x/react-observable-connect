# [react-observable-connect](https://github.com/kj800x/react-observable-connect) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kj800x/react-observable-connect/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-observable-connect.svg?style=flat)](https://www.npmjs.com/package/react-observable-connect)  [![Build Status](https://travis-ci.org/kj800x/react-observable-connect.svg?branch=master)](https://travis-ci.org/kj800x/react-observable-connect)
react-observable-connect provides a way for you to connect the state of any Observable object to the props of your React components.

You can think of this similar to react-redux's connect function, but it allows you to use any Observable object as the source instead of just the redux store. Also, different React components throughout your app can subscribe to different Observables.

## Installation
react-observable-connect is available under the react-observable-connect package on npm.

`npm install --save react-observable-connect`

## Usage
Recall that part of the Observable spec is that an Observable object has a subscribe method which receives a callback and returns an object containing an unsubscribe method. Anytime the Observable object has a status update, the callback passed to the subscribe method gets called. Once the unsubscribe method is called, the callback isn't called anymore.

The full Observable spec is more complicated than that, but any JavaScript object that matches the below interface will be compatible with this library (note that it is a subset of the interface for the full spec, [tc39/proposal-observable](https://github.com/tc39/proposal-observable))

```typescript
interface Observable {

    // Subscribes to state changes in the observable with a callback
    subscribe(onNext : Function) : Subscription;

}

interface Subscription {

    // Cancels the subscription
    unsubscribe() : void;

}
```

Recall the behavior of an Observable with the following quick example:

```javascript
// Model matches the Observable interface
const model = new Model();

function printModelFoo() {
  console.log(model.getFoo());
}

// When anything in the model changes, the value of foo in the model will be printed to the console
const subscription = model.subscribe(printModelFoo);

// Change the model using one of the methods on it
model.setFoo("bar");
// console output: bar

model.setFoo("fizzbuzz");
// console output: fizzbuzz

// Although foo wasn't changed, the subscription's callback will still be called
model.setBar("bat");
// console output: fizzbuzz

subscription.unsubscribe();

model.setFoo("bat");
// There is no console output because we have unsubscribed from the Observable
```

Now there should be a way to connect the state of an Observable with the props of a React component. That's where this library comes in.

If you define functions `objToValueProps` and `objToFuncProps`, you can link the props of a React component with any Observable object. Anytime the Observable object changes,
`objToValueProps` will be run and if the result is different than the last call, the component will be re-rendered with the new props.

```javascript
import React from 'react';
import connect from 'react-observable-connect';

function DumbModelView(props) {
  return (<div>
            <h1>Foo: {props.foo}</h1>
            <input onChange={props.updateFoo} value={props.foo} />
          </div>);
}

function objToValueProps(obj) {
  return {
    foo: obj.foo
  }
}

function objToFuncProps(obj) {
  return {
    updateFoo: function(e) {
      obj.setFoo(e.target.value);
    }
  }
}

function SmartModelView(props) {
  return connect(props.model, objToValueProps, objToFuncProps)(DumbModelView)
}
```

Now SmartModelView is a component which takes in the model to render as a prop. You can use it like so:

````jsx harmony
function MainDiv() {
  return <SmartModelView model={model} /> 
}
````

<!--### Examples-->
<!-- TODO: show how you can retrieve the model from a store, so the smart model view just needs the id of the model in the store -->
<!-- TODO: show how you can make existing models observable by adding the methods from a contained observable field -->

## Contributing
Feel free to send pull requests. Make sure that you have written test cases for your changes if possible.

### License
react-observable-connect is [MIT licensed](./LICENSE).