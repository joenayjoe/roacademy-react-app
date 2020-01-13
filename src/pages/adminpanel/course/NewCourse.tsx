import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import {
  ADMIN_COURSES_URL,
  ADMIN_PANEL_URL,
  BUILD_ADMIN_COURSE_URL
} from "../../../settings/Constants";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import { INewCourse } from "../../../settings/DataTypes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CourseService } from "../../../services/CourseService";
import { parseError } from "../../../utils/errorParser";
import CourseForm from "./CourseForm";

interface IProp extends RouteComponentProps {}

const NewCourse: React.FunctionComponent<IProp> = props => {
  const courseService = new CourseService();

  const [errors, setErrors] = useState<string[]>([]);

  const handleFormSubmit = (formData: INewCourse) => {
    courseService
      .createCourse(formData)
      .then(resp => {
        props.history.push(BUILD_ADMIN_COURSE_URL(resp.data.id));
      })
      .catch(err => {
        setErrors(parseError(err));
      });
  };

  return (
    <div className="new-course width-75">
      <Breadcrumb>
        <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
        <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
        <BreadcrumbItem active>New Course</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm
        submitHandler={() => handleFormSubmit}
        cancelHandler={() => props.history.push(ADMIN_COURSES_URL)}
        errors={errors}
      />
    </div>
  );
};
export default withRouter(NewCourse);
