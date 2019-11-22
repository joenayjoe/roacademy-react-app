import React, { createContext, useState } from "react";
import { ModalIdentifier } from "../settings/DataTypes";

interface IProps {}

export interface IModalContextProps {
  currentModal: ModalIdentifier | null;
  switchModal: (modal: ModalIdentifier) => void;
  closeModal: () => void;
}

let defaultContextValue: IModalContextProps = {
  currentModal: null,
  switchModal: () => {},
  closeModal: () => {}
};
export const ModalContext = createContext<IModalContextProps>(
  defaultContextValue
);

export const Provider = ModalContext.Provider;
export const AuthContextConsumer = ModalContext.Consumer;

const ModalContextProvider: React.FunctionComponent<IProps> = props => {
  const [currentModal, setCurrentModal] = useState<ModalIdentifier | null>(
    null
  );

  const switchModal = (modal: ModalIdentifier) => {
    setCurrentModal(modal);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  let initialState: IModalContextProps = {
    currentModal: currentModal,
    switchModal: switchModal,
    closeModal: closeModal
  };
  return <Provider value={initialState}>{props.children}</Provider>;
};

export default ModalContextProvider;
