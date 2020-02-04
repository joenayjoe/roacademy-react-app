import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ICourse, AlertVariant } from "../../../settings/DataTypes";
import CourseForm from "./CourseForm";
import { CourseService } from "../../../services/CourseService";
import {
  ADMIN_COURSES_URL,
  ADMIN_COURSE_STATUS
} from "../../../settings/Constants";
import { AlertContext } from "../../../contexts/AlertContext";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";

interface MatchProp {
  course_id: string;
}
interface IProp extends RouteComponentProps<MatchProp> {}
const EditCourse: React.FunctionComponent<IProp> = props => {
  const courseId = props.match.params.course_id;
  const courseService = new CourseService();

  const alertContext = useContext(AlertContext);

  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    courseService
      .getCourse(+courseId, ADMIN_COURSE_STATUS)
      .then(resp => {
        setCourse(resp.data);
      })
      .catch(err => {
        alertContext.show("Course not found", AlertVariant.DANGER);
        props.history.push(ADMIN_COURSES_URL);
      });
    // eslint-disable-next-line
  }, []);

  return course ? (
    <div className="width-75">
      <Breadcrumb className="bg-transparent">
        <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
        <BreadcrumbItem active>{course.name}</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm course={course} />
    </div>
  ) : null;
};
export default withRouter(EditCourse);
