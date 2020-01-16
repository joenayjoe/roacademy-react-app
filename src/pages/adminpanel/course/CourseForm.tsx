import React, { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  CourseStatus,
  ICategory,
  IGrade,
  ICourse,
  INewCourse,
  AlertVariant
} from "../../../settings/DataTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GradeService } from "../../../services/GradeService";
import { CourseService } from "../../../services/CourseService";
import Flash from "../../../components/flash/Flash";
import Spinner from "../../../components/spinner/Spinner";
import { CategoryService } from "../../../services/CategoryService";

interface IProp {
  courseId?: number;
  errors?: string[];
  submitHandler: (data: ICourse | INewCourse) => void;
  cancelHandler: () => void;
}

const CourseForm: React.FunctionComponent<IProp> = props => {
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  const [name, setName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [status, setStatus] = useState<CourseStatus>(CourseStatus.DRAFT);
  const [gradeId, setGradeId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [isLoaded, setIsloaded] = useState<boolean>(
    props.courseId ? false : true
  );
  const [contentPillActive, toogleContentPillActive] = useState<boolean>(true);

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
    });

    if (props.courseId) {
      courseService.getCourse(props.courseId.toString()).then(resp => {
        const course = resp.data;
        setName(course.name);
        setHeadline(course.headline);
        setDescription(course.description);
        setLevel(course.level);
        setObjectives(course.objectives);
        setRequirements(course.requirements);
        setStatus(course.status as CourseStatus);
        setGradeId(course.primaryGrade.id);
        setCategoryId(course.primaryCategory.id);
        setIsloaded(true);

        gradeService
          .getGradesByCategoryId(course.primaryCategory.id)
          .then(resp => {
            setGrades(resp.data);
          });
      });
    }
    // eslint-disable-next-line
  }, []);

  const hanldeCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setCategoryId(categoryId);
    setGradeId(0);
    gradeService.getGradesByCategoryId(categoryId).then(resp => {
      setGrades(resp.data);
    });
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (gradeId > 0 && categoryId > 0) {
      let courseData;
      const newCourseData: INewCourse = {
        name: name,
        headline: headline,
        description: description,
        level: level,
        objectives: objectives.filter(el => el.trim()),
        requirements: requirements.filter(el => el.trim()),
        status: status,
        gradeId: gradeId,
        categoryId: categoryId
      };

      if (props.courseId) {
        courseData = { ...newCourseData, id: props.courseId };
      } else {
        courseData = { ...newCourseData };
      }
      props.submitHandler(courseData);
    }
  };

  const addNewObjective = () => {
    const objs = [...objectives];
    if (objs[objs.length - 1] !== "") {
      objs.push("");
      setObjectives(objs);
    }
  };

  const removeObjective = (e: any, idx: number) => {
    e.preventDefault();
    const objs = [...objectives];
    objs.splice(idx, 1);
    setObjectives(objs);
  };

  const changeObjective = (newValue: string, idx: number) => {
    const objs = [...objectives];
    objs[idx] = newValue;
    setObjectives(objs);
  };

  const addNewRequirement = () => {
    const reqs = [...requirements];
    if (reqs[reqs.length - 1] !== "") {
      reqs.push("");
      setRequirements(reqs);
    }
  };

  const removeRequirement = (e: any, idx: number) => {
    e.preventDefault();
    const reqs = [...requirements];
    reqs.splice(idx, 1);
    setRequirements(reqs);
  };

  const changeRequirement = (newValue: string, idx: number) => {
    const reqs = [...requirements];
    reqs[idx] = newValue;
    setRequirements(reqs);
  };

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

  const displayObjectives = () => {
    if (objectives.length) {
      return objectives.map((obj, idx) => {
        return (
          <div className="input-group mb-3" key={idx}>
            <input
              className="form-control"
              type="text"
              value={obj}
              placeholder="Example: Algebra"
              onChange={e => changeObjective(e.target.value, idx)}
            ></input>
            <div className="input-group-append">
              <button
                className="btn btn-outline-danger"
                onClick={e => removeObjective(e, idx)}
              >
                <FontAwesomeIcon icon="trash" />
              </button>
            </div>
          </div>
        );
      });
    } else {
      addNewObjective();
    }
  };

  const displayRequirements = () => {
    if (requirements.length) {
      return requirements.map((req, idx) => {
        return (
          <div className="input-group mb-3" key={idx}>
            <input
              className="form-control"
              type="text"
              value={req}
              placeholder="Example: Basic English"
              onChange={e => changeRequirement(e.target.value, idx)}
            ></input>
            <div className="input-group-append">
              <button
                className="btn btn-outline-danger"
                onClick={e => removeRequirement(e, idx)}
              >
                <FontAwesomeIcon icon="trash" />
              </button>
            </div>
          </div>
        );
      });
    } else {
      addNewRequirement();
    }
  };

  let flashErrors;
  if (props.errors && props.errors.length) {
    flashErrors = <Flash variant={AlertVariant.DANGER} errors={props.errors} />;
  }

  const formTitle = props.courseId ? "Edit Course" : "Create New Course";
  let courseForm = <Spinner size="3x" />;
  if (isLoaded) {
    courseForm = (
      <div>
        <h4>{formTitle}</h4>
        <nav className="nav nav-pills flex-column flex-sm-row my-3">
          <button
            className={`btn btn-outline-primary mr-sm-2 flex-sm-fill text-sm-center nav-link ${
              contentPillActive ? "active" : ""
            }`}
            onClick={() => toogleContentPillActive(true)}
          >
            Course Info
          </button>
          <button
            className={`btn btn-outline-primary mt-2 mt-sm-0 flex-sm-fill text-sm-center nav-link ${
              contentPillActive ? "" : "active"
            }`}
            onClick={() => toogleContentPillActive(false)}
          >
            Course Contents
          </button>
        </nav>
        <div className="tab-content">
          <div
            id="courseContent"
            className={`tab-pane ${contentPillActive ? "active" : ""}`}
          >
            <form onSubmit={handleFormSubmit}>
              {flashErrors}
              <div className="form-group">
                <label>Course title</label>
                <input
                  className="form-control"
                  placeholder="Course Name"
                  value={name}
                  required
                  onChange={e => setName(e.target.value)}
                ></input>
              </div>

              <div className="form-group">
                <label>Course subtitle</label>
                <input
                  className="form-control"
                  placeholder="A brief headline"
                  value={headline}
                  required
                  onChange={e => setHeadline(e.target.value)}
                ></input>
              </div>
              <div className="form-group">
                <label>Course description</label>
                <Editor
                  apiKey="9ugo4yh8kkd85lktdm9mbxj7lmc8sjnbmc8vqaaaikocd4zy"
                  value={description}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: ["lists"],
                    toolbar: "bold italic | bullist numlist"
                  }}
                  onChange={e => setDescription(e.target.getContent())}
                />
              </div>

              <div className="form-group">
                <label>Course level</label>
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
                <label>Course Category</label>
                <select
                  id="category-select-input"
                  value={categoryId}
                  className="form-control"
                  onChange={hanldeCategorySelect}
                >
                  <option key={0} value="0" disabled>
                    -- Select Category --
                  </option>
                  {categoryOptions}
                </select>
              </div>

              <div className="form-group">
                <label>Course subcategory</label>
                <select
                  id="category-select-input"
                  value={gradeId}
                  className="form-control"
                  onChange={e => setGradeId(parseInt(e.target.value, 10))}
                >
                  <option key={0} value="0" disabled>
                    -- Select subcategory --
                  </option>
                  {subCategoryOptions}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Objectives: What will students learn in this course
                </label>
                <div>
                  {displayObjectives()}
                  <div
                    className="btn btn-outline-dark"
                    onClick={addNewObjective}
                  >
                    <FontAwesomeIcon icon="plus-circle" />
                    <span className="ml-2">Add an answer</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>
                  Requirements: Are there any course requirements or
                  prerequisities?
                </label>
                <div>
                  {displayRequirements()}
                  <div
                    className="btn btn-outline-dark"
                    onClick={addNewRequirement}
                  >
                    <FontAwesomeIcon icon="plus-circle" />
                    <span className="ml-2">Add an answer</span>
                  </div>
                </div>
              </div>
              <div className="form-group action-btn-group">
                <button
                  className="btn btn-danger action-btn"
                  onClick={props.cancelHandler}
                >
                  <FontAwesomeIcon icon="times" className="mr-1" />
                  Cancel
                </button>
                <button className="btn btn-primary action-btn" type="submit">
                  <FontAwesomeIcon icon="save" className="mr-1" />
                  Save
                </button>
              </div>
            </form>
          </div>
          <div
            id="courseChapter"
            className={`tab-pane ${contentPillActive ? "" : "active"}`}
          >
            Chapter goes here
          </div>
        </div>
      </div>
    );
  }
  return <React.Fragment>{courseForm}</React.Fragment>;
};
export default CourseForm;
