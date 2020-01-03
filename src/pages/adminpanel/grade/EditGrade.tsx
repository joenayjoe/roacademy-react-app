import React, { useState, FormEvent } from "react";
import { IGrade, IEditGrade, AlertVariant } from "../../../settings/DataTypes";
import Flash from "../../../components/flash/Flash";

interface IProp {
  id: string;
  grade: IGrade;
  errorMessages: string[];
  onSubmitHandler: (data: IEditGrade) => void;
}
const EditGrade: React.FunctionComponent<IProp> = props => {
  const [name, setName] = useState<string>(props.grade.name);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: IEditGrade = {
      id: props.grade.id,
      name: name,
      categoryId: props.grade.categoryId
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
  );
};
export default EditGrade;
