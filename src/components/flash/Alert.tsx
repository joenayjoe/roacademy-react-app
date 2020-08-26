import React, { useEffect } from "react";
import { AlertVariant } from "../../settings/DataTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  variant: AlertVariant;
  className?: string;
  title?: string;
  errors?: string[];
  dismissible?: boolean;
  showIcon?: boolean;
  duration?: number;
  closeHandler?(): void;
}
const Alert: React.FunctionComponent<IProps> = (props) => {
  useEffect(() => {
    let t = props.duration ? props.duration : 3200;
    const timer = setTimeout(() => {
      props.dismissible && props.closeHandler && props.closeHandler();
    }, t);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, []);

  let errorFlash;
  let errorList;
  let dismissBtn;
  let alertIcon;

  if (props.showIcon) {
    switch (props.variant) {
      case AlertVariant.DANGER:
        alertIcon = (
          <FontAwesomeIcon
            icon="exclamation-circle"
            size="2x"
            className="mr-2"
          />
        );
        break;
      case AlertVariant.SUCCESS:
        alertIcon = (
          <FontAwesomeIcon icon="check-circle" size="2x" className="mr-2" />
        );
        break;
      case AlertVariant.WARNING:
        alertIcon = (
          <FontAwesomeIcon
            icon="exclamation-circle"
            size="2x"
            className="mr-2"
          />
        );
        break;
      case AlertVariant.INFO:
        alertIcon = (
          <FontAwesomeIcon icon="info-circle" size="2x" className="mr-2" />
        );
        break;
      default:
        alertIcon = <FontAwesomeIcon icon="flag" size="2x" className="mr-2" />;
    }
  }

  if (props.errors) {
    let errorMap = props.errors.map((error) => {
      return (
        <li key={error} className="alert-error-item">
          {error}
        </li>
      );
    });
    errorList = (
      <div className="alert-error-container">
        <ul className="m-0 pl-1 alert-error-list">{errorMap}</ul>
      </div>
    );
  }

  if (props.closeHandler) {
    dismissBtn = (
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
        onClick={props.closeHandler}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    );
  }

  const alertTitle =
    props.errors && props.errors.length ? (
      <h4 className="alert-title">{props.title}</h4>
    ) : (
      <span>{props.title}</span>
    );
  const klass = props.className ? props.className : "";

  errorFlash = (
    <div
      className={`d-flex justify-content-between align-items-center mt-1 ${props.variant} ${klass}`}
      role="alert"
    >
      <div>
        <div className="d-flex justify-content-center align-items-center">
          {alertIcon}
          {alertTitle}
        </div>
        {errorList}
      </div>
      {dismissBtn}
    </div>
  );

  return <React.Fragment>{errorFlash}</React.Fragment>;
};
export default Alert;
