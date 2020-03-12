import React, { useContext } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import Alert from "./Alert";

const AlertSelector: React.FunctionComponent = () => {
  const alertContext = useContext(AlertContext);

  if (alertContext.message) {
    return (
      <Alert
        className="flash-alert sticky-top"
        variant={alertContext.type}
        title={alertContext.message}
        errors={alertContext.errors}
        closeHandler={() => alertContext.close()}
        showIcon
        dismissible={alertContext.dismissable}
      />
    );
  }
  return null;
};
export default AlertSelector;
