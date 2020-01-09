import React, { useState, useEffect } from "react";

import "./Course.css";
import { RouteComponentProps } from "react-router";
import { ICourse } from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import Spinner from "../../components/spinner/Spinner";
import CourseDetail from "./CourseDetail";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import { BUILD_CATEGORY_URL, BUILD_GRADE_URL } from "../../settings/Constants";

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
    courseContainerItems = (
      <React.Fragment>
        <Breadcrumb className="width-75 bg-transparent">
          <BreadcrumbItem href={BUILD_CATEGORY_URL(course.primaryCategory.id)}>
            {course.primaryCategory.name}
          </BreadcrumbItem>
          <BreadcrumbItem href={BUILD_GRADE_URL(course.primaryGrade.id)}>
            {course.primaryGrade.name}
          </BreadcrumbItem>
          <BreadcrumbItem active>{course.name}</BreadcrumbItem>
        </Breadcrumb>
        <CourseDetail course={course} />
      </React.Fragment>
    );
  }
  return (
    <div className="course-container full-width">{courseContainerItems}</div>
  );
};

export default Course;
