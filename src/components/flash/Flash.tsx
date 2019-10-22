import React, { Component } from "react";
import { AlertVariant } from "../../settings/DataTypes";

interface IProps {
  variant: AlertVariant;
  boldText?: string;
  title?: string;
  errors?: string[];
  dismissible?: boolean;
  closeHandler?(): void;
}
class Flash extends Component<IProps, {}> {
  render() {
    let errorFlash;
    let errorList;
    let boldText;
    let dismissBtn;

    if (this.props.boldText) {
      boldText = <strong>{this.props.boldText}! </strong>;
    }

    if (this.props.errors) {
      let errorMap = this.props.errors.map(error => {
        return <li key={error}>{error}</li>;
      });
      errorList = <ul className="m-0 pl-1">{errorMap}</ul>;
    }

    if (this.props.dismissible) {
      dismissBtn = (
        <button
          type="button"
          className="close"
          data-dismiss="flash-error"
          aria-label="Close"
          onClick={this.props.closeHandler}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      );
    }

    errorFlash = (
      <div
        className={`mt-2 d-flex justify-content-between ${this.props.variant}`}
        role="alert"
      >
        <div>
          {boldText}
          {this.props.title}
          {errorList}
        </div>
        {dismissBtn}
      </div>
    );

    return <React.Fragment>{errorFlash}</React.Fragment>;
  }
}
export default Flash;
