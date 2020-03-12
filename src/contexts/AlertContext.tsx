import React, { createContext, useState } from "react";
import { AlertVariant } from "../settings/DataTypes";

interface IProps {}

export interface IAlertContext {
  message: string | null;
  type: AlertVariant;
  errors: string[];
  dismissable: boolean;
  isShow: boolean;
  show: (
    message: string,
    type?: AlertVariant,
    errors?: string[],
    dismissable?: boolean
  ) => void;
  close: () => void;
}

let contextDefaultValue: IAlertContext = {
  message: null,
  type: AlertVariant.SUCCESS,
  errors: [],
  dismissable: true,
  isShow: false,
  show: () => {},
  close: () => {}
};
export const AlertContext = createContext<IAlertContext>(contextDefaultValue);

export const Provider = AlertContext.Provider;
export const AlertContextConsumer = AlertContext.Consumer;

const AlertContextProvider: React.FunctionComponent<IProps> = props => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<AlertVariant>(AlertVariant.SUCCESS);
  const [dismissable, setDismissable] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [isShow, setIsShow] = useState<boolean>(false);
  const handleShow = (
    message: string,
    type: AlertVariant = AlertVariant.SUCCESS,
    errors: string[] = [],
    dismissable: boolean = true
  ) => {
    setMessage(message);
    setType(type);
    setDismissable(dismissable);
    setErrors(errors);
    setIsShow(true);
  };
  const handleClose = () => {
    setMessage(null);
    setType(AlertVariant.SUCCESS);
    setErrors([]);
    setDismissable(true);
    setIsShow(false);
  };

  let initialState: IAlertContext = {
    message: message,
    type: type,
    errors: errors,
    dismissable: dismissable,
    isShow: isShow,
    show: handleShow,
    close: handleClose
  };
  return <Provider value={initialState}>{props.children}</Provider>;
};
export default AlertContextProvider;
