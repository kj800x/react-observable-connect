import React, { Component } from "react";

export default class DumbView extends Component {
  render() {
    this.props.renderCounter && this.props.renderCounter.increment();

    return (
      <div>
        <h1>
          {" "}
          Foo: <span className="fooVal">{this.props.foo}</span>{" "}
        </h1>
        <h1>
          {" "}
          Bar: <span className="barVal">{this.props.bar}</span>{" "}
        </h1>
        <h1>
          {" "}
          N: <span className="nVal">{this.props.n}</span>{" "}
        </h1>
        <h1>
          {" "}
          Data:{" "}
          <span className="dataVal">
            {JSON.stringify(this.props.data)}
          </span>{" "}
        </h1>
        <h1>
          <button onClick={this.props.incrementN} className="incrementNButton">
            Increment N
          </button>
        </h1>
      </div>
    );
  }
}
