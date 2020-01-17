import React, { createContext, useState } from "react";
import { AlertVariant } from "../settings/DataTypes";

interface IProps {}

export interface IAlertContext {
  message: string | null;
  type: AlertVariant;
  isShow: boolean;
  show: (message: string, type?: AlertVariant) => void;
  close: () => void;
}

let contextDefaultValue: IAlertContext = {
  message: null,
  type: AlertVariant.SUCCESS,
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
  const [isShow, setIsShow] = useState<boolean>(false);
  const handleShow = (
    message: string,
    type: AlertVariant = AlertVariant.SUCCESS
  ) => {
    setMessage(message);
    setType(type);
    setIsShow(true);
  };
  const handleClose = () => {
    setMessage(null);
    setType(AlertVariant.SUCCESS);
    setIsShow(false);
  };

  let initialState: IAlertContext = {
    message: message,
    type: type,
    isShow: isShow,
    show: handleShow,
    close: handleClose
  };
  return <Provider value={initialState}>{props.children}</Provider>;
};
export default AlertContextProvider;
