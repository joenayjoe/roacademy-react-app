import React from "react";
import Modal from "./Modal";

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
    <Modal heading="Are you sure?" size="modal-md">
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
    </Modal>
  );
};
export default ConfirmModal;
