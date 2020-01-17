import React, { useState, FormEvent } from "react";
import Alert from "../../../components/flash/Alert";
import { AlertVariant, INewCategory } from "../../../settings/DataTypes";

interface IProp {
  id: string;
  errorMessages: string[];
  onSubmitHandler: (data: INewCategory) => void;
}
const NewCategory: React.FunctionComponent<IProp> = props => {
  const [name, setName] = useState<string>("");

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: INewCategory = {
      name: name
    };
    props.onSubmitHandler(formData);
  };

  let flashError: JSX.Element | undefined;
  if (props.errorMessages.length) {
    flashError = (
      <Alert variant={AlertVariant.DANGER} errors={props.errorMessages} />
    );
  }
  return (
    <div>
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
    </div>
  );
};
export default NewCategory;
