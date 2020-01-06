import React, { useState, useEffect } from "react";

import "./Course.css";
import { RouteComponentProps } from "react-router";
import { ICourse } from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import Spinner from "../../components/spinner/Spinner";
import CourseDetail from "./CourseDetail";

interface matchedParams {
  course_id: string;
}
interface IProps extends RouteComponentProps<matchedParams> {}

const Course: React.FunctionComponent<IProps> = props => {
  const courseId: string = props.match.params.course_id;
  const courseService = new CourseService();

  const [course, setCourse] = useState<ICourse | null>(null);

  useEffect(() => {
    courseService.getCourse(courseId).then(response => {
      setCourse(response.data);
    });
    // eslint-disable-next-line
  }, []);

  let courseContainerItems: JSX.Element = <Spinner size="3x" />;
  if (course) {
    courseContainerItems = <CourseDetail course={course} />;
  }
  return <div className="course-container full-width">{courseContainerItems}</div>;
};

export default Course;
