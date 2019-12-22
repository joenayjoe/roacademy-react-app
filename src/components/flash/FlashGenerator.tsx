import React from "react";
import Flash from "./Flash";
import { AlertVariant } from "../../settings/DataTypes";
import { LocationState } from "history";

interface IProp {
  state: LocationState;
  closeHandler: () => void;
}

const FlashGenerator: React.FunctionComponent<IProp> = props => {
  const getFlashHeading = (variant: AlertVariant) => {
    switch (variant) {
      case AlertVariant.DANGER:
        return "IMPORTANT";
      case AlertVariant.SUCCESS:
        return "SUCCESS";
      case AlertVariant.WARNING:
        return "WARNING";
      case AlertVariant.INFO:
        return "INFO";
      default:
        return "NOTE";
    }
  };

  let flashMessage;
  if (props.state && props.state.message) {
    let variant = props.state.variant || AlertVariant.DANGER;
    let error = props.state.message;
    flashMessage = (
      <Flash
        variant={variant}
        boldText={getFlashHeading(variant)}
        title={error}
        dismissible
        closeHandler={props.closeHandler}
      />
    );
  }
  return <React.Fragment>{flashMessage}</React.Fragment>;
};
export default FlashGenerator;
