import React, { FormEvent, useState, ChangeEvent, useEffect } from "react";
import {
  INewGrade,
  AlertVariant,
  ICategory
} from "../../../settings/DataTypes";
import Alert from "../../../components/flash/Alert";
import { CategoryService } from "../../../services/CategoryService";

interface IProps {
  formId: string;
  errorMessages: string[];
  onSubmitHandler: (data: INewGrade) => void;
}
const NewGrade: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number>(0);

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: INewGrade = {
      name: name,
      categoryId: categoryId
    };
    props.onSubmitHandler(formData);
  };

  const hanldeCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setCategoryId(categoryId);
  };

  const categoryOptions = categories.map(cat => {
    return (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    );
  });

  let flashError: JSX.Element | undefined;
  if (props.errorMessages.length) {
    flashError = (
      <Alert variant={AlertVariant.DANGER} errors={props.errorMessages} />
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
        <div className="form-group">
          <label>Category</label>
          <select
            id="category-select-input"
            value={categoryId}
            className="form-control"
            required
            onChange={hanldeCategorySelect}
          >
            <option key={0} value="0" disabled>
              Choose Category
            </option>
            {categoryOptions}
          </select>
        </div>
      </form>
    </div>
  );
};
export default NewGrade;
