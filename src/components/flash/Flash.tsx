import React, { useEffect } from "react";
import { AlertVariant } from "../../settings/DataTypes";

interface IProps {
  variant: AlertVariant;
  boldText?: string;
  title?: string;
  errors?: string[];
  dismissible?: boolean;
  duration?: number;
  closeHandler?(): void;
}
const Flash: React.FunctionComponent<IProps> = props => {
  useEffect(() => {
    let t = props.duration ? props.duration : 2000;
    const timer = setTimeout(() => {
      props.dismissible && props.closeHandler && props.closeHandler();
    }, t);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  let errorFlash;
  let errorList;
  let boldText;
  let dismissBtn;

  if (props.boldText) {
    boldText = <strong>{props.boldText}! </strong>;
  }

  if (props.errors) {
    let errorMap = props.errors.map(error => {
      return <li key={error}>{error}</li>;
    });
    errorList = <ul className="m-0 pl-1">{errorMap}</ul>;
  }

  if (props.closeHandler) {
    dismissBtn = (
      <button
        type="button"
        className="close"
        data-dismiss="flash-error"
        aria-label="Close"
        onClick={props.closeHandler}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }

  errorFlash = (
    <div
      className={`mt-2 d-flex justify-content-between ${props.variant}`}
      role="alert"
    >
      <div>
        {boldText}
        {props.title}
        {errorList}
      </div>
      {dismissBtn}
    </div>
  );

  return <React.Fragment>{errorFlash}</React.Fragment>;
};
export default Flash;
