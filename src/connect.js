import React, {Component} from 'react';
import deepEqual from 'deep-equal';

const OBSERVABLE_INVALID_UNSUBSCRIBE =
  "observableObject did not properly implement the observable interface " +
  "(subscribe did not return an unsubscribe function)";

const OBSERVABLE_INVALID_SUBSCRIBE =
  "observableObject did not properly implement the observable interface " +
  "(did not have a subscribe method)";

const MOTVP_NOT_OBJECT =
  "mapObjectToValueProps did not return an object";

const MOTFP_NOT_OBJECT =
  "mapObjectToFunctionProps did not return an object";

/**
 * Merge objects a and b and return a new object with the merged result. If a and b both have the same key, the value for b will be used in the result.
 */
function mergeObjects(a, b) {
  const result = {};
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  for (let i = 0; i < aKeys.length; i++) {
    result[aKeys[i]] = a[aKeys[i]];
  }
  for (let i = 0; i < bKeys.length; i++) {
    result[bKeys[i]] = b[bKeys[i]];
  }
  return result;
}

function ensureFunction(maybeFunc, errMsg) {
  if (typeof(maybeFunc) !== "function") {
    throw new Error(errMsg);
  }
}

function ensureObject(maybeObj, errMsg) {
  if (typeof(maybeObj) !== "object") {
    throw new Error(errMsg);
  }
}

/**
 * Connect the state of an observableObject to the props of a react component (via a HOC's state).
 *
 * The observableObject must expose a subscribe method which takes in a callback which is called whenever the observableObject's state changes.
 * The observableObject's subscribe method should return an unsubscribe method which can be called to unsubscribe the callback from the state changes.
 *
 * mapObjectToValueProps should take in the observableObject and return an object. The object should be the value (non-functional) props that the
 * dumb component receives. The return value of this should be able to be compared by react to determine if the dumb component needs to be re-rendered.
 *
 * mapObjectToFunctionProps should take in the observableObject and return an object. The object should be the function props that the dumb component receives.
 * Important! The return value of this function will not be compared to check for required state updates, so if you return a freshly bound version of the
 * functions, that is ok. As a consequence, this function's return value should not change unless the return value of mapObjectToValueProps changes, as this
 * will only be recomputed if the return value of mapObjectToValueProps changes.
 *
 *
 * @param observableObject an object that has a method named subscribe with the signature: (function callback) -> (function unsubscribe).
 *                         if the observableObject's state changes, then the callback function should be called.
 *                         if the unsubscribe function is called, then the observableObject should remove references to the callback and stop calling it.
 *
 * @param mapObjectToValueProps
 *                         a function that turns the observableObject into a set of props for the DumbComponent. These props should only be values
 *                         (comparable for equality).
 *
 * @param mapObjectToFunctionProps
 *                         a function that turns the observableObject into a set of props for the DumbComponent. These props should only be functions.
 *
 * @returns {Function}     a function which takes one argument, the DumbComponent and returns a SmartComponent by passing the props from the observableObject
 *                         into it.
 */
export default function(observableObject, mapObjectToValueProps, mapObjectToFunctionProps) {

  // If mapObjectToFunctionProps is undefined use a function which returns an empty object as a default
  mapObjectToFunctionProps = (typeof mapObjectToFunctionProps === "undefined") ? (() => ({})) : mapObjectToFunctionProps;

  return function(DumbComponent) {

    class SmartComponent extends Component {

      constructor(props) {
        super(props);
        this.state = {
          valueProps: {}
        };
        this.unsubscribe = null;
      }

      trySubscribe() {
        if (!this.unsubscribe) {
          ensureFunction(observableObject.subscribe, OBSERVABLE_INVALID_SUBSCRIBE);
          this.unsubscribe = observableObject.subscribe(this.handleChange.bind(this));
          ensureFunction(this.unsubscribe, OBSERVABLE_INVALID_UNSUBSCRIBE);
          this.handleChange();
        }
      }

      tryUnsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null
        }
      }

      componentDidMount() {
        this.trySubscribe()
      }

      componentWillUnmount() {
        this.tryUnsubscribe();
      }

      handleChange() {
        if (!this.unsubscribe) {
          return
        }

        const newValueProps = mapObjectToValueProps(observableObject);
        ensureObject(newValueProps, MOTVP_NOT_OBJECT);

        if (!deepEqual(newValueProps, this.state.valueProps)) {
          this.setState({valueProps: newValueProps});
        }
      }

      render() {
        // Merge this element's props, the value props, and the event listener props all into one allProps.
        const funcProps = mapObjectToFunctionProps(observableObject);
        ensureObject(funcProps, MOTFP_NOT_OBJECT);
        const allProps = mergeObjects(mergeObjects(this.props, this.state.valueProps), funcProps);

        // Create a DumbComponent using allProps
        return React.createElement(DumbComponent,
                                   allProps);
      }
    }

    return new SmartComponent();

  }

}
