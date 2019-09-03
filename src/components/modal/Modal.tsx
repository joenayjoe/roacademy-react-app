import React, { Component } from "react";
import {modalDataType, defaultModalData} from "../../settings/DataTypes";

import "./Modal.css";

interface ModalProps {
    modalData: modalDataType | null;
    size: string;
    closeHandler: () => void;
}
class Modal extends Component<ModalProps, {}> {
  render() {
     let modalData = this.props.modalData === null ? defaultModalData : this.props.modalData;
    return (
      <div className={`ra-modal animate-top ${this.props.size}`}>
        <div className="modal-header">
          <h4 className="modal-title">{modalData.heading}</h4>
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
        <div className="modal-body">
          {modalData.children}
        </div>
        <div className="modal-footer">
          <button className="modal-submit btn btn-secondary" onClick={this.props.closeHandler}>{modalData.closeBtnText}</button>
          <button className="modal-close btn btn-primary">{modalData.submitBtnText}</button>
        </div>
      </div>
    );
  }
}
export default Modal;
