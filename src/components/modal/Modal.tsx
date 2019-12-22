import React from "react";
import ReactDOM from "react-dom";

import "./Modal.css";

interface IProps {
  isOpen: boolean;
  modalTitle: string;
  modalBody: JSX.Element;
  modalFooter?: JSX.Element;
  onCloseHandler: () => void;
}

const modalRootOrNull: HTMLElement | null = document.getElementById(
  "modal-root"
);
let modalRoot: HTMLElement;

if (modalRootOrNull) {
  modalRoot = modalRootOrNull;
}

const Modal: React.FunctionComponent<IProps> = props => {
  const closeModal = () => {
    props.onCloseHandler();
  };
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  const modalFooter = props.modalFooter ? (
    <div className="modal-footer">{props.modalFooter}</div>
  ) : null;
  const MODAL = props.isOpen ? (
    <div className="modal-wrapper" onClick={handleBackgroundClick}>
      <div className={`ra-modal animate-top modal-md`}>
        <div className="modal-header">
          <h5 className="modal-title">{props.modalTitle}</h5>
          <button
            type="button"
            className="close"
            data-dismiss="ra-modal"
            aria-label="Close"
            onClick={closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{props.modalBody}</div>
        {modalFooter}
      </div>
    </div>
  ) : null;

  return ReactDOM.createPortal(MODAL, modalRoot);
};

export default Modal;
