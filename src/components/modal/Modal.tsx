import React, { Component, MouseEvent } from "react";
import { ModalType, ModalSize } from "../../settings/DataTypes";

import "./Modal.css";

interface IProps {
  heading: string;
  size: ModalSize;
  modalType: ModalType;
  closeHandler: () => void;
}
class Modal extends Component<IProps, {}> {
  backGroundClickHandler = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.closeHandler();
    }
  };
  render() {
    return (
      <div
        className="modal-container"
        onClick={e => this.backGroundClickHandler(e)}
      >
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
      </div>
    );
  }
}
export default Modal;
