import React from "react";
import Modal from "./Modal";

interface IProp {
  isOpen: boolean;
  onDismissHandler: () => void;
  onConfirmHandler: () => void;
}
const ConfirmDialog: React.FunctionComponent<IProp> = props => {
  const confirmModalBody = <div>Do you really want to delete this?</div>;

  const confirmModalFooter = (
    <React.Fragment>
      <button className="btn btn-danger" onClick={props.onDismissHandler}>
        Calcel
      </button>
      <button className="btn btn-primary" onClick={props.onConfirmHandler}>
        Ok
      </button>
    </React.Fragment>
  );

  return (
    <Modal
      isOpen={props.isOpen}
      onCloseHandler={props.onDismissHandler}
      modalTitle="Are you sure?"
      modalBody={confirmModalBody}
      modalFooter={confirmModalFooter}
    />
  );
};
export default ConfirmDialog;
