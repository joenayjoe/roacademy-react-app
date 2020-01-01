import React, { FormEvent, useState } from "react";
import { INewGrade, AlertVariant } from "../../settings/DataTypes";
import Flash from "../../components/flash/Flash";

interface IProps {
  formId: string;
  categoryId: number;
  errorMessages: string[];
  onSubmitHandler: (data: INewGrade) => void;
}
const NewGrade: React.FunctionComponent<IProps> = props => {
  const [name, setName] = useState<string>("");
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: INewGrade = {
      name: name,
      categoryId: props.categoryId
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
    <div>
      <form id={props.formId} onSubmit={handleFormSubmit}>
        {flashError}
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="Grade name"
            value={name}
            className="form-control"
            placeholder="Grade Name"
            aria-label="Grade Name"
            autoFocus
            required
            onChange={e => setName(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};
export default NewGrade;
