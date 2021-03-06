// https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md

const { JSDOM, VirtualConsole } = require("jsdom");

const nullConsole = new VirtualConsole();
const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
  nullConsole
});
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === "undefined")
    .reduce((result, prop) => {
      result[prop] = Object.getOwnPropertyDescriptor(src, prop);
      return result;
    }, {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js"
};
copyProps(window, global);
