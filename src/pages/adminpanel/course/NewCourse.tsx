import React, { useState, useContext } from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import {
  ADMIN_COURSES_URL,
  ADMIN_PANEL_URL,
  BUILD_ADMIN_EDIT_COURSE_URL,
} from "../../../settings/Constants";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import CourseForm from "../../../components/form/CourseForm";
import { CourseService } from "../../../services/CourseService";
import { RouteComponentProps } from "react-router-dom";
import { AlertContext } from "../../../contexts/AlertContext";
import { parseError } from "../../../utils/errorParser";

interface IProp extends RouteComponentProps {}

const NewCourse: React.FunctionComponent<IProp> = (props) => {
  const courseService = new CourseService();
  const alertContext = useContext(AlertContext);

  const [errors, setErrors] = useState<string[]>([]);

  const handleNewCourseFormSubmit = (formData: FormData) => {
    courseService
      .createCourse(formData)
      .then((resp) => {
        setErrors([]);
        props.history.push(BUILD_ADMIN_EDIT_COURSE_URL(resp.data.id));
        alertContext.show("Course created successfully");
      })
      .catch((err) => {
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
        formSubmitHandler={handleNewCourseFormSubmit}
        formCancelHandler={() => props.history.push(ADMIN_COURSES_URL)}
        errors={errors}
      />
    </div>
  );
};
export default NewCourse;
