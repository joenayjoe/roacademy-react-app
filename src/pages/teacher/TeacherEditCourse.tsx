import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { CourseService } from "../../services/CourseService";
import { AlertContext } from "../../contexts/AlertContext";
import { AlertVariant, ICourse, RoleType } from "../../settings/DataTypes";
import {
  HOME_URL,
  TEACHER_DASHBOARD_URL,
  ADMIN_COURSE_STATUS,
  BUILD_TEACHER_EDIT_COURSE_URL,
} from "../../settings/Constants";
import { parseError } from "../../utils/errorParser";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import CourseForm from "../../components/form/CourseForm";

interface MatchProp {
  course_id: string;
}
interface IProp extends RouteComponentProps<MatchProp> {}
const TeacherEditCourse: React.FunctionComponent<IProp> = (props) => {
  const courseId = props.match.params.course_id;
  const courseService = new CourseService();

  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const [course, setCourse] = useState<ICourse | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (authContext.hasRole(RoleType.TEACHER)) {
      courseService
        .getCourse(+courseId, ADMIN_COURSE_STATUS)
        .then((resp) => {
          setCourse(resp.data);
        })
        .catch((err) => {
          alertContext.show(
            "Fail to load course: ",
            AlertVariant.DANGER,
            parseError(err)
          );
          props.history.push(TEACHER_DASHBOARD_URL);
        });
    } else {
      alertContext.show("Access denied !", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    }
    // eslint-disable-next-line
  }, []);

  const handleEditCourseFormSubmit = (formData: FormData) => {
    if (authContext.currentUser && authContext.hasRole(RoleType.TEACHER)) {
      courseService
        .updateCourse(+courseId, formData)
        .then((resp) => {
          setErrors([]);
          alertContext.show("Course edited successfully");
          props.history.push(
            BUILD_TEACHER_EDIT_COURSE_URL(
              authContext.currentUser!.id,
              resp.data.id
            )
          );
        })
        .catch((err) => {
          setErrors(parseError(err));
        });
    } else {
      alertContext.show("Access denied!", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    }
  };

  return course ? (
    <div className="width-75">
      <Breadcrumb className="bg-transparent">
        <BreadcrumbItem href={TEACHER_DASHBOARD_URL}>
          Teacher Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem active>{course.name}</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm
        course={course}
        formSubmitHandler={handleEditCourseFormSubmit}
        formCancelHandler={() => props.history.push(TEACHER_DASHBOARD_URL)}
        errors={errors}
      />
    </div>
  ) : null;
};
export default TeacherEditCourse;
