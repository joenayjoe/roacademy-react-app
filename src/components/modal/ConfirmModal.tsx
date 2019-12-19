import React from "react";
import Backdrop from "../backdrop/Backdrop";

interface IProps {
  callback: (option: boolean) => void;
}

const ConfirmModal: React.FunctionComponent<IProps> = props => {
  const handleActionClick = (option: boolean) => {
    props.callback(option);
    closeModal();
  };

  const closeModal = () => {};

  return (
    <Backdrop closeHandler={closeModal}>
      <div className={`ra-modal animate-top modal-md`}>
        <div className="modal-header">
          <h5 className="modal-title">Are you sure?</h5>
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
        <div className="modal-body">
          <div className="alert alert-danger">
            Do you really want to perform this action?
          </div>
          <div className="action-btn-group">
            <button
              className="btn btn-danger action-btn"
              onClick={() => handleActionClick(false)}
            >
              NO
            </button>
            <button
              className="btn btn-primary action-btn"
              onClick={() => handleActionClick(true)}
            >
              YES
            </button>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};
export default ConfirmModal;
