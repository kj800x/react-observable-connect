import { Observable } from "../src/index";
import assert from "assert";

// Our implementation of observable is slightly different from the spec (the spec doesn't seem to support our use-case), although any spec-compliant observables
// should also be able to work with react-observable-connect's connect function.
describe("Observable", function() {
  it("should call the callback when it is triggered", function() {
    const obs = new Observable();
    let callbackCalled = false;
    obs.subscribe(function() {
      callbackCalled = true;
    });

    assert.equal(callbackCalled, false);

    obs.trigger();

    assert.equal(callbackCalled, true);
  });

  it("should call all callbacks when it is triggered", function() {
    const obs = new Observable();
    const callbacksCalled = {
      a: false,
      b: false
    };

    obs.subscribe(function() {
      callbacksCalled.a = true;
    });
    obs.subscribe(function() {
      callbacksCalled.b = true;
    });

    assert.equal(callbacksCalled.a, false);
    assert.equal(callbacksCalled.b, false);

    obs.trigger();

    assert.equal(callbacksCalled.a, true);
    assert.equal(callbacksCalled.b, true);
  });

  it("should properly unsubscribe callbacks when their unsubscribe is called, while not affecting other callbacks", function() {
    const obs = new Observable();
    const callbacksCalled = {
      a: false,
      b: false
    };

    const subscriptionA = obs.subscribe(function() {
      callbacksCalled.a = true;
    });
    const subscriptionB = obs.subscribe(function() {
      callbacksCalled.b = true;
    });

    subscriptionA.unsubscribe();

    assert.equal(callbacksCalled.a, false);
    assert.equal(callbacksCalled.b, false);

    obs.trigger();

    assert.equal(callbacksCalled.a, false);
    assert.equal(callbacksCalled.b, true);

    subscriptionB.unsubscribe();
  });

  it("should properly call callbacks more than once", function() {
    const obs = new Observable();
    const callbacksCalledCount = {
      a: 0,
      b: 0
    };

    obs.subscribe(function() {
      callbacksCalledCount.a += 1;
    });
    obs.subscribe(function() {
      callbacksCalledCount.b += 1;
    });

    assert.equal(callbacksCalledCount.a, 0);
    assert.equal(callbacksCalledCount.b, 0);

    obs.trigger();

    assert.equal(callbacksCalledCount.a, 1);
    assert.equal(callbacksCalledCount.b, 1);

    obs.trigger();

    assert.equal(callbacksCalledCount.a, 2);
    assert.equal(callbacksCalledCount.b, 2);
  });

  it("should properly call callbacks for only triggers that happen during their subscription", function() {
    const obs = new Observable();
    const callbacksCalledCount = {
      a: 0,
      b: 0
    };

    assert.equal(callbacksCalledCount.a, 0);
    assert.equal(callbacksCalledCount.b, 0);

    obs.trigger();
    obs.trigger();

    const subscriptionA = obs.subscribe(function() {
      callbacksCalledCount.a += 1;
    });

    obs.trigger();

    const subscriptionB = obs.subscribe(function() {
      callbacksCalledCount.b += 1;
    });

    obs.trigger();
    obs.trigger();

    subscriptionB.unsubscribe();

    obs.trigger();
    obs.trigger();

    subscriptionA.unsubscribe();

    obs.trigger();
    obs.trigger();

    assert.equal(callbacksCalledCount.a, 5);
    assert.equal(callbacksCalledCount.b, 2);
  });

  it("should call callbacks with the arguments that were passed to trigger", function() {
    const obs = new Observable();
    const calls = [];

    obs.subscribe((a, b) => {
      calls.push(a);
      calls.push(b);
    });

    obs.trigger("a", 1);
    obs.trigger("b", 2);
    obs.trigger("c", 3);

    assert.deepEqual(calls, ["a", 1, "b", 2, "c", 3]);
  });
});
