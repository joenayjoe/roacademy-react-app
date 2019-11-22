import React, { useContext } from "react";
import { ModalIdentifier } from "../../settings/DataTypes";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { ModalContext } from "../../contexts/ModalContext";

const ModalSelector = () => {
  const modalContext = useContext(ModalContext);
  let modal: JSX.Element | null = null;

  switch (modalContext.currentModal) {
    case ModalIdentifier.LOGIN_MODAL:
      modal = (
        <LoginModal
          showSignupModalHandler={modalIdentifier =>
            modalContext && modalContext.switchModal(modalIdentifier)
          }
          closeHandler={modalContext.closeModal}
        />
      );
      break;
    case ModalIdentifier.SIGNUP_MODAL:
      modal = (
        <SignupModal
          showLoginModalHandler={modalIdentifier =>
            modalContext.switchModal(modalIdentifier)
          }
          closeHandler={modalContext.closeModal}
        />
      );
      break;
    default:
      modal = null;
      break;
  }

  return <React.Fragment>{modal}</React.Fragment>;
};
export default ModalSelector;
