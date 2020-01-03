import React, { useState, FormEvent } from "react";
import {
  ICategory,
  IEditCategory,
  AlertVariant
} from "../../../settings/DataTypes";
import Flash from "../../../components/flash/Flash";

interface IProps {
  id: string;
  category: ICategory;
  errorMessages: string[];
  onSubmitHandler: (formData: IEditCategory) => void;
}

const EditCategory: React.FunctionComponent<IProps> = props => {
  const [name, setName] = useState<string>(props.category.name);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: IEditCategory = {
      id: props.category.id,
      name: name
    };
    props.onSubmitHandler(formData);
  };

  let flashError: JSX.Element | undefined;
  if (props.errorMessages.length) {
    flashError = (
      <Flash variant={AlertVariant.DANGER} errors={props.errorMessages} />
    );
  }

  return (
    <form id={props.id} onSubmit={handleFormSubmit}>
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
    </form>
  );
};
export default EditCategory;
