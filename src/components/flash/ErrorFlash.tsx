import React, { Component } from "react";

interface IProps {
  errors: string[];
}
class ErrorFlash extends Component<IProps, {}> {
  render() {
    let errorFlash;
    if (this.props.errors.length) {
      let errorList = this.props.errors.map(error => {
        return <li key={error}>{error}</li>;
      });
      errorFlash = (
        <div className="alert alert-danger error" role="alert">
          <ul className="m-0 p-0">{errorList}</ul>
        </div>
      );
    }
    return <React.Fragment>{errorFlash}</React.Fragment>;
  }
}
export default ErrorFlash;
