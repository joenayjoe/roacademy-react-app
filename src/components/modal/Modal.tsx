import React, { Component, MouseEvent } from "react";
import { ModalDataType, ModalType, ModalSize } from "../../settings/DataTypes";

import "./Modal.css";

interface ModalProps {
  modalData: ModalDataType;
  size: ModalSize;
  modalType: ModalType;
  closeHandler: () => void;
}
class Modal extends Component<ModalProps, {}> {
  backGroundClickHandler = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.closeHandler();
    }
  };
  render() {
    let modalData = this.props.modalData;

    let modalFooter;
    if (this.props.modalType && this.props.modalType === "card") {
      modalFooter = (
        <div className="modal-footer">
          <button
            className="modal-submit btn btn-secondary"
            onClick={this.props.closeHandler}
          >
            {modalData.closeBtnText || "Cancel"}
          </button>
          <button className="modal-close btn btn-primary">
            {modalData.submitBtnText || "Save"}
          </button>
        </div>
      );
    }
    return (
      <div
        className="modal-container"
        onClick={e => this.backGroundClickHandler(e)}
      >
        <div className={`ra-modal animate-top ${this.props.size}`}>
          <div className="modal-header">
            <h5 className="modal-title">{modalData.heading}</h5>
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
          <div className="modal-body">{modalData.modalBody}</div>
          {modalFooter}
        </div>
      </div>
    );
  }
}
export default Modal;
