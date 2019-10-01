import React, { Component } from "react";
import { ModalIdentifier } from "../../datatypes/types";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";

interface IProps {
  modalIdentifier: ModalIdentifier | null;
  closeHandler: () => void;
  modalSwitcher: (modalIdentifier: ModalIdentifier) => void;
}
class ModalSelector extends Component<IProps, {}> {
  render() {
    const identifier = this.props.modalIdentifier;
    let modal: JSX.Element | null;
    switch (identifier) {
      case ModalIdentifier.LOGIN_MODAL:
        modal = (
          <LoginModal
            showSignupModalHandler={modalIdentifier =>
              this.props.modalSwitcher(modalIdentifier)
            }
            closeHandler={this.props.closeHandler}
          />
        );
        break;
      case ModalIdentifier.SIGNUP_MODAL:
        modal = (
          <SignupModal
            showLoginModalHandler={modalIdentifier =>
              this.props.modalSwitcher(modalIdentifier)
            }
            closeHandler={this.props.closeHandler}
          />
        );
        break
      default:
        modal = null;
        break;
    }

    return <React.Fragment>{modal}</React.Fragment>;
  }
}
export default ModalSelector;
