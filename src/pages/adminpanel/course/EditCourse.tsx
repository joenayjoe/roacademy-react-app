import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ICourse, AlertVariant } from "../../../settings/DataTypes";
import CourseForm from "../../../components/form/CourseForm";
import { CourseService } from "../../../services/CourseService";
import {
  ADMIN_COURSES_URL,
  ADMIN_COURSE_STATUS,
  BUILD_ADMIN_EDIT_COURSE_URL,
} from "../../../settings/Constants";
import { AlertContext } from "../../../contexts/AlertContext";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import { parseError } from "../../../utils/errorParser";

interface MatchProp {
  course_id: string;
}
interface IProp extends RouteComponentProps<MatchProp> {}
const EditCourse: React.FunctionComponent<IProp> = (props) => {
  const courseId = props.match.params.course_id;
  const courseService = new CourseService();

  const alertContext = useContext(AlertContext);

  const [course, setCourse] = useState<ICourse | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    courseService
      .getCourse(+courseId, ADMIN_COURSE_STATUS)
      .then((resp) => {
        setCourse(resp.data);
      })
      .catch((err) => {
        alertContext.show(
          "Failed to load course: ",
          AlertVariant.DANGER,
          parseError(err)
        );
        props.history.push(ADMIN_COURSES_URL);
      });
    // eslint-disable-next-line
  }, []);

  const handleEditCourseFormSubmit = (formData: FormData) => {
    courseService
      .updateCourse(+courseId, formData)
      .then((resp) => {
        setErrors([]);
        props.history.push(BUILD_ADMIN_EDIT_COURSE_URL(resp.data.id));
        alertContext.show("Course edited successfully");
      })
      .catch((err) => {
        setErrors(parseError(err));
      });
  };

  return course ? (
    <div className="width-75">
      <Breadcrumb className="bg-transparent">
        <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
        <BreadcrumbItem active>{course.name}</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm
        course={course}
        formSubmitHandler={handleEditCourseFormSubmit}
        formCancelHandler={() => props.history.push(ADMIN_COURSES_URL)}
        errors={errors}
      />
    </div>
  ) : null;
};
export default withRouter(EditCourse);
