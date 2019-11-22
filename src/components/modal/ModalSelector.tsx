import React, { useContext } from "react";
import { ModalIdentifier } from "../../settings/DataTypes";
import { ModalContext } from "../../contexts/ModalContext";
import NewCategory from "../../pages/category/NewCategory";
import Login from "../../pages/user/Login";
import Signup from "../../pages/user/Signup";

const ModalSelector = () => {
  const modalContext = useContext(ModalContext);
  let modal: JSX.Element | null = null;

  switch (modalContext.currentModal) {
    case ModalIdentifier.LOGIN_MODAL:
      modal = <Login />;
      break;
    case ModalIdentifier.SIGNUP_MODAL:
      modal = <Signup />;
      break;
    case ModalIdentifier.NEW_CATEGORY_MODAL:
      modal = <NewCategory />;
      break;
    default:
      modal = null;
      break;
  }

  return <React.Fragment>{modal}</React.Fragment>;
};
export default ModalSelector;
