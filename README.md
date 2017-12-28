# [react-observable-connect](https://github.com/kj800x/react-observable-connect) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kj800x/react-observable-connect/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-observable-connect.svg?style=flat)](https://www.npmjs.com/package/react-observable-connect)  [![Build Status](https://travis-ci.org/kj800x/react-observable-connect.svg?branch=master)](https://travis-ci.org/kj800x/react-observable-connect)
react-observable-connect provides a way for you to connect any observable object (one with a valid subscribe method) to the props of one of your react components.

You can think of this similar to react-redux's connect function, but it allows you to use any subscribable object as the source instead of just the redux store. Also, different react components throughout your app can subscribe to different observables.

## Installation
react-observable-connect is available under the react-observable-connect package on npm.

`npm install --save react-observable-connect`

## Usage
**This isn't up to date with the current Observable interface, correcting that is issue #5**

Recall that an Observable is any object which has a subscribe method which receives a callback and returns an unsubscribe method. Anytime part of the state of the observable object changes, the callback passed to the subscribe method gets called. Once the unsubscribe method is called, the callback is unsubscribed and isn't called anymore.

Recall the behavior of an observable with the following example:
```JavaScript
// Model matches the Observable interface
const model = new Model();

function printModelFoo() {
  console.log(model.getFoo());
}

// When anything in the model changes, the value of foo in the model will be printed to the console
const unsubscribe = model.subscribe(printModelFoo);

// Change the model using one of the methods on it
model.setFoo("foo", "bar");
// console output: bar

model.setFoo("foo", "fizzbuzz");
// console output: fizzbuzz

// Although foo wasn't changed, the subscription was still updated
model.setFoo("bar", "bat");
// console output: fizzbuzz

unsubscribe();

model.setFoo("foo", "bat");
// There is no console output because we have unsubscribed from the observable
```

Now there should be a way to connect the state of an Observable with the props of a React component. That's where this library comes in.

If you define functions `objToValueProps` and `objToFuncProps`, you can link the props of a React component with any observable object. Anytime the observable object changes,
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

function SmartModelView({model}) {
  return connect(model, objToValueProps, objToFuncProps)(DumbModelView)
}
```

Now SmartModelView is a component which takes in the model to render as a prop. You can use it like so:

````jsx harmony
function MainDiv() {
  return <SmartModelView model={model} /> 
}
````

<!-- TODO: show how you can retrieve the model from a store, so the smart model view just needs the id of the model in the store -->

<!--### Examples-->

## Contributing
Feel free to send pull requests. Make sure that you have written test cases for your changes if possible.

### License
react-observable-connect is [MIT licensed](./LICENSE).