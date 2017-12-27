import React from 'react';
import Enzyme, {mount} from 'enzyme';

import generateSampleModelObject from './model/model';
import SmartView from './view/SmartView';
import DumbView from './view/DumbView';
import Counter from './Counter';
import {assertBar, assertData, assertFoo, assertN, assertRenderCount, assertThrows} from "./asserts";

import Adapter from 'enzyme-adapter-react-16';
import connect from "../src/connect";

Enzyme.configure({adapter: new Adapter()});

// Suppress console.error for the duration of the wrapped function
// Stores console.error, overwrites it with a dud function, executes the provided function, and then restores console.error.
function suppressConsoleError(f) {
  return function () {
    const savedConsoleError = console.error;
    console.error = () => {};
    try {
      return f();
    } finally {
      console.error = savedConsoleError;
    }
  }
}

describe("connect", function () {
  it("should properly load props from the model on first render", function () {
    const model = generateSampleModelObject();
    const renderCounter = new Counter();
    const rendered = mount(<SmartView model={model} renderCounter={renderCounter}/>);

    assertFoo(rendered, "");
    assertBar(rendered, "fizzbuzz");
    assertN(rendered, "3");
    assertData(rendered, "[2,3,5,7,11]");
    assertRenderCount(renderCounter, 2);
  });
  it("should re-render if a button who's callback changes the model is pressed", function () {
    const model = generateSampleModelObject();
    const renderCounter = new Counter();
    const rendered = mount(<SmartView model={model} renderCounter={renderCounter}/>);

    assertN(rendered, "3");
    assertRenderCount(renderCounter, 2);

    rendered.find(".incrementNButton").last().simulate('click');

    assertN(rendered, "4");
    assertRenderCount(renderCounter, 3);
  });
  it("shouldn't re-render if a prop that it doesn't care about changes", function () {
    const model = generateSampleModelObject();
    const renderCounter = new Counter();
    mount(<SmartView model={model} renderCounter={renderCounter}/>);

    assertRenderCount(renderCounter, 2);

    model.setUnrenderedValue(70);

    assertRenderCount(renderCounter, 2);
  });
  it("shouldn't re-render if a function prop changes but not a value prop", function () {
    const model = generateSampleModelObject();

    function mapObjectToValueProps(obj) {
      return {
        foo: obj.foo,
        bar: obj.bar,
        n: obj.n,
        data: obj.data,
      }
    }

    function mapObjectToFunctionProps(obj) {
      return {
        incrementN: obj.incrementN.bind(obj),
        getUnrenderedValue: function(obj) {return obj.unrenderedValue}.bind(obj)
      }
    }

    function BadConnectedView({model}) {
      return connect(model, mapObjectToValueProps, mapObjectToFunctionProps)(DumbView)
    }

    const renderCounter = new Counter();
    mount(<BadConnectedView model={model} renderCounter={renderCounter}/>);

    assertRenderCount(renderCounter, 2);

    // The function prop getUnrenderedValue depends on the model's unrenderedValue.
    // but because it's a function prop, the model shouldn't be re-rendered.
    model.setUnrenderedValue(20);

    assertRenderCount(renderCounter, 2);
  });
  it("should throw an error if the observable object does not have a subscribe method",
     suppressConsoleError(function () {
       const model = {
         "subscribe": 1,
         "incrementN": function () {}
       }; // subscribe is not a method
       assertThrows(() => mount(<SmartView model={model}/>), "observableObject did not properly implement the observable "
                                                             + "interface (did not have a subscribe method)")
     }));
  it("should throw an error if the observable object's subscribe does not return an unsubscribe function",
     suppressConsoleError(function () {
       const model = {
         "subscribe": function () {},
         "incrementN": function () {}
       }; // subscribe is a method which does not return a function
       assertThrows(() => mount(<SmartView model={model}/>), "observableObject did not properly implement the observable "
                                                             + "interface (subscribe did not return an unsubscribe function)")
     }));
  it("should throw an error if mapObjectToValueProps not a function",
     suppressConsoleError(function () {
       const model = generateSampleModelObject();
       const BadComponent1 = function () {return connect(model)(DumbView)};

       assertThrows(() => mount(<BadComponent1/>), "mapObjectToValueProps is not a function");

       const BadComponent2 = function () {return connect(model, 1)(DumbView)};

       assertThrows(() => mount(<BadComponent2/>), "mapObjectToValueProps is not a function");
     }));
  it("should throw an error if mapObjectToFunctionProps is defined an not a function",
     suppressConsoleError(function () {
       const model = generateSampleModelObject();
       const BadComponent = function () {return connect(model, function () {return {}}, 50)(DumbView)};

       assertThrows(() => mount(<BadComponent/>), "mapObjectToFunctionProps is not a function");
     }));
});
