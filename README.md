# [react-observable-connect](https://github.com/kj800x/react-observable-connect) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/kj800x/react-observable-connect/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react-observable-connect.svg?style=flat)](https://www.npmjs.com/package/react-observable-connect)  [![Build Status](https://travis-ci.org/kj800x/react-observable-connect.svg?branch=master)](https://travis-ci.org/kj800x/react-observable-connect)
react-observable-connect provides a way for you to connect the state of any Observable object to the props of your React components.

You can think of this similar to react-redux's connect function, but it allows you to use any Observable object as the source instead of just the redux store. Also, different React components throughout your app can subscribe to different Observables.

## Installation
react-observable-connect is available under the react-observable-connect package on npm.

`npm install --save react-observable-connect`

## Usage
Recall that part of the Observable spec is that an Observable object has a subscribe method which receives a callback and returns an object containing an unsubscribe method. Anytime the Observable object has a status update, the callback passed to the subscribe method gets called. Once the unsubscribe method is called, the callback isn't called anymore.

The full Observable spec is more complicated than that, but any JavaScript object that matches the below interface will be compatible with this library (note that this is a subset of the interface for the full spec, [tc39/proposal-observable](https://github.com/tc39/proposal-observable))

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

Check out the following quick example of an Observable object's behavior:

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

In an MVC-designed app, your model is the single source of truth for data, so you want to be able to connect your models to your views so that changes in one reflect to the other.
As long as your model is Observable, this library will help you do that. Also, this library will help you make your models Observable.

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

Now SmartModelView is a React component which takes in the model to render as a prop. You can use it like so:

````jsx harmony
function MainDiv() {
  return (<div>
            <h1> Your Model: </h1>
            <SmartModelView model={model} />
          </div>)
}
````

### Using Stores
You may not want the user of your smart component to provide the model itself. Instead you can make it so that your smart component fetches the model out of a store:

````javascript
// Song objects are Observable and contain the data we want to render.
// The SONG_STORE is a store for Songs. For this example, it has a byId
// method which returns the Song object for a given song id.

import SONG_STORE from './stores/song_store';

// ... define objToValueProps, objToFuncProps, and DumbSongView here

function SmartSongView(props) {
  const song = SONG_STORE.byId(props.id);
  return connect(song, objToValueProps, objToFuncProps)(DumbSongView)
}
````

Now you can use the SmartSongView without having an instance of the model, simply by providing the song's id.

````jsx harmony
function MainDiv() {
  return (<div>
            <h1> Now Playing: </h1>
            <SmartSongView id={512} />
          </div>)
}
````

### Making Models Observable

You might be asking how you can take your existing models and make them Observable. Conveniently, react-observable-connect includes a helper Observable implementation that can help make any object observable.

For example, say you wanted to take the following model and make it Observable.

````javascript
class Song {
  constructor(title, albumId) {
    this.title = title;
    this.albumId = albumId;
    this.playCount = 0;
    this.nowPlaying = false;
  }
  
  start() {
    this.nowPlaying = true;
    this.playCount += 1;
  }
  
  stop() {
    this.nowPlaying = false;
  }
}
````
For our purposes, for a model to be Observable it must contain a subscribe method which takes in a callback and returns an object containing an unsubscribe method. Anytime the model's state changes, the callback needs to be called.

Using composition, we will make our Song object contain an Observable object. We will also add a subscribe method which just proxies to the Observable object's subscribe method. Finally, whenever we update the state of the model, we will call the trigger method on the Observable object.

````javascript
import {Observable} from 'react-observable-connect';

class Song {
  constructor(title, albumId) {
    this.title = title;
    this.albumId = albumId;
    this.playCount = 0;
    this.nowPlaying = false;
    this.observable = new Observable();
  }
  
  subscribe(func) {
    return this.observable.subscribe(func);
  }
  
  start() {
    this.nowPlaying = true;
    this.playCount += 1;
    this.observable.trigger();
  }
  
  stop() {
    this.nowPlaying = false;
    this.observable.trigger();
  }
}
````

## Contributing
Feel free to send pull requests. Make sure that you have written test cases for your changes if possible.

### License
react-observable-connect is [MIT licensed](./LICENSE).