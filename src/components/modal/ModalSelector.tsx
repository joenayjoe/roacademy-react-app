import React, { useContext } from "react";
import { ModalIdentifier } from "../../settings/DataTypes";
import { ModalContext } from "../../contexts/ModalContext";
import NewCategory from "../../pages/adminpanel/NewCategory";
import Login from "../../pages/user/Login";
import Signup from "../../pages/user/Signup";

interface IProps {
  sideDrawerCloseHandler?: () => void;
}
const ModalSelector: React.FunctionComponent<IProps> = props => {
  const modalContext = useContext(ModalContext);
  let modal: JSX.Element | null = null;

  switch (modalContext.currentModal) {
    case ModalIdentifier.LOGIN_MODAL:
      modal = <Login sideDrawerCloseHandler={props.sideDrawerCloseHandler} />;
      break;
    case ModalIdentifier.SIGNUP_MODAL:
      modal = <Signup sideDrawerCloseHandler={props.sideDrawerCloseHandler} />;
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
