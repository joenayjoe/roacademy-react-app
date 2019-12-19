import React, { useContext } from "react";
import { ModalSize } from "../../settings/DataTypes";

import "./Modal.css";
import Backdrop from "../backdrop/Backdrop";
import { ModalContext } from "../../contexts/ModalContext";

interface IProps {
  heading: string;
  size: ModalSize;
}
const Modal: React.FunctionComponent<IProps> = props => {
  const modalContext = useContext(ModalContext);

  return (
    <Backdrop closeHandler={modalContext.closeModal}>
      <div className={`ra-modal animate-top ${props.size}`}>
        <div className="modal-header">
          <h5 className="modal-title">{props.heading}</h5>
          <button
            type="button"
            className="close"
            data-dismiss="ra-modal"
            aria-label="Close"
            onClick={modalContext.closeModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">{props.children}</div>
      </div>
    </Backdrop>
  );
};
export default Modal;
