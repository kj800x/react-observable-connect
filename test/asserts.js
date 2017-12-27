import assert from "assert";

export function assertFoo(renderedEnzyme, val) {
  assert.equal(renderedEnzyme.find(".fooVal").text(), val);
}

export function assertBar(renderedEnzyme, val) {
  assert.equal(renderedEnzyme.find(".barVal").text(), val);
}

export function assertN(renderedEnzyme, val) {
  assert.equal(renderedEnzyme.find(".nVal").text(), val);
}

export function assertData(renderedEnzyme, val) {
  assert.equal(renderedEnzyme.find(".dataVal").text(), val);
}

export function assertRenderCount(renderCounter, val) {
  assert.equal(renderCounter.getValue(), val);
}

export function assertThrows(fn, errMsg) {
  assert.throws(fn, function(err) {
    assert.ok(err instanceof Error);
    assert.equal(err.message, errMsg);
    return true;
  })

}