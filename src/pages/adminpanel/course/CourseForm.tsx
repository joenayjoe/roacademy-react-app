import React, {
  useState,
  ChangeEvent,
  useEffect,
  FormEvent,
  useContext
} from "react";
import RichTextEditor, { EditorValue } from "react-rte";
import {
  CourseStatus,
  ICategory,
  IGrade,
  INewCourse,
  AlertVariant,
  IEditCourse,
  ICourse,
  ICourseStatusUpdateRequest,
  HTTPStatus
} from "../../../settings/DataTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GradeService } from "../../../services/GradeService";
import Flash from "../../../components/flash/Alert";
import Spinner from "../../../components/spinner/Spinner";
import { CategoryService } from "../../../services/CategoryService";

import "./Course.css";
import { AlertContext } from "../../../contexts/AlertContext";
import { CourseService } from "../../../services/CourseService";
import {
  ADMIN_COURSES_URL,
  BUILD_ADMIN_EDIT_COURSE_URL
} from "../../../settings/Constants";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { parseError } from "../../../utils/errorParser";
import ChapterForm from "../chapter/ChapterForm";
import { RTE_TOOLBAR_CONFIG } from "../../../settings/rte_config";

interface IProp extends RouteComponentProps {
  course?: ICourse;
}

const CourseForm: React.FunctionComponent<IProp> = props => {
  const alertContext = useContext(AlertContext);

  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  const [name, setName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [description, setDescription] = useState<EditorValue>(
    RichTextEditor.createEmptyValue()
  );
  const [level, setLevel] = useState<string>("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [status, setStatus] = useState<CourseStatus>(CourseStatus.DRAFT);
  const [gradeId, setGradeId] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);
  const [isLoaded, setIsloaded] = useState<boolean>(
    props.course ? false : true
  );
  const [courseErrors, setCourseErrors] = useState<string[]>([]);

  enum PillEnum {
    COURSE,
    CHAPTER,
    PUBLISH
  }
  const [activePill, setActivePill] = useState<PillEnum>(PillEnum.COURSE);

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
    });

    if (props.course) {
      const course = props.course;
      setName(course.name);
      setHeadline(course.headline);
      setDescription(
        RichTextEditor.createValueFromString(course.description, "html")
      );
      setLevel(course.level);
      setObjectives(course.objectives);
      setRequirements(course.requirements);
      setStatus(course.status as CourseStatus);
      setGradeId(course.primaryGrade.id);
      setCategoryId(course.primaryCategory.id);
      setIsloaded(true);

      gradeService
        .getGradesByCategoryId(course.primaryCategory.id, "id_asc")
        .then(resp => {
          setGrades(resp.data);
        });
    }
    // eslint-disable-next-line
  }, []);

  const hanldeCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setCategoryId(categoryId);
    setGradeId(0);
    gradeService.getGradesByCategoryId(categoryId, "id_asc").then(resp => {
      setGrades(resp.data);
    });
  };

  const handleCourseFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (gradeId > 0 && categoryId > 0) {
      let courseData;
      const newCourseData: INewCourse = {
        name: name,
        headline: headline,
        description: description.toString("html"),
        level: level,
        objectives: objectives.filter(el => el.trim()),
        requirements: requirements.filter(el => el.trim()),
        status: status,
        gradeId: gradeId,
        categoryId: categoryId
      };

      if (props.course) {
        courseData = { ...newCourseData, id: props.course.id };
        courseService
          .updateCourse(courseData as IEditCourse)
          .then(resp => {
            setCourseErrors([]);
            props.history.push(BUILD_ADMIN_EDIT_COURSE_URL(resp.data.id));
            alertContext.show("Course updated successfully");
          })
          .catch(err => {
            setCourseErrors(parseError(err));
          });
      } else {
        courseData = { ...newCourseData };
        courseService
          .createCourse(courseData as INewCourse)
          .then(resp => {
            setCourseErrors([]);
            props.history.push(BUILD_ADMIN_EDIT_COURSE_URL(resp.data.id));
            alertContext.show("Course created successfully");
          })
          .catch(err => {
            setCourseErrors(parseError(err));
          });
      }
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

  const publishCourse = () => {
    if (props.course) {
      const payload: ICourseStatusUpdateRequest = {
        id: props.course.id,
        status: CourseStatus.PUBLISHED
      };
      courseService
        .publishCourse(props.course.id, payload)
        .then(resp => {
          if (resp.status === HTTPStatus.OK) {
            alertContext.show("Course successfully published");
            setActivePill(PillEnum.COURSE);
          } else {
            alertContext.show("Course published failed.", AlertVariant.DANGER);
          }
        })
        .catch(err => {
          alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
        });
    } else {
      alertContext.show("No couse is selected", AlertVariant.DANGER);
    }
  };

  let flashErrors;
  if (courseErrors.length) {
    flashErrors = <Flash variant={AlertVariant.DANGER} errors={courseErrors} />;
  }

  const courseForm = (
    <form onSubmit={handleCourseFormSubmit}>
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
          value={headline}
          placeholder="A brief headline"
          onChange={e => setHeadline(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Course description</label>
        <RichTextEditor
          className="rich-text-editor"
          toolbarConfig={RTE_TOOLBAR_CONFIG}
          value={description}
          onChange={val => setDescription(val)}
          placeholder="Enter a description"
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
          required
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
          required
        >
          <option key={0} value="0" disabled>
            -- Select subcategory --
          </option>
          {subCategoryOptions}
        </select>
      </div>

      <div className="form-group">
        <label>Objectives: What will students learn in this course</label>
        <div>
          {displayObjectives()}
          <div className="btn btn-outline-dark" onClick={addNewObjective}>
            <FontAwesomeIcon icon="plus-circle" />
            <span className="ml-2">Add an answer</span>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label>
          Requirements: Are there any course requirements or prerequisities?
        </label>
        <div>
          {displayRequirements()}
          <div className="btn btn-outline-dark" onClick={addNewRequirement}>
            <FontAwesomeIcon icon="plus-circle" />
            <span className="ml-2">Add an answer</span>
          </div>
        </div>
      </div>
      <div className="form-group action-btn-group">
        <button
          className="btn btn-danger action-btn"
          onClick={() => props.history.push(ADMIN_COURSES_URL)}
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
  );

  const chapterForm = props.course ? (
    <ChapterForm course={props.course} />
  ) : null;
  const formTitle = props.course ? "Edit Course" : "Create New Course";

  let formContainer = <Spinner size="3x" />;
  if (isLoaded) {
    formContainer = (
      <div>
        <h4>{formTitle}</h4>
        <nav className="nav nav-pills flex-column flex-sm-row my-3">
          <button
            className={`btn btn-outline-primary mr-sm-2 flex-sm-fill text-sm-center nav-link ${
              activePill === PillEnum.COURSE ? "active" : ""
            }`}
            onClick={() => setActivePill(PillEnum.COURSE)}
          >
            Basic Info
          </button>
          <button
            className={`btn btn-outline-primary mt-2 mt-sm-0 mr-sm-2 flex-sm-fill text-sm-center nav-link ${
              activePill === PillEnum.CHAPTER ? "active" : ""
            }`}
            disabled={props.course == null ? true : false}
            onClick={() => setActivePill(PillEnum.CHAPTER)}
          >
            Course Contents
          </button>
          <button
            className={`btn btn-outline-primary mt-2 mt-sm-0 flex-sm-fill text-sm-center nav-link ${
              activePill === PillEnum.PUBLISH ? "active" : ""
            }`}
            disabled={props.course == null ? true : false}
            onClick={() => setActivePill(PillEnum.PUBLISH)}
          >
            Publish
          </button>
        </nav>
        <div className="tab-content">
          <div
            id="courseContent"
            className={`tab-pane ${
              activePill === PillEnum.COURSE ? "active" : ""
            }`}
          >
            {courseForm}
          </div>
          <div
            id="courseChapter"
            className={`tab-pane ${
              activePill === PillEnum.CHAPTER ? "active" : ""
            }`}
          >
            {chapterForm}
          </div>
          <div
            id="coursePublish"
            className={`tab-pane ${
              activePill === PillEnum.PUBLISH ? "active" : ""
            }`}
          >
            <div className="course-publish border p-3 d-flex justify-content-center">
              <div className="form-group ">
                <label>Do you want to publish the course</label>
                <div className="action-btn-group">
                  <button
                    type="button"
                    className="btn btn-danger action-btn"
                    onClick={() => setActivePill(PillEnum.COURSE)}
                  >
                    <FontAwesomeIcon icon="times" className="mr-2" />
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary action-btn"
                    onClick={publishCourse}
                  >
                    <FontAwesomeIcon icon="check" className="mr-2" />
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <React.Fragment>{formContainer}</React.Fragment>;
};
export default withRouter(CourseForm);
