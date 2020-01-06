import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import {
  ADMIN_COURSES_URL,
  ADMIN_PANEL_URL
} from "../../../settings/Constants";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import {
  INewCourse,
  AlertVariant,
  ICategory,
  IGrade,
  CourseStatus
} from "../../../settings/DataTypes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CourseService } from "../../../services/CourseService";
import { parseError } from "../../../utils/errorParser";
import Flash from "../../../components/flash/Flash";
import { CategoryService } from "../../../services/CategoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GradeService } from "../../../services/GradeService";

interface IProp extends RouteComponentProps {}

const NewCourse: React.FunctionComponent<IProp> = props => {
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  const [name, setName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [status] = useState<CourseStatus>(CourseStatus.DRAFT);
  const [gradeId, setGradeId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const hanldeCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setCategoryId(categoryId);
    gradeService.getGradesByCategoryId(categoryId).then(resp => {
      setGrades(resp.data);
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (gradeId > 0 && categoryId > 0) {
      const formData: INewCourse = {
        name: name,
        headline: headline,
        description: description,
        level: level,
        objectives: objectives,
        requirements: requirements,
        status: status,
        gradeId: gradeId,
        categoryId: categoryId
      };
      courseService
        .createCourse(formData)
        .then(resp => {
          props.history.push(ADMIN_COURSES_URL);
        })
        .catch(err => {
          setErrors(parseError(err));
        });
    }
  };
  let flashErrors;
  if (errors.length) {
    flashErrors = (
      <Flash
        variant={AlertVariant.DANGER}
        errors={errors}
        closeHandler={() => setErrors([])}
      />
    );
  }

  const categoryOptions = categories.map(cat => {
    return (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    );
  });

  const subCategoryOptions = grades.map(grad => {
    return (
      <option key={grad.id} value={grad.id}>
        {grad.name}
      </option>
    );
  });

  return (
    <div className="new-course width-75">
      <Breadcrumb>
        <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
        <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
        <BreadcrumbItem active>New Course</BreadcrumbItem>
      </Breadcrumb>
      <div>
        <h4>New Course</h4>
        <div className="new-course-form">
          <form onSubmit={handleFormSubmit}>
            {flashErrors}
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                placeholder="Course Name"
                value={name}
                required
                onChange={e => setName(e.target.value)}
              ></input>
            </div>

            <div className="form-group">
              <label>Headline</label>
              <input
                className="form-control"
                placeholder="A brief headline"
                value={headline}
                required
                onChange={e => setHeadline(e.target.value)}
              ></input>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="Describe about the course..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Level</label>
              <select
                id="category-select-input"
                value={level}
                required
                className="form-control"
                onChange={e => setLevel(e.target.value)}
              >
                <option value="" disabled>
                  Choose Level
                </option>
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                id="category-select-input"
                value={categoryId}
                className="form-control"
                onChange={hanldeCategorySelect}
              >
                <option key={0} value="0" disabled>
                  Choose Category
                </option>
                {categoryOptions}
              </select>
            </div>

            <div className="form-group">
              <label>Sub category</label>
              <select
                id="category-select-input"
                value={gradeId}
                className="form-control"
                onChange={e => setGradeId(parseInt(e.target.value, 10))}
              >
                <option key={0} value="0" disabled>
                  Choose Sub category
                </option>
                {subCategoryOptions}
              </select>
            </div>

            <div className="form-group">
              <label>Objectives</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="[One in a line] What will students learn from this course? "
                value={objectives.join("\n")}
                onChange={e => setObjectives(e.target.value.split(/\n/))}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Requirements</label>
              <textarea
                rows={3}
                className="form-control"
                placeholder="[One in a line] What are the pre-requisit skills for this course?"
                value={requirements.join("\n")}
                onChange={e => setRequirements(e.target.value.split(/\n/))}
              ></textarea>
            </div>
            <div className="form-group action-btn-group">
              <button
                className="btn btn-danger action-btn"
                onClick={() => props.history.push(ADMIN_COURSES_URL)}
              >
                <FontAwesomeIcon icon="times" className="pr-1" />
                Cancel
              </button>
              <button className="btn btn-primary action-btn" type="submit">
                <FontAwesomeIcon icon="save" className="pr-1" />
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default withRouter(NewCourse);
