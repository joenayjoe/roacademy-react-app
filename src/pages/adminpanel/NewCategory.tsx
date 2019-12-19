import React, { useState, FormEvent, useContext } from "react";
import Modal from "../../components/modal/Modal";
import Flash from "../../components/flash/Flash";
import { AlertVariant, INewCategory } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import { ModalContext } from "../../contexts/ModalContext";
import { parseError } from "../../utils/errorParser";

const NewCategory: React.FunctionComponent = () => {
  const [name, setName] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const modalContext = useContext(ModalContext);

  const categorService = new CategoryService();

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData: INewCategory = {
      name: name
    };
    categorService
      .createCategory(formData)
      .then(resp => {
        modalContext.closeModal();
        window.location.reload();
      })
      .catch(err => {
        const errorMsg: string[] = parseError(err);
        setErrorMessages(errorMsg);
      });
  };

  let flashError: JSX.Element | undefined;
  if (errorMessages.length) {
    flashError = <Flash variant={AlertVariant.DANGER} errors={errorMessages} />;
  }
  return (
    <Modal heading="New Category" size="modal-md">
      <div>
        <form onSubmit={handleFormSubmit}>
          {flashError}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="Category name"
              value={name}
              className="form-control"
              placeholder="Category Name"
              aria-label="Category Name"
              autoFocus
              required
              onChange={e => setName(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-block" type="submit">
            Create
          </button>
        </form>
      </div>
    </Modal>
  );
};
export default NewCategory;
