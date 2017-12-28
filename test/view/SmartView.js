import connect from "../../src/connect";
import DumbView from "./DumbView";

function objToValueProps(obj) {
  return {
    foo: obj.foo,
    bar: obj.bar,
    n: obj.n,
    data: obj.data,
  }
}

function objToFuncProps(obj) {
  return {
    incrementN: obj.incrementN.bind(obj)
  }
}

export default function SmartView({model}) {
  return connect(model, objToValueProps, objToFuncProps)(DumbView)
}
