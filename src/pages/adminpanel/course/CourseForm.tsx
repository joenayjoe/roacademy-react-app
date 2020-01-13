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
        objectives: objectives,
        requirements: requirements,
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
            <Editor
              apiKey="9ugo4yh8kkd85lktdm9mbxj7lmc8sjnbmc8vqaaaikocd4zy"
              value={description}
              init={{
                height: 300,
                menubar: false,
                plugins: ["advlist autolink lists link "],
                toolbar:
                  "formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | undo redo | help"
              }}
              onChange={e => setDescription(e.target.getContent())}
            />
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
            <label>Objectives [One in a line]</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="[One in a line] What will students learn from this course? "
              value={objectives.join("\n")}
              onChange={e => setObjectives(e.target.value.split(/\n/))}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Requirements [One in a line]</label>
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
              onClick={props.cancelHandler}
            >
              <FontAwesomeIcon icon="times" className="pr-1" />
              Cancel
            </button>
            <button className="btn btn-primary action-btn" type="submit">
              <FontAwesomeIcon icon="save" className="pr-1" />
              {props.courseId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    );
  }
  return <React.Fragment>{courseForm}</React.Fragment>;
};
export default CourseForm;
