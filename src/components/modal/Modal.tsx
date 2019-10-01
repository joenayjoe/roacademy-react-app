import React, { Component } from "react";
import { ModalType, ModalSize } from "../../datatypes/types";

import "./Modal.css";
import Backdrop from "../backdrop/Backdrop";

interface IProps {
  heading: string;
  size: ModalSize;
  modalType: ModalType;
  closeHandler: () => void;
}
class Modal extends Component<IProps, {}> {
  render() {
    return (
      <Backdrop closeHandler={this.props.closeHandler}>
        <div className={`ra-modal animate-top ${this.props.size}`}>
          <div className="modal-header">
            <h5 className="modal-title">{this.props.heading}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="ra-modal"
              aria-label="Close"
              onClick={this.props.closeHandler}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{this.props.children}</div>
        </div>
      </Backdrop>
    );
  }
}
export default Modal;
