import React from "react";
import Modal from "../../components/modal/Modal";

const NewCategory: React.FunctionComponent = () => {
  return (
    <Modal
      heading="New Category"
      size="modal-md"
      modalType="regular"
    >
      <div>Here is new Category modal</div>
    </Modal>
  );
};
export default NewCategory;
